<template>
  <v-list-item>
    <track-img
      :size="32"
      :size-btn="25"
      :picture="item.picture"
      :slug="item.slug"
      class="mr-4"
      v-if="item.picture"
      v-on:select="onClick(item)"
    ></track-img>

    <v-list-item-title
      class="font-weight-medium"
      v-html="item.name"
      @click="onClick(item)"
    >
    </v-list-item-title>
    <v-list-item-title class="grey--text" style="max-width: 320px">
      {{ item.city.name }},
      <nuxt-link
        class="track-list__item_link"
        :to="`/radio/${item.country.slug}`"
      >
        {{ item.country.name }}
      </nuxt-link>
    </v-list-item-title>
    <v-list-item-title class="grey--text">
      <template v-for="(genre, i) in item.genres">
        <nuxt-link
          class="track-list__item_link"
          :to="`/radio/genre/${genre.slug}`"
          v-text="genre.name"
          :key="genre.slug"
        >
        </nuxt-link>
        <span :key="i" v-if="i < item.genres.length - 1" class="ml-n1 mr-1"
          >•</span
        >
      </template>
    </v-list-item-title>
    <v-list-item-action class="text-right">
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn icon color="grey" class="ml-4" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list tile class="py-0">
          <v-list-item nuxt-link :to="`/radio/radio-station/${item.slug}`">
            <v-list-item-title>Go to radio page</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
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
    TrackImg
  },

  methods: {
    onClick(item) {
      this.$store.dispatch(`player/setCurrentTrack`, item.slug);
    }
  }
};
</script>
