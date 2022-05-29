import Document from '../../api/document'

const document = new Document();

const documentModule = {
    namespaced: true,
    state: {
        documents: [],
        documentsLoad: false,
        totalDocuments: 0,
        options: {},
    },
    getters: {
        documents: (state) => state.documents,
        documentsLoad: (state) => state.documentsLoad,
        totalDocuments: (state) => state.totalDocuments,
        options: (state) => state.options,
    },
    mutations: {
        SET_TOTAL_DOCUMENTS(state, total) {
            state.totalDocuments = total;
        },
        SET_DOCUMENTS(state, documents) {
            state.documents = documents;
        },
        SET_OPTIONS(state, options) {
            state.options = options;
        },
        SET_DOCUMENTS_LOAD(state, load) {
            state.documentsLoad = load;
        },
    },
    actions: {
        documents({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_DOCUMENTS_LOAD', true);
                document.list(payload.query).then(response => {
                    commit('SET_DOCUMENTS', response.stages);
                    commit('SET_OPTIONS', response.options);
                    // commit('SET_TOTAL_DOCUMENTS', payload.query.search_text !== "" ? response.questions.length : response.count);
                    commit('SET_DOCUMENTS_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
    }
}

export default documentModule;
