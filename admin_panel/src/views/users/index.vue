<template>
  <div>
    <DataTable
      :items="$store.getters['user/users']"
      @Refresh="Refresh"
      :loading="$store.getters['user/usersLoad']"
      :name="$t('user.users')"
      :total="$store.getters['user/totalUsers']"
      icon="el-icon-user"
      @show="show"
      v-if="hasPermission('show_users')"
      :role="role"
      :directorate="directorate"
      :administration="administration"
      :available="available"
      :degree_level="level"
      :degree_qualification_id="qualification"
      :degree_specification_id="specification"
      :level="education_level_id"
      :qualification="qualification_id"
      :specification="specification_id"
      :degree="degree"
      :count="count"
      :role_job="role_job"
      :system="staticSystem"
      :SCgender="gender"
      :age="age"
      wallet
      :componentType="'user'"
      :apply_to="apply_to"
      :university_id="university"
      :organization_id="organization"
      :collage="collage"
      :qualification_name="qualification_name"
      :qualifications_ids="data_ids"
      :hidden_action="hasPermission('admin_users') ? false : true"
      @reset="reset"
      permission="admin_users"
    >
      <template #action_table>
        <router-link to="/users/user/add">
          <div class="item"><i class="el-icon-user"></i> {{ $t('users.addUsers') }}</div>
        </router-link>
        <a :href="`${baseUrl}users/export`" target="_blank">
          <div class="item">
            <fa-icon :icon="['fas', 'file-excel']" size="lg" />
            {{ $t('Global.user_file') }}
          </div>
        </a>
        <!-- <div class="item"><i class="el-icon-folder-opened"></i> {{ $t('users.export_file') }}</div> -->
        <!-- <div class="item"><i class="el-icon-printer"></i> {{ $t('users.export_pdf') }}</div> -->
      </template>
      <template #filter_table>
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
          <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.userStatus')" style="width: 100%" v-model="available">
            <el-option class="el-input" :value="1" :label="$t('Global.available')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.available') }}
              </span>
            </el-option>
            <el-option class="el-input" :value="0" :label="$t('Global.unavailable')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.unavailable') }}
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select ref="role" clearable :no-data-text="$t('Global.nodata')" :placeholder="$t('roles.selectRole')" style="width: 100%" v-model="role" filterable>
            <el-option v-for="role in $store.getters['user/roles']" :key="role.id" :label="role.name" :value="role.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ role.name }}
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.gender')" style="width: 100%" v-model="gender">
            <el-option class="el-input" :value="1" :label="$t('Global.man')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.man') }}
              </span>
            </el-option>
            <el-option class="el-input" :value="2" :label="$t('Global.women')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.women') }}
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
          <el-select ref="count" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="age" :placeholder="$t('Global.userAge')">
            <el-option :label="$t('Global.all')" :value="1" clearable>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.all') }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <el-option :label="`18 < ${$t('Global.userAge')} <= 30`" :value="2">
              <span style="float: right; color: #8492a6; font-size: 13px; display: flex; justify-content: space-between; align-items: center; gap: 8px">
                <span>{{ '18 <' }}</span>
                <span>{{ $t('Global.userAge') }}</span>
                <span>{{ '<= 30' }}</span>
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <el-option :label="`30 < ${$t('Global.userAge')} <= 50`" :value="3">
              <span style="float: right; color: #8492a6; font-size: 13px; display: flex; justify-content: space-between; align-items: center; gap: 8px">
                <span>{{ '30  <' }}</span>
                <span>{{ $t('Global.userAge') }}</span>
                <span>{{ '<= 50' }}</span>
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <el-option :label="`50 <  ${$t('Global.userAge')}`" :value="4">
              <span style="float: right; color: #8492a6; font-size: 13px; display: flex; justify-content: space-between; align-items: center; gap: 8px">
                <span>{{ '50  <' }}</span>
                <span>{{ $t('Global.userAge') }}</span>
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.edu_type')" style="width: 100%" v-model="staticSystem" @change="resetAll">
            <el-option class="el-input" :value="1" :label="$t('Global.HEstatistc')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.HEstatistc') }}
              </span>
            </el-option>
            <el-option class="el-input" :value="2" :label="$t('Global.SCstatistc')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.SCstatistc') }}
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth" v-if="staticSystem === 2">
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
        <div class="ml-2 mr-2 mb-2 fullWidth" v-if="staticSystem === 2">
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
        <div class="ml-2 mr-2 mb-2 fullWidth" v-if="staticSystem === 1">
          <el-select :disabled="staticSystem == null" clearable :no-data-text="$t('Global.nodata')" v-model="university" @clear="resetUni" ref="uni" filterable :placeholder="$t('Global.selectUniversity')" style="width: 100%">
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
        <div class="ml-2 mr-2 mb-2 fullWidth" v-if="staticSystem === 1">
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select ref="count" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="count" :placeholder="$t('Global.count')">
            <el-option :label="$t('Global.all')" :value="0" clearable>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.all') }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <el-option :label="`${$t('Global.count')} = 0`" :value="4">
              <span style="float: right; color: #8492a6; font-size: 13px; display: flex; justify-content: space-between; align-items: center; gap: 8px">
                <span>{{ $t('Global.count') }}</span>
                <span>{{ '= 0' }}</span>
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <el-option :label="`0 < ${$t('Global.count')} <= 5`" :value="1">
              <span style="float: right; color: #8492a6; font-size: 13px; display: flex; justify-content: space-between; align-items: center; gap: 8px">
                <span>{{ '0  <' }}</span>
                <span>{{ $t('Global.count') }}</span>
                <span>{{ '<= 5' }}</span>
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <el-option :label="`5 < ${$t('Global.count')} <= 10`" :value="2">
              <span style="float: right; color: #8492a6; font-size: 13px; display: flex; justify-content: space-between; align-items: center; gap: 8px">
                <span>{{ '5  <' }}</span>
                <span>{{ $t('Global.count') }}</span>
                <span>{{ '<= 10' }}</span>
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <el-option :label="`10 <  ${$t('Global.count')}`" :value="3">
              <span style="float: right; color: #8492a6; font-size: 13px; display: flex; justify-content: space-between; align-items: center; gap: 8px">
                <span>{{ '10  <' }}</span>
                <span>{{ $t('Global.count') }}</span>
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
        <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
        <el-table-column prop="name" :label="$t('users.name')" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.ar_name" placement="top-start">
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                {{ scope.row.ar_name }}
              </div>
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
                  <div class="small text-muted">{{ ` ${scope.row.university}` }}</div>
                </span>
              </div>
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                <router-link :to="{ path: `/higher/organization/${scope.row.organization_id}` }">
                  {{ scope.row.organization }}
                </router-link>
                <div class="small text-muted" v-if="scope.row.university">{{ `${scope.row.university}` }}</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="degree_qualification_id" :label="$t('Global.qualifications')" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.level">{{ scope.row.level + ',' }}</span>
            <span v-if="scope.row.qualification">{{ scope.row.qualification + ',' }}</span>
            <span v-if="scope.row.specification">{{ scope.row.specification }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="degree_specification_id" width="130" :label="$t('Global.specification')" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.degree_level">{{ scope.row.degree_level + ',' }}</span>
            <span v-if="scope.row.degree_qualification">{{ scope.row.degree_qualification + ',' }}</span>
            <span v-if="scope.row.degree_specifications">{{ scope.row.degree_specifications }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="job_title" :label="$t('Global.job_title')" sortable>
          <template slot-scope="scope">
            <div>{{ scope.row.job_title || '-' }}</div>
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
        <el-table-column prop="age" width="50" :label="$t('Global.userAge')"></el-table-column>
        <el-table-column prop="email" width="150" :label="$t('users.contact')">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="`${scope.row.email ? scope.row.email : ''} ${scope.row.mobile ? scope.row.mobile : ''}`" placement="top-start">
              <div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  {{ scope.row.email }}
                </div>
                <CBadge color="info" style="margin: 0 5px">{{ scope.row.mobile }}</CBadge>
                <CBadge :color="getApplyTo(scope.row.apply_to)">
                  <span v-if="scope.row.apply_to === 1">{{ $t('Global.trainee') }}</span>
                  <span v-else-if="scope.row.apply_to === 2">{{ $t('Global.pre_university') }}</span>
                  <span v-else-if="scope.row.apply_to === 3">{{ $t('Global.higher_education') }}</span>
                  <span v-else>{{ $t('Global.old_system') }}</span>
                </CBadge>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--                <el-table-column prop="mobile" :label="$t('users.mobile')"></el-table-column>-->
        <el-table-column prop="removed" width="50" :label="$t('users.status')" v-if="hasPermission('admin_users')">
          <template slot-scope="scope">
            <CBadge :color="getBadge(scope.row.removed)">
              <span v-if="scope.row.removed == 0">{{ $t('Global.active') }}</span>
              <span v-if="scope.row.removed == 1">{{ $t('Global.remove') }}</span>
              <span v-if="scope.row.removed == 2">{{ $t('Global.inProgress') }}</span>
            </CBadge>
          </template>
        </el-table-column>

        <el-table-column prop="" label=" " width="100">
          <template slot-scope="scope">
            <div class="d-flex justify-content-center align-items-center flex-wrap" :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
              <el-tooltip effect="dark" :content="$t('Global.acceptUser')" placement="top-start">
                <el-button icon="el-icon-check" v-if="scope.row.removed === 2" @click="approve(scope.row.id)" size="mini" circle class="mx-1 right_icon" type="success"></el-button>
              </el-tooltip>
              <router-link :to="show(scope.row.id)">
                <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
              </router-link>
              <i v-if="scope.row.removed == 0 && hasPermission('admin_users')" class="el-icon-delete table-action-item" @click="deleteUser(scope.row.id)"></i>
            </div>
          </template>
        </el-table-column>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '../components/DataTable';
export default {
  name: 'users',
  components: { DataTable },
  data() {
    return {
      dangerModal: false,
      item: {},
      roles: [
        { id: 1, name: 'رئيس' },
        { id: 2, name: 'عضو' },
        { id: 3, name: 'روضة' },
      ],
      disabled: true,
      data_ids: [],
      directorate: null,
      qualification_name: null,
      admin_disabled: true,
      qualification_edu_status: true,
      specification_edu_status: true,
      education_level_id: null,
      specification_id: null,
      qualification_id: null,
      administration: null,
      baseUrl: process.env.VUE_APP_BASE_URL,
      staticSystem: 1,
      gender: null,
      age: null,
      role_job: null,
      level: this.$store.state.level ? this.$store.state.level : null,
      apply_to: this.$store.state.apply_to ? this.$store.state.apply_to : null,
      qualification: this.$store.state.qualification ? this.$store.state.qualification : null,
      specification: this.$store.state.specification ? this.$store.state.specification : null,
      degree: this.$store.state.degree ? this.$store.state.degree : null,
      university: this.$store.state.university_user ? this.$store.state.university_user : null,
      organization: this.$store.state.organization_id_user ? this.$store.state.organization_id_user : null,
      collage: this.$store.state.collage ? this.$store.state.collage : null,
      count: this.$store.state.count ? this.$store.state.count : null,
      qualification_status: this.$store.state.level ? false : true,
      specification_status: this.$store.state.qualification ? false : true,
      role: this.$store.state.role ? this.$store.state.role : null,
      available: 1,
    };
  },
  watch: {
    university: function (val) {
      this.$store.commit('set', ['university_user', val]);
      if (val || val == 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
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
    staticSystem: function (val) {
      this.$store.commit('set', ['staticSystem', val]);
    },
    specification: function (val) {
      this.$store.commit('set', ['specification', val]);
      val ? this.$refs.specification.blur() : '';
    },
    role: function (val) {
      this.$store.commit('set', ['role', val]);
      val ? this.$refs.role.blur() : '';
    },
    degree: function (val) {
      this.$store.commit('set', ['degree', val]);
      val ? this.$refs.degree.blur() : '';
    },
    count: function (val) {
      this.$store.commit('set', ['count', val]);
      val ? this.$refs.count.blur() : '';
    },
    apply_to: function (val) {
      this.$store.commit('set', ['apply_to', val]);
      val ? this.$refs.count.blur() : '';
    },
    collage: function (val) {
      this.$store.commit('set', ['collage', val]);
      val ? this.$refs.collage.blur() : '';
    },
    // university: function(val) {
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
  mounted() {
    this.init();
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
    init() {
      this.$store.dispatch('university/universities');
      this.$store.dispatch('directorate/directorates');
    },
    changeStatus(status) {
      this.$confirm(this.$t('Global.confirm'), 'Warning', {
        confirmButtonText: 'حفظ',
        cancelButtonText: 'ألغاء',
        type: 'warning',
      })
        .then(() => {
          //   this.$message({
          //     type: 'success',
          //     message: this.$t('Global.successMessage'),
          //   });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('Global.errorMessage'),
          });
        });
    },
    Refresh(query) {
      this.$store.dispatch('user/users', { query: query });
    },
    getBadge(status) {
      switch (status) {
        case 0:
          return 'success';
        case 1:
          return 'danger';
        case 2:
          return 'warning';
        default:
          return 'primary';
      }
    },
    getApplyTo(status) {
      switch (status) {
        case 1:
          return 'info';
        case 2:
          return 'warning';
        case 3:
          return 'success';
        case null:
          return 'info';
        default:
          'primary';
      }
    },
    show(id) {
      return `/users/${id}`;
    },
    reset() {
      this.level = null;
      this.qualification = null;
      this.directorates = null;
      this.staticSystem = 1;
      this.admin_disabled = null;
      this.degree = null;
      this.university = null;
      this.collage = null;
      this.role = null;
      this.count = null;
      this.apply_to = null;
    },
    edit(id) {
      this.$router.push(`/users/user/edit/${id}`);
    },
    // openModel(item) {
    //   this.item = item;
    //   this.dangerModal = true;
    // },
    resetAll() {
      this.qualification = null;
      this.specification = null;
    },
    resetSpecification() {
      this.specification = null;
    },
    approve(id) {
      this.$store.dispatch('user/approve', id).then(() => {
        this.$notify({
          type: 'success',
          message: this.$t('Global.approveMessage'),
        });
        let query = { limit: 5, offset: 0, search_text: '', removed: 0 };
        this.Refresh(query);
      });
    },
    deleteUser(id) {
      let query = { limit: 5, offset: 0, removed: 0 };
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.$store
          .dispatch('user/delete', { id: id })
          .then(_ => {
            this.$notify.success({
              message: `${this.$t('Global.successMessage')}`,
            });
            this.Refresh(query);
          })
          .catch(_ => {});
      });

      //   this.dangerModal = false;
    },
  },
};
</script>
<style lang="scss">
.custom_drop {
  .el-button-group > .el-button {
    float: left !important;
  }
  .el-button--mini,
  .el-button--small {
    font-size: 14px !important;
  }
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 3px 6px;
  }
}
.approve_users .cell {
  text-overflow: unset;
}
.cell {
  font-size: 12px;
}
@media only screen and (max-width: 820px) {
  .page-item {
    margin-left: 1px !important;
    margin-right: 1px !important;
  }
}
.page-item {
  margin-left: 5px;
  margin-right: 5px;
}

.page-link {
  border-radius: 50%;
}
</style>
