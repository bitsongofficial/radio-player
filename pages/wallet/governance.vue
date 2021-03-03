<template>
  <v-data-table
    :headers="headers"
    :items="proposals"
    :loading="loading"
    hide-default-footer
  >
    <v-progress-linear
      v-slot:progress
      color="blue"
      indeterminate
    ></v-progress-linear>

    <!-- ID cell -->
    <template v-slot:item.proposal_id="{ item }">
      <span class="caption-1">{{ `#${item.proposal_id}` }}</span>
    </template>

    <!-- Title cell -->
    <template v-slot:item.title="{ item }">
      <nuxt-link
        class="caption-1"
        :to="`/wallet/proposals/${item.proposal_id}`"
      >
        {{ item.title }}
      </nuxt-link>
    </template>

    <!-- Status cell -->
    <template v-slot:item.proposal_status="{ item }">
      <status-with-dot :status="item.proposal_status" />
    </template>

    <!-- Voting start date cell -->
    <template v-slot:item.voting_start_time="{ item }">
      <span class="caption-1">{{
        formatTimestamp(item.voting_start_time)
      }}</span>
    </template>

    <!-- Submit time cell -->
    <template v-slot:item.submit_time="{ item }">
      <span class="caption-1">{{ formatTimestamp(item.submit_time) }}</span>
    </template>

    <!-- Total deposit cell -->
    <template v-slot:item.total_deposit_amount="{ item }">
      <amount
        style="font-size: 12pt"
        :micro-amount="item.total_deposit_amount"
        :denom="microStakeDenom"
      />
    </template>
  </v-data-table>
</template>

<script>
import StatusWithDot from "@/components/Wallet/Common/StatusWithDot.vue";
import Amount from "@/components/Wallet/Common/Amount.vue";
import { formatTimestamp } from "@/lib/utils";

export default {
  components: {
    StatusWithDot,
    Amount
  },

  data() {
    return {
      loading: false,
      proposals: [],
      headers: [
        { text: "#ID", value: "proposal_id" },
        { text: "Title", value: "title" },
        { text: "Status", value: "proposal_status" },
        { text: "Voting Start", value: "voting_start_time" },
        { text: "Submit Time", value: "submit_time" },
        { text: "Total Deposit", value: "total_deposit_amount" }
      ]
    };
  },

  async created() {
    this.proposals = await this.getProposals();
  },

  computed: {
    microStakeDenom() {
      return process.env.MICROSTAKEDENOM;
    }
  },

  methods: {
    async getProposals() {
      try {
        const proposals = await this.$btsg.getProposals();
        return proposals.map(p => {
          return {
            title: p.content.value.title,
            proposal_id: p.id,
            proposal_status: p.proposal_status,
            voting_start_time: p.voting_start_time,
            submit_time: p.submit_time,
            total_deposit_amount: p.total_deposit.find(
              d => d.denom === process.env.MICROSTAKEDENOM
            ).amount,
            total_deposit_denom: process.env.MICROSTAKEDENOM
          };
        });
      } catch (e) {
        console.error(e);
      }
    },
    formatTimestamp(ts) {
      return formatTimestamp(ts);
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
