<template>
  <div>
    <CCard v-loading="$store.getters['submission/submissionsLoad']">
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
          <CIcon name="cil-people" color="bg-primary"></CIcon>
          {{ $t('Global.addTeamFromAdmin') }} {{teamName ? '('+teamName+')' : ''}}
        </div>
      </CCardHeader>
      <CCardBody :class="isLoad ? 'disabledAll' : ''" dir="rtl" style="text-align: initial">
        <el-form label-position="top" :model="editFormData" status-icon size="large" :rules="editFormDataRules" ref="editFormData" label-width="120px" class="demo-ruleForm team_form">
          <CRow>
            <CCol sm="6">
              <el-form-item :rules="validation()" prop="form" :label="$t('Global.form')">
                <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="editFormData.form" filterable @change="reset" ref="all" :placeholder="$t('Global.form')">
                  <el-option v-for="item in $store.getters['submission/forms']" :key="item.id" :label="item.name" :value="item.id">
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
              <el-form-item :rules="validation()" :label="$t('Global.from')" prop="from">
                <el-date-picker
                  :picker-options="pickerOptions"
                  @focus="changePicker"
                  @change="onFromPickValidation"
                  :disabled="showType != showConstants('string', 'VISIT_UPDATE') && lastAlert.actual_level < 4"
                  format="yy-MM-d"
                  value-format="yyyy-MM-d"
                  clearable
                  style="width: 100%"
                  v-model="editFormData.from"
                  type="date"
                  :placeholder="$t('Global.from')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item :rules="validation()" :label="$t('Global.to')" prop="to">
                <el-date-picker
                  :picker-options="pickerOptionsTo"
                  @change="onPickValidation"
                  @focus="changePicker"
                  :disabled="showType != showConstants('string', 'VISIT_UPDATE') && lastAlert.actual_level < 4"
                  format="yy-MM-d"
                  value-format="yyyy-MM-d"
                  clearable
                  style="width: 100%"
                  v-model="editFormData.to"
                  type="date"
                  :placeholder="$t('Global.to')"
                ></el-date-picker>
              </el-form-item>
            </CCol>
            <CCol sm="6">
              <div style="position: relative" class="no_arrow">
                <el-form-item :rules="showType == showConstants('string', 'TEAM_UPDATE') || lastAlert.actual_level > 4 ? validation() : { required: false }" :label="$t('Global.presedent')" prop="leader">
                  <el-select :disabled="showType != showConstants('string', 'TEAM_UPDATE') && lastAlert.actual_level < 4" popper-class="hide_chooses" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="editFormData.leader" :placeholder="$t('Global.presedent')">
                    <div v-if="$store.getters['submission/selectedTeam']">
                      <el-option v-for="user in $store.getters['submission/selectedTeam'].all_members" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                    </div>
                    <div v-if="selectedLeader">
                      <el-option v-for="user in selectedLeader" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                    </div>
                    <template #empty>
                      <div class="text-center" style="padding: 10px; font-weight: bold">
                        {{ $t('Global.nodata') }}
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="custom_left" v-if="showType == showConstants('string', 'TEAM_UPDATE') || lastAlert.actual_level > 4" @click="openDialog(1)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
              </div>
              <div class="members_hide_close no_arrow" style="position: relative">
                <el-form-item :rules="showType == showConstants('string', 'TEAM_UPDATE') || lastAlert.actual_level > 4 ? validation() : { required: false }" :label="$t('Global.members')" prop="members">
                  <el-select
                    popper-class="hide_chooses"
                    @remove-tag="changeType"
                    :disabled="showType != showConstants('string', 'TEAM_UPDATE') && lastAlert.actual_level < 4"
                    :multiple-limit="3"
                    :no-data-text="$t('Global.nodata')"
                    style="width: 100%"
                    v-model="editFormData.members"
                    filterable
                    multiple
                    :placeholder="$t('Global.members')"
                  >
                    <div v-if="$store.getters['submission/selectedTeam']">
                      <el-option v-for="user in $store.getters['submission/selectedTeam'].all_members" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                    </div>
                    <div v-if="selectedMembers.length">
                      <el-option v-for="user in selectedMembers" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                    </div>
                    <template #empty>
                      <div class="text-center" style="padding: 10px; font-weight: bold">
                        {{ $t('Global.nodata') }}
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="custom_left" v-if="showType == showConstants('string', 'TEAM_UPDATE') || lastAlert.actual_level > 4" @click="openDialog(2)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
              </div>
              <div class="members_hide_close no_arrow" style="position: relative">
                <el-form-item :label="$t('Global.committeeMember')" prop="committees">
                  <el-select
                    popper-class="hide_chooses"
                    @remove-tag="changeType"
                    :disabled="showType != showConstants('string', 'TEAM_UPDATE') && lastAlert.actual_level < 4"
                    :multiple-limit="3"
                    :no-data-text="$t('Global.nodata')"
                    style="width: 100%"
                    v-model="editFormData.committees"
                    filterable
                    multiple
                    :placeholder="$t('Global.committeeMember')"
                  >
                    <div v-if="$store.getters['submission/selectedTeam']">
                      <el-option v-for="user in $store.getters['submission/selectedTeam'].all_members" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                    </div>
                    <div v-if="selectedCommittees.length">
                      <el-option v-for="user in selectedCommittees" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                    </div>
                    <template #empty>
                      <div class="text-center" style="padding: 10px; font-weight: bold">
                        {{ $t('Global.nodata') }}
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="custom_left" v-if="showType == showConstants('string', 'TEAM_UPDATE') || lastAlert.actual_level > 4" @click="openDialog(4)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
              </div>

              <div class="members_hide_close no_arrow" style="position: relative">
                <el-form-item :label="$t('Global.visitorTeam')" prop="reviewers">
                  <el-select
                    popper-class="hide_chooses"
                    @remove-tag="changeType"
                    :disabled="showType != showConstants('string', 'TEAM_UPDATE') && lastAlert.actual_level < 4"
                    :multiple-limit="3"
                    :no-data-text="$t('Global.nodata')"
                    style="width: 100%"
                    v-model="editFormData.reviewers"
                    filterable
                    multiple
                    :placeholder="$t('Global.visitorTeam')"
                  >
                    <div v-if="$store.getters['submission/selectedTeam']">
                      <el-option v-for="user in $store.getters['submission/selectedTeam'].all_members" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                    </div>
                    <div v-if="selectedreviewers.length">
                      <el-option v-for="user in selectedreviewers" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                    </div>
                    <template #empty>
                      <div class="text-center" style="padding: 10px; font-weight: bold">
                        {{ $t('Global.nodata') }}
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="custom_left" v-if="showType == showConstants('string', 'TEAM_UPDATE') || lastAlert.actual_level > 4" @click="openDialog(5)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter>
        <div class="baseButton resetButton" style="justify-content: flex-start">
          <button class="el-button el-button--default is-round sec_color mx-1" @click="activeSubmission('editFormData')" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            <CSpinner v-if="isLoad" color="default" size="sm" />
            {{ $route.params.id ? $t('Global.submit') : $t('Global.send') }}
          </button>
          <button v-if="!isLoad" @click="resetForm('editFormData')" class="el-button--small el-button el-button--default is-round base_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-refresh"></i>
            {{ $t('archive.reset') }}
          </button>
        </div>
      </CCardFooter>
      <el-dialog :close-on-click-modal="false" class="userDialog" :title="$t('Global.addInfo')" :visible.sync="approveDialog" width="90%">
        <Browser
          hidden_action
          :selectedLeader="selectedLeader"
          :selectedObserve="selectedObserve"
          :selectedreviewers="selectedreviewers"
          :observe="editFormData.observe"
          :removed="removed"
          :system="'SC'"
          :selectedMembers="selectedMembers"
          :selectedCommittees="selectedCommittees"
          :leader="editFormData.leader"
          @saveTeam="saveTeam"
          @closeDialog="closeDialog"
          :type="type"
          :members="editFormData.members"
          :reviewers="editFormData.reviewers"
          :committee="editFormData.committees"
        ></Browser>
      </el-dialog>
    </CCard>
  </div>
