<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar flat color="transparent">
        <v-toolbar-title>Unbonding</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="unbondings" :loading="loading">
        <v-progress-linear
          v-slot:progress
          color="blue"
          indeterminate
        ></v-progress-linear>

        <!-- Name cell -->
        <template v-slot:item.validator="{ item }">
          <a
            class="caption-1"
            :href="`${explorerUrl}/staking/${item.validator_address}`"
          >
            <v-flex class="d-flex flex-row align-center">
              <validator-avatar
                :identity="item.identity"
                :valoper="item.validator_address"
                size="26px"
              />
              <dot-status-with-tooltip
                :status="item.status === 2"
                :msg="item.status === 2 ? 'Active' : 'Inactive'"
                class="mx-2"
              />
              <span class="caption-1">
                {{ item.validator_name }}
              </span>
            </v-flex>
          </a>
        </template>

        <!-- Stake cell -->
        <template v-slot:item.balance="{ item }">
          <amount
            style="font-size: 1.4em;"
            class="my-auto"
            :micro-amount="item.balance"
            :denom="$store.getters[`app/stake_denom`]"
          />
        </template>

        <!-- Rewards cell -->
        <template v-slot:item.completion_time="{ item }">
          <span class="pr-5">
            {{ new Date(item.completion_time).toLocaleString() }}
          </span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import ValidatorAvatar from "@/components/Wallet/Common/AvatarToken.vue";
import Amount from "@/components/Wallet/Common/Amount.vue";
import DotStatusWithTooltip from "@/components/Wallet/Common/DotStatusWithTooltip.vue";

export default {
  components: {
    ValidatorAvatar,
    Amount,
    DotStatusWithTooltip
  },

  data() {
    return {
      loading: false,
      showModal: false,
      headers: [
        { text: "Name", value: "validator" },
        { text: "Amount", value: "balance", align: "right" },
        {
          text: "Completition Time",
          value: "completion_time",
          align: "right"
        }
      ],
      items: []
    };
  },

  computed: {
    address() {
      return this.$store.getters["wallet/address"];
    },
    explorerUrl() {
      return process.env.URL_ACCOUNT_EXPLORER;
    },
    unbondings() {
      return this.$store.getters["staking/unbondings"];
    }
  }
};
</script>
