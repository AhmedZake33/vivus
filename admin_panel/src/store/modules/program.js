import Programs from '../../api/programs'

const program = new Programs();

const programModule = {
    namespaced: true,
    state: {
        programs: [],
        programsLoad: false,
        totalPrograms: 0,
        program:Object,
        programLoad:Boolean
    },
    getters: {
        programs(state) {
            return state.programs
        },
        programsLoad(state) {
            return state.programsLoad
        },
        totalPrograms(state) {
            return state.totalPrograms;
        },
        program(state) {
            return Object.entries(state.program).map(([key, value]) => {
                return {key, value}
            }).filter(param => (!param.key.includes('id')  && param.key !== 'search_text' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null));
        },
        name(state){
            if (state.program){
                return state.program.name
            }
            return  ''
        },
        status(state){
            if (state.program){
                return state.program.removed
            }
            return  ''
        },
        programLoad(state) {
            return state.programLoad
        },
    },
    mutations: {
        SET_TOTAL_PROGRAMS(state, total) {
            state.totalPrograms = total;
        },
        SET_PROGRAMS(state, programs) {
            state.programs = programs;
        },
        SET_PROGRAMS_LOAD(state, load) {
            state.programsLoad = load;
        },
        SET_PROGRAM(state, program) {
            state.program = program;
        },
        SET_PROGRAM_LOAD(state, load) {
            state.programLoad = load;
        }
    },
    actions: {
        programs({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_PROGRAMS_LOAD', true);
                program.list(payload.query).then(response => {
                    commit('SET_PROGRAMS', response.programs);
                    commit('SET_TOTAL_PROGRAMS', payload.query.search_text !== "" ? response.programs.length : response.count);
                    commit('SET_PROGRAMS_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
        program({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_PROGRAM_LOAD', true);
                program.get(id).then(response => {
                    commit('SET_PROGRAM', response.program);
                    commit('SET_PROGRAM_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
    }
}

export default programModule;
