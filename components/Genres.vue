<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="6" md="2" class="py-0" v-for="i in items" :key="i.slug">
        <v-alert colored-border :color="createRandomColor()" border="left">
          <nuxt-link :to="`/radio/genre/${i.slug}`">
            <span
              :class="isDarkTheme ? 'white--text' : 'black--text'"
              class="w-100 fill-height text-truncate font-weight-medium"
              >{{ i.name }}</span
            >
          </nuxt-link>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
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

<style>
#genres .v-alert__content::first-letter {
  text-transform: uppercase !important;
  font-size: 16px !important;
}

#genres {
  align-content: space-between;
}

#genres a.span {
  color: #fff !important;
}
</style>
