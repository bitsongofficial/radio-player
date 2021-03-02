<template>
  <v-list-item class="mb-3 mx-0 px-0">
    <v-card class="w-full">
      <v-container class="pa-7" fluid>
        <v-layout row wrap grid-list justify-space-around>
          <v-flex xs1 align-self-center>
            <v-img
              height="30"
              width="30"
              src="/bitsong_logo_circle_red.svg"
            ></v-img>
          </v-flex>
          <v-flex xs3 align-self-center>
            <amount
                style="font-size: 1.3em;"
                class="my-auto"
                :micro-amount="coin.amount"
                :denom="coin.denom"
            />
          </v-flex>
          <v-flex xs3 align-self-center>
            <amount
                style="font-size: 1.3em"
                :micro-amount="price * coin.amount"
                denom="USD"
            />
            <!--  <div>
                <amount
                v-if="token.balance !== null"
                :micro-amount="allocationMoneyValue"
                :deciamlsNumber="2"
                style="font-size: 0.9em"
                class="grey--text text--darken-1 caption"
                denom="USD"
                />
            </div>-->
          </v-flex>
          <v-flex xs3 align-self-center>
            <v-progress-linear
                color="green"
                height="6"
                class="my-auto bar-rounded mb-1"
                :value="100"
            />
            <div class="text-center">
                100%
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-list-item>
</template>

<script>
import Amount from "@/components/Wallet/Common/Amount.vue";
/*
    TODO: After changin coingeko api call, we can retrive all price of token with single call
    (parent component)
    TODO: Fix Price display value
*/
export default {
  components: {
    Amount
  },
  props: {
    coin: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      price: 0
    };
  },
  computed: {
    decimals() {
      return this.$store.getters["app/decimals"];
    }
    // percentage () {
    //   return pergentageOf(this.token.allocated, this.token.balance.amount)
    // },
    // allocationMoneyValue () {
    //   // TODO: Check if conversion is right with real values
    //   const total = parseInt(this.token.allocation_earn)* convertMicroToMacroAmount(this.price, this.decimals - 2)
    //   return convertMicroToMacroAmount(total, this.decimals - 2)
    // }
  },
  async created() {
    await this.getUsdPrice();
  },
  methods: {
    async getUsdPrice() {
      try {
        const response = await this.$api.getTokenUsdPrice("bitsong", "usd");
        // Access pragmatically token name from geko api response
        this.price = response["bitsong"].usd;
      } catch (e) {
        console.log(`Cannot fetch price of this token: btsg`);
      }
    }
  }
};
</script>

<style>
.w-full {
  width: 100%;
}
.bar-rounded {
  border-radius: 5px;
}
</style>
