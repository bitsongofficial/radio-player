<template>
  <card-msg
    title="Delegate"
    subtitle="Delegate liquid tokens to a validator."
    :loading="loading"
    :memo="form.memo"
    :gas_price="form.gas_price"
    :gas_limit="form.gas_limit"
    v-on:update:memo="form.memo = $event"
    v-on:update:gas_price="form.gas_price = $event"
    v-on:update:gas_limit="form.gas_limit = $event"
  >
    <template v-slot:fields>
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

      <v-text-field
        v-if="$store.getters['wallet/type'] === 'localWallet'"
        v-model="form.password"
        autocomplete="off"
        placeholder="Password"
        class="col-12"
        type="password"
      ></v-text-field>
    </template>

    <template v-slot:actions>
      <v-btn text @click.stop="$emit('cancel')">Close</v-btn>
      <v-btn :disabled="isDisabled" color="primary" @click.stop="onSend">
        Send
      </v-btn>
    </template>

    <template v-slot:dialog>
      <staking-delegate-confirmation
        v-if="showModal"
        :validator="value.operator_address"
        :amount="form.amount"
        :coin="form.coin"
        :memo="form.memo"
        :gas_price="form.gas_price"
        :gas_limit="form.gas_limit"
        :loading="loadingModal"
        :response="response"
        v-on:cancel="onCancel"
        v-on:confirm="onConfirm"
      ></staking-delegate-confirmation>
    </template>

    <dialog-confirmation
      title="Delegate"
      :loading="loading"
      :response="response"
      v-if="showModal"
    >
    </dialog-confirmation>
  </card-msg>
</template>

<script>
import { Coin, Fee } from "@bitsongofficial/js-sdk";
import CryptoJS from "crypto-js";

import { SigningCosmosClient, coin, coins } from "@cosmjs/launchpad";

import {
  convertMacroToMicroAmount,
  parseErrorResponse,
  parseErrorResponseKeplr
} from "@/lib/utils";
import StakingDelegateConfirmation from "@/components/Wallet/Staking/DelegateConfirmation";
import DialogConfirmation from "@/components/Wallet/Dialogs/DialogConfirmation";

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  components: {
    StakingDelegateConfirmation,
    DialogConfirmation
  },

  data: () => ({
    loading: false,
    loadingModal: false,
    showModal: false,
    form: {
      validator: null,
      coin: null,
      amount: "",
      memo: "",
      gas_price: 0,
      gas_limit: 0,
      password: null
    },
    response: {
      success: false,
      log: null,
      tx_hash: null
    }
  }),

  created() {
    this.form.gas_price = this.$store.getters["app/gas_price"];
    this.form.gas_limit = this.$store.getters["app/gas_limit"];
  },

  watch: {
    value(val) {
      this.form.validator = val;
    }
  },

  computed: {
    isDisabled() {
      return (
        this.form.validator === null &&
        this.form.coin === null &&
        this.form.amount === "" &&
        this.form.password === null
      );
    },
    address() {
      return this.$store.getters[`wallet/address`];
    },
    decimals() {
      return this.$store.getters["app/decimals"];
    }
  },
  methods: {
    async onSend() {
      switch (this.$store.getters["wallet/type"]) {
        case "localWallet":
          this.showModal = true;
          break;
        case "keplrWallet":
          await this.keplrWalletDelegate();
          break;
      }
    },

    onCancel() {
      this.showModal = false;
      this.resetResponse();
    },

    resetResponse() {
      this.response = {
        success: false,
        log: null,
        tx_hash: null
      };
    },

    async keplrWalletDelegate() {
      this.resetResponse();
      this.loading = true;

      try {
        await window.keplr.enable(process.env.CHAIN_ID);

        const offlineSigner = await window.getOfflineSigner(
          process.env.CHAIN_ID
        );

        const cosmJS = new SigningCosmosClient(
          process.env.LCD,
          this.$store.getters["wallet/address"],
          offlineSigner
        );

        const msg = {
          type: "cosmos-sdk/MsgDelegate",
          value: {
            delegator_address: this.$store.getters["wallet/address"],
            validator_address: this.value.operator_address,
            amount: coin(
              convertMacroToMicroAmount(this.form.amount, this.decimals),
              this.form.coin.toLowerCase()
            )
          }
        };

        const fee = {
          amount: coins(
            this.form.gas_price * this.form.gas_limit,
            this.$store.getters["app/micro_stake_denom"].toLowerCase()
          ),
          gas: this.form.gas_limit
        };

        const response = await cosmJS.signAndBroadcast([msg], fee);
        this.response = parseErrorResponseKeplr(response);
        this.showModal = true;

        this.$store.dispatch("staking/getDelegations");

        this.$emit("txSuccess");
      } catch (e) {
        if (e !== undefined) {
          console.error(e);
          this.response.log = e.message;
        } else {
          this.response.log = `Something went wrong!`;
        }
      } finally {
        this.form.password = null;
        this.loading = false;
      }
    },

    async onConfirm() {
      this.resetResponse();
      this.loadingModal = true;

      try {
        const amount = new Coin(
          String(convertMacroToMicroAmount(this.form.amount, this.decimals)),
          this.form.coin.toLowerCase()
        );

        const fee = new Fee(
          [
            new Coin(
              String(this.form.gas_price * this.form.gas_limit),
              this.$store.getters["app/micro_stake_denom"].toLowerCase()
            )
          ],
          String(this.form.gas_limit)
        );

        const decryptPk = await CryptoJS.AES.decrypt(
          this.$store.getters["wallet/privateKey"],
          this.form.password
        );
        await this.$client.setAccountInfo(
          this.$store.getters["wallet/address"]
        );
        this.$client.setPrivateKey(decryptPk.toString(CryptoJS.enc.Utf8));

        const response = await this.$client.delegate(
          this.value.operator_address,
          amount,
          this.form.memo,
          fee
        );

        this.response = parseErrorResponse(response);

        this.$store.dispatch("staking/getDelegations");

        this.$emit("txSuccess");
      } catch (e) {
        if (e !== undefined) {
          console.error(e);
          this.response.log = e.message;
        } else {
          this.response.log = `Something went wrong!`;
        }
      } finally {
        this.form.password = null;
        this.$client.setPrivateKey(null);
        this.loadingModal = false;
      }
    }
  }
};
</script>
