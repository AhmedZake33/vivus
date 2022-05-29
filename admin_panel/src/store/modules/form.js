import Forms from '../../api/forms';

const form = new Forms();

const formModule = {
  namespaced: true,
  state: {
    forms: [],
    subQuestions: [],
    formsLoad: false,
    totalForms: 0,
    form: Object,
    formLoad: false,
    more: true,
    selectedForm: null,
    categories:null,
    types:null,
  },
  getters: {
    forms(state) {
      return state.forms;
    },
    formsLoad(state) {
      return state.formsLoad;
    },
    totalForms(state) {
      return state.totalForms;
    },
    form(state) {
      return state.form;
      // return Object.entries(state.form).map(([key, value]) => {
      //     return {key, value}
      // }).filter(param => (!param.key.includes('id')  && param.key !== 'search_text' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null));
    },
    name(state) {
      if (state.form) {
        return state.form.name;
      }
      return '';
    },
    status(state) {
      if (state.form) {
        return state.form.removed;
      }
      return '';
    },
    formLoad(state) {
      return state.formLoad;
    },
    subQuestions(state) {
      return state.subQuestions;
    },
    selectedForm: state => state.selectedForm,
  },
  mutations: {
    SET_TOTAL_FORMS(state, total) {
      state.totalForms = total;
    },
    SET_FORMS(state, forms) {
      state.forms = forms;
    },
    SET_FORMS_LOAD(state, load) {
      state.formsLoad = load;
    },
    SET_FORM_LOAD(state, load) {
      state.formLoad = load;
    },
    SET_FORM(state, form) {
      state.form = form;
    },
    SET_SUB_QUESTIONS(state, subQuestions) {
      state.subQuestions = subQuestions;
    },
    SET_SELECTED_FORM(state, selectedForm) {
      state.selectedForm = selectedForm;
    },
    SET_FORMS_MORE(state, more) {
      state.more = more;
    },
    SET_TYPES(state, types) {
      state.types = types;
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
  },
  actions: {
    forms({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_FORMS_LOAD', true);
        form
          .list(payload.query)
          .then(response => {
            commit('SET_FORMS', response.forms);
            commit('SET_TYPES', response.types);
            commit('SET_CATEGORIES', response.categories);
            commit('SET_FORMS_MORE', response.more);
            commit('SET_TOTAL_FORMS', payload.query.search_text !== '' ? response.forms.length : response.count);
            commit('SET_FORMS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    form({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_FORM_LOAD', true);
        form
          .get(id)
          .then(response => {
            commit('SET_FORM', response.form);
            commit('SET_FORM_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    addRubric({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_FORM_LOAD', true);
        form
          .addRubric(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    addTool({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_FORM_LOAD', true);
        form
          .addTool(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    addForm({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_FORM_LOAD', true);
        form
          .add(payload)
          .then(response => {
            commit('SET_SELECTED_FORM', response.form);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    addQuestion({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_FORM_LOAD', true);
        form
          .addQuestion(payload)
          .then(response => {
            // commit('SET_SELECTED_FORM', response.form);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    subquestions({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_FORM_LOAD', true);
        form
          .getsubform(id)
          .then(response => {
            commit('SET_SUB_QUESTIONS', response.subQuestions);
            commit('SET_FORM_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default formModule;
