<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <distribution-withdraw
      v-model="value"
      v-on:cancel="$emit('cancel')"
    ></distribution-withdraw>
  </v-dialog>
</template>

<script>
import DistributionWithdraw from "@/components/Wallet/Distribution/Withdraw";

export default {
  props: {
    value: {
      type: Array,
      required: true
    }
  },

  components: {
    DistributionWithdraw
  }
};
</script>
