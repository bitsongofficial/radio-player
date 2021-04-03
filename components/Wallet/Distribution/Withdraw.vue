<template>
  <card-msg
    title="Withdraw rewards"
    subtitle="Withdraw rewards from a given delegation address, and optionally withdraw validator commission if the delegation address given is a validator operator."
    :loading="loading"
    :memo="form.memo"
    :gas_price="form.gas_price"
    :gas_limit="form.gas_limit"
    v-on:update:memo="form.memo = $event"
    v-on:update:gas_price="form.gas_price = $event"
    v-on:update:gas_limit="form.gas_limit = $event"
  >
    <template v-slot:fields>
      <template v-for="validator in value">
        <validator-overview
          :key="validator.validator_address"
          :value="validator"
        ></validator-overview>
      </template>

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
      <v-btn color="primary" @click.stop="onSend">
        Send
      </v-btn>
    </template>

    <template v-slot:dialog>
      <distribution-withdraw-confirmation
        v-if="showModal"
        :validators="value.map(v => v.operator_address)"
        :commission="form.commission"
        :memo="form.memo"
        :gas_price="form.gas_price"
        :gas_limit="form.gas_limit"
        :loading="loadingModal"
        :response="response"
        v-on:cancel="onCancel"
        v-on:confirm="onConfirm"
      ></distribution-withdraw-confirmation>
    </template>
  </card-msg>
</template>

<script>
import { Coin, Fee } from "@bitsongofficial/js-sdk";
import CryptoJS from "crypto-js";

import { SigningCosmosClient, coins } from "@cosmjs/launchpad";

import { parseErrorResponse, parseErrorResponseKeplr } from "@/lib/utils";
import DistributionWithdrawConfirmation from "@/components/Wallet/Distribution/WithdrawConfirmation";

export default {
  props: {
    value: {
      type: Array,
      required: true
    }
  },

  components: {
    DistributionWithdrawConfirmation
  },

  data: () => ({
    loading: false,
    loadingModal: false,
    showModal: false,
    form: {
      validator: null,
      commission: false,
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
      return this.form.validator === null;
    },
    address() {
      return this.$store.getters[`wallet/address`];
    }
  },
  methods: {
    async onSend() {
      switch (this.$store.getters["wallet/type"]) {
        case "localWallet":
          this.showModal = true;
          break;
        case "keplrWallet":
          await this.keplrWalletWithdraw();
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

    async keplrWalletWithdraw() {
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

        const fee = {
          amount: coins(
            this.form.gas_price * this.form.gas_limit,
            this.$store.getters["app/micro_stake_denom"].toLowerCase()
          ),
          gas: this.form.gas_limit
        };

        const response = await cosmJS.signAndBroadcast(msgs, fee);
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
        const fee = new Fee(
          [
            new Coin(
              String(this.form.gas_price * this.form.gas_limit),
              this.$store.getters["app/micro_stake_denom"].toLowerCase()
            )
          ],
          String(this.form.gas_limit)
        );

        // TODO: add this to the client lib
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

        const decryptPk = await CryptoJS.AES.decrypt(
          this.$store.getters["wallet/privateKey"],
          this.form.password
        );
        await this.$client.setAccountInfo(
          this.$store.getters["wallet/address"]
        );
        this.$client.setPrivateKey(decryptPk.toString(CryptoJS.enc.Utf8));

        const signedTx = await this.$client.buildTransaction(
          msgs,
          this.form.memo,
          fee
        );

        const response = await this.$client.broadcast(signedTx);
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
        this.$store.dispatch(`staking/getDelegations`);

        this.form.password = null;
        this.$client.setPrivateKey(null);
        this.loadingModal = false;
      }
    }
  }
};
</script>
