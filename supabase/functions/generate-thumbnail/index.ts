
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate image using DALL-E
    const prompt = `Create a minimalist, professional thumbnail for a website with the URL ${website}. The image should be modern, clean, and suitable for a tech project showcase.`
    
    const dallEResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!dallEResponse.ok) {
      const error = await dallEResponse.json()
      throw new Error(`DALL-E API error: ${error.error?.message || 'Unknown error'}`)
    }

    const imageData = await dallEResponse.json()
    const imageUrl = imageData.data[0].url

    // Download the image from DALL-E
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()

    // Generate unique filename
    const filename = `${crypto.randomUUID()}.png`
    const filePath = `thumbnails/${filename}`

    // Upload image to Supabase Storage
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
