import {defineConfig, createAuthStore} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'adapt-demo',

  projectId: 'skmdu5gt',
  dataset: 'ssotest',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
  // auth: {
  //   redirectOnSingle: false,
  //   mode: 'append',
  //   providers: [
  //     {
  //       name: 'Kinde',
  //       title: 'Kinde',
  //       //url: 'https://tormod-api.pages.dev/login',
  //       url: 'http://localhost:5173/login',
  //     },
  //   ],
  //   loginMethod: 'dual',
  // },

  auth: createAuthStore({
    projectId: 'skmdu5gt', // replace with your project id
    dataset: 'ssotest', // replace with your dataset name
    redirectOnSingle: false,
    mode: 'append', // Use ‘replace’ if you only want this login provider
    providers: [
      {
        name: 'saml',
        title: 'SAML Login',
        url: 'https://api.sanity.io/v2021-10-01/auth/saml/login/a0b60edf',
      },
    ],
    loginMethod: 'dual',
  }),
})
