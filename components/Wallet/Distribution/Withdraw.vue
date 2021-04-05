<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>Withdraw rewards</v-card-title>
      <v-card-subtitle class="pt-1">
        Withdraw rewards from a given delegation address, and optionally
        withdraw validator commission if the delegation address given is a
        validator operator.
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-container fluid>
        <v-row class="px-4">
          <template v-for="validator in value">
            <validator-overview
              :value="validator"
              :key="validator.validator_address"
            ></validator-overview>
          </template>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('cancel')">Close</v-btn>
        <v-btn
          :disabled="disabled || loading"
          color="primary"
          @click.stop="onWithdraw"
        >
          Withdraw
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { parseErrorResponseKeplr, enableKeplr, defaultFees } from "@/lib/utils";

export default {
  props: {
    value: {
      type: Array,
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
      let msgs = [];

      for (const validator of this.value) {
        const msg = {
          type: "cosmos-sdk/MsgWithdrawDelegationReward",
          value: {
            delegator_address: this.address,
            validator_address: validator.operator_address
          }
        };
        msgs.push(msg);
      }

      return msgs;
    },

    async onWithdraw() {
      switch (this.$store.getters["wallet/type"]) {
        case "localWallet":
          this.localWalletWithdraw();
          break;
        case "keplrWallet":
          await this.keplrWalletWithdraw();
          break;
      }
    },

    localWalletWithdraw() {
      this.$store.dispatch("wallet/setMessages", this.createMsgs());
      this.$emit("cancel");
    },

    async keplrWalletWithdraw() {
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
      return this.value.length === 0;
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
