<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar flat color="transparent">
        <v-toolbar-title>Your stake</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          :loading="loading"
          color="orange darken-1"
          depressed
          outlined
          rounded
          ripple
          @click.stop="onClaimRewards(null)"
        >
          Claim rewards
        </v-btn>
      </v-toolbar>
      <dialog-withdraw v-if="showModal" v-on:cancel="onClaimDialogClose" />
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="delegations" :loading="loading">
        <v-progress-linear
          v-slot:progress
          color="blue"
          indeterminate
        ></v-progress-linear>

        <!-- Name cell -->
        <template v-slot:item.validator="{ item }">
          <a
            class="caption-1"
            :href="`${explorerUrl}/earn/${item.validator_address}`"
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
        <template v-slot:item.staked_balance="{ item }">
          <amount
            style="font-size: 1.4em;"
            class="my-auto"
            :micro-amount="item.balance.amount"
            :denom="item.balance.denom"
          />
        </template>

        <!-- Rewards cell -->
        <template v-slot:item.rewards="{ item }">
          <span class="green--text pr-5">
            <amount
              style="font-size: 1.4em;"
              class="my-auto"
              :micro-amount="item.rewards.amount"
              :denom="item.rewards.denom"
            />
          </span>
        </template>

        <!-- Commision cell -->
        <template v-slot:item.commission="{ item }">
          <warning-commission-icon v-if="item.commission > 0.5" />
          <span class="pr-5"> {{ item.commission * 100 }}% </span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn icon color="grey" class="ml-4" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list tile class="py-0">
              <v-list-item nuxt-link @click.stop="onClaimRewards(item)">
                <v-list-item-title>Claim rewards</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card-text>

    <dialog-distribution
      v-if="selected"
      v-model="selected"
      v-on:cancel="selected = null"
    ></dialog-distribution>
  </v-card>
</template>

<script>
import ValidatorAvatar from "@/components/Wallet/Common/AvatarToken.vue";
import Amount from "@/components/Wallet/Common/Amount.vue";
import DotStatusWithTooltip from "@/components/Wallet/Common/DotStatusWithTooltip.vue";
import DialogWithdraw from "@/components/Wallet/Dialogs/DialogWithdraw.vue";
import WarningCommissionIcon from "@/components/Wallet/Common/WarningCommissionIcon.vue";

export default {
  components: {
    ValidatorAvatar,
    Amount,
    DotStatusWithTooltip,
    DialogWithdraw,
    WarningCommissionIcon
  },

  // TODO: replace placeholders
  // change rewards and voting power handling
  data() {
    return {
      loading: false,
      showModal: false,
      headers: [
        { text: "Name", value: "validator" },
        { text: "Stake", value: "staked_balance", align: "right" },
        { text: "Rewards", value: "rewards", align: "right" },
        { text: "Commission", value: "commission", align: "right" },
        { text: "", value: "actions", align: "right" }
      ],
      items: [],
      selected: null
    };
  },

  computed: {
    address() {
      return this.$store.getters["wallet/address"];
    },
    explorerUrl() {
      return process.env.URL_ACCOUNT_EXPLORER;
    },
    delegations() {
      return this.$store.getters["staking/delegations"];
    }
  },

  methods: {
    onClaimRewards(val = null) {
      if (val === null) {
        this.selected = this.delegations.map(val => {
          return {
            description: {
              moniker: val.validator_name
            },
            operator_address: val.validator_address,
            status: val.status
          };
        });
        return;
      }

      this.selected = [
        {
          description: {
            moniker: val.validator_name
          },
          operator_address: val.validator_address,
          status: val.status
        }
      ];
    },
    onClaimDialogClose() {
      this.showModal = false;
    }
  }
};
</script>

<style>
.theme--light.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
.theme--dark.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
