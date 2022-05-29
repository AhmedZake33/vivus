import Logs from '../../api/logs'
import * as helper from "../../utils/helper";

const log = new Logs();

const logModule = {
    namespaced: true,
    state: {
        logs: [],
        logsLoad: false,
        totalLogs: 0,
        log: {},
        actions:null,
        logLoad: false
    },
    getters: {
        logs(state) {
            return state.logs
        },
        log(state) {
            return Object.entries(state.log).map(([key, value]) => {
                return {key, value}
            }).filter(param => param.value !== 'null' && !param.key.includes('id')  && !param.key.includes('at') && !param.key.includes('value'));
        },
        logNewValue(state) {
            if (state.log.new_value !== "null" && state.log.new_value !== undefined) {
                return Object.entries(JSON.parse(state.log.new_value)).map(([key, value]) => {
                    return {key, value}
                }).filter(param => !param.key.includes('id') && param.value !== null && param.value !== ''  && param.key !== 'system' && param.key !== 'latitude' && param.key !== 'longitude' && param.key !== 'created_by' && param.key !== 'search_text' && param.key !== 'removed');
            }else {
                return null ;
            }
        },
        logOldValue(state) {
            if (state.log.old_value !== "null" && state.log.old_value !== undefined) {
                return Object.entries(JSON.parse(state.log.old_value)).map(([key, value]) => {
                    return {key, value}
                }).filter(param => !param.key.includes('id') && param.value !== null && param.value !== ''  && param.key !== 'system' && param.key !== 'latitude' && param.key !== 'longitude' && param.key !== 'created_by' && param.key !== 'search_text' && param.key !== 'removed');
            }else {
                return null;
            }
        },
        logLoad(state) {
            return state.logLoad
        },
        logsLoad(state) {
            return state.logsLoad;
        },
        totalLogs(state) {
            return state.totalLogs;
        }
    },
    mutations: {
        SET_ACTIONS(state,actions){
            state.actions = actions
        },
        SET_TOTAL_LOGS(state, total) {
            state.totalLogs = total;
        },
        SET_LOGS(state, fields) {
            state.logs = fields;
        },
        SET_LOGS_LOAD(state, load) {
            state.logsLoad = load;
        },
        SET_LOG_LOAD(state, load) {
            state.logLoad = load;
        },
        SET_LOG(state, log) {
            state.log = log;
        }
    },
    actions: {
        getLogs({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_LOGS_LOAD', true);
                log.list(payload.query).then(response => {
                    commit('SET_LOGS', response.logs);
                    commit('SET_ACTIONS', response.actions);
                    commit('SET_TOTAL_LOGS', payload.query.search_text !== "" ? response.logs.length : response.count);
                    commit('SET_LOGS_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
        getLog({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_LOG_LOAD', true);
                log.get(id).then(response => {
                    commit('SET_LOG', response.log);
                    commit('SET_LOG_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        }
    }
}

export default logModule;
