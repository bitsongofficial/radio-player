<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="800"
    :value="true"
  >
    <v-card>
      <v-card-text>
        <staking-redelegate
          v-model="value"
          v-on:txSuccess="getDelegations"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('cancel')">Close</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import StakingRedelegate from '@/components/Wallet/Staking/Redelegate'

export default {
  components: {
    StakingRedelegate
  },

  props: {
    value: Object
  },

  computed: {
    address() {
      return this.$store.getters[`wallet/address`]
    }
  },

  data() {
    return {
      loading: false,
      delegations: []
    }
  },

  async created () {
    await this.getDelegations()
  },

  methods: {
    async getDelegations() {
      try {
        this.loading = true
        const validators = await this.$btsg.getValidators()
        const delegations = await this.$btsg.getDelegations(this.address)

        this.delegations = delegations
          .sort((a, b) => {
            return b.shares - a.shares
          })
          .map(d => {
            const val = validators.result.find(
              v => v.operator_address === d.validator_address
            )
            return {
              ...d,
              validator_name: val !== undefined ? val.description.moniker : '',
              identity: val !== undefined ? val.description.identity : ''
            }
          })

        this.loading = false
      } catch (e) {
        console.error(e)
      }
    }
  }

}
</script>
