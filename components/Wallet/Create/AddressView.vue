<template>
  <div>
    <WalletHeader title="Set up your crypto wallet" />
    <markup class="px-4" title="Your Address" :content="address" />
    <markup class="px-4" title="Your Private Key" :content="privateKey" />

    <v-card-actions class="py-6">
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="onContinue">Go to BitSong</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import WalletHeader from "@/components/Wallet/Common/AuthHeader";
import Markup from "@/components/Wallet/Common/Markup";

export default {
  props: {
    privateKey: {
      type: String,
      required: true
    }
  },

  components: {
    WalletHeader,
    Markup
  },

  computed: {
    address() {
      return this.$store.getters[`wallet/address`];
    }
  },

  methods: {
    onContinue() {
      this.$emit("onContinue");
    }
  }
};
</script>
