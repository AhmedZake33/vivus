<template>
  <CRow v-if="hasPermission('edit_teams')" class="edit_team">
    <CCol sm="12">
      <CCard>
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('Global.organization') }}
          </div>
        </CCardHeader>
        <CCardBody v-loading="$store.getters['organization/teamLoad']" dir="rtl" style="text-align: initial">
          <el-form label-position="top" :model="ruleForm" :rules="rules" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm team_form">
            <CRow>
              <CCol sm="6">
                <el-form-item clearable :label="$t('Global.name')" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="6" class="no_arrow">
                <el-form-item :label="$t('Global.presedent')" prop="leader">
                  <el-select popper-class="hide_chooses" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.leader" filterable :placeholder="$t('Global.presedent')">
                    <div v-if="$store.getters['team/teamId']">
                      <el-option v-for="user in $store.getters['team/teamId'].all_members" :key="user.id" :label="user.ar_name" :value="user.id">
                        {{ user.ar_name }}
                      </el-option>
                    </div>
                    <div v-if="selectedLeader.length">
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
                  <div class="custom_plus" @click="openDialog(1)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
                </el-form-item>
              </CCol>

              <CCol sm="6" class="no_arrow">
                <el-form-item :label="$t('Global.members')" prop="members">
                  <el-select popper-class="hide_chooses" allow-create :multiple-limit="3" clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.members" filterable multiple :placeholder="$t('Global.members')">
                    <el-option v-for="user in $store.getters['team/teamId'].all_members" :key="user.id" :label="user.ar_name" :value="user.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ user.ar_name }}
                      </span>
                    </el-option>
                    <div v-if="selectedMembers">
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
                  <div class="custom_plus" @click="openDialog(2)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
                </el-form-item>
              </CCol>

              <!-- <CCol sm="6">
                <el-form-item :label="$t('Global.announce')" prop="announce">
                  <el-select multiple popper-class="hide_chooses" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.observe" filterable :placeholder="$t('Global.announce')">
                    <el-option v-for="user in $store.getters['team/teamId'].all_members" :key="user.id" :label="user.ar_name" :value="user.id">
                      {{ user.ar_name }}
                    </el-option>
                    <div v-if="selectedObserve.length">
                      <el-option v-for="user in selectedObserve" :key="user.id" :label="user.ar_name" :value="user.id">
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
                  <div class="custom_plus" @click="openDialog(3)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
                </el-form-item>
              </CCol> -->

              <CCol sm="6">
                <el-form-item :label="$t('Global.visit_start_date')" prop="starts_at">
                  <el-date-picker value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.starts_at" type="date" placeholder="Pick a day"> </el-date-picker>
                </el-form-item>
              </CCol>
              <CCol sm="6">
                <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                  <div class="mt-2 el-form-item__label">{{ $t('Global.visit_ends_at') }}</div>
                  <el-date-picker value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.ends_at" type="date" placeholder="Pick a day"> </el-date-picker>
                </div>
              </CCol>
<!--              <CCol sm="6">-->
<!--                <el-form-item :label="$t('Global.announce_at')" prop="announce_at">-->
<!--                  <el-date-picker value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.announce_at" type="date" placeholder="Pick a day"> </el-date-picker>-->
<!--                </el-form-item>-->
<!--              </CCol>-->
<!--              <CCol sm="6">-->
<!--                <el-form-item :label="$t('Global.close_at')" prop="close_at">-->
<!--                  <el-date-picker clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.close_at" type="date" placeholder="Pick a day"> </el-date-picker>-->
<!--                </el-form-item>-->
<!--              </CCol>-->
<!--              <CCol sm="6">-->
<!--                <el-form-item :label="$t('Global.visit_at')" prop="visit_at">-->
<!--                  <el-date-picker value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.visit_at" type="date" placeholder="Pick a day"> </el-date-picker>-->
<!--                </el-form-item>-->
<!--              </CCol>-->
            </CRow>
          </el-form>
        </CCardBody>
        <CCardFooter>
          <div class="baseButton resetButton" style="justify-content: flex-start">
            <button class="mx-1 el-button el-button--default is-round sec_color" @click="save('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              {{ $t('Global.submit') }}
            </button>
            <button @click="resetForm('ruleForm')" class="el-button--small el-button el-button--default is-round base_color" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-refresh"></i>
              {{ $t('archive.reset') }}
            </button>
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
    <el-dialog class="userDialog" :title="$t('Global.addInfo')" :visible.sync="approveDialog" width="80%">
      <!-- <Browser hidden_action :type="type"></Browser> -->
      <Browser
        hidden_action
        :selectedLeader="selectedLeader"
        :selectedObserve="selectedObserve"
        :observe="ruleForm.observe"
        :removed="removed"
        :selectedMembers="selectedMembers"
        :selectedCommittees="selectedCommittees"
        :leader="ruleForm.leader"
        @saveTeam="saveTeam"
        @closeDialog="closeDialog"
        :type="type"
        :members="ruleForm.members"
        :committee="ruleForm.committees"
        :system="'SC'"
      ></Browser>
    </el-dialog>
  </CRow>
</template>

