<template>
  <div v-if="hasPermission('show_groups')">
<!--    <CRow class="user_icons animate">-->
<!--      <el-alert effect="dark" class="mb-2 mx-3" :title="$t('Global.attention')" type="warning" show-icon>-->
<!--        <div class="d-flex">-->
<!--          <span>-->
<!--            {{ $t('Global.sub_attention') }}-->
<!--          </span>-->
<!--        </div>-->
<!--      </el-alert>-->
<!--    </CRow>-->
    <Show :loading="$store.getters['group/groupsLoad']" icon="el-icon-office-building" :items="$store.getters['group/group']" :name="$store.getters['group/name']" except="departments">
      <template #show_status>
        <CBadge :color="$store.getters['group/status'] == 0 ? 'success' : 'danger'" style="margin: 4px">{{ $store.getters['group/status'] == 0 ? $t('Global.active') : $t('Global.remove') }} </CBadge>
      </template>
      <template #show_action v-if="$store.state.user.allowPu || hasPermission('admin_system')">
        <CDropdown color="success" v-if="hasPermission('access_groups')" placement="bottom-end" size="sm" class="print_hide d-inline customDrop longDrop">
          <template #toggler-content>
            <CIcon name="cil-settings" />
            <span style="font-weight: bold">{{ $t('Global.action') }}</span>
            <CBadge class="mx-1" color="info" v-if="selectedSubmissions.length > 0"
              >{{ selectedSubmissions.length }}
              {{ $t('Global.selectedSubmissions') }}
            </CBadge>
          </template>
          <router-link v-for="item in $store.state.group.stages" @click.native="openAction(item)" class="item d-block" to="">
            <div style="text-align: initial">
<!--              {{ item.title }}-->
              {{$t('Global.visit_detect')}}
            </div>
          </router-link>
          <router-link class="item d-block" to="" v-if="$store.state.group.group.is_editable">
            <div style="text-align: initial" @click="diActive">
              <i :class="$store.getters['group/status'] == 0 ? 'el-icon-delete' : 'el-icon-refresh'"></i>
              {{ $t(`Global.activate_group_${$store.getters['group/status']}`) }}
            </div>
          </router-link>
          <router-link class="item d-block" to="">
            <div style="text-align: initial" @click="showAddEdit($store.state.group.group)">
              <i class="el-icon-edit-outline"></i>
              {{ $t(`Global.edit`) + ' '+ $t(`Global.group`) }}
            </div>
          </router-link>
        </CDropdown>
      </template>
      <template #bottom_other_data>
        <tr>
          <th scope="row" :width="'20%'">
            {{ $t('Global.statistics') }}
          </th>
          <td width="80%">
            <CBadge v-if="$store.state.group.group" v-for="item in $store.state.group.group.statistic" :color="'info'" class="custom-link" style="margin: 2px; font-size: 12px">
              {{ item.title }}
              <CBadge :color="'success'" class="custom-link" style="font-size: 13px !important">{{ item.count }}</CBadge>
            </CBadge>
          </td>
        </tr>
      </template>
    </Show>

    <Submissions group showSelected  system="SC" :group_id="Number($route.params.id)" @init="Refresh"></Submissions>
