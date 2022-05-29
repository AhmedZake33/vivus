<template>
  <div v-if="(!$store.getters['evaluation/approved'] && evaluatorCheck(['ORGANIZATION_TYPE']) && (showAction || (!showAction && $store.getters['submission/decision'] && $store.state.submission.decision.removed == 0))) || !evaluatorCheck(['ORGANIZATION_TYPE'])">
    <CRow v-if="evaluatorCheck(['ORGANIZATION_TYPE']) || evaluatorCheck(['TEAM_TYPE']) || $store.getters['evaluation/evaluator'] == evConstants('COMMITTEE_TYPE')" class="no-gutters pl-2 pr-2 report_progress" style="border: 1px solid #eee"></CRow>
    <CRow v-else class="no-gutters pl-2 pr-2 report_progress" style="border: 1px solid #eee">
      <div v-if="currentLevel < 4 && evaluatorCheck(['ORGANIZATION_TYPE'])"></div>
      <b-progress v-else class="w-100 my-2" style="height: 2rem" show-value>
        <b-progress-bar v-for="state in status" :value="state.value ? ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : 0" :variant="getAnswer(state.label).type">
          <span
            >{{ $t(`Global.${state.name}`) }}: <strong>%{{ state.value ? ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : 0 }}</strong></span
          >
        </b-progress-bar>
      </b-progress>
    </CRow>
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
            <i class="el-icon-star-on"></i>
            {{ $t('evaluation.evaluations_document_items') }}
            <span v-if="$store.getters['evaluation/standards'].length && evaluatorCheck(['ORGANIZATION_TYPE']) && currentLevel < 4"></span>
            <CBadge v-else color="info badge-pill" style="font-size: 12px">
              {{ currentLevel ? $t(`Global.${getLevelOut(currentLevel)}`) : '' }}
            </CBadge>
          </div>
        </div>
        <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''">
          <div :class="isLoad ? 'disabledAll' : ''" class="d-inline-flex align-items-center justify-content-between">
            <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
              <div v-if="$store.getters['evaluation/standards'].length && evaluatorCheck(['ORGANIZATION_TYPE']) && currentLevel < 4"></div>
              <CDropdown  v-else color="success" placement="bottom-end" size="sm" class="customDrop">
                <template #toggler-content>
                  <CIcon name="cil-settings" />
                  <span style="font-weight: bold">{{ $t('Global.action') }}</span>
                </template>
                <a v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])" :href="`${baseUrl}submissions/evaluation/word/${$route.params.id}`">
                  <div class="item">
                    <fa-icon :icon="['fas', 'file-word']" size="lg" />
                    {{ $t('Global.export_HE_file') }}
                  </div>
                </a>
                <a v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])" :href="`${baseUrl}submissions/evaluation/out_word/${$route.params.id}`">
                  <div class="item">
                    <fa-icon :icon="['fas', 'file-word']" size="lg" />
                    {{ $t('Global.export_out_pdf_file') }}
                  </div>
                </a>
                <a v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])" :href="`${baseUrl}submissions/evaluation/inner_pdf/${$route.params.id}`" target="_blank">
                  <div class="item">
                    <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
                    {{ $t('Global.export_HE_file') }}
                  </div>
                </a>
                <a
                  v-if="($store.state.submission.decision && $store.state.submission.decision.removed == 0) || currentLevel == 4 || !evaluatorCheck(['ORGANIZATION_TYPE'])"
                  :href="`${baseUrl}submissions/evaluation/pdf/${$route.params.id}`"
                  target="_blank"
                >
                  <div class="item">
                    <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
                    {{ $t('Global.export_out_pdf_file') }}
                  </div>
                </a>
              </CDropdown>
            </template>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow style="display: flex; align-items: center">
          <CCol sm="5">
            <!--            <el-input :placeholder="$t('Global.search')" v-model="search_text">-->
            <!--              <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
            <!--            </el-input>-->
            <div v-if="!$store.getters['submission/decision'] && $store.getters['evaluation/standards'].length && evaluatorCheck(['ORGANIZATION_TYPE']) && level < 4"></div>
            <el-input v-else :placeholder="$t('Global.search')" clearable prepend="@" v-model="search_text" @keyup.enter.native="Refresh({ search_text: search_text })">
              <i slot="prefix" class="el-input__icon el-icon-search" @click="Refresh({ search_text: search_text })"></i>
            </el-input>
          </CCol>
        </CRow>
        <CCol sm="12">
          <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''" style="width: 100%" v-loading="$store.getters['evaluation/evaluationsLoad']">
            <el-tree
              class="filter-tree"
              :data="!$store.getters['submission/decision'] && evaluatorCheck(['ORGANIZATION_TYPE']) && level < 4 ? [] : $store.getters['evaluation/standards']"
              accordion
              :default-expand-all="expandStatus"
              icon-class="top"
              ref="tree"
              :expand-on-click-node="closeAll"
              :highlight-current="false"
              :lazy="true"
              :load="loadTreeNodes"
              node-key="id"
            >
              <div slot-scope="{ node, data }" :class="node.level === 2 ? 'custom-tree-node' : 'custom-tree-node'" style="width: 100%">
                <h6 class="align-items-center flex-wrap" style="font-weight: bolder; font-size: 16px; display: flex; text-align: initial; width: 100%" dir="rtl" v-if="node.level === 1">
                  <div style="width: 60%" class="w-sm-100">
                    <i v-if="!node.expanded" class="animate el-icon-caret-left"></i>
                    <i v-else class="animate el-icon-caret-bottom"></i>
                    <CSpinner v-if="node.expanded && $store.getters['submission/detailsLoad']" size="sm" color="info" />
                    {{ data.title }}
                  </div>
                  <div class="actions" @click="collapseAll">
                    <div class="d-flex" :style="$i18n.locale === 'ar' ? 'float:left;  font-size:13px;' : 'float: right;font-size:13px;'">
                      <div class="d-flex" v-if="data.answer">
                        <el-tooltip
                          effect="dark"
                          v-if="(evaluatorCheck(['ORGANIZATION_TYPE']) && $store.getters['submission/decision']) || !evaluatorCheck(['ORGANIZATION_TYPE'])"
                          :content="`${currentLevel ? (currentLevel === 2 || currentLevel === 4 ? $t(`Global.${getLevelOut(currentLevel - 1)}`) : $t(`Global.${getLevelOut(currentLevel)}`)) : ''}`"
                          placement="top-end"
                        >
                          <CBadge v-if="data.answer" :color="getAnswer(data.answer.answer_id || data.answer.accept).type" class="align-self-center badge-pill ml-1">{{ getAnswer(data.answer.answer_id || data.answer.accept).name }} </CBadge>
                        </el-tooltip>
                        <span v-if="currentLevel > 1 && currentLevel < 6">
                          <div v-if="currentLevel == 4 || currentLevel == 2">
                            <div v-if="data.answer.response || data.answer.response == 0" class="d-inline-flex">
                              <el-tooltip effect="dark" :content="`${currentLevel ? $t(`Global.${getLevelOut(currentLevel)}`) : ''}`" placement="top-end">
                                <CBadge v-if="data.answer.response == 1" color="success" class="badge-pill m-1">{{ `${$t('Global.ok')}` }} </CBadge>
                                <CBadge v-if="data.answer.response == 0" color="danger" class="badge-pill m-1">{{ `${$t('Global.notOk')}` }}</CBadge>
                              </el-tooltip>
                              <CBadge v-if="data.details" color="secondary" class="badge-pill m-1">{{ `${$t('Global.reportDetails', { message: data.details })}` }} </CBadge>
                            </div>
                            <div v-else>
                              <CBadge v-if="!data.answer.response" color="secondary" class="badge-pill m-1">{{ `${$t('Global.reportNoReplay')}` }}</CBadge>
                              <CBadge v-if="data.details" color="secondary" class="badge-pill m-1">{{ `${$t('Global.reportDetails', { message: data.details })}` }}</CBadge>
                            </div>
                          </div>
                          <div v-else>
                            <div v-if="data.answer.response || data.answer.response == 0" class="d-inline-flex">
                              <el-tooltip effect="dark" :content="`${currentLevel >= 4 ? $t(`Global.${getLevelOut(4)}`) : $t(`Global.${getLevelOut(2)}`)}`" placement="top-start">
                                <CBadge v-if="data.answer.response == 1" color="success" class="badge-pill m-1">{{ `${$t('Global.ok')}` }} </CBadge>
                                <CBadge v-if="data.answer.response == 0" color="danger" class="badge-pill m-1">{{ `${$t('Global.notOk')}` }} </CBadge>
                              </el-tooltip>
                            </div>
                            <CBadge v-if="!data.answer.final" color="secondary" class="badge-pill m-1">{{ `${$t('Global.reportNoUpdate')}` }}</CBadge>
                            <CBadge v-if="data.details" color="secondary" class="badge-pill m-1">{{ `${$t('Global.reportUpdateDetails', { message: data.details })}` }}</CBadge>
                          </div>
                        </span>
                      </div>
                      <router-link target="_blank" :to="{ path: `/higher/submissions/submission/reports/edit/${$route.params.id}/${data.id}`.toString() }" v-if="hasPermission('edit_submissions')">
                        <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
                      </router-link>
                    </div>
                  </div>
                </h6>
                <h5 class="d-flex flex-wrap justify-content-between align-items-center" style="font-weight: bolder; font-size: 14px; display: flex; text-align: initial; margin: 0 12px" dir="rtl" v-if="node.level === 2">
                  <div style="width: 60%" class="w-sm-100">
                    <i class="el-icon-caret-left"></i>
                    {{ data.title }}
                  </div>

                  <div class="actions" v-if="data.answer">
                    <div class="d-flex" :style="$i18n.locale === 'ar' ? 'float:left;  font-size:13px;' : 'float: right;font-size:13px;'">
                      <el-tooltip
                        effect="dark"
                        v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])"
                        :content="`${currentLevel ? (currentLevel === 2 || currentLevel === 4 ? $t(`Global.${getLevelOut(currentLevel - 1)}`) : $t(`Global.${getLevelOut(currentLevel)}`)) : ''}`"
                        placement="top-start"
                      >
                        <CBadge v-if="data.answer" :color="getAnswer(data.answer.answer_id || data.answer.accept).type" class="align-self-center badge-pill">{{ getAnswer(data.answer.answer_id || data.answer.accept).name }} </CBadge>
                      </el-tooltip>
                      <span v-if="currentLevel > 1 && currentLevel < 6">
                        <div v-if="currentLevel == 4 || currentLevel == 2">
                          <div v-if="data.answer.response || data.answer.response == 0" class="d-inline-flex">
                            <el-tooltip effect="dark" :content="`${currentLevel ? $t(`Global.${getLevelOut(currentLevel)}`) : ''}`" placement="top-start">
                              <CBadge v-if="data.answer.response == 1" color="success" class="badge-pill m-1">{{ `${$t('Global.ok')}` }} </CBadge>
                              <CBadge v-if="data.answer.response == 0" color="danger" class="badge-pill m-1">{{ `${$t('Global.notOk')}` }}</CBadge>
                            </el-tooltip>
                          </div>
                          <div v-else>
                            <CBadge v-if="!data.answer.response" color="secondary" class="badge-pill m-1">{{ `${$t('Global.reportNoReplay')}` }}</CBadge>
                          </div>
                        </div>
                        <div v-else>
                          <div v-if="data.answer.response || data.answer.response == 0" class="d-inline-flex">
                            <el-tooltip effect="dark" :content="`${currentLevel >= 4 ? $t(`Global.${getLevelOut(4)}`) : $t(`Global.${getLevelOut(2)}`)}`" placement="top-start">
                              <CBadge v-if="data.answer.response == 1" color="success" class="badge-pill m-1">{{ `${$t('Global.ok')}` }} </CBadge>
                              <CBadge v-if="data.answer.response == 0" color="danger" class="badge-pill m-1">{{ `${$t('Global.notOk')}` }} </CBadge>
                            </el-tooltip>
                          </div>
                          <CBadge v-if="!data.answer.final" color="secondary" class="badge-pill m-1">{{ `${$t('Global.reportNoUpdate')}` }}</CBadge>
                        </div>
                      </span>
                    </div>
                  </div>
                </h5>
                <div v-if="node.level === 2" style="margin: 2px 5px; padding: 2px">
                  <p v-if="data.answer" class="report" v-html="ntBr(data.answer.report)"></p>
                </div>
              </div>
            </el-tree>
          </div>
        </CCol>
      </CCardBody>
    </CCard>
    <el-dialog append-to-body custom-class="body_dialog" width="70%" :title="$t(`Global.ensureAndDesicion`)" :visible.sync="decisionDialog">
      <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item :rules="validation(false, 'textarea')" prop="number" :label="$t('Global.decisionNumber')">
          <el-input :placeholder="$t('Global.decisionNumber')" v-model="ruleForm.number"> </el-input>
        </el-form-item>
        <el-form-item prop="type" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.decision')">
          <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.type" ref="decision" :placeholder="$t('Global.selectDecision')" style="width: 100%">
            <el-option v-for="item in $store.getters['evaluation/decisions']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.decision_date')" prop="start">
          <el-date-picker @change="onFromPickValidation" @focus="changePicker" format="yyyy-MM-d" value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.start" type="date" :placeholder="$t('Global.decision_date')"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="ruleForm.type != 8" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.expiration_date')" prop="expiration">
          <el-date-picker @change="onPickValidation" :disabled="pickerDisable" @focus="changePicker" format="yyyy-MM-d" value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.expiration" type="date" :placeholder="$t('Global.expiration_date')"></el-date-picker>
        </el-form-item>
        <!-- <span class="mb-2 font-weight-bold text-muted d-flex">{{ $t('Global.reason') }}</span> -->
        <!-- <div class="reviewHeard" style="text-align: initial"> -->
        <el-form-item prop="comment" class="custom_area" :label="$t('Global.reason')">
          <el-input autosize v-model="ruleForm.reason" resize="none" type="textarea"></el-input>
        </el-form-item>
        <!-- </div> -->
        <!-- <span class="mb-2 font-weight-bold text-muted d-flex">{{ $t('Global.notes') }}</span> -->
        <el-form-item prop="Justifications" class="custom_area" :label="$t('Global.notes')">
          <el-input autosize v-model="ruleForm.note" resize="none" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display: flex">
        <el-button @click="handleAccept(7)" round size="mini" class="mx-1 right_icon" type="primary"> {{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="decisionDialog = false" round size="small"> {{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('Global.writeNote')" :visible.sync="dialogVisible" width="80%">
      <el-form label-position="top" :model="form" :rules="rules" status-icon size="large" ref="form" label-width="120px" class="stateForm demo-ruleForm">
        <CRow>
          <el-form-item :rules="validation(false, 'textarea')" class="custom_area" style="width: 100%" prop="rejectReason">
            <el-input autofocus name="rejectReason" id="rejectReason" class="textarea" type="textarea" :placeholder="$t('Global.rejectReason')" v-model="form.rejectReason"></el-input>
          </el-form-item>
        </CRow>
      </el-form>
      <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
        <el-button icon="el-icon-close" @click="sendReject('form')" round size="mini" class="mx-1 right_icon" type="danger">{{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import report from '../../../components/report';
import Team from '../components/team';
import { EventBus } from '../../../../main';
export default {
  components: { report, Team },
  data() {
    return {
      dialogVisible: false,
      level: 0,
      baseUrl: process.env.VUE_APP_BASE_URL,
      isLoad: false,
      editMode: false,
      search_text: '',
      expandedNode: null,
      closeAll: true,
      pickerDisable: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptionsTo: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      ruleForm: {
        type: null,
        start: null,
        expiration: null,
        reason: null,
        note: null,
        number: null,
      },
      form: {
        rejectReason: null,
      },
      rules: {
        rejectReason: [
          {
            required: true,
            pattern: /^[^-\s][a-zA-Zا-ي0-9_\s-]+$/,
            message: 'من فضلك يجب كتابة الرساله',
            trigger: 'blur',
          },
        ],
      },
      details: false,
      expandStatus: false,
      decisionDialog: false,
      indicator: [],
      notCompare: ['رد المؤسسة', 'رأى اللجنة', 'تقييم مجلس الادارة'],
    };
  },
  watch: {
    'ruleForm.number'(value) {
      if (!value);
      this.ruleForm.number = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.start': function (val) {
      if (val) {
        this.pickerDisable = false;
      } else {
        this.ruleForm.expiration = null;
        this.pickerDisable = true;
      }
    },
    // search_text: function(search_text) {
    //   this.Refresh({search_text: search_text });
    // },
    // level: function(val) {
    //   this.Refresh({ level: val });
    // },
  },
  mounted() {
    this.Refresh();
  },
  destroyed() {
    this.$store.commit('evaluation/SET_STATISTICS', null);
  },
  computed: {
    currentLevel() {
      return this.$store.state.submission.last_alert ? this.$store.state.submission.last_alert.actual_level : 0;
    },
    
    status() {
      return this.$store.getters['evaluation/statistics'];
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
  },
  methods: {
    dialogOpen(state, type = 0) {
      this.dialogVisible = true;
      this.$nextTick(_ => {
        document.getElementById('rejectReason').focus();
      });
    },
    onFromPickValidation(pick) {
      if (this.ruleForm.start && this.ruleForm.type == 1) {
        var d = new Date(Date.parse(pick.replace(/-/g, ' ')));
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var c = new Date(year + 5, month, day);
        this.ruleForm.expiration = c.toISOString();
        this.ruleForm.expiration = this.ruleForm.expiration.split('T')[0];
      }
      if (this.ruleForm.expiration) {
        var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
        var toDate = new Date(Date.parse(this.ruleForm.expiration.toString().replace(/-/g, ' ')));
        if (pickedDate > toDate) {
          this.$notify.error({ message: `${this.$t('Validation.pickerTo')}` });
          this.ruleForm.start = null;
        }
      }
    },
    onPickValidation(pick) {
      var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
      var todaysDate = new Date(Date.parse(this.ruleForm.start.replace(/-/g, ' ')));
      if (pickedDate < todaysDate) {
        this.$notify.error({ message: `${this.$t('Validation.pickerTo')}` });
        this.ruleForm.expiration = null;
      }
    },
    loadTreeNodes(node, resolve) {
      if (node.level === 1 && this.$route.name == 'submission') {
        this.$store
          .dispatch('evaluation/getEvaluation', {
            evaluation_id: this.$route.params.id,
            question_id: node.data.id,
          })
          .then(() => {
            return resolve(this.$store.getters['evaluation/questions']);
          });
      }
      return resolve([]);
    },
    Refresh(query) {
      this.$store
        .dispatch('evaluation/standards', {
          evaluation_id: this.$route.params.id,
          query: query,
        })
        .then(() => {
          this.level = this.$store.state.submission.last_alert ? this.$store.state.submission.last_alert.actual_level : 0;
          this.isLoad = false;
          this.$store.commit('archive/SET_GENERAL_LOAD', false);
        });
      this.$store.dispatch('evaluationNotes/getEvaluationNotes', this.$route.params.id);
      this.$store.dispatch('submission/submission', this.$route.params.id);
    },
    print() {
      this.$htmlToPaper('print_report');
    },
    openDesicionDialog(mode) {
      if (mode == 'edit') {
        this.editMode = true;
        this.ruleForm.type = this.$store.state.submission.decision ? this.$store.state.submission.decision.type : null;
        this.ruleForm.number = this.$store.state.submission.decision ? this.$store.state.submission.decision.number : null;
        this.ruleForm.start = this.$store.state.submission.decision ? this.$store.state.submission.decision.start : null;
        this.ruleForm.expiration = this.$store.state.submission.decision ? this.$store.state.submission.decision.expiration : null;
        this.ruleForm.reason = this.$store.state.submission.decision ? this.$store.state.submission.decision.reason : null;
        this.ruleForm.note = this.$store.state.submission.decision ? this.$store.state.submission.decision.note : null;
      } else {
        if (mode == '') {
          this.ruleForm.type = this.$store.state.submission.decision ? this.$store.state.submission.decision.type : null;
          this.ruleForm.number = this.$store.state.submission.decision ? this.$store.state.submission.decision.number : null;
          this.ruleForm.start = this.$store.state.submission.decision ? this.$store.state.submission.decision.start : null;
          this.ruleForm.expiration = this.$store.state.submission.decision ? this.$store.state.submission.decision.expiration : null;
          this.ruleForm.reason = this.$store.state.submission.decision ? this.$store.state.submission.decision.reason : null;
          this.ruleForm.note = this.$store.state.submission.decision ? this.$store.state.submission.decision.note : null;
        } else {
          this.editMode = false;
          this.ruleForm.type = null;
          this.ruleForm.number = null;
          this.ruleForm.start = null;
          this.ruleForm.expiration = null;
          this.ruleForm.reason = null;
          this.ruleForm.note = null;
        }
      }
      this.decisionDialog = true;
    },
    handleAccept(currentLevel) {
      if (currentLevel == 7) {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
              confirmButtonText: `${this.$t('Global.accept')}`,
              cancelButtonText: `${this.$t('Global.cancel')}`,
              type: 'success',
            }).then(_ => {
              let query =
                currentLevel === 7
                  ? {
                      ...this.ruleForm,
                      status: this.evConstants('APPROVE_STATUS'),
                    }
                  : { status: this.evConstants('APPROVE_STATUS') };
              this.decisionDialog = false;
              this.isLoad = true;
              this.$store.commit('archive/SET_GENERAL_LOAD', true);
              if (this.editMode) {
                this.$store
                  .dispatch('evaluationNotes/editDecision', {
                    id: this.$route.params.id,
                    query: this.ruleForm,
                  })
                  .then(() => {
                    this.$notify({
                      type: 'success',
                      message: 'تمت العملية بنجاح',
                    });
                    this.Refresh();
                  });
              } else {
                this.$store
                  .dispatch('evaluationNotes/changeSubState', {
                    id: this.$route.params.id,
                    query: query,
                  })
                  .then(() => {
                    this.$notify({
                      type: 'success',
                      message: 'تمت العملية بنجاح',
                    });
                    this.Refresh();
                  });
              }
            });
          }
        });
      } else {
        this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
          confirmButtonText: `${this.$t('Global.accept')}`,
          cancelButtonText: `${this.$t('Global.cancel')}`,
          type: 'success',
        }).then(_ => {
          let query =
            currentLevel === 7
              ? {
                  ...this.ruleForm,
                  status: this.evConstants('APPROVE_STATUS'),
                }
              : { status: this.evConstants('APPROVE_STATUS') };
          // let query = {status: this.evConstants('APPROVE_STATUS')};

          this.decisionDialog = false;
          this.isLoad = true;
          this.$store.commit('archive/SET_GENERAL_LOAD', true);
          this.$store
            .dispatch('evaluationNotes/changeSubState', {
              id: this.$route.params.id,
              query: query,
            })
            .then(() => {
              this.$notify({
                type: 'success',
                message: 'تمت العملية بنجاح',
              });
              this.Refresh();
            });

          //   this.decisionDialog = false;
          //   this.isLoad = true;
          //   this.$store
          //     .dispatch('evaluationNotes/changeSubState', {
          //       id: this.$route.params.id,
          //       query: query,
          //     })
          //     .then(() => {
          //       this.$notify({
          //         type: 'success',
          //         message: 'تمت العملية بنجاح',
          //       });
          //       this.Refresh();
          //     });
        });
      }
    },
    sendReject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {
            note: String(this.form.rejectReason),
            status: this.evConstants('REJECT_STATUS'),
          };
          this.isLoad = true;
          this.$store
            .dispatch('evaluationNotes/changeSubState', {
              id: this.$route.params.id,
              query: query,
            })
            .then(() => {
              this.$notify.error({ title: 'تم الرفض', message: 'تم الرفض وارسال الملاحظة ' });
              this.dialogVisible = false;
              this.Refresh();
            });
        }
      });
    },
    changePicker() {
      this.$nextTick(() => {
        let picker = document.querySelectorAll('.el-picker-panel .el-date-picker__header .el-date-picker__header-label');
        picker.forEach((element, i) => {
          if (i == 1) {
            element.style.position = 'absolute';
            element.style.top = '15px';
          }
        });
      });
    },
    getCurrentKey() {
      if (this.expandedNode) {
        this.$refs.tree.store.nodesMap[this.expandedNode].expanded = false;
      }
    },
    collapseAll() {
      this.closeAll = false;
      setTimeout(() => {
        this.closeAll = true;
      }, 100);
      //    setTimeout(() => {
      //        for (let i = 0; i < this.$store.getters['evaluation/standards'].length; i++) {
      //          this.$refs.tree.store.nodesMap[this.$store.getters['evaluation/standards'][i].id].expanded = false
      //        }
      //    }, 500);
    },
  },
  created() {
    EventBus.$on('handleAccept', data => {
      this.handleAccept(data);
    });

    EventBus.$on('dialogOpen', data => {
      this.dialogOpen(data);
    });

    EventBus.$on('openDesicionDialog', data => {
      this.openDesicionDialog(data);
    });
  },
};
</script>

