<template>
  <div>
    <player-loading v-if="loading"></player-loading>
    <v-btn
      icon
      v-else
      @click.stop="onBtnClick"
      :class="{
        'mx-3': $vuetify.breakpoint.mdAndUp,
        'mx-1': $vuetify.breakpoint.smAndDown
      }"
    >
      <v-icon v-if="playing" :size="size">mdi-pause</v-icon>
      <v-icon v-else :size="size" :disabled="currentTrack === null">
        mdi-play
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PlayerLoading from "@/components/Player/Loading";

export default {
  props: {
    size: {
      type: [String, Number],
      default: "40"
    }
  },

  components: {
    PlayerLoading
  },

  methods: {
    ...mapActions({
      play: 'player/play',
      pause: 'player/pause'
    }),
    onBtnClick() {
      if (!this.playing) {
        this.onPlay();
      } else {
        this.onPause();
      }
    },
    onPlay() {
      console.log("--- play ---");
      this.play();
    },
    onPause() {
      console.log("--- pause ---");
      this.pause();
    }
  },

  computed: {
    ...mapGetters({
      loading: 'player/loading',
      currentTrack: 'player/currentTrack',
      playing: 'player/playing'
    })
  }
};
</script>
