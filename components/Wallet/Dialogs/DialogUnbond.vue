<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <staking-unbond
      v-model="value"
      v-on:cancel="$emit('cancel')"
      v-on:tx-success="$emit('tx-success')"
    ></staking-unbond>
  </v-dialog>
</template>

<script>
import StakingUnbond from "@/components/Wallet/Staking/Unbond";

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  components: {
    StakingUnbond
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
