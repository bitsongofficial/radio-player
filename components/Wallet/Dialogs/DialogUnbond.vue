<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="800"
    :value="true"
  >
    <v-card flat>
      <v-card-text>
        <staking-unbond
          id="unbond"
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
import StakingUnbond from '@/components/Wallet/Staking/Unbond'

export default {
  components: {
    StakingUnbond
  },

  props: {
    value: Object
  },

  computed: {
    address() {
      return this.$store.getters[`wallet/address`]
    }
  },

  methods: {
    async getDelegations() {
      try {
        const validators = await this.$btsg.getValidators()
        const delegations = await this.$btsg.getDelegations(this.address)

        return delegations
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
      } catch (e) {
        console.error(e)
        return []
      }
    }
  }

}
</script>
