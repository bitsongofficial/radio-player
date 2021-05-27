<template>
  <v-flex>
    <unbonded-tokens />
    <staked-tokens />
    <available-validators />
  </v-flex>
</template>

<script>
import StakedTokens from "@/components/Wallet/Staking/StakedTokens";
import AvailableValidators from "@/components/Wallet/Staking/AvailableValidators";
import UnbondedTokens from "@/components/Wallet/Staking/UnbondedTokens";

export default {
  components: {
    StakedTokens,
    AvailableValidators,
    UnbondedTokens
  },

  created() {
    this.$store.dispatch(`staking/getDelegations`);
  }
};
</script>
