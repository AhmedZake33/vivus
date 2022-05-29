<template>
  <div v-if="$store.state.submission.last_alert || planAlert">
    <span v-if="$store.state.course.coursesLoad || trainer"></span>
    <CCard v-else-if="!plan && showAction && [showConstants('string', 'DEFUALT_APPROVAL')].includes($store.state.submission.last_alert.show_type)">
      <CCardHeader style="display: flex; align-items: center">
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions center' : 'center'" style="display: inline-block; font-weight: bold">
          <i class="el-icon-setting"></i>
          <span class="mx-3">{{ $t('Global.Settings') }}</span>
        </div>
      </CCardHeader>
      <CCardBody :class="$store.getters['submission/name'] && !$store.getters['submission/name'].name ? 'disabledAll' : ''">
        <div :class="$store.state.submission.orgActive ? 'disabledAll' : ''" class="d-lg-flex justify-content-lg-between">
          <div class="d-flex my-1" v-if="lastAlert">
            <span class="text-initial">{{ lastAlert.task_message }}</span>
          </div>
          <div class="d-flex" v-loading="$store.state.course.coursesLoad">
            <div :class="isLoad ? 'disabledAll' : ''" class="d-flex w-100 flex-wrap flex_gap" id="hasChildf">
              <div id="action1" :class="isLoad ? 'disabledAll' : ''" class="right">
                <el-button v-if="$store.state.submission.last_alert && $store.state.submission.last_alert.allow_update != updateConstants('string', 'TAKE_DECISION')" icon="el-icon-check" @click="handleAccept()" round size="mini" class="mx-1 right_icon" type="success">
                  {{ $t('Global.accept') }}
                </el-button>
                <el-button v-if="$store.state.submission.last_alert && $store.state.submission.last_alert.allow_update == updateConstants('string', 'TAKE_DECISION')" icon="el-icon-check" @click="openDesicionDialog('add')" round size="mini" class="mx-1 right_icon" type="success">
                  <template>
                    {{ $t('Global.ensureAndEvalute') }}
                  </template>
                </el-button>

                <el-button icon="el-icon-close" v-if="$store.state.submission.last_alert && $store.state.submission.last_alert.allow_update != updateConstants('string', 'TAKE_DECISION')" @click="dialogOpen(false, 1)" round size="mini" class="mx-1 right_icon" type="danger">
                  {{ $t('Global.refuse') }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
    </CCard>

    <el-divider v-if="plan" class="my-1"></el-divider>
    <div class="d-flex my-1 w-100" v-if="hasPermission('admin_system') || (evaluatorCheck(['TRAINING_MANAGER_TYPE', 'COACH_TYPE'], 3) && planAlert)">
      <span class="text-center w-100" v-if="planAlert">{{ planAlert.alert_message }} {{ planAlert.message ? ': ' + planAlert.message : '' }}</span>
    </div>
    <div v-if="evaluatorCheck(['TRAINING_MANAGER_TYPE', 'COACH_TYPE'], 3) && plan && planAction && [showConstants('string', 'DEFUALT_APPROVAL')].includes(planAlert.show_type)" class="d-flex flex-column mt-2">
      <div class="d-flex justify-content-between w-100">
        <el-button v-if="planAlert && planAlert.allow_update != updateConstants('string', 'TAKE_DECISION')" icon="el-icon-check" @click="handleAccept()" round size="mini" class="mx-1 right_icon" type="success">
          {{ $t('Global.accept') }}
        </el-button>
        <el-button v-if="planAlert && planAlert.allow_update == updateConstants('string', 'TAKE_DECISION')" icon="el-icon-check" @click="openDesicionDialog('add')" round size="mini" class="mx-1 right_icon" type="success">
          <template>
            {{ $t('Global.ensureAndEvalute') }}
          </template>
        </el-button>

        <el-button icon="el-icon-close" v-if="planAlert && planAlert.allow_update != updateConstants('string', 'TAKE_DECISION')" @click="dialogOpen(false, 1)" round size="mini" class="mx-1 right_icon" type="danger">
          {{ $t('Global.refuse') }}
        </el-button>
      </div>
    </div>
    <el-dialog :title="$t('Global.writeNote')" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-form label-position="top" :model="form" :rules="rules" status-icon size="large" ref="form" label-width="120px" class="stateForm demo-ruleForm">
          <CRow>
            <el-form-item :rules="validation(false, 'textarea')" class="custom_area" style="width: 100%" prop="comment">
              <el-input id="comment" class="textarea" type="textarea" :placeholder="$t('Global.rejectReason')" v-model="form.comment"></el-input>
            </el-form-item>
          </CRow>
        </el-form>
        <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
          <el-button icon="el-icon-close" @click="sendReject('form')" round size="mini" class="mx-1 right_icon" type="danger">{{ $t('Global.accept') }}</el-button>
          <el-button
            class="ml-1 mr-1"
            @click="
              dialogVisible = false;
              ifComment = false;
              rejected = false;
            "
            round
            size="small"
            >{{ $t('Global.discard') }}</el-button
          >
        </span>
      </div>
    </el-dialog>

    <el-dialog append-to-body custom-class="body_dialog" width="60%" :title="$t(`Global.degrees`)" :visible.sync="dialogDecision">
      <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <CRow class="flex-row-reverse">
          <CCol lg="6" md="6" sm="12">
            <el-form-item :rules="validation(false, 'textarea')" prop="attend" :label="$t('Global.attend_time')">
              <el-input :placeholder="$t('Global.attend_time')" v-model="ruleForm.attend"></el-input>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="6" sm="12">
            <el-form-item :rules="validation(false, 'textarea')" prop="evaluation_plan" :label="$t('Global.evaluation_plan')">
              <el-input :placeholder="$t('Global.evaluation_plan')" v-model="ruleForm.evaluation_plan"></el-input>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="6" sm="12">
            <el-form-item :rules="validation(false, 'textarea')" prop="pre_exam" :label="$t('Global.pre_exam')">
              <el-input :placeholder="$t('Global.pre_exam')" v-model="ruleForm.pre_exam"></el-input>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="6" sm="12">
            <el-form-item :rules="validation(false, 'textarea')" prop="post_exam" :label="$t('Global.post_exam')">
              <el-input :placeholder="$t('Global.post_exam')" v-model="ruleForm.post_exam"></el-input>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="6" sm="12">
            <el-form-item :rules="validation(false, 'textarea')" prop="evaluation_trainer" :label="$t('Global.evaluation_trainer')">
              <el-input :placeholder="$t('Global.evaluation_trainer')" v-model="ruleForm.evaluation_trainer"></el-input>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="6" sm="12">
            <el-form-item :rules="validation(false, 'textarea')" prop="exam_degree" :label="$t('Global.exam_degree')">
              <el-input :placeholder="$t('Global.exam_degree')" v-model="ruleForm.exam_degree"></el-input>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="6" sm="12">
            <el-form-item :rules="validation(false, 'textarea')" prop="total" :label="$t('Global.total_deg')">
              <el-input :placeholder="$t('Global.total_deg')" v-model="ruleForm.total"></el-input>
            </el-form-item>
          </CCol>
        </CRow>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display: flex">
        <el-button @click="handleDecision()" round size="mini" class="mx-1 right_icon" type="primary"> {{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="dialogDecision = false" round size="small"> {{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { EventBus } from '../../../../main';
import upload from '../../../components/upload';

export default {
  components: { upload },
  props: { type: String, plan: Boolean, planAlert: Object, reservation_id: null },
  data() {
    return {
      isLoad: false,
      mandatoryFiles: [],
      rejected: true,
      show: true,
      dialogVisible: false,
      ifComment: false,
      ifRejected: false,
      isPresident: false,
      dialogDecision: false,
      editMode: false,
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
        attend: null,
        evaluation_plan: null,
        pre_exam: null,
        post_exam: null,
        evaluation_trainer: null,
        exam_degree: null,
        total: null,
      },
      form: {
        rejectReason: null,
        comment: null,
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
        comment: [
          {
            required: true,
            pattern: /^[^-\s][a-zA-Zا-ي0-9_\s-]+$/,
            message: 'من فضلك يجب كتابة الرساله',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    EventBus.$on('openTrDesicionDialog', data => {
      this.openDesicionDialog(data);
    });
  },
  computed: {
    id: function () {
      return this.reservation_id ? this.reservation_id : this.$route.params.id;
    },
    trainer: function () {
      if (this.$store.state.course.course && this.$store.state.course.course.scores) {
        return this.$store.state.course.course.scores;
      }
    },
    planAction: function () {
      if (this.planAlert && this.$store.state.evaluation.evaluator.includes(this.planAlert.evaluator_type)) {
        return true;
      }
      return false;
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
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
        return this.$store.state.submission.last_alert.show_type || false;
      }
      return false;
    },
  },
  watch: {
    'ruleForm.attend'(value) {
      if (!value);
      this.ruleForm.attend = value.toString().replace(/[^0-9\.?]/g, '');
    },
    'ruleForm.evaluation_plan'(value) {
      if (!value);
      this.ruleForm.evaluation_plan = value.toString().replace(/[^0-9\.?]/g, '');
    },
    'ruleForm.pre_exam'(value) {
      if (!value);
      this.ruleForm.pre_exam = value.toString().replace(/[^0-9\.?]/g, '');
    },
    'ruleForm.post_exam'(value) {
      if (!value);
      this.ruleForm.post_exam = value.toString().replace(/[^0-9\.?]/g, '');
    },
    'ruleForm.evaluation_trainer'(value) {
      if (!value);
      this.ruleForm.evaluation_trainer = value.toString().replace(/[^0-9\.?]/g, '');
    },
    'ruleForm.exam_degree'(value) {
      if (!value);
      this.ruleForm.exam_degree = value.toString().replace(/[^0-9\.?]/g, '');
    },
    'ruleForm.total'(value) {
      if (!value);
      this.ruleForm.total = value.toString().replace(/[^0-9\.?]/g, '');
    },
  },
  methods: {
    openDesicionDialog(mode) {
      this.dialogDecision = true;
      if (mode == 'edit') {
        this.editMode = true;
        this.ruleForm.attend = this.trainer ? this.trainer.attend : null;
        this.ruleForm.evaluation_plan = this.trainer ? this.trainer.evaluation_plan : null;
        this.ruleForm.pre_exam = this.trainer ? this.trainer.pre_exam : null;
        this.ruleForm.post_exam = this.trainer ? this.trainer.post_exam : null;
        this.ruleForm.evaluation_trainer = this.trainer ? this.trainer.evaluation_trainer : null;
        this.ruleForm.exam_degree = this.trainer ? this.trainer.exam_degree : null;
        this.ruleForm.total = this.trainer ? this.trainer.total : null;
      } else {
        this.editMode = false;
        this.ruleForm.attend = null;
        this.ruleForm.evaluation_plan = null;
        this.ruleForm.pre_exam = null;
        this.ruleForm.post_exam = null;
        this.ruleForm.evaluation_trainer = null;
        this.ruleForm.exam_degree = null;
        this.ruleForm.total = null;
      }
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`, true);
    },
    Refresh() {
      this.$emit('refresh');
      // this.$store.dispatch('submission/preSubmission', this.$route.params.id).then(() => {
      //   this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
      // });
    },
    dialogOpen(state, type = 0) {
      if (state) {
        this.ifComment = true;
        this.$nextTick(_ => {});
      } else {
        this.ifRejected = true;
        this.isPresident = type;
        this.$nextTick(_ => {});
      }
      this.dialogVisible = true;
    },
    openDecision() {
      this.dialogDecision = true;
    },
    handleDecision() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
            confirmButtonText: `${this.$t('Global.accept')}`,
            cancelButtonText: `${this.$t('Global.cancel')}`,
            type: 'success',
          }).then(_ => {
            let query = {
              ...this.ruleForm,
              status: this.constants('PRE_APPROVE_STATUS'),
            };
            this.dialogDecision = false;
            this.isLoad = true;
            this.$store.commit('archive/SET_GENERAL_LOAD', true);

            this.$store
              .dispatch('notes/preChangeSubState', {
                id: this.id,
                query: query,
              })
              .then(() => {
                this.$notify({
                  type: 'success',
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.Refresh();
              });
          });
        }
      });
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
          system = 3;

          this.$store
            .dispatch('notes/preChangeSubState', {
              id: this.id,
              system: system,
              query: query,
            })
            .then(() => {
              this.$notify.success({ message: `${this.$t('Global.sendRejectMessage')}` });
              this.dialogVisible = false;
              this.Refresh();
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
          system = 3;
          this.$store
            .dispatch('notes/preChangeSubState', {
              id: this.id,
              system: system,
              query: query,
            })
            .then(() => {
              this.$notify({
                type: 'success',
                message: `${this.$t('Global.successMessage')}`,
              });
              this.Refresh();
            });
        })
        .catch(_ => {
          this.isLoad = false;
        });
    },
  },
};
</script>

<style lang="scss">
.flex_gap {
  gap: 0.3rem;
}

#hasChildf:empty {
  display: none;
}
</style>
