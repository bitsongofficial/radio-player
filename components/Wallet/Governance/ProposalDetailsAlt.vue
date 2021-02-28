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
      <ul>
        
        <!-- Proposer of proposal -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Proposer
          </div>
          <div class="info-value">
            <a :href="`${explorerUrl}/${proposal.proposer}`"> {{ proposal.moniker }}</a>
          </div>
        </li>

        <!-- Initial deposit -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Initial Deposit
          </div>
          <div class="info-value">
            <amount
              style="font-size: 14pt"
              :micro-amount="proposal.initial_deposit_amount"
              :denom="microStakeDenom"
            />
          </div>
        </li>

        <!-- Total Deposit -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Total Deposit
          </div>
          <div class="info-value">
            <amount
              style="font-size: 14pt"
              :micro-amount="proposal.total_deposit_amount"
              :denom="microStakeDenom"
            />
          </div>
        </li>

        <!-- Voting Start -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Voting Start
          </div>
          <div class="info-value">
            {{ formatTimestamp(proposal.voting_start_time) }}
          </div>
        </li>

        <!-- Voting end -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Voting End
          </div>
          <div class="info-value">
            {{ formatTimestamp(proposal.voting_end_time) }}
          </div>
        </li>

        <!-- Proposal type -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Type
          </div>
          <div class="info-value">
            {{ proposal.proposal_type }}
          </div>
        </li>

        <!-- Submit Time -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Submit Time
          </div>
          <div class="info-value">
            {{ formatTimestamp(proposal.submit_time) }}
          </div>
        </li>

        <!-- Deposit End Time -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Deposit End Time
          </div>
          <div class="info-value">
            {{ formatTimestamp(proposal.deposit_end_time) }}
          </div>
        </li>

        <!-- Description proposal -->
        <li class="d-flex mb-4">
          <div class="info-label">
            Description
          </div>
          <div class="info-value">
            <p class="overflow-wrap">{{ proposal.description }}</p>
          </div>
        </li>

      </ul>
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
    }
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
.info-value {
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 15px;
}
.dotted-overflow-text {
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.overflow-wrap {
  overflow-wrap: anywhere;
}
</style>