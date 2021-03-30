<template>
  <v-card class="mt-5" color="grey darken-4" flat>
    <v-card-title>
      Total:
      <span class="ml-2">
        <amount :micro-amount="totalVotes" :denom="microStakeDenom" />
      </span>
    </v-card-title>
    <v-card-text>
      <v-flex>
        <v-row>
          <v-col md="2" cols="12">
            <v-progress-circular
              :color="yes > no + no_with_veto ? 'green' : 'red'"
              width="15"
              size="100"
              :value="percentage"
            >
              {{ percentage }}%
            </v-progress-circular>
          </v-col>
          <v-col md="10" cols="12">
            <v-row no-gutters>
              <v-col md="3" cols="12" class="mb-4">
                <proposal-statistic-item-result
                  title="Yes"
                  :totals="totalVotes"
                  :votes="yes"
                />
              </v-col>
              <v-col md="3" cols="12" class="mb-4">
                <proposal-statistic-item-result
                  title="No"
                  :totals="totalVotes"
                  :votes="no"
                />
              </v-col>
              <v-col md="3" cols="12" class="mb-4">
                <proposal-statistic-item-result
                  title="NoWithVeto"
                  :totals="totalVotes"
                  :votes="no_with_veto"
                />
              </v-col>
              <v-col md="3" cols="12" class="mb-4">
                <proposal-statistic-item-result
                  title="Abstain"
                  :totals="totalVotes"
                  :votes="abstain"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
import Amount from "@/components/Wallet/Common/Amount.vue";
import ProposalStatisticItemResult from "@/components/Wallet/Governance/ProposalStatisticItemResult.vue";
import { pergentageOf } from "@/lib/utils";

export default {
  components: {
    Amount,
    ProposalStatisticItemResult
  },

  props: {
    yes: {
      type: [Number, String],
      default: 0
    },
    no: {
      type: [Number, String],
      default: 0
    },
    no_with_veto: {
      type: [Number, String],
      default: 0
    },
    abstain: {
      type: [Number, String],
      default: 0
    }
  },

  computed: {
    totalVotes() {
      return (
        parseInt(this.yes) +
        parseInt(this.no) +
        parseInt(this.no_with_veto) +
        parseInt(this.abstain)
      );
    },
    percentage() {
      const actualVotes = this.totalVotes - this.abstain;
      return pergentageOf(actualVotes, this.totalVotes);
    },
    microStakeDenom() {
      return process.env.MICROSTAKEDENOM;
    }
  }
};
</script>

<style></style>
