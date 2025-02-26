
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
    const urlboxApiKey = Deno.env.get('URLBOX_API_KEY') ?? ''
    const urlboxApiSecret = Deno.env.get('URLBOX_API_SECRET') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate screenshot URL using URLbox
    const format = 'png'
    const options = {
      url: website,
      width: 1200,
      height: 630,
      format,
      force: true,
      full_page: false,
      wait_for: 1000, // wait for 1s after page load
    }

    const queryString = new URLSearchParams({
      url: options.url,
      width: options.width.toString(),
      height: options.height.toString(),
      format: options.format,
      force: options.force.toString(),
      full_page: options.full_page.toString(),
      wait_for: options.wait_for.toString(),
    }).toString()

    const screenshotUrl = `https://api.urlbox.io/v1/${urlboxApiKey}/${btoa(queryString)}`

    // Download the screenshot
    const imageResponse = await fetch(screenshotUrl, {
      headers: {
        'Authorization': `Bearer ${urlboxApiSecret}`
      }
    })

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
