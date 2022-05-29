<template>
  <div class="custom_info_alert" v-loading="$store.state.course.plansLoad">
    <Show course id="submission_id" icon="el-icon-message" :items="$store.getters['course/plan']" except="team" v-if="hasPermission('show_plans')">
      <template #link>
        <router-link :to="hasPermission('edit_plans') ? `/course/courses/show/${course_id}` : ''">{{ plan_name }}</router-link>
      </template>
      <template #show_status>
        <CBadge color="success" v-if="$store.state.course.plan && $store.state.course.plan.removed === 0" style="margin: 4px">
          {{ $t('Global.active') }}
        </CBadge>
        <CBadge color="danger" v-if="$store.state.course.plan && $store.state.course.plan.removed === 1" style="margin: 4px">
          {{ $t('Global.remove') }}
        </CBadge>
      </template>
      <template #other_data>
        <tr v-if="$store.getters['course/plan']" :class="isLoad ? 'disabledAll' : ''">
          <th scope="row" width="20%">{{ $t('Global.ar_name') }}</th>
          <td width="80%">
            <router-link :to="hasPermission('admin_system') || evaluatorCheck(['TRAINING_MANAGER_TYPE'], 3) ? `/course/courses/show/${course_id}` : ''">{{ plan_name }}</router-link>
          </td>
        </tr>
      </template>
      <template #show_action>
        <router-link v-if="$store.state.course.plan && !$store.state.course.plan.expired" to="">
          <el-button @click="booking($route.params.id)" round size="mini" class="mx-1 p-2 right_icon print_hide" type="primary">
            <i class="el-icon-circle-plus"></i>
            {{ $t('Global.join') }}
          </el-button>
        </router-link>

        <el-button v-if="hasPermission('admin_system')" @click="syncLms($route.params.id)" round size="mini" class="mx-1 p-2 right_icon print_hide" style="font-size: 13px" type="primary">
          <i class="el-icon-circle-plus"></i>
          {{ $t('Global.sync_moodle') }}
        </el-button>

        <CDropdown v-if="ifFound" color="success" placement="bottom-end" size="sm" class="d-inline customDrop print_hide">
          <template #toggler-content>
            <CIcon name="cil-settings" />
            <span style="font-weight: bold">{{ $t('Global.action') }}</span>
          </template>
          <router-link v-if="hasPermission('edit_plans') || evaluatorCheck(['TRAINING_MANAGER_TYPE'])" class="iF_found item d-block" :to="{ path: `/course/plans/edit/${$route.params.id}` }">
            <div style="text-align: initial">
              <i class="el-icon-s-marketing"></i>
              {{ $t('Global.editPlan') }}
            </div>
          </router-link>
          <router-link @click.native="cancelPlan($route.params.id)" v-if="hasPermission('admin_plans') || evaluatorCheck(['TRAINING_MANAGER_TYPE'])" class="iF_found item d-block" to="">
            <div style="text-align: initial">
              <template v-if="$store.state.course.plan && $store.state.course.plan.removed == 0"><i class="el-icon-delete"></i> {{ $t('Global.cancelPlan') }} </template>
              <template v-else><i class="el-icon-refresh"></i> {{ $t('Global.activatePlan') }}</template>
            </div>
          </router-link>
        </CDropdown>
      </template>
    </Show>

    <CCard>
      <CCardHeader>
        <div class="d-flex justify-content-between align-items-baseline w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          <div><i class="el-icon-data-board"></i> {{ $t('Global.trainees') }}</div>
          <div>
            <!-- <el-button icon="el-icon-plus" round size="mini" class="mx-1 right_icon mt-2" type="primary">
                                                  {{ $t('Global.add') }}
                                                </el-button> -->
            <a target="_blank" :href="`${baseUrl}plans/export/${$route.params.id}`">
              <el-button v-if="hasPermission('edit_plans') || evaluatorCheck(['TRAINING_MANAGER_TYPE', 'COACH_TYPE'], 3)" round size="mini" class="mx-1 right_icon mt-2" type="success">
                {{ $t('Global.traineesDownload') }}
              </el-button>
            </a>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow class="mt-3" v-loading="$store.state.course.plansLoad">
          <CCol class="pb-3 pr-2" lg="4" md="6" sm="12" v-for="trainer in $store.state.course.trainees" v-if="(trainer.removed == 0 && authUser().id == trainer.trainee_id) || evaluatorCheck(['TRAINING_MANAGER_TYPE', 'COACH_TYPE'], 3) || hasPermission('edit_plans')">
            <CCard class="position-relative">
              <div class="topLeft">
                <el-avatar fit="contain" class="border border-white" src="/img/avatars/avatardf.png" :size="70" @error="errorHandler">
                  <img :src="trainer.photo ? trainer.photo : `/img/avatars/avatardf.png`" />
                </el-avatar>
                <el-tooltip placement="top" v-if="evaluatorCheck(['TRAINING_MANAGER_TYPE'], 3) || hasPermission('edit_plans')">
                  <div slot="content">
                    {{ $t('Global.delete_trainer') }}
                  </div>
                  <el-button @click="deleteTrainer(trainer.id)" size="small" class="edit_photo" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
              </div>
              <CCardHeader>
                <div class="w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
                  <el-tooltip effect="dark" placement="top">
                    <div slot="content">
                      {{ trainer.trainee }}
                    </div>
                    <div class="text-initial" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 80%">
                      <router-link :to="`/users/${trainer.trainee_id}`">
                        <span class="text-initial">{{ trainer.trainee }}</span>
                      </router-link>
                      <CBadge color="info" style="margin: 4px" v-if="trainer.alert">
                        {{ trainer.alert.title }}
                      </CBadge>
                    </div>
                  </el-tooltip>
                </div>
              </CCardHeader>

              <CCardBody>
                <div style="padding: 14px" v-if="trainer.scores">
                  <div class="bottom">
                    <div class="d-flex justify-content-between">
                      <div>
                        <span class="d-flex font-weight-bolder">{{ $t('Global.attend_time') }}</span>
                        <time class="time small d-flex">{{ trainer.scores.attend || '-' }} </time>
                      </div>

                      <div>
                        <span class="d-flex font-weight-bolder">{{ $t('Global.evaluation_plan') }}</span>
                        <time class="time small d-flex">{{ trainer.scores.evaluation_plan || '-' }} </time>
                      </div>
                    </div>
                    <el-divider class="my-1"></el-divider>
                    <div class="d-flex justify-content-between">
                      <div>
                        <span class="d-flex font-weight-bolder">{{ $t('Global.evaluation_trainer') }}</span>
                        <time class="time small d-flex">{{ trainer.scores.evaluation_trainer || '-' }} </time>
                      </div>
                      <div>
                        <span class="d-flex font-weight-bolder">{{ $t('Global.exam_degree') }}</span>
                        <time class="time small d-flex">{{ trainer.scores.exam_degree || '-' }} </time>
                      </div>
                    </div>

                    <el-divider class="my-1"></el-divider>
                    <div class="d-flex justify-content-between">
                      <div>
                        <span class="d-flex font-weight-bolder">{{ $t('Global.post_exam') }}</span>
                        <time class="time small d-flex">{{ trainer.scores.post_exam || '-' }} </time>
                      </div>
                      <div>
                        <span class="d-flex font-weight-bolder">{{ $t('Global.pre_exam') }}</span>
                        <time class="time small d-flex">{{ trainer.scores.pre_exam || '-' }} </time>
                      </div>
                    </div>
                    <el-divider class="my-1"></el-divider>
                    <div class="d-flex justify-content-between">
                      <div>
                        <span class="d-flex font-weight-bolder">{{ $t('Global.total_deg') }}</span>
                        <time class="time small d-flex">{{ trainer.scores.total || '-' }}</time>
                      </div>
                    </div>
                    <el-divider class="my-1"></el-divider>
                  </div>
                </div>
                <div class="text-center" v-else>
                  <span class="text-initial">{{ $t('Global.nodata') }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <router-link to="" v-if="evaluatorCheck(['TRAINING_MANAGER_TYPE', 'COACH_TYPE'], 3) || hasPermission('admin_system')">
                    <!-- <el-button v-if="trainer.scores" @click="openDesicionDialog('add', null)" icon="el-icon-right" round size="mini" class="mx-1 right_icon mt-2" type="primary">
                                          {{ $t('Global.evaluate') }}
                                        </el-button> -->
                    <el-button v-if="trainer.scores" @click="openDesicionDialog('edit', trainer)" icon="el-icon-right" round size="mini" class="mx-1 right_icon mt-2" type="primary">
                      {{ $t('Global.edit') }}
                    </el-button>
                  </router-link>
                  <router-link :to="`/course/reservations/reservation/${trainer.id}`">
                    <el-button icon="el-icon-view" round size="mini" class="mx-1 mt-2" type="primary">
                      {{ $t('Global.show') }}
                    </el-button>
                  </router-link>
                </div>
                <ButtonApproval v-if="trainer.alert" :planAlert="trainer.alert" plan :reservation_id="trainer.id" @refresh="Refresh"></ButtonApproval>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader>
        <div class="d-flex justify-content-between align-items-baseline w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          <div><i class="el-icon-data-board"></i> {{ $t('Global.coachs') }}</div>
          <div>
            <el-button v-if="hasPermission('edit_plans')" @click="editCoach(null, 2)" round size="mini" class="mx-1 right_icon mt-2" type="primary">
              {{ $store.state.course.trainers && $store.state.course.trainers.length ? $t('Global.edit') : $t('Global.add') }}
            </el-button>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow class="mt-3" v-loading="$store.state.course.plansLoad">
          <CCol class="pb-3 pr-2" lg="4" md="6" sm="12" v-for="trainer in $store.state.course.trainers">
            <CCard class="position-relative">
              <div class="topLeft">
                <el-avatar fit="contain" class="border border-white" src="/img/avatars/avatardf.png" :size="70" @error="errorHandler">
                  <img :src="trainer.photo ? trainer.photo : `/img/avatars/avatardf.png`" />
                </el-avatar>
              </div>
              <CCardHeader>
                <div class="w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
                  <el-tooltip effect="dark" placement="top">
                    <div slot="content">
                      {{ trainer.trainer }}
                    </div>
                    <div class="text-initial" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 80%">
                      <router-link :to="`/users/${trainer.id}`"
                        ><span class="text-initial">{{ trainer.trainer }}</span></router-link
                      >
                    </div>
                  </el-tooltip>
                </div>
              </CCardHeader>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <el-dialog :close-on-click-modal="false" class="userDialog" :title="$t('Global.addInfo')" :visible.sync="approveDialog" width="80%">
      <Browser trainers hidden_action :removed="removed" :system="'SC'" :selectedMembers="selectedMembers" @saveTeam="saveTeam" @closeDialog="closeDialog" :type="type" :members="ruleForm.members"></Browser>
    </el-dialog>
    <el-dialog append-to-body custom-class="body_dialog" width="60%" :title="$t(`Global.rate`)" :visible.sync="dialogDecision">
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
import Show from '../../components/Show.vue';
import Browser from '../../components/userBrowser.vue';
import { EventBus } from '../../../main';
import ButtonApproval from '../reservations/components/ButtonApproval.vue';

export default {
  components: { Show, Browser, ButtonApproval },
  name: 'info',
  data() {
    return {
      isLoad: false,
      dialogVisible: false,
      user_id: null,
      dialogDecision: false,
      members: [],
      type: null,
      removed: null,
      approveDialog: false,
      selectedMembers: [],
      team_id: null,
      ifFound: true,
      coachDialog: false,
      ruleForm: {
        members: [],
        name: null,
        n_id: null,
        attend: null,
        evaluation_plan: null,
        pre_exam: null,
        post_exam: null,
        evaluation_trainer: null,
        exam_degree: null,
        total: null,
      },
      form: {
        comment: null,
      },
      baseUrl: process.env.VUE_APP_BASE_URL,
    };
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
  computed: {
    trainer: function () {
      if (this.$store.state.course.course && this.$store.state.course.course.scores) {
        return this.$store.state.course.course.scores;
      }
    },
    course_id: function () {
      if (this.$store.state.course.plan && this.$store.state.course.plan.course_id) {
        return this.$store.state.course.plan.course_id;
      }
    },
    plan_name: function () {
      if (this.$store.state.course.plan && this.$store.state.course.plan.ar_name) {
        return this.$store.state.course.plan.ar_name;
      }
    },
  },
  mounted() {
    this.Refresh();
  },
  methods: {
    checkFound() {
      this.$nextTick(() => {
        let foundClass = document.querySelector(`.customDrop .iF_found`);
        if (foundClass) {
          this.ifFound = true;
        } else {
          this.ifFound = false;
        }
      });
    },
    download(id) {},
    deleteTrainer(id) {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('submission/delete', id).then(() => {
          this.Refresh();
          this.$message({ message: this.$t('Global.successMessage'), type: 'success' });
        });
      });
    },
    EmitMethods(data) {
      EventBus.$emit('openTrDesicionDialog', data);
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
    openDesicionDialog(mode, data) {
      this.dialogDecision = true;
      if (mode == 'edit') {
        this.editMode = true;
        this.ruleForm.attend = data.scores ? data.scores.attend : null;
        this.ruleForm.evaluation_plan = data.scores ? data.scores.evaluation_plan : null;
        this.ruleForm.pre_exam = data.scores ? data.scores.pre_exam : null;
        this.ruleForm.post_exam = data.scores ? data.scores.post_exam : null;
        this.ruleForm.evaluation_trainer = data.scores ? data.scores.evaluation_trainer : null;
        this.ruleForm.exam_degree = data.scores ? data.scores.exam_degree : null;
        this.ruleForm.total = data.scores ? data.scores.total : null;
        this.id = data.id || null;
      } else {
        this.editMode = false;
        this.ruleForm.attend = null;
        this.ruleForm.evaluation_plan = null;
        this.ruleForm.pre_exam = null;
        this.ruleForm.post_exam = null;
        this.ruleForm.evaluation_trainer = null;
        this.ruleForm.exam_degree = null;
        this.ruleForm.total = null;
        this.id = data.id;
      }
    },
    errorHandler() {
      return false;
    },
    closeDialog(data) {
      this.approveDialog = false;
      this.type = 8;
    },
    booking(id) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.$store.dispatch('course/booking', id).then(() => {
          // this.Refresh();
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
        });
      });
    },
    saveTeam(data) {
      if (data.type == 2) {
        this.selectedMembers = data.users;
        this.ruleForm.members = Array.from(data.users, member => (member.pivot ? member.pivot.member_id : member.id));
        let trainers = {
          trainers: this.ruleForm.members,
        };
        this.$store
          .dispatch('course/addTrainers', {
            query: trainers,
            id: this.$route.params.id ? this.$route.params.id : null,
          })
          .then(() => {
            this.Refresh();
          });
      }
      this.approveDialog = false;
    },
    editCoach(id, type) {
      if (id) {
        this.coachDialog = true;
      } else {
        this.approveDialog = true;
        this.type = type;
      }
    },
    cancelPlan(id) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.$store.dispatch('course/deletePlan', id).then(() => {
          this.Refresh();
        });
      });
    },
    Refresh() {
      this.$store.dispatch('course/plan', this.$route.params.id).then(_ => {
        this.$store.commit('SET_PATH_TITLE', this.plan_name ? this.plan_name : null);
        this.ruleForm.members = this.$store.state.course.trainers ? this.getTrainers(this.$store.state.course.trainers) : [];
        this.checkFound();
      });
    },
    syncLms(id) {
      this.$store.dispatch('course/sync_lms', id).then(_ => {
        this.$notify({
          type: 'success',
          message: `${this.$t('Global.successMessage')}`,
        });
      });
    },
  },
  destroyed() {
    this.$store.commit('SET_PATH_TITLE', null);
  },
};
</script>

