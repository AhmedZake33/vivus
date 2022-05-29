<template>
  <div v-if="hasPermission('show_submissions')">
    <Info></Info>
    <div v-if="evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.decision && $store.state.submission.decision.removed == 1"></div>
    <Show :loading="$store.getters['submission/submissionLoad']" v-else-if="!$store.getters['submission/submissionLoad'] && $store.state.submission.decision" icon="el-icon-user" :items="$store.getters['submission/decision']" :name="$t('Global.Decision')">
      <template v-if="$store.getters['submission/decision']" #show_action>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <div class="d-inline" id="action3" v-if="(hasPermission('vice_approval') || hasPermission('president_approval')) && !$store.state.evaluation.approved && showAction && !hasPermission('finance_approval') && $store.state.submission.decision && $store.state.submission.decision.removed == 1">
            <el-button icon="el-icon-check" @click="handleAccept" round size="mini" class="mx-1 right_icon" type="success"> {{ $t('Global.accept') }} </el-button>
            <el-button icon="el-icon-close" @click="dialogOpen(false)" round size="mini" class="mx-1 right_icon" type="danger">{{ $t('Global.refuse') }} </el-button>
          </div>
          <!-- <span v-if="!$store.state.evaluationNotes.canApprove" class="text-danger mx-2">{{$store.state.submission.decision.removed == 1 ? $t('Global.notAprroved'):''}}</span> -->
          <a v-if="desiciontype == 1 && (hasPermission('decision_approval') || hasPermission('admin_submissions'))" class="mr-2" :href="`${baseUrl}evaluation/certificate/${$route.params.id}/ar`" target="_blank">
            <fa-icon :icon="['fas', 'file-pdf']" size="md" />
            {{ $t('Global.ar_certificate') }}
          </a>
          <a v-if="desiciontype == 1 && (hasPermission('decision_approval') || hasPermission('admin_submissions'))" class="mx-3" :href="`${baseUrl}evaluation/certificate/${$route.params.id}/en`" target="_blank">
            <fa-icon :icon="['fas', 'file-pdf']" size="md" />
            {{ $t('Global.en_certificate') }}
          </a>
          <fa-icon class="pointer" v-if="hasPermission('decision_approval') && $store.state.evaluationNotes.canApprove" @click="passMethods('openDesicionDialog')" :icon="['fas', 'edit']" />
          <fa-icon class="pointer" v-if="(hasPermission('decision_approval') || hasPermission('decision_update')) && !$store.state.evaluationNotes.canApprove" @click="passMethods('openDesicionDialog', 'edit')" :icon="['fas', 'edit']" />
        </template>
      </template>
    </Show>
    <Show :loading="$store.getters['submission/submissionLoad']" v-if="$store.getters['submission/program']" icon="el-icon-data-analysis" :items="$store.getters['submission/program']" :name="$store.getters['submission/programName']"></Show>
    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
      <button-approval v-if="!$store.getters['submission/submissionLoad']" @refresh="init"></button-approval>
    </template>
    <CCard v-loading="$store.getters['evaluation/evaluationsLoad']">
      <CCardBody>
        <el-tabs v-model="activeNameSelected" type="card" class="right" dir="rtl" tab-position="top" stretch>
          <el-tab-pane name="1" v-if="!$store.getters['submission/program'] && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])">
            <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.subState') }}</span>
            <SubStateReply></SubStateReply>
          </el-tab-pane>

          <el-tab-pane name="2" lazy label=" الملفات المطلوبه" v-if="!$store.getters['submission/program']">
            <span slot="label"><i class="el-icon-files ml-1 mr-1"></i>{{ $t('Global.FilesNeeded') }}</span>
            <SubmissionFileList @refresh="init"></SubmissionFileList>
          </el-tab-pane>
          <el-tab-pane name="3" lazy :label="$t('Global.teamVisitReq')" v-if="!$store.getters['submission/program'] && afterUpload && !evaluatorCheck(['ORGANIZATION_TYPE'])">
            <span slot="label"><i class="el-icon-files ml-1 mr-1"></i>{{ $t('Global.teamVisitReq') }}</span>
            <TeamVisitDocs @refresh="init"></TeamVisitDocs>
          </el-tab-pane>
          <el-tab-pane name="4" v-if="$store.getters['submission/program']" lazy label=" الملفات المطلوبه">
            <span slot="label"><i class="el-icon-files ml-1 mr-1"></i>{{ $t('Global.FilesNeeded') }}</span>
            <ProgramFileList @refresh="init"></ProgramFileList>
          </el-tab-pane>
          <el-tab-pane
            v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && (showType == this.showConstants('string', 'REPORT_APPROVAL') || showType == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE') || showType == this.showConstants('string', 'NO_CHANGE') || (!showType && hasDecision))"
            name="5"
            lazy
            label="حالة التقرير"
          >
            <span slot="label"><i class="el-icon-data-line ml-1 mr-1"></i>{{ $t('Global.Reqstate') }}</span>
            <Level></Level>
          </el-tab-pane>
          <el-tab-pane name="6" v-if="showType == this.showConstants('string', 'REPORT_APPROVAL') || showType == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE') || showType == this.showConstants('string', 'NO_CHANGE') || hasPermission('admin_submissions') || (!showType && hasDecision)" label="التقارير">
            <span slot="label"><i class="el-icon-document ml-1 mr-1"></i>{{ $t('HEmanage.reports') }}</span>
            <Report :evaluation="Number(this.$route.params.id)"></Report>
          </el-tab-pane>
          <el-tab-pane name="7" label="البيانات">
            <span slot="label"><i class="el-icon-document ml-1 mr-1"></i>{{ $t('Global.statisticsData') }}</span>
            <Statistics :evaluation="Number(this.$route.params.id)"></Statistics>
          </el-tab-pane>
        </el-tabs>
      </CCardBody>
    </CCard>
    <el-dialog :title="$t('Global.writeNote')" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-form label-position="top" :model="form" status-icon size="large" ref="form" label-width="120px" class="stateForm demo-ruleForm">
          <CRow>
            <el-form-item :rules="validation(false, 'textarea')" class="custom_area" style="width: 100%" prop="rejectReason">
              <el-input id="rejectReason" class="textarea" type="textarea" :placeholder="$t('Global.rejectReason')" v-model="form.rejectReason"></el-input>
            </el-form-item>
          </CRow>
        </el-form>
        <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
          <el-button icon="el-icon-close" @click="sendReject('form')" round size="mini" class="mx-1 right_icon" type="danger">{{ $t('Global.accept') }}</el-button>
          <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">{{ $t('Global.discard') }}</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { EventBus } from '../../../main';
import Show from '../../components/Show';
import SubStateReply from '../../components/sub-state-reply';
import Report from './report/report';
import Statistics from '../submissions/components/statistics';
import ProgramFileList from './components/ProgramFileList';
import TeamVisitDocs from './components/TeamVisitDocs';
import SubmissionFileList from './components/SubmissionFileList';
import Level from './components/Level';
import Info from './components/info';
import FormTree from '@/views/components/FormTree';
import ButtonApproval from '../../HE/submissions/components/ButtonApproval';

export default {
  name: 'submission',
  components: { Statistics, ButtonApproval, FormTree, Report, Show, SubStateReply, TeamVisitDocs, ProgramFileList, SubmissionFileList, Level, Info },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      isLoad: false,
      dialogVisible: false,
      form: {
        rejectReason: null,
        comment: null,
      },
    };
  },
  computed: {
    afterUpload() {
      if (this.currentStatus > 3 && this.lastAlert.type == 1) {
        return true;
      } else if (this.lastAlert.type == 2) {
        return true;
      } else {
        return false;
      }
    },
    currentStatus: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.actual_level;
      }
      return false;
    },
    lastStatus: function () {
      if (this.$store.getters['notes/lastNote']) return this.$store.getters['notes/lastNote'].current_status;
    },

    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
    desiciontype: function () {
      return this.$store.state.submission.decision ? this.$store.state.submission.decision.type : null;
    },
    activeNameSelected: {
      get: function () {
        if (this.$store.getters['submission/program'] && (this.lastAlert ? this.lastAlert.actual_level == 6 && this.lastAlert.type == 2 : '')) {
          return '6';
        } else if (this.$store.getters['submission/program']) {
          return '4';
        } else if (!this.$store.getters['submission/program'] && (this.lastAlert ? this.lastAlert.actual_level == 6 : '')) {
          return '6';
        } else if (!this.$store.getters['submission/program'] && this.evaluatorCheck(['TEAM_TYPE', 'ORGANIZATION_TYPE', 'COMMITTEE_TYPE'])) {
          return '2';
        } else {
          return '1';
        }
      },
      // setter
      set: function (newValue) {},
    },
    lastAlert: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert;
      }
      return false;
    },
    showType: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.show_type;
      }
      return false;
    },
    allowUpdate: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.allow_update;
      }
      return false;
    },
    hasDecision: function () {
      if (this.$store.state.submission.decision && this.$store.state.submission.decision.removed == 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    dialogOpen(state, type = 0) {
      this.dialogVisible = true;
    },
    sendReject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = { note: String(this.form.rejectReason), status: 0 };
          this.isLoad = true;
          this.$store
            .dispatch('evaluationNotes/changeSubState', {
              id: this.$route.params.id,
              query: query,
            })
            .then(() => {
              if (this.ifRejected) {
                this.$notify.error({ message: `${this.$t('Global.sendRejectMessage')}` });
              } else {
                this.$notify.success({ message: `${this.$t('Global.sendRejectMessage')}` });
              }
              this.dialogVisible = false;
              this.isLoad = false;
              this.refresh();
              this.init();
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
    handleAccept(type = 1) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      })
        .then(_ => {
          let query = { note: null, status: 1 };
          if (type === 2) {
            query = { note: null, status: 1 };
          }
          if (type === 3) {
            query = { note: null, status: 1 };
          }
          this.isLoad = true;
          this.$store
            .dispatch('evaluationNotes/changeSubState', {
              id: this.$route.params.id,
              query: query,
            })
            .then(() => {
              this.$notify({
                type: 'success',
                message: `${this.$t('Global.successMessage')}`,
              });
              this.isLoad = false;
              this.refresh();
              this.init();
              // if (type === 3) {
              //   this.$store.dispatch('submission/getDocument', this.$route.params.id);
              // }
            });
        })
        .catch(_ => {
          this.isLoad = false;
        });
    },
    passMethods(type, edit) {
      if (edit == 'edit') {
        if (type == 'openDesicionDialog') EventBus.$emit('openDesicionDialog', 'edit');
      } else {
        if (type == 'openDesicionDialog') EventBus.$emit('openDesicionDialog', this.hasPermission('vice_approval') && this.hasPermission('president_approval') ? 'edit' : '');
      }
    },
    refresh(query) {
      this.$store.dispatch('evaluation/standards', {
        evaluation_id: this.$route.params.id,
        query: query,
      });
    },
    init() {
      this.$store.dispatch('submission/submission', this.$route.params.id).then(() => {
        this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
      });
    },
  },
  destroyed() {
    this.$store.commit('SET_PATH_TITLE', null);
    this.$store.commit('submission/SET_DECISION', Object);
    this.$store.commit('evaluation/SET_EVALUATOR', 0);
  },
};
</script>

