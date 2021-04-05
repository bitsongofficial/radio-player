<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>Delegate</v-card-title>
      <v-card-subtitle class="pt-1"
        >Delegate liquid tokens to a validator</v-card-subtitle
      >
      <v-divider></v-divider>
      <v-container fluid>
        <v-row class="px-4">
          <validator-overview v-model="value"></validator-overview>

          <input-coin
            class="col-12 col-md-6"
            v-model="form.coin"
            v-on:update:coin="form.coin = $event"
          ></input-coin>

          <input-amount
            class="col-12 col-md-6"
            v-model="form.amount"
            :coin="form.coin"
            v-on:update:amount="form.amount = $event"
          ></input-amount>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('cancel')">Close</v-btn>
        <v-btn
          :disabled="disabled || loading"
          color="primary"
          @click.stop="onDelegate"
        >
          Delegate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { coin } from "@cosmjs/launchpad";

import {
  convertMacroToMicroAmount,
  parseErrorResponseKeplr,
  enableKeplr,
  defaultFees
} from "@/lib/utils";

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    loading: false,
    form: {
      coin: null,
      amount: ""
    }
  }),

  methods: {
    createMsgs() {
      return [
        {
          type: "cosmos-sdk/MsgDelegate",
          value: {
            delegator_address: this.address,
            validator_address: this.value.operator_address,
            amount: coin(
              convertMacroToMicroAmount(this.form.amount, this.decimals),
              this.form.coin.toLowerCase()
            )
          }
        }
      ];
    },

    async onDelegate() {
      switch (this.$store.getters["wallet/type"]) {
        case "localWallet":
          this.localWalletSend();
          break;
        case "keplrWallet":
          await this.keplrWalletSend();
          break;
      }
    },

    localWalletSend() {
      this.$store.dispatch("wallet/setMessages", this.createMsgs());
      this.$emit("cancel");
    },

    async keplrWalletSend() {
      this.loading = true;

      try {
        const keplr = await enableKeplr(this.$store.getters["wallet/address"]);

        const response = await keplr.signAndBroadcast(
          this.createMsgs(),
          defaultFees()
        );

        this.$emit("cancel");

        this.$store.dispatch(
          "wallet/setTxResponse",
          parseErrorResponseKeplr(response)
        );
      } catch (e) {
        console.error(e);

        this.$store.dispatch("wallet/setTxResponse", {
          success: false,
          tx_hash: null,
          log: `Something went wrong!`
        });
      } finally {
        this.loading = false;
      }
    }
  },

  computed: {
    disabled() {
      return this.form.coin === null || this.form.amount === "";
    },
    address() {
      return this.$store.getters[`wallet/address`];
    },
    decimals() {
      return this.$store.getters["app/decimals"];
    }
  }
};
</script>
