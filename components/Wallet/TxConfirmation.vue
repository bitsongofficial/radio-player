<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="value"
  >
    <v-card>
      <v-card-title>
        Confirm transaction
      </v-card-title>
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="py-0">
            <v-card outlined class="mb-4">
              <v-expansion-panels>
                <v-expansion-panel v-for="(msg, i) in msgs" :key="i">
                  <v-expansion-panel-header class="font-weight-medium">
                    {{
                      msg.type
                        .replace("cosmos-sdk/Msg", "")
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                    }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <template v-for="(value, key) in msg.value">
                      <v-list-item-content :key="key">
                        <v-list-item-title>
                          <div v-if="key === 'amount'">
                            <amount
                              v-for="(coin, i) in value"
                              :key="i"
                              :micro-amount="coin.amount"
                              :denom="coin.denom"
                            />
                          </div>
                          <span v-else>{{ value }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle class="grey--text mt-1">{{
                          key
                            .replace("_", " ")
                            .split(" ")
                            .map(word => {
                              return word[0].toUpperCase() + word.substring(1);
                            })
                            .join(" ")
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
            <div>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    autocomplete="off"
                    outlined
                    placeholder="Insert your password"
                    label="Password"
                    class="col-12 py-0"
                    type="password"
                    v-model="password"
                  ></v-text-field>
                  <v-switch
                    v-model="advanced"
                    label="ADVANCED"
                    class="ml-2 pt-0 mt-0 font-weight-bold"
                  ></v-switch>
                  <div v-if="advanced">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="max:100"
                      name="memo"
                    >
                      <v-text-field
                        class="col-12"
                        v-model="memo"
                        label="Memo (optional)"
                        counter="100"
                        data-vv-name="memo"
                        :error-messages="errors[0]"
                        @keyup="$emit('update:memo', memo)"
                      ></v-text-field>
                    </ValidationProvider>
                    <div class="d-flex">
                      <ValidationProvider
                        v-slot="{ errors }"
                        rules="required|integer|min_value:0|max_value:2000000"
                        name="gas_limit"
                      >
                        <v-text-field
                          class="col-12"
                          v-model="gas_limit"
                          label="Gas Limit"
                          type="number"
                          data-vv-name="gas_limit"
                          :error-messages="errors[0]"
                          @keyup="$emit('update:gas_limit', gas_limit)"
                        ></v-text-field>
                      </ValidationProvider>
                      <ValidationProvider
                        v-slot="{ errors }"
                        rules="required|decimals:8|min_value:0"
                        name="gas_price"
                      >
                        <v-text-field
                          class="col-12"
                          v-model="gas_price"
                          label="Gas Price"
                          type="number"
                          :suffix="
                            $store.getters[
                              `app/micro_stake_denom`
                            ].toLowerCase()
                          "
                          data-vv-name="gas_price"
                          :error-messages="errors[0]"
                          @keyup="$emit('update:gas_price', gas_price)"
                        ></v-text-field>
                      </ValidationProvider>
                    </div>
                  </div>
                  <v-row class="px-2">
                    <v-col cols="6" class="overline">
                      Network Fee
                    </v-col>
                    <v-col cols="6" class="text-right">
                      <amount
                        :micro-amount="networkFee.toNumber()"
                        :denom="`ubtsg`"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.stop="onClose">Cancel</v-btn>
        <v-btn :disabled="disabled" class="primary" @click.stop="onConfirm"
          >Confirm</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Coin, Fee } from "@bitsongofficial/js-sdk";
import BigNumber from "bignumber.js";
import CryptoJS from "crypto-js";

import Amount from "@/components/Wallet/Common/Amount";

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Amount
  },

  data() {
    return {
      gas_price: 0,
      gas_limit: 0,
      memo: "",
      advanced: false,
      password: null
    };
  },

  created() {
    this.gas_price = this.$store.getters["app/gas_price"];
    this.gas_limit = this.$store.getters["app/gas_limit"];
  },

  methods: {
    onClose() {
      this.gas_price = this.$store.getters["app/gas_price"];
      this.gas_limit = this.$store.getters["app/gas_limit"];
      this.memo = "";
      this.advanced = false;
      this.password = null;

      this.$store.dispatch("wallet/clearMessages");
    },

    async onConfirm() {
      try {
        const decryptPk = await CryptoJS.AES.decrypt(
          this.$store.getters["wallet/privateKey"],
          this.password
        );

        await this.$client.setAccountInfo(
          this.$store.getters["wallet/address"]
        );

        this.$client.setPrivateKey(decryptPk.toString(CryptoJS.enc.Utf8));

        const fee = new Fee(
          [
            new Coin(
              this.networkFee.toString(),
              this.$store.getters["app/micro_stake_denom"].toLowerCase()
            )
          ],
          new BigNumber(this.gas_limit).toString()
        );

        const signedTx = await this.$client.buildTransaction(
          this.msgs,
          this.memo,
          fee
        );

        this.onClose();
        this.$emit("signed-tx", signedTx);
      } catch (e) {
        console.error(e);
      }
    }
  },

  computed: {
    disabled() {
      return this.password === "" || this.password === null;
    },

    msgs() {
      return this.$store.getters[`wallet/msgs`];
    },

    networkFee() {
      return new BigNumber(this.gas_price).multipliedBy(
        new BigNumber(this.gas_limit)
      );
    }
  }
};
</script>
