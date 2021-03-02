<template>
  <v-row justify="space-around">
    <v-col cols="12" class="pt-0 mb-4">
      <v-chip-group mandatory>
        <!-- <v-chip
          class="subtitle-1 px-6font-weight-medium"
          outlined
          :large="$vuetify.breakpoint.mdAndUp"
          exact
          exact-active-class="white--text font-weight-bold"
          nuxt-link
          to="/radio/near-you"
          :color="createRandomColor()"
          >Near you</v-chip
        > -->
        <v-chip
          class="subtitle-1 px-6 font-weight-medium"
          :outlined="isDarkTheme"
          :large="$vuetify.breakpoint.mdAndUp"
          :color="createRandomColor()"
          to="/radio/genre"
          exact
          exact-active-class="white--text font-weight-bold"
          >Genre</v-chip
        >
        <v-chip
          class="subtitle-1 px-6 font-weight-medium"
          :outlined="isDarkTheme"
          :large="$vuetify.breakpoint.mdAndUp"
          to="/radio/by-location"
          exact
          exact-active-class="white--text font-weight-bold"
          :color="createRandomColor()"
          >Location</v-chip
        >
      </v-chip-group>
    </v-col>
  </v-row>
</template>

<script>
export default {
  computed: {
    isDarkTheme() {
      return this.$store.getters[`app/dark_theme`]
    }
  },
  methods: {
    createRandomColor() {
      return "hsla(" + Math.random() * 360 + ", 70%, 65%, 1)";
    },
  },
};
</script>