</template>

<script>
import Browser from '../../../components/userBrowser';

export default {
  components: { Browser },
  name: 'approve',
  computed: {
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
        return this.$store.state.submission.last_alert.show_type;
      }
      return false;
    },
    teamName(){
      if(this.$store.getters['submission/selectedTeam'] && this.$store.getters['submission/selectedTeam'].name){
       console.log("object",this.$store.getters['submission/selectedTeam'].name);
       return this.$store.getters['submission/selectedTeam'].name
      }else{
        return ''
      }
    },
  },
  data() {
    return {
      selectedLeader: [],
      selectedMembers: [],
      selectedCommittees: [],
      selectedObserve: [],
      selectedreviewers: [],
      removed: null,
      approveDialog: false,
      clicked: false,
      isLoad: false,
      type: null,
      pickerDisable: true,
      disabledMember: true,
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
      editFormData: {
        leader: null,
        members: [],
        observe: [],
        committees: [],
        reviewers: [],
        team: this.$store.getters['submission/selectedTeam'] ? this.$store.getters['submission/selectedTeam'] : null,
        form: null,
        to: null,
        from: null,
      },
      editFormDataRules: {
        team: [{ required: true, message: 'من فضلك يجب اختيار الفريق  ', trigger: 'change' }],
        form: [{ required: true, message: 'من فضلك يجب اختيار نموذج التقيم  ', trigger: 'change' }],
        to: [{ required: true, message: 'من فضلك يجب اختيار تاريخ بداية الزيارة  ', trigger: 'change' }],
        from: [{ required: true, message: 'من فضلك يجب اختيار تاريخ نهاية الزيارة  ', trigger: 'change' }],
      },
    };
  },
  watch: {
    'editFormData.from': function (val) {
      if (val) {
        this.pickerDisable = false;
      } else {
        this.editFormData.to = null;
        this.pickerDisable = true;
      }
    },
    'editFormData.leader': function (val) {
      if (val) {
        this.disabledMember = false;
      } else {
        this.disabledMember = true;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    clearObserve(val) {
      this.selectedObserve = [{ ar_name: '', id: null }];
    },
    changeType(val) {
      this.type = 6;
      this.removed = val;
      this.selectedMembers = this.selectedMembers.filter(user => user.id != val);
    },
    onFromPickValidation(pick) {
      if (this.editFormData.to) {
        var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
        var toDate = new Date(Date.parse(this.editFormData.to.replace(/-/g, ' ')));
        if (pickedDate > toDate) {
          this.$notify.error({ message: `${this.$t('Validation.pickerTo')}` });
          this.editFormData.from = null;
        }
      }
    },
    onPickValidation(pick) {
      var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
      var todaysDate = new Date(Date.parse(this.editFormData.from.replace(/-/g, ' ')));
      if (pickedDate < todaysDate) {
        this.$notify.error({ message: `${this.$t('Validation.pickerTo')}` });
        this.editFormData.to = null;
      }
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
    init() {
      this.$store
        .dispatch('submission/SCedit', {
          id: this.$route.params.id,
          query: {},
        })
        .then(() => {
          this.editFormData.visit = this.$store.getters['submission/selectedVisit'] ? this.$store.getters['submission/selectedVisit'] : null;
          this.editFormData.form = this.$store.getters['form/selectedForm'] ? this.$store.getters['form/selectedForm'] : null;
          this.editFormData.leader = this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('LEADER'));
          // this.editFormData.observe = this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('OBSERVE'));
          this.editFormData.teamName = this.$store.getters['submission/selectedTeam'] ? this.$store.getters['submission/selectedTeam'].name : null;
          this.editFormData.from = this.$store.getters['submission/selectedTeam'] ? this.$store.getters['submission/selectedTeam'].starts_at : null;
          this.editFormData.to = this.$store.getters['submission/selectedTeam'] ? this.$store.getters['submission/selectedTeam'].ends_at : null;
          this.editFormData.members = this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('MEMBER'));
          this.editFormData.committees = this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('COMMITTEE'));
          this.editFormData.reviewers = this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('REVIEWERS'));
        });
    },
    openDialog(type) {
      this.approveDialog = true;
      this.type = type;
    },
    activeSubmission(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var query =
            this.showType == this.showConstants('string', 'VISIT_UPDATE')
              ? {
                  starts_at: this.editFormData.from,
                  ends_at: this.editFormData.to,
                  form_id: this.editFormData.form,
                }
              : {
                  members: this.editFormData.members,
                  committees: this.editFormData.committees,
                  reviewers: this.editFormData.reviewers,
                  leader: this.editFormData.leader,
                  starts_at: this.editFormData.from,
                  ends_at: this.editFormData.to,
                  form_id: this.editFormData.form,
                };
          if (this.clicked) return;
          this.clicked = true;
          this.isLoad = true;
          this.$store
            .dispatch('submission/SCactiveSubmission', {
              id: this.$route.params.id,
              query: query,
            })
            .then(() => {
              this.isLoad = false;
            });
        }
      });
    },
    closeDialog() {
      this.approveDialog = false;
      this.type = 8;
    },
    saveTeam(data) {
      if (data.type == 1) {
        this.selectedLeader = data.users;
        this.editFormData.leader = data.users[0].id;
      } else if (data.type == 2) {
        this.selectedMembers = data.users;
        this.editFormData.members = Array.from(data.users, member => member.id);
      } else if (data.type == 3) {
        this.selectedObserve = data.users;
        this.editFormData.observe = Array.from(data.users, observe => observe.id);
      } else if (data.type == 4) {
        this.selectedCommittees = data.users;
        this.editFormData.committees = Array.from(data.users, committee => committee.id);
      } else if (data.type == 5) {
        this.selectedreviewers = data.users;
        this.editFormData.reviewers = Array.from(data.users, reviewer => reviewer.id);
      }
      this.approveDialog = false;
    },
    reset() {
      this.$refs.all.blur();
    },
  },
};
</script>