<style lang="scss">
.docs_body {
  .el-card__body {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
    padding-right: 0.1rem;
    .docs {
      &:hover {
        box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
      }

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: end;
      align-content: space-between;
      cursor: pointer;
      box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
      border-radius: 30px;
      padding: 0.5rem;

      .upload-btn-wrapper {
        input {
          cursor: pointer;
        }

        cursor: pointer;
      }
    }
  }
}

.teams_state {
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  .el-button--mini.is-circle {
    padding: 3px;
  }
}

.right.el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
  border-right: none;
  border-left: 1px solid #e4e7ed;
}

.left .el-tabs__nav {
  float: left;
}

.el-tab-pane .card {
  box-shadow: none !important;

  &:hover {
    box-shadow: none !important;
  }

  .card-body {
    border-right: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
  }

  .card-header {
    border-right: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    // border-top: 1px solid #e4e7ed;
  }

  .card-header:first-child {
    border-radius: 0;
  }
}

.el-tabs__header {
  margin: 0;
}

.textarea {
  textarea {
    min-height: 151px !important;
  }

  padding: 0 1rem;
}

.el-step.is-center .el-step__description {
  padding: 0 !important;
  width: 100% !important;
}

.el-tree-node__content:first-child {
  margin-top: 0.5rem;
}

