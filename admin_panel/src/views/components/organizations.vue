<template>
  <DataTable
    :items="$store.getters['organization/organizations']"
    @Refresh="Refresh"
    :loading="$store.getters['organization/organizationsLoad']"
    :name="$t('organizations.organizations')"
    :total="$store.getters['organization/totalOrganizations']"
    icon="el-icon-office-building"
    @show="show"
    @reset="reset"
    :university_id="university"
    :educationType="educationType"
    :type_id="type"
    :sector="sector"
    :dayType="dayType"
    :SCgender="SCgender"
    :stage="stage"
    :directorate="directorate"
    :administration="administration"
    :system="getSystem(system)"
    :user="user"
    :range="dateRange ? dateRange.toString() : ''"
    permission="admin_organizations"
    v-if="hasPermission('show_organizations')"
  >
    <template #action_table>
      <div class="item" v-if="(($store.state.user.allowPu && system == 'SC') || ($store.state.user.allowHr && system != 'SC') ) || hasPermission('admin_system')">
        <i class="el-icon-plus"></i>
        <router-link v-if="hasPermission('admin_organizations')"  :to="{ path: `/${system == 'SC' ? 'school' : 'higher'}/organization/new/add` }">
          {{ $t('Global.add_organization') }}
        </router-link>
      </div>
    </template>
    <template #filter_table>
      <div class="ml-2 mr-2 mb-2 fullWidth">
        <el-select clearable :no-data-text="$t('Global.nodata')" v-model="educationType" ref="uni" :placeholder="$t('Global.selectEducationType')" style="width: 100%">
          <el-option v-if="item.system == getSystem(system)" v-for="item in $store.getters['organization/educationTypes']" :key="item.id" :label="item.name" :value="item.id">
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

