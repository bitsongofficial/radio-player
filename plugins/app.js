import Api from "@/lib/api";

export default async (ctx, inject) => {
  // set theme
  ctx.$vuetify.theme.dark = ctx.store.getters[`app/dark_theme`];

  // inject api lib
  const api = new Api(process.env.API);
  inject("api", api);
  ctx.$api = api;
};
