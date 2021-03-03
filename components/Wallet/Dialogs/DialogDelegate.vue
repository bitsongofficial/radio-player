<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <staking-delegate
      v-model="value"
      v-on:cancel="$emit('cancel')"
    ></staking-delegate>
  </v-dialog>
</template>

<script>
import StakingDelegate from "@/components/Wallet/Staking/Delegate";

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  components: {
    StakingDelegate
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
