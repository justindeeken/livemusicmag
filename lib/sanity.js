import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'puksfwtn',  // replace this with your actual Sanity project ID
  dataset: 'production',
  apiVersion: '2023-07-10',
  useCdn: true,
})
