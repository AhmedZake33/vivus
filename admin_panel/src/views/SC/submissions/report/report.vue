<template>
  <div>
    <CCard v-loading="$store.state.evaluation.evaluationsLoad">
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
            <i class="el-icon-star-on"></i>
            {{ $t('evaluation.evaluations_document_items') }}
          </div>
        </div>
        <div v-if="evaluatorCheck(['ORGANIZATION_TYPE']) && level != 4 && (($store.state.submission.decision && $store.state.submission.decision.removed == 1) || !$store.getters['submission/decision'])"></div>
        <div v-else-if="evaluatorCheck(['TEAM_TYPE']) && level == 5"></div>
        <div v-else :class="$i18n.locale === 'en' ? 'card-header-actions' : ''">
          <div class="d-inline-flex align-items-center justify-content-between">
            <CDropdown color="success" placement="bottom-end" size="sm" class="customDrop" style="width: 17rem !important;">
              <template #toggler-content>
                <CIcon name="cil-settings" />
                <span style="font-weight: bold">{{ $t('Global.action') }}</span>
              </template>
              <a v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])" :href="`${baseUrl}evaluation/pre/document/${$route.params.id}/word`">
                <div class="item">
                  <fa-icon :icon="['fas', 'file-word']" size="lg" />
                  {{ $t('Global.export_word_file') }}
                </div>
              </a>
              <a v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) || decision" :href="`${baseUrl}evaluation/pre/document/${$route.params.id}/pdf`" target="_blank">
                <div class="item">
                  <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
                  {{ $t('Global.export_pdf_file') }}
                </div>
              </a>
<!--              <a v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) || decision" :href="`${baseUrl}evaluation/pre/document/${$route.params.id}/contact_pdf`" target="_blank">-->
<!--                <div class="item">-->
<!--                  <fa-icon :icon="['fas', 'file-pdf']" size="lg" />-->
<!--                  {{ $t('Global.export_pdf_file_contact') }}-->
<!--                </div>-->
<!--              </a>-->
              <a v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) || decision" :href="`${baseUrl}evaluation/pre/document/${$route.params.id}/out_word`" target="_blank">
                <div class="item">
                  <fa-icon :icon="['fas', 'file-word']" size="lg" />
                  {{ $t('Global.export_end_report') }}
                </div>
              </a>
              <a :href="`${baseUrl}evaluation/pre/document/${$route.params.id}/contact_word`" target="_blank">
                <div class="item">
                  <fa-icon :icon="['fas', 'file-word']" size="lg" />
                  {{ $t('Global.export_end_report_contact') }}
                </div>
              </a>
            </CDropdown>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow style="display: flex; align-items: center">
          <CCol sm="12" v-if="orgReply">
            <div class="w-100 mx-2 mt-2">
              <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                <span class="font_12 flex-column">
                  <span class="p-0 font-weight-bolder">
                    {{ $t(`Global.organization_level`) }}
                  </span>
                  <p class="font-sm font-weight-normal">{{ orgReply }}</p>
                </span>
              </div>
            </div>
          </CCol>
          <CCol sm="5">
            <div
              v-if="($store.getters['submission/decision'] && $store.state.submission.decision && $store.state.submission.decision.removed == 1) || (!$store.getters['submission/decision'] && ((evaluatorCheck(['ORGANIZATION_TYPE']) && level != 4) || (evaluatorCheck(['TEAM_TYPE']) && level == 5)))"
            ></div>
            <el-input class="mb-3" v-else @input="filterResults" :placeholder="$t('Global.search')" clearable prepend="@" v-model="search">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </CCol>
        </CRow>
        <CRow v-if="evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE', 'COMMITTEE_TYPE'])"> </CRow>
        <CRow v-else class="mb-3">
          <b-progress class="w-100" style="height: 2rem" show-value>
            <b-progress-bar v-for="state in status" :value="state.value ? ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : 0" :variant="getpreAnswer(state.label).type">
              <el-tooltip effect="dark" :content="state.value ? $t(`Global.${state.name}`) + ' %' + ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : '0'" placement="top">
                <span style="color: #fff; font-weight: bolder">
                  <strong>%{{ state.value ? ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : 0 }}</strong></span
                >
              </el-tooltip>
            </b-progress-bar>
          </b-progress>
        </CRow>
        <CRow>
          <CCol sm="12">
            <div
              class="mb-4"
              v-for="(subQustion, index) in ($store.getters['submission/decision'] && $store.state.submission.decision && $store.state.submission.decision.removed == 1 && evaluatorCheck(['ORGANIZATION_TYPE'])) ||
              (!$store.getters['submission/decision'] && ((evaluatorCheck(['ORGANIZATION_TYPE']) && level != 4) || (evaluatorCheck(['TEAM_TYPE']) && level == 5)))
                ? []
                : resualts
                ? resualts
                : PreQustions"
            >
              <div>
                <div class="w-100" v-if="!subQustion.level_id">
                  <h6 class="align-items-center flex-wrap" :class="'space-' + subQustion.question_type" style="font-weight: bolder; font-size: 16px; display: flex; text-align: initial; width: 100%" dir="rtl">
                    <div style="width: 100%" class="w-sm-100 text-muted">{{ subQustion.code ? '(' + subQustion.code.split('-')[1] + ')' : '' }} {{ subQustion.title }}</div>
                  </h6>
                </div>
                <div class="w-100" v-else>
                  <div class="align-items-center d-flex flex-wrap justify-content-between" :class="'space-' + 5" style="font-weight: bolder; font-size: 14px; display: flex; text-align: initial; width: 100%" dir="rtl">
                    <router-link style="float: left" to="" v-if="hasPermission('edit_submissions')"> {{ subQustion.code ? '(' + subQustion.code.split('-')[1] + ')' : '' }} {{ subQustion.title }} </router-link>
                    <div class="d-flex align-items-center">
