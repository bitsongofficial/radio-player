import Api from '@/lib/api'
import Btsg from '@/lib/btsg'
import { BitSongClient } from "@bitsongofficial/js-sdk"

export default async (ctx, inject) => {
  // set theme
  ctx.$vuetify.theme.dark = ctx.store.getters[`app/dark_theme`]

  const btsg = new Btsg(process.env.LCD)
  inject('btsg', btsg)
  ctx.$btsg = btsg

  // inject api lib
  const api = new Api(process.env.API)
  inject('api', api)
  ctx.$api = api

  // Init Bitsong Client
  const client = new BitSongClient(
    process.env.LCD,
    process.env.ADDRESS_PREFIX,
    process.env.HD_PATH
  )
  inject('client', client)
  ctx.$client = client

  // set mode to block
  client.setMode("block")
  // init chain
  await client.initChain()

  // get validator set
  await ctx.app.store.dispatch(`staking/getValidators`)

  // set account
  if (ctx.app.store.getters['wallet/address'] !== null) {
    try {
      await client.setAccountInfo(ctx.app.store.getters['wallet/address'])

      await ctx.app.store.dispatch(`bank/updateBalance`)
      ctx.app.store.dispatch(`bank/subscribe`)

      await ctx.app.store.dispatch(`staking/getDelegations`)
    } catch (e) {
      console.error(e)
    }
  }

};
