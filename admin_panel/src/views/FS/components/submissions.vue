<template>
  <div>
    <DataTable
      :items="$store.getters['finance/submissions']"
      @Refresh="Refresh"
      :loading="$store.getters['finance/submissionsLoad']"
      :name="$t('Global.requests')"
      :total="$store.getters['finance/totalSubmission']"
      icon="el-icon-money"
      @reset="reset"
      :university_id="university"
      :organization_id="organization"
      :type_id="type"
      :level="level"
      :course_id="course_id"
      :place="place"
      :expired="expired"
      :code_plan="code_plan"
      :area_type="area_type"
      :period="period"
      :system="Number(system)"
      :visit_type="visit_type"
      hidden_action
      :submission_status="submission_status"
      :range="dateRange ? dateRange.toString() : ''"
      v-if="hasPermission('show_fs')"
    >
      <!-- <template #action_table>
        <a :href="`${baseUrl}finance/export`" target="_blank">
          <div class="item">
            <fa-icon :icon="['fas', 'file-excel']" size="lg" />
            {{ $t('Global.excelFileExport') }}
          </div>
        </a>
      </template> -->
      <template v-if="false" #filter_table>
        <!-- <div v-if="system == 1" class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="university" ref="uni" filterable :placeholder="$t('Global.selectUniversity')" style="width: 100%">
            <el-option v-for="item in $store.getters['university/universities']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name ? item.name : '-' }}
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
        <div v-if="system == 1" class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="organization" filterable ref="org" :disabled="disabled" :placeholder="$t('Global.selectOrganization')" style="width: 100%">
            <el-option v-for="item in $store.getters['organization/organizations']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name ? item.name : '-' }}
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
        <div v-if="system == 1" class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="type" filterable ref="type" :placeholder="$t('Global.selectType')" style="width: 100%">
            <el-option v-for="item in lookups.types" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name ? item.name : '-' }}
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
          <el-date-picker clearable popper-class="custom-date-picker switch_date_picker" class="fullWidth" v-model="dateRange" type="daterange" format="yy-MM-d" value-format="yyyy-MM-d" unlink-panels :start-placeholder="$t('Global.from')" :end-placeholder="$t('Global.to')"></el-date-picker>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="visit_type" filterable ref="visit_type" :placeholder="$t('Global.visit_type')" style="width: 100%">
            <el-option v-for="item in lookups.visit_types" :key="item.id" :label="item.name" :value="item.id">
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable ref="submission_status" :no-data-text="$t('Global.nodata')" v-model="submission_status" style="width: 100%">
            <el-option class="el-input" :value="1" :label="$t('Global.delayed')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.delayed') }}
              </span>
            </el-option>
            <el-option class="el-input" :value="2" :label="$t('Global.all_request')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.all_request') }}
              </span>
            </el-option>
            <el-option class="el-input" :value="3" :label="$t('Global.haveVisit')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.haveVisit') }}
              </span>
            </el-option>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
        <div v-if="system == 1" class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable filterable :no-data-text="$t('Global.nodata')" ref="level" :placeholder="$t('Global.stage')" style="width: 100%" v-model="level">
            <el-option-group :label="$t('Global.selectLevelReport')" style="text-align: center">
              <el-option v-for="item in subLevels" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; font-size: 13px">
                  {{ item.name }}
                </span>
              </el-option>
            </el-option-group>
          </el-select>
        </div>
      </template>
      <template v-else #filter_table>
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select class="fullWidth" ref="expired" v-model="expired" :label="$t('Global.expired')" :placeholder="$t('Global.notExpired')">
            <el-option class="el-input" :value="0" :label="$t('Global.notExpired')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.notExpired') }}
                <i class="el-icon-check"></i>
              </span>
            </el-option>
            <el-option class="el-input" :value="1" :label="$t('Global.expired')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.expired') }}
                <i class="el-icon-close"></i>
              </span>
            </el-option>
          </el-select>
        </div>
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="course_id" :placeholder="$t('Global.name')">
            <el-option v-for="item in lookups.courses" :key="item.id" :label="item.name" :value="item.id">
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="code_plan" :placeholder="$t('Global.code_plan')">
            <el-option v-for="item in lookups.code_plan" :key="item.id" :label="item.name" :value="item.id">
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="area_type" :placeholder="$t('Global.area')">
            <el-option v-for="item in lookups.area_types" :key="item.id" :label="item.name" :value="item.id">
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="period" :placeholder="$t('Global.period')">
            <el-option v-for="item in lookups.periods" :key="item.id" :label="item.name" :value="item.id">
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
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="place" :placeholder="$t('Global.place')">
            <el-option v-for="item in lookups.places" :key="item.id" :label="item.name" :value="item.id">
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
        <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
          <el-date-picker clearable popper-class="custom-date-picker switch_date_picker" class="fullWidth" v-model="dateRange" type="daterange" format="yy-MM-d" value-format="yyyy-MM-d" unlink-panels :start-placeholder="$t('Global.from')" :end-placeholder="$t('Global.to')"></el-date-picker>
        </div> -->
      </template>
      <template  #cols>
        <el-table-column prop="name" :label="$t('Global.organization')" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                <span
                  >{{ scope.row.organization || scope.row.temp_organization_name }} <br /><br />
                  <div class="small text-muted" v-if="scope.row.university">{{ `${scope.row.university || scope.row.temp_university_name}` }}</div>
                </span>
              </div>
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                <span class="font-weight-bolder">
                  {{ scope.row.organization || scope.row.temp_organization_name }}
                </span>
                <div class="small text-muted" v-if="scope.row.university">{{ `${scope.row.university || scope.row.temp_university_name}` }}</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="user_id" width="170" :label="$t('Global.representative')">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                <span>{{ scope.row.ar_name }}</span>
              </div>
              <router-link :to="{ path: `/users/${scope.row.user_id}`.toString() }">
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%"><i class="el-icon-user"></i> {{ scope.row.ar_name }}</div>
              </router-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="system == 1" prop="type" :label="$t('Global.type')"></el-table-column>
        <el-table-column prop="visit_type" :label="$t('Global.visit_type')">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.visit_type" placement="top-start">
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                {{ scope.row.visit_type }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="system == 1" prop="status" width="100" :label="$t('Global.status')">
          <template slot-scope="scope">
            <CBadge color="info" class="ml-1">{{ scope.row.status ? $t(`Global.state_${scope.row.status}`) : $t(`Global.state_1`) }} </CBadge>
          </template>
        </el-table-column>
    
        <el-table-column prop="pay_value" :label="$t('Global.pay_value')">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_value ? scope.row.pay_value : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" width="80" label=" ">
          <template slot-scope="scope">
            <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
              <router-link :to="{ path: `/finance/show/${system}/${scope.row.id}` }">
                <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
              </router-link>
            </div>
          </template>
        </el-table-column>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '../../components/DataTable';
import { toLocalDatetime } from '../../../utils/helper';

export default {
  name: 'finance',
  props:{
      credit_id:Number,
      system:Number,
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      university: null,
      organization: null,
      type: null,
      level: null,
      isLoad: false,
      disabled: true,
      id: null,
      dateRange: '',
      submission_status: 3,
      visit_type: null,
      course_id: null,
      code_plan: null,
      area_type: null,
      period: null,
      place: null,
      expired: 0,
    };
  },
  watch: {
    university: function (val) {
      this.university = val;
      if (val !== null) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
      this.$store.dispatch('organization/organizations', {
        query: { limit: 90, offset: 0, university_id: this.university },
      });
    },
    organization: function (val) {
      this.organization = val;
    },
    type: function (val) {
      this.type = val;
    },
  },
  components: { DataTable },
  mounted() {
    this.$store.dispatch('university/universities');
  },
  computed: {
    subLevels: function () {
      if (this.lookups) {
        return this.lookups.levels.slice(0, 6);
      }
    },
    lookups: function () {
      return this.$store.getters['finance/lookups'];
    },
  },
  methods: {
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    reset() {
      this.university = null;
      this.organization = null;
      this.type = null;
      this.dateRange = '';
      this.submission_status = null;
    },
    Refresh(query) {
      let obj;
      let allQuery;
      if (this.credit_id) {
        obj = { credit_id: this.credit_id };
        allQuery = { ...query, ...obj };
      }
      this.$store.dispatch('finance/submissions', { query: allQuery }).then(_ => {
        this.isLoad = false;
      });
    },
  },
};
</script>

<style scoped></style>