<!--                      <el-tooltip placement="top" :content="$t('Global.practices')">-->
<!--                        <el-button @click="showReport(subQustion)" type="primary" size="mini" class="xs_mini mr-1" icon="el-icon-s-order" circle></el-button>-->
<!--                      </el-tooltip>-->
                      <CBadge v-if="(!evaluatorCheck(['ORGANIZATION_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.decision && $store.state.submission.decision.removed == 0)) && subQustion.answer" color="success  badge-pill " class="d-flex mr-2">{{
                        $t(`Global.level_${subQustion.answer.value}`)
                      }}</CBadge>
                      <CBadge v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && (level == 3 || level == 5) && subQustion.answer && !subQustion.answer.final" color="light badge-pill" class="d-flex mr-2"> {{ $t('Global.reportNoUpdate') }}</CBadge>
<!--                      <div v-if="level >= 4 && level != 6">-->
<!--                        <CBadge v-if="subQustion.answer && subQustion.answer.Justifications" :color="subQustion.answer.organization_accept ? 'success  badge-pill' : 'danger badge-pill'" class="d-flex mr-2">-->
<!--                          {{ subQustion.answer.organization_accept ? $t('Global.ok') : $t('Global.notOk') }} ({{ $t('Global.title') }})</CBadge-->
<!--                        >-->
<!--                        <CBadge v-else color="light  badge-pill " class="d-flex mr-2">{{ $t(`Global.noComment`) }} ({{ $t('Global.title') }})</CBadge>-->
<!--                      </div>-->
<!--                      <div v-if="level >= 2 && level != 4 && level != 5 && ((!evaluatorCheck(['ORGANIZATION_TYPE']) && level != 6) || (evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.decision && $store.state.submission.decision.removed == 0 && level != 6))">-->
<!--                        <CBadge v-if="subQustion.answer && subQustion.answer.feedback" :color="subQustion.answer.technical_accept ? 'success  badge-pill' : 'danger badge-pill'" class="d-flex mr-2">-->
<!--                          {{ subQustion.answer.technical_accept ? $t('Global.ok') : $t('Global.notOk') }} ({{ $t('Global.committee_type') }})</CBadge-->
<!--                        >-->
<!--                        <CBadge v-else color="light  badge-pill " class="d-flex mr-2">{{ $t(`Global.noComment`) }} ({{ $t('Global.committee_type') }})</CBadge>-->
<!--                      </div>-->
                      <CBadge
                        v-if="(!evaluatorCheck(['ORGANIZATION_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.decision && $store.state.submission.decision.removed == 0)) && subQustion.statistic"
                        v-for="state in subQustion.statistic"
                        :color="getpreAnswerAsk(state.label).type + ' badge-pill'"
                        class="d-flex mr-2"
                      >
                        {{ state.count ? state.count : '' }}{{ ' ' }}{{ $t(`Global.value_${state.label}`) }}
                      </CBadge>
                      <!--                      <span v-if="evaluatorCheck(['ORGANIZATION_TYPE']) && level < 4 && $store.state.submission.decision && $store.state.submission.decision.removed == 1"></span>-->
                      <router-link
                        class="mx-2"
                        target="_blank"
                        :to="{ path: `/school/submissions/submission/reports/edit/${$route.params.id}/${subQustion.id}`.toString() }"
                        v-if="(showAction && evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE', 'COMMITTEE_TYPE'])) || decision || !evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE', 'COMMITTEE_TYPE']) || teamTask"
                      >
                        <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
                      </router-link>
                      <el-tooltip placement="top" :content="$t('Global.suggestions')">
                        <el-button v-if="($store.state.user.allowPu || hasPermission('admin_system')) && !evaluatorCheck(['ORGANIZATION_TYPE'])" @click="openDialog(subQustion)" type="primary" size="mini" class="xs_mini mr-1" :icon="`${subQustion.enhancement ? 'el-icon-edit' : 'el-icon-plus'}`" circle></el-button>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CCol>
          <!-- <template v-if="$store.state.evaluation.statistics && $store.state.evaluation.statistics.length">
            <CCol sm="5" v-if="evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE', 'COMMITTEE_TYPE'])">
              <CRow></CRow>
            </CCol>
            <CCol sm="5" v-else>
              <CChartDoughnut :datasets="datasets" :labels="labels" />
            </CCol>
          </template> -->
        </CRow>
      </CCardBody>
    </CCard>
    <el-dialog :title="$t('Global.suggestions')" :visible.sync="dialogVisible" width="70%">
      <div>
        <el-form label-position="top" :model="form" status-icon size="large" ref="form" label-width="120px" class="stateForm demo-ruleForm">
          <CRow>
            <el-form-item :label="$t('Global.justification')" :rules="validation(false, 'textarea')" style="width: 100%" prop="justification">
              <el-input id="justification" class="textarea" type="textarea" :placeholder="$t('Global.justification')" v-model="form.justification"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Global.suggestions')" :rules="validation(false, 'textarea')" style="width: 100%" prop="suggestions">
              <el-input id="suggestions" class="textarea" type="textarea" :placeholder="$t('Global.suggestions')" v-model="form.suggestions"></el-input>
            </el-form-item>
          </CRow>
        </el-form>
        <span slot="footer" class="dialog-footer" :class="isLoad ? 'disabledAll' : ''" style="display: flex">
          <el-button
            v-if="
              !$store.getters['submission/decision'] &&
              ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                ($store.state.submission.last_alert.level &&
                  ($store.state.submission.last_alert.level <= 4 ||
                    ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.level == 6)) &&
                  isApproved &&
                  isLeader) ||
                hasPermission('admin_submissions') || evaluatorCheck(['VICE_TYPE']) || evaluatorCheck(['COMMITTEE_TYPE']) ||
                hasPermission('report_update'))
            "
            @click="save('form')"
            round
            size="mini"
            class="mx-1 right_icon"
            type="primary"
            >{{ $t('Global.save') }}</el-button
          >
          <el-button v-else round size="mini" class="mx-1 right_icon disabledAll" type="primary">{{ $t('Global.save') }}</el-button>
          <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">{{ $t('Global.discard') }}</el-button>
        </span>
      </div>
    </el-dialog>

    <el-dialog :title="$t('Global.practices')" :visible.sync="reportDialog" width="70%">
      <div class="w-100">
        <div class="px-3 docs_header d-flex justify-content-between align-items-center">
          <span class="font_12 flex-column">
            <p class="font-sm font-weight-normal mb-0">{{ report ? report : 'لايوجد بيانات' }}</p>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { EventBus } from '../../../../main.js';
