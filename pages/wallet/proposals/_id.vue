<template>
  <page-template>
    <h1 class="text-h2 mb-2">Proposal details</h1>
    <proposal-details :id="id" />
    <proposal-votes-detail :id="id" class="my-5" />
    <depositors :id="id" />
  </page-template>
</template>

<script>
import PageTemplate from "@/components/PageTemplate"
import ProposalDetails from '~/components/Wallet/Governance/ProposalDetails.vue'
import ProposalVotesDetail from '~/components/Wallet/Governance/ProposalVotesDetail.vue'
import Depositors from '~/components/Wallet/Governance/Depositors.vue'

export default {
  
  components: {
    PageTemplate,
    ProposalDetails,
    ProposalVotesDetail,
    Depositors
  },

  async fetch () {
    this.id = this.$route.params.id
  },

  data() {
    return {
      id: null
    }
  },

  head() {
    const title = `Proposal details ${this.id}`
    return {
      title: title,
      meta: [{ hid: 'og-title', name: 'og:title', content: title }]
    }
  }

}
</script>
