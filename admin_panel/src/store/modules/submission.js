import Submission from '../../api/submission';
import router from '../../router';

const FileDownload = require('js-file-download');
const submission = new Submission();

const submissionModule = {
  namespaced: true,
  state: {
    submissions: [],
    submissionsLoad: false,
    education_type: null,
    children: null,
    totalSubmission: 0,
    is_disability: 0,
    submission: Object,
    decision: Object,
    decisions: [],
    representative: Object,
    visit: Object,
    program: null,
    programs: [],
    questions: [],
    types: [],
    archive: null,
    details: [],
    levels: [],
    showFiles: null,
    approvals: [],
    detailsLoad: false,
    reportLevels: [],
    questionsLoad: false,
    totalQuestions: 0,
    submissionLoad: false,
    evaluationTypes: [],
    selfReport: [],
    teams: [],
    team: null,
    visitTypes: [],
    visitType: null,
    visitGroups: [],
    forms: [],
    selectedPrograms: [],
    documents: [],
    selectedUniversity: null,
    selectedOrganization: null,
    selectedTeam: null,
    selectedVisit: null,
    inDocuments: null,
    selectedSelf_report_type: null,
    selectedOfficail_council: null,
    selectedPlan: null,
    selectedEvatype: null,
    tempUniversityName: null,
    tempOrganizationName: null,
    administration: null,
    dayType: null,
    authorized_address: null,
    authorized_national_id: null,
    stage: null,
    SCgender: null,
    directorate: null,
    check_status: null,
    current_status: null,
    approvals_status: null,
    payment: null,
    allDocuments: [],
    done: null,
    mainDocuments: null,
    mainDocumentTitle: '',
    MainUploadsDocuments: null,
    lastStatus: null,
    lookups: null,
    SClookups: null,
    canUpload: Boolean,
    uploadedDocs: null,
    teamDocuments: null,
    visitTable: null,
    ifDone: false,
    teamDocumentDone: false,
    docsInfo: null,
    showUpload: false,
    orgInfoRequired: false,
    editableDocs: null,
    authorized_person: null,
    authorized_phone: null,
    authorized_mobile: null,
    authorized_email: null,
    visit_type_id: null,
    organization_area: null,
    organization_programs: [],
    qualifications: [],
    standards: [],
    result: [],
    years: [],
    student_count: null,
    extraFile: null,
    categories: null,
    items: null,
    departments: null,
    statisticsData: null,
    institute_id: null,
    government_id: null,
    authorized_education: null,
    authorized_job: null,
    last_alert: null,
    alerts: null,
    evaluation_alerts: null,
    subSettingData: null,
    orgActive: null,
    initDocuments: null,
    fees: null,
    rubrics: null,
    evaluator:null
  },
  getters: {
    rubrics(state){
      return state.rubrics;
    },
    subSettingData(state) {
      if (state.subSettingData) {
        if (state.subSettingData.alerts) {
          return state.subSettingData.alerts;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    statisticsData(state) {
      if (state.statisticsData) {
        const addObj = Object.entries(state.statisticsData).map(e => ({ [e[0]]: e[1], title: e[0] }));
        return addObj.filter(e => e.title != 'results' && e.title != 'categories' && e.title != 'qualifications' && e.title != 'years' && e.title != 'qualifications' && e.title != 'items' && e.title != 'departments');
      }
    },
    SCSomestatisticsData(state) {
      if (state.statisticsData) {
        const addObj = Object.entries(state.statisticsData.statistics).map(e => ({ [e[0]]: e[1], title: e[0] }));
        return addObj.filter(e => e.title != 'results' && e.title != 'categories' && e.title != 'qualifications' && e.title != 'years' && e.title != 'qualifications' && e.title != 'items' && e.title != 'departments');
      }
    },

    programsData(state) {
      if (state.statisticsData) {
        if (state.statisticsData.program_info) {
          return state.statisticsData.program_info;
        }
      }
    },
    canUpload: state => state.canUpload,
    team(state) {
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
    visitTable: state => state.visitTable,
    editableDocs: state => state.editableDocs,
    submissions(state) {
      return state.submissions;
    },
    approvals_status: state => state.approvals_status,
    archive(state) {
      return state.archive;
    },
    types(state) {
      return state.types;
    },
    levels(state) {
      return state.levels;
    },
    programs(state) {
      return state.programs;
    },
    submissionsLoad(state) {
      return state.submissionsLoad;
    },
    details(state) {
      return state.details;
    },
    detailsLoad(state) {
      return state.detailsLoad;
    },
    totalSubmission(state) {
      return state.totalSubmission;
    },
    reportLevels(state) {
      return state.reportLevels;
    },
    approvals(state) {
      return state.approvals;
    },
    submission(state) {
      if (state.submission) {
        // state.submission[' authorized_person authorized_person_azhar'] = state.course[''];
        // delete state.submission['authorized_person'];
        return Object.entries(state.submission)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(
            param =>
              !param.key.includes('id') &&
              param.key !== 'visit_group' &&
              param.key !== 'visit_time_table' &&
              param.key !== 'directorate' &&
              param.key !== 'institute' &&
              param.key !== 'submission_number' &&
              param.key !== 'education_type' &&
              param.key !== 'authorized_person' &&
              param.key !== 'old_info' &&
              param.key !== 'team' &&
              param.key !== 'temp_decision' &&
              param.key !== 'approved' &&
              param.key !== 'officail_council' &&
              param.key !== 'plan' &&
              param.key !== 'search_text' &&
              param.key !== 'removed' &&
              param.key !== 'temp_organization_name' &&
              param.key !== 'temp_university_name' &&
              param.key !== 'name' &&
              param.key !== 'university' &&
              param.key !== 'updated_at' &&
              param.key !== 'programs_count' &&
              param.key !== 'status' &&
              param.value !== null
          );
      }
    },
    payment(state) {
      return state.payment;
    },
    decisions(state) {
      return state.decisions;
    },
    decision(state) {
      if (state.decision) {
        let reorderArr = [];
        reorderArr['status'] = state.decision.name || null;
        reorderArr['number'] = state.decision.number || null;
        reorderArr['start'] = state.decision.start || null;
        reorderArr['expiration_date'] = state.decision.expiration || null;
        reorderArr['reason'] = state.decision.reason || null;
        reorderArr['note'] = state.decision.note || null;

        return Object.entries(reorderArr)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(param => param.value !== null);
      }
      return false;
    },
    program(state) {
      if (state.program) {
        return Object.entries(state.program)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(param => param.value !== null);
      }
      return false;
    },
    representative(state) {
      return state.representative;
    },
    visit(state) {
      return state.visit;
    },
    name(state) {
      if (state.submission) {
        if (state.submission.name) {
          return {
            name: state.submission.name + `${state.submission.university ? ' - ' + state.submission.university : ''}`,
            id: state.submission.organization_id,
          };
        } else {
          return { name: null };
        }
      }
      return '';
    },
    authorized_person(state) {
      if (state.submission) {
        if (state.submission.authorized_person) {
          return state.submission.authorized_person;
        } else {
          return null;
        }
      }
      return '';
    },
    programName(state) {
      if (state.program) {
        return state.program.name;
      }
      return '';
    },
    representativeName(state) {
      if (state.representative) {
        return state.representative;
      }
      return '';
    },
    visitName(state) {
      if (state.visit) {
        return state.visit.name;
      }
      return '';
    },
    status(state) {
      if (state.submission) {
        return state.submission.removed;
      }
      return '';
    },
    plan(state) {
      if (state.submission) {
        return state.submission.plan;
      }
      return '';
    },
    officail(state) {
      if (state.submission) {
        return state.submission.officail_council;
      }
      return '';
    },
    submissionLoad(state) {
      return state.submissionLoad;
    },
    questions(state) {
      return state.questions;
    },
    questionsLoad(state) {
      return state.questionsLoad;
    },
    totalQuestions(state) {
      return state.totalQuestions;
    },
    evaluationTypes(state) {
      return state.evaluationTypes;
    },
    selfReport(state) {
      return state.selfReport;
    },
    teams(state) {
      return state.teams;
    },
    visitTypes(state) {
      return state.visitTypes;
    },
    visitGroups(state) {
      return state.visitGroups;
    },
    forms(state) {
      return state.forms;
    },
    selectedPrograms(state) {
      if (!state.selectedPrograms) return null;
      if (state.selectedPrograms.length == 0) return null;
      return state.selectedPrograms;
    },
    selectedUniversity(state) {
      return state.selectedUniversity;
    },
    allAlerts: state => {
      return state.alerts;
    },
    alerts: state => {
      if (state.alerts) {
        return state.alerts.alerts;
      } else {
        return false;
      }
    },
    steps: state => {
      if (state.alerts) {
        return state.alerts.steps;
      } else {
        return false;
      }
    },
    evAlerts: state => {
      if (state.evaluation_alerts) {
        return state.evaluation_alerts.alerts;
      } else {
        return false;
      }
    },
    evSteps: state => {
      if (state.evaluation_alerts) {
        return state.evaluation_alerts.steps;
      } else {
        return false;
      }
    },
    selectedOrganization(state) {
      return state.selectedOrganization;
    },
    selectedTeam(state) {
      let array = [];
      if (state.selectedTeam) {
        if (state.selectedTeam.all_members) {
          state.selectedTeam.all_members.forEach(element => {
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
          all['announce_at'] = state.selectedTeam.announce_at;
          all['close_at'] = state.selectedTeam.close_at;
          all['created_at'] = state.selectedTeam.created_at;
          all['created_by'] = state.selectedTeam.created_by;
          all['ends_at'] = state.selectedTeam.ends_at;
          all['id'] = state.selectedTeam.id;
          all['name'] = state.selectedTeam.name;
          all['old_id'] = state.selectedTeam.old_id;
          all['old_submission_id'] = state.selectedTeam.old_submission_id;
          all['removed'] = state.selectedTeam.removed;
          all['search_text'] = state.selectedTeam.search_text;
          all['starts_at'] = state.selectedTeam.starts_at;
          all['submission_id'] = state.selectedTeam.submission_id;
          all['system'] = state.selectedTeam.system;
          all['updated_at'] = state.selectedTeam.updated_at;
          all['visit_at'] = state.selectedTeam.visit_at;
          return all;
        } else {
          return state.selectedTeam;
        }
      }
    },
    selectedVisit: state => state.selectedVisit,
    selectedSelf_report_type: state => state.selectedSelf_report_type,
    selectedOfficail_council: state => state.selectedOfficail_council,
    selectedPlan: state => state.selectedPlan,
    selectedEvatype: state => state.selectedEvatype,
    tempOrganizationName: state => state.tempOrganizationName,
    standards: state => state.standards,
    result: state => state.result,
    tempUniversityName: state => state.tempUniversityName,
    SCgender: state => state.SCgender,
    dayType: state => state.dayType,
    stage: state => state.stage,
    directorate: state => state.directorate,
    documents: state => state.documents,
    allDocuments: state => state.allDocuments,
    mainDocuments: state => state.mainDocuments,
    MainUploadsDocuments: state => state.MainUploadsDocuments,
    done: state => state.done,
    lastStatus: state => state.lastStatus,
    lookups: state => state.lookups,
    SClookups: state => state.SClookups,
    teamDocumentDone: state => state.teamDocumentDone,
    extraFile: state => state.extraFile,
    categories: state => state.categories,
    departments: state => state.departments,
    organization_programs: state => state.organization_programs,
    is_disability: state => state.is_disability,
    qualifications: state => state.qualifications,
    years: state => state.years,
    items: state => state.items,
    basicDocuments(state) {
      return state.allDocuments.filter(elment => elment.title == 'الوثائق الرئيسية');
    },
  },
  mutations: {
    SET_EVALUATOR(state , evaluator){
      state.evaluator = evaluator;
    },
    SET_RUBRICS(state,rubrics){
      state.rubrics = rubrics;
    },
    SUB_SETTING_DATA(state, subSettingData) {
      state.subSettingData = subSettingData;
    },
    SET_SELECTED_INSTITUTE(state, institute_id) {
      state.institute_id = institute_id;
    },
    SET_SELECTED_GOVERNMENT(state, government_id) {
      state.government_id = government_id;
    },
    SET_CURRENT_STATUS(state, current_status) {
      state.current_status = current_status;
    },
    SET_SHOW_FILES(state, showFiles) {
      state.showFiles = showFiles;
    },
    SET_IN_DOCUMENTS(state, inDocuments) {
      state.inDocuments = inDocuments;
    },
    SET_ORG_INFO_REQUIRED(state, required) {
      state.orgInfoRequired = required;
    },
    SET_TOTAL_SUBMISSIONS(state, total) {
      state.totalSubmission = total;
    },
    SET_SUBMISSIONS(state, submissions) {
      state.submissions = submissions;
    },
    SET_ARCHIVE(state, archive) {
      state.archive = archive;
    },
    SET_SUBMISSIONS_LOAD(state, load) {
      state.submissionsLoad = load;
    },
    SET_PROGRAMS(state, programs) {
      state.programs = programs;
    },
    SET_TEAM(state, team) {
      state.team = team;
    },
    SET_VISIT_TABLE(state, table) {
      state.visitTable = table;
    },
    SET_DETAILS(state, details) {
      state.details = details;
    },
    SET_TYPES(state, types) {
      state.types = types;
    },
    SET_LEVELS(state, levels) {
      state.levels = levels;
    },
    SET_DETAILS_LOAD(state, load) {
      state.detailsLoad = load;
    },
    SET_TOTAL_QUESTIONS(state, total) {
      state.totalQuestions = total;
    },
    SET_QUESTIONS(state, questions) {
      state.questions = questions;
    },
    SET_QUESTIONS_LOAD(state, load) {
      state.questionsLoad = load;
    },
    SET_REPORT_LEVELS(state, levels) {
      state.reportLevels = levels;
    },
    SET_SUBMISSION(state, submission) {
      state.submission = submission;
    },
    SET_VISIT(state, visit) {
      state.visit = visit;
    },
    SET_APPROVALS(state, approvals) {
      state.approvals = approvals;
    },
    SET_PROGRAM(state, program) {
      state.program = program;
    },
    SET_DECISION(state, decision) {
      state.decision = decision;
    },
    SET_DECISIONS(state, decisions) {
      state.decisions = decisions;
    },
    SET_REPRESENTATIVE(state, representative) {
      state.representative = representative;
    },
    SET_SUBMISSION_LOAD(state, load) {
      state.submissionLoad = load;
    },
    SET_EVALUATION_TYPES(state, types) {
      state.evaluationTypes = types;
    },
    SET_SELF_REPORT(state, selfReport) {
      state.selfReport = selfReport;
    },
    SET_TEAMS(state, teams) {
      state.teams = teams;
    },
    SET_DOCUMENTS(state, documents) {
      state.documents = documents;
    },
    SET_MAIN_UPLOADS_DOCUMENTS(state, MainUploadsDocuments) {
      state.MainUploadsDocuments = MainUploadsDocuments;
    },
    SET_VISIT_TYPES(state, types) {
      state.visitTypes = types;
    },
    SET_VISIT_GROUPS(state, groups) {
      state.visitGroups = groups;
    },
    SET_FORMS(state, forms) {
      state.forms = forms;
    },
    SET_SELECTED_PROGRAMS(state, programs) {
      state.selectedPrograms = programs;
    },
    SET_SELECTED_ORGANIZATION(state, organization) {
      state.selectedOrganization = organization;
    },
    SET_SELECTED_UNIVERSITY(state, university) {
      state.selectedUniversity = university;
    },
    SET_SELECTED_TEAM(state, team) {
      state.selectedTeam = team;
    },
    SET_SELECTED_VISIT(state, selectedVisit) {
      state.selectedVisit = selectedVisit;
    },
    SET_SELECTED_DEAN_ADDRESS(state, authorized_address) {
      state.authorized_address = authorized_address;
    },
    SET_SELECTED_DEAN_NATIONAL_ID(state, authorized_national_id) {
      state.authorized_national_id = authorized_national_id;
    },
    SET_SELECTED_SELF_REPORT_TYPE(state, selectedSelf_report_type) {
      state.selectedSelf_report_type = selectedSelf_report_type;
    },
    SET_SELECTED_DEAN_PERSON(state, authorized_person) {
      state.authorized_person = authorized_person;
    },
    SET_SELECTED_DEAN_MOBILE(state, authorized_mobile) {
      state.authorized_mobile = authorized_mobile;
    },
    SET_SELECTED_EDUCATION(state, authorized_education) {
      state.authorized_education = authorized_education;
    },
    SET_SELECTED_JOB(state, authorized_job) {
      state.authorized_job = authorized_job;
    },
    SET_SELECTED_DEAN_PHONE(state, authorized_phone) {
      state.authorized_phone = authorized_phone;
    },
    SET_SELECTED_DEAN_EMAIL(state, authorized_email) {
      state.authorized_email = authorized_email;
    },
    SET_SELECTED_VISIT_TYPE(state, visit_type_id) {
      state.visit_type_id = visit_type_id;
    },
    SET_SELECTED_STUDENT_COUNT(state, student_count) {
      state.student_count = student_count;
    },
    SET_SELECTED_ORG_AREA(state, organization_area) {
      state.organization_area = organization_area;
    },
    SET_SELECTED_REPRESENTATIVE(state, representative_id) {
      state.representative_id = representative_id;
    },
    SET_SELECTED_OFFICAIL_COUNCIL(state, selectedOfficail_council) {
      state.selectedOfficail_council = selectedOfficail_council;
    },
    SET_SELECTED_PLAN(state, selectedPlan) {
      state.selectedPlan = selectedPlan;
    },
    SET_STANDARDS(state, standards) {
      state.standards = standards;
    },
    SET_RESULT(state, result) {
      state.result = result;
    },
    SET_SELECTED_EVA_TYPE(state, selectedEvatype) {
      state.selectedEvatype = selectedEvatype;
    },
    SET_SELECTED_ORG_TEMP(state, tempOrganizationName) {
      state.tempOrganizationName = tempOrganizationName;
    },
    SET_FEES(state, data) {
      state.fees = data;
    },
    SET_SELECTED_UNI_TEMP(state, tempUniversityName) {
      state.tempUniversityName = tempUniversityName;
    },
    SET_SCGENDER(state, SCgender) {
      state.SCgender = SCgender;
    },
    SET_DIRECTORATE(state, directorate) {
      state.directorate = directorate;
    },
    SET_ADMINISTRATION(state, administration) {
      state.administration = administration;
    },
    SET_STAGE(state, stage) {
      state.stage = stage;
    },
    SET_DAY_TYPE(state, dayType) {
      state.dayType = dayType;
    },
    SET_STATUS(state, check_status) {
      state.check_status = check_status;
    },
    SET_APPROVALS_STATUS(state, approvals_status) {
      state.approvals_status = approvals_status;
    },
    SET_PAYMENT(state, payment) {
      state.payment = payment;
    },
    SET_ALL_DOCUMENTS(state, allDocuments) {
      state.allDocuments = allDocuments;
    },
    SET_DONE(state, done) {
      state.done = done;
    },
    SET_MAIN_DOCUMENTS(state, mainDocuments) {
      state.mainDocuments = mainDocuments;
    },
    SET_MAIN_DOCUMENTS_TITLE(state, mainDocumentTitle) {
      state.mainDocumentTitle = mainDocumentTitle;
    },
    SET_CAN_UPLOAD(state, canUpload) {
      state.canUpload = canUpload;
    },
    SET_LAST_STATUS(state, status) {
      state.lastStatus = status;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
    SET_SCLOOKUPS(state, SClookups) {
      state.SClookups = SClookups;
    },
    SET_TEAM_DOCUMENT_DONE(state, done) {
      state.teamDocumentDone = done;
    },
    SET_UPLOADED_DOCS(state, uploadedDocs) {
      state.uploadedDocs = uploadedDocs;
    },
    SET_TEAM_DOCUMENTS(state, teamDocuments) {
      state.teamDocuments = teamDocuments;
    },
    SET_IF_DONE(state, ifDone) {
      state.ifDone = ifDone;
    },
    SET_DOCUMENTS_INFO(state, docsInfo) {
      state.docsInfo = docsInfo;
    },
    SET_SHOW_UPLOAD(state, showUpload) {
      state.showUpload = showUpload;
    },
    SET_EDITABLE_DOCUMENTS(state, editableDocs) {
      state.editableDocs = editableDocs;
    },
    SET_VISIT_TYPE(state, visitType) {
      state.visitType = visitType;
    },
    SET_EXTRA_FILE_UPLOAD(state, status) {
      state.extraFile = status;
    },
    SET_STATISTICS_DATA(state, statisticsData) {
      state.statisticsData = statisticsData;
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    SET_ITEMS(state, items) {
      state.items = items;
    },

    SET_DISABILITY(state, status) {
      state.is_disability = status;
    },
    SET_ORGANIZATION_PROGRAMS(state, programs) {
      state.organization_programs = programs;
    },

    SET_QUALIFICATIONS(state, qualifications) {
      state.qualifications = qualifications;
    },
    SET_YEARS(state, years) {
      state.years = years;
    },
    SET_DEPARTMENTS(state, departments) {
      state.departments = departments;
    },
    SET_ALERTS(state, alerts) {
      state.alerts = alerts;
    },
    SET_EVALUATION_ALERTS(state, alerts) {
      state.evaluation_alerts = alerts;
    },
    SET_LAST_ALERT(state, last_alert) {
      state.last_alert = last_alert;
    },
    SET_ORG_ACTIVE(state, orgActive) {
      state.orgActive = orgActive;
    },
    SET_CHILDREN(state, children) {
      state.children = children;
    },
    SET_INIT_DOCUMENTS(state, data) {
      state.initDocuments = data;
    },
    SET_SELECTED_EDUCATION_TYPE(state, data) {
      state.education_type = data;
    },
  },
  actions: {
    rubrics({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .rubrics(payload)
          .then(response => {
            commit('SET_RUBRICS', response.name);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    subSetting({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('archive/SET_GENERAL_LOAD', true, { root: true });
        submission
          .subSetting(payload.query)
          .then(response => {
            commit('SUB_SETTING_DATA', response);
            commit('archive/SET_GENERAL_LOAD', false, { root: true });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    showUpload({ commit }, query) {
      return new Promise((resolve, reject) => {
        commit('archive/SET_GENERAL_LOAD', true, { root: true });
        submission
          .showUpload(query)
          .then(response => {
            commit('archive/SET_GENERAL_LOAD', false, { root: true });
            if (query.query.status) {
              commit('SET_SHOW_FILES', 4);
            } else {
              commit('SET_SHOW_FILES', false);
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteDoc({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('archive/SET_GENERAL_LOAD', true, { root: true });
        submission
          .deleteDoc(id)
          .then(response => {
            commit('archive/SET_GENERAL_LOAD', false, { root: true });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    split({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .split(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    editDoc({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('archive/SET_GENERAL_LOAD', true, { root: true });
        submission
          .editDoc(payload)
          .then(response => {
            commit('archive/SET_GENERAL_LOAD', false, { root: true });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    submissions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSIONS_LOAD', true);
        submission
          .list(payload.query)
          .then(response => {
            commit('SET_SUBMISSIONS', response.submissions);
            commit('organization/SET_EDUCATION_TYPES', response.lookups.educationTypes, { root: true });
            commit('SET_TYPES', response.lookups.types);
            commit('group/SET_GROUPS', response.lookups.groups, { root: true });
            commit('SET_SCGENDER', response.lookups.schoolGenders);
            commit('SET_DIRECTORATE', response.directorate);
            commit('SET_ADMINISTRATION', response.administration);
            commit('SET_STAGE', response.lookups.stages);
            commit('SET_DAY_TYPE', response.lookups.dayTypes);
            commit('SET_DECISIONS', response.lookups.decisions);
            // if (payload.system == 'SC') {
            commit('SET_ALERTS', response.lookups.alerts);
            // } else {
            commit('SET_LEVELS', response.lookups.levels);
            // }
            commit('SET_VISIT_TYPES', response.lookups.visitTypes);
            commit('SET_TOTAL_SUBMISSIONS', response.count);
            commit('SET_SUBMISSIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    delete({ commit }, id) {
      return new Promise((resolve, reject) => {
        submission
          .delete(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    savePreRport({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .savePreRport(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveAdditionalData({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .saveAdditionalData(payload)
          .then(response => {
            return router.go(-1);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getStatisticsData({ commit }, evaluation_id) {
      commit('archive/SET_GENERAL_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        submission.getStatisticsData(evaluation_id).then(res => {
          commit('SET_STATISTICS_DATA', res);
          commit('SET_CATEGORIES', res.categories);
          commit('SET_QUALIFICATIONS', res.qualifications);
          commit('SET_YEARS', res.years);
          commit('SET_ITEMS', res.items);
          commit('SET_DEPARTMENTS', res.departments);
          commit('archive/SET_GENERAL_LOAD', false, { root: true });
          resolve();
        });
      });
    },
    getSCStatisticsData({ commit }, evaluation_id) {
      commit('archive/SET_GENERAL_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        submission.getSCStatisticsData(evaluation_id).then(res => {
          commit('SET_STATISTICS_DATA', res);
          commit('SET_SCLOOKUPS', res.lookups ? res.lookups : null);
          commit('archive/SET_GENERAL_LOAD', false, { root: true });
          resolve();
        });
      });
    },
    getStandards({ commit }, payload) {
      commit('archive/SET_GENERAL_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        submission.getStandards(payload.evaluation_id, payload.query).then(res => {
          if (!payload.query.show) {
            commit('SET_STANDARDS', res.standards);
          }
          commit('SET_RESULT', res.result);
          commit('archive/SET_GENERAL_LOAD', false, { root: true });
          resolve();
        });
      });
    },
    saveNote({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveNote(payload.id, payload.query).then(res => {
          resolve();
        });
      });
    },

    saveStatisticStaff({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveStatisticStaff(payload.query).then(res => {
          resolve();
        });
      });
    },

    saveDepartment({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveDepartment(payload.id, payload.query).then(res => {
          resolve();
        });
      });
    },

    saveSCstatistic({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveSCstatistic(payload.id, payload.type, payload.query).then(res => {
          resolve();
        });
      });
    },

    saveSCsubSetting({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveSCsubSetting(payload.id, payload.query).then(res => {
          resolve();
        });
      });
    },

    saveActivity({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveActivity(payload.id, payload.query).then(res => {
          resolve();
        });
      });
    },
    saveBulding({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveBulding(payload.id, payload.query).then(res => {
          resolve();
        });
      });
    },

    saveDetials({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveDetials(payload.id, payload.query).then(res => {
          resolve();
        });
      });
    },

    saveStandards({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveStandards(payload).then(res => {
          resolve();
        });
      });
    },
    saveEnhancement({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveEnhancement(payload).then(res => {
          resolve();
        });
      });
    },

    saveProgram({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission.saveProgram(payload.id, payload.query).then(res => {
          resolve();
        });
      });
    },
    getDocument({ commit }, evaluation_id) {
      commit('archive/SET_GENERAL_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        submission.getDocument(evaluation_id).then(res => {
          commit('SET_ALL_DOCUMENTS', res.documents);
          commit('SET_DOCUMENTS', res.uploads);
          commit('archive/SET_GENERAL_LOAD', false, { root: true });
          resolve();
        });
      });
    },

    getAllDocument({ commit }) {
      commit('archive/SET_GENERAL_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        submission.getAllDocument().then(res => {
          commit('SET_EDITABLE_DOCUMENTS', res.documents);
          commit('archive/SET_GENERAL_LOAD', false, { root: true });
          resolve();
        });
      });
    },

    getSubmissionDocument({ commit }, submission_id) {
      commit('archive/SET_GENERAL_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        submission.getSubmissionDocument(submission_id).then(res => {
          commit('SET_MAIN_DOCUMENTS', res.documents);
          commit('SET_TEAM_DOCUMENTS', res.teamDocuments);
          commit('SET_DOCUMENTS_INFO', res.info);
          commit('SET_MAIN_DOCUMENTS_TITLE', res.documents.title);
          commit('SET_MAIN_UPLOADS_DOCUMENTS', res.uploads);
          commit('archive/SET_GENERAL_LOAD', false, { root: true });
          resolve();
        });
      });
    },

    questions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_QUESTIONS_LOAD', true);
        submission
          .questions(payload.id, payload.query)
          .then(response => {
            commit('SET_QUESTIONS', response.questions);
            commit('SET_TOTAL_QUESTIONS', response.count);
            commit('SET_QUESTIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    details({ commit }, payload) {
      commit('SET_DETAILS_LOAD', true);
      return new Promise((resolve, reject) => {
        submission
          .details(payload.id, payload.questionnaire)
          .then(response => {
            commit('SET_DETAILS', response.details);
            commit('SET_DETAILS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    
    submission({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSION_LOAD', true);
        commit('SET_VISIT', '');
        submission.get(id)
          .then(response => {
            commit('SET_EVALUATOR', response.evaluator);
            commit('SET_SUBMISSION', response.submission);
            commit('SET_LOOKUPS', response.lookups);
            commit('documents/SET_DOCUMENTS', response.documents, { root: true });
            commit('SET_TEAM', response.submission.team);
            commit('SET_REPRESENTATIVE', response.representative);
            commit('SET_PAYMENT', response.payment);
            commit('SET_DECISION', response.decision);
            commit('SET_VISIT_TYPE', response.visit_type);
            commit('SET_VISIT_TABLE', response.submission.visit_time_table);
            commit('SET_EXTRA_FILE_UPLOAD',response.extraFile);
            // commit('evaluationNotes/SET_COMPLETE', response.complate, { root: true });
            commit('SET_ALERTS', response.alerts);
            commit('SET_PROGRAM', response.program);
            commit('SET_EVALUATION_ALERTS', response.evaluation_alerts);
            commit('SET_LAST_ALERT', response.last_alert ? response.last_alert : {});
            commit('SET_ORG_INFO_REQUIRED', response.isRequired);
            commit('SET_ORG_ACTIVE', response.organization_pending);
            commit('evaluation/SET_DECISIONS', response.decisions, { root: true });
            commit('SET_ORGANIZATION_PROGRAMS', response.organization_programs);
            commit('SET_SHOW_FILES', response.flag ? response.flag : null);
            commit('SET_DISABILITY', response.is_disability);
            commit('SET_CHILDREN', response.children);
            commit('evaluation/SET_TEAM', response.team, { root: true });
            commit('evaluation/SET_COMMITTEES', response.committee, { root: true });
            commit('evaluation/SET_EVALUATOR', response.evaluator || null, { root: true });
            commit('SET_SUBMISSION_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    
    move({ commit }, query) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSION_LOAD', true);
        submission.move(query)
          .then(() => {
            commit('SET_SUBMISSION_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    preSubmission({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSION_LOAD', true);
        submission
          .getPre(id)
          .then(response => {
            commit('SET_SUBMISSION', response.submission);
            commit('SET_LOOKUPS', response.lookups);
            commit('documents/SET_DOCUMENTS', response.documents, { root: true });
            commit('SET_TEAM', response.submission.team);
            commit('SET_REPRESENTATIVE', response.representative);
            commit('SET_PAYMENT', response.payment);
            commit('SET_DECISION', response.decision);
            commit('evaluationNotes/SET_COMPLETE', response.complate, { root: true });
            commit('SET_ALERTS', response.alerts);
            commit('SET_VISIT_TYPE', response.visit_type);
            commit('SET_VISIT_TABLE', response.submission.visit_time_table);
            commit('SET_EVALUATION_ALERTS', response.evaluation_alerts);
            commit('SET_LAST_ALERT', response.last_alert ? response.last_alert : {});
            commit('SET_ORG_INFO_REQUIRED', response.isRequired);
            commit('SET_ORG_ACTIVE', response.organization_pending);
            commit('evaluation/SET_DECISIONS', response.decisions, { root: true });
            commit('SET_SHOW_FILES', response.flag ? response.flag : null);
            commit('SET_DISABILITY', response.is_disability);
            commit('SET_CHILDREN', response.children);
            commit('evaluation/SET_TEAM', response.team, { root: true });
            commit('evaluation/SET_COMMITTEES', response.committee, { root: true });
            commit('evaluation/SET_EVALUATOR', response.evaluator || null, { root: true });
            commit('SET_SUBMISSION_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    groupSubmission({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSION_LOAD', true);
        commit('SET_VISIT', '');
        submission
          .groupSubmissions(id)
          .then(response => {
            commit('SET_SUBMISSION', response.submission);
            commit('SET_LOOKUPS', response.lookups);
            commit('SET_TEAM', response.submission.team);
            commit('SET_VISIT_TABLE', response.submission.visit_time_table);
            commit('SET_REPRESENTATIVE', response.representative);
            commit('SET_TEAM_DOCUMENT_DONE', response.team_documents_done);
            commit('SET_DOCUMENTS_INFO', response.info);
            commit('SET_CAN_UPLOAD', response.canUpload);
            commit('SET_PAYMENT', response.payment);
            commit('SET_LAST_ALERT', response.last_alert ? response.last_alert : {});
            commit('SET_PROGRAMS', response.programs);
            commit('SET_PROGRAM', response.program ? response.program : null);
            commit('SET_ALERTS', response.alerts);
            commit('SET_EVALUATION_ALERTS', response.evaluation_alerts);
            commit('SET_ORGANIZATION_PROGRAMS', response.organization_programs);
            commit('SET_ARCHIVE', response.archive);
            commit('SET_SHOW_FILES', response.flag ? response.flag : null);
            commit('SET_VISIT', response.submission.visit_group);
            commit('SET_ORG_INFO_REQUIRED', response.isRequired);
            commit('evaluation/SET_EVALUATOR', response.evaluator || null, { root: true });
            commit('SET_SUBMISSION_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    edit({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSIONS_LOAD', true);
        submission
          .edit(payload)
          .then(response => {
            commit('SET_EVALUATION_TYPES', response.evaluationTypes);
            commit('SET_SELF_REPORT', response.selfReport);
            commit('SET_TEAMS', response.teams);
            commit('SET_PAYMENT', response.payment);
            commit('SET_VISIT_TYPES', response.visitTypes);
            commit('SET_PROGRAMS', response.programs);
            commit('SET_VISIT_GROUPS', response.visitGroups);
            commit('SET_FORMS', response.forms);
            commit('SET_IN_DOCUMENTS', response.documents);
            commit('SET_UPLOADED_DOCS', response.uploads);
            commit('SET_STATUS', response.status);
            commit('SET_LOOKUPS', response.lookups);
            commit('SET_LAST_ALERT', response.last_alert ? response.last_alert : {});
            commit('SET_CURRENT_STATUS', response.current_status);
            commit('SET_SELECTED_ORGANIZATION', response.selectedInfo ? response.selectedInfo.organization_id : null);
            commit('SET_SELECTED_UNIVERSITY', response.selectedInfo ? response.selectedInfo.university_id : null);
            commit('SET_SELECTED_PROGRAMS', response.selectedInfo ? response.selectedInfo.programs : null);
            commit('SET_SELECTED_SELF_REPORT_TYPE', response.selectedInfo ? response.selectedInfo.self_report_type : null);
            commit('SET_FEES', response.fees);
            commit('SET_SELECTED_DEAN_PERSON', response.selectedInfo ? response.selectedInfo.authorized_person : null);
            commit('SET_SELECTED_DEAN_MOBILE', response.selectedInfo ? response.selectedInfo.authorized_mobile : null);
            commit('SET_SELECTED_DEAN_PHONE', response.selectedInfo ? response.selectedInfo.authorized_phone : null);
            commit('SET_SELECTED_DEAN_EMAIL', response.selectedInfo ? response.selectedInfo.authorized_email : null);
            commit('SET_SELECTED_VISIT_TYPE', response.selectedInfo ? response.selectedInfo.visit_type_id : null);
            commit('SET_SELECTED_STUDENT_COUNT', response.selectedInfo ? response.selectedInfo.student_count : null);
            commit('SET_SELECTED_ORG_AREA', response.selectedInfo ? response.selectedInfo.organization_area : null);
            commit('SET_SELECTED_REPRESENTATIVE', response.selectedInfo ? response.selectedInfo.representative : null);
            commit('SET_SELECTED_OFFICAIL_COUNCIL', response.selectedInfo ? response.selectedInfo.officail_council : null);
            commit('SET_SELECTED_PLAN', response.selectedInfo ? response.selectedInfo.plan : null);
            commit('SET_SELECTED_VISIT', response.selectedInfo ? response.selectedInfo.visit_group_id : null);
            commit('SET_SELECTED_TEAM', response.selectedInfo ? response.selectedInfo.team : null);
            commit('SET_SELECTED_EVA_TYPE', response.selectedInfo ? response.selectedInfo.evaluation_type : null);
            commit('SET_SELECTED_UNI_TEMP', response.selectedInfo ? response.selectedInfo.temp_university_name : null);
            commit('SET_SELECTED_ORG_TEMP', response.selectedInfo ? response.selectedInfo.temp_organization_name : null);
            commit('form/SET_SELECTED_FORM', response.selectedInfo ? response.selectedInfo.form_id : null, { root: true });
            commit('SET_SUBMISSIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    exportSubWord({ commit }, payload) {
      commit('SET_DETAILS_LOAD', true);
      return new Promise((resolve, reject) => {
        submission
          .exportSubWord(payload)
          .then(response => {
            FileDownload(response, `${payload.date + '_' + payload.name}.docx`);
            commit('SET_DETAILS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    exportHEPdf({ commit }, payload) {
        commit('SET_DETAILS_LOAD', true);
        return new Promise((resolve, reject) => {
          submission
            .exportHEPdf(payload)
            .then(response => {
              FileDownload(response, `${payload.date + '_' + payload.name}.pdf`);
              commit('SET_DETAILS_LOAD', false);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        });
      },
    exportSubPdf({ commit }, payload) {
      commit('SET_DETAILS_LOAD', true);
      return new Promise((resolve, reject) => {
        submission
          .exportSubPdf(payload)
          .then(response => {
            FileDownload(response, `${payload.date + '_' + payload.name}.pdf`);
            commit('SET_DETAILS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    groupWord({ commit },payload) {
      commit('SET_DETAILS_LOAD', true);
      return new Promise((resolve, reject) => {
        submission
          .groupWord(payload)
          .then(response => {
            FileDownload(response, `${payload.date + '_' + payload.name}.docx`);
            commit('SET_DETAILS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    groupPdf({ commit },payload) {
      commit('SET_DETAILS_LOAD', true);
      return new Promise((resolve, reject) => {
        submission
          .groupPdf(payload)
          .then(response => {
            FileDownload(response, `${payload.date + '_' + payload.name}.pdf`);
            commit('SET_DETAILS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    SCedit({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSIONS_LOAD', true);
        submission
          .SCedit(payload)
          .then(response => {
            commit('SET_EVALUATION_TYPES', response.evaluationTypes);
            commit('SET_SELF_REPORT', response.selfReport);
            commit('SET_LAST_ALERT', response.last_alert ? response.last_alert : {});
            commit('SET_TEAMS', response.teams);
            commit('finance/SET_WALLET', [false, response.credit, null], { root: true });
            commit('SET_PAYMENT', response.payment);
            commit('organization/SET_LOOKUPS', response.eduction_types, { root: true });
            commit('SET_VISIT_TYPES', response.visitTypes);
            commit('SET_PROGRAMS', response.programs);
            commit('SET_VISIT_GROUPS', response.visitGroups);
            commit('SET_FORMS', response.forms);
            commit('SET_IN_DOCUMENTS', response.document);
            commit('SET_INIT_DOCUMENTS', response.documents);
            commit('SET_UPLOADED_DOCS', response.uploads);
            commit('SET_STATUS', response.last_alert ? response.last_alert.status : null);
            commit('SET_LOOKUPS', response.lookups);
            commit('SET_FEES', response.fees);
            commit('SET_CURRENT_STATUS', response.current_status);
            commit('SET_SELECTED_EDUCATION', response.selectedInfo ? response.selectedInfo.authorized_education : null);
            commit('SET_SELECTED_JOB', response.selectedInfo ? response.selectedInfo.authorized_job : null);
            commit('SET_SELECTED_INSTITUTE', response.selectedInfo ? response.selectedInfo.institute_id : null);
            commit('SET_SELECTED_GOVERNMENT', response.selectedInfo ? response.selectedInfo.government_id : null);
            commit('SET_SELECTED_PROGRAMS', response.selectedInfo ? response.selectedInfo.programs : null);
            commit('SET_SELECTED_SELF_REPORT_TYPE', response.selectedInfo ? response.selectedInfo.self_report_type : null);
            commit('SET_SELECTED_ORGANIZATION', response.selectedInfo ? response.selectedInfo.organization_id : null);
            commit('SET_SELECTED_DEAN_PERSON', response.selectedInfo ? response.selectedInfo.authorized_person : null);
            commit('SET_SELECTED_DEAN_NATIONAL_ID', response.selectedInfo ? response.selectedInfo.authorized_national_id : null);
            commit('SET_SELECTED_DEAN_ADDRESS', response.selectedInfo ? response.selectedInfo.authorized_address : null);
            commit('SET_SELECTED_DEAN_MOBILE', response.selectedInfo ? response.selectedInfo.authorized_mobile : null);
            commit('SET_SELECTED_DEAN_PHONE', response.selectedInfo ? response.selectedInfo.authorized_phone : null);
            commit('SET_SELECTED_DEAN_EMAIL', response.selectedInfo ? response.selectedInfo.authorized_email : null);
            commit('SET_SELECTED_VISIT_TYPE', response.selectedInfo ? response.selectedInfo.visit_type_id : null);
            commit('SET_SELECTED_EDUCATION_TYPE', response.selectedInfo ? response.selectedInfo.education_type : null);
            commit('SET_SELECTED_STUDENT_COUNT', response.selectedInfo ? response.selectedInfo.student_count : null);
            commit('SET_SELECTED_ORG_AREA', response.selectedInfo ? response.selectedInfo.organization_area : null);

            commit(
              'SET_SELECTED_REPRESENTATIVE',
              response.selectedInfo
                ? {
                    ar_name: response.selectedInfo.representative,
                    id: response.selectedInfo.representative_id,
                  }
                : null
            );
            commit('SET_SELECTED_OFFICAIL_COUNCIL', response.selectedInfo ? response.selectedInfo.officail_council : null);
            commit('SET_SELECTED_PLAN', response.selectedInfo ? response.selectedInfo.plan : null);
            commit('SET_SELECTED_VISIT', response.selectedInfo ? response.selectedInfo.visit_group_id : null);
            commit('SET_SELECTED_TEAM', response.selectedInfo ? response.selectedInfo.team : null);
            commit('SET_SELECTED_EVA_TYPE', response.selectedInfo ? response.selectedInfo.evaluation_type : null);
            commit('SET_SELECTED_UNI_TEMP', response.selectedInfo ? response.selectedInfo.temp_university_name : null);
            commit('SET_SELECTED_ORG_TEMP', response.selectedInfo ? response.selectedInfo.temp_organization_name : null);
            commit('form/SET_SELECTED_FORM', response.selectedInfo ? response.selectedInfo.form_id : null, { root: true });
            commit('SET_SUBMISSIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    activeSubmission({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSIONS_LOAD', true);
        submission
          .activeSubmission(payload)
          .then(response => {
            return router.go(-1);
            // if (response.type === 'group') {
            //   return router.push(`/higher/submissions/group/${response.submission_id}`);
            // }
            // return router.push(`/higher/submissions/submission/${response.submission_id}/${response.evaluation_id}`);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    SCactiveSubmission({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMISSIONS_LOAD', true);
        submission
          .SCactiveSubmission(payload)
          .then(response => {
            router.go(-1);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    teamState({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .teamState(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    excusedRepresentative({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .excusedRepresentative(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    save({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .save(payload)
          .then(response => {
            if (response.type === 'group') {
              return router.push(`/higher/submissions/group/${response.submission_id}`);
            }
            return router.push(`/higher/submissions/submission/${response.submission_id}/${response.evaluation_id}`);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    SCsave({ commit }, [payload, type]) {
      return new Promise((resolve, reject) => {
        submission
          .SCsave(payload)
          .then(response => {
            if (!type) resolve();
            return router.push(`/school/submissions/edit/${response.evaluation_id}/${response.submission_id}/2`);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    approveQuality({ commit }, id) {
      return new Promise((resolve, reject) => {
        submission
          .approveQuality(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    saveFinance({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .saveFinance(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    saveAdministration({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .saveAdministration(payload)
          .then(response => {
            commit('SET_SELECTED_ORGANIZATION', response.institute);
            // commit('SET_SELECTED_UNIVERSITY', response.university);
            // commit('SET_SELECTED_PROGRAMS', response.programs);

            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    saveOrganization({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .saveOrganization(payload)
          .then(response => {
            commit('SET_SELECTED_ORGANIZATION', response.organization);
            commit('SET_SELECTED_UNIVERSITY', response.university);
            commit('SET_SELECTED_PROGRAMS', response.programs);

            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    export({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .export(payload.query)
          .then(response => {
            FileDownload(response, `${payload.date + '_' + payload.name}.xlsx`);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    undoRedo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .undoRedo(payload.type, payload.submission)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    PreundoRedo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .PreundoRedo(payload.type, payload.submission)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    followVisit({ commit }, id) {
      return new Promise((resolve, reject) => {
        submission
          .followVisit(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    changeDisabilityStatus({ commit }, id) {
      return new Promise((resolve, reject) => {
        submission
          .changeDisabilityStatus(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    saveTeam({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .saveTeam(payload)
          .then(response => {
            commit('SET_SELECTED_TEAM', response.team);
            return router.push(`/higher/team/${response.team.id}`);
            // commit('SET_SELECTED_UNIVERSITY', response.university);
            // commit('SET_SELECTED_PROGRAMS', response.programs);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    addVisit({ commit }, payload) {
      return new Promise((resolve, reject) => {
        submission
          .addVisit(payload.query)
          .then(response => {
            commit('SET_SELECTED_VISIT', response.visit);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default submissionModule;
