import Ticket from '../../api/ticket';

const ticket = new Ticket();

const ticketModule = {
  namespaced: true,
  state: {
    tickets: [],
    load: false,
    total: 0,
  },
  getters: {
    tickets: state => state.tickets,
    load: state => state.load,
    total: state => state.total,
  },
  mutations: {
    SET_TOTAL(state, total) {
      state.total = total;
    },
    SET_TICKETS(state, tickets) {
      state.tickets = tickets;
    },
    SET_LOAD(state, load) {
      state.load = load;
    },
  },
  actions: {
    tickets({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        ticket
          .index(payload.query)
          .then(response => {
            commit('SET_TICKETS', response.tickets);
            commit('SET_TOTAL', response.count);
            commit('SET_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    add({ commit }, payload) {
      commit('SET_LOAD', true);
      return new Promise((resolve, reject) => {
        ticket
          .add(payload)
          .then(response => {
            commit('SET_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    get({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        ticket
          .get(payload)
          .then(response => {
            commit('SET_TICKETS', response.tickets);
            commit('SET_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default ticketModule;