<!--    //showSelected-->

    <el-dialog :title="$t('Global.groupsDetials')" :visible.sync="visitDialog" width="300">
      <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="stateForm demo-ruleForm">
        <el-form-item :rules="validation()" prop="form_id" :label="$t('Global.form')">
          <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.form_id" filterable ref="all" :placeholder="$t('Global.form')">
            <el-option v-for="item in $store.getters['group/forms']" :key="item.id" :label="item.name" :value="item.id">
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
        <el-form-item :rules="validation()" :label="$t('Global.from')" prop="starts_at">
          <el-date-picker :picker-options="pickerOptions" @focus="changePicker" @change="onFromPickValidation" format="yy-MM-d" value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.starts_at" type="date" :placeholder="$t('Global.from')"></el-date-picker>
        </el-form-item>
        <el-form-item :rules="validation()" :label="$t('Global.to')" prop="ends_at">
          <el-date-picker :picker-options="pickerOptionsTo" @change="onPickValidation" @focus="changePicker" format="yy-MM-d" value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.ends_at" type="date" :placeholder="$t('Global.to')"></el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
        <el-button @click="setVisit('ruleForm')" round size="mini" class="mx-1 right_icon" type="primary">{{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="visitDialog = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('Global.groupsDetials')" :visible.sync="teamDialog" width="300">
      <el-form label-position="top" :model="editFormData" status-icon size="large" ref="editFormData" label-width="120px" class="stateForm demo-ruleForm">
        <div style="position: relative" class="no_arrow">
          <el-form-item :rules="validation()" :label="$t('Global.presedent')" prop="leader">
            <el-select popper-class="hide_chooses" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="editFormData.leader" :placeholder="$t('Global.presedent')">
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
          <div class="custom_left" @click="openDialog(1)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
        </div>
        <div class="members_hide_close no_arrow" style="position: relative">
          <el-form-item :rules="validation()" :label="$t('Global.members')" prop="members">
            <el-select popper-class="hide_chooses" @remove-tag="changeType" :multiple-limit="3" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="editFormData.members" filterable multiple :placeholder="$t('Global.members')">
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
          <div class="custom_left" @click="openDialog(2)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
        </div>
      </el-form>

      <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
        <el-button @click="setTeam('editFormData')" round size="mini" class="mx-1 right_icon" type="primary">{{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="teamDialog = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('Global.groupsDetials')" :visible.sync="dialogVisible" width="300">
      <el-form label-position="top" :model="group" status-icon size="large" ref="group" label-width="120px" class="stateForm demo-ruleForm">
        <el-form-item class="mb-4" :label="$t('Global.name')" :rules="validation(null)" style="width: 100%" prop="name">
          <el-input id="name" :placeholder="$t('Global.name')" v-model="group.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
        <el-button @click="addEdit('group')" round size="mini" class="mx-1 right_icon" type="primary">{{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" class="userDialog" :title="$t('Global.addInfo')" :visible.sync="approveDialog" width="80%">
      <Browser hidden_action :selectedLeader="selectedLeader" :removed="removed" :system="'SC'" :selectedMembers="selectedMembers" :leader="editFormData.leader" @saveTeam="saveTeam" @closeDialog="closeDialog" :type="type" :members="editFormData.members"></Browser>
    </el-dialog>
  </div>
</template>

<script>
import Show from '../../components/Show';
// import DataTable from '../../components/DataTable';
import { toLocalDatetime } from '../../../utils/helper';
import Submissions from '../../components/submissions';
import Browser from '../../components/userBrowser.vue';
import { EventBus } from '@/main';

export default {
  name: 'group',
  components: { Submissions, Show, Browser },
  data() {
    return {
      select: [],
      selectedSubmissions: [],
      visitDialog: false,
      approveDialog: false,
      dialogVisible: false,
      type: null,
      id: null,
      teamDialog: false,
      isLoad: false,
      removed: null,
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
        starts_at: null,
        ends_at: null,
        form_id: null,
      },
      selectedLeader: [],
      selectedMembers: [],
      editFormData: {
        leader: null,
        members: [],
      },
      group: { name: '' },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    selected(item) {
      if (item) {
        if (this.select[item.submission_id]) {
          this.select[item.submission_id] = true;
          this.selectedSubmissions.push(item.submission_id);
        } else {
          var filtered = this.selectedSubmissions.filter(i => i != item.submission_id);
          this.selectedSubmissions = filtered;
        }
      }
    },
    closeDialog() {
      this.approveDialog = false;
      this.type = 8;
    },
    showAddEdit(data) {
      this.id = data ? data.id : null;
      if (data) {
        this.group.name = data.name;
      } else {
        this.group.name = null;
      }
      this.dialogVisible = true;
    },
    addEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('group/save', {
              query: { name: this.group.name },
              id: this.id ? this.id : null,
            })
            .then(() => {
              this.dialogVisible = false;
              this.isLoad = false;
              this.init();
              this.$notify({
                type: 'success',
                message: `${this.$t('Global.successMessage')}`,
              });
            })
            .catch(err => {
              this.dialogVisible = false;
              this.isLoad = false;
            });
        }
      });
    },
    changeType(val) {
      this.type = 6;
      this.removed = val;
      this.selectedMembers = this.selectedMembers.filter(user => user.id != val);
    },
    openDialog(type) {
      this.approveDialog = true;
      this.type = type;
    },
    saveTeam(data) {
      if (data.type == 1) {
        this.selectedLeader = data.users;
        this.editFormData.leader = data.users[0].id;
      } else if (data.type == 2) {
        this.selectedMembers = data.users;
        this.editFormData.members = Array.from(data.users, member => member.id);
      }
      this.approveDialog = false;
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
    onFromPickValidation(pick) {
      if (this.ruleForm.ends_at) {
        var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
        var toDate = new Date(Date.parse(this.ruleForm.ends_at.replace(/-/g, ' ')));
        if (pickedDate > toDate) {
          this.$notify.error({ message: `${this.$t('Validation.pickerTo')}` });
          this.ruleForm.starts_at = null;
        }
      }
    },
    onPickValidation(pick) {
      var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
      var todaysDate = new Date(Date.parse(this.ruleForm.starts_at.replace(/-/g, ' ')));
      if (pickedDate < todaysDate) {
        this.$notify.error({ message: `${this.$t('Validation.pickerTo')}` });
        this.ruleForm.ends_at = null;
      }
    },
    openAction(item) {
      this.id = item.id;
      if (item.show_type == 1) {
        this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
          confirmButtonText: `${this.$t('Global.accept')}`,
          cancelButtonText: `${this.$t('Global.cancel')}`,
          type: 'warning',
        }).then(() => {
          let query = { stage_id: item.id, submission_ids: this.selectedSubmissions };
          this.$store.dispatch('group/actionGroup', { id: this.$route.params.id, query }).then(() => {
            this.init();
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
          });
        });
      } else if (item.show_type == 8) {
        this.visitDialog = true;
      } else if (item.show_type == 4) {
        this.teamDialog = true;
      }
    },
    setTeam(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query = { ...this.editFormData, submission_ids: this.selectedSubmissions, stage_id: this.id };
          this.$store.dispatch('group/actionGroup', { id: this.$route.params.id, query }).then(() => {
            this.init();
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
            this.teamDialog = false;
            this.isLoad = false;
          });
        }
      });
    },
    setVisit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query = { ...this.ruleForm, submission_ids: this.selectedSubmissions, stage_id: this.id };
          this.$store.dispatch('group/actionGroup', { id: this.$route.params.id, query }).then(() => {
            this.init();
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
            this.visitDialog = false;
            this.isLoad = false;
          });
        }
      });
    },
    removeSubmission(id) {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('group/removeSubmission', { id: id, query: null }).then(() => {
          this.init();
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
        });
      });
    },
    diActive() {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('group/delete', this.$route.params.id).then(() => {
          this.init();
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
        });
      });
    },
    init() {
      this.$store
        .dispatch('group/group', {
          id: this.$route.params.id ? this.$route.params.id : null,
        })
        .then(() => {
          this.$store.commit('SET_PATH_TITLE', this.$store.getters['group/name']);
        });
    },
    Refresh(query) {
      let obj = { group_id: this.$route.params.id };
      let queryWithGroup = { ...query, ...obj };
      this.$store.dispatch('submission/submissions', { query: queryWithGroup });
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    show(id) {
      this.$router.push(`/school/submissions/submission/${id}`);
    },
  },
  destroyed() {
    this.$store.commit('SET_PATH_TITLE', null);
  },
  created() {
    EventBus.$on('getSelected', data => {
      this.selectedSubmissions = data;
    });
  },
};
</script>

<style lang="scss">
.longDrop {
  .dropdown-menu {
    min-width: 14rem;
  }
}
</style>