<style lang="scss">
.ar .body_dialog {
  .el-dialog__header {
    flex-direction: row-reverse;
  }
  .dialog-footer {
    flex-direction: row-reverse;
  }
}
.badge-dark {
  background-color: #fcfb00;
  color: #555;
}

.custom-tree-node {
  .badge {
    line-height: revert;
  }
}

.report_progress {
  .el-progress-circle {
    width: 40px !important;
    height: 40px !important;
  }

  .el-progress__text {
    font-size: 12px;
  }

  .c-callout {
    border: none;
    padding: 1rem;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
  }
}

.el-tree-node__content {
  padding: 1rem;
  height: auto;
}

.el-tree-node__expand-icon {
  font-size: 14px;
}

.report {
  font-weight: bold;
  word-break: break-word;
  font-size: 13px;
  line-height: 2;
  margin: 20px;
}

.title {
  margin-bottom: 20px;
  margin-right: 10px;
  display: flex;
  text-align: justify;
}

.top {
  display: none !important;
}

.el-tree-node {
  white-space: unset;
  text-align: initial;
}

.custom-tree-node h6 {
  margin: 0 !important;
  padding: 0 0.5rem;
  display: flex !important;
  justify-content: space-between !important;
}

.custom-tree-node > div {
  margin: 0 !important;
  padding: 0 !important;
}

*:focus {
  outline: none !important;
}

.el-switch__label {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.el-dialog__headerbtn {
  position: static !important;
}

.el-dialog__header {
  display: flex !important;
  justify-content: space-between !important;
}

.review_header {
  display: flex;
  align-items: center;
  margin: 0.5rem 0.5rem;
}

.report_style {
  p {
    line-height: 2 !important;
  }
}

.lh-2 {
  line-height: 2;
}

.comment_card {
  position: relative;

  &::before {
    content: '';
    top: 8px;
    right: -6px;
    position: absolute;
    width: 2px;
    /* height: 2px; */
    bottom: -2px;
    background-color: #ddd;
  }

  margin: 0rem 2.8rem;

  small {
    font-weight: bold;
    color: #ddd;
  }

  h6 {
    margin-top: 5px;
    width: 70%;
  }
}
</style>
