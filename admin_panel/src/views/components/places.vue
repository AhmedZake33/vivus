<template>
  <CRow class="no-gutters">
    <CCol col="12" lg="12">
      <DataTable :items="$store.state.course.places" @Refresh="Refresh" :loading="$store.state.course.coursesLoad" :name="$t('Global.places')" :total="$store.state.course.count" icon="el-icon-office-building" permission="admin_courses">
        <template #action_table>
          <router-link @click.native="showAddEdit(null)" v-if="hasPermission('edit_submissions')" to="">
            <div class="item">
              <i class="el-icon-plus"></i>
              {{ $t('Global.add_place') }}
            </div>
          </router-link>
        </template>
        <template #filter_table></template>
        <template #cols>
          <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
          <el-table-column prop="name" :label="$t('Global.name')" sortable>
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <span>{{ scope.row.name }} <br /></span>
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder">
                    {{ scope.row.name }}
                  </span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column class-name="custom_cell" prop="items" :label="$t('Global.halls')" sortable>
            <template slot-scope="scope">
              <div v-if="scope.row.items" v-for="(item, i) in scope.row.items" :key="i">
                <CBadge class="font-weight-bolder" style="font-size: 11px !important" color="light badge-pill"> {{ item }} </CBadge>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="desk_count" :label="$t('Global.desk_count')" sortable>
            <template slot-scope="scope">
              {{ scope.row.desk_count }}
            </template>
          </el-table-column>
          <el-table-column prop="removed" width="60" :label="$t('users.status')">
            <template slot-scope="scope">
              <CBadge :color="getBadge(scope.row.removed)">
                <span v-if="scope.row.removed == 0">{{ $t('Global.active') }}</span>
                <span v-if="scope.row.removed == 1">{{ $t('Global.remove') }}</span>
              </CBadge>
            </template>
          </el-table-column>
          <el-table-column prop="" label=" " width="100">
            <template slot-scope="scope">
              <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                <el-button @click="showAddEdit(scope.row)" type="primary" size="mini" class="xs_mini" icon="el-icon-edit" circle></el-button>
                <el-button @click="cancelPlace(scope.row)" type="primary" size="mini" class="xs_mini mx-2" :icon="scope.row.removed ? 'el-icon-refresh' : 'el-icon-delete'" circle></el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </DataTable>
    </CCol>
    <el-dialog :title="$t('Global.placeDetails')" :visible.sync="dialogVisible" width="300">
      <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="stateForm demo-ruleForm">
        <el-form-item class="mb-4" :label="$t('Global.placeName')" :rules="validation(null)" style="width: 100%" prop="name">
          <el-input id="name" :placeholder="$t('Global.placeName')" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item class="mb-0" :label="$t('Global.halls')" style="width: 100%" prop="items">
          <el-select class="mb-3" v-model="ruleForm.items" allow-create default-first-option filterable multiple :placeholder="$t('Global.halls')" style="width: 100%">
            <el-option v-for="item in ruleForm.items" :key="item" :label="item" :value="item">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Global.desk_count')" style="width: 100%" prop="desk_count">
          <el-input :placeholder="$t('Global.desk_count')" v-model="ruleForm.desk_count"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
        <el-button @click="addEdit('ruleForm')" round size="mini" class="mx-1 right_icon" type="primary">{{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>
  </CRow>
</template>

<script>
import DataTable from '../components/DataTable';

export default {
  name: 'courses',
  components: { DataTable },
  data() {
    return {
      dialogVisible: false,
      id: null,
      isLoad: false,
      ruleForm: {
        name: null,
        desk_count: null,
        items: [],
      },
    };
  },
  watch: {
    'ruleForm.desk_count'(value) {
      if (this.ruleForm.desk_count) {
        this.ruleForm.desk_count = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.items'(value) {
      if (value && value.length != 0) {
        value.map(item => {
          if (item) {
            if (item.toString().trim().length === 0) {
              const index = value.indexOf(item);
              if (index > -1) {
                value.splice(index, 1);
              }
            }
          }
        });
        this.ruleForm.items = value;
      } else {
        this.ruleForm.items = this.ruleForm.items;
      }
    },
  },
  methods: {
    showAddEdit(data) {
      this.id = data ? data.id : null;
      if (data) {
        this.ruleForm.name = data.name;
        this.ruleForm.desk_count = data.desk_count;
        this.ruleForm.items = data.items;
      } else {
        this.ruleForm.name = null;
        this.ruleForm.desk_count = null;
        this.ruleForm.items = [];
      }
      this.dialogVisible = true;
    },
    // test(item){
    //   console.log(item);
    // },
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
    addEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          // let formData = new FormData();
          // for (const [key, value] of Object.entries(this.ruleForm)) {
          //     if (value || value == 0) {
          //         formData.append(key, value);
          //     }
          // }
          this.$store
            .dispatch('course/savePlace', {
              query: this.ruleForm,
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
    cancelPlace(data) {
      let query;
      if (data.removed == 1) {
        query = { removed: 1 };
      } else {
        query = { removed: 0 };
      }
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.$store.dispatch('course/deletePlace', data.id).then(() => {
          this.Refresh(query);
        });
      });
    },
    Refresh(query) {
      this.$emit('init', query);
    },
  },
};
</script>

<style lang="scss">
.custom_cell .cell {
  display: flex;
  gap: 0.2rem;
  flex-wrap: wrap;
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
