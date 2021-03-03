<template>
  <v-list-item-content>
    <v-list-item-title v-text="title"></v-list-item-title>
    <v-list-item-subtitle v-text="subtitle"></v-list-item-subtitle>
  </v-list-item-content>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      currentTrack: 'player/currentTrack'
    }),
    title() {
      return this.currentTrack ? this.currentTrack.title : "";
    },
    subtitle() {
      return this.currentTrack ? this.currentTrack.subtitle : "";
    },
  },
};
</script>
