import Setting from '../../api/setting';

const setting = new Setting();

const settingModule = {
  namespaced: true,
  state: {
    settings: [],
    load: false,
    total: 0,
  },
  getters: {
    settings: state => state.settings,
    load: state => state.load,
    total: state => state.total,
  },
  mutations: {
    SET_TOTAL(state, total) {
      state.total = total;
    },
    SET_SETTINGS(state, settings) {
      state.settings = settings;
    },
    SET_LOAD(state, load) {
      state.load = load;
    },
  },
  actions: {
    settings({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        setting
          .index(payload.query)
          .then(response => {
            commit('SET_SETTINGS', response.settings);
            commit('SET_TOTAL', response.count);
            commit('SET_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
            commit('SET_LOAD', false);
          });
      });
    },
    change({ commit }, id) {
        commit('SET_LOAD', true);
      return new Promise((resolve, reject) => {
        setting
          .change(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
            commit('SET_LOAD', false);
          });
      });
    },
  },
};

export default settingModule;
