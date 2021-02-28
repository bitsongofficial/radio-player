<template>
  <page-template>
    <page-menu></page-menu>

    <div class="d-flex mb-4">
      <v-btn icon to="/" exact class="ml-n3 mt-3" color="red darken-1">
        <v-icon> mdi-chevron-left </v-icon>
      </v-btn>
      <h2 class="text-h2 mb-1">
        Mood & <span class="red--text text--darken-1">Genres</span>
      </h2>
    </div>

    <genres :items="genres" class="mb-8"></genres>
    <template v-for="(country, index) in countries">
      <track-grid-featured
        :key="index"
        class="mb-8"
        :title="`Top Radio in ${country.country.name}`"
        :items="country.radios"
      >
        <template v-slot:title>
          Top Radio in
          <nuxt-link :to="`/radio/${country.country.slug}`">
            {{ country.country.name }}
          </nuxt-link>
        </template>
      </track-grid-featured>
    </template>
  </page-template>
</template>

<script>
import PageTemplate from "@/components/PageTemplate";
import TrackGridFeatured from "@/components/TrackGridFeatured";
import Genres from "@/components/Genres";
import PageMenu from "@/components/PageMenu";

export default {
  head() {
    const title = `Mood & Genres`;
    return {
      title: title,
      meta: [{ hid: "og-title", name: "og:title", content: title }]
    };
  },

  components: {
    PageTemplate,
    TrackGridFeatured,
    Genres,
    PageMenu
  },

  data() {
    return {
      countries: [],
      genres: []
    };
  },

  async created() {
    const exploreGenres = await this.$api.getExploreGenres()
    this.countries = await this.$api.getExploreCountries()
    this.genres = exploreGenres.map(g => g.genre)
  }
};
</script>
