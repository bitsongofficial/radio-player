<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col>
          <h2 class="headline font-weight-regular">{{ `#${proposal.proposal_id}` }}</h2>
          <h3 class="headline font-weight-regular">{{ proposal.title }}</h3>
        </v-col>
        <v-col class="d-flex flex-row-reverse">
          <v-chip
            :color="proposal.proposal_status === 'Passed' ? 'green' : 'red'"
            outlined
          >
            <status-with-dot :status="proposal.proposal_status" />
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>    
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <!-- Proposer of proposal -->
          <div class="subtitle-1">
            <a :href="`${explorerUrl}/${proposal.proposer}`"> {{ proposal.moniker }}</a>
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Proposer
          </div>

          <!-- Proposal type -->
          <div class="subtitle-1">
            {{ proposal.proposal_type }}
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Type
          </div>

          <!-- Initial deposit -->
          <div class="subtitle-1">
            <amount
              style="font-size: 14pt"
              :micro-amount="proposal.initial_deposit_amount"
              :denom="microStakeDenom"
            />
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Initial Deposit
          </div>

          <!-- Total Deposit -->
          <div class="subtitle-1">
            <amount
              style="font-size: 14pt"
              :micro-amount="proposal.total_deposit_amount"
              :denom="microStakeDenom"
            />
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Total Deposit
          </div>

        </v-col>
        <v-col cols="12" md="6">

          <!-- Voting Start -->
          <div class="subtitle-1">
            {{ formatTimestamp(proposal.voting_start_time) }}
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Voting Start
          </div>

          <!-- Voting end -->
          <div class="subtitle-1">
            {{ formatTimestamp(proposal.voting_end_time) }}
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Voting End
          </div>

          <!-- Submit Time -->
          <div class="subtitle-1">
            {{ formatTimestamp(proposal.submit_time) }}
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Submit Time
          </div>

          <!-- Deposit End Time -->
          <div class="subtitle-1">
            {{ formatTimestamp(proposal.deposit_end_time) }}
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Deposit End Time
          </div>

        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">

          <!-- Description proposal -->
          <div class="subtitle-1" v-html="parsedDescription">
            <!-- <p class="overflow-wrap"> {{ }}</p> -->
          </div>
          <div
            class="grey--text subtitle-2 text--darken-2 font-weight-regular"
          >
            Description
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
import Amount from '@/components/Wallet/Common/Amount.vue'
import ProposalStatistic from '@/components/Wallet/Governance/ProposalStatistic.vue'
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
      proposal: {}
    }
  },

  async fetch () {
    this.proposal = this.getProposal(this.id)
  },

  computed: {
    explorerUrl () {
      return this.$store.getters["app/url_account_explorer"];
    },
    microStakeDenom () {
      return this.$store.getters["app/micro_stake_denom"];
    },
    parsedDescription () {
      if (this.proposal === null) {
        return ''
      }
      const rgxUrl = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm
      return this.proposal.description.replace(rgxUrl, match => `<a href="${match}">${match}</a>`).replaceAll('↵', '<br />')
    },
  },

  methods: {
    // TODO: Placeholder
    getProposal (id) {
      return {
          abstain: "712303271059",
          deposit_end_time: "2021-02-11T21:07:30.044676Z",
          description: "Proposal to complete the Stargate upgrade, halt `cosmoshub-3` at 06:00 UTC on Feb 18th, export the state and start `cosmoshub-4` based on gaia 4.0.↵↵ Gaia Commit hash: ↵ a279d091c6f66f8a91c87943139ebaecdd84f689  Proposal details can be found on ↵ github: https://github.com/cosmos/governance/pull/13 ↵ Rendered: https://ipfs.io/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/example#/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ ipfs: https://cloudflare-ipfs.com/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ sia: https://siasky.net/EACAsPcUjpTEpQlG9_nRI1OR07gNeRiudfEWAvKnf0tj_Q ↵  ",
          initial_deposit_amount: "256000000",
          initial_deposit_denom: "uatom",
          moniker: "iqlusion",
          no: "7142724106",
          no_with_veto: "2230224099",
          proposal_id: 37,
          proposal_status: "Passed",
          proposal_type: "cosmos-sdk/TextProposal",
          proposer: "cosmos1grgelyng2v6v3t8z87wu3sxgt9m5s03xvslewd",
          submit_time: "2021-01-28T21:07:30.044676Z",
          title: "Stargate Upgrade- Second time is a charm!",
          total_deposit_amount: "567000000",
          total_deposit_denom: "uatom",
          tx_hash: "F15FACBF323E0874380E0B6E334ADFACA55FDD8732D977936DA9B1A0322B10A5",
          voting_end_time: "2021-02-12T05:35:54.623785Z",
          voting_start_time: "2021-01-29T05:35:54.623785Z",
          yes: "88530588570370"
        }
    },
    formatTimestamp (ts) {
      return formatTimestamp(ts)
    }
  }

}
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