<!--       <div class="ml-2 mr-2 mb-2 fullWidth">-->
<!--        <el-select clearable :no-data-text="$t('Global.nodata')" v-model="decision"  :placeholder="$t('Global.decision')" style="width: 100%">-->
<!--          <el-option v-for="item in $store.getters['organization/decisions']" :key="item.id" :label="item.name" :value="item.id">-->
<!--            <span style="float: right; color: #8492a6; font-size: 13px">-->
<!--              {{ item.name }}-->
<!--              <i class="el-icon-office-building"></i>-->
<!--            </span>-->
<!--          </el-option>-->
<!--          <template #prefix>-->
<!--            <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>-->
<!--          </template>-->
<!--          <template #empty>-->
<!--            <div class="text-center" style="padding: 10px; font-weight: bold">-->
<!--              {{ $t('Global.nodata') }}-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-select>-->
<!--        </div>-->

       
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
        <el-select clearable :no-data-text="$t('Global.nodata')" v-model="administration" filterable ref="administration" :disabled="disabled" :placeholder="educationType == 2 || educationType == 4 ? $t('Global.azhar_area') : $t('Global.administration')" style="width: 100%">
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
      <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'SC'">
        <el-select clearable :no-data-text="$t('Global.nodata')" v-model="dayType" @change="resetUni" ref="dayType" filterable :placeholder="$t('Global.dayType')" style="width: 100%">
          <el-option v-for="item in $store.getters['submission/dayType']" :key="item.id" :label="item.name" :value="item.id">
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
        <el-select clearable :no-data-text="$t('Global.nodata')" v-model="SCgender" @change="resetUni" ref="SCgender" filterable :placeholder="$t('Global.SCgender')" style="width: 100%">
          <el-option v-for="item in $store.getters['submission/SCgender']" :key="item.id" :label="item.name" :value="item.id">
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
        <el-select clearable :no-data-text="$t('Global.nodata')" v-model="stage" @change="resetUni" ref="stage" filterable :placeholder="$t('Global.stage')" style="width: 100%">
          <el-option v-for="item in getStage" :key="item.id" :label="item.name" :value="item.id">
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

      <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'HE'">
        <el-select :disabled="disabledTypes" clearable :no-data-text="$t('Global.nodata')" v-model="university" @change="resetUni" ref="uni" filterable :placeholder="$t('Global.selectUniversity')" style="width: 100%">
          <el-option v-for="item in $store.getters['university/universities']" :key="item.id" :label="item.name" :value="item.id">
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

      <div class="mr-2 mb-2 fullWidth">
        <el-select clearable :no-data-text="$t('Global.nodata')" v-model="type" @change="resetUni" ref="uni" :placeholder="$t('Global.organizationType')" style="width: 100%">
          <el-option v-for="item in $store.getters['organization/types']" :key="item.id" :label="item.name" :value="item.id">
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
      <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'HE'">
        <el-select clearable :no-data-text="$t('Global.nodata')" v-model="sector" @change="resetUni" ref="uni" :placeholder="$t('Global.selectSector')" style="width: 100%">
          <el-option v-for="item in $store.getters['organization/sectors']" :key="item.id" :label="item.name" :value="item.id">
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
      <div class="ml-2 mr-2 mb-2 fullWidth">
        <el-date-picker clearable v-if="system != 'SC'" v-model="dateRange" type="daterange" format="yy-MM-d" value-format="yyyy-MM-d" unlink-panels :start-placeholder="$t('Global.from')" :end-placeholder="$t('Global.to')"></el-date-picker>
      </div>
    </template>
    <template #cols>
      <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
      <el-table-column prop="name" :label="$t('Global.organization')" sortable>
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              <span
                >{{ scope.row.name }} <br /><br />
                <div class="small text-muted" v-if="scope.row.university">{{ `${scope.row.university}` }}</div>
              </span>
            </div>
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
              <span class="font-weight-bolder" :to="scope.row.organization_id ? { path: `/higher/organization/${scope.row.organization_id}` } : { path: `/higher/organization/${scope.row.id}` }">
                {{ scope.row.name }}
              </span>
              <div class="small text-muted" v-if="scope.row.university">{{ ` ${scope.row.university}` }}</div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="institute" sortable :label="$t('Global.institute')" v-if="system === 'SC'"></el-table-column>
      <el-table-column prop="gender_type" sortable :label="$t('Global.gender_type')" v-if="system === 'SC'"></el-table-column>
      <el-table-column prop="stage" sortable :label="$t('Global.stage')" v-if="system === 'SC'"></el-table-column>
      <el-table-column prop="school_code" sortable :label="$t('Global.school_code')" v-if="system === 'SC'"></el-table-column>
      <el-table-column prop="email" :label="$t('Global.email')">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.email" placement="top-start">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
              {{ scope.row.email }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="evaluations" width="420" :label="$t('Global.Decision')" v-if="system === 'HE'">
        <template slot-scope="scope">
          <router-link v-for="evaluation in scope.row.evaluations" :to=" `/${system == 'HE' ? 'higher' :'school' }/submissions/submission/${evaluation.submission_id}/${evaluation.evaluation_id}`">
            <CBadge :color="evaluation.decision === null ? 'danger' : evaluation.decision === 'اعتماد' ? 'success' : 'warning'" class="custom-link" style="margin: 2px">{{ evaluation.decision ? evaluation.decision : `${$t('Global.noAction')}` }} </CBadge>
            <CBadge color="warning" class="custom-link" style="margin: 2px" v-if="evaluation.program">{{ evaluation.program }} </CBadge>
            <CBadge class="custom-link" v-if="evaluation.start" color="info" style="margin: 2px"> {{ $t('Global.from') }} : {{ DateFormat(evaluation.start) }} </CBadge>
            <CBadge class="custom-link" v-if="evaluation.expiration" color="info">{{ $t('Global.to') }}:{{ DateFormat(evaluation.expiration) }} </CBadge>
            <br />
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="evaluations" :label="$t('Global.Decision')" v-if="system === 'SC'">
        <template slot-scope="scope">
          <router-link  v-if="system === 'HE'" v-for="evaluation in scope.row.evaluations" :to="{ path: `/higher/submissions/submission/${evaluation.submission_id}/${evaluation.evaluation_id}` }">
            <CBadge :color="evaluation.decision === null ? 'danger' : evaluation.decision === 'اعتماد' ? 'success' : 'warning'" class="custom-link" style="margin: 2px">{{ evaluation.decision ? evaluation.decision : `${$t('Global.noAction')}` }} </CBadge>
            <CBadge color="warning" class="custom-link" style="margin: 2px" v-if="evaluation.program">{{ evaluation.program }} </CBadge>
            <CBadge class="custom-link" v-if="evaluation.start" color="info" style="margin: 2px"> {{ $t('Global.from') }} : {{ DateFormat(evaluation.start) }} </CBadge>
            <CBadge class="custom-link" v-if="evaluation.expiration" color="info">{{ $t('Global.to') }}:{{ DateFormat(evaluation.expiration) }} </CBadge>
            <br />
          </router-link>
          <router-link  v-else v-for="evaluation in scope.row.evaluations" :to="{ path: `/school/submissions/submission/${evaluation.submission_id}/${evaluation.evaluation_id}` }">
            <CBadge :color="evaluation.decision === null ? 'danger' : evaluation.decision === 'اعتماد' ? 'success' : 'warning'" class="custom-link" style="margin: 2px">{{ evaluation.decision ? evaluation.decision : `${$t('Global.noAction')}` }} </CBadge>
            <CBadge color="warning" class="custom-link" style="margin: 2px" v-if="evaluation.program">{{ evaluation.program }} </CBadge>
            <CBadge class="custom-link" v-if="evaluation.start" color="info" style="margin: 2px"> {{ $t('Global.from') }} : {{ DateFormat(evaluation.start) }} </CBadge>
            <CBadge class="custom-link" v-if="evaluation.expiration" color="info">{{ $t('Global.to') }}:{{ DateFormat(evaluation.expiration) }} </CBadge>
            <br />
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="removed" width="60" :label="$t('Global.status')" v-if="hasPermission('admin_organizations')">
        <template slot-scope="scope">
          <CBadge :color="getBadge(scope.row.removed)">
            <span v-if="scope.row.removed == 0">{{ $t('Global.active') }}</span>
            <span v-if="scope.row.removed == 1">{{ $t('Global.remove') }}</span>
          </CBadge>
        </template>
      </el-table-column>
      <el-table-column prop="" label=" " width="70">
        <template slot-scope="scope">
          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
            <!-- <i class="el-icon-view table-action-item" @click="show(scope.row.id)"></i> -->
            <router-link :to="show(scope.row.id)">
              <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
            </router-link>
            <!-- <i
                          class="el-icon-edit table-action-item"
                          @click="show(scope.row.id)"
                        ></i> -->
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
  name: 'organizations',
  components: { DataTable },
  props: {
    user: Number,
    system: String,
  },
  data() {
    return {
      disabledTypes: this.$store.state.eduactionType_org ? false : true,
      university: this.$store.state.university_id_org ? this.$store.state.university_id_org : null,
      type: this.$store.state.type_org ? this.$store.state.type_org : null,
      disabled: this.$store.state.university_id_org ? false : true,
      dateRange: this.$store.state.range ? this.$store.state.range : '',
      educationType: this.$store.state.eduactionType_org ? this.$store.state.eduactionType_org : null,
      sector: this.$store.state.sector ? this.$store.state.sector : null,
      directorate: this.$store.state.directorate_id_org ? this.$store.state.directorate_id_org : null,
      administration: this.$store.state.administration_org ? this.$store.state.administration_org : null,
      dayType: this.$store.state.dayType_org ? this.$store.state.dayType_org : null,
      stage: this.$store.state.stage_org ? this.$store.state.stage_org : null,
      SCgender: this.$store.state.SCgender_org ? this.$store.state.SCgender_org : null,
      decision:null
    };
  },
  computed: {
    getStage: function () {
      if (!this.$store.getters['submission/stage']) return;
      if (this.$store.getters['submission/stage'][0].education_type_id) {
        if (this.educationType == 4) {
          return this.$store.getters['submission/stage'].filter(t => t.education_type_id == 2);
        } else {
          return this.$store.getters['submission/stage'].filter(t => t.education_type_id == 1);
        }
      } else {
        return this.$store.getters['submission/stage'];
      }
    },
  },
  watch: {
    educationType: function (val) {
      this.educationType = val;
      this.$store.commit('set', ['eduactionType_org', val]);
      if (!val) {
        this.disabledTypes = true;
      } else {
        this.disabledTypes = false;
        this.university = null;
      }
      this.$store.dispatch('university/universities', { educationType: this.educationType });
    },
    university: function (val) {
      this.university = val;
      this.$store.commit('set', ['university_id_org', val]);
      if (val) {
        this.disabled = false;
        this.$refs.uni.blur();
      } else {
        this.disabled = true;
      }
    },
    directorate: function (val) {
      this.directorate = val;
      if (val) {
        this.disabled = false;
        this.$refs.directorate.blur();
      } else {
        this.disabled = true;
      }
      this.$store.commit('set', ['directorate_id_org', val]);
      this.$store.dispatch('directorate/institutes', {
        parent_id: val,
      });
    },
    administration: function (val) {
      this.administration = val;
      this.$store.commit('set', ['administration_org', val]);
      if (val) {
        this.$refs.administration.blur();
      }
    },
    dayType: function (val) {
      this.dayType = val;
      this.$store.commit('set', ['dayType_org', val]);
      if (val) {
        this.$refs.dayType.blur();
      }
    },
    type: function (val) {
      this.type = val;
      this.$store.commit('set', ['type_org', val]);
    },
    SCgender: function (val) {
      this.SCgender = val;
      this.$store.commit('set', ['SCgender_org', val]);
      if (val) {
        this.$refs.SCgender.blur();
      }
    },
    stage: function (val) {
      this.stage = val;
      this.$store.commit('set', ['stage_org', val]);
      if (val) {
        this.$refs.stage.blur();
      }
    },
  },
  mounted() {
    if (this.system == 'HE') {
      this.$store.dispatch('university/universities');
    } else {
      this.$store.dispatch('directorate/directorates');
    }
    if (this.$store.state.directorate_id_org) {
      this.$store
        .dispatch('directorate/institutes', {
          parent_id: this.$store.state.directorate_id_org,
        })
        .then(() => {
          this.administration = this.$store.state.administration_org;
          this.directorate = this.$store.state.directorate_id_org;
        });
    }
    if (this.$store.state.university_id_sub) {
      this.$store
        .dispatch('organization/names', {
          query: {
            parent_id: this.$store.state.university_id_org,
          },
        })
        .then(() => {
          this.organization = this.$store.state.organization_id_select;
          this.university = this.$store.state.university_id;
        });
    }
  },
  methods: {
    getSystem(system) {
      switch (system) {
        case 'HE':
          return 1;
        case 'SC':
          return 2;
        default:
          return 1;
      }
    },
    Refresh(query) {
      this.$store.dispatch('organization/organizations', { query: query });
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
    resetUni() {
      this.organization = null;
    },
    reset() {
      this.university = null;
      this.type = null;
      this.decision = null;
      this.dateRange = '';
      this.sector = null;
      this.educationType = null;
      this.dayType = null;
      this.administration = null;
      this.SCgender = null;
      this.stage = null;
      this.directorate = null;
    },
    show(id) {
      if (this.system == 'HE') {
        // this.$router.push(`/higher/organization/${id}`);
        return `/higher/organization/${id}`;
      } else {
        // this.$router.push(`/school/organization/${id}`);
        return `/school/organization/${id}`;
      }
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
