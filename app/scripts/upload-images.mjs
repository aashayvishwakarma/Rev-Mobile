import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  'https://avnxqznlshmwdtuqmees.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bnhxem5sc2htd2R0dXFtZWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDgyMTAsImV4cCI6MjA5MzMyNDIxMH0.Cg8EpzfMOcIsK5e1KhaZBmfYWXwsNMQ-7rKXrnzvCh4'
)

const BUCKET = 'car-images'
const ASSETS = join(__dirname, '../src/assets')
const BASE_URL = `https://avnxqznlshmwdtuqmees.supabase.co/storage/v1/object/public/${BUCKET}`

const images = [
  { file: 'porche-911-gt3.jpg',   make: 'Porsche',     model: '911 GT3' },
  { file: 'bmw m4 comp.jpg',      make: 'BMW',          model: 'M4 Competition' },
  { file: 'McLaren 720s.jpg',     make: 'McLaren',      model: '720S' },
  { file: 'range rover sport.jpg',make: 'Land Rover',   model: 'Range Rover Sport' },
]

async function run() {
  console.log(`Using bucket "${BUCKET}"...`)

  for (const { file, make, model } of images) {
    const filePath = join(ASSETS, file)
    const fileData = readFileSync(filePath)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(file, fileData, { contentType: 'image/jpeg', upsert: true })

    if (uploadError) {
      console.error(`Upload failed for ${file}:`, uploadError.message)
      continue
    }

    const publicUrl = `${BASE_URL}/${encodeURIComponent(file)}`

    // Update the cars table
    const { error: updateError } = await supabase
      .from('cars')
      .update({ image_url: publicUrl })
      .eq('make', make)
      .eq('model', model)

    if (updateError) {
      console.error(`DB update failed for ${make} ${model}:`, updateError.message)
    } else {
      console.log(`✓ ${make} ${model} → ${publicUrl}`)
    }
  }

  console.log('Done!')
}

run()