<style lang="scss">
.custom_link_white {
  a,
  span {
    &:hover {
      color: #fff;
    }
  }
}

.text_nobreak {
  word-break: normal !important;
}

.fab-wrapper {
  position: fixed;
  bottom: 3rem;
  left: 3rem;
  width: 100%;
  z-index: 99999;
}

.fab-checkbox {
  display: none;
}

.fab {
  position: absolute;
  bottom: -1rem;
  left: -1rem;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: #3c4b64;
  box-shadow: 0px 5px 20px #3f5271;
  transition: all 0.3s ease;
  z-index: 99999;
  border: 1px solid #3c4d6a;
}

.fab-icon {
  font-size: 32px;
  position: absolute;
  bottom: 0.7rem;
  left: 0.7rem;
  color: white;
}

@keyframes blink {
  50% {
    opacity: 0.25;
  }
}

.fab-wheel {
  position: absolute;
  bottom: 4rem;
  left: 0;
  transition: all 0.3s ease;
  transform-origin: bottom right;
  transform: scale(0);
}

.fab-checkbox:checked ~ .fab-wheel {
  transform: scale(1);
}

.fab-action {
  background: #3c4b64;
  border-radius: 25px;
  display: flex;
  align-items: center;
  color: White;
  box-shadow: 0 0.1rem 1rem rgba(24, 66, 154, 0.82);
  transition: all 1s ease;
  opacity: 0;
}

.fab-checkbox:checked ~ .fab-wheel .fab-action {
  opacity: 1;
  padding: 7px;
}

.fab-action:hover {
  text-decoration: underline;
}

.float_action {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 9999;

  .el-dropdown-menu {
    background: #000;
  }
}

.kc_fab_main_btn {
  background-color: #39f;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background: #39f;
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 9999;
  border: none;
  outline: none;
  color: #fff;
  font-size: 36px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: 0.3s;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.kc_fab_main_btn:hover {
  transform: scale(1.1);
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