<style lang="scss">
.en .leftToRight {
  .el-form-item__content {
    .el-select__tags {
      margin-left: 1.5rem !important;
    }
  }
}

.team_form {
  .el-select__caret.el-input__icon.el-icon-arrow-up {
    display: none;
  }
}

.hide_chooses {
  display: none !important;
}

.no_arrow {
  .el-select__caret {
    display: none !important;
  }
}

.custom_left {
  position: absolute;
  top: 50px;
  left: 7px;
  z-index: 999;
  cursor: pointer;
}

.custom_members {
  top: 71% !important;
  transform: translateY(-50%);
}
</style>

<style lang="scss">
// .members_hide_close {
//   .el-form-item {
//     .el-select span i.el-tag__close.el-icon-close {
//       display: none;
//     }
//   }
// }
.userDialog {
  .el-dialog__header {
    display: none !important;
  }

  .resetHeader {
    margin-bottom: 0;
  }

  .el-dialog__footer {
    padding: 0 1rem !important;
  }

  .el-dialog__body {
    padding: 0 !important;
  }

  .card {
    .card-body {
      padding-bottom: 0 !important;
    }

    box-shadow: none !important;

    &:hover {
      box-shadow: none !important;
    }
  }

  .el-table th {
    padding: 0 !important;
  }

  .el-table td {
    padding: 0.2rem;
  }
}
</style>
