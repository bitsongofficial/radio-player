<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar flat color="transparent">
        <v-toolbar-title>All Validators</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="query"
          label="Search"
          autocomplete="off"
          data-vv-name="recipient"
          clearable
          solo
          dense
          hide-details
          append-icon="mdi-magnify"
        />
        <v-btn-toggle v-model="queryType" class="ml-2" mandatory>
          <v-btn text outlined height="38" class="text-uppercase" value="all">
            All
          </v-btn>
          <v-btn
            text
            outlined
            height="38"
            color="green"
            class="text-uppercase"
            value="active"
          >
            Active
          </v-btn>
        </v-btn-toggle>
      </v-toolbar>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="filterValidators(validators, query, queryType)"
      :loading="loading"
      class="px-5"
    >
      <v-progress-linear
        v-slot:progress
        color="blue"
        indeterminate
      ></v-progress-linear>

      <template v-slot:item="{ item }">
        <tr @click.stop="onSelectRow(item)">
          <td>
            <!-- Name cell -->
            <v-flex class="d-flex flex-row align-center">
              <validator-avatar
                :identity="item.tokens"
                :valoper="item.operator_address"
                size="26px"
              />
              <dot-status-with-tooltip
                :status="item.status === 2"
                :msg="item.status === 2 ? 'Active' : 'Inactive'"
                class="mx-2"
              />
              <span class="caption-1">
                {{ item.description.moniker }}
              </span>
            </v-flex>
          </td>
          <td class="text-right">
            <!-- Tokens cell -->
            <amount
              style="font-size: 1.2em;"
              class="my-auto"
              :micro-amount="item.tokens"
              :denom="denom"
            />
            <span>
              <!-- TODO: Calculate percentage of tokens like bisong explorer -->
              0.00%
            </span>
          </td>
          <!-- Commission cell -->
          <td class="text-right">
            <warning-commission-icon
              v-if="
                item.details !== null &&
                  item.commission.commission_rates.rate > 0.5
              "
            />
            <span class="mr-5">
              {{
                item.details !== null
                  ? item.commission.commission_rates.rate * 100
                  : 0
              }}%
            </span>
          </td>
          <td class="text-right">
            <v-menu bottom left>
              <template v-slot:activator="{ on }">
                <v-btn icon color="grey" class="ml-4" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list tile class="py-0">
                <v-list-item nuxt-link @click.stop="onDelegate(item)">
                  <v-list-item-title>Delegate</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <dialog-validator
      v-if="showModal"
      :validator="selected"
      v-on:cancel="onClose"
    />
    <dialog-delegate
      v-if="showDelegate"
      v-model="selected"
      v-on:cancel="showDelegate = false"
    ></dialog-delegate>
    <dialog-redelegate
      v-if="showRedelegate"
      v-on:cancel="showRedelegate = false"
    >
    </dialog-redelegate>
  </v-card>
</template>

<script>
import ValidatorAvatar from "@/components/Wallet/Common/AvatarToken";
import Amount from "@/components/Wallet/Common/Amount";
import DotStatusWithTooltip from "@/components/Wallet/Common/DotStatusWithTooltip";
import WarningCommissionIcon from "@/components/Wallet/Common/WarningCommissionIcon";

export default {
  components: {
    ValidatorAvatar,
    Amount,
    DotStatusWithTooltip,
    WarningCommissionIcon
  },

  data() {
    return {
      loading: false,
      showModal: false,
      showDelegate: false,
      showRedelegate: false,
      query: null,
      queryType: "all",
      selected: null,
      headers: [
        { text: "Name", value: "description" },
        { text: "Tokens", value: "tokens", align: "right" },
        { text: "Commission", value: "commission", align: "right" },
        { text: "", align: "right" }
      ]
    };
  },

  computed: {
    denom() {
      return process.env.MICROSTAKEDENOM;
    },
    decimals() {
      return this.$store.getters["app/decimals"];
    },
    validators() {
      return this.$store.getters[`staking/validators`];
    }
  },

  methods: {
    onDelegate(validator) {
      this.selected = validator;
      this.showDelegate = true;
    },
    filterValidators(items, query, type) {
      if (items === null) {
        return [];
      }

      let results = items;
      if (query !== null) {
        results = results.filter(x =>
          x.description.moniker.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (type === "active") {
        results = results.filter(x => x.status === 2);
      }

      return results;
    },
    onClose() {
      this.showModal = false;
      this.selected = null;
    },
    onSelectRow(row) {
      this.selected = row;
      this.showModal = true;
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
