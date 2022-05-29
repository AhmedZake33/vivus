import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: true,
  pathTitle: null,
  fileList:[],
  uploadProgress:null,
};

import userModule from './modules/user';
import groupModule from './modules/group';
import statisticsModule from './modules/statistics';
import roleModule from './modules/role';
import logModule from './modules/log';
import archiveModule from './modules/archive';
import universityModule from './modules/university';
import formModule from './modules/form';
import teamModule from './modules/team';
import programModule from './modules/program';
import organizationModule from './modules/organization';
import courseModule from './modules/courses';
import hotelModule from './modules/hotel';
import questionModule from './modules/question';
import evaluationsModule from './modules/evaluation';
import submissionModule from './modules/submission';
import notesModule from './modules/notes';
import directoratesModule from './modules/directorate';
import evaluationNotes from './modules/evaluationNotes';
import financeModule from './modules/finance';
import ticketModule from './modules/ticket';
import settingModule from "./modules/setting";
import documentModule from "./modules/document";

const store = new Vuex.Store({
  modules: {
    user: userModule,
    statistics: statisticsModule,
    roles: roleModule,
    logs: logModule,
    group:groupModule,
    archive: archiveModule,
    university: universityModule,
    form: formModule,
    team: teamModule,
    notes: notesModule,
    organization: organizationModule,
    course:courseModule,
    program: programModule,
    hotel: hotelModule,
    question: questionModule,
    evaluation: evaluationsModule,
    submission: submissionModule,
    directorate: directoratesModule,
    evaluationNotes:evaluationNotes,
    finance:financeModule,
    ticket:ticketModule,
    setting:settingModule,
    documents:documentModule,
  },
  mutations: mutations,
  state: state,
  getters,
});

export default store;
