import EvaluationNotes from '../../api/evaluationNotes';

const evaluationNotes = new EvaluationNotes();

const evaluationNotesModule = {
  namespaced: true,
  state: {
    evNotes: Array,
    canApprove: null,
    complete: null,
    loadnotes: null,
  },
  getters: {
    evNotes: state => {
      let array = [];
      if(state.evNotes){
        state.evNotes.forEach(element => {
          let obj = {};
          obj['approval'] = element.approval.filter(app => app.status == 1);
          obj['messages'] = element.approval;
          obj['level'] = element.level;
          array.push(obj);
        });
        return array;
      }
    },
    evNotesLevel: state => state.evNotes.level,
    evNotesApprovals: state => state.evNotes.approval,
  },
  mutations: {
    SET_EV_NOTES(state, notes) {
      state.evNotes = notes;
    },
    SET_EV_NOTES_LOAD(state, loadnotes) {
      state.loadnotes = loadnotes;
    },
    SET_CAN_APPROVE(state, canApprove) {
      state.canApprove = canApprove;
    },
    SET_COMPLETE(state, complete) {
      state.complete = complete;
    },
  },
  actions: {
    editDecision({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_EV_NOTES_LOAD', true);
        evaluationNotes
          .editDecision(payload)
          .then(response => {
            commit('SET_EV_NOTES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getEvaluationNotes({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_EV_NOTES_LOAD', true);
        evaluationNotes
          .get(id)
          .then(response => {
            commit('SET_EV_NOTES', response.notes);
            commit('SET_EV_NOTES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    changeSubState({ commit }, payload) {
      commit('archive/SET_GENERAL_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        evaluationNotes
          .changeSubState(payload)
          .then(response => {
            commit('archive/SET_GENERAL_LOAD', false, { root: true });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default evaluationNotesModule;
