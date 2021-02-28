<template>
  <page-template>
    <h1 class="text-h2 mb-2">Proposal details</h1>
    <proposal-details-alt :id="id" />
    <proposal-votes-detail :id="id" class="my-5" />
    <depositors :id="id" />
  </page-template>
</template>

<script>
import PageTemplate from "@/components/PageTemplate"
import ProposalDetailsAlt from '~/components/Wallet/Governance/ProposalDetailsAlt.vue'
import ProposalVotesDetail from '~/components/Wallet/Governance/ProposalVotesDetail.vue'
import Depositors from '~/components/Wallet/Governance/Depositors.vue'

/*
  TODO: Choose between this or other version
*/
export default {
  
  components: {
    PageTemplate,
    ProposalDetailsAlt,
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
