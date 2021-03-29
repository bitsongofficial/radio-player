<template>
  <v-card :loading="loading" :disabled="loading">
    <v-window v-model="step" class="ma-6">
      <v-window-item>
        <WalletCreatePasswordForm v-on:onContinue="onPasswordCreated" />
      </v-window-item>
      <v-window-item>
        <WalletCreateSeedAlert v-on:onContinue="step = 2" />
      </v-window-item>
      <v-window-item>
        <WalletCreateSeedView :seed="seed" v-on:onContinue="step = 3" />
      </v-window-item>
      <v-window-item>
        <WalletCreateSeedConfirmation
          :seed="seed"
          v-on:onContinue="onSeedConfirmed"
          v-on:onGoBack="step = 1"
        />
      </v-window-item>
      <v-window-item>
        <WalletCreateAddressView
          :private-key="privateKey"
          v-on:onContinue="walletCreated"
        />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import WalletCreatePasswordForm from "@/components/Wallet/Create/PasswordForm";
import WalletCreateSeedAlert from "@/components/Wallet/Create/SeedAlert";
import WalletCreateSeedView from "@/components/Wallet/Create/SeedView";
import WalletCreateSeedConfirmation from "@/components/Wallet/Create/SeedConfirmation";
import WalletCreateAddressView from "@/components/Wallet/Create/AddressView";

export default {
  components: {
    WalletCreatePasswordForm,
    WalletCreateSeedAlert,
    WalletCreateSeedView,
    WalletCreateSeedConfirmation,
    WalletCreateAddressView
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      step: 0,
      password: null,
      seed: null,
      privateKey: null
    };
  },
  methods: {
    async walletCreated() {
      // await this.$store.dispatch("bank/updateBalance");
      // this.$store.dispatch("bank/subscribe");
      this.$router.push("/");
    },
    onPasswordCreated(password) {
      const { mnemonic, privateKey } = this.$client.createAccountWithMneomnic();

      this.password = password;
      this.seed = mnemonic;
      this.privateKey = privateKey;
      this.step = 1;
    },
    async onSeedConfirmed() {
      await this.$store.dispatch(`wallet/recoverAccountFromMnemonic`, {
        mnemonic: this.seed,
        password: this.password
      });
      this.step = 4;
    }
  }
};
</script>
