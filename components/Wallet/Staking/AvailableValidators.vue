<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar v-if="$vuetify.breakpoint.mdAndUp" flat color="transparent">
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
      <v-flex v-else flat color="transparent">
        <v-row no-gutters>
          <v-col>
            <v-toolbar-title>All Validators</v-toolbar-title>
          </v-col>
          <v-col align="end">
            <v-btn-toggle v-model="queryType" mandatory>
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
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="query"
              label="Search"
              class="my-2"
              autocomplete="off"
              clearable
              solo
              dense
              hide-details
              append-icon="mdi-magnify"
            />
          </v-col>
        </v-row>
      </v-flex>
    </v-card-title>
    <v-list color="transparent" class="px-5">
      <v-card-title v-if="$vuetify.breakpoint.mdAndUp">
        <v-flex>
          <v-row>
            <v-col cols="5" align="start" justify="center">
              <span class="caption">Name</span>
            </v-col>
            <v-col cols="5" align="Start" justify="center">
              <span class="caption">Tokens</span>
            </v-col>
            <v-col cols="2" align="end" justify="center">
              <span class="caption">Commissions</span>
            </v-col>
          </v-row>
        </v-flex>
      </v-card-title>
      <v-virtual-scroll
        :bench="10"
        :items="filterValidators(validators, query, queryType)"
        :item-height="$vuetify.breakpoint.mdAndUp ? 86 : 124"
        height="525"
      >
      <template v-slot:default="{ item }">
        <available-validators-item-desktop
          :key="item.operator_address"
          v-if="$vuetify.breakpoint.mdAndUp"
          :validator="item"
          @select="onSelectRow"
        />
        <available-validators-item-mobile
          v-else
          :key="item.operator_address"
          :validator="item"
          @select="onSelectRow"
        />
      </template>
      </v-virtual-scroll>
    </v-list>
    <dialog-validator
      v-if="showModal"
      :value="selected"
      v-on:cancel="onClose"
    />
  </v-card>
</template>

<script>
export default {

  data() {
    return {
      showModal: false,
      query: null,
      queryType: "all",
      selected: null
    };
  },

  computed: {
    denom() {
      return this.$store.getters["app/micro_stake_denom"];
    },
    decimals() {
      return this.$store.getters["app/decimals"];
    },
    validators() {
      return this.$store.getters[`staking/validators`];
    }
  },

  methods: {
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
      console.log('emitted selection')
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
