<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="800"
    :value="true"
  >
    <staking-redelegate v-on:cancel="$emit('cancel')" />
  </v-dialog>
</template>

<script>
import StakingRedelegate from "@/components/Wallet/Staking/Redelegate";

export default {
  components: {
    StakingRedelegate
  },

  computed: {
    address() {
      return this.$store.getters[`wallet/address`];
    }
  },

  data() {
    return {
      loading: false
    };
  }
};
</script>
