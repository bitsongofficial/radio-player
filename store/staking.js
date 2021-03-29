import {
  calculateVotingPower, pubkeyToAddress
} from '@/lib/utils'

export const state = () => ({
  validators: [],
  delegations: []
})

export const getters = {
  validators: (state, getters) => {
    try {
      let rank = 1

      return [...state.validators].sort((a, b) => {
        return b.tokens - a.tokens
      }).map(val => {
        return {
          ...val,
          rank: rank++,
          voting_power_percent: (Number(getters.total_power) > 0 ? calculateVotingPower(Number(val.tokens), Number(getters.total_power)) : 0),
          address: pubkeyToAddress(val.consensus_pubkey)
        }
      })
    } catch (e) {
      console.error(e)
    }
  },

  total_active: state => {
    return state.validators.filter(v => v.status === 2).length
  },

  total_power: state => {
    let vals = state.validators.filter(v => v.status === 2)

    if (vals.length === 0) return 0

    return vals.reduce((a, b) => {
      const sum = Number(a) + Number(b.tokens)
      return sum
    }, 0)
  },

  delegations: (state) => {
    return state.delegations
  }
}

export const mutations = {
  setValidators: (state, payload) => {
    state.validators = payload
  },

  setDelegations: (state, payload) => {
    state.delegations = payload
  }
}

export const actions = {
  async getValidators({ commit }) {
    try {
      const bonded = await this.$btsg.getValidators()
      const unbonded = await this.$btsg.getValidators('unbonded')
      const unbonding = await this.$btsg.getValidators('unbonding')

      const validators = [
        ...bonded.result,
        ...unbonded.result,
        ...unbonding.result
      ]

      commit('setValidators', validators)
    } catch (e) {
      console.error(e)
    }
  },

  async getDelegations({ commit, getters, rootGetters }) {
    try {
      const address = rootGetters['wallet/address']
      if (address === null) return

      let delegations = await this.$btsg.getDelegations(address)
      const rewards = await this.$btsg.getDelegatorRewards(address)

      delegations = delegations
        .sort((a, b) => {
          return b.shares - a.shares
        })
        .map(d => {
          const val = getters.validators.find(
            v => v.operator_address === d.validator_address
          )

          let valReward = rewards.rewards.find(v => v.validator_address === val.operator_address).reward

          if (valReward === null) {
            valReward = [{
              denom: process.env.MICROSTAKEDENOM,
              amount: 0
            }]
          }

          return {
            ...d,
            validator_name: val !== undefined ? val.description.moniker : '',
            identity: val !== undefined ? val.description.identity : '',
            rewards: valReward[0],
            commission: val.commission.commission_rates.rate,
            status: val.status
          }
        })

      commit('setDelegations', delegations)
    } catch (e) {
      console.error(e)
    }
  }
}
