<template>
    <div>
        <span v-if="$store.state.submission.last_alert && !$store.state.evaluationNotes.complete && [showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type)"></span>
        <CCard
                v-if="
        showAction &&
        (($store.getters['submission/decision'] && $store.state.submission.decision.removed != 0 && evaluatorCheck(['MANAGER_ACCREDITATION_TYPE', 'ACCREDITATION_TYPE'])) || (!$store.getters['submission/decision'] )) &&
        [showConstants('string', 'LEADER_APPROVAL'), showConstants('string', 'DEFUALT_APPROVAL'), showConstants('string', 'REPORT_APPROVAL'), showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE')].includes($store.state.submission.last_alert.show_type)
      "
        >
            <CCardHeader style="display: flex; align-items: center">
                <div :class="$i18n.locale === 'ar' ? 'card-header-actions center' : 'center'"
                     style="display: inline-block; font-weight: bold">
                    <i class="el-icon-setting"></i>
                    <span class="mx-3">{{ $t('Global.Settings') }}</span>
                </div>
            </CCardHeader>
            <CCardBody
                    :class="$store.getters['submission/name'] && !$store.getters['submission/name'].name ? 'disabledAll' : ''">
                <div :class="$store.state.submission.orgActive ? 'disabledAll' : ''"
                     v-if="!($store.state.submission.last_alert.show_type == showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'))"
                     class="d-lg-flex justify-content-lg-between">
                    <div class="d-flex my-1 flex-wrap" v-if="lastAlert">
                        <span class="text-initial">{{ lastAlert.task_message }}</span>
                        <span v-if="lastAlert.message && (!evaluatorCheck(['TEAM_TYPE', 'ORGANIZATION_TYPE']) || showAction || isAuthUser(lastAlert.user_id))"
                              v-html="'( ' + ntBr(lastAlert.message) + ' )'"></span>
                    </div>
                    <div class="d-flex" v-loading="$store.state.archive.generalLoad">
                        <div :class="isLoad ? 'disabledAll' : ''" class="d-flex w-100 flex-wrap flex_gap"
                             id="hasChildf">
                            <div id="action1" :class="isLoad ? 'disabledAll' : ''" class="right">
                                <small v-if="showType == showConstants('string', 'LEADER_APPROVAL')"
                                       class="small text-muted align-content-center">
                                    <vue-countdown class="small text-muted mb-0" v-if="time" :time="time"
                                                   :interval="100" v-slot="{ days, hours, minutes, seconds }">
                                        {{ $t('Global.remainingVisitTime') }}：{{ days }} {{ $t('Global.days') }}, {{
                                        hours }} {{ $t('Global.hours') }}, {{ minutes }} {{ $t('Global.minutes') }}, {{
                                        seconds }} {{ $t('Global.seconds') }}
                                    </vue-countdown>
                                </small>
                                <template
                                        v-if="$store.state.submission.last_alert && $store.state.submission.last_alert.type == 1 && $store.state.submission.last_alert.allow_update != updateConstants('string', 'TAKE_DECISION') && evaluatorCheck(['ORGANIZATION_TYPE'])">
                  <span class="small text-muted"
                        v-if="$store.state.submission.docsInfo && $store.getters['submission/canUpload'] && $store.state.submission.docsInfo.programs"
                  >( باقي في {{ $store.state.submission.docsInfo.programs }} برنامج {{ $store.state.submission.docsInfo.need }} ملف من {{ $store.state.submission.docsInfo.required }} ملف مطلوب)</span
                  >
                                    <span v-if="$store.state.submission.docsInfo.need != 0" class="small text-muted"
                                          v-else-if="$store.state.submission.docsInfo && $store.getters['submission/canUpload'] && !$store.state.submission.docsInfo.programs"
                                    >( باقي {{ $store.state.submission.docsInfo.need }} ملف من {{ $store.state.submission.docsInfo.required }} ملف مطلوب)</span
                                    >
                                </template>
                                <el-button
                                        v-if="$store.state.submission.last_alert && $store.state.submission.last_alert.allow_update != updateConstants('string', 'TAKE_DECISION')"
                                        :class="time && showType == showConstants('string', 'LEADER_APPROVAL') ? 'disabledAll' : ''"
                                        icon="el-icon-check"
                                        @click="evaluatorCheck(['COMMITTEE_TYPE'])?handleAcceptWithMessage():handleAccept()"
                                        round
                                        size="mini"
                                        class="mx-1 right_icon"
                                        type="success"
                                        :disabled="$store.state.submission.docsInfo && !$store.state.submission.docsInfo.status && evaluatorCheck(['ORGANIZATION_TYPE'])"
                                >
                                    <template
                                            v-if="showType === showConstants('string', 'DEFUALT_APPROVAL') && (evaluatorCheck(['ORGANIZATION_TYPE']) || evaluatorCheck(['LEADER_TYPE']))">
                                        {{ evaluatorCheck(['LEADER_TYPE']) ? $t('Global.accept') : $t('Global.ensure')
                                        }}
                                    </template>
                                    <template v-else>
                                        {{ showType == showConstants('string', 'REPORT_APPROVAL') &&
                                        $store.state.submission.last_alert ? (evaluatorCheck(['LEADER_TYPE']) ?
                                        $t('Global.accept') :
                                        $t(`Global.approvals_status_${$store.state.submission.last_alert.actual_level}_ensure`))
                                        : $t('Global.accept') }}
                                        <!-- <small v-else></small> -->
                                    </template>
                                </el-button>
                                <el-button v-else icon="el-icon-check" @click="openDesicionDialog('add')" round
                                           size="mini" class="mx-1 right_icon" type="success">
                                    <template
                                            v-if="$store.state.evaluationNotes.complete && $store.state.submission.last_alert && $store.state.submission.last_alert.allow_update == updateConstants('string', 'TAKE_DECISION')">
                                        {{ $t('Global.ensureAndDesicion') }}
                                    </template>
                                </el-button>

                                <!-- <button v-if="($store.state.submission.last_alert && !$store.state.submission.last_alert.flag)" class="disabled disabled_color el-button el-button--default is-round mx-1" type="reset" style="padding: 0.6rem 1rem">
                                <i class="el-icon-check-circle"></i>
                                {{ $t('Global.ensure') }}
                              </button> -->
                              
                                <el-button
                                        v-if="
                    (($store.state.submission.last_alert.actual_level != 2 && $store.state.submission.last_alert.type == 2) || ($store.state.submission.last_alert.type == 1) )&& (!evaluatorCheck(['LEADER_TYPE']) && $store.state.submission.last_alert.allow_update != updateConstants('string', 'TAKE_DECISION') && $store.state.submission.last_alert.evaluator_type != evConstants('ORGANIZATION_TYPE') && showType != showConstants('string', 'LEADER_APPROVAL')) 
                  "
                                        icon="el-icon-close"
                                        @click="dialogOpen(false, 1)"
                                        round
                                        size="mini"
                                        class="mx-1 right_icon"
                                        type="danger"
                                >
                                    {{ showType == showConstants('string', 'REPORT_APPROVAL') &&
                                    $store.state.submission.last_alert ?
                                    $t(`Global.refuse_status_${$store.state.submission.last_alert.actual_level}`) :
                                    $t('Global.refuse') }}
                                </el-button>
                                
                                <!-- <span
                                  class="small text-muted"
                                  v-if="$store.getters['documents/documents'].details && ((showType == showConstants('string', 'DEFUALT_APPROVAL') && evaluatorCheck(['ORGANIZATION_TYPE'])) || (lastAlert.type == 1 && lastAlert.actual_level == 3 && evaluatorCheck(['ORGANIZATION_TYPE'])))"
                                >
                                  {{ $t('Global.document_message', { all: $store.getters['documents/documents'].details.all, need: $store.getters['documents/documents'].details.need, upload: $store.getters['documents/documents'].details.upload_count }) }}
                                </span> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="w-100">
                    <Team label="team" @action="handleAccept"
                          v-if="($store.getters['evaluation/team'] && evaluatorCheck(['TEAM_TYPE'])) || hasPermission('stage_update')"
                          :team="$store.getters['evaluation/team']"></Team>
                    <Team label="committee" @action="handleAcceptWithMessage"
                          v-if="($store.getters['evaluation/committees'] && evaluatorCheck(['COMMITTEE_TYPE'])) || hasPermission('stage_update')"
                          :team="$store.getters['evaluation/committees']"></Team>
                </div>
            </CCardBody>
        </CCard>
        <el-dialog :title="$t('Global.writeNote')" :visible.sync="dialogVisible" width="80%">
            <div>
                <el-form label-position="top" :model="form" :rules="rules" status-icon size="large" ref="form"
                         label-width="120px" class="stateForm demo-ruleForm">
                    <CRow>
                        <el-form-item :rules="accept ? { rule: false } : validation(false, 'textarea')"
                                      class="custom_area" style="width: 100%" prop="comment">
                            <el-input id="comment" class="textarea" type="textarea"
                                      :placeholder="accept ? $t('Global.writeNote') : $t('Global.rejectReason')"
                                      v-model="form.comment"></el-input>
                        </el-form-item>
                    </CRow>
                </el-form>
                <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
          <el-button icon="el-icon-close" @click="accept ? handleAccept() : sendReject('form')" round size="mini"
                     class="mx-1 right_icon" :type="accept ? 'primary' : 'danger'">{{ $t('Global.accept') }}</el-button>
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

        <el-dialog append-to-body custom-class="body_dialog" width="70%" :title="$t(`Global.ensureAndDesicion`)"
                   :visible.sync="dialogDecision">
            <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px"
                     class="demo-ruleForm">
                <el-form-item :rules="validation(false, 'textarea')" prop="number" :label="$t('Global.decisionNumber')">
                    <el-input :placeholder="$t('Global.decisionNumber')" v-model="ruleForm.number"></el-input>
                </el-form-item>
                <el-form-item prop="type"
                              :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]"
                              :label="$t('Global.decision')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.type" ref="decision"
                               :placeholder="$t('Global.selectDecision')" style="width: 100%">
                        <el-option v-for="item in $store.getters['evaluation/decisions']" :key="item.id"
                                   :label="item.name" :value="item.id">
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
                <el-form-item
                        :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]"
                        :label="$t('Global.decision_date')" prop="start">
                    <el-date-picker @change="onFromPickValidation" format="yyyy-MM-d" value-format="yyyy-MM-d" clearable
                                    style="width: 100%" v-model="ruleForm.start" type="date"
                                    :placeholder="$t('Global.decision_date')"></el-date-picker>
                </el-form-item>
                <el-form-item
                        :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]"
                        :label="$t('Global.expiration_date')" prop="expiration">
                    <el-date-picker @change="onPickValidation" format="yyyy-MM-d" value-format="yyyy-MM-d" clearable
                                    style="width: 100%" v-model="ruleForm.expiration" type="date"
                                    :placeholder="$t('Global.expiration_date')"></el-date-picker>
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
        <el-button @click="handleDecision()" round size="mini" class="mx-1 right_icon" type="primary"> {{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="dialogDecision = false" round
                   size="small"> {{ $t('Global.cancel') }}</el-button>
      </span>
        </el-dialog>

        <el-dialog :title="$t('Global.ADD_COMMENT')" :visible.sync="dialogMessageVisible">
            <el-form>
                <el-form-item>
                    <el-input type="textarea" v-model="message" :placeholder="$t('Global.ADD_COMMENT')" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"  class="dialog-footer">
                <el-button type="success" @click="changeStatus" >{{$t('Global.accept')}}</el-button>&nbsp;
                <el-button type="danger" @click="dialogMessageVisible = false">{{$t('Global.cancel')}}</el-button>
            </span>
        
        </el-dialog>
    </div>
</template>

<script>
    import upload from '../../../components/upload';
    import Team from './team.vue';
    import {EventBus} from '../../../../main';

    export default {
        components: {upload, Team},
        props: {type: String},
        data() {
            return {
                isLoad: false,
                accept: false,
                mandatoryFiles: [],
                rejected: true,
                show: true,
                dialogVisible: false,
                ifComment: false,
                ifRejected: false,
                isPresident: false,
                dialogDecision: false,
                editMode: false,
                message:null,
                dialogMessageVisible:false,
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
            EventBus.$on('openPreDesicionDialog', data => {
                this.openDesicionDialog(data);
            });
        },
        computed: {
            hasDecision: function () {
                if (this.$store.state.submission.decision && this.$store.state.submission.decision.removed == 0) {
                    return true;
                }
                return false;
            },
            time: function () {
                if (this.$store.getters['submission/team'] && this.$store.getters['submission/team'].ends_at) {
                    const now = new Date();
                    const end = new Date(Date.parse(this.$store.getters['submission/team'].ends_at.replace(/-/g, ' ')));
                    let endTime = end - now;
                    if (endTime > 0) {
                        return end - now;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            showAction: function () {
                if (this.checkFound(this.$store.state.evaluation.evaluator,this.$store.state.submission.last_alert.can_approve) || (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type))) {
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
                if (this.$store.state.submission.last_alert && this.$store.state.submission.last_alert.show_type) {
                    return this.$store.state.submission.last_alert.show_type;
                }
                return false;
            },
        },
        methods: {
            onFromPickValidation(pick) {
                if (this.ruleForm.expiration) {
                    var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
                    var toDate = new Date(Date.parse(this.ruleForm.expiration.replace(/-/g, ' ')));
                    if (pickedDate > toDate) {
                        this.$notify.error({message: `${this.$t('Validation.pickerTo')}`});
                        this.ruleForm.start = null;
                    }
                }
            },
            onPickValidation(pick) {
                var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
                var todaysDate = new Date(Date.parse(this.ruleForm.start.replace(/-/g, ' ')));
                if (pickedDate < todaysDate) {
                    this.$notify.error({message: `${this.$t('Validation.pickerTo')}`});
                    this.ruleForm.expiration = null;
                }
            },
            openDesicionDialog(mode) {
                this.dialogDecision = true;
                if (mode == 'edit') {
                    this.editMode = true;
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
            },
            DateFormat(date) {
                return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`, true);
            },
            Refresh() {
                if (this.$route.params.id) {
                    this.$store.dispatch('submission/submission', this.$route.params.id).then(() => {
                        this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
                    });
                } else {
                    this.$store.dispatch('submission/groupSubmission', this.$route.params.submission_id).then(() => {
                        this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
                    });
                }
            },
            dialogOpen(state, type = 0, accept) {
                if (accept) {
                    this.accept = true;
                } else {
                    this.accept = false;
                }
                if (state) {
                    this.ifComment = true;
                    this.$nextTick(_ => {
                    });
                } else {
                    this.ifRejected = true;
                    this.isPresident = type;
                    this.$nextTick(_ => {
                    });
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
                            // console.log('permis', this.hasPermission('decision_update'),this.hasDecision,this.hasPermission('manager_approval'));
                            // return;
                            if ((this.editMode && ((!this.hasPermission('manager_approval') && !this.showAction) || this.hasDecision)) || (this.hasPermission('decision_update') && !this.showAction)) {
                                this.$store
                                    .dispatch('evaluationNotes/editDecision', {
                                        id: this.$route.params.id,
                                        query: this.ruleForm,
                                    })
                                    .then(() => {
                                        this.isLoad = false;
                                        this.$store.commit('archive/SET_GENERAL_LOAD', false);
                                        this.$notify({
                                            type: 'success',
                                            message: `${this.$t('Global.successMessage')}`,
                                        });
                                        this.Refresh();
                                    });
                            } else {
                                this.$store
                                    .dispatch('notes/preChangeSubState', {
                                        id: this.$route.params.id,
                                        query: query,
                                        system: 2,
                                    })
                                    .then(() => {
                                        this.isLoad = false;
                                        this.$notify({
                                            type: 'success',
                                            message: `${this.$t('Global.successMessage')}`,
                                        });
                                        this.Refresh();
                                    });
                            }
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
                        if (this.$store.state.submission.last_alert && (this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL') || this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'))) {
                            system = 2;
                        } else {
                            system = 1;
                        }
                        this.$store
                            .dispatch('notes/changeSubState', {
                                id: system == 1 ? this.$route.params.submission_id : this.$route.params.id,
                                system: system,
                                query: query,
                            })
                            .then(() => {
                                this.isLoad = false;
                                this.$notify.success({message: `${this.$t('Global.sendRejectMessage')}`});

                                this.Refresh();
                            })
                            .catch(_ => {
                                this.isLoad = false;
                            });
                    }
                });
            },

            // handleAccept(data) {
            //   this.$confirm(`${data ? this.$t('Global.teamConfirm') : this.$t('Global.ensureBeforeRequest')}`, {
            //     confirmButtonText: `${this.$t('Global.accept')}`,
            //     cancelButtonText: `${this.$t('Global.cancel')}`,
            //     type: 'warning',
            //   }).then(_ => {
            //     let query = { status: this.constants('PRE_APPROVE_STATUS') };
            //     this.isLoad = true;
            //     let system = 1;
            //     // if (this.$store.state.submission.last_alert && (this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL') || this.$store.state.submission.last_alert.show_type == this.showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'))) {
            //     //   system = 2;
            //     // } else {
            //     //   system = 1;
            //     // }
            //     console.log(system);
            //     this.$store
            //       .dispatch('notes/changeSubState', {
            //         id: system == 1 ? this.$route.params.submission_id : this.$route.params.id,
            //         system: system,
            //         query: query,
            //       })
            //       .then(() => {
            //         this.isLoad = false;,لإ
            //         this.$notify({
            //           type: 'success',
            //           message: `${this.$t('Global.successMessage')}`,
            //         });

            //         this.Refresh();
            //       });
            //   });
            // },
            changeStatus(){
                 this.dialogMessageVisible = false;
                 this.isLoad = true;
                let query = {
                        status: this.constants('PRE_APPROVE_STATUS'),
                        note: this.message  ? String(this.message) : ''
                    };
                   
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
                            this.isLoad = false;
                            this.$notify({
                                type: 'success',
                                message: `${this.$t('Global.successMessage')}`,
                            });
                            this.Refresh();
                        });
            },  
            handleAccept(data) {
                this.$confirm(`${data ? this.$t('Global.teamConfirm') : this.$t('Global.ensureBeforeRequest')}`, {
                    confirmButtonText: `${this.$t('Global.accept')}`,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    type: 'warning',
                }).then(_ => {
                    let query = {
                        status: this.constants('PRE_APPROVE_STATUS'),
                        note: this.form.comment ? String(this.form.comment) : ''
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
                            this.isLoad = false;
                            this.$notify({
                                type: 'success',
                                message: `${this.$t('Global.successMessage')}`,
                            });
                            this.Refresh();
                        });
                });
            },
            handleAcceptWithMessage(data){  
                this.dialogMessageVisible= true
            }
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
