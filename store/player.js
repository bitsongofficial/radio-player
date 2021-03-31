import { PLAYER_STATUS } from '@/lib/utils'

export const state = () => ({
  status: PLAYER_STATUS.READY,
  currentTrack: null,
  currentTime: 0
})

export const getters = {
  ready: state => {
    return state.status === PLAYER_STATUS.READY
  },
  loading: state => {
    return state.status === PLAYER_STATUS.LOADING
  },
  playing: state => {
    return state.status === PLAYER_STATUS.PLAY
  },
  paused: state => {
    return state.status === PLAYER_STATUS.PAUSE
  },
  currentTrack: state => {
    return state.currentTrack
  },
  currentTime: state => {
    return state.currentTime
  }
}

export const mutations = {
  SET_LOADING: (state, payload) => {
    state.loading = payload
  },
  SET_CURRENT_TRACK: (state, payload) => {
    state.currentTrack = payload
  },
  SET_STATUS: (state, payload) => {
    state.status = payload
  }
}

export const actions = {
  async setCurrentTrack({ commit }, payload) {
    try {
      const radio = await this.$api.getRadioStreamBySlug(payload)
      commit('SET_CURRENT_TRACK', {
        ...radio.data,
        slug: payload
      })
    } catch (e) {
      console.error(e)
    }
  },

  stop({ commit }) {
    commit('SET_STATUS', PLAYER_STATUS.READY)
  },

  pause({ commit }) {
    commit('SET_STATUS', PLAYER_STATUS.PAUSE)
  },

  play({ commit }) {
    commit('SET_STATUS', PLAYER_STATUS.PLAY)
  },

  ready({ commit }) {
    commit('SET_STATUS', PLAYER_STATUS.READY)
  },
  destroy({ commit }) {
    commit('SET_STATUS', PLAYER_STATUS.READY)
    commit('SET_CURRENT_TRACK', null)
  }
}
