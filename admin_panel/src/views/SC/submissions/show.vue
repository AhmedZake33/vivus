<template>
  <div v-if="hasPermission('show_submissions')">
    <Info></Info>
    <div v-if="evaluatorCheck(['ORGANIZATION_TYPE']) && !hasDecision"></div>
    <Show :loading="$store.getters['submission/submissionLoad']" v-else-if="$store.getters['submission/decision']" icon="el-icon-user" :items="$store.getters['submission/decision']" :name="$t('Global.Decision')">
      <template #show_action>
        <div class="d-inline" id="action3" v-if="(hasPermission('vice_approval') || hasPermission('president_approval')) && !hasDecision && showAction && allowUpdate == updateConstants('string', 'TAKE_DECISION')">
          <el-button icon="el-icon-check" @click="handleAccept" round size="mini" class="mx-1 right_icon" type="success"> {{ $t('Global.accept') }} </el-button>
          <el-button icon="el-icon-close" @click="dialogOpen" round size="mini" class="mx-1 right_icon" type="danger">{{ $t('Global.refuse') }} </el-button>
        </div>
        <a v-if="desiciontype == 18 && (hasPermission('decision_approval') || hasPermission('admin_submissions'))" class="mr-2" :href="`${baseUrl}evaluation/certificate/${$route.params.id}/ar`" target="_blank">
          <fa-icon :icon="['fas', 'file-pdf']" size="md" />
          {{ $t('Global.ar_certificate') }}
        </a>
        <a v-if="desiciontype == 18 && (hasPermission('decision_approval') || hasPermission('admin_submissions'))" class="mx-3" :href="`${baseUrl}evaluation/certificate/${$route.params.id}/en`" target="_blank">
          <fa-icon :icon="['fas', 'file-pdf']" size="md" />
          {{ $t('Global.en_certificate') }}
        </a>
        <fa-icon class="pointer" v-if="(hasPermission('decision_approval') && showAction) || hasPermission('decision_update')" @click="passMethods('openPreDesicionDialog', 'edit')" :icon="['fas', 'edit']" />
      </template>
    </Show>
    <!--        <Show :loading="$store.getters['submission/submissionLoad']" v-if="$store.state.submission.children && $store.state.submission.children.length" icon="el-icon-data-analysis" :items="$store.state.submission.children" :name="$t('Global.followVisit')"></Show>-->
    <!-- <Show :loading="$store.getters['submission/submissionLoad']" v-if="$store.getters['submission/decision']" icon="el-icon-user" :items="$store.getters['submission/decision']" :name="$t('Global.Decision')"></Show> -->
    <template v-if="$store.state.user.allowPu || hasPermission('admin_system')">
      <button-approval v-if="!$store.getters['submission/submissionLoad']" @refresh="init"></button-approval>
    </template>
    <CCard>
      <CCardBody>
        <el-tabs v-model="activeNameSelected" v-loading="$store.getters['notes/notesLoading']" type="card" class="right" dir="rtl" tab-position="top" stretch>
          <el-tab-pane name="1" lazy v-if="lastAlert && !evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE', 'COMMITTEE_TYPE'])">
            <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.subState') }}</span>
            <SubStateReply></SubStateReply>
          </el-tab-pane>
          <el-tab-pane name="2" lazy label=" الملفات المطلوبه">
            <span slot="label"><i class="el-icon-files ml-1 mr-1"></i>{{ $t('Global.FilesNeeded') }}</span>
            <NeededFile allow></NeededFile>
          </el-tab-pane>
          <el-tab-pane
            name="3"
            v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && (showType == this.showConstants('string', 'REPORT_APPROVAL') || showType == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE') || showType == this.showConstants('string', 'NO_CHANGE') || (!showType && hasDecision))"
            lazy
            label="حالة التقرير"
          >
            <span slot="label"><i class="el-icon-data-line ml-1 mr-1"></i>{{ $t('Global.Reqstate') }}</span>
            <Level></Level>
          </el-tab-pane>
          <template >
            <el-tab-pane name="4" v-if="showType == this.showConstants('string', 'REPORT_APPROVAL') || showType == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE') || showType == this.showConstants('string', 'NO_CHANGE') || hasPermission('all_submissions')" lazy label="التقارير">
              <span slot="label"><i class="el-icon-document ml-1 mr-1"></i>{{ $t('HEmanage.reports') }}</span>
              <report :last_level="$store.getters['submission/approvals'].length" :evaluation="Number(this.$route.params.id)"></report>
            </el-tab-pane>
          </template>
          <el-tab-pane name="5" lazy label="البيانات">
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
            <el-form-item :rules="validation(false, 'textarea')" class="custom_area" style="width: 100%" prop="comment">
              <el-input id="comment" class="textarea" type="textarea" :placeholder="$t('Global.rejectReason')" v-model="form.comment"></el-input>
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
import Info from './components/info';
import Report from './report/report';
import NeededFile from '../submissions/components/neededFile.vue';
import SubStateReply from '../submissions/components/SubStateReply.vue';
import { toLocalDatetime } from '../../../utils/helper';
import Statistics from '../submissions/components/statistics';
import ButtonApproval from '../../SC/submissions/components/ButtonApproval';
import Level from '../../SC/submissions/components/Level';

export default {
  name: 'submission',
  components: { Level, SubStateReply, Statistics, ButtonApproval, Report, Show, NeededFile, Info },
  data() {
    return {
      window_width: Number,
      baseUrl: process.env.VUE_APP_BASE_URL,
      form: {
        comment: null,
      },
      isLoad: false,
      dialogVisible: false,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
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
        if (this.$store.state.submission.last_alert && (this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE') || this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL'))) {
          return '4';
        } else if (this.evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE', 'COMMITTEE_TYPE'])) {
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
    passMethods(type, edit) {
      if (edit == 'edit') {
        if (type == 'openPreDesicionDialog') EventBus.$emit('openPreDesicionDialog', 'edit');
      } else {
        if (type == 'openPreDesicionDialog') EventBus.$emit('openPreDesicionDialog', this.hasPermission('vice_approval') && this.hasPermission('president_approval') ? 'edit' : '');
      }
    },
    dialogOpen() {
      this.dialogVisible = true;
    },
    sendReject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {
            note: String(this.form.comment),
            status: this.constants('PRE_REFUSE_STATUS'),
          };
          this.isLoad = true;
          let system;
          if (this.$store.state.submission.last_alert && (this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL') || this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'))) {
            system = 2;
          } else {
            system = 1;
          }
          this.$store
            .dispatch('notes/preChangeSubState', {
              id: system == 1 ? this.$route.params.submission_id : this.$route.params.id,
              system: system,
              query: query,
            })
            .then(() => {
              this.$notify.success({ message: `${this.$t('Global.sendRejectMessage')}` });
              this.dialogVisible = false;
              this.init();
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
    handleAccept() {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      })
        .then(_ => {
          let query = { status: this.constants('PRE_APPROVE_STATUS') };
          this.isLoad = true;
          let system;
          if (this.$store.state.submission.last_alert && (this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL') || this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'))) {
            system = 2;
          } else {
            system = 1;
          }
          this.$store
            .dispatch('notes/preChangeSubState', {
              id: system == 1 ? this.$route.params.submission_id : this.$route.params.id,
              system: system,
              query: query,
            })
            .then(() => {
              this.$notify({
                type: 'success',
                message: `${this.$t('Global.successMessage')}`,
              });
              this.init();
            });
        })
        .catch(_ => {
          this.isLoad = false;
        });
    },
    init() {
      this.$store.dispatch('submission/preSubmission', this.$route.params.id).then(() => {
        this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
      });
    },
    Refresh(query) {
      this.$store.dispatch('submission/questions', {
        id: this.$route.params.id,
        query: query,
      });
    },
    show(id, questionnaire) {
      this.$router.push(`/school/submissions/submission/question/${id}/${questionnaire}`);
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    getSize() {
      this.window_width = window.innerWidth;
    },
  },
  created() {
    window.addEventListener('resize', this.getSize);
  },
  destroyed() {
    window.removeEventListener('resize', this.getSize);
    this.$store.commit('SET_PATH_TITLE', null);
  },
};
</script>

<style lang="scss">
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
