<template>
  <v-img
    :gradient="
      currentTrack !== null && currentTrack.source === streamUrl
        ? 'to bottom, rgba(0,0,0,.2), rgba(0,0,0,.6)'
        : ''
    "
    :max-width="size"
    :max-height="size"
    :src="picture"
    style="border-radius: 6px !important"
    @click.stop="onClick"
  >
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="currentTrack !== null && currentTrack.source === streamUrl"
    >
      <player-btn-play :size="sizeBtn"></player-btn-play>
    </v-row>
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        ></v-progress-circular>
      </v-row>
    </template>
  </v-img>
</template>

<script>
import { mapGetters } from 'vuex';
import PlayerBtnPlay from "@/components/Player/BtnPlay";

export default {
  props: {
    picture: {
      type: String,
      default: "",
    },
    streamUrl: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default() {
        return this.$vuetify.breakpoint.mdAndUp ? 205 : 150;
      },
    },
    sizeBtn: {
      type: [String, Number],
      default: "60",
    },
  },

  components: {
    PlayerBtnPlay,
  },

  methods: {
    onClick() {
      this.$emit("select");
    },
  },
  computed: {
    ...mapGetters({
      currentTrack: 'player/currentTrack'
    })
  },
};
</script>
