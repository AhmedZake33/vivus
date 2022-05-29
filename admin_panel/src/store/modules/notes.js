import Notes from '../../api/notes';

const notes = new Notes();

const notesModule = {
  namespaced: true,
  state: {
    notes: [],
    lastNote: null,
    subState: null,
    notesLoading: false,
    currentStatus: null,
    canEdit: null,
    canApprove: Boolean,
    canRepApprove: Boolean,
    alert: Boolean,
  },
  getters: {
    notes: state => state.notes,
    lastNote: state => state.lastNote,
    subState: state => state.subState,
    notesLoading: state => state.notesLoading,
    currentStatus: state => state.currentStatus,
    canApprove: state => state.canApprove,
    canRepApprove: state => state.canRepApprove,
    canEdit: state => state.canEdit,
    alert: state => state.alert,
  },
  mutations: {
    SET_NOTES(state, notes) {
      state.notes = notes;
    },
    SET_LAST_NOTE(state, lastNote) {
      state.lastNote = lastNote;
    },
    SET_SUBMISSION_STATUS(state, subState) {
      state.subState = subState;
    },
    SET_NOTES_LOAD(state, notesLoading) {
      state.notesLoading = notesLoading;
    },
    SET_CURRENT_STATUS(state, currentStatus) {
      state.currentStatus = currentStatus;
    },
    SET_CAN_EDIT(state, canEdit) {
      state.canEdit = canEdit;
    },
    SET_CAN_APPROVE(state, canApprove) {
      state.canApprove = canApprove;
    },
    SET_CAN_REP_APPROVE(state, canRepApprove) {
      state.canRepApprove = canRepApprove;
    },
    SET_ALERT(state, alert) {
      state.alert = alert;
    },
  },
  actions: {
    subState({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_NOTES_LOAD', true);
        notes
          .getSubState(id)
          .then(response => {
            commit('SET_SUBMISSION_STATUS', response.submissionStatus);
            commit('SET_CURRENT_STATUS', response.currentStatus);
            commit('SET_NOTES', response.notes);
            commit('SET_CAN_APPROVE', response.canApprove);
            commit('SET_CAN_REP_APPROVE', response.canRepresentativeApprove);
            commit('SET_LAST_NOTE', response.lastNote);
            commit('SET_CAN_EDIT', response.canEdit);
            commit('SET_ALERT', response.alert);
            commit('SET_NOTES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    changeSubState({ commit }, payload) {
      return new Promise((resolve, reject) => {
        notes
          .changeSubState(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    preChangeSubState({ commit }, payload) {
      return new Promise((resolve, reject) => {
        notes.preChangeSubState(payload)
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

export default notesModule;
