<template>
  <v-flex class="px-0 mx-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-list color="transparent" v-if="coins.length">
          <template v-for="(coin, i) in coins">
            <coin-list-item-desktop
              :key="i" :coin="coin"
              v-if="$vuetify.breakpoint.mdAndUp"
            />
            <coin-list-item-mobile
              v-else
              :key="i" :coin="coin"
            />
          </template>
        </v-list>
        <div v-else class="text-center font-weight-bold">
          No balance
        </div>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
import CoinListItemDesktop from "@/components/Wallet/Bank/CoinListItemDesktop";
import CoinListItemMobile from "@/components/Wallet/Bank/CoinListItemMobile";

export default {
  components: {
    CoinListItemDesktop,
    CoinListItemMobile
  },

  computed: {
    coins() {
      return this.$store.getters["bank/coins"];
    }
  }
};
</script>
