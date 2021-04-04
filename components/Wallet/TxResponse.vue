<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="$store.getters['wallet/txResponse']"
  >
    <v-card>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            class="text-center"
            v-if="
              $store.getters['wallet/txResponse'] &&
                !$store.getters['wallet/txResponse'].success
            "
          >
            <v-icon color="red" size="100">mdi-alert-circle-outline</v-icon>
            <h2 class="subtitle-1 mt-4">
              {{ $store.getters["wallet/txResponse"].log }}
            </h2>
          </v-col>

          <v-col
            cols="12"
            class="text-center"
            v-if="
              $store.getters['wallet/txResponse'] &&
                $store.getters['wallet/txResponse'].success
            "
          >
            <v-icon color="green" size="100">
              mdi-checkbox-marked-circle-outline
            </v-icon>
            <h2 class="font-weight-medium">
              Your transaction<br />has been confirmed
            </h2>
            <h3 class="font-weight-regular mt-4">Transaction Hash</h3>
            <div class="px-8 mt-2">
              <a
                :href="
                  `https://explorebitsong.com/transactions/${$store.getters['wallet/txResponse'].tx_hash}`
                "
                target="_blank"
                >{{ $store.getters["wallet/txResponse"].tx_hash }}</a
              >
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.stop="onClose">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  methods: {
    onClose() {
      this.$store.dispatch("wallet/clearTxResponse");
    }
  }
};
</script>
