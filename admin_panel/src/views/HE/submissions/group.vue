<template>
  <div>
    <Info @init="init" type="Group"></Info>
    <CCard>
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold"><i class="el-icon-data-board"></i> {{ $t('Global.Programs') }}</div>
        <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''" style="display: flex; justify-content: flex-end; align-items: center">
          <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
            <CDropdown v-if="hasPermission('admin_submissions') && $store.getters['submission/programs'] && $store.getters['submission/programs'][0] && $store.getters['submission/programs'][0].program" color="success" placement="bottom-end" size="sm" class="customDrop">
              <template #toggler-content>
                <CIcon name="cil-settings" />
                <span style="font-weight: bold">{{ $t('Global.action') }}</span>
              </template>
              <div class="item" v-if="hasPermission('admin_submissions')" @click="openProgramDialog(null)">
                <i class="el-icon-message"></i>
                {{ $t('Global.add_program') }}
              </div>
              <div v-else></div>
            </CDropdown>
          </template>
        </div>
      </CCardHeader>
      <CCardBody>
        <el-table
          v-if="$store.getters['submission/programs'] && $store.getters['submission/programs'][0] && $store.getters['submission/programs'][0].program"
          :data="$store.getters['submission/programs']"
          style="width: 100%"
          :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
          :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
        >
          <el-table-column prop="evaluation_id" label="#" width="65" sortable></el-table-column>
          <el-table-column prop="program" :label="$t('Global.program_name')" width="400"></el-table-column>
          <el-table-column prop="start" :label="$t('Global.start_at')">
            <template slot-scope="scope">
              {{ scope.row.start ? toLocalDatetime(scope.row.start, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : 'لا يوجد' }}
            </template>
          </el-table-column>
          <el-table-column prop="expiration" :label="$t('Global.ends_at')">
            <template slot-scope="scope">
              {{ scope.row.expiration ? toLocalDatetime(scope.row.expiration, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : 'لا يوجد' }}
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" width="100" :label="$t('Global.updated')">
            <template slot-scope="scope">
              <div>
                <small class="d-block">{{ toLocalDatetime(scope.row.updated_at, 'ar', false) }}</small>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="decision" width="160" :label="$t('Global.decisionAndLevel')">
            <template slot-scope="scope">
              <el-tooltip v-if="!scope.row.decision" effect="dark" :content="scope.row.stage ? scope.row.stage : $t('Global.notInitReportFinish')" placement="top-start">
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <CBadge color="info">{{ scope.row.stage ? scope.row.stage : $t('Global.notInitReportFinish') }} </CBadge>
                </div>
              </el-tooltip>
              <el-tooltip effect="dark" :content="`${scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}`}${scope.row.number ? `(${scope.row.number})` : ''}`" placement="top-start">
                <div v-if="scope.row.decision" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <CBadge :color="scope.row.decision === null ? 'danger' : scope.row.decision === 'اعتماد' ? 'success' : 'warning'">
                    {{ scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}` }}
                    {{ scope.row.number ? `(${scope.row.number})` : '' }}
                  </CBadge>
                </div>
              </el-tooltip>
              <CBadge class="m-1" color="info" v-if="scope.row.init_decision && !scope.row.decision"> {{ $t('Global.tempDecision') }} - {{ scope.row.init_decision }} </CBadge>
            </template>
          </el-table-column>
          <el-table-column prop="" label=" ">
            <template slot-scope="scope">
              <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                <router-link :to="show(scope.row.evaluation_id)" class="table-action-item">
                  <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
                </router-link>
                <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                  <i class="el-icon-edit table-action-item" @click="openProgramDialog(scope.row)" v-if="hasPermission('admin_submissions')"></i>
                  <i class="el-icon-delete table-action-item" @click="deleteProgram(scope.row.evaluation_id)" v-if="hasPermission('admin_submissions')"></i>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="d-lg-flex">{{ $t('Global.noProgram') }}</div>
      </CCardBody>
    </CCard>
    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
      <button-approval @refresh="init" type="Group" v-if="!$store.getters['submission/program']"></button-approval>
    </template>
    <CCard>
      <CCardBody>
        <el-tabs type="card" v-model="activeName" class="right" dir="rtl" tab-position="top" stretch>
          <el-tab-pane name="1" v-if="!evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])">
            <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.subState') }}</span>
            <SubStateReply></SubStateReply>
          </el-tab-pane>
          <el-tab-pane name="2" label=" الملفات المطلوبه">
            <span slot="label"><i class="el-icon-files ml-1 mr-1"></i>{{ $t('Global.FilesNeeded') }}</span>
            <FileList @refresh="init"></FileList>
          </el-tab-pane>
          <el-tab-pane name="3" lazy v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && afterUpload" :label="$t('Global.teamVisitReq')">
            <span slot="label"><i class="el-icon-files ml-1 mr-1"></i>{{ $t('Global.teamVisitReq') }}</span>
            <TeamVisitDocs @refresh="init"></TeamVisitDocs>
          </el-tab-pane>
        </el-tabs>
      </CCardBody>
    </CCard>
    <el-dialog :title="$t('Global.addInfo')" :visible.sync="program_dialog" width="50%">
      <el-form @submit.native.prevent label-position="top" ref="programForm" :model="evaluationForm" status-icon size="large" label-width="120px" class="demo-ruleForm">
        <el-form-item prop="cycle_time_id" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.selectPrograms')">
          <el-select :no-data-text="$t('Global.nodata')" v-model="evaluationForm.program_id" :placeholder="$t('Global.selectPrograms')" style="width: 100%">
            <el-option v-for="item in $store.getters['submission/organization_programs']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveProgram" @keyup.enter="saveProgram" type="primary">{{ $t('Global.save') }}</el-button>
        <el-button @click="program_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SubStateReply from '../../components/sub-state-reply';
import Show from '../../components/Show';
import FileList from './components/FileList';
import TeamVisitDocs from './components/TeamVisitDocs';
import Info from './components/info';
import FormTree from '@/views/components/FormTree';
import ButtonApproval from '../../HE/submissions/components/ButtonApproval';

export default {
  name: 'group',
  components: { ButtonApproval, FormTree, Show, SubStateReply, TeamVisitDocs, FileList, Info },
  data() {
    return {
      program_dialog: false,
      evaluation_id: null,
      evaluationForm: { program_id: null },
    };
  },
  computed: {
    afterUpload() {
      if (this.lastAlert.actual_level > 3 && this.lastAlert.type == 1) {
        return true;
      } else if (this.lastAlert.type == 2) {
        return true;
      } else {
        return false;
      }
    },
    activeName: {
      get: function () {
        if (!this.evaluatorCheck(['COMMITTEE_TYPE','TEAM_TYPE','ORGANIZATION_TYPE'])) {
          return '1';
        } else {
          return '2';
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
    lastStatus: function () {
      if (this.$store.getters['notes/currentStatus']) return this.$store.getters['notes/currentStatus'].current_status;
    },
  },
  methods: {
    init() {
      this.$store.dispatch('submission/groupSubmission', this.$route.params.submission_id).then(() => {
        this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
      });
    },
    show(id) {
      return `/higher/submissions/submission/${this.$route.params.submission_id}/${id}`;
    },
    openProgramDialog(evaluation) {
      this.program_dialog = true;
      if (evaluation) {
        this.evaluation_id = evaluation.evaluation_id;
        this.evaluationForm.program_id = evaluation.program_id;
      }
    },
    saveProgram() {
      this.$store.dispatch('evaluation/saveProgram', { id: this.evaluation_id ? `/${this.evaluation_id}` : '', query: { ...this.evaluationForm, submission_id: this.$route.params.submission_id } }).then(() => {
        this.program_dialog = false;
        this.init();
      });
    },
    deleteProgram(id) {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('evaluation/deleteProgram', id).then(() => {
          this.init();
          this.$message({ message: this.$t('Global.successMessage'), type: 'success' });
        });
      });
    },
  },
  destroyed() {
    this.$store.commit('SET_PATH_TITLE', null);
  },
};
</script>

<style scoped></style>
