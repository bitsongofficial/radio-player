<template>
  <v-list-item-icon>
    <v-btn icon @click="onDestroy">
      <v-icon v-if="$vuetify.breakpoint.mdAndUp" size="30">mdi-close</v-icon>
      <v-icon v-else size="30">mdi-stop</v-icon>
    </v-btn>
  </v-list-item-icon>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions({
      destroy: 'player/destroy'
    }),
    onDestroy() {
      console.log("--- destroy ---");
      this.destroy();
    },
  },
};
</script>
