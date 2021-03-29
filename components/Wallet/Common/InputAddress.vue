<template>
  <div class="pt-0">
    <ValidationProvider
      v-slot="{ errors }"
      :rules="rulesRecipient"
      name="recipient"
    >
      <v-text-field
        v-model="lazyValue"
        label="To address"
        :hint="`es: bitsong12kr8je8lcats0c5n94xlzhu7vs7s9dvvd7devl`"
        required
        clearable
        autocomplete="off"
        data-vv-name="recipient"
        :error-messages="errors[0]"
        @change="$emit('update:address', lazyValue)"
        @keyup="$emit('update:address', lazyValue)"
        append-icon="mdi-qrcode"
        @click:append="onQrcodeClick"
      ></v-text-field>
    </ValidationProvider>
    <dialog-qrcode
      v-if="qrDialog"
      v-on:onDecode="onDecode"
      v-on:close="onQrcodeClose"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: null
  },

  data() {
    return {
      lazyValue: this.value,
      qrDialog: false
    };
  },

  watch: {
    value(val) {
      this.lazyValue = val;
    }
  },

  beforeCreate() {
    this.$_modelEvent =
      (this.$options.model && this.$options.model.event) || "input";
  },

  methods: {
    onQrcodeClick() {
      this.qrDialog = true;
    },
    onQrcodeClose() {
      this.qrDialog = false;
    },
    onDecode(decodedStr) {
      this.lazyValue = decodedStr;
      this.$emit("update:address", decodedStr);
      this.qrDialog = false;
    }
  },

  computed: {
    address_length() {
      return this.$store.getters["app/address_length"];
    },
    address_prefix() {
      return this.$store.getters["app/address_prefix"];
    },
    rulesRecipient() {
      return {
        required: true,
        regex: new RegExp(process.env.ADDRESS_REGEX)
      };
    }
  }
};
</script>
