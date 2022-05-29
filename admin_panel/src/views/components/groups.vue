<template>
  <div>
    <DataTable groups  :reports="hasPermission('admin_system') ? true : false" :items="$store.getters['group/groups']" @Refresh="Refresh" permission="admin_groups" :loading="$store.getters['group/groupsLoad']" :name="$t('Global.groups')" :total="$store.getters['group/totalgroups']" icon="el-icon-office-building" @show="show" :user="user">
      <template #action_table>
        <div class="item" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
          <i class="el-icon-plus"></i>
          <router-link v-if="hasPermission('edit_groups')" @click.native="showAddEdit(null)" to="">
            {{ $t('Global.add_group') }}
          </router-link>
        </div>
      </template>
      <template #reports>
        <el-tooltip class="mx-2" :content="$t('Global.downloadReports')" placement="top">
          <el-button type="primary" size="mini" @click="openReportsDialog()" icon="el-icon-document" circle></el-button>
        </el-tooltip>
      </template>
      <template #filter_table></template>
      <template #cols>
        <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
        <el-table-column prop="name" width="165" :label="$t('Global.name')" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">
                {{ scope.row.name }}
              </div>
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                {{ scope.row.name }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="submissions" :label="$t('Global.submissions')">
          <template slot-scope="scope">
            <CBadge v-for="item in scope.row.statistic" :color="'info'" class="custom-link" style="margin: 2px; font-size: 12px">
              {{ item.title }}
              <CBadge :color="'success'" class="custom-link" style="font-size: 13px !important">
                {{ item.count }}
              </CBadge>
            </CBadge>
          </template>
        </el-table-column>
        <el-table-column prop="removed" width="60" :label="$t('Global.status')">
          <template slot-scope="scope">
            <CBadge :color="getBadge(scope.row.removed)">
              <span v-if="scope.row.removed == 0">{{ $t('Global.active') }}</span>
              <span v-if="scope.row.removed == 1">{{ $t('Global.remove') }}</span>
            </CBadge>
          </template>
        </el-table-column>
        <el-table-column prop="" label=" " width="170">
          <template slot-scope="scope">
            <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
              <router-link v-if="hasPermission('show_groups')" :to="show(scope.row.id)">
                <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
              </router-link>
              <el-tooltip effect="dark" :content="$t('Global.edit')" placement="top" v-if="scope.row.is_editable">
                <el-button v-if="hasPermission('edit_groups')" @click="showAddEdit(scope.row)" type="info" size="mini" class="xs_mini mx-1" icon="el-icon-edit" circle></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('Global.delay')" placement="top" v-if="scope.row.is_editable">
                <el-button v-if="hasPermission('edit_groups')" @click="diActive(scope.row.id)" type="danger" size="mini" class="xs_mini" icon="el-icon-refresh-left" circle></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </template>
    </DataTable>
    <el-dialog :title="$t('Global.groupsDetials')" :visible.sync="dialogVisible" width="300">
      <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="stateForm demo-ruleForm">
        <el-form-item class="mb-4" :label="$t('Global.name')" :rules="validation(null, 'textarea')" style="width: 100%" prop="name">
          <el-input maxlength="100" id="name" :placeholder="$t('Global.name')" v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
        <el-button @click="addEdit('ruleForm')" round size="mini" class="mx-1 right_icon" type="primary">{{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('Global.downloadReports')" :visible.sync="reportsDialog" width="300">
      <el-tabs v-loading="isLoad" :class="isLoad ? 'disabledAll' : ''" v-model="activeNameSelected" type="card" class="right" dir="rtl" tab-position="top" stretch>
        <el-tab-pane name="1">
          <span slot="label"> <fa-icon :icon="['fas', 'file-pdf']" size="lg" /> {{ 'PDF' }}</span>

          <div class="item mt-2" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
            <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
            <router-link v-if="hasPermission('admin_system')" @click.native="downloadPdf($t('Global.groupPdf'))" to="">
              {{ $t('Global.groupPdf') }}
            </router-link>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label"> <fa-icon :icon="['fas', 'file-word']" size="lg" /> {{ 'WORD' }}</span>
          <div class="item mt-2" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
            <fa-icon :icon="['fas', 'file-word']" size="lg" />
            <router-link v-if="hasPermission('admin_system')" @click.native="downloadWord($t('Global.groupPdf'))" to="">
              {{ $t('Global.groupPdf') }}
            </router-link>
          </div>
        </el-tab-pane>
      </el-tabs>

      <span :class="isLoad ? 'disabledAll' : ''" slot="footer" class="dialog-footer" style="display: flex">
        <el-button class="ml-1 mr-1" @click="reportsDialog = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DataTable from '../components/DataTable';
import * as helper from '../../utils/helper';
import { EventBus } from '../../main';

export default {
  name: 'groups',
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
      id: null,
      removed:null,
      search_text:'',
      activeNameSelected: '1',
      reportsDialog: false,
      isLoad: false,
      dialogVisible: false,
      ruleForm: {
        name: null,
        removed: 0,
      },
    };
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
  },
    created() {
    EventBus.$on('getSearch', data => {
      this.search_text = data;
    });

    EventBus.$on('getStatus', data => {
      this.removed = data;
    });
  },
  methods: {
    openReportsDialog() {
      this.reportsDialog = true;
    },
    downloadPdf(text) {
        let query = {
        university_id: this.university,
        search_text: this.search_text,
        removed: this.removed,
        type: this.type,
        system: this.getSystem(this.system),
        from: this.dateRange ? this.dateRange.toString().split(',')[0] : null,
        to: this.dateRange ? this.dateRange.toString().split(',')[1] : null,
        educationType: this.educationType,
        dayType: this.dayType,
        SCgender: this.SCgender,
        stage: this.stage,
        directorate: this.directorate,
        administration: this.administration,
      };
      this.isLoad = true;
      this.$store.dispatch('submission/groupPdf', { name: text, date: this.getDateNow(),query:query }).then(_ => {
        this.isLoad = false;
      });
    },
    downloadWord(text) {
        let query = {
        university_id: this.university,
        search_text: this.search_text,
        removed: this.removed,
        type: this.type,
        system: this.getSystem(this.system),
        from: this.dateRange ? this.dateRange.toString().split(',')[0] : null,
        to: this.dateRange ? this.dateRange.toString().split(',')[1] : null,
        educationType: this.educationType,
        dayType: this.dayType,
        SCgender: this.SCgender,
        stage: this.stage,
        directorate: this.directorate,
        administration: this.administration,
      };
      this.isLoad = true;
      this.$store.dispatch('submission/groupWord', { name: text, date: this.getDateNow() ,query:query}).then(_ => {
        this.isLoad = false;
      });
    },
    showAddEdit(data) {
      this.id = data ? data.id : null;
      if (data) {
        this.ruleForm.name = data.name;
      } else {
        this.ruleForm.name = null;
      }
      this.dialogVisible = true;
    },
    addEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('group/save', {
              query: { name: this.ruleForm.name },
              id: this.id ? this.id : null,
            })
            .then(() => {
              this.dialogVisible = false;
              this.isLoad = false;
              this.Refresh({ order_direction: 'DESC' });
            })
            .catch(err => {
              this.dialogVisible = false;
              this.isLoad = false;
            });
        }
      });
    },
    diActive(id) {
      this.$confirm(this.$t('Global.deley_group_message'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('group/delete', id).then(() => {
          this.$message({ message: this.$t('Global.successMessage'), type: 'success' });
          this.Refresh({ order_direction: 'DESC' });
        });
      });
    },
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
      this.$store.dispatch('group/groups', { query: query });
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
      this.group = null;
    },
    show(id) {
      if (this.system == 'HE') {
        return `/higher/groups/group/${id}`;
      } else {
        return `/school/groups/group/${id}`;
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
