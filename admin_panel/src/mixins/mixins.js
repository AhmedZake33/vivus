import Vue from 'vue';
import store from '../store/store';
import Cookies from 'js-cookie';
import { doc } from 'prettier';
import { find } from '@amcharts/amcharts4/.internal/core/utils/Iterator';

const Diff = require('diff');

Vue.mixin({
  methods: {
    hasPermission: function (permission) {
      return store.getters['roles/authUserRolesPermissionsName'].includes(permission) || store.getters['roles/authUserPermissionsName'].includes(permission);
    },
    hasNoPermission: function (permission) {
      return store.getters['roles/authUserRolesPermissionsName'].includes(permission);
    },
    authUser: function () {
      if (Cookies.get('user')) {
        let auth = JSON.parse(Cookies.get('user'));
        if (auth) {
          return auth;
        }
      }
      return {};
    },

    isAuthUser: function (user_id) {
      let auth = JSON.parse(Cookies.get('user'));
      if (auth && user_id) {
        return auth.id === user_id;
      }
    },

    isAuth: function (user) {
      let auth = JSON.parse(Cookies.get('user'));
      if (auth && user) {
        return auth.id === user.id;
      }
    },
    isEqualStatus(s1, s2) {
      if (s1) {
        return s1.status === s2;
      }
    },
    isEqualCurrentStatus(s1, s2) {
      if (s1) {
        return s1.current_status === s2;
      }
    },
    print(id, title = 'title') {
      const prtHtml = document.getElementById(`${id}`).innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }

      // Open the print window
      const WinPrint = window.open('', '', 'left=0,top=0,width=800, height=700,toolbar=0,scrollbars=0,status=0');

      WinPrint.document.write(`<!DOCTYPE html>
                                        <html dir="rtl">
                                          <head>
                                            ${stylesHtml}
                                            <style>
                                              a{
                                              text-decoration:none !important;
                                              }
                                              .print_hide{
                                                  display:none !important
                                              }
                                            </style>
                                          </head>
                                          <body style="padding: 5px;">
                                          <div style="background-color: #fff" class="d-flex justify-content-between align-items-center  pl-2 pr-2  pb-5 pt-4">
                                              <div class="text-center">
                                                   <h5 class="text-center">جمهورية مصر العربية</h5>
                                                   <h5 class="text-center">الهيئة القومية لضمان جودة التعليم والاعتماد</h5>
                                               </div>
                                                <img src="/logo.png" width="80" height="80"  class="mr-4">
                                           </div>
                                            <h4 class="text-center p-5" style="background-color:#ffffff">${title}</h4>
                                            ${prtHtml}
                                          </body>
                                        </html>`);
      WinPrint.document.close();
      // WinPrint.focus();
      WinPrint.print();
      // WinPrint.close();
    },
    isGthCurrentStatus(s1, s2) {
      if (s1) {
        return s1.current_status > s2;
      }
    },
    isNotEqualStatus(s1, s2) {
      if (s1) {
        return s1.status !== s2;
      }
    },
    isGthStatus(s1, s2) {
      if (s1) {
        return s1.status > s2;
      }
    },
    isLthStatus(s1, s2) {
      if (s1) {
        return s1.status < s2;
      }
    },
    isLthEqStatus(s1, s2) {
      if (s1) {
        return s1.status <= s2;
      }
    },
    ntBr(string) {
      if (string) {
        return string.replace(/\n/g, '<br />');
      }
    },

    compare(oldReport, newReport) {
      var dif = ' ';
      Diff.diffWords(oldReport, newReport).forEach(part => {
        dif += part.added ? `<ins style="text-decoration: none; color: #00796B;background: #E0F2F1">${part.value + ' '}</ins>` : part.removed ? `<del style="color: #b30000;background: #fadad7">${part.value + ' '}</del>` : `<span>${part.value + ' '}</span>`;
      });
      return dif;
    },
    getDateNow() {
      var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      let date_now = new Date(Date.now()).toLocaleDateString('en-US', options);
      return String(date_now).trim();
    },
    getLevels(data, type) {
      if (type == 1) {
        return data.slice(0, 3);
      } else {
        return data.slice(-5);
      }
    },
    toLocalDatetime(input, lang = 'ar', time = false) {
      const datetime = new Date(input);
      datetime.getTimezoneOffset();
      if (time) {
        return datetime.toLocaleTimeString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } else {
        return datetime.toLocaleDateString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    },
    isGthEqStatus(s1, s2) {
      if (s1) {
        return s1.status >= s2;
      }
    },
    getTeamElements(team, role) {
      if (team) {
        let teamByRole = team.all_members.filter(function (member) {
          return member.team_job === role;
        });
        switch (role) {
          case this.constants('LEADER'):
            return teamByRole[0] ? teamByRole[0].id : null;
          case this.constants('MEMBER'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : [];
          case this.constants('COMMITTEE'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : [];
          case this.constants('OBSERVE'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : [];
          default:
            return teamByRole;
        }
      }
    },
    getTeamElementsByUserId(team, role) {
      if (team) {
        let teamByRole = team.all_members.filter(function (member) {
          return member.team_job === role;
        });
        switch (role) {
          case this.constants('LEADER'):
            return teamByRole[0] ? teamByRole[0].user_id : null;
          case this.constants('MEMBER'):
            return teamByRole ? Array.from(teamByRole, member => member.user_id) : [];
          case this.constants('COMMITTEE'):
            return teamByRole ? Array.from(teamByRole, member => member.user_id) : [];
          case this.constants('OBSERVE'):
            return teamByRole ? Array.from(teamByRole, member => member.user_id) : [];
          default:
            return teamByRole;
        }
      }
    },
    getRepresentative(Representative) {
      if (Representative) {
        return Representative ? Representative.id : null;
      }
    },
    getTrainers(trainers) {
      if (trainers && trainers.length) {
        return Array.from(trainers, member => member.pivot.member_id);
      } else {
        return [];
      }
    },
    getTeamMember(team, role) {
      if (team) {
        let teamByRole = team.all_members.filter(function (member) {
          return member.team_job === role;
        });
        switch (role) {
          case this.constants('LEADER'):
            return teamByRole[0] ? teamByRole[0].id : null;
          case this.constants('MEMBER'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : [];
          case this.constants('COMMITTEE'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : [];
          case this.constants('REVIEWERS'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : [];
          case this.constants('OBSERVE'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : [];
          default:
            return teamByRole;
        }
      }
    },
    hideClass(className) {
      let elementName = this.$el.querySelectorAll(`${className}`);
      elementName.forEach(element => {
        element.style.display = 'none';
      });
    },
    // checkIfDone(){
    // //   let elementName = this.$el.querySelectorAll('#parent_true');

    // //   if(this.$store.getters['submission/allDocuments'][1].folders.length == elementName.length) return true;
    // },
    checkSubIfExist(uploadedDocs, subDocs) {
      let shortUploadedDocs = [];
      let shortSubDocs = [];
      uploadedDocs.forEach(element => {
        shortUploadedDocs.push(element.short_name);
      });
      subDocs.forEach(element => {
        shortSubDocs.push(element.short_name);
      });
      const found = shortUploadedDocs.some(r => shortSubDocs.indexOf(r) >= 0);
      return found;
    },
    getCountOfUploadsFiles(uploadedDocs, short_names, form) {
      let count = [];
      if (uploadedDocs) {
        short_names.forEach((element, index) => {
          let document = this.getDocByShortName(uploadedDocs, element.short_name);
          if (document && element.form == form) {
            count.push(document);
          }
        });
        return count.length;
      }
    },
    getUploadsFiles(uploadedDocs, short_names) {
      if (uploadedDocs) {
        short_names.forEach((element, index) => {
          let document = this.getDocByShortName(uploadedDocs, element.short_name);
          short_names[index].document = document ? document : false;
        });
        return short_names;
      }
    },
    documentsDone(uploadedDocs, short_names) {
      if (uploadedDocs) {
        let status = true;
        short_names.forEach((element, index) => {
          let document = this.getDocByShortName(uploadedDocs, element.short_name);
          if (!document) {
            status = false;
          }
        });
        return status;
      }
    },
    checkIfExist(docs, short_name) {
      let existFiles = [];
      docs.forEach(element => {
        existFiles.push(element.short_name);
      });
      return existFiles.includes(short_name);
    },
    getDocSize(docs, short_name) {
      let document = '';
      docs.forEach(element => {
        if (element.short_name == short_name) {
          document = '(' + element.size + ')';
        }
      });
      return document;
    },
    getDocDate(docs, short_name) {
      let document = '';
      docs.forEach(element => {
        if (element.short_name == short_name) {
          document = '(' + this.toLocalDatetime(element.updated_at) + ')';
        }
      });
      return document;
    },
    getDocId(docs, short_name) {
      let document = null;
      docs.forEach(element => {
        if (element.short_name == short_name) {
          document = element.id;
        }
      });
      return document;
    },
    getDocByShortName(docs, short_name) {
      let document = false;
      docs.forEach(element => {
        if (element.short_name === short_name) {
          document = element;
        }
      });
      return document;
    },
    getDocUrl(docs, short_name) {
      let document = null;
      docs.forEach(element => {
        if (element.short_name == short_name) {
          document = element.url;
        }
      });
      return document;
    },
    documentType: function (index) {
      const APPROVAL_ORGANIZATION = 1;
      const AUTHORIZATION_ORGANIZATION = 2;
      const INTERNAL_FIRST_REGULATION = 3;
      const FINANCIAL_LETTER = 4;

      const STRATEGIC_PLAN = 5;
      const SELF_STUDY = 6;
      const PROGRAMS_FIRST_DESCRIPTION = 7;
      const PROGRAM_REPORTS = 8;
      const INTERNAL_REGULATION = 9;
      const PROGRAMS_HIGH_DESCRIPTION = 10;
      const YEAR_REPORTS = 11;
      const ORGANIZATION_VIDEO = 12;
      const EXTENSION_SELF_REPORT = 13;
      const IMPROVEMENT_PLAN = 14;
      const SUPPORT_FILE = 15;

      switch (index) {
        case APPROVAL_ORGANIZATION:
          return 'APPROVAL_ORGANIZATION';
        case AUTHORIZATION_ORGANIZATION:
          return 'AUTHORIZATION_ORGANIZATION';
        case INTERNAL_FIRST_REGULATION:
          return 'INTERNAL_FIRST_REGULATION';
        case FINANCIAL_LETTER:
          return 'FINANCIAL_LETTER';
        case STRATEGIC_PLAN:
          return 'STRATEGIC_PLAN';
        case SELF_STUDY:
          return 'SELF_STUDY';
        case PROGRAMS_FIRST_DESCRIPTION:
          return 'PROGRAMS_FIRST_DESCRIPTION';
        case PROGRAM_REPORTS:
          return 'PROGRAM_REPORTS';
        case INTERNAL_REGULATION:
          return 'INTERNAL_REGULATION';
        case PROGRAMS_HIGH_DESCRIPTION:
          return 'PROGRAMS_HIGH_DESCRIPTION';
        case YEAR_REPORTS:
          return 'YEAR_REPORTS';
        case ORGANIZATION_VIDEO:
          return 'ORGANIZATION_VIDEO';
        case EXTENSION_SELF_REPORT:
          return 'EXTENSION_SELF_REPORT';
        case IMPROVEMENT_PLAN:
          return 'IMPROVEMENT_PLAN';
        case SUPPORT_FILE:
          return 'SUPPORT_FILE';
      }
    },
    mandatoryDocs(mandatoryFiles, uploadedFile) {
      let document = [];
      if (mandatoryFiles[0]) {
        mandatoryFiles[0].documents.forEach(reqFile => {
          uploadedFile.forEach(uploadedFile => {
            if (reqFile.short_name == uploadedFile.short_name) {
              document.push(reqFile);
            }
          });
        });
      }
      return document;
    },
    getType() {
      if (store.state.submission.last_alert) {
        return store.state.submission.last_alert.type;
      }
      return false;
    },
    checkFound(arr1,arr2){
      if(arr1 && arr2)
      {  
        if(arr1.length != 0 && arr2.length != 0)
        {
            return arr1.some( ai => arr2.includes(ai) );
        }else{
            return false;
        }
      }
    },
    showConstants: function (type, key) {
      let showTypes = [
        { id: 1, name: 'DEFUALT_APPROVAL' },
        { id: 2, name: 'SUBMISSION_UPDATE' },
        { id: 3, name: 'FINANCE_UPDATE' },
        { id: 4, name: 'TEAM_UPDATE' },
        { id: 8, name: 'VISIT_UPDATE' },
        { id: 5, name: 'MEMBER_APPROVAL' },
        { id: 6, name: 'REPORT_APPROVAL' },
        { id: 7, name: 'REPORT_APPROVAL_TEAM_COMMITTEE' },
        { id: 9, name: 'LEADER_APPROVAL' },
        { id: 10, name: 'NO_CHANGE' },
      ];
      if (type == 'array') {
        return showTypes;
      } else if (type == 'num') {
        if (key) {
          let filtered = showTypes.find(el => el.id == key);
          return filtered.name;
        }
      } else if (type == 'string') {
        if (key) {
          let filtered = showTypes.find(el => el.name == key);
          return filtered.id;
        }
      }
    },

    // tr_taskConstants: function (type, key) {
    //     let tasks = [
    //         {id: 1, name: 'coach'},
    //         {id: 2, name: 'trainee'},
    //         {id: 3, name: 'plan_manager'},
    //     ];
    //     if (type == 'array') {
    //         return tasks;
    //     } else if (type == 'num') {
    //         if (key) {
    //             let filtered = tasks.find(el => el.id == key);
    //             return filtered.name;
    //         }
    //     } else if (type == 'string') {
    //         if (key) {
    //             let filtered = tasks.find(el => el.name == key);
    //             return filtered.id;
    //         }
    //     }
    // },

    taskConstants: function (type, key, system = 1) {
      var tasks = [];
      if (system == 3) {
        tasks = [
          { id: 1, name: 'COACH_TASK' },
          { id: 2, name: 'TRAINEE_TASK' },
          { id: 14, name: 'TRAINING_MANAGER_TASK' },
          { id: 5, name: 'VICE_TASK' },
          { id: 6, name: 'PRESIDENT_TASK' },
          { id: 7, name: 'FINANCE_TASK' },
        ];
      } else {
        tasks = [
          { id: 1, name: 'TEAM_TASK' },
          { id: 2, name: 'ORGANIZATION_TASK' },
          { id: 3, name: 'COMMITTEE_TASK' },
          { id: 4, name: 'ACCREDITATION_TASK' },
          { id: 5, name: 'VICE_TASK' },
          { id: 6, name: 'PRESIDENT_TASK' },
          { id: 7, name: 'FINANCE_TASK' },
          { id: 8, name: 'MANAGER_TASK' },
          { id: 9, name: 'TEAM_COMMITTEE_TASK' },
          { id: 11, name: 'TEAM_LEADER_TASK' },
          { id: 12, name: 'MANAGER_ACCREDITATION_TASK' },
          { id: 13, name: 'PUBLIC_RELATIONS_LEADER_TASK' },
          { id: 15, name:'LEADER_ACCREDITATION_TYPE'}
        ];
      }
      if (type == 'array') {
        return tasks;
      } else if (type == 'num') {
        if (key) {
          let filtered = tasks.find(el => el.id == key);
          return filtered.name;
        }
      } else if (type == 'string') {
        if (key) {
          let filtered = tasks.find(el => el.name == key);
          return filtered.id;
        }
      }
    },

    updateConstants: function (type, key) {
      let updates = [
        { id: 1, name: 'DOCUMENTS_UPDATE' },
        { id: 2, name: 'REPORT_UPDATE' },
        { id: 3, name: 'ADD_COMMENT' },
        { id: 4, name: 'TAKE_DECISION' },
        { id: 0, name: 'NO_CHANGE' },
      ];
      if (type == 'array') {
        return updates;
      } else if (type == 'num') {
        if (key) {
          let filtered = updates.find(el => el.id == key);
          return filtered.name;
        }
      } else if (type == 'string') {
        if (key) {
          let filtered = updates.find(el => el.name == key);
          return filtered.id;
        }
      }
    },

    evaluatorCheck: function (arr, system = 1) {
      let checkArray = this.evaluatorConstants('string', arr, system);
      let AuthArray = this.$store.state.evaluation.evaluator;
      if (AuthArray) {
        return checkArray.some(type => {
          return AuthArray.some(f => {
            return f == type;
          });
        });
      }
    },

    createdByConstants: function (type, key, system = 1) {
      let evaluators = [];
      if (system == 3) {
        evaluators = [
          { id: 1, name: 'COACH_TYPE' },
          { id: 2, name: 'TRAINEE_TYPE' },
          { id: 4, name: 'TRAINING_MANAGER_TYPE' },
          { id: 5, name: 'VICE_TYPE' },
          { id: 6, name: 'PRESIDENT_TYPE' },
          { id: 12, name: 'FINANCE_TYPE' },
        ];
      } else {
        evaluators = [
          { id: 1, name: 'TEAM_TYPE' },
          { id: 2, name: 'ORGANIZATION_TYPE' },
          { id: 3, name: 'COMMITTEE_TYPE' },
          { id: 4, name: 'ACCREDITATION_TYPE' },
          { id: 5, name: 'VICE_TYPE' },
          { id: 6, name: 'PRESIDENT_TYPE' },
          { id: 7, name: 'MANAGER_TYPE' },
          { id: 8, name: 'LEADER_TYPE' },
          { id: 9, name: 'MEMBER_TYPE' },
          { id: 10, name: 'REVIEWER_TYPE' },
          { id: 11, name: 'MANAGER_ACCREDITATION_TYPE' },
          { id: 12, name: 'FINANCE_TYPE' },
        ];
      }
      if (type == 'array') {
        return evaluators;
      } else if (type == 'num') {
        if (key) {
          let filtered = evaluators.find(el => el.id == key);
          return filtered.name;
        }
      } else if (type == 'string' && typeof key == 'string') {
        if (key) {
          let filtered = evaluators.find(el => el.name == key);
          return filtered ? filtered.id : null;
        }
      } else if (type == 'string' && Array.isArray(key)) {
        if (key) {
          let ids = evaluators.filter(type => {
            return key.some(f => {
              return f == type.name;
            });
          });
          return ids.map(el => el.id);
        }
        // if (key) {
        //   let filtered = evaluators.find(el => el.name == key);
        //   return filtered.id;
        // }
      }
    },

    evaluatorConstants: function (type, key, system = 1) {
      var evaluators = [];
      if (system == 3) {
        evaluators = [
          { id: 1, name: 'COACH_TYPE' },
          { id: 2, name: 'TRAINEE_TYPE' },
          { id: 13, name: 'TRAINING_MANAGER_TYPE' },
          { id: 5, name: 'VICE_TYPE' },
          { id: 6, name: 'PRESIDENT_TYPE' },
          { id: 12, name: 'FINANCE_TYPE' },
        ];
      } else {
        evaluators = [
          { id: 1, name: 'TEAM_TYPE' },
          { id: 2, name: 'ORGANIZATION_TYPE' },
          { id: 3, name: 'COMMITTEE_TYPE' },
          { id: 4, name: 'ACCREDITATION_TYPE' },
          { id: 5, name: 'VICE_TYPE' },
          { id: 6, name: 'PRESIDENT_TYPE' },
          { id: 7, name: 'MANAGER_TYPE' },
          { id: 8, name: 'LEADER_TYPE' },
          { id: 9, name: 'MEMBER_TYPE' },
          { id: 10, name: 'REVIEWER_TYPE' },
          { id: 11, name: 'MANAGER_ACCREDITATION_TYPE' },
          { id: 12, name: 'FINANCE_TYPE' },
          {id: 14 , name: 'LEADER_ACCREDITATION_TYPE'}
        ];
      }
      if (type == 'array') {
        return evaluators;
      } else if (type == 'num') {
        if (key) {
          let filtered = evaluators.find(el => el.id == key);
          return filtered.name;
        }
      } else if (type == 'string' && typeof key == 'string') {
        if (key) {
          let filtered = evaluators.find(el => el.name == key);
          return filtered ? filtered.id : null;
        }
      } else if (type == 'string' && Array.isArray(key)) {
        if (key) {
          let ids = evaluators.filter(type => {
            return key.some(f => {
              return f == type.name;
            });
          });
          return ids.map(el => el.id);
        }
        // if (key) {
        //   let filtered = evaluators.find(el => el.name == key);
        //   return filtered.id;
        // }
      }
    },

    constants: function (key) {
      const REFUSE_STATUS = 0;
      const FILL_INFO_STATUS = 1;
      const FINANCE_STATUS = 2;
      const QUALITY_STATUS = 3;
      const ACTIVE_VISIT_STATUS = 4;
      const ACTIVE_TEAM_STATUS = 5;
      const APPROVE_STATUS = 6;
      const UPDATE_REQUIREMENT_STATUS = 7;
      const REPRESENTATIVE_REFUSE_STATUS = 8;
      const REPRESENTATIVE_APPROVE_VISIT_STATUS = 9;
      const REPRESENTATIVE_APPROVE_TEAM_STATUS = 10;
      const NOT_ACTIVE_TEAM_STATUS = 11;
      const FINAL_APPROVE_STATUS = 12;
      const PRESIDENT_APPROVE_STATUS = 13;
      const PRESIDENT_REFUSE_STATUS = 14;
      const FINANCE_APPROVE_STATUS = 15;
      const FINANCE_REFUSE_STATUS = 16;
      const NOT_EXCUSED__STATUS = 0;
      const EXCUSED_STATUS = 1;

      const PRE_APPROVE_STATUS = 1;
      const PRE_REFUSE_STATUS = 0;

      const LEADER = 1;
      const MEMBER = 2;
      const OBSERVE = 5;
      const COMMITTEE = 6;
      const REVIEWERS = 7;

      switch (key) {
        case 'REFUSE_STATUS':
          return Number(REFUSE_STATUS);
        case 'PRESIDENT_APPROVE_STATUS':
          return Number(PRESIDENT_APPROVE_STATUS);
        case 'PRESIDENT_REFUSE_STATUS':
          return Number(PRESIDENT_REFUSE_STATUS);
        case 'FILL_INFO_STATUS':
          return FILL_INFO_STATUS;
        case 'FINANCE_STATUS':
          return FINANCE_STATUS;
        case 'QUALITY_STATUS':
          return QUALITY_STATUS;
        case 'ACTIVE_VISIT_STATUS':
          return ACTIVE_VISIT_STATUS;
        case 'ACTIVE_TEAM_STATUS':
          return ACTIVE_TEAM_STATUS;
        case 'APPROVE_STATUS':
          return APPROVE_STATUS;
        case 'UPDATE_REQUIREMENT_STATUS':
          return UPDATE_REQUIREMENT_STATUS;
        case 'REPRESENTATIVE_REFUSE_STATUS':
          return REPRESENTATIVE_REFUSE_STATUS;
        case 'REPRESENTATIVE_APPROVE_VISIT_STATUS':
          return REPRESENTATIVE_APPROVE_VISIT_STATUS;
        case 'REPRESENTATIVE_APPROVE_TEAM_STATUS':
          return REPRESENTATIVE_APPROVE_TEAM_STATUS;
        case 'FINANCE_APPROVE_STATUS':
          return Number(FINANCE_APPROVE_STATUS);
        case 'FINANCE_REFUSE_STATUS':
          return Number(FINANCE_REFUSE_STATUS);
        case 'NOT_ACTIVE_TEAM_STATUS':
          return NOT_ACTIVE_TEAM_STATUS;
        case 'FINAL_APPROVE_STATUS':
          return FINAL_APPROVE_STATUS;
        case 'NOT_EXCUSED__STATUS':
          return NOT_EXCUSED__STATUS;
        case 'EXCUSED_STATUS':
          return EXCUSED_STATUS;
        case 'PRE_APPROVE_STATUS':
          return PRE_APPROVE_STATUS;
        case 'PRE_REFUSE_STATUS':
          return PRE_REFUSE_STATUS;
        case 'LEADER':
          return LEADER;
        case 'MEMBER':
          return MEMBER;
        case 'OBSERVE':
          return OBSERVE;
        case 'COMMITTEE':
          return COMMITTEE;
        case 'REVIEWERS':
          return REVIEWERS;
        default:
          return null;
      }
    },
    getTypeOfUser(type) {
      switch (type) {
        case 1:
          return `${this.$t('Global.member')}`;
        case 2:
          return `${this.$t('Global.Creator')}`;
        case 3:
          return `${this.$t('Global.committee_type')}`;
        case 4:
          return `${this.$t('Global.ACCREDITATION_TYPE')}`;
        case 5:
          return `${this.$t('Global.VICE_TYPE')}`;
        case 6:
          return `${this.$t('Global.PRESIDENT_TYPE')}`;
        case 7:
          return `${this.$t('Global.MANAGEMENT_TYPE')}`;
        case 8:
          return `${this.$t('Global.team')}`;
        default:
          return null;
      }
    },
    getTypeOfReq(key) {
      switch (key) {
        case 'TRAINEE_COORDINATOR':
          return 1;
        case 'PRE_UNIVERSITY_COORDINATOR':
          return 2;
        case 'HIGHER_EDUCATION_COORDINATOR':
          return 3;
        case 'HIGH_REVIEWER':
          return 4;
        case 'PRE_REVIEWER':
          return 5;
        default:
          return null;
      }
    },

    evConstants(key) {
      const REJECT_STATUS = 0;
      const TEAM_TYPE = 1;
      const ORGANIZATION_TYPE = 2;
      const COMMITTEE_TYPE = 3;
      const ACCREDITATION_TYPE = 4;
      const VICE_TYPE = 5;
      const PRESIDENT_TYPE = 6;
      const MANAGER_TYPE = 7;
      const REVIEWER_TYPE = 10;

      switch (key) {
        case 'APPROVE_STATUS':
          return APPROVE_STATUS;
        case 'REJECT_STATUS':
          return REJECT_STATUS;
        case 'TEAM_TYPE':
          return TEAM_TYPE;
        case 'ORGANIZATION_TYPE':
          return ORGANIZATION_TYPE;
        case 'COMMITTEE_TYPE':
          return COMMITTEE_TYPE;
        case 'ACCREDITATION_TYPE':
          return ACCREDITATION_TYPE;
        case 'VICE_TYPE':
          return VICE_TYPE;
        case 'PRESIDENT_TYPE':
          return PRESIDENT_TYPE;
        case 'MANAGER_TYPE':
          return MANAGER_TYPE;
        case 'REVIEWER_TYPE':
          return REVIEWER_TYPE;
        default:
          return null;
      }
      const APPROVE_STATUS = 1;
    },

    isImage(ex) {
      if (ex) {
        const extension = ex.toLowerCase();
        if (extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'tif' || extension == 'jpeg' || extension == 'bmp') {
          return true;
        }
      }
    },
    validation(message, type = 0) {
      let Valid = [];
      if (!message) {
        message = `${this.$t('Validation.selectFiled')}`;
      }
      if (type == 0) Valid = [{ required: true, message: message, trigger: 'blur' }];
      if (type == 1) Valid = [{ required: true, message: message, trigger: 'change' }];
      if (type == 'textarea')
        Valid = [
          {
            required: true,
            pattern: /\S$|\S[\s\S]*\S+/,
            message: message,
            trigger: 'blur',
          },
        ];
      if (type == 'checkbox') Valid = [{ required: true, message: message, trigger: 'change' }];
      if (type == 'n_id') Valid = [{ required: true, pattern: /[0-9]{14,14}/, message: message, trigger: 'blur' }];
      if (type == 'email')
        Valid = [
          {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: message,
            trigger: 'blur',
          },
        ];
      return Valid;
    },
    getLevelText(level) {
      return `approvals_status_${level}_ensure`;
    },
    getRefuseText(level) {
      return `refuse_status_${level}`;
    },
    getLastReportStatus(evNote, allNotes, noteId) {
      if (allNotes.length > 1) {
        let note = allNotes.find(note => note.level == evNote.level);
        if (note.id == noteId) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    oneLineToLines(N, string) {
      if (string) {
        var app = string.split(' '),
          arrayApp = [],
          stringApp = '';
        app.forEach(function (sentence, index) {
          stringApp += sentence + ' ';

          if ((index + 1) % N === 0) {
            arrayApp.push(stringApp);
            stringApp = '';
          } else if (app.length === index + 1 && stringApp !== '') {
            arrayApp.push(stringApp);
            stringApp = '';
          }
        });
        return arrayApp;
      }
    },
    getLastStatus(current, lastStatus) {
      if (lastStatus && current.status in [1, 2, 3, 4, 5, 12]) {
        return true;
      } else {
        return false;
      }
    },
    getLevelOut(level) {
      return `approvals_status_${this.getType() == 1 ? 1 : level}`;
    },
    getpreAnswer(index) {
      switch (index) {
        case 1:
          return { name: `${this.$t('Global.level_1')}`, type: 'success', color: '#2eb85c' };
        case 2:
          return { name: `${this.$t('Global.level_2')}`, type: 'info', color: '#39f' };
        case 3:
          return { name: `${this.$t('Global.level_3')}`, type: 'warning', color: '#f9b115' };
        case 4:
          return { name: `${this.$t('Global.level_4')}`, type: 'danger', color: '#e55353' };
        default:
          return { name: `${this.$t('Global.noAnswer')}`, type: 'danger', color: '#e2e2e2' };
          break;
      }
    },
    getpreAnswerAsk(index) {
      switch (index) {
        case 1:
          return { name: `${this.$t('Global.level_1')}`, type: 'info', color: '#2eb85c' };
        case 2:
          return { name: `${this.$t('Global.level_2')}`, type: 'danger', color: '#39f' };
        case 3:
          return { name: `${this.$t('Global.level_3')}`, type: 'warning', color: '#f9b115' };
        case 4:
          return { name: `${this.$t('Global.level_4')}`, type: 'danger', color: '#e55353' };
        default:
          return { name: `${this.$t('Global.noAnswer')}`, type: 'danger', color: '#e2e2e2' };
          break;
      }
    },
    getPreAnswer(index) {
      switch (index) {
        case 1:
          return { name: `${this.$t('Global.ok')}`, type: 'success', color: '#2eb85c' };
        case 0:
          return { name: `${this.$t('Global.notOk')}`, type: 'danger', color: '#e55353' };
        default:
          return { name: `${this.$t('Global.noAnswer')}`, type: 'danger', color: '#e2e2e2' };
          break;
      }
    },
    getAnswer(index) {
      switch (index) {
        case 1:
          return { name: `${this.$t('Global.ok')}`, type: 'success', color: '#2eb85c' };
        case 0:
          return { name: `${this.$t('Global.notOk')}`, type: 'danger', color: '#e55353' };
        case 30:
          return { name: `${this.$t('Global.agree')}`, type: 'success', color: '#2eb85c' };
        case 31:
          return { name: `${this.$t('Global.midagree')}`, type: 'info', color: '#39f' };
        case 32:
          return { name: `${this.$t('Global.disagree')}`, type: 'warning', color: '#f9b115' };
        case 33:
          return { name: `${this.$t('Global.disApply')}`, type: 'danger', color: '#e55353' };
        default:
          return { name: `${this.$t('Global.noAnswer')}`, type: 'danger', color: '#e2e2e2' };
          break;
      }
    },
    getLogo(type) {
      switch (type) {
        case 1:
          return '/img/avatars/uni.png';
        case 2:
          return '/img/avatars/uni.png';
        case 3:
          return '/img/avatars/prog.png';
        default:
          return '/img/avatars/prog.png';
          break;
      }
    },
    reportStatus() {
      return [
        { index: 0, label: 30, name: `${this.$t('Global.agree')}`, type: 'success' },
        { index: 1, label: 31, name: `${this.$t('Global.midagree')}`, type: 'info' },
        { index: 2, label: 32, name: `${this.$t('Global.disagree')}`, type: 'warning' },
        { index: 3, label: 33, name: `${this.$t('Global.disApply')}`, type: 'exception' },
      ];
    },
  },
});
