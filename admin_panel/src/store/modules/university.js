import Universities from '../../api/university'

const university = new Universities();

const universityModule = {
    namespaced: true,
    state: {
        universities: [],
        universitiesLoad: false,
        totalUniversities: 0,
        university: {},
        universityLoad: false,
        organizations: [],
        organizationsLoad: false,
        totalOrganizations: 0,
    },
    getters: {
        universities(state) {
            return state.universities
        },
        university(state) {
            return Object.entries(state.university).map(([key, value]) => {
                return {key, value}
            }).filter(param => (!param.key.includes('id') && param.key !== 'search_text' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null));
        },
        name(state) {
            if (state.university) {
                return state.university.name
            }
            return ''
        },
        universityLoad(state) {
            return state.universityLoad
        },
        universitiesLoad(state) {
            return state.universitiesLoad;
        },
        totalUniversities(state) {
            return state.totalUniversities;
        },
        organizations(state) {
            return state.organizations
        },
        organizationsLoad(state) {
            return state.organizationsLoad
        },
        totalOrganizations(state) {
            return state.totalOrganizations;
        },
    },
    mutations: {
        SET_TOTAL_UNIVERSITIES(state, total) {
            state.totalUniversities = total;
        },
        SET_UNIVERSITIES(state, universities) {
            state.universities = universities;
        },
        SET_UNIVERSITIES_LOAD(state, load) {
            state.universitiesLoad = load;
        },
        SET_UNIVERSITY_LOAD(state, load) {
            state.universityLoad = load;
        },
        SET_UNIVERSITY(state, university) {
            state.university = university;
        },
        SET_TOTAL_ORGANIZATIONS(state, total) {
            state.totalOrganizations = total;
        },
        SET_ORGANIZATIONS(state, organizations) {
            state.organizations = organizations;
        },
        SET_ORGANIZATIONS_LOAD(state, load) {
            state.organizationsLoad = load;
        },
    },
    actions: {
        universities({commit},query) {
            return new Promise((resolve, reject) => {
                commit('SET_UNIVERSITIES_LOAD', true);
                university.list(query).then(response => {
                    commit('SET_UNIVERSITIES', response.universities);
                    // commit('SET_TOTAL_UNIVERSITIES', payload.query.search_text !== "" ? response.universities.length : response.count);
                    commit('SET_UNIVERSITIES_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
        university({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_UNIVERSITY_LOAD', true);
                university.get(id).then(response => {
                    commit('SET_UNIVERSITY', response.university);
                    commit('SET_UNIVERSITY_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
        organizations({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ORGANIZATIONS_LOAD', true);
                university.listOrganizations(payload.university , payload.query).then(response => {
                    commit('SET_ORGANIZATIONS', response.organizations);
                    commit('SET_TOTAL_ORGANIZATIONS', payload.query.search_text !== "" ? response.organizations.length : response.count);
                    commit('SET_ORGANIZATIONS_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
    }
}

export default universityModule;
