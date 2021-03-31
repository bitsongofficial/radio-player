<template>
  <v-card
    flat
    tile
    class="ma-3 track-grid__item"
    :max-width="size"
    :min-width="size"
    :min-height="size"
    :width="$vuetify.breakpoint.mdAndUp ? '225px' : '290px'"
    color="transparent"
  >
    <track-img
      :picture="item.picture"
      :slug="item.slug"
      v-on:select="onClick(item)"
    ></track-img>

    <div class="pt-2 track-grid__item_title">
      <router-link
        nuxt
        :to="`/radio/radio-station/${item.slug}`"
        class="font-weight-medium"
        >{{ item.name }}</router-link
      >
    </div>
    <div class="text-wrap track-grid__item_subtitle">
      {{ item.city.name }},
      <router-link nuxt :to="`/radio/${item.country.slug}`">{{
        item.country.name
      }}</router-link>
    </div>
  </v-card>
</template>

<style lang="sass">
.track-grid__item a:hover
  text-decoration: underline !important

.theme--light
  .track-grid__item_title a
    color: #000 !important

.theme--dark
  .track-grid__item_title a
    color: #fff !important
  .track-grid__item_subtitle a
    color: rgba(255, 255, 255, 0.7)

.track-grid__item_subtitle
  line-height: 1.5 !important
  font-size: 0.875rem
  color: rgba(255, 255, 255, 0.7)
</style>

<script>
import PlayerBtnPlay from "@/components/Player/BtnPlay";
import TrackImg from "@/components/TrackImg";

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  components: {
    PlayerBtnPlay,
    TrackImg
  },

  methods: {
    onClick(item) {
      this.$store.dispatch(`player/setCurrentTrack`, item.slug);
    }
  },
  computed: {
    size() {
      return this.$vuetify.breakpoint.mdAndUp ? 205 : 130;
    },
    currentTrack() {
      return this.$store.getters["player/currentTrack"];
    },
    isPlaying() {
      return this.$store.getters["player/playing"];
    },
    isLoading() {
      return this.$store.getters["player/loading"];
    }
  }
};
</script>
