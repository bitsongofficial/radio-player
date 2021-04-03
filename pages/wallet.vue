<template>
  <page-template class="col-md-10 mx-auto">
    <wallet-overview />
    <v-container fluid class="mt-4">
      <v-row>
        <v-col cols="12" class="py-0">
          <v-flex class="tabs-wrapper overflow-none mb-3">
            <!-- Tabs menu -->
            <v-tabs v-model="tab" grow centered show-arrows>
              <v-tab
                v-for="(item, i) in tabs"
                :key="i"
                :to="item.ref"
                class="black"
                exact
              >
                {{ item.name }}
              </v-tab>
            </v-tabs>
            <!-- End Tabs menu -->
          </v-flex>
        </v-col>
      </v-row>
    </v-container>

    <NuxtChild />
    <wallet-tx-response-failed />
  </page-template>
</template>

<script>
import PageTemplate from "@/components/PageTemplate";
import WalletOverview from "~/components/Wallet/WalletOverview.vue";
import WalletTxResponseFailed from "@/components/Wallet/TxResponseFailed";

export default {
  components: {
    PageTemplate,
    WalletOverview,
    WalletTxResponseFailed
  },

  data() {
    return {
      showConfirmation: true,

      tab: null,
      tabs: [
        { name: "Balance", ref: "/wallet" },
        { name: "Earn", ref: "/wallet/earn" },
        { name: "Governance", ref: "/wallet/gov" }
      ]
    };
  },

  computed: {
    address() {
      return this.$store.getters["wallet/address"];
    }
  },

  head() {
    const title = `Wallet ${this.address}`;
    return {
      title: title,
      meta: [{ hid: "og-title", name: "og:title", content: title }]
    };
  }
};
</script>
