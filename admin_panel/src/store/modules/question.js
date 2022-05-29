import Question from '../../api/question'

const question = new Question();

const questionModule = {
    namespaced: true,
    state: {
        questions: [],
        questionsLoad: false,
        totalQuestions: 0,
        question: Object,
        questionLoad: Boolean
    },
    getters: {
        questions(state) {
            return state.questions
        },
        questionsLoad(state) {
            return state.questionsLoad
        },
        totalQuestions(state) {
            return state.totalQuestions;
        },
        question(state) {
            return Object.entries(state.question).map(([key, value]) => {
                return {key, value}
            }).filter(param => (!param.key.includes('id')  && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null));
        },
        name(state){
            if (state.question){
                return state.question.name
            }
            return  ''
        },
        status(state){
            if (state.question){
                return state.question.removed
            }
            return  ''
        },
        questionLoad(state) {
            return state.questionLoad
        }
    },
    mutations: {
        SET_TOTAL_QUESTIONS(state, total) {
            state.totalQuestions = total;
        },
        SET_QUESTIONS(state, questions) {
            state.questions = questions;
        },
        SET_QUESTIONS_LOAD(state, load) {
            state.questionsLoad = load;
        },
        SET_QUESTION_LOAD(state, load) {
            state.questionLoad = load;
        },
        SET_QUESTION(state, question) {
            state.question = question;
        }
    },
    actions: {
        questions({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_QUESTIONS_LOAD', true);
                question.list(payload.form , payload.query).then(response => {
                    commit('SET_QUESTIONS', response.questions);
                    commit('SET_TOTAL_QUESTIONS', payload.query.search_text !== "" ? response.questions.length : response.count);
                    commit('SET_QUESTIONS_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
        question({commit}, id){
            return new Promise((resolve, reject) => {
                commit('SET_QUESTION_LOAD', true);
                question.get(id).then(response => {
                    commit('SET_QUESTION', response.question);
                    commit('SET_QUESTION_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        }
    }
}

export default questionModule;
