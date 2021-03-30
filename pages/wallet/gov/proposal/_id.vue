<template>
  <v-container fluid>
    <proposal-details :id="id" />
    <proposal-votes-detail v-if="false" :id="id" class="my-5" />
    <depositors v-if="false" :id="id" />
  </v-container>
</template>

<script>
import PageTemplate from "@/components/PageTemplate";
import ProposalDetails from "~/components/Wallet/Governance/ProposalDetails.vue";
import ProposalVotesDetail from "~/components/Wallet/Governance/ProposalVotesDetail.vue";
import Depositors from "~/components/Wallet/Governance/Depositors.vue";

export default {
  components: {
    PageTemplate,
    ProposalDetails,
    ProposalVotesDetail,
    Depositors
  },

  async fetch() {
    this.id = this.$route.params.id;
  },

  head() {
    const title = `Proposal details ${this.id}`;
    return {
      title: title,
      meta: [{ hid: "og-title", name: "og:title", content: title }]
    };
  }
};
</script>
