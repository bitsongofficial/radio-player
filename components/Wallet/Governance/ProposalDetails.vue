<template>
  <v-card v-if="proposal">
    <v-card-title>
      <v-row>
        <v-col md="10" cols="12">
          <h2 class="headline font-weight-regular">
            {{ `#${proposal.proposal_id}` }} - {{ proposal.title }}
          </h2>
        </v-col>
        <v-col md="2" cols="12" class="d-flex flex-row-reverse">
          <v-chip
            v-if="proposal.proposal_status === 'Passed'"
            color="green"
            outlined
          >
            <status-with-dot :status="proposal.proposal_status" />
          </v-chip>
          <v-chip
            v-if="proposal.proposal_status === 'VotingPeriod'"
            color="primary"
            outlined
          >
            <status-with-dot :status="proposal.proposal_status" />
          </v-chip>
          <v-chip v-else color="red" outlined>
            <status-with-dot :status="proposal.proposal_status" />
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <!-- Proposal type -->
          <div class="grey--text subtitle-2 text--darken-2 font-weight-regular">
            Type
          </div>
          <div class="subtitle-1 mb-1">
            {{ proposal.proposal_type }}
          </div>

          <!-- Total Deposit -->
          <div class="grey--text subtitle-2 text--darken-2 font-weight-regular">
            Total Deposit
          </div>
          <div class="subtitle-1 mb-1">
            <amount
              style="font-size: 14pt"
              :micro-amount="proposal.total_deposit_amount"
              :denom="microStakeDenom"
            />
          </div>

          <!-- Deposit End Time -->
          <div class="grey--text subtitle-2 text--darken-2 font-weight-regular">
            Deposit End Time
          </div>
          <div class="subtitle-1 mb-1">
            {{ formatTimestamp(proposal.deposit_end_time) }}
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <!-- Voting Start -->
          <div class="grey--text subtitle-2 text--darken-2 font-weight-regular">
            Voting Start
          </div>
          <div class="subtitle-1 mb-1">
            {{ formatTimestamp(proposal.voting_start_time) }}
          </div>

          <!-- Voting end -->
          <div class="grey--text subtitle-2 text--darken-2 font-weight-regular">
            Voting End
          </div>
          <div class="subtitle-1 mb-1">
            {{ formatTimestamp(proposal.voting_end_time) }}
          </div>

          <!-- Submit Time -->
          <div class="grey--text subtitle-2 text--darken-2 font-weight-regular">
            Submit Time
          </div>
          <div class="subtitle-1 mb-1">
            {{ formatTimestamp(proposal.submit_time) }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <!-- Description proposal -->
          <div class="grey--text subtitle-2 text--darken-2 font-weight-regular">
            Description
          </div>
          <div class="subtitle-1 mb-1" v-html="parsedDescription">
            <!-- <p class="overflow-wrap"> {{ }}</p> -->
          </div>
        </v-col>
      </v-row>

      <proposal-statistic
        :yes="proposal.yes"
        :no="proposal.no"
        :no_with_veto="proposal.no_with_veto"
        :abstain="proposal.abstain"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import Amount from "@/components/Wallet/Common/Amount.vue";
import ProposalStatistic from "@/components/Wallet/Governance/ProposalStatistic.vue";
import { formatTimestamp } from "@/lib/utils";

export default {
  components: {
    Amount,
    ProposalStatistic
  },

  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },

  data() {
    return {
      proposal: null
    };
  },

  async fetch() {
    this.proposal = await this.getProposal(this.id);
  },

  computed: {
    explorerUrl() {
      return process.env.URL_ACCOUNT_EXPLORER;
    },
    microStakeDenom() {
      return process.env.MICROSTAKEDENOM;
    },
    parsedDescription() {
      if (this.proposal === null) {
        return "";
      }
      const rgxUrl = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
      return this.proposal && this.proposal.description
        ? this.proposal.description
            .replace(rgxUrl, match => `<a href="${match}">${match}</a>`)
            .replaceAll("↵", "<br />")
        : "";
    }
  },

  methods: {
    async getProposal(id) {
      try {
        const proposal = await this.$btsg.getProposal(id);
        const tally = await this.$btsg.getProposalTally(id);

        return {
          proposal_id: proposal.id,
          proposal_status: proposal.proposal_status,
          title: proposal.content.value.title,
          description: proposal.content.value.description,
          proposal_type: proposal.content.type,
          total_deposit_amount: proposal.total_deposit.find(
            d => d.denom === process.env.MICROSTAKEDENOM
          ).amount,
          deposit_end_time: proposal.deposit_end_time,
          voting_start_time: proposal.voting_start_time,
          voting_end_time: proposal.voting_end_time,
          submit_time: proposal.submit_time,
          yes: tally.yes,
          no: tally.no,
          abstain: tally.abstain,
          no_with_veto: tally.no_with_veto
        };
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
.info-label {
  min-height: 20px;
  flex: 0 0 203px;
  font-weight: 600;
}
.dotted-overflow-text {
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.overflow-wrap {
  overflow-wrap: anywhere;
}
</style>
