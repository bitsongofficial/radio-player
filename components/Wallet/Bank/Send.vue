<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <card-msg
      title="Send Coins"
      subtitle="Transfer your coins to your friends."
      :loading="loading"
      :memo="form.memo"
      :gas_price="form.gas_price"
      :gas_limit="form.gas_limit"
      v-on:update:memo="form.memo = $event"
      v-on:update:gas_price="form.gas_price = $event"
      v-on:update:gas_limit="form.gas_limit = $event"
    >
      <template v-slot:fields>
        <input-address
          class="col-12"
          v-model="form.to_address"
          v-on:update:address="form.to_address = $event"
        ></input-address>
        <input-coin
          class="col-6"
          v-model="form.coin"
          v-on:update:coin="form.coin = $event"
        ></input-coin>
        <input-amount
          class="col-6"
          v-model="form.amount"
          :coin="form.coin"
          v-on:update:amount="form.amount = $event"
        ></input-amount>
        <v-text-field
          v-model="form.password"
          autocomplete="off"
          placeholder="Password"
          class="col-12"
          type="password"
        ></v-text-field>
      </template>

      <template v-slot:actions>
        <v-btn text @click="$emit('cancel')">Close</v-btn>
        <v-btn :disabled="disabled" color="primary" @click.stop="onSend">
          Send
        </v-btn>
      </template>

      <template v-slot:dialog>
        <bank-send-confirmation
          v-if="showModal"
          :to_address="form.to_address"
          :amount="form.amount"
          :coin="form.coin"
          :memo="form.memo"
          :gas_price="form.gas_price"
          :gas_limit="form.gas_limit"
          :loading="loadingModal"
          :response="response"
          v-on:cancel="onCancel"
          v-on:confirm="onConfirm"
        ></bank-send-confirmation>
      </template>
    </card-msg>
  </v-dialog>
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
import BankSendConfirmation from "@/components/Wallet/Bank/SendConfirmation";

export default {
  components: {
    BankSendConfirmation
  },
  data: () => ({
    loading: false,
    loadingModal: false,

    showModal: false,
    response: {
      success: false,
      log: null,
      tx_hash: null
    },
    form: {
      to_address: "",
      coin: null,
      amount: "",
      memo: "",
      gas_price: 0,
      gas_limit: 0,
      password: null
    }
  }),

  created() {
    this.form.gas_price = this.$store.getters["app/gas_price"];
    this.form.gas_limit = this.$store.getters["app/gas_limit"];
  },

  computed: {
    disabled() {
      return (
        this.form.to_address === "" ||
        this.form.coin === null ||
        this.form.amount === "" ||
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
          await this.keplrWalletSend();
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

    async keplrWalletSend() {
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
          type: "cosmos-sdk/MsgSend",
          value: {
            from_address: this.address,
            to_address: this.form.to_address,
            amount: [
              coin(
                convertMacroToMicroAmount(this.form.amount, this.decimals),
                this.form.coin.toLowerCase()
              )
            ]
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
        console.log(response);
        this.response = parseErrorResponseKeplr(response);
        this.showModal = true;

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
        const amount = [
          new Coin(
            String(convertMacroToMicroAmount(this.form.amount, this.decimals)),
            this.form.coin.toLowerCase()
          )
        ];

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

        const response = await this.$client.send(
          this.form.to_address,
          amount,
          this.form.memo,
          fee
        );
        this.response = parseErrorResponse(response);
        this.$emit("close");
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
