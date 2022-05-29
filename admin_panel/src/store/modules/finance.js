import Finance from '../../api/finance';

const finance = new Finance();

const financeModule = {
  namespaced: true,
  state: {
    submissions: [],
    bonuses: [],
    bonusesLoad: false,
    totalBonuses: 0,
    submissionsLoad: false,
    totalSubmission: 0,
    submission: null,
    payment: null,
    team: null,
    representative: null,
    status: null,
    load: null,
    data: null,
    types: [],
    levels: [],
    lookups: [],
    total: null,
    wallet: null,
    exchanges: null,
    extraction: null,
    credit_data: null,
    gps:null,
  },
  getters: {
    submissions: state => state.submissions,
    lookups: state => state.lookups,
    bonuses: state => state.bonuses,
    data: state => state.data,
    bonusesLoad: state => state.bonusesLoad,
    totalBonuses: state => state.totalBonuses,
    wallet(state) {
      if (state.wallet) {
        return Object.entries(state.wallet)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(
            param =>
              !param.key.includes('id') &&
              param.key !== 'university' &&
              param.key !== 'old_Moderea_CD' &&
              param.key !== 'name' &&
              param.key !== 'system' &&
              param.key !== 'removed' &&
              param.key !== 'latitude' &&
              param.key !== 'longitude' &&
              param.key !== 'is_general' &&
              param.key !== 'old_Edara_code' &&
              param.key !== 'search_text' &&
              param.key !== 'created_by' &&
              param.key !== 'government_id' &&
              param.key !== 'governmental' &&
              param.key !== 'high' &&
              param.key !== 'sector' &&
              param.key !== 'student_count' &&
              param.key !== 'education_type' &&
              param.value !== null
          );
      }
    },
    extraction(state) {
      if (state.extraction) {
        return Object.entries(state.extraction).map(([key, value]) => {
          return { key, value };
        });
      }
    },
    exchanges(state) {
      if (state.exchanges) {
        return Object.entries(state.exchanges).map(([key, value]) => {
          return { key, value };
        });
      }
    },
    submission(state) {
      if (state.submission) {
        return Object.entries(state.submission)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(
            param =>
              !param.key.includes('id') &&
              !param.key.includes('authorized') &&
              param.key !== 'approved' &&
              param.key !== 'organization_area' &&
              param.key !== 'education_type' &&
              param.key !== 'student_count' &&
              param.key !== 'expired' &&
              param.key !== 'removed' &&
              param.key !== 'temp_organization_name' &&
              param.key !== 'temp_university_name' &&
              param.key !== 'name' &&
              param.key !== 'status' &&
              param.value !== null
          );
      }
    },
    payment: state => state.payment,
    gps: state => state.gps,
    team: state => state.team,
    levels: state => state.levels,
    status: state => state.status,
    representative: state => state.representative,
    load: state => state.load,
    types: state => state.types,
    submissionsLoad: state => state.submissionsLoad,
    totalSubmission: state => state.totalSubmission,
  },
  mutations: {
    SET_TOTAL_SUBMISSIONS(state, total) {
      state.totalSubmission = total;
    },
    SET_TOTAL(state, data) {
      state.total = data;
    },
    SET_SUBMISSIONS(state, submissions) {
      state.submissions = submissions;
    },
    SET_SUBMISSION(state, submission) {
      state.submission = submission;
    },
    SET_TYPES(state, types) {
      state.types = types;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
    SET_DATA(state, data) {
      state.data = data;
    },
    SET_CREDIT_DATA(state, data) {
      state.credit_data = data;
    },
    SET_TEAM(state, team) {
      state.team = team;
    },
    SET_SUBMISSIONS_LOAD(state, load) {
      state.submissionsLoad = load;
    },
    SET_BONUSES_LOAD(state, load) {
      state.bonusesLoad = load;
    },
    SET_BONUSES(state, bonuses) {
      state.bonuses = bonuses;
    },
    SET_TOTAL_BONUSES(state, total) {
      state.totalBonuses = total;
    },
    SET_LOAD(state, load) {
      state.load = load;
    },
    SET_PAYMENT(state, payment) {
      state.payment = payment;
    },
    SET_STATUS(state, status) {
      state.status = status;
    },
    SET_LEVELS(state, levels) {
      state.levels = levels;
    },
    SET_GPS(state,data){
      state.gps = data
    },
    SET_REPRESENTATIVE(state, representative) {
      state.representative = representative;
    },
    SET_WALLET(state, [type, data, exchanges]) {
      if (data) {
        state.wallet = data;
      }
      if (!type) {
        state.exchanges = exchanges;
      } else {
        state.extraction = exchanges;
      }
    },
  },
  actions: {
    submissions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSIONS_LOAD', true);
        finance
          .list(payload.query)
          .then(response => {
            commit('SET_SUBMISSIONS', response.submissions);
            commit('SET_LOOKUPS', response.lookups);
            // commit('SET_TYPES', response.types);
            // commit('submission/SET_VISIT_TYPES', response.visit_types,{root:true});
            // commit('SET_LEVELS', response.levels);
            commit('SET_TOTAL_SUBMISSIONS', response.count);
            commit('SET_SUBMISSIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    users({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_BONUSES_LOAD', true);
        finance
          .users(payload.query)
          .then(response => {
            commit('SET_BONUSES', response.bonuses);
            commit('SET_TOTAL_BONUSES', response.count);
            commit('SET_DATA', response.data);
            commit('SET_BONUSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    wallets({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_BONUSES_LOAD', true);
        finance
          .wallets(payload.query)
          .then(response => {
            commit('SET_WALLET', [false, state.credit, response.details]);
            commit('SET_DATA', response.groups);
            commit('SET_TOTAL', response.count);
            commit('SET_BONUSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    wallet({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        finance
          .wallet(id)
          .then(response => {
            commit('SET_WALLET', [true, response.payment, response.details]);
            // commit('SET_REPRESENTATIVE', response.representative);
            commit('SET_GPS', response.gps);
            // commit('user/SET_SYSTEM', response.system, { root: true });
            // commit('SET_TEAM', response.team);
            // commit('SET_PAYMENT', response.payment);
            commit('SET_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    submission({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        finance
          .show(id)
          .then(response => {
            commit('SET_SUBMISSION', response.details);
            commit('SET_REPRESENTATIVE', response.representative);
            commit('SET_STATUS', response.status);
            commit('user/SET_SYSTEM', response.system, { root: true });
            commit('SET_TEAM', response.team);
            commit('SET_PAYMENT', response.payment);
            commit('SET_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveBonus({ commit }, payload) {
      return new Promise((resolve, reject) => {
        finance
          .saveBonus(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveWallet({ commit }, payload) {
      return new Promise((resolve, reject) => {
        finance
          .saveWallet(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveGpTransfer({ commit }, payload) {
      return new Promise((resolve, reject) => {
        finance
          .saveGpTransfer(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveTransaction({ commit }, payload) {
      return new Promise((resolve, reject) => {
        finance
          .saveTransaction(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    cancelTransaction({ commit }, id) {
      return new Promise((resolve, reject) => {
        finance
          .cancelTransaction(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    cancelBonus({ commit }, id) {
      return new Promise((resolve, reject) => {
        finance
          .cancelBonus(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default financeModule;
