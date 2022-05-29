<template>
  <CRow class="no-gutters">
    <div v-if="user"  :class="`${option? 'switch_view ml-2' : 'active switch_view ml-2'}`" style="display: inline-flex">
      <span :class="`${option ? `${$i18n.locale === 'en' ? 'h6 mr-2' : 'h6 ml-2'}` : `${$i18n.locale === 'en' ? 'active h6  mr-2' : 'active h6  ml-2'}`}`" style=" cursor: pointer; margin: 0 0" @click="option = false">{{ $t('Global.coach') }}</span>
      <span :class="`${option ? 'active h6' : 'h6'}`" style=" cursor: pointer; margin: 0 0" @click="option = true">{{ $t('Global.trainee') }}</span>
    </div>
    <CCol col="12" lg="12">
      <DataTable
        :items="$store.state.course.reservations"
        @Refresh="Refresh"
        :range="DateRange ? DateRange.toString() : ''"
        :course_id="course_id"
        :place="place"
        hidden_action
        :expired="expired"
        :option="option"
        :code_plan="code_plan"
        :area_type="area_type"
        :level="level"
        :period="period"
        :user="user"
        @reset="reset"
        :loading="$store.state.course.reservationsLoad"
        :name="$t('Global.subscriptionsTR')"
        :total="$store.getters['course/totalcourses']"
        icon="el-icon-office-building"
        @show="show"
        permission="admin_courses"
        v-if="hasPermission('access_plans')"
      >
        <!--    <template #action_table>-->
        <!--      <router-link v-if="hasPermission('edit_submissions')" :to="{ path: `/course/courses/add` }">-->
        <!--        <div class="item">-->
        <!--          <i class="el-icon-plus"></i>-->
        <!--          {{ $t('Global.add_course') }}-->
        <!--        </div>-->
        <!--      </router-link>-->
        <!--    </template>-->
        <template #filter_table>
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
            <el-select filterable clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="course_id" :placeholder="$t('Global.course')">
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
            <el-select clearable filterable :no-data-text="$t('Global.nodata')" ref="level" :placeholder="$t('Global.alert')" style="width: 100%" v-model="level">
              <el-option-group v-for="(group, key) in subLevels" :label="$t(`Global.course_state_${key}`)" class="cuctom_select_group">
                <el-option v-for="item in group" :key="item.id" :label="item.title" :value="item.id" class="pr-2">
                  <span style="float: right; font-size: 13px">
                    {{ item.title }}
                  </span>
                </el-option>
              </el-option-group>

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
            <el-date-picker clearable popper-class="custom-date-picker switch_date_picker" class="fullWidth" v-model="DateRange" type="daterange" format="yy-MM-d" value-format="yyyy-MM-d" unlink-panels :start-placeholder="$t('Global.from')" :end-placeholder="$t('Global.to')"></el-date-picker>
            <!-- <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="info badge-pill">{{ $t('Global.visit') }}</CBadge> -->
          </div>
        </template>
        <template #cols>
          <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
          <el-table-column prop="course" :label="$t('Global.course')" sortable width="150">
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <span>{{ scope.row.course }} <br /></span>
                  <div class="small text-muted">
                    {{ `${$t('Global.submitted_at')} :${scope.row.created_at ? toLocalDatetime(scope.row.created_at, 'ar', false) : '_'}` }}
                  </div>
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder">
                    {{ scope.row.course }}
                  </span>
                  <div class="small text-muted">
                    {{ `${$t('Global.submitted_at')} :${scope.row.created_at ? toLocalDatetime(scope.row.created_at, 'ar', false) : '_'}` }}
                  </div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="trainee" :label="$t('Global.trainee')" sortable width="100">
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <span>{{ scope.row.trainee }} <br /><br /> </span>
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder" :to="scope.row.course_id ? { path: `/higher/course/${scope.row.course_id}` } : { path: `/higher/course/${scope.row.id}` }">
                    {{ scope.row.trainee }}
                  </span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('Global.coursePrice')" width="100" sortable>
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <span>{{ scope.row.price }} <br /><br /> </span>
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder" :to="scope.row.course_id ? { path: `/higher/course/${scope.row.course_id}` } : { path: `/higher/course/${scope.row.id}` }">
                    {{ scope.row.price }}
                  </span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="place_id" :label="$t('Global.coursePlace')" sortable>
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <span>{{ scope.row.place }} <br /><br /> </span>
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  {{ scope.row.place }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="start" :label="$t('Global.courseStart')" sortable>
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <span>{{ DateFormat(scope.row.start) }} <br /><br /> </span>
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder" :to="scope.row.course_id ? { path: `/higher/course/${scope.row.course_id}` } : { path: `/higher/course/${scope.row.id}` }">
                    {{ DateFormat(scope.row.start) }}
                  </span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="end" :label="$t('Global.courseEnd')" sortable>
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <span>{{ DateFormat(scope.row.end) }} <br /><br /> </span>
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder" :to="scope.row.course_id ? { path: `/higher/course/${scope.row.course_id}` } : { path: `/higher/course/${scope.row.id}` }">
                    {{ DateFormat(scope.row.end) }}
                  </span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="alert" :label="$t('Global.alert')" sortable>
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <span>{{ scope.row.alert }} <br /><br /> </span>
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder">
                    <CBadge color="info" dir="ltr" class="text-center" style="font-size: 10px"> {{ scope.row.alert }}</CBadge>
                  </span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" width="100" sortable :label="$t('Global.updated')">
            <template slot-scope="scope">
              <div v-if="scope.row.updated_at">
                <small class="d-block">{{ DateFormat(scope.row.updated_at) }}</small>
                <CBadge color="info" dir="ltr" class="text-center" style="font-size: 10px"><i class="el-icon-time"></i> {{ scope.row.updated_time }} </CBadge>
              </div>
              <div v-else class="text-center">_</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label=" " width="70">
            <template slot-scope="scope">
              <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                <router-link :to="`/course/reservations/reservation/${scope.row.id}`">
                  <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
                </router-link>
              </div>
            </template>
          </el-table-column>
        </template>
      </DataTable>
    </CCol>
  </CRow>
</template>

<script>
import DataTable from '../components/DataTable';
import * as helper from '../../utils/helper';

export default {
  name: 'courses',
  components: { DataTable },
  props: {
    user: Number,
    system_type: String,
  },
  data() {
    return {
      option: true,
      course_id: this.$store.state.course_id ? this.$store.state.course_id : null,
      code_plan: this.$store.state.code_plan ? this.$store.state.code_plan : null,
      area_type: this.$store.state.area_type ? this.$store.state.area_type : null,
      period: this.$store.state.period ? this.$store.state.period : null,
      place: this.$store.state.place ? this.$store.state.place : null,
      DateRange: this.$store.state.plan_DateRange ? this.$store.state.plan_DateRange : null,
      expired: this.$store.state.expired ? this.$store.state.expired : 0,
      level: this.$store.state.tr_level ? this.$store.state.tr_level : null,
    };
  },
  watch: {
    course_id: function (val) {
      this.$store.commit('set', ['course_id', val]);
    },
    code_plan: function (val) {
      this.$store.commit('set', ['code_plan', val]);
    },
    area_type: function (val) {
      this.$store.commit('set', ['area_type', val]);
    },
    period: function (val) {
      this.$store.commit('set', ['period', val]);
    },
    place: function (val) {
      this.$store.commit('set', ['place', val]);
    },
    DateRange: function (val) {
      this.$store.commit('set', ['plan_DateRange', val]);
    },
    expired: function (val) {
      this.$store.commit('set', ['expired', val]);
    },
    level: function (val) {
      this.$store.commit('set', ['tr_level', val]);
    },
  },
  computed: {
    lookups: function () {
      if (this.$store.state.course.lookups) {
        return this.$store.state.course.lookups;
      }
    },
    subLevels: function () {
      if (!this.lookups.alerts) return;
      return this.lookups.alerts;
    },
  },
  methods: {
    reset() {
      this.place = null;
      this.period = null;
      (this.level = null), (this.area_type = null);
      this.code_plan = null;
      this.course_id = null;
      this.DateRange = '';
      this.expired = 0;
    },
    Refresh(query) {
      this.$emit('init', query);
    },
    getBadge(status) {
      switch (status) {
        case 0:
          return 'success';
        case 1:
          return 'danger';
        default:
          'primary';
      }
    },
    DateFormat(date) {
      return helper.toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    show(id) {
      return `/reservations/reservation/${id}`;
    },
  },
};
</script>

<style lang="scss">
.custom-link:hover {
  text-decoration: underline !important;
}

.switch_view {
  margin-bottom: 1rem;
  margin-top: -1rem;
  background-color: #fff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  .active {
    background-color: #eee;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }
  span {
    transition: all 0.2s ease-in-out;
    border-radius: 30px !important;
    padding: 5px 10px !important;
  }
}

@media only screen and (max-width: 740px) {
  .fullWidth {
    width: 100%;

    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
