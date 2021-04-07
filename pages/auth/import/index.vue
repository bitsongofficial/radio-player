<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="3">
        <v-card class="pa-6">
          <WalletImportHeader title="Import your crypto wallet" />
          <div class="text-center my-4">
            <img
              style="cursor:pointer"
              @click.stop="addKeplrChain"
              src="/keplr_dark.png"
              alt="Keplr wallet"
            />
          </div>
          <v-switch
            v-model="showUnsecure"
            label="Show unsecure methods"
            class="ml-2 mt-2 font-weight-bold"
          ></v-switch>
          <WalletAlert v-if="showUnsecure" />
          <v-list-item-group v-if="showUnsecure" class="pt-2">
            <v-list-item link to="/auth/import/mnemonic">
              <v-list-item-icon>
                <v-icon>mdi-shield-key-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Mnemonic phrase</v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-chevron-right</v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-list-item link to="/auth/import/privatekey">
              <v-list-item-icon>
                <v-icon>mdi-shield-key-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Private key</v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-chevron-right</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>

          <v-divider class="mt-6"></v-divider>
          <v-card-actions class="pt-8 pb-0">
            <v-spacer></v-spacer>
            <p>
              or
              <router-link to="/auth/create">create a new wallet</router-link>
            </p>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletImportHeader from "@/components/Wallet/Common/AuthHeader";
import WalletAlert from "@/components/Wallet/Common/Alert";

import { addChain } from "@/lib/keplr";

export default {
  layout: "auth",

  components: {
    WalletImportHeader,
    WalletAlert
  },

  data() {
    return {
      showUnsecure: false
    };
  },

  methods: {
    async addKeplrChain() {
      const address = await addChain();

      const result = this.$store.dispatch(
        "wallet/recoverWalletFromKeplr",
        address
      );

      if (result) {
        this.$router.push("/");
      }
    }
  }
};
</script>
