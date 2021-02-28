<template>
  <v-flex class="">
    <div class="font-weight-bold">
      {{ title }}
    </div>
    <div class="my-1">
      {{ percentage }}%
    </div>
    <amount
      style="font-size: 12pt"
      :micro-amount="votes"
      :denom="microStakeDenom"
    />
  </v-flex>
</template>

<script>
import Amount from '@/components/Wallet/Common/Amount.vue'
import { pergentageOf } from '@/lib/utils'

export default {

  components: {
    Amount
  },

  props: {
    title: {
      type: String,
      required: true
    },
    totals: {
      type: Number,
      required: true
    },
    votes: {
      type: [Number, String],
      required: true
    }
  },

  computed: {
    percentage () {
      return pergentageOf(this.votes, this.totals)
    },
    microStakeDenom () {
      return this.$store.getters["app/micro_stake_denom"];
    }
  }

}
</script>

<style>

</style>