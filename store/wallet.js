import { sleep } from '@/lib/utils'
import CryptoJS from 'crypto-js'

export const state = () => ({
  loading: false,
  wallets: [],
  selectedWallet: null
})

export const getters = {
  loading: state => {
    return state.loading
  },
  mnemonic: state => {
    return state.selectedWallet === null ? '' : state.wallets[state.selectedWallet].mnemonic
  },
  address: state => {
    return state.selectedWallet === null ? null : state.wallets[state.selectedWallet].address
  },
  type: state => {
    return state.selectedWallet === null ? null : state.wallets[state.selectedWallet].type
  },
  privateKey: state => {
    return state.selectedWallet === null ? '' : state.wallets[state.selectedWallet].privateKey
  },
  password: state => {
    return state.selectedWallet === null ? '' : state.wallets[state.selectedWallet].password
  },
  isLoggedIn: state => {
    return state.selectedWallet === null ? false : true
  },
}

export const mutations = {
  toggleLoading: (state) => {
    state.loading = !state.loading
  },
  addWallet: async (state, { type, privateKey, address }) => {
    state.wallets.push({
      type, privateKey, address
    })
  },
  delWallet: (state, index) => {
    state.wallets.pop(index)
  },
  connect: (state, index) => {
    state.selectedWallet = index
  },
  disconnect: (state, index) => {
    state.selectedWallet = null
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

      commit(`addWallet`, {
        type: 'localWallet',
        address,
        privateKey: pkEncrypted.toString()
      })

      const i = state.wallets.findIndex(w => w.address === address)
      commit(`connect`, i)

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

      commit(`addWallet`, {
        type: 'localWallet',
        address,
        privateKey: pkEncrypted.toString()
      })

      const i = state.wallets.findIndex(w => w.address === address)
      commit(`connect`, i)

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

      commit(`addWallet`, {
        type: 'keplrWallet',
        address,
        privateKey: null
      })

      const i = state.wallets.findIndex(w => w.address === address)
      commit(`connect`, i)

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
      commit(`addWallet`, {
        type: 'localWallet',
        address, privateKey, password
      })

      const i = state.wallets.findIndex(w => w.address === address)
      commit(`connect`, i)

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
}
