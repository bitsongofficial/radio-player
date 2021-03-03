<template>
  <v-col cols="12">
    <h2 style="display: inline" class="text-h6">
      {{ value.description.moniker }}
    </h2>
    <v-chip
      v-if="value.status === 2"
      style="margin-top: -5px"
      class="ml-2 font-weight-medium"
      color="green"
      text-color="white"
      small
    >
      Active
    </v-chip>
    <v-chip
      v-if="value.status !== 2"
      style="margin-top: -5px"
      class="ml-2 font-weight-medium"
      color="red"
      text-color="white"
      small
    >
      Inactive
    </v-chip>
    <v-chip
      v-if="value.jailed"
      style="margin-top: -5px"
      class="ml-2 font-weight-medium"
      color="red"
      text-color="white"
      small
    >
      Jailed
    </v-chip>
    <p class="pr-8 mb-2 grey--text body-2">
      {{ value.operator_address }}
    </p>
  </v-col>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  }
};
</script>
