<template>
  <div>
    <div class="d-flex justify-content-between" v-if="$store.state.evaluation.pages && afterRender && !evaluatorCheck(['ORGANIZATION_TYPE'])">
      <el-button style="height: max-content" v-if="$store.state.evaluation.pages.next" icon="el-icon-arrow-right" round size="mini" @click="next($store.state.evaluation.pages.next)" class="custom_send_icon" type="primary"> {{ $t('Global.next') }} </el-button>
      <el-button style="height: max-content" v-else round size="mini" icon="el-icon-arrow-right" class="border-dark disabled disabled_color custom_send_icon" type="primary">
        {{ $t('Global.next') }}
      </el-button>
      <div class="d-flex">
        <div class="compare mb-3">
          <div :class="`${option === false ? 'switch_option' : 'active switch_option'}`" style="display: inline-flex">
            <span :class="`${option === false ? `${$i18n.locale === 'en' ? 'h6 mr-2' : 'h6'}` : `${$i18n.locale === 'en' ? 'active h6 ' : 'active h6'}`}`" style="cursor: pointer; margin: 0 0" @click="option = true"><i class="el-icon-view"></i>{{ $t('Global.showAll') }}</span>
            <span :class="`${option === false ? 'active h6' : 'h6'}`" style="cursor: pointer; margin: 0 0" @click="option = false">{{ $t('Global.showCurrent') }}</span>
          </div>
        </div>
        <div class="compare">
          <div :class="`${reCompare === false ? 'switch_option' : 'active switch_option'}`" style="display: inline-flex">
            <span :class="`${reCompare === false ? `${$i18n.locale === 'en' ? 'h6 mr-2' : 'h6'}` : `${$i18n.locale === 'en' ? 'active h6 ' : 'active h6'}`}`" style="cursor: pointer; margin: 0 0" @click="reCompare = true"><i class="el-icon-view"></i>{{ $t('Global.showCompare') }}</span>
            <span :class="`${reCompare === false ? 'active h6' : 'h6'}`" style="cursor: pointer; margin: 0 0" @click="reCompare = false">{{ $t('Global.hideCompare') }}</span>
          </div>
        </div>
      </div>

      <el-button style="height: max-content" icon="el-icon-arrow-left" v-if="$store.state.evaluation.pages.prev" round size="mini" @click="next($store.state.evaluation.pages.prev)" class="right_icon custom_send_icon" type="primary">{{ $t('Global.prev') }} </el-button>
      <el-button style="height: max-content" v-else icon="el-icon-arrow-left" round size="mini" class="border-dark disabled disabled_color right_icon custom_send_icon" type="primary">{{ $t('Global.prev') }} </el-button>
    </div>
    <CRow class="no-gutters" v-loading="loading">
      <CCard style="width: 100%">
        <CRow v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])" class="no-gutters pl-2 pr-2 report_progress" style="border: 1px solid #eee">
          <b-progress class="w-100 my-2" style="height: 2rem" show-value>
            <b-progress-bar v-for="state in status" :value="state.value ? ((state.value.count / $store.getters['evaluation/questions'].length) * 100).toFixed(2) : 0" :variant="getAnswer(state.label).type">
              <span
                >{{ $t(`Global.${state.name}`) }}: <strong>%{{ state.value ? ((state.value.count / $store.getters['evaluation/questions'].length) * 100).toFixed(2) : 0 }}</strong></span
              >
            </b-progress-bar>
          </b-progress>
        </CRow>

        <CCol sm="12" class="no_shadow mt-3">
          <CCard style="scroll-margin: 3rem" :id="question ? question.id : ''" v-for="(question, i) in $store.getters['evaluation/questions']">
            <el-collapse class="custom_collapse" v-model="activeName" accordion>
              <el-collapse-item :title="question.title" :name="i + 1">
                <template slot="title">
                  <CCardHeader class="my-2">
                    <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block">
                      <i class="el-icon-question"></i>
                      <strong> {{ question.title }} ؟ </strong>
                      <CBadge v-if="question.answer && !evaluatorCheck(['ORGANIZATION_TYPE'])" :color="getAnswer(question.answer.answer_id || question.answer.accept).type" class="mr-2 ml-2 badge-pill">{{ getAnswer(question.answer.answer_id || question.answer.accept).name }} </CBadge>
                    </div>
                  </CCardHeader>
                  <div style="flex-grow: 1; text-align: end; width: 20%" class="d-flex align-items-center justify-content-end">
                    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                      <el-button
                        v-if="evaluatorCheck(['TEAM_TYPE']) && !$store.state.evaluation.canEdit && currentLevel != 2 && currentLevel != 4 && !question.answer"
                        :icon="`${question.answer ? 'el-icon-edit' : 'el-icon-plus'}`"
                        round
                        size="mini"
                        @click="getQuestionData(question)"
                        class="right_icon custom_send_icon"
                        type="primary"
                        >{{ question.answer ? $t('Global.') : $t('Global.add') }}
                      </el-button>
                    </template>
                  </div>
                </template>
                <CCardBody dir="rtl" style="text-align: initial" class="py-1">
                  <el-form label-position="top" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <CRow>
                      <CCol sm="12">
                        <div>
                          <div class="reviewHeard" style="text-align: initial">
                            <div v-if="option">
                              <report v-if="question.init" :currentLevel="currentLevel" @openDialog="openDialog" :question="question" :report="question.init" :comment="question.committee" :commentFrom="$t('Global.committee')" :level="$t('Global.init')"></report>
                              <report
                                v-if="question.team"
                                team
                                :currentLevel="currentLevel"
                                @openDialog="openDialog"
                                :question="question"
                                :report="question.team"
                                :organization="question.organization"
                                :organizationFrom="$t('Global.organization_level')"
                                :option="reCompare"
                                :compare_report="question.init"
                                :level="$t('Global.team_level')"
                              ></report>
                              <report final v-if="question.final" :currentLevel="currentLevel" @openDialog="openDialog" :question="question" :report="question.final" :option="reCompare" :compare_report="question.team" :level="$t('Global.final')"></report>
                              <report director v-if="question.director" :currentLevel="currentLevel" @openDialog="openDialog" :question="question" :option="reCompare" :compare_report="question.final" :report="question.director" :level="$t('Global.director')"></report>
                            </div>
                            <div v-else>
                              <report
                                v-if="question.answer"
                                @getQuestionData="getQuestionData"
                                currentAnswer
                                :currentLevel="currentLevel"
                                @openDialog="openDialog"
                                :question="question"
                                :commentFrom="$t(`Global.approvals_status_${2}`)"
                                :organizationFrom="$t(`Global.approvals_status_${4}`)"
                                :comment="question.committee"
                                :organization="question.organization"
                                :report="question.answer"
                                :level="$t(`Global.${getLevelOut(preLevel)}`)"
                              ></report>
                            </div>
                          </div>
                        </div>
                      </CCol>
                    </CRow>
                  </el-form>
                </CCardBody>
              </el-collapse-item>
            </el-collapse>
          </CCard>
        </CCol>
      </CCard>
      <CCard style="width: 100%">
        <CCardBody class="text-initial p-0">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
              <i class="el-icon-question"></i>
              <strong> {{ $store.getters['evaluation/parent'].title }} ؟ </strong>
              <CBadge v-if="$store.getters['evaluation/parent'].answer && !evaluatorCheck(['ORGANIZATION_TYPE'])" :color="getAnswer($store.getters['evaluation/parent'].answer.answer_id || $store.getters['evaluation/parent'].answer.accept).type" class="badge-pill ml-2 mr-2"
                >{{ getAnswer($store.getters['evaluation/parent'].answer.answer_id || $store.getters['evaluation/parent'].answer.accept).name }}
              </CBadge>
            </div>
            <div>
              <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                <el-button
                  v-if="!$store.getters['evaluation/parent'].answer && currentLevel != 6 && evaluatorCheck(['TEAM_TYPE']) && !$store.state.evaluation.canEdit && currentLevel != 2 && currentLevel != 4"
                  :icon="`${$store.getters['evaluation/parent'].answer ? 'el-icon-edit' : 'el-icon-plus'}`"
                  round
                  size="mini"
                  @click="mainDialogVisibleOpen($store.getters['evaluation/parent'])"
                  class="right_icon custom_send_icon"
                  type="primary"
                  >{{ $store.getters['evaluation/parent'].answer ? $t('Global.edit') : $t('Global.add') }}
                </el-button>
                <el-button
                  :disabled="!checkAnswer()"
                  v-if="(currentLevel != 6 && evaluatorCheck(['COMMITTEE_TYPE']) && currentLevel == 2 && !$store.getters['evaluation/parent'].committee) || (!$store.getters['evaluation/parent'].organization && evaluatorCheck(['ORGANIZATION_TYPE']) && currentLevel == 4)"
                  :icon="`${$store.getters['evaluation/parent'].answer ? 'el-icon-edit' : 'el-icon-plus'}`"
                  round
                  size="mini"
                  @click="mainDialogVisibleOpen($store.getters['evaluation/parent'], 'comment')"
                  class="right_icon custom_send_icon"
                  type="primary"
                  >{{ ($store.getters['evaluation/parent'].committee && currentLevel == 2) || ($store.getters['evaluation/parent'].organization && currentLevel == 4) ? $t('Global.edit') : $t('Global.addTo') }}
                </el-button>
               
              </template>
            </div>
          </CCardHeader>
          <div class="body">
            <div v-if="option">
              <MainQuestion :currentLevel="currentLevel" v-if="$store.getters['evaluation/parent'].init" :commentFrom="$t('Global.committee')" :committee="$store.getters['evaluation/parent'].committee" :level="$t('Global.init')" :report="$store.getters['evaluation/parent'].init"></MainQuestion>
              <MainQuestion
                :currentLevel="currentLevel"
                v-if="$store.getters['evaluation/parent'].team"
                :organizationFrom="$t('Global.organization_level')"
                :organization="$store.getters['evaluation/parent'].organization"
                :level="$t('Global.team_level')"
                :report="$store.getters['evaluation/parent'].team"
              ></MainQuestion>
              <MainQuestion final :currentLevel="currentLevel" v-if="$store.getters['evaluation/parent'].final" :level="$t('Global.final')" :report="$store.getters['evaluation/parent'].final"></MainQuestion>
              <MainQuestion director :currentLevel="currentLevel" v-if="$store.getters['evaluation/parent'].director" :level="$t('Global.director')" :report="$store.getters['evaluation/parent'].director"></MainQuestion>
            </div>
            <div v-else>
              <MainQuestion
                v-if="$store.getters['evaluation/parent'].answer"
                :currentLevel="currentLevel"
                :level="$t(`Global.approvals_status_${currentLevel == 2 || currentLevel == 4 ? currentLevel - 1 : currentLevel}`)"
                :report="$store.getters['evaluation/parent'].answer"
                :commentFrom="$t(`Global.approvals_status_${2}`)"
                :organizationFrom="$t(`Global.approvals_status_${4}`)"
                :committee="$store.getters['evaluation/parent'].committee"
                :organization="$store.getters['evaluation/parent'].organization"
                @mainDialogVisibleOpen="mainDialogVisibleOpen"
                currentAnswer
              ></MainQuestion>
            </div>
          </div>
        </CCardBody>
      </CCard>
      <div v-if="$store.state.evaluation.pages" style="z-index: 999" class="justify-content-between w-100 px-1 py-3 d-flex position-relative">
        <el-button v-if="$store.state.evaluation.pages.next" icon="el-icon-arrow-right" round size="mini" @click="next($store.state.evaluation.pages.next)" class="custom_send_icon" type="primary"> {{ $t('Global.next') }} </el-button>
        <el-button v-else round size="mini" icon="el-icon-arrow-right" class="border-dark disabled disabled_color custom_send_icon" type="primary">
          {{ $t('Global.next') }}
        </el-button>
        <el-button icon="el-icon-arrow-left" v-if="$store.state.evaluation.pages.prev" round size="mini" @click="next($store.state.evaluation.pages.prev)" class="right_icon custom_send_icon" type="primary">{{ $t('Global.prev') }} </el-button>
        <el-button v-else icon="el-icon-arrow-left" round size="mini" class="border-dark disabled disabled_color right_icon custom_send_icon" type="primary">{{ $t('Global.prev') }} </el-button>
      </div>
      <el-dialog :title="title" :visible.sync="questionsDialogVisible" class="p-0" width="80%">
        <CCardBody dir="rtl" style="text-align: initial" class="p-0">
          <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <CCol sm="12">
                <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                  <div class="mt-2 el-form-item__label">
                    <el-form-item prop="answer_id">
                      <el-radio-group size="mini" v-model="ruleForm.answer.answer_id">
                        <el-radio border :label="30">{{ $t('Global.agree') }}</el-radio>
                        <el-radio border :label="31" class="mx-1">{{ $t('Global.midagree') }} </el-radio>
                        <el-radio border :label="32" class="mx-1">{{ $t('Global.disagree') }} </el-radio>
                        <el-radio border :label="33">{{ $t('Global.disApply') }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                  <div class="reviewHeard" style="text-align: initial">
                    <el-form-item :rules="validation(false, 'textarea')" :label="$t('Global.report')" prop="answer.report" class="custom_area">
                      <!-- <page api-key="5134dsngirrl0brc1i314hwj587bk140g03tif8xq86wb1n7" v-model="ruleForm.answer.report" :init="init_ar" /> -->
                      <el-input autosize resize="none" type="textarea" v-model="ruleForm.answer.report"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </CCol>
            </CRow>
          </el-form>
        </CCardBody>

        <CCardFooter>
          <div class="baseButton" :class="saveLoading ? 'disabledAll' : ''">
            <button @click="save(2, id, i, i + 2)" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              <CSpinner v-if="saveLoading" color="default" size="sm" />
              {{ $t('Global.submit') }}
            </button>
          </div>
        </CCardFooter>
      </el-dialog>
      <el-dialog :title="mainTitle" :visible.sync="mainDialogVisible" width="70%">
        <div class="body">
          <div v-if="(currentLevel == 6 && hasPermission('decision_approval')) || (!option && evaluatorCheck(['TEAM_TYPE'])) || (hasPermission('report_update') && (currentLevel != 4 || currentLevel != 2))" class="radio_options d-flex">
            <el-radio-group size="mini" v-model="mainAnswer">
              <el-radio border :label="30">{{ $t('Global.agree') }}</el-radio>
              <el-radio border :label="31" class="mx-1">{{ $t('Global.midagree') }}</el-radio>
              <el-radio border :label="32" class="mx-1">{{ $t('Global.disagree') }}</el-radio>
              <el-radio border :label="33">{{ $t('Global.disApply') }}</el-radio>
            </el-radio-group>
          </div>
          <div v-else class="radio_options d-flex mr-2">
            <el-radio-group size="mini" v-model="mainAnswerAccept">
              <el-radio border :label="1">{{ $t('Global.ok') }}</el-radio>
              <el-radio border :label="0" class="mx-1">{{ $t('Global.notOk') }}</el-radio>
            </el-radio-group>
          </div>
          <div v-if="(currentLevel == 6 && hasPermission('decision_approval')) || (!option && evaluatorCheck(['TEAM_TYPE'])) || (hasPermission('report_update') && (currentLevel != 4 || currentLevel != 2))" class="comments rounded border-bottom-0 px-2">
            <el-form :model="mainForm" label-position="top" status-icon size="large" ref="mainForm" label-width="120px" class="demo-ruleForm text-initial">
              <span class="mb-4 font-weight-bold text-muted">{{ $t('Global.justifications') }}</span>
              <div class="reviewHeard mt-2" style="text-align: initial">
                <el-form-item prop="comment" class="custom_area">
                  <el-input autosize v-model="mainForm.comment" resize="none" type="textarea"></el-input>
                </el-form-item>
              </div>
              <span class="mb-4 font-weight-bold text-muted">{{ $t('Global.comment') }}</span>
              <div class="reviewHeard mt-2" style="text-align: initial">
                <el-form-item prop="Justifications" class="custom_area">
                  <el-input autosize v-model="mainForm.Justifications" resize="none" type="textarea"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div v-else class="comments rounded border-bottom-0 px-2">
            <el-form :model="mainForm" label-position="top" status-icon size="large" ref="mainForm" label-width="120px" class="demo-ruleForm text-initial">
              <span class="mb-4 font-weight-bold text-muted">{{ $t('Global.replay') }}</span>
              <div class="reviewHeard mt-2" style="text-align: initial">
                <el-form-item prop="comment" class="custom_area">
                  <el-input autosize v-model="mainForm.comment" resize="none" type="textarea"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="baseButton" :class="saveLoading ? 'disabledAll' : ''">
            <button @click="save(1, id, evaluatorCheck(['TEAM_TYPE']) || hasPermission('report_update') || hasPermission('decision_approval') ? 'main' : 'comment')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              <CSpinner v-if="saveLoading" color="default" size="sm" />
              {{ $t('Global.submit') }}
            </button>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="كتابة ملاحظة" :visible.sync="dialogVisible" width="80%">
        <div>
          <el-form :model="ruleForm.comment" label-position="top" status-icon size="large" ref="ruleForm" label-width="120px" class="stateForm demo-ruleForm">
            <CRow>
              <!-- <div class="datePicker el-form-item el-form-item--feedback el-form-item--small"> -->
              <div class="mt-2 el-form-item__label" v-if="!reportType">
                <el-radio-group size="mini" v-model="ruleForm.comment.accept" class="ml-2 mr-3">
                  <el-radio border :label="1">{{ $t('Global.ok') }}</el-radio>
                  <el-radio border :label="0" class="mx-1">{{ $t('Global.notOk') }}</el-radio>
                </el-radio-group>
              </div>

              <el-form-item v-if="!reportType" class="custom_area" style="width: 100%" prop="report">
                <el-input spellcheck="true" autosize resize="none" class="textarea" type="textarea" placeholder=" اكتب تعليق " v-model="ruleForm.comment.report"></el-input>
              </el-form-item>

              <el-form-item v-if="reportType == 'comment'" class="custom_area" style="width: 100%" prop="comment">
                <el-input spellcheck="true" autosize resize="none" class="textarea" type="textarea" placeholder=" اكتب تعليق " v-model="ruleForm.comment.comment"></el-input>
              </el-form-item>

              <el-form-item v-if="reportType == 'Justifications'" class="custom_area" style="width: 100%" prop="Justifications">
                <el-input spellcheck="true" autosize resize="none" class="textarea" type="textarea" placeholder=" اكتب تعليق " v-model="ruleForm.comment.Justifications"></el-input>
              </el-form-item>
              <el-form-item v-if="reportType == 'feedback'" class="custom_area" style="width: 100%" prop="feedback">
                <el-input spellcheck="true" autosize resize="none" class="textarea" type="textarea" placeholder=" اكتب تعليق " v-model="ruleForm.comment.feedback"></el-input>
              </el-form-item>
              <!-- </div> -->
            </CRow>
          </el-form>
          <span slot="footer" class="dialog-footer" style="display: flex">
            <el-button icon="el-icon-chat-round" @click="save(reportType ? 4 : 3, id)" round size="mini" class="mx-1 right_icon" type="primary"> {{ reportType ? $t('Global.submitFile') : $t('Global.submit') }}</el-button>
            <el-button
              class="ml-1 mr-1"
              @click="
                dialogVisible = false;
                reportType = false;
              "
              round
              size="small"
              >الغاء</el-button
            >
          </span>
        </div>
      </el-dialog>
    </CRow>
  </div>
</template>
<script>
import MainQuestion from '../../../components/MainQuestion';
import report from '../../../components/report';
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'submissionEdit',
  components: { report, MainQuestion, page: Editor },
  data() {
    return {
      init_ar: {
        menubar: false,
        height: 200,
        font_formats:
          'Cairo=Cairo; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
        content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px;color:black !important }`,
        convert_urls: false,
        relative_urls: false,
        paste_block_drop: false,
        paste_word_valid_elements: 'b,strong,i,em,h1,h2',
        paste_as_text: true,
        remove_script_host: true,
        automatic_uploads: true,
        directionality: 'rtl',
        language: 'ar',
        spellchecker_languages: 'English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr_FR,' + 'German=de,Italian=it,Polish=pl,Portuguese=pt_BR,Spanish=es,Swedish=sv',
        toolbar: 'spellchecker bold italic underline strikethrough ',
        plugins: ['spellchecker paste directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount  imagetools  textpattern help code'],
        setup: this.setup,
      },
      afterRender: false,
      questionsDialogVisible: false,
      mainDialogVisible: false,
      activeName: 1,
      active: false,
      reportType: false,
      saveLoading: false,
      dialogVisible: false,
      type: null,
      reCompare: false,
      title: '',
      ruleForm: {
        report: [],
        answer: {
          answer_id: 30,
          Justifications: '',
          ar_name: '',
          comment: '',
          accept: 1,
          feedback: '',
          posted_at: '',
          report: '',
          id: '',
        },
        comment: {
          answer_id: 30,
          Justifications: '',
          ar_name: '',
          comment: '',
          accept: 1,
          feedback: '',
          posted_at: '',
          report: '',
          id: '',
        },
      },
      mainForm: {
        comment: '',
        Justifications: '',
      },
      mainTitle: '',
      content: '',
      //   answer: [],
      mainAnswer: '',
      mainAnswerAccept: '',
      loading: false,
      option: false,
    };
  },
  destroyed() {
    this.$store.commit('evaluation/SET_STATISTICS', null);
  },
  computed: {
    status() {
      return this.$store.getters['evaluation/editStatistics'];
    },
    currentLevel() {
      if (this.getType() == 1) {
        return 1;
      } else {
        return this.$store.state.submission.last_alert ? this.$store.state.submission.last_alert.actual_level : 0;
      }
    },
    preLevel() {
      if (this.getType() == 1) {
        return 1;
      } else {
        return this.$store.state.submission.last_alert ? this.$store.state.submission.last_alert.level : 0;
      }
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    next(num) {
      this.$router.push(`/higher/submissions/submission/reports/edit/${this.$route.params.evaluation_id}/${num}`.toString());
    },
    checkAnswer(){
      if(this.$store.getters['evaluation/parent'].answer == null)
      {
        return false;
      }else{
        return true;
      }
    },
    mainDialogVisibleOpen(mainQuestion, type) {
      this.mainAnswer = 30;
      this.mainAnswerAccept = 1;
      this.mainForm.comment = '';
      this.mainForm.Justifications = '';
      (this.mainForm.accept = 1), (this.mainTitle = mainQuestion.title);
      if (mainQuestion.committee && this.currentLevel == 2) {
        this.id = mainQuestion.id;
        this.mainAnswer = mainQuestion.answer.answer_id;
        this.mainAnswerAccept = mainQuestion.committee.accept == null || mainQuestion.committee.accept == 0 ? 0 : 1;
        this.mainForm.comment = mainQuestion.committee.comment;
        this.mainForm.Justifications = mainQuestion.committee.Justifications;
      } else if (mainQuestion.organization && this.currentLevel == 4) {
        this.id = mainQuestion.id;
        this.mainAnswer = mainQuestion.answer.answer_id;
        this.mainAnswerAccept = mainQuestion.organization.accept == null || mainQuestion.organization.accept == 0 ? 0 : 1;
        this.mainForm.comment = mainQuestion.organization.comment;
        this.mainForm.Justifications = mainQuestion.organization.Justifications;
      } else if (mainQuestion.answer) {
        if (type == 'comment') {
          this.id = mainQuestion.id;
          if (this.currentLevel >= 4) {
            if (this.$store.getters['evaluation/evaluator'] === this.evConstants('ORGANIZATION_TYPE')) {
              this.mainForm.comment = '';
            }
          }
          this.mainAnswer = mainQuestion.answer.answer_id;
          this.mainAnswerAccept = mainQuestion.answer.accept == null || mainQuestion.answer.accept == 0 ? 0 : 1;
        } else {
          this.id = mainQuestion.id;
          this.mainAnswer = mainQuestion.answer.answer_id;
          this.mainAnswerAccept = mainQuestion.answer.accept == null || mainQuestion.answer.accept == 0 ? 0 : 1;
          this.mainForm.comment = mainQuestion.answer.Justifications;
          this.mainForm.Justifications = mainQuestion.answer.comment;
        }
      }
      this.mainDialogVisible = true;
    },
    getQuestionData(question) {
      this.ruleForm.answer = {
        answer_id: 30,
        Justifications: '',
        ar_name: '',
        comment: '',
        accept: 1,
        feedback: '',
        posted_at: '',
        report: '',
        id: '',
      };
      this.ruleForm.comment = {
        answer_id: 30,
        Justifications: '',
        ar_name: '',
        comment: '',
        accept: 1,
        feedback: '',
        posted_at: '',
        report: '',
        id: '',
      };
      if (question.answer) {
        this.ruleForm.answer.answer_id = question.answer.answer_id;
        this.ruleForm.answer.report = question.answer.report;
        // this.ruleForm.comment = question.committee;
        // this.ruleForm.organization = question.organization;
      }
      this.id = question.id;
      this.title = question.title;
      this.questionsDialogVisible = true;
    },
    save(type, id, questionNum, collapseNum) {
    
      this.saveLoading = true;
      let query;
      if (type == 1) {
        if (questionNum == 'comment') {
          query = {
            question_id: id,
            accept: this.mainAnswerAccept,
            comment: this.mainForm.comment,
          };
        } else if (questionNum == 'Justifications') {
          query = {
            question_id: id,
            accept: this.mainAnswerAccept,
            Justifications: this.mainForm.Justifications,
          };
        } else {
          query = {
            question_id: this.$route.params.id,
            answer_id: this.mainAnswer,
            comment: this.mainForm.Justifications,
            Justifications: this.mainForm.comment,
          };
        }
      } else if (type == 2) {
        return this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            query = {
              question_id: id,
              answer_id: this.ruleForm.answer.answer_id,
              report: this.ruleForm.answer.report,
            };
            this.mainDialogVisible = false;
            this.dialogVisible = false;
            this.questionsDialogVisible = false;
            this.$store
              .dispatch('evaluation/saveEvaluation', {
                query: query,
                evaluation_id: this.$route.params.evaluation_id,
              })
              .then(() => {
                this.$notify({ type: 'success', message: this.$t('Global.successMessage') });
                this.saveLoading = false;
                this.init();
              });
          } else {
            this.saveLoading = false;
            return false;
          }
        });
      } else if (type == 3) {
        query = {
          question_id: id,
          accept: this.ruleForm.comment.accept,
          report: this.ruleForm.comment.report,
          answer_id: null,
        };
      } else if (type == 4) {
        if (this.reportType == 'comment') {
          query = {
            question_id: id,
            comment: this.ruleForm.comment.comment,
          };
        } else if (this.reportType == 'Justifications') {
          query = {
            question_id: id,
            Justifications: this.ruleForm.comment.Justifications,
          };
        } else if (this.reportType == 'feedback') {
          query = {
            question_id: id,
            feedback: this.ruleForm.comment.feedback,
          };
        }
      }
      this.mainDialogVisible = false;
      this.dialogVisible = false;
      this.questionsDialogVisible = false;
      this.$store
        .dispatch('evaluation/saveEvaluation', {
          query: query,
          evaluation_id: this.$route.params.evaluation_id,
        })
        .then(() => {
          this.$notify({ type: 'success', message: this.$t('Global.successMessage') });
          this.saveLoading = false;
          this.init();
        });
    },
    openDialog(data, type = 'any') {
      if (type == 'comment') {
        this.reportType = type;
        this.ruleForm.comment = {
          Justifications: '',
          ar_name: '',
          comment: data.answer.comment,
          feedback: '',
          posted_at: '',
          report: '',
          id: '',
        };
      } else if (type == 'Justifications') {
        this.reportType = type;
        this.ruleForm.comment = {
          Justifications: data.answer.Justifications,
          ar_name: '',
          posted_at: '',
          report: '',
          id: '',
        };
      } else if (type == 'feedback') {
        this.reportType = type;
        this.ruleForm.comment = {
          ar_name: '',
          feedback: data.answer.feedback,
          posted_at: '',
          report: '',
          id: '',
        };
      } else {
        this.ruleForm.comment = {
          answer_id: 30,
          accept: 1,
          Justifications: '',
          ar_name: '',
          comment: '',
          feedback: '',
          posted_at: '',
          report: '',
          id: '',
        };
      }
      this.id = data.id;
      if (data.organization) {
        this.ruleForm.comment.accept = data.organization.accept;
        this.ruleForm.comment.report = data.organization.report;
      } else if (data.committee && this.currentLevel != 4) {
        this.ruleForm.comment.accept = data.committee.accept;
        this.ruleForm.comment.report = data.committee.report;
      }
      this.dialogVisible = true;
    },
    scrollToId() {
      var el = window.location.href.split('/?')[0];
      if (el) {
        var id = el.split('#')[1];
      }
      var index = this.$store.getters['evaluation/questions'].findIndex(ask => ask.id == id);
      if (index && id) {
        this.activeName = index + 1;
      }
      setTimeout(() => {
        if (el) {
          document.getElementById(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }, 500);
    },
    init() {
      this.loading = true;
      if (this.$route.params.evaluation_id && this.$route.params.id) {
        this.$store
          .dispatch('evaluation/getEvaluation', {
            evaluation_id: this.$route.params.evaluation_id,
            question_id: this.$route.params.id,
          })
          .then(() => {
            this.afterRender = true;
            this.loading = false;
            this.scrollToId();
            this.$store.commit('set', ['showProgress', true]);
          });
      }
    },
  },
};
</script>

<style lang="scss">
.el-radio.is-bordered {
  border-radius: 30px !important;
}

.el-textarea {
  textarea {
    min-height: 100px !important;
  }
}

@media screen and (max-width: 1270px) {
  body .mystyle {
    display: none !important;
  }
}

body.en .mystyle {
  left: unset;
  right: 3rem;
}

body .mystyle {
  width: 40% !important;
  position: fixed;
  z-index: 1;
  top: 54px;
  left: 0;
  box-shadow: none !important;
  background: transparent;
  border: 0 !important;

  .c-callout {
    font-size: 10px;
    padding: 1rem 0rem !important;
    background: transparent;
    box-shadow: none !important;
    direction: rtl;
  }

  &:hover {
    box-shadow: none !important;
  }

  .report_progress {
    border: 0 !important;

    .el-progress-circle {
      width: 20px !important;
      height: 20px !important;
    }

    .el-progress__text {
      i {
        display: none;
      }

      font-size: 8px;
    }

    .c-callout {
      border: none;
      padding: 1rem;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
    }
  }
}

.text-initial {
  text-align: initial;
}

.radio_options {
  .el-radio:first-child {
    margin: 0;
  }

  span.el-radio__input {
    margin: 0 0.3rem;
  }
}

.el-dialog__title {
  text-align: initial !important;
}

.custom_collapse {
  .card-header {
    background-color: transparent;
    padding: 0 0.5rem 0 0;
  }

  .card-header-actions {
    text-align: initial !important;
  }

  .el-collapse-item__header {
    display: flex;
    line-height: 20px;
    // justify-content: space-between;
  }

  .el-collapse-item__arrow {
    margin: 0;
    padding: 0 1rem;
  }

  header {
    padding: 0 1.5rem;
    margin-bottom: 0;
    border-bottom: none;
  }
}

.el-form-item__label {
  .el-radio__inner {
    margin: 0 0.4rem;
  }

  .el-radio:first-child {
    margin: 0;
  }
}

.custom_comment {
  .adminReply {
    display: flex;
  }

  .reply_body {
    flex-grow: 1;
    margin-right: 0.5rem;
    min-height: 100px;
    display: block !important;
    background-color: #e4e7ed;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }

  .textArea_comment {
    position: relative;

    .custom_send_icon {
      position: absolute;
      top: 7px;
      left: 0.1rem;
    }

    .el-textarea {
      margin-right: 5rem;
      width: 93%;

      textarea {
        border-radius: 30px;
      }
    }
  }
}

.card-footer {
  border: 0;
}

.no_shadow {
  .card {
    box-shadow: none !important;
  }

  .el-collapse {
    border: 1px solid #ebeef5;
  }
}
</style>
