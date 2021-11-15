import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
//Vue.use(Vue)

export const store = new Vuex.Store({
    state: {
        states: []
    },

    actions: {
        async getStates({commit}) {
            axios.get('http://localhost:4895/api/v1/state')
                .then(response => {
                    console.log(response)
                    commit('setStates', response.data.data.states)
                })
        }
    },

    mutations: {
        setStates(state, states) {
            state.states = states
        }
    }

})