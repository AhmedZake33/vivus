import Evaluations from '../../api/evaluation';
import { object } from '@amcharts/amcharts4/core';

const evaluation = new Evaluations();

const evaluationsModule = {
  namespaced: true,
  state: {
    evaluations: [],
    evaluationsLoad: false,
    teamEvaluations: null,
    totalEvaluations: 0,
    visit: Object,
    visitLoad: Boolean,
    master: Object,
    masterLoad: Boolean,
    program: Object,
    programLoad: Boolean,
    items: [],
    itemsLoad: false,
    totalItems: 0,
    evaluator: 0,
    item: [],
    itemLoad: false,
    decision: Object,
    decisionLoad: false,
    parent: object,
    questions: [],
    standards: [],
    statistics: [],
    decisions: [],
    currentLevel: 0,
    approved: null,
    team: null,
    committees: null,
    submission: null,
    canEdit: false,
    editStatistics: [],
    standerdsCount: null,
    answers: null,
    user: null,
    pages: null,
    question: null,
    orgReply:null,
  },
  getters: {
    team(state) {
      return state.team;
    },
    committees(state) {
      return state.committees;
    },
    decisions(state) {
      return state.decisions;
    },
    evaluations(state) {
      return state.evaluations;
    },
    evaluationsLoad(state) {
      return state.evaluationsLoad;
    },
    totalEvaluations(state) {
      return state.totalEvaluations;
    },
    visit(state) {
      if (state.visit) {
        return Object.entries(state.visit)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(param => param.key !== 'id' && param.key !== 'search_text' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null);
      }
      return false;
    },
    visitName(state) {
      if (state.visit) {
        return state.visit.name;
      }
      return '';
    },
    visitLoad(state) {
      return state.visitLoad;
    },
    program(state) {
      if (state.program) {
        return Object.entries(state.program)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(param => param.key !== 'id' && param.key !== 'search_text' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null);
      }
      return false;
    },
    programName(state) {
      if (state.program) {
        return state.program.name;
      }
      return '';
    },
    programLoad(state) {
      return state.programLoad;
    },
    master(state) {
      if (state.master) {
        return Object.entries(state.master)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(param => param.key !== 'id' && param.key !== 'search_text' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null);
      }
      return false;
    },
    masterName(state) {
      if (state.master) {
        return state.master.master;
      }
      return '';
    },
    masterLoad(state) {
      return state.masterLoad;
    },
    items(state) {
      return state.items;
    },
    itemDetails(state) {
      if (state.items) {
        return Object.entries(state.items)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(param => param.key !== 'id' && param.key !== 'items' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== null);
      }
      return false;
    },
    itemsLoad(state) {
      return state.itemsLoad;
    },
    totalItems(state) {
      return state.totalItems;
    },
    item(state) {
      if (state.item) {
        return state.item;
      }
      return false;
    },
    itemLoad(state) {
      return state.itemLoad;
    },
    decision(state) {
      if (state.decision) {
        return Object.entries(state.decision)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(param => param.key !== 'id' && param.key !== 'search_text' && param.key !== 'removed' && param.key !== 'create_at' && param.key !== 'update_at' && param.value !== '' && param.value !== null);
      }
      return false;
    },
    decisionLoad(state) {
      return state.decisionLoad;
    },
    parent: state => state.parent,
    questions: state => state.questions,
    preReports(state) {
      if (state.questions) {
        // const addObj = Object.entries(state.questions).map(e => ({ [e[0]]: e[1], title: e[0] }));
        // const filtered =  addObj.filter(e => e.title != '' &&  e.title != 'results' && e.title != 'categories' && e.title != 'qualifications' && e.title != 'years' && e.title != 'qualifications' && e.title != 'items' && e.title != 'departments');

        return state.questions;
      }
    },
    preParent(state) {
      if (state.questions) {
        const addObj = Object.entries(state.questions).map(e => ({ [e[0]]: e[1], title: e[0] }));
        return addObj.filter(e => e.title == '');
      }
    },
    standards: state => state.standards,
    approved: state => state.approved,
    currentLevel: state => state.currentLevel,
    submission(state) {
      if (state.submission) {
        return Object.entries(state.submission)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(
            param =>
              !param.key.includes('id') &&
              !param.key.includes('authorized') &&
              param.key !== 'approved' &&
              param.key !== 'team' &&
              param.key !== 'decision' &&
              param.key !== 'temp_decision' &&
              param.key !== 'organization_area' &&
              param.key !== 'student_count' &&
              param.key !== 'removed' &&
              param.key !== 'temp_organization_name' &&
              param.key !== 'temp_university_name' &&
              param.key !== 'name' &&
              param.value !== null
          );
      }
    },
    evaluator: state => state.evaluator,
    statistics: state => {
      let statistics = [
        { index: 0, label: 30, name: 'agree', type: 'success' },
        { index: 1, name: 'midagree', label: 31, type: 'info' },
        { index: 2, name: 'disagree', label: 32, type: 'warning' },
        { index: 3, name: 'disApply', label: 33, type: 'danger' },
      ];
      if (state.statistics) {
        statistics.forEach(element => {
          state.statistics.forEach(apiStatistics => {
            if (apiStatistics.label == element.label) {
              element['value'] = apiStatistics;
            }
          });
        });
      }
      return statistics;
    },
    preStatistics: state => {
      let statistics = [
        { index: 0, name: 'level_1', label: 1, type: 'success' },
        { index: 1, name: 'level_2', label: 2, type: 'info' },
        { index: 2, name: 'level_3', label: 3, type: 'warning' },
        { index: 3, name: 'level_4', label: 4, type: 'danger' },
      ];
      if (state.statistics) {
        statistics.forEach(element => {
          state.statistics.forEach(apiStatistics => {
            if (apiStatistics.label == element.label) {
              element['value'] = apiStatistics;
            }
          });
        });
      }
      return statistics;
    },
    editStatistics: state => {
      let statistics = [
        { index: 0, label: 30, name: 'agree', type: 'success' },
        { index: 1, name: 'midagree', label: 31, type: 'info' },
        { index: 2, name: 'disagree', label: 32, type: 'warning' },
        { index: 3, name: 'disApply', label: 33, type: 'danger' },
        { index: 4, name: 'apply', label: 1, type: 'success' },
        { index: 5, name: 'disApply', label: 2, type: 'danger' },
      ];
      if (state.editStatistics) {
        statistics.forEach(element => {
          state.editStatistics.forEach(apiStatistics => {
            if (apiStatistics.label == element.label) {
              element['value'] = apiStatistics;
            }
          });
        });
      }
      return statistics;
    },

    editPreStatistics: state => {
      let statistics = [
        { index: 1, name: 'value_1', label: 1, type: 'success' },
        { index: 2, name: 'value_2', label: 2, type: 'danger' },
      ];
      if (state.editStatistics) {
        statistics.forEach(element => {
          state.editStatistics.forEach(apiStatistics => {
            if (apiStatistics.label == element.label) {
              element['value'] = apiStatistics;
            }
          });
        });
      }
      return statistics;
    },
  },
  mutations: {
    SET_TEAM_EVAlUATION_USER(state, user) {
      state.user = user;
    },
    SET_TOTAL_EVALUATIONS(state, total) {
      state.totalEvaluations = total;
    },
    SET_EVALUATIONS(state, evaluations) {
      state.evaluations = evaluations;
    },
    SET_EVALUATIONS_LOAD(state, load) {
      state.evaluationsLoad = load;
    },
    SET_VISIT_LOAD(state, load) {
      state.visitLoad = load;
    },
    SET_VISIT(state, visit) {
      state.visit = visit;
    },
    SET_PROGRAM_LOAD(state, load) {
      state.programLoad = load;
    },
    SET_PROGRAM(state, program) {
      state.program = program;
    },
    SET_MASTER_LOAD(state, load) {
      state.masterLoad = load;
    },
    SET_MASTER(state, master) {
      state.master = master;
    },
    SET_TOTAL_ITEMS(state, total) {
      state.totalItems = total;
    },
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_ITEMS_LOAD(state, load) {
      state.itemsLoad = load;
    },
    SET_ITEM(state, items) {
      state.item = items;
    },
    SET_ITEM_LOAD(state, load) {
      state.itemLoad = load;
    },
    SET_DECISION(state, decision) {
      state.decision = decision;
    },

    SET_DECISION_LOAD(state, load) {
      state.decisionLoad = load;
    },
    SET_PARENT(state, parent) {
      state.parent = parent;
    },
    SET_QUESTIONS(state, questions) {
      state.questions = questions;
    },
    SET_QUESTION(state, question) {
      state.question = question;
    },
    SET_STANDARDS(state, standards) {
      state.standards = standards;
    },
    SET_STATISTICS(state, statistics) {
      state.statistics = statistics;
    },
    SET_CURRENT_LEVEL(state, level) {
      state.currentLevel = level;
    },
    SET_EVALUATOR(state, evaluator) {
      state.evaluator = evaluator;
    },
    SET_APPROVED(state, approved) {
      state.approved = approved;
    },
    SET_TEAM(state, team) {
      state.team = team;
    },
    SET_COMMITTEES(state, committees) {
      state.committees = committees;
    },
    SET_DECISIONS(state, decisions) {
      state.decisions = decisions;
    },
    SET_CAN_EDIT(state, canEdit) {
      state.canEdit = canEdit;
    },
    SET_EDIT_STATISTICS(state, editStatistics) {
      state.editStatistics = editStatistics;
    },
    SET_STANDARDS_COUNT(state, standerdsCount) {
      state.standerdsCount = standerdsCount;
    },
    SET_TEAM_EVAlUATION(state, teamEvaluations) {
      state.teamEvaluations = teamEvaluations;
    },
    SET_TEAM_EVAlUATION_ANSWERS(state, answers) {
      state.answers = answers;
    },
    SET_PAGES(state, pages) {
      state.pages = pages;
    },

    SET_SUBMISSION(state, submission) {
      state.submission = submission;
    },
    SET_ORGANIZATION_REPLY(state,data){
      state.orgReply = data
    }
  },
  actions: {
    getCouncil({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_EVALUATIONS_LOAD', true);
        evaluation
          .getCouncil(payload)
          .then(response => {
            commit('SET_QUESTIONS', response.questions);
            commit('SET_QUESTION', response.question);
            commit('SET_STATISTICS', response.statistic);
            commit('SET_PAGES', response.pages);
            commit('SET_ITEM', response.question);
            commit('SET_DECISIONS', response.decisions);
            commit('SET_SUBMISSION', response.submission);
            commit('SET_EVALUATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getPreCouncil({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_EVALUATIONS_LOAD', true);
        evaluation
          .getPreCouncil(payload)
          .then(response => {
            commit('SET_QUESTIONS', response.questions);
            commit('SET_STATISTICS', response.statistic);
            commit('SET_DECISIONS', response.decisions);
            commit('SET_SUBMISSION', response.submission);
            commit('SET_EVALUATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    initDecision({ commit }, payload) {
      return new Promise((resolve, reject) => {
        evaluation
          .initDecision(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    evaluations({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_EVALUATIONS_LOAD', true);
        evaluation
          .list(payload.organization, payload.query)
          .then(response => {
            commit('SET_EVALUATIONS', response.evaluations);
            commit('SET_TOTAL_EVALUATIONS', payload.query.search_text !== '' ? response.evaluations.length : response.count);
            commit('SET_EVALUATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    evaluation({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_VISIT_LOAD', true);
        commit('SET_PROGRAM_LOAD', true);
        commit('SET_MASTER_LOAD', true);
        evaluation
          .get(id)
          .then(response => {
            commit('SET_VISIT', response.visit);
            commit('SET_PROGRAM', response.program);
            commit('SET_MASTER', response.master);
            commit('SET_VISIT_LOAD', false);
            commit('SET_PROGRAM_LOAD', false);
            commit('SET_MASTER_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveMemberEvaluation({ commit }, payload) {
      return new Promise((resolve, reject) => {
        evaluation
          .saveMemberEvaluation(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveEvaluation({ commit }, payload) {
      return new Promise((resolve, reject) => {
        evaluation
          .saveEvaluation(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getTeamEvaluations({ commit }, payload) {
      commit('submission/SET_DETAILS_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        evaluation
          .getTeamEvaluations(payload)
          .then(response => {
            commit('SET_TEAM_EVAlUATION', response.evaluation);
            commit('SET_TEAM_EVAlUATION_ANSWERS', response.answers);
            commit('SET_TEAM_EVAlUATION_USER', response.user);
            commit('submission/SET_DETAILS_LOAD', false, { root: true });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    removeSignature({ commit }, payload) {
      return new Promise((resolve, reject) => {
        evaluation.removeSignature(payload).then(response => {resolve();});
      });
    },
    getEvaluation({ commit }, payload) {
      commit('submission/SET_DETAILS_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        evaluation
          .getEvaluation(payload)
          .then(response => {
            commit('SET_PARENT', response.parent);
            commit('SET_PAGES', response.pages);
            commit('SET_QUESTIONS', response.questions);
            commit('SET_CAN_EDIT', response.approved);
            commit('SET_EDIT_STATISTICS', response.statistic);
            commit('SET_EVALUATOR', response.evaluator);
            commit('submission/SET_LAST_ALERT', response.last_alert, { root: true });
            commit('SET_CURRENT_LEVEL', response.level);
            commit('submission/SET_DETAILS_LOAD', false, { root: true });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    getPreReportsEvaluation({ commit }, payload) {
      commit('submission/SET_DETAILS_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        evaluation
          .getPreReportsEvaluation(payload)
          .then(response => {
            // commit('SET_PARENT', response.parent);
            commit('SET_PAGES', response.pages);
            commit('submission/SET_LAST_ALERT', response.last_alert, { root: true });
            commit('SET_QUESTIONS', response.reports);
            commit('SET_STANDARDS_COUNT', response.count);
            commit('submission/SET_SCLOOKUPS', response, { root: true });
            commit('SET_CAN_EDIT', response.leaderApproved);
            commit('SET_EDIT_STATISTICS', response.statistic);
            commit('SET_EVALUATOR', response.evaluator);
            // commit('SET_CURRENT_LEVEL', response.level);
            commit('submission/SET_DETAILS_LOAD', false, { root: true });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    getPreEvaluation({ commit }, payload) {
      commit('submission/SET_DETAILS_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        evaluation
          .getPreEvaluation(payload)
          .then(response => {
            // commit('SET_PARENT', response.parent);
            // commit('SET_PAGES', response.pages);
            commit('SET_QUESTIONS', response.subQuestions);
            commit('SET_STANDARDS_COUNT', response.count);
            // commit('SET_CAN_EDIT', response.approved);
            commit('SET_EDIT_STATISTICS', response.statistic);
            // commit('SET_EVALUATOR', response.evaluator);
            // commit('SET_CURRENT_LEVEL', response.level);
            commit('submission/SET_DETAILS_LOAD', false, { root: true });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    standards({ commit }, payload, ask) {
      return new Promise((resolve, reject) => {
        commit('SET_EVALUATIONS_LOAD', true);
        evaluation
          .questions(payload.evaluation_id, payload.query)
          .then(response => {
            commit('SET_STANDARDS', response.questions);
            commit('SET_STANDARDS_COUNT', response.count);
            // commit('SET_CURRENT_LEVEL', response.level);
            commit('SET_APPROVED', response.approved ? response.approved : null);
            // commit('SET_TEAM', response.team);
            // commit('SET_COMMITTEES', response.committees);
            // commit('SET_DECISIONS', response.decisions);
            // commit('submission/SET_EVALUATOR', response.evaluator,{ root: true });
            commit('evaluationNotes/SET_CAN_APPROVE', response.canApprove, { root: true });
            commit('evaluationNotes/SET_COMPLETE', response.complete, { root: true });
            commit('SET_STATISTICS', response.statistic);
            commit('SET_EVALUATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    preStandards({ commit }, payload, ask) {
      return new Promise((resolve, reject) => {
        commit('SET_EVALUATIONS_LOAD', true);
        evaluation
          .preQuestions(payload.evaluation_id, payload.query)
          .then(response => {
            commit('SET_STANDARDS', response.questions);
            commit('SET_STANDARDS_COUNT', response.count);
            commit('SET_ORGANIZATION_REPLY', response.alerts_organization);
            // commit('SET_CURRENT_LEVEL', response.level);
            // commit('SET_APPROVED', response.approved ? response.approved : null);
            // commit('SET_TEAM', response.team);
            // commit('SET_COMMITTEES', response.committees);
            // commit('SET_DECISIONS', response.decisions);
            // commit('SET_EVALUATOR', response.evaluator);
            // commit('evaluationNotes/SET_CAN_APPROVE', response.canApprove, { root: true });
            commit('SET_STATISTICS', response.statistic);
            commit('SET_EVALUATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    items({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        evaluation
          .itemsList(payload.evaluation, payload.query)
          .then(response => {
            commit('SET_ITEMS', response.items);
            commit('SET_TOTAL_ITEMS', payload.query.search_text !== '' ? response.items.length : response.count);
            commit('SET_ITEMS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    item({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEM_LOAD', true);
        evaluation
          .item(payload.evaluation, payload.item)
          .then(response => {
            commit('SET_ITEM', response.item);
            commit('SET_ITEM_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    decision({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_DECISION_LOAD', true);
        evaluation
          .decision(id)
          .then(response => {
            commit('SET_DECISION', response.decision);
            commit('SET_DECISION_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveProgram({ commit }, payload) {
      return new Promise((resolve, reject) => {
        evaluation
          .saveProgram(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    deleteProgram({ commit }, id) {
      return new Promise((resolve, reject) => {
        evaluation
          .deleteProgram(id)
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

export default evaluationsModule;
