import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {visionTool} from '@sanity/vision'

export default defineConfig({
  name: 'default',
  title: 'ecommerce',

  projectId: 'evqpryaj',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
