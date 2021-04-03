<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>Send Coins</v-card-title>
      <v-card-subtitle class="pt-1"
        >Transfer your coins to your friends</v-card-subtitle
      >
      <v-divider></v-divider>
      <v-container fluid>
        <v-row class="px-4">
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
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('cancel')">Close</v-btn>
        <v-btn
          :disabled="disabled || loading"
          color="primary"
          @click.stop="onSend"
        >
          Send
        </v-btn>
      </v-card-actions>
    </v-card>

    <wallet-tx-confirmation
      :value="$store.getters['wallet/msgs'].length !== 0"
      v-on:signed-tx="onSignedTx"
    />
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

import WalletTxConfirmation from "@/components/Wallet/TxConfirmation";

export default {
  components: {
    WalletTxConfirmation
  },

  data: () => ({
    loading: false,
    form: {
      to_address: "",
      coin: null,
      amount: ""
    }
  }),

  computed: {
    disabled() {
      return (
        this.form.to_address === "" ||
        this.form.coin === null ||
        this.form.amount === ""
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
    onCancel() {
      this.showModal = false;
    },

    async onSend() {
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

      this.$store.dispatch("wallet/setMessages", [msg]);
      // switch (this.$store.getters["wallet/type"]) {
      //   case "localWallet":
      //     this.showModal = true;
      //     break;
      //   case "keplrWallet":
      //     await this.keplrWalletSend();
      //     break;
      // }
    },

    async onSignedTx(signedTx) {
      try {
        this.loading = true;

        const response = await this.$client.broadcast(signedTx);

        // Error:
        /*
          {
              "result": {
                  "height": "0",
                  "txhash": "508E9A38624341E0942BF6BB32B06E14C45EBC3BF276DF8331FF36A331143E8B",
                  "codespace": "sdk",
                  "code": 4,
                  "raw_log": "unauthorized: signature verification failed; verify correct account sequence and chain-id",
                  "gas_wanted": "200000",
                  "gas_used": "43054"
              },
              "status": 200
          }
        */

        console.log(parseErrorResponse(response));
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
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
