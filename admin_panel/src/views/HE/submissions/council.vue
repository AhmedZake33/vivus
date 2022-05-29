<template>
  <div>
    <CRow>
      <CCol md="7">
        <Show :loading="$store.getters['evaluation/evaluationsLoad']" icon="el-icon-message" :items="$store.getters['evaluation/submission']" except="team" @init="init" :name="$t('Global.order')">
          <template #show_action>
            <a :href="`${baseUrl}submissions/evaluation/final/${$route.params.id}`" target="_blank">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.print_report') }}
            </a>
          </template>
          <template #show_status>
            <router-link v-if="$store.state.evaluation.submission" :to="{ path: $store.state.evaluation.submission.id ? `/higher/submissions/submission/${$store.state.evaluation.submission.id}/${$route.params.id}` : '' }">
              {{ $store.state.evaluation.submission.name }} - {{ $store.state.evaluation.submission.university }}
            </router-link>
            <CBadge color="success" v-if="$store.state.evaluation.submission && $store.state.evaluation.submission.decision">
              {{ $store.state.evaluation.submission.decision.name }}
            </CBadge>
            <CBadge color="info" v-if="$store.state.evaluation.submission && $store.state.evaluation.submission.temp_decision && !$store.state.evaluation.submission.decision"> {{ $t('Global.tempDecision') }} - {{ $store.state.evaluation.submission.temp_decision.name }} </CBadge>
          </template>
          <template #other_data>
            <tr v-if="$store.getters['evaluation/submission']">
              <th scope="row" width="20%">{{ $t('Global.organization') }}</th>
              <td width="80%">
                <router-link v-if="$store.state.evaluation.submission" :to="{ path: $store.state.evaluation.submission.organization_id ? `/higher/organization/${$store.state.evaluation.submission.organization_id}` : '' }">
                  {{
                    $store.state.evaluation.submission.name
                      ? `${$store.state.evaluation.submission.name} -
                                    ${$store.state.evaluation.submission.university}`
                      : $store.state.evaluation.submission.temp_organization_name
                      ? $store.state.evaluation.submission.temp_organization_name
                      : ''
                  }}
                </router-link>
              </td>
            </tr>
          </template>
          <template #bottom_other_data>
            <tr v-if="$store.state.evaluation.submission && $store.state.evaluation.submission.team">
              <th scope="row" width="20%">{{ $t('Global.team') }}</th>
              <td width="80%">
                <span>
                  <div class="d-inline-flex" v-for="member in $store.state.evaluation.submission.team.all_members">
                    {{ member.job }} :<router-link class="mx-2" v-if="member.user_id" :to="{ path: `/users/${member.user_id}` }">({{ member.ar_name }})</router-link> ,
                  </div>
                </span>
              </td>
            </tr>
          </template>
        </Show>
      </CCol>
      <CCol md="5">
        <CCard>
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
              {{ $t('Global.statistics') }}
            </div>

            <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''">
              <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                <div style="display: flex; justify-content: flex-end; align-items: center">
                  <el-button @click="openDialog($store.state.evaluation.submission.temp_decision)" :class="isLoad ? 'disabledAll' : ''" round size="mini" class="mx-1 right_icon print_hide" type="success">
                    <i class="el-icon-circle-plus"></i>
                    {{ $store.state.evaluation.submission && $store.state.evaluation.submission.temp_decision ? $t('Global.edittempDesicion') : $t('Global.taketempDesicion') }}
                  </el-button>
                </div>
              </template>
            </div>
          </CCardHeader>
          <CCardBody>
            <CChartDoughnut :datasets="datasets" :labels="labels" />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CCard v-loading="$store.getters['evaluation/evaluationsLoad']" v-if="$store.getters['evaluation/questions'] && $store.state.evaluation.question">
      <CCardHeader>
        <div class="d-flex justify-content-between" v-if="$store.state.evaluation.pages">
          <el-button style="height: max-content" v-if="$store.state.evaluation.pages.next" icon="el-icon-arrow-right" round size="mini" @click="next($store.state.evaluation.pages.next)" class="custom_send_icon" type="primary"> {{ $t('Global.next') }} </el-button>
          <el-button style="height: max-content" v-else round size="mini" icon="el-icon-arrow-right" class="border-dark disabled disabled_color custom_send_icon" type="primary">
            {{ $t('Global.next') }}
          </el-button>
          <div class="d-flex">
            <span class="font-weight-bolder">
              <router-link target="_blank" :to="`/higher/submissions/submission/reports/edit/${$route.params.id}/${$store.state.evaluation.question.id}`">
                {{ $store.state.evaluation.question ? $store.state.evaluation.question.title : ' - ' }}
                <CBadge :color="getAnswer($store.state.evaluation.question.answer_id).type" class="align-self-center badge-pill">{{ getAnswer($store.state.evaluation.question.answer_id).name }} </CBadge>
              </router-link>
            </span>
          </div>

          <el-button style="height: max-content" icon="el-icon-arrow-left" v-if="$store.state.evaluation.pages.prev" round size="mini" @click="next($store.state.evaluation.pages.prev)" class="right_icon custom_send_icon" type="primary">{{ $t('Global.prev') }} </el-button>
          <el-button style="height: max-content" v-else icon="el-icon-arrow-left" round size="mini" class="border-dark disabled disabled_color right_icon custom_send_icon" type="primary">{{ $t('Global.prev') }} </el-button>
        </div>
        <CRow> </CRow>
      </CCardHeader>
      <CCardBody>
        <div class="report_style flex-column mb-1" v-if="$store.getters['evaluation/questions'] && $store.getters['evaluation/questions'].length != 0" v-for="question in $store.getters['evaluation/questions']">
          <div class="px-3 d-flex justify-content-between align-items-center">
            <span class="w-100 d-flex justify-content-between font-weight-bolder">
              <router-link target="_blank" :to="`/higher/submissions/submission/reports/edit/${$route.params.id}/${$store.state.evaluation.question.id}${question.id ? '#' + question.id : ''}`">
                <p class="mb-0 text-right">{{ question.title }}</p>
              </router-link>
              <div>
                <CBadge :color="getAnswer(question.answer_id).type" class="align-self-center badge-pill mt-1">{{ getAnswer(question.answer_id).name }} </CBadge>
                <!-- <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button> -->
              </div>
            </span>
          </div>
          <div class="mx-2 mt-2">
            <div class="flex-column report_style mb-2 pb-0" v-if="question.Justifications">
              <h6 class="mb-0 text-initial p-2 d-block w-100">{{ $t('Global.Justifications') }} :</h6>
              <div style="border-radius: 15px; background: #c3c3c3; width: 95%" class="d-flex mt-1 mx-3">
                <p class="mb-0 text-initial px-2" style="word-break: break-word" v-html="ntBr(question.Justifications)"></p>
              </div>
            </div>
            <div class="flex-column report_style mb-2 pb-0" v-if="question.feedback">
              <h6 class="mb-0 text-initial p-2 mx-3">{{ $t('Global.state_0') + ' ' + $t('Global.visitorTeam') }} :</h6>
              <div style="border-radius: 15px; background: #91c3dc; width: 95%" class="d-flex mt-1 mx-5">
                <p class="mb-0 text-initial px-1" style="word-break: break-word" v-html="ntBr(question.feedback)"></p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="$store.getters['evaluation/questions'] && $store.getters['evaluation/questions'].length == 0" class="text-center">{{ $t('Global.noComments') }}</div>
      </CCardBody>
    </CCard>
    <el-dialog :title="$t('Global.taketempDesicion')" :visible.sync="dialogVisible" width="50%">
      <el-form label-position="top" :model="form" status-icon size="large" ref="form" label-width="120px" class="stateForm demo-ruleForm">
        <CRow>
          <el-form-item :rules="validation(false, 'textarea')" style="width: 100%" class="px-3 mb-0" prop="type">
            <el-select :no-data-text="$t('Global.nodata')" v-model="form.type" ref="type" :placeholder="$t('Global.decision')" style="width: 100%">
              <el-option v-for="item in decisions" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
        </CRow>
      </el-form>
      <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
        <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
          <el-button @click="saveInitDecision('form')" round size="mini" class="mx-1 right_icon" type="primary">{{ $t('Global.takeDesicion') }}</el-button>
          <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">
            {{ $t('Global.discard') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Show from '../../components/Show';
import { CChartDoughnut } from '@coreui/vue-chartjs';

export default {
  name: 'council',
  components: { Show, CChartDoughnut },
  data() {
    return {
      isLoad: false,
      dialogVisible: false,
      baseUrl: process.env.VUE_APP_BASE_URL,
      form: {
        type: null,
      },
    };
  },
  computed: {
    visitType() {
      return this.$store.state.evaluation.submission ? this.$store.state.evaluation.submission.visit_type_id : '';
    },
    decisions() {
      if (this.visitType != 3) {
        return this.$store.getters['evaluation/decisions'] ? this.$store.getters['evaluation/decisions'] : '';
      } else {
        let filtered = this.$store.getters['evaluation/decisions'].filter(de => de.id == 8);
        return filtered ? filtered : '';
      }
    },
    datasets() {
      if (this.$store.state.evaluation.statistics) {
        return [
          {
            backgroundColor: Array.from(this.$store.state.evaluation.statistics, el => this.getAnswer(el.label).color),
            data: Array.from(this.$store.state.evaluation.statistics, el => el.count),
          },
        ];
      }
    },
    labels() {
      if (this.$store.state.evaluation.statistics) {
        return Array.from(this.$store.state.evaluation.statistics, el => this.getAnswer(el.label).name);
      }
    },
  },
  methods: {
    next(id) {
      let query = { question_id: id };
      this.$store.dispatch('evaluation/getCouncil', { id: this.$route.params.id, query });
    },
    openDialog(decision) {
      if (decision) {
        this.form.type = decision.id;
      }
      this.dialogVisible = true;
    },
    saveInitDecision(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('evaluation/initDecision', { id: this.$route.params.id, query: this.form }).then(_ => {
            this.init();
            this.$notify({ type: 'success', message: this.$t('Global.successMessage') });
            this.dialogVisible = false;
          });
        }
      });
    },
    init() {
      this.$store.dispatch('evaluation/getCouncil', { id: this.$route.params.id });
    },
  },
};
</script>

<style scoped>
.docs_header > span {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 5px 15px;
  font-size: 16px;
  width: 100%;
  text-align: initial;
  margin-bottom: 0.5rem;
  font-weight: bolder;
  background-color: #eee;
  border-radius: 30px;
}
</style>
