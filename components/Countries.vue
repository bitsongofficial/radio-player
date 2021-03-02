<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="6" md="2" class="py-0" v-for="i in countries" :key="i.slug">
        <v-alert colored-border :color="createRandomColor()" border="left">
          <nuxt-link :to="`/radio/${i.slug}`">
            <span
              :class="isDarkTheme ? 'white--text' : 'black--text'"
              class="w-100 fill-height text-truncate white--text font-weight-medium"
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
  data() {
    return {
      countries: [],
    };
  },
  async created() {
    try {
      this.countries = await this.$api.getCountries();
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    isDarkTheme() {
      return this.$store.getters[`app/dark_theme`];
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
#countries .v-alert__content::first-letter {
  text-transform: uppercase !important;
  font-size: 16px !important;
}

#countries {
  align-content: space-between;
}

#countries a.span {
  color: #fff !important;
}
</style>
