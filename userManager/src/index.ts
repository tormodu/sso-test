import {definePlugin} from 'sanity'

interface MyPluginConfig {
  /* nothing here yet */
}

export const myPlugin = definePlugin<MyPluginConfig | void>((config = {}) => {
  // eslint-disable-next-line no-console
  console.log('hello from sanity-plugin-userManager')
  return {
    name: 'sanity-plugin-userManager',
  }
})