<script>
import Browser from '@/views/components/userBrowser';
export default {
  components: {
    Browser,
  },
  name: 'editTeam',
  data() {
    return {
      selectedLeader: [],
      selectedMembers: [],
      selectedCommittees: [],
      selectedObserve: [],
      removed: null,
      approveDialog: false,
      type: null,
      ruleForm: {
        id: 0,
        starts_at: '',
        name: '',
        announce_at: '',
        ends_at: '',
        visit_at: '',
        close_at: '',
        visitType: null,
        visitGroups: null,
        presedent: null,
        leader: null,
        members: [],
        observe: [],
        committees: [],
      },
      rules: {
        name: [{ required: true, message: 'من فضلك يجب كتابة اسم الفريق', trigger: 'blur' }],
        members: [{ required: true, message: 'من فضلك يجب اختيار اعضاء الفريق', trigger: 'change' }],
        leader: [{ required: true, message: 'من فضلك يجب اختيار رئيس الفريق  ', trigger: 'change' }],
        starts_at: [{ required: true, message: 'من فضلك يجب تحديد معاد الزيارة', trigger: 'change' }],
      },
    };
  },

  mounted() {
    if (this.$route.params.id) {
      this.init();
    }
    this.usersRoles();
  },
  // created() {
  //     if (this.$route.params.id) {
  //         this.show = false;
  //         this.getUserById((val) => {
  //             this.user = val.user;
  //         })
  //     }
  // },
  methods: {
    openDialog(type) {
      this.approveDialog = true;
      this.type = type;
    },
    clearObserve(val) {
      this.selectedObserve = [];
    },
    closeDialog(data) {
      this.approveDialog = false;
      this.type = 5;
    },
    saveTeam(data) {
      if (data.type == 1) {
        this.selectedLeader = data.users;
        this.ruleForm.leader = data.users[0].id;
      } else if (data.type == 2) {
        this.selectedMembers = data.users;
        this.ruleForm.members = Array.from(data.users, member => member.id);
      } else if (data.type == 3) {
        this.selectedObserve = data.users;
        this.ruleForm.observe = Array.from(data.users, observe => observe.id);
      } else if (data.type == 4) {
        this.selectedCommittees = data.users;
        this.ruleForm.committees = Array.from(data.users, committee => committee.id);
      }
      this.approveDialog = false;
    },
    usersRoles(search = '', limit = 10) {
      this.$store.dispatch('archive/usersRoles', { query: { search_text: search, limit: limit } });
    },
    init() {
      this.$store.dispatch('team/team', this.$route.params.id).then(() => {
        // console.log('object', this.$store.getters['team/teamId']);
        // this.ruleForm = this.$store.getters['team/teamId'];
        this.ruleForm.name = this.$store.getters['team/teamId'].name;
        this.ruleForm.starts_at = this.$store.getters['team/teamId'].starts_at;
        this.ruleForm.ends_at = this.$store.getters['team/teamId'].ends_at;
        this.ruleForm.announce_at = this.$store.getters['team/teamId'].announce_at;
        this.ruleForm.close_at = this.$store.getters['team/teamId'].close_at;
        this.ruleForm.visit_at = this.$store.getters['team/teamId'].visit_at;
        this.ruleForm.visitType = this.$store.getters['team/teamId'].visitType;
        this.ruleForm.leader = this.getTeamElements(this.$store.getters['team/teamId']?this.$store.getters['team/teamId']:null, this.constants('LEADER'));
        this.ruleForm.members = this.getTeamElements(this.$store.getters['team/teamId']?this.$store.getters['team/teamId']:[], this.constants('MEMBER'));
        this.ruleForm.observe = this.getTeamElements(this.$store.getters['team/teamId'] ? this.$store.getters['team/teamId']:[], this.constants('OBSERVE'));
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (this.$route.params.id) {
          if (valid) {
            let query = {
              name: this.ruleForm.name,
              leader: this.ruleForm.leader,
              members: this.ruleForm.members,
              observe: this.ruleForm.observe,
              starts_at: this.ruleForm.starts_at,
              ends_at: this.ruleForm.ends_at,
              visit_at: this.ruleForm.visit_at,
              announce_at: this.ruleForm.announce_at,
              close_at: this.ruleForm.close_at,
            };
            this.$store.dispatch('submission/saveTeam', { query: query, id: this.$route.params.id });
          }
        }
      });
    },
    // updateUser() {
    //   if (this.$route.params.id) {
    //     user.update(this.user.id, this.user).then(response => {
    //       this.$toast.open('data updated');
    //     });
    //   } else {
    //     user
    //       .store(this.user)
    //       .then(response => {
    //         this.$toast.open('New User Added Success');
    //       })
    //       .catch(err => {
    //         this.$toast.error('The New User is Not Add');
    //       });
    //   }

    //   this.$router.push({ path: '/users' });
    // },
  },
  destroyed() {
    this.$store.commit('submission/SET_SELECTED_TEAM', null);
  },
};
</script>

<style lang="scss">
// .ar .el-select-dropdown__item span{
//     float: left !important;
// }

.custom_plus {
  position: absolute;
  left: 0.2rem;
  cursor: pointer;
  top: 57%;
  z-index: 9;
  transform: translateY(-50%);
}
.ar .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  right: unset;
  lef: 20px;
}
.ar .edit_team .el-select .el-input .el-input__suffix {
  right: unset;
  left: 30px;
}
.ar .edit_team .el-date-editor.el-input .el-input__suffix {
  right: unset;
  left: 25px;
}
.ar .edit_team .el-input .el-input__suffix {
  right: unset;
  left: 15px;
}
</style>
