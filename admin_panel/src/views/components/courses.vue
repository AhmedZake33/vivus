<template>
  <DataTable
    :items="$store.getters['course/courses']"
    @Refresh="Refresh"
    :noReset="true"
    :type_id="type"
    :job_target="job_target"
    :range="DateRange ? DateRange.toString() : ''"
    :organization_target="organization_target"
    :loading="$store.state.course.coursesLoad"
    :name="$t('permissions.Courses')"
    @reset="reset"
    :total="$store.getters['course/totalcourses']"
    icon="el-icon-office-building"
    @show="show"
    :hidden_action="hasPermission('edit_courses') ? false : true "
    permission="admin_courses"
    v-if="hasPermission('access_courses')"
  >
    <template #action_table>
      <router-link  :to="{ path: `/course/courses/add` }" v-if="hasPermission('edit_courses')">
        <div class="item">
          <i class="el-icon-plus"></i>
          {{ $t('Global.add_course') }}
        </div>
      </router-link>
    </template>
    <template #filter_table>
      <div class="ml-2 mr-2 mb-2 fullWidth">
        <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="type" :placeholder="$t('Global.category')">
          <el-option v-for="item in lookups.types" :key="item.id" :label="item.name" :value="item.id">
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
        <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="organization_target" :placeholder="$t('Global.organization_target')">
          <el-option v-for="item in lookups.organization_targets" :key="item.id" :label="item.name" :value="item.id">
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
        <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="job_target" :placeholder="$t('Global.job_target')">
          <el-option v-for="item in lookups.job_targets" :key="item.id" :label="item.name" :value="item.id">
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
      <el-table-column prop="name" :label="$t('Global.course')" sortable width="350">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              <span
                >{{ scope.row.name }} <br />
                <div class="small text-muted" v-if="scope.row.en_name">
                  {{ `${scope.row.en_name}` }}
                </div>
              </span>
            </div>
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
              <span class="font-weight-bolder" :to="scope.row.course_id ? { path: `/higher/course/${scope.row.course_id}` } : { path: `/higher/course/${scope.row.id}` }">
                {{ scope.row.name }}
              </span>
              <div class="small text-muted" v-if="scope.row.en_name">
                {{ `${scope.row.en_name}` }}
              </div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="$t('Global.category')" sortable>
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              <span>{{ scope.row.type_name }} <br /><br /> </span>
            </div>
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
              <span class="font-weight-bolder">
                {{ scope.row.type_name }}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="target_id" :label="$t('Global.target_id')" sortable>
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              <span>{{ scope.row.target_job }} <br /><br /> </span>
            </div>
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
              <span class="font-weight-bolder">
                {{ scope.row.target_job }}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="target_id" :label="$t('Global.target_organization')" sortable>
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              <span>{{ scope.row.target_organization }} <br /><br /> </span>
            </div>
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
              <span class="font-weight-bolder">
                {{ scope.row.target_organization }}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="days" :label="$t('Global.days_count')" sortable>
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              <span>{{ scope.row.days }} <br /><br /> </span>
            </div>
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
              <span class="font-weight-bolder">
                {{ scope.row.days }}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="hours" :label="$t('Global.hours_count')" sortable>
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              <span>{{ scope.row.hours }} <br /><br /> </span>
            </div>
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
              <span class="font-weight-bolder">
                {{ scope.row.hours }}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!--            <el-table-column prop="objective" :label="$t('Global.objective')" sortable>-->
      <!--                <template slot-scope="scope">-->
      <!--                    <el-tooltip effect="dark" placement="top">-->
      <!--                        <div slot="objective">-->
      <!--                            <span>{{ scope.row.objective }} <br/><br/> </span>-->
      <!--                        </div>-->
      <!--                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">-->
      <!--              <span class="font-weight-bolder">-->
      <!--                {{ scope.row.objective }}-->
      <!--              </span>-->
      <!--                        </div>-->
      <!--                    </el-tooltip>-->
      <!--                </template>-->
      <!--            </el-table-column>-->
      <!--            <el-table-column prop="source" :label="$t('Global.source')" sortable>-->
      <!--                <template slot-scope="scope">-->
      <!--                    <el-tooltip effect="dark" placement="top">-->
      <!--                        <div slot="content">-->
      <!--                            <span>{{ scope.row.source }} <br/><br/> </span>-->
      <!--                        </div>-->
      <!--                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">-->
      <!--              <span class="font-weight-bolder">-->
      <!--                {{ scope.row.source }}-->
      <!--              </span>-->
      <!--                        </div>-->
      <!--                    </el-tooltip>-->
      <!--                </template>-->
      <!--            </el-table-column>-->
      <el-table-column prop="" label=" " width="70">
        <template slot-scope="scope">
          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
            <router-link :to="show(scope.row.id)">
              <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
            </router-link>
          </div>
        </template>
      </el-table-column>
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
    system_type: String,
  },
  data() {
    return {
      type: this.$store.state.tr_type ? this.$store.state.tr_type : null,
      organization_target: this.$store.state.organization_target ? this.$store.state.organization_target : null,
      job_target: this.$store.state.job_target ? this.$store.state.job_target : null,
      DateRange: this.$store.state.tr_DateRange ? this.$store.state.tr_DateRange : null,
    };
  },
  watch: {
    type: function (val) {
      this.$store.commit('set', ['tr_type', val]);
    },
    organization_target: function (val) {
      this.$store.commit('set', ['organization_target', val]);
    },
    job_target: function (val) {
      this.$store.commit('set', ['job_target', val]);
    },
    DateRange: function (val) {
      this.$store.commit('set', ['tr_DateRange', val]);
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
    reset() {
      this.type = null;
      this.job_target = null;
      this.organization_target = null;
      this.DateRange = '';
    },
    DateFormat(date) {
      return helper.toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    show(id) {
      return `/course/courses/show/${id}`;
    },
  },
};
</script>

<style lang="scss">
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