import { CChartDoughnut } from '@coreui/vue-chartjs';

export default {
  name: 'report',
  components: { CChartDoughnut },
  data() {
    return {
      search_text: '',
      expandStatus: false,
      closeAll: true,
      reportDialog: false,
      report: null,
      baseUrl: process.env.VUE_APP_BASE_URL,
      resualts: null,
      search: '',
      question_id: null,
      isLoad: false,
      id: null,
      dialogVisible: false,
      form: {
        suggestions: null,
        justification: null,
      },
    };
  },
  mounted() {
    this.Refresh();
  },
  computed: {
    teamTask(){
      if (this.$store.state.submission.last_alert) {
        if(this.$store.state.submission.last_alert.task_id == 1 && this.$store.state.submission.last_alert.evaluator_type == 8){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    PreQustions() {
      if (this.$store.getters['evaluation/standards']) {
        return this.$store.getters['evaluation/standards'];
      }
    },
    orgReply() {
      if (this.$store.state.evaluation.orgReply && this.$store.state.evaluation.orgReply[0]) {
        return this.$store.state.evaluation.orgReply[0].message;
      } else {
        false;
      }
    },

    status() {
      return this.$store.getters['evaluation/preStatistics'];
    },
    level() {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.actual_level;
      }
      return false;
    },
    datasets() {
      if (this.$store.state.evaluation.statistics) {
        return [
          {
            backgroundColor: Array.from(this.$store.state.evaluation.statistics, el => this.getpreAnswer(el.label).color),
            data: Array.from(this.$store.state.evaluation.statistics, el => el.count),
          },
        ];
      }
    },
    labels() {
      if (this.$store.state.evaluation.statistics) {
        return Array.from(this.$store.state.evaluation.statistics, el => this.getpreAnswer(el.label).name);
      }
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
    decision: function () {
      if (this.$store.state.submission.decision && this.$store.state.submission.decision.removed == 0) {
        return true;
      }
      return false;
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
    isApproved: function () {
      if (this.$store.getters['evaluation/team'] && this.$store.getters['evaluation/team'].length) {
        return this.$store.getters['evaluation/team'][0].leader_approved ? false : true;
      }
    },
    isLeader: function () {
      if (this.$store.getters['submission/team']) {
        let leader = this.$store.getters['submission/team'].all_members.find(member => member.team_job == 1);
        if (leader.id == this.authUser().id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  methods: {
    showReport(report) {
      this.reportDialog = true;
      this.report = report.report || '';
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let obj = {
            question_id: this.question_id,
            evaluation_id: this.$route.params.id,
            suggest: this.form.suggestions,
            note: this.form.justification,
          };
          this.$store
            .dispatch('submission/saveEnhancement', {
              id: this.id ? `/${this.id}` : '',
              query: obj,
            })
            .then(_ => {
              this.suggestions = null;
              this.justification = null;
              this.dialogVisible = false;
              this.id = null;
              this.isLoad = false;
              this.Refresh();
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
    openDialog(subQustion) {
      if (subQustion.enhancement) {
        this.form.suggestions = subQustion.enhancement.suggest || '';
        this.form.justification = subQustion.enhancement.note || '';
        this.question_id = subQustion.id;
        this.id = subQustion.enhancement.id;
      } else {
        this.form.suggestions = null;
        this.form.justification = null;
        this.question_id = subQustion.id;
        this.id = null;
      }
      this.dialogVisible = true;
    },
    filterResults() {
      this.resualts = this.PreQustions.filter(item => item.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
    },
    getTitle(title) {
      EventBus.$emit('getTitle', title);
    },
    loadTreeNodes(node, resolve) {
      if ([1, 2, 3, 4, 5].includes(node.level)) {
        this.$store
          .dispatch('evaluation/getPreEvaluation', {
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
      return this.$store.dispatch('evaluation/preStandards', {
        evaluation_id: this.$route.params.id,
        query: query,
      });
    },
  },
};
</script>

<style lang="scss">
.space-1 {
  margin-right: 0.4rem !important;
  /*margin-left: 2rem !important;*/
}
.space-2 {
  margin-right: 0.8rem !important;
  /*margin-left: 2rem !important;*/
}

.space-3 {
  margin-right: 1.2rem !important;
  /*margin-left: 3rem !important;*/
}

.space-4 {
  margin-right: 1.8rem !important;
  /*margin-left: 4rem !important;*/
}

.space-5 {
  margin-right: 2.6rem !important;
  padding-left: 2.6rem !important;
}

.el-tree-node__content {
  padding: 1rem;
  height: auto;
}

.el-tree-node__expand-icon {
  font-size: 14px;
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
  display: flex !important;
  justify-content: space-between !important;
}

.custom-tree-node > div {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
