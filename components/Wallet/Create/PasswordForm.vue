<template>
  <div>
    <WalletHeader
      title="Set up your crypto wallet"
      subtitle="Type a strong and secure password"
    />
    <WalletAlert />
    <v-card-text>
      <validation-provider
        vid="password"
        v-slot="{ errors }"
        name="password"
        :rules="{
          required: true,
          min: {
            length: 8
          },
          max: {
            length: 86
          }
        }"
      >
        <v-text-field
          outlined
          ref="password"
          label="Password"
          v-model="password"
          :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show_password ? 'text' : 'password'"
          @click:append="show_password = !show_password"
          :error-messages="errors"
        ></v-text-field>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        name="password_confirmation"
        :rules="{
          required: true,
          confirmed: 'password'
        }"
      >
        <v-text-field
          outlined
          ref="password_confirmation"
          label="Confirm Password"
          v-model="confirm_password"
          :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show_password ? 'text' : 'password'"
          @click:append="show_password = !show_password"
          :error-messages="errors"
        ></v-text-field>
      </validation-provider>
      <v-checkbox
        v-model="agreement"
        label="I understand that BitSong will not store my password, my seed phrase, my keystore nor my private key"
        class="mt-0 pt-0"
      ></v-checkbox>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        :disabled="canContinue"
        class="px-6"
        @click="onContinue"
        >Continue</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-divider class="mt-6"></v-divider>
    <v-card-actions class="pt-8 pb-0">
      <v-spacer></v-spacer>
      <p>or <router-link to="/auth/import">import your wallet</router-link></p>
      <v-spacer></v-spacer>
    </v-card-actions>
  </div>
</template>

<script>
import WalletHeader from "@/components/Wallet/Common/AuthHeader";
import WalletAlert from "@/components/Wallet/Common/Alert";

export default {
  components: {
    WalletHeader,
    WalletAlert
  },
  data() {
    return {
      password: "",
      confirm_password: "",
      show_password: false,
      agreement: false
    };
  },
  methods: {
    async onContinue() {
      try {
        this.$emit("onContinue", this.password);
      } catch (err) {
        console.error(err);
      }
    }
  },
  computed: {
    canContinue() {
      return !(
        this.password.length >= 8 &&
        this.confirm_password.length >= 8 &&
        this.password === this.confirm_password &&
        this.agreement
      );
    }
  }
};
</script>
