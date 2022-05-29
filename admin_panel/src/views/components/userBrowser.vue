<template>
  <div>
    <DataTable
      :items="allUsers"
      hidden_reset
      @Refresh="Refresh"
      :loading="$store.getters['user/usersLoad']"
      :name="$t('user.users')"
      :total="$store.getters['user/totalUsers']"
      icon="el-icon-user"
      :resetSearch="resetSearch"
      :role="Number(67)"
      :degree_level="level"
      :degree_qualification_id="qualification"
      :degree_specification_id="specification"
      :level="education_level_id"
      :qualification="qualification_id"
      :specification="specification_id"
      :group_id="group_id"
      :degree="degree"
      :university_id="university"
      :organization_id="organization"
      :collage="collage"
      :directorate="directorate"
      :undirectorate="undirectorate"
      :administration="administration"
      @reset="reset"
      :hidden_action="hidden_action"
      :role_job="role_job"
      :qualification_name="qualification_name"
      :qualifications_ids="data_ids"
      permission="admin_users"
      v-if="rerenderAll"
    >
      <template #filter_table>
        <!-- <span class="w-100 mr-2 ml-2 mb-2 text-muted font-weight-bolder">{{$t('Global.selectedItem')}}</span> -->
        <div v-if="rerender" class="d-flex w-100 flex-wrap">
          <div v-if="selectedUsers.length != 0" class="animate rounded-pill border px-3 py-1 ml-2 mr-2 mb-3 d-flex justify-content-between align-item-center" v-for="user in selectedUsers">
            <span> {{ user.trainer ? user.trainer : user.ar_name }} </span>
            <i @click="removeUser(user)" class="el-icon-delete pointer mt-1 mx-2"></i>
          </div>
          <div v-else>{{ $t('Global.noSelected') }}</div>
        </div>
        <div v-if="selectedUsers.length != 0" class="divider w-100 border-bottom mb-3"></div>

        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectLevel')" style="width: 100%" v-model="level" @change="resetAll" filterable clearable>
            <el-option v-for="level in getLevels($store.getters['user/levels'], 1)" :key="level.id" :label="level.name" :value="level.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ level.name }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
          <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="info badge-pill">{{ $t('Global.degree_name') }} </CBadge>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select ref="qualification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.qual')" style="width: 100%" v-model="qualification" :disabled="qualification_status" @change="resetSpecification" filterable clearable>
            <el-option v-for="qualification in $store.state.user.degree_qualifications" :key="qualification.id" :label="qualification.name" :value="qualification.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ qualification.name }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
          <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="info badge-pill">{{ $t('Global.degree_name') }} </CBadge>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select ref="specification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.Specialty')" style="width: 100%" v-model="specification" :disabled="specification_status" filterable clearable>
            <el-option v-for="specification in $store.state.user.degree_specifications" :key="specification.id" :label="specification.name" :value="specification.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ specification.name }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
          <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="info badge-pill">{{ $t('Global.degree_name') }} </CBadge>
        </div>

        <!-- ############ -->
        <!-- المؤهل -->
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.Certificate')" style="width: 100%" v-model="education_level_id" @change="resetAll" filterable clearable>
            <el-option v-for="level in getLevels($store.getters['user/levels'], 2)" :key="level.id" :label="level.name" :value="level.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ level.name }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
          <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="warning badge-pill">{{ $t('Global.Certificate') }} </CBadge>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select ref="qualification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.qual')" style="width: 100%" v-model="qualification_id" :disabled="qualification_edu_status" filterable clearable>
            <el-option v-for="qualification in $store.getters['user/qualifications']" :key="qualification.id" :label="qualification.name" :value="qualification.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ qualification.name }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
          <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="warning badge-pill">{{ $t('Global.Certificate') }} </CBadge>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select ref="specification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.Specialty')" style="width: 100%" v-model="specification_id" :disabled="specification_edu_status" filterable clearable>
            <el-option v-for="specification in $store.getters['user/specifications']" :key="specification.id" :label="specification.name" :value="specification.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ specification.name }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
          <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="warning badge-pill">{{ $t('Global.Certificate') }} </CBadge>
        </div>

        <!-- نهاية المؤهل -->
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select ref="qualifications" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.all_qualifications')" style="width: 100%" v-model="data_ids" filterable remote reserve-keyword :remote-method="search" :loading="$store.state.user.load_qualifications">
            <!-- <el-option v-for="user in users" :key="user.id" :label="user.ar_name" :value="user.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ user.ar_name }}
              </span>
            </el-option> -->
            <el-option v-for="user in $store.state.user.all_qualifications" :key="user.id" :label="user.name" :value="user.name">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ user.name }}
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.qualification_name')" style="width: 100%" v-model="qualification_name" @change="resetAll" filterable clearable>
            <el-option v-for="level in $store.state.user.pre_qualifications" :key="level.id" :label="level.name" :value="level.name">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ level.name }}
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>

        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select ref="degree" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectDegree')" style="width: 100%" v-model="degree" filterable clearable>
            <el-option v-for="degree in $store.getters['user/degrees']" :key="degree.id" :label="degree.name" :value="degree.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ degree.name }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system != 'SC'">
          <el-select clearable @clear="resetUni" :no-data-text="$t('Global.nodata')" v-model="university" ref="uni" filterable :placeholder="$t('Global.selectUniversity')" style="width: 100%">
            <el-option v-for="item in $store.getters['university/universities']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
                <i class="el-icon-office-building"></i>
              </span>
            </el-option>
            <el-option key="new" :label="$t('Global.other')" :value="0">
              <span style="float: right; color: #8492a6; font-size: 13px">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.other') }}
                  <i class="el-icon-office-building"></i>
                </span>
              </span>
            </el-option>
            <template #prefix>
              <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
            </template>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system != 'SC'">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="organization" filterable ref="org" :disabled="disabled" :placeholder="$t('Global.selectOrganization')" style="width: 100%">
            <el-option v-for="item in $store.getters['organization/organizations']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
                <i class="el-icon-school"></i>
              </span>
            </el-option>
            <el-option key="new" :label="$t('Global.other')" :value="0">
              <span style="float: right; color: #8492a6; font-size: 13px">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.other') }}
                  <i class="el-icon-school"></i>
                </span>
              </span>
            </el-option>
            <template #prefix>
              <i class="el-icon-school" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
            </template>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'SC'">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="directorate" @change="resetUni" ref="directorate" filterable :placeholder="$t('Global.directorate')" style="width: 100%">
            <el-option v-for="item in $store.getters['directorate/directorates']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
                <i class="el-icon-office-building"></i>
              </span>
            </el-option>
            <template #prefix>
              <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
            </template>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'SC'">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="administration" filterable ref="administration" :disabled="admin_disabled" :placeholder="$t('Global.administration')" style="width: 100%">
            <el-option v-for="item in $store.getters['directorate/institutes']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
                <i class="el-icon-school"></i>
              </span>
            </el-option>
            <template #prefix>
              <i class="el-icon-school" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
            </template>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative" v-if="system === 'SC'">
          <el-select multiple clearable :no-data-text="$t('Global.nodata')" v-model="undirectorate" ref="undirectorate" filterable :placeholder="$t('Global.hide_directorate')" style="width: 100%">
            <el-option v-for="item in $store.getters['directorate/directorates']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
                <i class="el-icon-office-building"></i>
              </span>
            </el-option>
            <template #prefix>
              <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
            </template>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
          <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="danger badge-pill">{{ $t('Global.hide_filter') }}</CBadge>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative" v-if="system === 'SC'">
          <el-select clearable multiple :no-data-text="$t('Global.nodata')" v-model="group_id" ref="group_id" filterable :placeholder="$t('Global.hide_group')" style="width: 100%">
            <el-option v-for="item in $store.getters['group/groups']" :key="item.id" :label="item.name" :value="item.id">
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
          <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="danger badge-pill">{{ $t('Global.hide_filter') }}</CBadge>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-select multiple clearable :no-data-text="$t('Global.nodata')" v-model="role_job" filterable :placeholder="$t('Global.role_job')" style="width: 100%">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
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
        </div>
      </template>
      <template #cols>
        <el-table-column prop="id" sortable width="65" class-name="custom_check_user" label="#">
          <template slot-scope="scope">
            <el-checkbox v-model="select[scope.row.id]" @change="selected(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('users.name')" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.ar_name" placement="top-start">
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">{{ scope.row.ar_name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="last_visit" :label="$t('Global.last_visit')" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="$t('Global.last_visit')" placement="top-start">
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                <CBadge color="info" style="margin: 2px">{{ scope.row.last_visit ? (scope.row.last_visit.starts_at ? toLocalDatetime(scope.row.last_visit.starts_at, 'ar', false) : '-') : '-' }}</CBadge>
              </div>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('Global.role_name')" placement="top-start">
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                <CBadge color="info" style="margin: 2px"> {{ scope.row.last_visit ? scope.row.last_visit.name : '-' }}</CBadge>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="organization_id" :label="$t('Global.organization')" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                <span
                  >{{ scope.row.organization }} <br /><br />
                  <div class="small text-muted">{{ `${scope.row.university}` }}</div>
                </span>
              </div>
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                <router-link :to="{ path: `/higher/organization/${scope.row.organization_id}` }">
                  {{ scope.row.organization }}
                </router-link>
                <!-- <div class="small text-muted" v-if="scope.row.university">{{ `${scope.row.education_degree_id > 3 ? $t('Global.government') : $t('Global.university')} : ${scope.row.university}` }}</div> -->
                <div class="small text-muted">{{ `${scope.row.university}` }}</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="qualification_id" :label="$t('Global.qualifications')" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.level">{{ scope.row.level + ',' }}</span>
            <span v-if="scope.row.qualification">{{ scope.row.qualification + ',' }}</span>
            <span v-if="scope.row.specification">{{ scope.row.specification }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="specification_id" width="170" :label="$t('Global.specification')" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.degree_level">{{ scope.row.degree_level + ',' }}</span>
            <span v-if="scope.row.degree_qualification">{{ scope.row.degree_qualification + ',' }}</span>
            <span v-if="scope.row.degree_specifications">{{ scope.row.degree_specifications }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="job_title" :label="$t('Global.job_title')" sortable>
          <template slot-scope="scope">
            <div>{{ scope.row.job_title }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="count" :label="$t('Global.subscriptions')" sortable>
          <template slot-scope="scope">
            <span>
              <CBadge color="info" style="margin: 2px">{{ scope.row.leaders_count ? scope.row.leaders_count : '0' }} {{ $t('Global.asLeader') }}</CBadge>
              <CBadge color="success" style="margin: 2px">{{ scope.row.members_count ? scope.row.members_count : '0' }} {{ $t('Global.asMember') }}</CBadge>
              <CBadge color="warning">{{ scope.row.observes_count ? scope.row.observes_count : '0' }} {{ $t('Global.asObserve') }}</CBadge>
              <CBadge color="dark">{{ scope.row.visits_kids_count ? scope.row.visits_kids_count : '0' }} {{ $t('Global.kidsJob') }}</CBadge>
            </span>
          </template>
        </el-table-column>
      </template>
    </DataTable>
    <span class="dialog-footer d-flex mt-n2" v-if="rerender">
      <el-button v-if="selectedUsers.length != 0" type="primary" round class="align-self-center ml-2 mr-4" @click="saveUser">{{ $t('Global.save') }}</el-button>
      <el-button v-else class="align-self-center ml-2 mr-4 disabled disabled_color" type="primary" round>
        <i class="el-icon-check-circle"></i>
        {{ $t('Global.save') }}
      </el-button>
      <el-button @click="cancel" style="margin: 10px" round>{{ $t('Global.cancel') }}</el-button>
    </span>
    <!-- <div id="toBody">
      <CToaster position="top-left" :autohide="false">
        <template>
          <CToast :show="rerender" :header="$t('Global.selectedItem')">
            <div v-if="selectedUsers.length != 0" class="border p-1 mb-1 d-flex justify-content-between align-item-center" v-for="user in selectedUsers">
              <span> {{ user.ar_name }} </span>
              <i @click="removeUser(user)" class="el-icon-delete pointer mt-1"></i>
            </div>
            <div v-else>{{ $t('Global.noSelected') }}</div>
          </CToast>
        </template>
      </CToaster>
    </div> -->
  </div>
</template>

<script>
import { type } from '@amcharts/amcharts4/core';
import DataTable from './DataTable';
export default {
  name: 'userBrowser',
  components: { DataTable },
  props: {
    trainers: Boolean,
    type: Number,
    hidden_action: Boolean,
    members: Array,
    committee: Array,
    inputType: String,
    leader: Number,
    selectedMembers: Array,
    selectedCommittees: Array,
    selectedreviewers: Array,
    reviewers: Array,
    selectedObserve: Array,
    selectedLeader: Array,
    removed: Number,
    observe: Array,
    system: String,
  },
  data() {
    return {
      roles: [
        { id: 1, name: 'رئيس' },
        { id: 2, name: 'عضو' },
        { id: 3, name: 'روضة' },
      ],
      resetSearch: 1,
      group_id: null,
      undirectorate: null,
      level: this.$store.state.level && this.$store.state.level != '' ? this.$store.state.level : null,
      select: [],
      role_job: null,
      inPopup: false,
      data_ids: [],
      qualification_name: null,
      disabled: true,
      tempSelected: [],
      rerenderAll: true,
      rerender: true,
      qualification_edu_status: true,
      specification_edu_status: true,
      education_level_id: null,
      specification_id: null,
      qualification_id: null,
      selectedUsers: [],
      organization: this.$store.state.organization_id_user ? this.$store.state.organization_id_user : null,
      qualification: this.$store.state.qualification ? this.$store.state.qualification : null,
      specification: this.$store.state.specification ? this.$store.state.specification : null,
      degree: this.$store.state.degree ? this.$store.state.degree : null,
      university: this.$store.state.university_user ? this.$store.state.university_user : null,
      collage: this.$store.state.collage ? this.$store.state.collage : null,
      qualification_status: this.$store.state.level ? false : true,
      specification_status: this.$store.state.qualification ? false : true,
      directorate: null,
      administration: null,
      admin_disabled: true,
    };
  },
  watch: {
    education_level_id: function (val, newVal) {
      if (val) {
        this.qualification_edu_status = false;
      } else {
        this.qualification_id = null;
        this.specification_id = null;
        this.qualification_edu_status = true;
      }
    },

    qualification_id: function (val) {
      if (val) {
        this.specification_edu_status = false;
      } else {
        this.specification_edu_status = true;
      }
    },
    type: function (val) {
      this.Refresh();
    },
    directorate: function (val) {
      this.directorate = val;
      this.$store.commit('set', ['directorate_id', val]);
      if (val || val === 0) {
        this.admin_disabled = false;
        this.administration = null;
        this.$refs.directorate.blur();
      } else {
        this.admin_disabled = true;
      }
      this.$store.dispatch('directorate/institutes', {
        parent_id: val,
      });
    },
    administration: function (val) {
      this.administration = val;
      this.$store.commit('set', ['administration', val]);
      if (val) {
        this.$refs.administration.blur();
      }
    },
    university: function (val) {
      this.$store.commit('set', ['university_user', val]);
      if (val || val == 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
        this.organization = null;
      }
      //   this.$store.commit('set', ['university_id_user', val]);
      this.$store.dispatch('organization/names', {
        query: {
          parent_id: this.university,
        },
      });
    },
    organization: function (val) {
      this.$store.commit('set', ['organization_id_user', val]);
      if (val || val == 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    select: function () {
      this.rerender = false;
      this.rerender = true;
    },
    specification: function (val) {
      this.$store.commit('set', ['specification', val]);
      val ? this.$refs.specification.blur() : '';
    },
    degree: function (val) {
      this.$store.commit('set', ['degree', val]);
      val ? this.$refs.degree.blur() : '';
    },
    collage: function (val) {
      this.$store.commit('set', ['collage', val]);
      val ? this.$refs.collage.blur() : '';
    },
    // university: function (val) {
    //   this.$store.commit('set', ['university_user', val]);
    //   val ? this.$refs.university.blur() : '';
    // },
    level: function (val) {
      if (val) {
        this.$store.commit('set', ['level', val]);
        this.qualification_status = false;
        this.$refs.level.blur();
      } else {
        this.qualification_status = true;
      }
    },
    qualification: function (val) {
      if (val) {
        this.$store.commit('set', ['qualification', val]);
        this.specification_status = false;
        this.$refs.qualification.blur();
      } else {
        this.specification_status = true;
      }
    },
  },
  computed: {
    allUsers: function () {
      if (this.type == 1) {
        var existArr = [].concat(this.members, this.observe, this.committee, this.reviewers);
        return this.$store.getters['user/users'].filter(user => {
          return existArr.every(f => {
            return f != user.id;
          });
        });
      } else if (this.type == 2) {
        var existArr = [].concat(this.leader, this.observe, this.committee, this.reviewers);
        return this.$store.getters['user/users'].filter(user => {
          return existArr.every(f => {
            return f != user.id;
          });
        });
      } else if (this.type == 3) {
        var existArr = [].concat(this.leader, this.members, this.committee, this.reviewers);
        return this.$store.getters['user/users'].filter(user => {
          return existArr.every(f => {
            return f != user.id;
          });
        });
      } else if (this.type == 4) {
        var existArr = [].concat(this.leader, this.members, this.observe, this.reviewers);
        return this.$store.getters['user/users'].filter(user => {
          return existArr.every(f => {
            return f != user.id;
          });
        });
      } else if (this.type == 5) {
        var existArr = [].concat(this.leader, this.members, this.observe, this.committee);
        return this.$store.getters['user/users'].filter(user => {
          return existArr.every(f => {
            return f != user.id;
          });
        });
      }
    },
  },
  mounted() {
    this.qualificationsSearch();
  },
  methods: {
    qualificationsSearch(search = '', limit = 10) {
      this.$store.dispatch('user/qualificationsSearch', { query: { search_text: search, limit: limit } });
    },
    search(query) {
      this.qualificationsSearch(query);
    },
    resetUni() {
      this.organization = null;
    },
    removeUser(userParam) {
      if (this.trainers) {
        this.select[userParam.pivot.member_id] = false;
      } else {
        this.select[userParam.id] = false;
      }
      if (this.trainers) {
        this.selectedUsers = this.selectedUsers.filter(user => user.pivot.member_id != userParam.pivot.member_id);
      } else {
        this.selectedUsers = this.selectedUsers.filter(user => user.id != userParam.id);
      }
      this.inPopup = true;
      this.Refresh();
    },
    Refresh(query) {
      if (this.system != 'SC') {
        this.$store.dispatch('university/universities');
      } else {
        this.$store.dispatch('directorate/directorates');
      }
      if (this.type == 1) {
        if (this.system == 'SC') {
          this.$store.dispatch('user/users', { query: { ...query, role: [68, 70,83], submission_id: this.$route.params.id } });
        } else {
          this.$store.dispatch('user/users', { query: { ...query, role: [67, 69], submission_id: this.$route.params.id } });
        }
        if (this.inPopup) return;
        if (this.selectedLeader.length) {
          if (this.selectedLeader[0].id == this.leader) {
            this.selectedUsers = this.selectedLeader;
            this.select[this.leader] = true;
          } else {
            this.selectedUsers = this.tempSelected;
            if (this.selectedUsers.length) this.select[this.leader] = true;
          }
        } else if (this.leader) {
          this.selectedUsers = this.$store.getters['submission/selectedTeam'].all_members.filter(member => member.team_job == this.type);
          this.select[this.selectedUsers[0].id] = true;
        }
      } else if (this.type == 2) {
        if (this.system == 'SC') {
          if (this.trainers) {
            this.$store.dispatch('user/users', { query: { ...query, role: [83], submission_id: this.$route.params.id } });
          } else {
            this.$store.dispatch('user/users', { query: { ...query, role: [68, 70,83], submission_id: this.$route.params.id } });
          }
        } else {
          this.$store.dispatch('user/users', { query: { ...query, role: [67, 69, 81], submission_id: this.$route.params.id } });
        }
        if (this.inPopup) return;
        if (this.selectedMembers.length) {
          if (this.selectedMembers.length) {
            if (this.trainers) {
              this.selectedUsers = this.selectedMembers.filter(user => {
                return this.members.some(f => {
                  return f == user.pivot.member_id;
                });
              });
            } else {
              this.selectedUsers = this.selectedMembers.filter(user => {
                return this.members.some(f => {
                  return f == user.id;
                });
              });
            }
            this.members.forEach(element => {
              this.select[element] = true;
            });
          }
        } else if (this.members.length) {
          if (this.trainers) {
            if (this.selectedUsers.length) return;
            this.selectedUsers = this.$store.state.course.trainers.filter(user => {
              return this.members.some(f => {
                return f == user.pivot.member_id;
              });
            });
          } else {
            if (this.selectedUsers.length) return;
            this.selectedUsers = this.$store.getters['submission/selectedTeam'].all_members.filter(user => {
              return this.members.some(f => {
                return f == user.id;
              });
            });
          }

          this.members.forEach(element => {
            this.select[element] = true;
          });
        }
      } else if (this.type == 3) {
        if (this.system == 'SC') {
          this.$store.dispatch('user/users', { query: { ...query, role: [68, 83, 70], submission_id: this.$route.params.id } });
        } else {
          this.$store.dispatch('user/users', { query: { ...query, role: [67, 81], submission_id: this.$route.params.id } });
        }
        if (this.inPopup) return;
        if (this.selectedObserve.length) {
          if (this.selectedObserve.length) {
            this.selectedUsers = this.selectedObserve.filter(user => {
              return this.observe.some(f => {
                return f == user.id;
              });
            });
            this.observe.forEach(element => {
              this.select[element] = true;
            });
          }
        } else if (this.observe.length) {
          this.selectedUsers = this.$store.getters['submission/selectedTeam'].all_members.filter(user => {
            return this.observe.some(f => {
              return f == user.id;
            });
          });
          this.observe.forEach(element => {
            this.select[element] = true;
          });
        }
      } else if (this.type == 4) {
        if (this.system == 'SC') {
          this.$store.dispatch('user/users', { query: { ...query, role: [68, 70,83], submission_id: this.$route.params.id } });
        } else {
          this.$store.dispatch('user/users', { query: { ...query, role: [69, 67], submission_id: this.$route.params.id } });
        }
        if (this.inPopup) return;
        if (this.selectedCommittees.length) {
          if (this.selectedCommittees.length) {
            this.selectedUsers = this.selectedCommittees.filter(user => {
              return this.committee.some(f => {
                return f == user.id;
              });
            });
            this.committee.forEach(element => {
              this.select[element] = true;
            });
          }
        } else if (this.committee.length) {
          this.selectedUsers = this.$store.getters['submission/selectedTeam'].all_members.filter(user => {
            return this.committee.some(f => {
              return f == user.id;
            });
          });
          this.committee.forEach(element => {
            this.select[element] = true;
          });
        }
      } else if (this.type == 5) {
        this.$store.dispatch('user/users', { query: { ...query, role: [69, 67], submission_id: this.$route.params.id } });
        if (this.inPopup) return;
        if (this.selectedreviewers.length) {
          if (this.selectedreviewers.length) {
            this.selectedUsers = this.selectedreviewers.filter(user => {
              return this.reviewers.some(f => {
                return f == user.id;
              });
            });
            this.reviewers.forEach(element => {
              this.select[element] = true;
            });
          }
        } else if (this.reviewers.length) {
          this.selectedUsers = this.$store.getters['submission/selectedTeam'].all_members.filter(user => {
            return this.reviewers.some(f => {
              return f == user.id;
            });
          });
          this.reviewers.forEach(element => {
            this.select[element] = true;
          });
        }
      } else if (this.type == 6) {
        if (this.removed) {
          this.select[this.removed] = false;
        }
      }
    },

    cancel() {
      this.selectedUsers.forEach(element => {
        this.select[element.id] = false;
      });
      this.selectedUsers = [];
      this.inPopup = false;
      this.$emit('closeDialog', { type: this.type });
      this.resetSearch = 2;
    },

    saveUser() {
      this.$emit('saveTeam', { users: this.selectedUsers, type: this.type });
      this.tempSelected = this.selectedUsers;
      this.cancel();
      this.resetSearch = 3;
    },

    selected(item) {
      if (this.type == 1) {
        if (this.select[item.id]) {
          if (this.tempSelected.length) {
            if (this.tempSelected[0].id) this.select[this.tempSelected[0].id] = false;
          }

          if (this.selectedUsers.length) {
            this.select[this.selectedUsers[0].id] = false;
            this.selectedUsers = [];
          }
          this.selectedUsers[0] = { ar_name: item.ar_name, id: item.id };
          this.select[item.id] = true;
        } else {
          this.select[item.id] = false;
          this.selectedUsers = [];
        }
      } else if (this.type == 2) {
        if (this.select[item.id] || (item.pivot && this.select[item.pivot.member_id])) {
          if (false) {
            if (item.pivot) {
              this.select[item.pivot.member_id] = false;
            } else {
              this.select[item.id] = false;
            }
            if (this.trainers) {
              this.selectedUsers = this.selectedUsers.filter(user => user.pivot.member_id != item.id);
            } else {
              this.selectedUsers = this.selectedUsers.filter(user => user.id != item.id);
            }
            this.$notify({ type: 'error', message: this.$t('Global.memberMessage') });
            return false;
          } else {
            this.selectedUsers.push({ ar_name: item.ar_name, id: item.id, pivot: { member_id: item.id } });
          }
        } else {
          if (item.pivot) {
            this.select[item.pivot.member_id] = false;
          } else {
            this.select[item.id] = false;
          }
          if (this.trainers) {
            this.selectedUsers = this.selectedUsers.filter(user => (user.pivot ? user.pivot.member_id != item.id : user.id != item.id));
          } else {
            this.selectedUsers = this.selectedUsers.filter(user => user.id != item.id);
          }
        }
      } else if (this.type == 3) {
        if (this.select[item.id]) {
          if (this.selectedUsers.length >= 3) {
            this.select[item.id] = false;
            this.selectedUsers = this.selectedUsers.filter(user => user.id != item.id);
            this.$notify({ type: 'error', message: this.$t('Global.observeMessage') });
            return false;
          } else {
            this.selectedUsers.push({ ar_name: item.ar_name, id: item.id });
          }
        } else {
          this.select[item.id] = false;
          this.selectedUsers = this.selectedUsers.filter(user => user.id != item.id);
        }

        // if (this.select[item.id]) {
        //   if (this.tempSelected.length) {
        //     if (this.tempSelected[0].id) this.select[this.tempSelected[0].id] = false;
        //   }

        //   if (this.selectedUsers.length) {
        //     this.select[this.selectedUsers[0].id] = false;
        //     this.selectedUsers = [];
        //   }
        //   this.selectedUsers[0] = { ar_name: item.ar_name, id: item.id };
        //   this.select[item.id] = true;
        // } else {
        //   this.select[item.id] = false;
        //   this.selectedUsers = [];
        // }
      } else if (this.type == 4) {
        if (this.select[item.id]) {
          if (this.selectedUsers.length >= 2) {
            this.select[item.id] = false;
            this.selectedUsers = this.selectedUsers.filter(user => user.id != item.id);
            this.$notify({ type: 'error', message: this.$t('Global.comitteeMessage') });
            return false;
          } else {
            this.selectedUsers.push({ ar_name: item.ar_name, id: item.id });
          }
        } else {
          this.select[item.id] = false;
          this.selectedUsers = this.selectedUsers.filter(user => user.id != item.id);
        }
      } else if (this.type == 5) {
        if (this.select[item.id]) {
          if (this.selectedUsers.length >= 2) {
            this.select[item.id] = false;
            this.selectedUsers = this.selectedUsers.filter(user => user.id != item.id);
            this.$notify({ type: 'error', message: this.$t('Global.comitteeMessage') });
            return false;
          } else {
            this.selectedUsers.push({ ar_name: item.ar_name, id: item.id });
          }
        } else {
          this.select[item.id] = false;
          this.selectedUsers = this.selectedUsers.filter(user => user.id != item.id);
        }
      }
    },

    // selected(item) {
    //   // console.log('Selected true', this.$store.state.members );
    //   if (this.select[item.id]) {
    //     console.log('item.id', item, 'sdsd=>', this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('LEADER')));
    //     // if (this.$store.getters['submission/selectedTeam'] && this.inputType == 'president') {
    //     //   if (item.id != this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('LEADER'))) {
    //     //     this.select[this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('LEADER'))] = false;
    //     //     this.selectedUsers = [];
    //     //     this.select[item.id] = true;
    //     //     if (this.$store.state.leader) {
    //     //       console.log('this.$store.state.leader', this.$store.state.leader);
    //     //       this.select[this.$store.state.leader[0].id] = false;
    //     //     //   this.selectedUsers = [];
    //     //     //  this.selectedUsers.push({ ar_name: item.ar_name, id: item.id });
    //     //       this.select[item.id] = true;
    //     //     }
    //     //   }
    //     // }
    //     if (this.inputType == 'president') {
    //       if (this.$store.getters['submission/selectedTeam']) {
    //         this.select[this.getTeamMember(this.$store.getters['submission/selectedTeam'], this.constants('LEADER'))] = false;
    //         this.selectedUsers = [];
    //       }

    //       if (this.$store.state.leader) {
    //         this.selectedUsers = [];
    //         this.select[this.$store.state.leader[0].id] = false;
    //       }
    //       this.selectedUsers[0] = { ar_name: item.ar_name, id: item.id };
    //     } else {
    //       this.selectedUsers.push({ ar_name: item.ar_name, id: item.id });
    //     }
    //     // console.log("this.$store.state.leader",this.selectedUsers);
    //     this.$store.state.leader ? true : this.$store.commit('set', ['leader', []]);
    //     this.$store.state.members ? true : this.$store.commit('set', ['members', []]);
    //     this.$store.state.observe ? true : this.$store.commit('set', ['observe', []]);
    //     if (this.type === 1 && this.selectedUsers.length <= 1) {
    //       return this.$store.commit('set', ['leader', this.selectedUsers]);
    //     } else if (this.type === 2 && this.selectedUsers.length <= 4) {
    //       return this.$store.commit('set', ['members', this.selectedUsers.slice(0, 4)]);
    //     } else if (this.type === 3 && this.selectedUsers.length <= 1) {
    //       return this.$store.commit('set', ['observe', this.selectedUsers]);
    //     } else {
    //       this.select[item.id] = false;
    //       this.selectedUsers = this.selectedUsers.filter(function(user) {
    //         return user.id !== item.id;
    //       });

    //       if (this.type === 1) {
    //         this.$notify({ type: 'error', message: this.$t('Global.leaderMessage') });
    //       } else if (this.type === 2) {
    //         this.$notify({ type: 'error', message: this.$t('Global.memberMessage') });
    //       } else {
    //         this.$notify({ type: 'error', message: this.$t('Global.observeMessage') });
    //       }
    //     }
    //   } else {
    //     this.selectedUsers = this.selectedUsers.filter(function(user) {
    //       return user.id !== item.id;
    //     });
    //     this.$store.state.leader ? true : this.$store.commit('set', ['leader', []]);
    //     this.$store.state.members ? true : this.$store.commit('set', ['members', []]);
    //     this.$store.state.observe ? true : this.$store.commit('set', ['observe', []]);
    //     if (this.type === 1 && this.selectedUsers.length <= 1) {
    //       return this.$store.commit('set', ['leader', this.selectedUsers]);
    //     } else if (this.type === 2 && this.selectedUsers.length <= 4) {
    //       return this.$store.commit('set', ['members', this.selectedUsers.slice(0, 4)]);
    //     } else if (this.type === 3 && this.selectedUsers.length <= 1) {
    //       return this.$store.commit('set', ['observe', this.selectedUsers]);
    //     } else {
    //       this.select[item.id] = false;
    //       this.selectedUsers = this.selectedUsers.filter(function(user) {
    //         return user.id !== item.id;
    //       });

    //       if (this.type === 1) {
    //         this.$notify({ type: 'error', message: this.$t('Global.leaderMessage') });
    //       } else if (this.type === 2) {
    //         this.$notify({ type: 'error', message: this.$t('Global.memberMessage') });
    //       } else {
    //         this.$notify({ type: 'error', message: this.$t('Global.observeMessage') });
    //       }
    //     }
    //   }
    // },
    resetAll() {
      this.qualification = null;
      this.specification = null;
    },
    resetSpecification() {
      this.specification = null;
    },
    reset() {
      this.level = null;
      this.role_job = null;
      this.qualification = null;
      this.specification = null;
      this.degree = null;
      this.university = null;
      this.organization = null;
      this.collage = null;
      this.role = null;
      this.count = null;
    },
  },
};
</script>

<style lang="scss">
@keyframes fadeInUp {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
.animate {
  opacity: 0;
  -webkit-animation: fadeInUp 0.3s ease-in-out 0s forwards;
  animation: fadeInUp 0.3s ease-in-out 0s forwards;
}
.custom_check_user {
  .el-checkbox:last-of-type {
    margin-right: 0;
  }
}
</style>
