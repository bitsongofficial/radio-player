<template>
  <v-flex>
    <staked-tokens />
    <available-validators />
  </v-flex>
</template>

<script>
import StakedTokens from "@/components/Wallet/Staking/StakedTokens";
import AvailableValidators from "@/components/Wallet/Staking/AvailableValidators";

export default {
  components: {
    StakedTokens,
    AvailableValidators
  },

  created() {
    this.$store.dispatch(`staking/getDelegations`);
  }
};
</script>
