import Teams from '../../api/teams';

const team = new Teams();

const teamModule = {
    namespaced: true,
    state: {
        teams: [],
        submission: [],
        services: [],
        hotels: [],
        teamsLoad: false,
        totalTeams: 0,
        team: Object,
        reservation: Object,
        representative: null,
        teamLoad: false,
        status: null,
        lookup: [],
    },
    getters: {
        teams(state) {
            return state.teams;
        },
        lookup(state) {
            return state.lookup;
        },
        teamsLoad(state) {
            return state.teamsLoad;
        },
        totalTeams(state) {
            return state.totalTeams;
        },
        teamId(state) {
            state.team;
            let array = [];
            if (state.team) {
              if (state.team.all_members) {
                state.team.all_members.forEach(element => {
                  let obj = {};
                  obj['ar_name'] = element.ar_name;
                  obj['id'] = element.user_id;
                  obj['excuse_reason'] = element.excuse_reason;
                  obj['excused'] = element.excused;
                  obj['job'] = element.job;
                  obj['my_evaluation'] = element.my_evaluation;
                  obj['signature'] = element.signature;
                  obj['team_job'] = element.team_job;
                  obj['team_member_id'] = element.id;
                  array.push(obj);
                });
                let all = { all_members: array };
                all['announce_at'] = state.team.announce_at;
                all['close_at'] = state.team.close_at;
                all['created_at'] = state.team.created_at;
                all['created_by'] = state.team.created_by;
                all['ends_at'] = state.team.ends_at;
                all['id'] = state.team.id;
                all['name'] = state.team.name;
                all['old_id'] = state.team.old_id;
                all['old_submission_id'] = state.team.old_submission_id;
                all['removed'] = state.team.removed;
                all['search_text'] = state.team.search_text;
                all['starts_at'] = state.team.starts_at;
                all['submission_id'] = state.team.submission_id;
                all['system'] = state.team.system;
                all['updated_at'] = state.team.updated_at;
                all['visit_at'] = state.team.visit_at;
                return all;
              } else {
                return state.team;
              }
            }
          },
        team(state) {
            return Object.entries(state.team)
                .map(([key, value]) => {
                    return {key, value};
                })
                .filter(param => !param.key.includes('id') && param.key !== 'all_members' && param.key !== 'search_text' && param.key !== 'system' && param.key !== 'removed' && param.key !== 'created_by' && param.key !== 'created_at' && param.key !== 'updated_at' && param.value !== null);
        },
        name(state) {
            if (state.team) {
                return state.team.name;
            }
            return '';
        },
        removed(state) {
            if (state.team) {
                return state.team.removed;
            }
            return '';
        },
        representative: state => state.representative,
        reservation: state => state.reservation,
        services: state => state.services,
        hotels: state => state.hotels,
        status: state => state.status,
        teamLoad(state) {
            return state.teamLoad;
        },
        submission(state) {
            if (state.submission) {
                return Object.entries(state.submission)
                    .map(([key, value]) => {
                        return {key, value};
                    }).filter(
                        param =>
                            !param.key.includes('id') &&
                            !param.key.includes('authorized') &&
                            param.key !== 'approved' &&
                            param.key !== 'organization_area' &&
                            param.key !== 'student_count' &&
                            param.key !== 'updated_at' &&
                            param.key !== 'created_at' &&
                            param.key !== 'education_type' &&
                            param.key !== 'removed' &&
                            param.key !== 'temp_organization_name' &&
                            param.key !== 'temp_university_name' &&
                            param.key !== 'name' &&
                            param.value !== null
                    );
            } else {
                return false
            }
        },
    },
    mutations: {
        SET_TOTAL_TEAMS(state, total) {
            state.totalTeams = total;
        },
        SET_TEAMS(state, teams) {
            state.teams = teams;
        },
        SET_LOOKUPS(state, lookup) {
            state.lookup = lookup;
        },
        SET_TEAMS_LOAD(state, load) {
            state.teamsLoad = load;
        },
        SET_TEAM(state, team) {
            state.team = team;
        },
        SET_TEAM_LOAD(state, load) {
            state.teamLoad = load;
        },
        SET_SUBMISSION(state, submission) {
            state.submission = submission;
        },
        SET_REPRESENTATIVE(state, representative) {
            state.representative = representative;
        },
        SET_RESERVATION(state, reservation) {
            state.reservation = reservation;
        },
        SET_SERVICES(state, services) {
            state.services = services;
        },
        SET_HOTELS(state, hotels) {
            state.hotels = hotels;
        },
        SET_STATUS(state, status) {
            state.status = status;
        },
    },
    actions: {
        teams({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_TEAMS_LOAD', true);
                team
                    .list(payload.query)
                    .then(response => {
                        commit('SET_TEAMS', response.teams);
                        commit('SET_LOOKUPS', response.lookups);
                        commit('SET_TOTAL_TEAMS', payload.query.search_text !== '' ? response.teams.length : response.count);
                        commit('SET_TEAMS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        team({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_TEAM_LOAD', true);
                team
                    .get(id)
                    .then(response => {
                        commit('SET_TEAM', response.team);
                        commit('submission/SET_SELECTED_TEAM', response.team, {root: true});
                        commit('SET_REPRESENTATIVE', response.representative)
                        commit('SET_SUBMISSION', response.submission);
                        commit('SET_RESERVATION', response.reservation);
                        commit('SET_SERVICES', response.services);
                        commit('SET_HOTELS', response.hotels);
                        commit('SET_STATUS', response.status);
                        commit('SET_TEAM_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
    },
};

export default teamModule;
