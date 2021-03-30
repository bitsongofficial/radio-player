<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <div class="d-flex flex-row">
            <h6 class="text-h6 mb-1">Your address</h6>
            <v-btn
              target="_blank"
              title="Bitsong explorer"
              :href="`${explorerUrl}/account/${this.address}`"
              class="ml-2"
              small
              icon
            >
              <v-icon>mdi-feature-search-outline</v-icon>
            </v-btn>
          </div>
          <v-container class="pa-0">
            <v-row>
              <v-col md="10" cols="12" class="py-0">
                <markup :content="address"></markup>
              </v-col>
              <v-col md="2" cols="12" class="pt-0">
                <v-flex class="d-flex flex-row flex-md-column">
                  <v-btn icon @click.stop="showAddress = true">
                    <v-icon>mdi-qrcode-scan</v-icon>
                  </v-btn>
                  <v-btn title="Send token" icon @click.stop="onOpenSend">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </v-flex>
              </v-col>
            </v-row>
          </v-container>
          <dialog-wallet-address
            v-if="showAddress"
            v-on:close="onCloseAddress"
          />
        </v-col>
        <v-col cols="12" md="4">
          <h6 class="text-h6">Your balance</h6>
          <amount
            style="font-size: 1.7em"
            :micro-amount="balance.amount"
            :denom="balance.denom"
          />
          <div>
            <span class="grey--text text--darken-1 caption">≈</span>
            <amount
              :micro-amount="currency"
              :deciamlsNumber="2"
              style="font-size: 0.9em"
              class="grey--text text--darken-1 caption"
              denom="USD"
            />
          </div>
        </v-col>
      </v-row>
      <bank-send v-if="showModal" v-on:cancel="onCloseSend" />
    </v-container>
  </v-card>
</template>

<script>
import Markup from "@/components/Wallet/Common/Markup.vue";
import Amount from "@/components/Wallet/Common/Amount.vue";
import DialogWalletAddress from "@/components/Wallet/Dialogs/DialogWalletAddress";
import BankSend from "@/components/Wallet/Bank/Send";
import { convertMicroToMacroAmount } from "@/lib/utils";

export default {
  components: {
    Markup,
    Amount,
    DialogWalletAddress,
    BankSend
  },

  data() {
    return {
      loading: false,
      currency: 0,
      showAddress: false,
      showModal: false
    };
  },

  async created() {
    await this.getCounterValue();
  },

  computed: {
    address() {
      return this.$store.getters["wallet/address"];
    },
    explorerUrl() {
      return process.env.URL_ACCOUNT_EXPLORER;
    },
    decimals() {
      return this.$store.getters["app/decimals"];
    },
    balance() {
      return this.$store.getters["bank/balance"];
    }
  },

  watch: {
    balance() {
      this.getCounterValue();
    }
  },

  methods: {
    async getCounterValue() {
      const response = await this.$api.getTokenUsdPrice("bitsong", "usd");
      if (response !== null) {
        const value =
          response.bitsong.usd *
          parseFloat(convertMicroToMacroAmount(this.balance.amount, 6));
        this.currency = value * 100;
      }
    },
    onShowAddress() {
      this.$store.commit(`wallet/tooglePopup`);
    },
    onOpenSend() {
      this.showModal = true;
    },
    onCloseSend() {
      this.showModal = false;
    },
    onCloseAddress() {
      this.showAddress = false;
    }
  }
};
</script>

<style lang="sass" scoped>
.address
  border-radius: 4px
  color: #f8c555
  padding: 4px
  font-weight: bold
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace
  font-size: 1rem
  text-align: left
  line-height: 1.5
  word-spacing: normal
  word-break: normal
  word-wrap: break-word
  tab-size: 4
  hyphens: none
</style>
