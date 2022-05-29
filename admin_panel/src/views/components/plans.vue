<template>
  <DataTable
    :range="DateRange ? DateRange.toString() : ''"
    :course_id="course_id"
    :place="place"
    :code_plan="code_plan"
    :area_type="area_type"
    :period="period"
    :expired="expired"
    @Refresh="Refresh"
    :loading="$store.state.course.plansLoad"
    :name="$t('Global.plansName')"
    :total="$store.getters['course/totalcourses']"
    icon="el-icon-office-building"
    cards
    @reset="reset"
    :hidden_action="hasPermission('edit_plans') ? false : true"
    permission="admin_courses"
    v-if="hasPermission('access_plans')"
  >
    <template #action_table>
      <router-link v-if="hasPermission('edit_plans')" :to="{ path: `/course/plans/add` }">
        <div class="item">
          <i class="el-icon-plus"></i>
          {{ $t('Global.add_plan') }}
        </div>
      </router-link>
    </template>
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
        <el-select clearable filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="course_id" :placeholder="$t('Global.course')">
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
        <el-date-picker clearable popper-class="custom-date-picker switch_date_picker" class="fullWidth" v-model="DateRange" type="daterange" format="yy-MM-d" value-format="yyyy-MM-d" unlink-panels :start-placeholder="$t('Global.from')" :end-placeholder="$t('Global.to')"> </el-date-picker>
        <!-- <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="info badge-pill">{{ $t('Global.visit') }}</CBadge> -->
      </div>
    </template>
    <template #cards>
      <CRow class="mt-3" v-loading="$store.state.course.plansLoad">
        <CCol class="pb-3 pr-2" lg="4" sm="12" md="6" v-for="(course, index) in $store.state.course.plans" :key="index">
          <el-card shadow="hover" class="position-relative" style="overflow: visible" :body-style="{ padding: '0px' }">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">
                {{ course.place }}
              </div>
              <CBadge color="info badge-pill" class="topLeft text-truncate" style="max-width: 300px">{{ course.place }}</CBadge>
            </el-tooltip>
            <div slot="header" class="d-flex justify-content-between pt-2">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  {{ course.name }}
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder">
                    {{ course.name }}
                  </span>
                </div>
              </el-tooltip>
            </div>
            <div style="padding: 14px">
              <div class="bottom">
                <div class="d-flex justify-content-between">
                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.courseStart') }}</span>
                    <time class="time small d-flex">{{ DateFormat(course.start) }}</time>
                  </div>

                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.courseEnd') }}</span>
                    <time class="time small d-flex">{{ DateFormat(course.end) }}</time>
                  </div>
                </div>
                <el-divider class="my-1"></el-divider>
                <div class="d-flex justify-content-between">
                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.attend_time') }}</span>
                    <time class="time small d-flex">{{ course.start_time }}</time>
                  </div>
                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.leave_time') }}</span>
                    <time class="time small d-flex"> {{ course.end_time }}</time>
                  </div>
                </div>
                <el-divider class="my-1"></el-divider>
                <div class="d-flex justify-content-between">
                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.code_plan') }}</span>
                    <time class="time small d-flex">{{ course.code_plan }}</time>
                  </div>
                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.coursePrice') }}</span>
                    <time class="time small d-flex">{{ course.price }}</time>
                  </div>
                </div>

                <el-divider class="my-1"></el-divider>
                <div class="d-flex justify-content-between">
                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.area') }}</span>
                    <time class="time small d-flex">{{ course.area }}</time>
                  </div>
                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.coursePeriod') }}</span>
                    <time class="time small d-flex">{{ course.period }}</time>
                  </div>
                </div>
                <el-divider class="my-1"></el-divider>
                <div class="d-flex justify-content-between">
                  <div>
                    <span class="d-flex font-weight-bolder">{{ $t('Global.note') }}</span>
                    <time class="time small d-flex">{{ course.note || '-' }}</time>
                  </div>
                </div>
                <el-divider class="my-1"></el-divider>
                <div class="d-flex justify-content-between align-items-center">
                  <router-link v-if="!course.expired" to="">
                    <el-button @click="booking(course.id)" icon="el-icon-right" round size="mini" class="mx-1 right_icon mt-2" type="primary">
                      {{ $t('Global.join') }}
                    </el-button>
                  </router-link>
                  <div>
                    <el-tooltip effect="dark" placement="top">
                      <div slot="content">
                        {{ $t('Global.participants') }}
                      </div>
                      <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                        <span class="font-weight-bolder"> {{ course.trainees_submissions_count }} \ {{ course.max_trainer }} </span>
                      </div>
                    </el-tooltip>
                  </div>
                  <router-link :to="`plans/plan/${course.id}`">
                    <el-button icon="el-icon-view" round size="mini" class="mx-1 mt-2" type="primary">
                      {{ $t('Global.show') }}
                    </el-button>
                  </router-link>
                </div>
              </div>
            </div>
          </el-card>
        </CCol>
      </CRow>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '../components/DataTable';
import * as helper from '../../utils/helper';

export default {
  name: 'courses',
  components: { DataTable },
  props: {
    user: Number,
    system: String,
  },
  data() {
    return {
      currentDate: new Date(),
      course_id: this.$store.state.course_id ? this.$store.state.course_id : null,
      code_plan: this.$store.state.code_plan ? this.$store.state.code_plan : null,
      area_type: this.$store.state.area_type ? this.$store.state.area_type : null,
      period: this.$store.state.period ? this.$store.state.period : null,
      place: this.$store.state.place ? this.$store.state.place : null,
      DateRange: this.$store.state.plan_DateRange ? this.$store.state.plan_DateRange : null,
      expired: this.$store.state.expired ? this.$store.state.expired : 0,
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
  },
  computed: {
    lookups: function () {
      if (this.$store.state.course.lookups) {
        return this.$store.state.course.lookups;
      }
    },
  },
  methods: {
    Refresh(query) {
      // this.$store.dispatch('course/plans', { query: query });
      this.$emit('init', query);
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
    prettyDate2(time) {
      var date = new Date(parseInt(time));
      return date.toLocaleTimeString('ar-EG-u-nu-latn', {
        hour: '2-digit',
        minute: '2-digit',
      });
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
    reset() {
      this.place = null;
      this.period = null;
      this.area_type = null;
      this.code_plan = null;
      this.course_id = null;
      this.DateRange = '';
      this.expired = 0;
    },
    show(id) {
      return `/course/${id}`;
    },
  },
};
</script>

<style lang="scss">
.topLeft {
  position: absolute;
  top: -10px;
  left: 10px;
  font-size: 14px !important;
}

.custom-link:hover {
  text-decoration: underline !important;
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
