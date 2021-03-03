<template>
  <v-list-item-avatar tile>
    <v-avatar tile v-if="cover">
      <img :src="cover" />
    </v-avatar>
    <v-icon v-else color="grey">mdi-radio</v-icon>
  </v-list-item-avatar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      currentTrack: 'player/currentTrack'
    }),
    cover() {
      return this.currentTrack && this.currentTrack.cover !== ""
        ? this.currentTrack.cover
        : null;
    },
  },
};
</script>
