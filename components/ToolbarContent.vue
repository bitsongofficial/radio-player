<template>
  <v-row class="px-2">
    <router-link
      to="/"
      aria-label="BitSong"
      class="d-flex align-center"
      title="BitSong"
    >
      <img
        alt="BitSong"
        min-width="135"
        width="135"
        src="/bitsong_logo_red.svg"
      />
    </router-link>

    <v-spacer />

    <v-btn
      v-if="$vuetify.breakpoint.mdAndUp"
      active-class="no-active"
      class="mr-2"
      href="https://wallet.bitsong.network"
      target="_blank"
      color="primary"
      dark
      >Wallet
      <v-icon right>mdi-open-in-new</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters[`wallet/isLoggedIn`];
    },
  },
};
</script>
