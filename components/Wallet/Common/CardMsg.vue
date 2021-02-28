<template>
  <v-card :loading="loading" :disabled="loading" :flat="flat">
    <v-card-title v-text="title"></v-card-title>
    <v-card-subtitle v-text="subtitle"></v-card-subtitle>
    <v-divider></v-divider>
    <v-container>
      <v-row>
        <slot name="fields" />
      </v-row>
      <v-row v-if="advanced">
        <v-col cols="12" md="6">
          <ValidationProvider v-slot="{ errors }" rules="max:100" name="memo">
            <v-text-field
              v-model="memo"
              label="Memo (optional)"
              counter="100"
              data-vv-name="memo"
              :error-messages="errors[0]"
              @keyup="$emit('update:memo', memo)"
            ></v-text-field>
          </ValidationProvider>
        </v-col>
        <v-col cols="6" md="3">
          <ValidationProvider v-slot="{ errors }" rules="required|integer|min_value:0|max_value:2000000" name="gas_limit">
            <v-text-field
              v-model="gas_limit"
              label="Gas Limit"
              type="number"
              data-vv-name="gas_limit"
              :error-messages="errors[0]"
              @keyup="$emit('update:gas_limit', gas_limit)"
            ></v-text-field>
          </ValidationProvider>
        </v-col>
        <v-col cols="6" md="3">
          <ValidationProvider v-slot="{ errors }" rules="required|decimals:8|min_value:0" name="gas_price">
            <v-text-field
              v-model="gas_price"
              label="Gas Price"
              type="number"
              :suffix="$store.getters[`app/micro_stake_denom`].toLowerCase()"
              data-vv-name="gas_price"
              :error-messages="errors[0]"
              @keyup="$emit('update:gas_price', gas_price)"
            ></v-text-field>
          </ValidationProvider>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-switch
        v-model="advanced"
        label="ADVANCED"
        class="ml-2 font-weight-bold"
      ></v-switch>
      <v-spacer></v-spacer>

      <slot name="actions" />
    </v-card-actions>

    <slot name="dialog" />
  </v-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: String,
    subtitle: String,
    memo: String,
    gas_price: [Number, String],
    gas_limit: [Number, String],
    flat: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      advanced: false
    }
  }
}
</script>
