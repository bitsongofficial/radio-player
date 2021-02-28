<template>
  <v-card
    :color="isDarkTheme ? 'grey darken-4' : 'grey lighten-4'"
    class="mt-5"
    flat
  >
    <v-card-title>
      Total: 
      <span class="ml-2">
        <amount
          :micro-amount="totalVotes"
          :denom="microStakeDenom"
        />
      </span>
    </v-card-title>
    <v-card-text>
      <v-flex v-if="$vuetify.breakpoint.mdAndUp">
        <v-row>
          <v-col cols="2" align-self="center">
            <v-progress-circular
              :color="yes > (no + no_with_veto) ? 'green' : 'red'"
              width="15"
              size="100"
              :value="percentage"
            >
              {{ percentage }}%
            </v-progress-circular>
          </v-col>
          <v-spacer />
          <v-col cols="9">
            <v-row no-gutters>
              <v-col cols="6">
                <proposal-statistic-item-result
                  title="Yes"
                  :totals="totalVotes"
                  :votes="yes"
                />
              </v-col>
              <v-col cols="6">
                <proposal-statistic-item-result
                  title="No"
                  :totals="totalVotes"
                  :votes="no"
                />
              </v-col>
            </v-row>
            <v-row class="mt-3" no-gutters>
              <v-col cols="6">
                <proposal-statistic-item-result
                  title="NoWithVeto"
                  :totals="totalVotes"
                  :votes="no_with_veto"
                />
              </v-col>
              <v-col cols="6">
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
      <v-flex v-else>
        <v-row>
          <v-col cols="12" align-self="center" align="center">
            <v-progress-circular
              :color="yes > (no + no_with_veto) ? 'green' : 'red'"
              width="15"
              size="100"
              :value="percentage"
            >
              {{ percentage }}%
            </v-progress-circular>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row no-gutters>
              <v-col cols="6">
                <proposal-statistic-item-result
                  title="Yes"
                  :totals="totalVotes"
                  :votes="yes"
                />
              </v-col>
              <v-col cols="6">
                <proposal-statistic-item-result
                  title="No"
                  :totals="totalVotes"
                  :votes="no"
                />
              </v-col>
            </v-row>
            <v-row class="mt-3" no-gutters>
              <v-col cols="6">
                <proposal-statistic-item-result
                  title="NoWithVeto"
                  :totals="totalVotes"
                  :votes="no_with_veto"
                />
              </v-col>
              <v-col cols="6">
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
import Amount from '@/components/Wallet/Common/Amount.vue'
import ProposalStatisticItemResult from '@/components/Wallet/Governance/ProposalStatisticItemResult.vue'
import { pergentageOf } from '@/lib/utils'

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
    totalVotes () {
      return parseInt(this.yes) + parseInt(this.no) + parseInt(this.no_with_veto) + parseInt(this.abstain)
    },
    percentage () {
      const actualVotes = this.totalVotes - this.abstain
      return pergentageOf(actualVotes, this.totalVotes)
    },
    microStakeDenom () {
      return this.$store.getters["app/micro_stake_denom"];
    },
    isDarkTheme() {
      return this.$store.getters[`app/dark_theme`]
    }
  }

}
</script>

<style>

</style>