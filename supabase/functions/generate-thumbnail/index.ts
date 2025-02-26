
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { website } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const screenshotMachineKey = Deno.env.get('SCREENSHOT_MACHINE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate screenshot URL using Screenshot Machine
    const screenshotParams = new URLSearchParams({
      key: screenshotMachineKey,
      url: website,
      dimension: '1200x630',
      format: 'png',
      cacheLimit: '0',
      delay: '2000'
    })

    const screenshotUrl = `https://api.screenshotmachine.com?${screenshotParams}`

    // Download the screenshot
    const imageResponse = await fetch(screenshotUrl)

    if (!imageResponse.ok) {
      throw new Error(`Failed to generate screenshot: ${imageResponse.statusText}`)
    }

    const imageBlob = await imageResponse.blob()

    // Generate unique filename
    const filename = `${crypto.randomUUID()}.png`
    const filePath = `thumbnails/${filename}`

    // Upload screenshot to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-thumbnails')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Failed to upload thumbnail: ${uploadError.message}`)
    }

    // Get public URL for the uploaded file
    const { data: publicUrl } = supabase.storage
      .from('project-thumbnails')
      .getPublicUrl(filePath)

    return new Response(
      JSON.stringify({ thumbnailUrl: publicUrl.publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
