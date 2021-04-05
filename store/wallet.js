import { sleep } from '@/lib/utils'
import CryptoJS from 'crypto-js'

export const state = () => ({
  loading: false,
  wallet: null,
  tx: {
    response: null
  },
  msgs: [],
  isBroadcasting: false
})

export const getters = {
  loading: state => {
    return state.loading
  },
  mnemonic: state => {
    return state.wallet !== null ? state.wallet.mnemonic : null
  },
  address: state => {
    return state.wallet !== null ? state.wallet.address : null
  },
  type: state => {
    return state.wallet !== null ? state.wallet.type : null
  },
  privateKey: state => {
    return state.wallet !== null ? state.wallet.privateKey : null
  },
  password: state => {
    return state.wallet !== null ? state.wallet.password : null
  },
  isLoggedIn: state => {
    return state.wallet === null ? false : true
  },
  msgs: state => {
    return state.msgs
  },
  txResponse: state => {
    return state.tx.response
  },
  isBroadcasting: state => {
    return state.isBroadcasting
  }
}

export const mutations = {
  toggleLoading: (state) => {
    state.loading = !state.loading
  },
  connect: (state, { type, privateKey, address }) => {
    state.wallet = {
      type, privateKey, address
    }
  },
  disconnect: (state, index) => {
    state.wallet = null
  },
  setMessages: (state, payload) => {
    state.msgs = payload
  },
  setTxResponse: (state, payload) => {
    state.tx.response = payload
  },
  setBroadcasting: (state, payload) => {
    state.isBroadcasting = payload
  }
}

export const actions = {
  async createAccountWithMnemonic({
    commit, state, dispatch
  }, password) {
    // try {
    //   commit(`toggleLoading`)
    //   await sleep(200)

    //   const { address, mnemonic, privateKey } = this.$client.createAccountWithMneomnic()
    //   commit(`addWallet`, {
    //     address, mnemonic, privateKey, password
    //   })

    //   const i = state.wallets.findIndex(w => w.address === address)
    //   commit(`connect`, i)

    //   dispatch('bank/updateBalance', null, { root: true })
    //   dispatch('bank/subscribe', null, { root: true })

    //   commit(`toggleLoading`)
    // } catch (e) {
    //   commit(`toggleLoading`)
    //   console.error(e)
    // }
  },
  async generateAndDownloadKeyStore({
    commit,
    getters
  }) {
    try {
      commit(`toggleLoading`)
      await sleep(200)

      this.$client.generateAndDownloadKeyStore(getters.privateKey, getters.password)

      commit(`toggleLoading`)
    } catch (e) {
      commit(`toggleLoading`)
      console.error(e)
    }
  },
  async recoverAccountFromPrivateKey({
    commit, state, dispatch
  }, {
    privateKey, password
  }) {
    try {
      commit(`toggleLoading`)
      await sleep(200)

      const { address } = this.$client.recoverAccountFromPrivateKey(privateKey)

      const pkEncrypted = CryptoJS.AES.encrypt(privateKey, password)

      commit(`connect`, {
        type: 'localWallet',
        address,
        privateKey: pkEncrypted.toString()
      })

      dispatch('bank/updateBalance', null, { root: true })
      dispatch('bank/subscribe', null, { root: true })

      commit(`toggleLoading`)

      return true
    } catch (e) {
      commit(`toggleLoading`)
      console.error(e)
      return false
    }
  },
  async recoverAccountFromMnemonic({
    commit, state, dispatch
  }, {
    mnemonic, password
  }) {
    try {
      commit(`toggleLoading`)
      await sleep(200)

      // const encrypted = CryptoJS.AES.encrypt(mnemonic, password)
      // const decrypted = CryptoJS.AES.decrypt(encrypted, password)
      // console.log(encrypted)
      // console.log(decrypted.toString(CryptoJS.enc.Utf8))

      const {
        privateKey,
        address
      } = this.$client.recoverAccountFromMnemonic(mnemonic)

      const pkEncrypted = CryptoJS.AES.encrypt(privateKey, password)

      commit(`connect`, {
        type: 'localWallet',
        address,
        privateKey: pkEncrypted.toString()
      })

      dispatch('bank/updateBalance', null, { root: true })
      dispatch('bank/subscribe', null, { root: true })

      commit(`toggleLoading`)

      return true
    } catch (e) {
      commit(`toggleLoading`)
      console.error(e)
      return false
    }
  },
  recoverWalletFromKeplr({ commit, state, dispatch }, address) {
    try {
      commit(`toggleLoading`)

      commit(`connect`, {
        type: 'keplrWallet',
        address,
        privateKey: null
      })

      dispatch('bank/updateBalance', null, { root: true })
      dispatch('bank/subscribe', null, { root: true })

      commit(`toggleLoading`)

      return true
    } catch (e) {
      console.error(e)
    }
  },
  async recoverAccountFromKeystore({
    commit, state, dispatch
  }, {
    keystore,
    password
  }) {
    try {
      commit(`toggleLoading`)
      await sleep(200)

      const {
        privateKey,
        address
      } = this.$client.recoverAccountFromKeystore(keystore, password)

      commit(`connect`, {
        type: 'localWallet',
        address, privateKey, password
      })

      dispatch('bank/updateBalance', null, { root: true })
      dispatch('bank/subscribe', null, { root: true })

      commit(`toggleLoading`)

      return true
    } catch (e) {
      commit(`toggleLoading`)
      console.error(e)
      return false
    }
  },
  async disconnect({
    commit
  }) {
    try {
      commit(`disconnect`)
    } catch (e) {
      console.error(e)
    }
  },
  setMessages({
    commit
  }, payload) {
    try {
      commit(`setMessages`, payload)
    } catch (e) {
      console.error(e)
    }
  },
  clearMessages({
    commit
  }) {
    try {
      commit(`setMessages`, [])
    } catch (e) {
      console.error(e)
    }
  },

  setTxResponse({
    commit
  }, payload) {
    try {
      commit(`setTxResponse`, payload)
    } catch (e) {
      console.error(e)
    }
  },

  clearTxResponse({
    commit
  }) {
    try {
      commit(`setTxResponse`, null)
    } catch (e) {
      console.error(e)
    }
  },

  setBroadcasting({
    commit
  }, payload) {
    try {
      commit(`setBroadcasting`, payload)
    } catch (e) {
      console.error(e)
    }
  },
}
