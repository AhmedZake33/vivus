import directorates from '../../api/directorate';

const directorate = new directorates();

const directorateModule = {
  namespaced: true,
  state: {
    directorates: [],
    directoratesLoad: false,
    totaldirectorates: 0,
    directorate: {},
    directorateLoad: false,
    institutes: [],
    institutesLoad: false,
    totalInstitutes: 0,
    schools: null,
  },
  getters: {
    schools(state) {
      return state.schools;
    },
    directorates(state) {
      return state.directorates;
    },
    directorate(state) {
      return Object.entries(state.directorate)
        .map(([key, value]) => {
          return { key, value };
        })
        .filter(param => !param.key.includes('id') && param.key !== 'search_text' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null);
    },
    name(state) {
      if (state.directorate) {
        return state.directorate.name;
      }
      return '';
    },
    directorateLoad(state) {
      return state.directorateLoad;
    },
    directoratesLoad(state) {
      return state.directoratesLoad;
    },
    totaldirectorates(state) {
      return state.totaldirectorates;
    },
    institutes(state) {
      return state.institutes;
    },
    institutesLoad(state) {
      return state.institutesLoad;
    },
    totalInstitutes(state) {
      return state.totalInstitutes;
    },
  },
  mutations: {
    SET_TOTAL_DIRECTORATES(state, total) {
      state.totaldirectorates = total;
    },
    SET_SCHOOLS(state, schools) {
      state.schools = schools;
    },
    SET_DIRECTORATES(state, directorates) {
      state.directorates = directorates;
    },
    SET_DIRECTORATES_LOAD(state, load) {
      state.directoratesLoad = load;
    },
    SET_UNIVERSITY_LOAD(state, load) {
      state.directorateLoad = load;
    },
    SET_DIRECTORATE(state, directorate) {
      state.directorate = directorate;
    },
    SET_TOTAL_INSTITUTES(state, total) {
      state.totalInstitutes = total;
    },
    SET_INSTITUTES(state, institutes) {
      state.institutes = institutes;
    },
    SET_INSTITUTES_LOAD(state, load) {
      state.institutesLoad = load;
    },
  },
  actions: {
    schools({ commit },id) {
      return new Promise((resolve, reject) => {
        // commit('SET_DIRECTORATES_LOAD', true);
        directorate
          .schools(id)
          .then(response => {
            commit('SET_SCHOOLS', response.organizations);
            // commit('SET_TOTAL_DIRECTORATES', payload.query.search_text !== "" ? response.directorates.length : response.count);
            // commit('SET_DIRECTORATES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getMyGovernment({ commit },payload) {
        return new Promise((resolve, reject) => {
          commit('SET_DIRECTORATES_LOAD', true);
          directorate
            .getMyGovernment(payload)
            .then(response => {
            //   commit('SET_DIRECTORATES', response.directorates);
              // commit('SET_TOTAL_DIRECTORATES', payload.query.search_text !== "" ? response.directorates.length : response.count);
              commit('SET_DIRECTORATES_LOAD', false);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        });
      },
    directorates({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_DIRECTORATES_LOAD', true);
        directorate
          .list()
          .then(response => {
            commit('SET_DIRECTORATES', response.directorates);
            // commit('SET_TOTAL_DIRECTORATES', payload.query.search_text !== "" ? response.directorates.length : response.count);
            commit('SET_DIRECTORATES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    directorate({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_UNIVERSITY_LOAD', true);
        directorate
          .get(id)
          .then(response => {
            commit('SET_UNIVERSITY', response.directorate);
            commit('SET_UNIVERSITY_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    institutes({ commit }, payload) {
      return new Promise((resolve, reject) => {
        // commit('SET_INSTITUTES_LOAD', true);
        directorate
          .listInstitutes(payload)
          .then(response => {
            commit('SET_INSTITUTES', response.institutes);
            // commit('SET_TOTAL_INSTITUTES', payload.query.search_text !== "" ? response.institutes.length : response.count);
            // commit('SET_INSTITUTES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default directorateModule;
