export const state = () => ({
  dark_theme: true,
  stake_denom: process.env.STAKEDENOM,
  micro_stake_denom: process.env.MICROSTAKEDENOM,
  gas_price: process.env.DEFAULT_GAS_PRICE,
  gas_limit: process.env.DEFAULT_GAS_LIMIT,
  decimals: process.env.DECIMALS,
  address_length: process.env.ADDRESS_LENGTH,
  address_prefix: process.env.ADDRESS_PREFIX,
  url_account_explorer: process.env.URL_ACCOUNT_EXPLORER
})

export const getters = {
  dark_theme: state => {
    return state.dark_theme
  },
  stake_denom: state => {
    return state.stake_denom.toUpperCase()
  },
  micro_stake_denom: state => {
    return state.micro_stake_denom.toUpperCase()
  },
  gas_price: state => {
    return state.gas_price
  },
  gas_limit: state => {
    return state.gas_limit
  },
  address_length: state => {
    return state.address_length
  },
  address_prefix: state => {
    return state.address_prefix
  },
  decimals: state => {
    return state.decimals
  },
  url_account_explorer: state => {
    return state.url_account_explorer;
  }
}

export const mutations = {
  toggleDarkTheme: (state) => {
    state.dark_theme = !state.dark_theme
  }
}
