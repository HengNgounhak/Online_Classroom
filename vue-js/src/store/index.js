import { createStore } from 'vuex'
import api from '../services/api'

// Create a new store instance.
const store = createStore({
    state() {
        return {
            user: {}
        }
    },
    getters: {
        user: state => state.user
    },
    actions: {
        async getUser({ commit }, token) {
            await api().post('getUser', {
                token: token
            }).then((value) => {
                commit('setUser', value.data.user.data)
            }).catch((err) => {
                console.log(err)
            })

        }
    },
    mutations: {
        setUser: (state, user) => (state.user = user)
    },
})

export default store