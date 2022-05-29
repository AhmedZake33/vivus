import Groups from '../../api/groups';
import router from '../../router';

const group = new Groups();

const groupModule = {
    namespaced: true,
    state: {
        groups: null,
        groupsLoad: false,
        totalgroups: 0,
        group: {},
        stages: [],
        forms: []
    },
    getters: {
        groups(state) {
            return state.groups;
        },
        groupsLoad(state) {
            return state.groupsLoad;
        },
        forms(state) {
            return state.forms;
        },
        totalgroups(state) {
            return state.totalgroups;
        },
        lookup(state) {
            return state.lookups;
        },
        group(state) {
            if (state.group) {
                return Object.entries(state.group)
                    .map(([key, value]) => {
                        return {key, value};
                    })
                    .filter(
                        param =>
                            !param.key.includes('id') &&
                            param.key !== 'sector' &&
                            param.key !== 'search_text' &&
                            param.key !== 'removed' &&
                            param.key !== 'updated_at' &&
                            param.key !== 'statistic' &&
                            param.key !== 'is_editable' &&
                            param.value !== null
                    );
            } else {
                return false;
            }
        },
        status(state) {
            if (state.group) {
                return state.group.removed;
            }
            return '';
        },
        name(state) {
            if (state.group) {
                return  state.group.name
            }
            return '';
        }
    },
    mutations: {
        SET_totalgroups_GROUPS(state, totalgroups) {
            state.totalgroups = totalgroups;
        },
        SET_GROUPS(state, groups) {
            state.groups = groups;
        },
        SET_GROUPS_LOAD(state, groupsLoad) {
            state.groupsLoad = groupsLoad;
        },
        SET_GROUP(state, group) {
            state.group = group;
        },
        SET_EDUCATION_TYPES(state, types) {
            state.educationTypes = types;
        },
        SET_SECTORS(state, sectors) {
            state.sectors = sectors;
        },
        SET_TYPES(state, types) {
            state.types = types;
        },
        SET_STAGES(state, stages) {
            state.stages = stages;
        },
        SET_FORMS(state, forms) {
            state.forms = forms;
        },
    },
    actions: {
        delete({commit}, payload) {
            return new Promise((resolve, reject) => {
                group
                    .delete(payload)
                    .then(response => {
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        groups({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_GROUPS_LOAD', true);
                group
                    .list(payload.query)
                    .then(response => {
                        commit('SET_GROUPS', response.groups);
                        commit('SET_TYPES', response.types);
                        commit('SET_EDUCATION_TYPES', response.eductionTypes);
                        commit('SET_SECTORS', response.sectors);
                        commit('SET_totalgroups_GROUPS', response.count);
                        commit('submission/SET_SCGENDER', response.schoolGenders, {root: true});
                        commit('submission/SET_DIRECTORATE', response.directorate, {root: true});
                        commit('submission/SET_ADMINISTRATION', response.administration, {root: true});
                        commit('submission/SET_STAGE', response.stages, {root: true});
                        commit('submission/SET_DAY_TYPE', response.dayTypes, {root: true});
                        commit('SET_GROUPS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        group({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_GROUPS_LOAD', true);
                group
                    .get(payload)
                    .then(response => {
                        commit('SET_GROUP', response.group);
                        commit('SET_STAGES', response.stages);
                        commit('SET_FORMS', response.forms);
                        commit('SET_GROUPS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        save({commit}, payload) {
            return new Promise((resolve, reject) => {
                group.save(payload)
                    .then(response => {
                        // return router.push(`/higher/group/${response.group.id}`);
                        // return router.go(-1);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        addSubToGroup({commit}, payload) {
            return new Promise((resolve, reject) => {
                group.addSubToGroup(payload)
                    .then(response => {
                        return router.push(`/school/groups`);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        actionGroup({commit}, payload) {
            return new Promise((resolve, reject) => {
                group.actionGroup(payload)
                    .then(response => {
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        removeSubmission({commit}, id) {
            return new Promise((resolve, reject) => {
                group.removeSubmission(id)
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

export default groupModule;
