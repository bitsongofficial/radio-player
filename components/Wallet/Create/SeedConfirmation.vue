<template>
  <div>
    <WalletHeader title="Set up your crypto wallet" />
    <v-card-text class="subtitle-1">
      <p class="pb-3">
        Let's make sure you've written down your seed phrase correctly. Type it
        out now, then click "verify seed phrase" below
      </p>
      <v-textarea
        outlined
        label="Type your seed phrase here"
        v-model="confirmedSeed"
      ></v-textarea>
    </v-card-text>
    <v-card-actions class="pb-6">
      <v-spacer></v-spacer>
      <v-btn class="px-6" text @click="onGoBack">Back</v-btn>
      <v-btn
        color="primary"
        class="px-6"
        @click="onContinue"
        :disabled="canContinue"
        >Verify seed phrase</v-btn
      >
    </v-card-actions>
  </div>
</template>

<script>
import WalletHeader from "@/components/Wallet/Common/AuthHeader";

export default {
  props: {
    seed: {
      type: String,
      required: true
    }
  },

  components: {
    WalletHeader
  },
  data() {
    return {
      confirmedSeed: ""
    };
  },
  computed: {
    canContinue() {
      return !(this.seed === this.confirmedSeed);
    }
  },
  methods: {
    onContinue() {
      this.$emit("onContinue");
    },
    onGoBack() {
      this.$emit("onGoBack");
    }
  }
};
</script>