.el-step__description {
  padding: 0 !important;
}

main[dir='rtl'] {
  .el-alert__closebtn {
    right: unset;
    left: 15px;
  }
}

.el-alert__content {
  text-align: initial;
}

.green {
  color: #199319 !important;
}

.red {
  color: #ad1a1a !important;
}

.members {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.president {
  margin-left: 0.5rem;
  text-align: right;
}

.president svg {
  margin: 0 !important;
}

.timeBlock {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.el-tabs__item {
  border-right: none;
  border-left: none !important;

  &.is-active {
    color: #409eff;
    border-bottom: 2px solid #409eff !important;
    border-top: none;
  }
}

.el-card__header {
  span {
    font-weight: bold;
  }

  padding: 10px 20px !important;
}

.el-step {
  .el-step__main {
    direction: ltr !important;
  }
}

.el-step__line {
  left: -50% !important;
  right: 50% !important;
}

.text_badge .el-badge__content {
  padding: 0px 15px;
  border-radius: 30px;
  line-height: 14px;
}

.text_badge .el-badge {
  margin-top: 5px;
}

@media only screen and (min-width: 1230px) {
  .el-step {
    &:not(:first-child)::before {
      content: '';
      top: 11px;
      right: -6px;
      position: absolute;
      width: 2px;
      /* height: 2px; */
      bottom: -2px;
      background-color: #ddd;
    }
  }
  .el-step__title {
    text-align: center !important;
  }
}

.comments {
  span span {
    margin: 0 0.2rem;
  }

  p {
    margin: 0.5rem 1rem;
    font-weight: bolder;
  }

  margin: 0.3rem;
  border-bottom: 1px solid #ddd;
}

@media only screen and (max-width: 1230px) {
  .el-step__title {
    text-align: right !important;
    margin-right: 0.3rem !important;
  }
}
</style>
