<template>
  <v-card flat>
    <v-card-title>
      <v-toolbar flat color="transparent">
        <v-spacer></v-spacer>
        <!-- TODO: disabled until implementation -->
        <v-btn
          :loading="loading"
          :disabled="true"
          color="orange darken-1"
          depressed
          outlined
          rounded
          ripple
          @click.stop="onNewProposal"
        >
          New Proposal
        </v-btn>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
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
          <a class="caption-1" :href="`/wallet/proposals/${item.proposal_id}`">
            {{ item.title }}
          </a>
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
    </v-card-text>
  </v-card>
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

  created() {
    this.proposals = this.getProposals();
  },

  computed: {
    microStakeDenom() {
      return this.$store.getters["app/micro_stake_denom"];
    }
  },

  methods: {
    getProposals() {
      // TODO: Placeholder
      return [
        {
          abstain: "712303271059",
          deposit_end_time: "2021-02-11T21:07:30.044676Z",
          description:
            "Proposal to complete the Stargate upgrade, halt `cosmoshub-3` at 06:00 UTC on Feb 18th, export the state and start `cosmoshub-4` based on gaia 4.0.↵↵ Gaia Commit hash: ↵ a279d091c6f66f8a91c87943139ebaecdd84f689  Proposal details can be found on ↵ github: https://github.com/cosmos/governance/pull/13 ↵ Rendered: https://ipfs.io/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/example#/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ ipfs: https://cloudflare-ipfs.com/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ sia: https://siasky.net/EACAsPcUjpTEpQlG9_nRI1OR07gNeRiudfEWAvKnf0tj_Q ↵  ",
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
          tx_hash:
            "F15FACBF323E0874380E0B6E334ADFACA55FDD8732D977936DA9B1A0322B10A5",
          voting_end_time: "2021-02-12T05:35:54.623785Z",
          voting_start_time: "2021-01-29T05:35:54.623785Z",
          yes: "88530588570370"
        },
        {
          abstain: "712303271059",
          deposit_end_time: "2021-02-11T21:07:30.044676Z",
          description:
            "Proposal to complete the Stargate upgrade, halt `cosmoshub-3` at 06:00 UTC on Feb 18th, export the state and start `cosmoshub-4` based on gaia 4.0.↵↵ Gaia Commit hash: ↵ a279d091c6f66f8a91c87943139ebaecdd84f689  Proposal details can be found on ↵ github: https://github.com/cosmos/governance/pull/13 ↵ Rendered: https://ipfs.io/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/example#/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ ipfs: https://cloudflare-ipfs.com/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ sia: https://siasky.net/EACAsPcUjpTEpQlG9_nRI1OR07gNeRiudfEWAvKnf0tj_Q ↵  ",
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
          tx_hash:
            "F15FACBF323E0874380E0B6E334ADFACA55FDD8732D977936DA9B1A0322B10A5",
          voting_end_time: "2021-02-12T05:35:54.623785Z",
          voting_start_time: "2021-01-29T05:35:54.623785Z",
          yes: "88530588570370"
        },
        {
          abstain: "712303271059",
          deposit_end_time: "2021-02-11T21:07:30.044676Z",
          description:
            "Proposal to complete the Stargate upgrade, halt `cosmoshub-3` at 06:00 UTC on Feb 18th, export the state and start `cosmoshub-4` based on gaia 4.0.↵↵ Gaia Commit hash: ↵ a279d091c6f66f8a91c87943139ebaecdd84f689  Proposal details can be found on ↵ github: https://github.com/cosmos/governance/pull/13 ↵ Rendered: https://ipfs.io/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/example#/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ ipfs: https://cloudflare-ipfs.com/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ sia: https://siasky.net/EACAsPcUjpTEpQlG9_nRI1OR07gNeRiudfEWAvKnf0tj_Q ↵  ",
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
          tx_hash:
            "F15FACBF323E0874380E0B6E334ADFACA55FDD8732D977936DA9B1A0322B10A5",
          voting_end_time: "2021-02-12T05:35:54.623785Z",
          voting_start_time: "2021-01-29T05:35:54.623785Z",
          yes: "88530588570370"
        },
        {
          abstain: "712303271059",
          deposit_end_time: "2021-02-11T21:07:30.044676Z",
          description:
            "Proposal to complete the Stargate upgrade, halt `cosmoshub-3` at 06:00 UTC on Feb 18th, export the state and start `cosmoshub-4` based on gaia 4.0.↵↵ Gaia Commit hash: ↵ a279d091c6f66f8a91c87943139ebaecdd84f689  Proposal details can be found on ↵ github: https://github.com/cosmos/governance/pull/13 ↵ Rendered: https://ipfs.io/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/example#/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ ipfs: https://cloudflare-ipfs.com/ipfs/QmYn2SxCMYk5SWs5GMcXdbXR8wMCCXRmCyW19SFyzSeZp1 ↵ sia: https://siasky.net/EACAsPcUjpTEpQlG9_nRI1OR07gNeRiudfEWAvKnf0tj_Q ↵  ",
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
          tx_hash:
            "F15FACBF323E0874380E0B6E334ADFACA55FDD8732D977936DA9B1A0322B10A5",
          voting_end_time: "2021-02-12T05:35:54.623785Z",
          voting_start_time: "2021-01-29T05:35:54.623785Z",
          yes: "88530588570370"
        }
      ]
    },
    onNewProposal () {
      // TODO: Placeholder
      return false
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
