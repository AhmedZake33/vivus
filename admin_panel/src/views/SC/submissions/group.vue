<template>
    <div>
        <div v-if="$store.getters['notes/lastNote']">
            <el-alert effect="dark" class="mb-2" :title="$store.getters['notes/lastNote'].ar_name"
                      :type="getAlert($store.getters['notes/lastNote'].status)"
                      :description="$store.getters['notes/lastNote'].note" show-icon></el-alert>
        </div>

        <Show :loading="$store.getters['submission/submissionLoad']" icon="el-icon-message"
              :items="$store.getters['submission/submission']" @init="init" :name="$t('Global.general_info')"
              except="team" v-if="hasPermission('access_submissions')">
            <template #show_action>
                <router-link v-if="hasPermission('edit_submissions')"
                             :to="{ path: `/school/submissions/edit/${$route.params.submission_id}`.toString() }">
                    <CIcon name="cil-pencil" color="bg-primary"></CIcon>
                </router-link>
            </template>
            <template #show_status>
                <router-link :to="{ path: `/school/organization/${$store.getters['submission/name'].id}` }"> ( {{
                    $store.getters['submission/name'] ? $store.getters['submission/name'].name : '' }} )
                </router-link>
                <CBadge color="success" v-if="$store.getters['submission/status'] === 1" style="margin: 4px">
                    {{ $t('Global.active') }}
                </CBadge>
                <CBadge color="danger" v-if="$store.getters['submission/status'] === 0" style="margin: 4px">
                    {{ $t('Global.remove') }}
                </CBadge>
                <CBadge color="info" v-if="$store.getters['submission/plan'] === 1" style="margin: 4px">
                    {{ $t('Global.plan') }}
                </CBadge>
                <CBadge color="warning" v-if="$store.getters['submission/officail'] === 1" style="margin: 4px">
                    {{ $t('Global.officail_council') }}
                </CBadge>
            </template>
            <template #custom_show>
           <span v-for="submission in $store.getters['submission/submission']">
            <span v-show="submission.key === 'team'">
              <div class="teams_state">
                <router-link class="custom-link" slot="reference" :to="{ path: `/school/team/${submission.value.id}` }">
                  <CBadge class="custom-link" color="info">{{ submission.value.name }}</CBadge>
                  <CBadge class="custom-link" color="success" style="margin: 5px;">{{ DateFormat(submission.value.starts_at) }}</CBadge>
                  <CBadge class="custom-link" color="success">{{ DateFormat(submission.value.ends_at) }}</CBadge>
                    <br/>
                </router-link>
                   <div class="d-inline teams_state" v-if="isAuth($store.getters['submission/representative'])">
                            <el-tooltip content="موافقة على الفريق وميعاد الزيارة" style="padding: 5px 13px;"
                                        v-if="isNotEqualStatus($store.getters['notes/lastNote'] , constants('REPRESENTATIVE_APPROVE_STATUS')) && isEqualStatus( $store.getters['notes/currentStatus'] ,  constants('ACTIVE_TEAM_STATUS'))"
                                        placement="top-start">
                                <el-button icon="el-icon-check" @click="handleAccept" round size="mini"
                                           class="mx-1 right_icon" type="success"> {{$t('Global.accept')}}</el-button>
                            </el-tooltip>
                            <el-tooltip content="رفض الفريق او ميعاد الزيارة" style="padding: 5px 13px;"
                                        v-if="isNotEqualStatus($store.getters['notes/lastNote'] , constants('REPRESENTATIVE_REFUSE_STATUS'))  && isEqualStatus( $store.getters['notes/currentStatus'] ,  constants('ACTIVE_TEAM_STATUS'))"
                                        placement="top-start">
                                <el-button icon="el-icon-close" @click="dialogOpenRep(false)" size="mini"
                                           class="mx-1 right_icon" round
                                           type="danger"> {{$t('Global.refuse')}}</el-button>
                            </el-tooltip>
                        </div>
              </div>
              <span v-for="member in submission.value.members">
                <div class="teams_state">
                  <div class="d-inline">
                    <el-tooltip v-if="member.excused === constants('NOT_EXCUSED__STATUS') && isAuth(member)"
                                content="رفض الانضمام للفريق" placement="top-start">
                      <el-button icon="el-icon-close" @click="dialogOpen(false, member.id,submission.value.id)" circle
                                 size="mini" class="mx-1 right_icon" type="danger"></el-button>
                    </el-tooltip>
                  </div>
                  <router-link class="d-block custom-link text_badge" :to="{ path: `/users/${member.id}` }">
                    <el-badge :type="member.excused === constants('NOT_EXCUSED__STATUS') ? 'success' : 'danger'"
                              :value="member.excused === constants('NOT_EXCUSED__STATUS') ? $t('Global.exist')  : $t('Global.excused')"></el-badge>
                    {{ member.ar_name }} ({{ member.job }})
                  </router-link>
                </div>
              </span>
            </span>
          </span>
            </template>
            <template #bottom_other_data>
                <tr>
                    <th scope="row" width="20%">{{ $t('Global.representative') }}</th>
                    <td width="80%" v-if="$store.getters['submission/representative']">
                        <router-link class="custom-link"
                                     :to="{ path: `/users/${$store.getters['submission/representative'].id}` }"
                                     :style="isEqualStatus($store.getters['notes/lastNote'] , constants('REPRESENTATIVE_REFUSE_STATUS'))? 'color:#f56c6c': ''">
                            {{ $store.getters['submission/representative'].ar_name }}
                        </router-link>
                    </td>
                </tr>
                <tr v-if="$store.getters['submission/visit']">
                    <th scope="row" width="20%">{{ $t('Global.visit') }}</th>
                    <td width="80%">
                        <router-link :to="{ path: `` }">
                            {{ $store.getters['submission/visitName'] }}
                        </router-link>
                    </td>
                </tr>
            </template>
        </Show>
        <CCard>
            <CCardHeader>
                <div class="d-flex justify-content-between" style="display: inline-block">
                    <div>
                        <i class="el-icon-data-board"></i>
                        <span> {{ $t('Global.Programs') }} </span>
                    </div>
                </div>
            </CCardHeader>
            <CCardBody>
                <el-table :data="$store.getters['submission/programs']" style="width: 100%;"
                          :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                          :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <el-table-column prop="evaluation_id" label="#" width="65" sortable></el-table-column>
                    <el-table-column prop="program" :label="$t('Global.program_name')" width="400"></el-table-column>
                    <el-table-column prop="start" :label="$t('Global.start_at')">
                        <template slot-scope="scope">
                            {{ scope.row.start ? DateFormat(scope.row.start) : 'لا يوجد' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="expiration" :label="$t('Global.ends_at')">
                        <template slot-scope="scope">
                            {{ scope.row.expiration ? DateFormat(scope.row.expiration) : 'لا يوجد' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="level" :label="$t('Global.selectLevelReport')">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark"
                                        :content="scope.row.level ? scope.row.level : $t('Global.notInitReportFinish')"
                                        placement="top-start">
                                <div style="text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap; width:100%; ">
                                    <CBadge color="info">{{ scope.row.level ? scope.row.level :
                                        $t('Global.notInitReportFinish') }}
                                    </CBadge>
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column width="160" prop="decision" :label="$t('Global.Decision')">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="scope.row.decision ? scope.row.decision : 'لا يوجد'"
                                        placement="top-start">
                                <CBadge :color="scope.row.decision === null ? 'danger' : scope.row.decision === 'اعتماد' ? 'success' : 'warning'">
                                    {{ scope.row.decision ? scope.row.decision : 'لا يوجد' }}
                                </CBadge>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label=" ">
                        <template slot-scope="scope">
                            <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                                <i class="el-icon-view table-action-item" @click="show(scope.row.evaluation_id)"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </CCardBody>
        </CCard>
        <CCard>
            <CCardBody>
                <el-tabs type="card" v-model="activeName" class="right" dir="rtl" tab-position="top" stretch>
                    <el-tab-pane name="1">
                        <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.subState') }}</span>
                        <SubStateReply></SubStateReply>
                    </el-tab-pane>
                    <el-tab-pane name="2" lazy label=" الملفات المطلوبه">
                        <span slot="label"><i class="el-icon-files ml-1 mr-1"></i>{{ $t('Global.FilesNeeded') }}</span>
                        <Archive notArchiveRoot insubmission v-if="$store.getters['submission/archive']"
                                 :archive_id="Number($store.getters['submission/archive'].id)"></Archive>
                    </el-tab-pane>
                </el-tabs>
            </CCardBody>
        </CCard>

        <el-dialog title="كتابة ملاحظة" :visible.sync="dialogVisible" width="80%">
            <div>
                <el-form label-position="top" :model="form" :rules="rules" status-icon size="large" ref="form"
                         label-width="120px" class="stateForm demo-ruleForm">
                    <CRow>
                        <el-form-item style="width: 100%;" prop="rejectReason" v-if="ifRejected || ifRepresentative">
                            <el-input class="textarea" type="textarea" placeholder="سبب الرفض"
                                      v-model="form.rejectReason"></el-input>
                        </el-form-item>
                        <el-form-item style="width: 100%;" prop="comment" v-else>
                            <el-input class="textarea" type="textarea" placeholder=" اكتب تعليق "
                                      v-model="form.comment"></el-input>
                        </el-form-item>
                    </CRow>
                </el-form>
                <span slot="footer" class="dialog-footer" style="display: flex;">
            <el-button
                    class="ml-1 mr-1"
                    @click="
                dialogVisible = false;
                ifComment = false;
                rejected = false;
              "
                    round
                    size="small"
            >الغاء</el-button
            >
            <el-button icon="el-icon-close" v-if="ifRejected || ifRepresentative" @click="sendReject('form')" round
                       size="mini" class="mx-1 right_icon" type="danger">تأكيد الرفض</el-button>
            <el-button icon="el-icon-chat-round" v-else @click="sendReject('form')" round size="mini"
                       class="mx-1 right_icon" type="primary"> ارسال</el-button>
          </span>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import SubStateReply from '../../components/sub-state-reply';
    import Show from '../../components/Show';
    import Archive from '../../managment/archive/index';
    import {toLocalDatetime} from '../../../utils/helper';

    export default {
        name: 'group',
        components: {Show, Archive, SubStateReply},
        data() {
            return {
                rejected: true,
                dialogVisible: false,
                ifComment: false,
                ifRejected: false,
                ifRepresentative: false,
                user_id: null,
                team_id: null,
                rules: {
                    rejectReason: [{required: true, message: 'من فضلك يجب كتابة الرساله', trigger: 'blur'}],
                    comment: [{required: true, message: 'من فضلك يجب كتابة الرساله', trigger: 'blur'}],
                },
                activeName: "1",
                form: {
                    reason: null,
                    rejectReason: null,
                    comment: null,
                },
            };
        },
        methods: {
            init() {
                this.$store.dispatch('submission/groupSubmission', this.$route.params.submission_id).then(() => {
                    this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
                });
            },
            Refresh() {
                this.$store.dispatch('notes/subState', this.$route.params.submission_id);
            },
            DateFormat(date) {
                return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
            },
            getAlert(status) {
                switch (status) {
                    case 0 :
                        return 'error';
                    case 6:
                        return 'success';
                    case 8:
                        return 'error';
                    case 9:
                        return 'success';
                    case 10:
                        return 'error';
                    default:
                        return 'warning';
                }
            },
            dialogOpenRep(state) {
                this.ifRepresentative = true;
                this.dialogVisible = true;
            },
            dialogOpen(state, user_id, team_id) {
                this.user_id = user_id;
                this.team_id = team_id;
                if (state) {
                    this.ifComment = true;
                } else {
                    this.ifRejected = true;
                }
                this.dialogVisible = true;
            },
            sendReject(formName, user_id) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.ifRejected) {
                            this.$store.dispatch('submission/teamState', {
                                id: this.$route.params.submission_id,
                                query: {
                                    note: String(this.form.rejectReason),
                                    user_id: this.user_id,
                                    team_id: this.team_id
                                }
                            }).then(() => {
                                this.$notify.error({
                                    title: 'تم الرفض',
                                    message: 'تم الرفض وارسال الملاحظة ',
                                });
                                this.init();
                                this.Refresh();
                                this.dialogVisible = false;
                                this.ifComment = false;
                                this.ifRejected = false;
                            });
                        } else if (this.ifRepresentative) {
                            this.$store.dispatch('submission/excusedRepresentative', {
                                id: this.$route.params.submission_id,
                                query: {
                                    note: String(this.form.rejectReason),
                                    status: this.constants('REPRESENTATIVE_REFUSE_STATUS')
                                }
                            }).then(() => {
                                this.$notify.success({
                                    title: 'تم الارسال',
                                    message: 'تم ارسال ملاحظتك بنجاح ',
                                });
                                this.init();
                                this.Refresh();
                                this.dialogVisible = false;
                                this.ifComment = false;
                                this.ifRejected = false;
                                this.ifRepresentative = false;
                            });
                        }
                    }
                });
            },
            handleAccept(done) {
                this.$confirm('هل انت متأكد من الموافقة علي الطلب', {
                    confirmButtonText: 'موافقة',
                    cancelButtonText: 'الغاء',
                    type: 'success',
                }).then(_ => {
                    this.$store.dispatch('submission/excusedRepresentative', {
                        id: this.$route.params.submission_id,
                        query: {note: null, status: this.constants('REPRESENTATIVE_APPROVE_STATUS')}
                    }).then(() => {
                        this.$notify.success({
                            title: 'تم الارسال',
                            message: 'تم ارسال ملاحظتك بنجاح ',
                        });
                        this.init();
                        this.Refresh();
                        this.dialogVisible = false;
                        this.ifComment = false;
                        this.ifRejected = false;
                    });
                })
                    .catch(_ => {
                    });
            },

            show(id) {
                this.$router.push(`/school/submissions/submission/${this.$route.params.submission_id}/${id}`);
            },
        },
    };
</script>

<style scoped></style>
