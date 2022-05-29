<template>
  <div>
    <FormTree v-loading="loading" @openDialog="openDialog" class="filter-tree tree_form" system="HE" @init="init" :data="$store.getters['form/forms']">
      <template #header_action>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <div class="item" @click="openDialog('add', 3)">
            <i class="el-icon-document"></i>
            <span v-if="hasPermission('edit_submissions')">
              {{ $t('Global.add_form') }}
            </span>
          </div>
        </template>
      </template>
    </FormTree>
    <div class="w-100 d-flex justify-content-center mt-2 mb-2">
      <CSpinner v-if="$store.state.form.formsLoad" color="default" size="sm" />
    </div>
    <div class="dialogPart">
      <el-dialog :title="$t('Global.forms')" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" label-position="top" status-icon :model="ruleForm" :rules="rules">
          <el-form-item :rules="validation()" :label="$t('Global.name')" prop="name" v-if="dialogNumber == 1 || dialogNumber == 2 || dialogNumber == 3">
            <el-input v-model="ruleForm.name" autocomplete="off" :placeholder="$t('Global.name')"></el-input>
          </el-form-item>
          <el-form-item v-if="(dialogType == 'edit' && dialogNumber == 1) || dialogNumber == 3" :rules="validation(false, 1)" :label="$t('Global.typeForm')" prop="type">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="ruleForm.type" filterable ref="type" :placeholder="$t('Global.typeForm')" style="width: 100%">
              <el-option :value="1" :label="$t('Global.any_organization')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.any_organization') }}
                </span>
              </el-option>
              <el-option :value="2" :label="$t('Global.academy_type')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.academy_type') }}
                </span>
              </el-option>
              <el-option :value="3" :label="$t('Global.any_program')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.any_program') }}
                </span>
              </el-option>
              <el-option :value="4" :label="$t('Global.any_university')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.any_university') }}
                </span>
              </el-option>
              <el-option :value="7" :label="$t('Global.memberToMember')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.memberToMember') }}
                </span>
              </el-option>
              <el-option :value="5" :label="$t('Global.leaderToMember')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.leaderToMember') }}
                </span>
              </el-option>
              <el-option :value="6" :label="$t('Global.memberToleader')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.memberToleader') }}
                </span>
              </el-option>

              <el-option :value="8" :label="$t('Global.orgToLeader')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.orgToLeader') }}
                </span>
              </el-option>
              <el-option :value="9" :label="$t('Global.orgToMember')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.orgToMember') }}
                </span>
              </el-option>
              <el-option :value="0" :label="$t('Global.other')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.other') }}
                </span>
              </el-option>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogNumber == 2 || (dialogNumber == 1 && dialogType == 'add')" :label="$t('Global.Evaltype')" :rules="validation(false, 1)" prop="eval_type">
            <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.eval_type" filterable ref="all" :placeholder="$t('Global.Evaltype')">
              <el-option v-for="item in $store.state.form.types" :key="item.id" :label="item.name" :value="item.id">
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
          <el-form-item v-if="dialogNumber == 2 || (dialogNumber == 1 && dialogType == 'add')" :label="$t('Global.Cattype')" :rules="validation(false, 1)" prop="cat_type">
            <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.cat_type" filterable ref="all" :placeholder="$t('Global.Cattype')">
              <el-option v-for="item in $store.state.form.categories" :key="item.id" :label="item.name" :value="item.id">
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
          <el-form-item :rules="validation(false, 1)" :label="$t('Global.status')" prop="removed">
            <el-select class="w-100" ref="status" v-model="ruleForm.removed" :label="$t('Global.status')" :placeholder="$t('Global.active')">
              <el-option class="el-input" :value="0" :label="$t('Global.active')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.active') }}
                  <i class="el-icon-check"></i>
                </span>
              </el-option>
              <el-option class="el-input" :value="1" :label="$t('Global.remove')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.remove') }}
                  <i class="el-icon-close"></i>
                </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save('ruleForm')">{{ dialogType == 'edit' ? $t('Global.save') : $t('Global.add') }}</el-button>
            <el-button @click="dialogFormVisible = false" class="mr-1 ml-1">{{ $t('Global.cancel') }}</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FormTree from '../../components/FormTree';
export default {
  name: 'forms',
  components: { FormTree },
  data() {
    return {
      count: 5,
      openNode: Number,
      openSubNode: Number,
      expand_keys: [],
      loading: false,
      id: null,
      dialogType: null,
      dialogFormVisible: false,
      dialogQuestionVisible: false,
      dialogNumber: null,
      parent_id: null,
      ruleForm: {
        typeForm: null,
        name: null,
        type: null,
        removed: null,
        eval_type: null,
        cat_type: null,
        system: 1,
      },
      rules: {
        name: [{ required: true, message: 'من فضلك يجب كتابة النموذج', trigger: 'blur' }],
        questions: [{ required: true, message: 'من فضلك يجب كتابة النموذج  ', trigger: 'change' }],
      },
    };
  },
  methods: {
    onScroll() {
      var scrollHeight = document.body.clientHeight;
      var scrollPosition = window.innerHeight + window.scrollY;
      if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
        if (this.$store.state.form.more) {
          this.count += 5;
          this.init(this.count);
        }
      }
    },
    openDialog(type, dialogNumber, editValue) {
      this.dialogType = type;
      this.ruleForm.name = null;
      this.id = null;
      if (type == 'add') {
        this.dialogNumber = dialogNumber;
        this.id = editValue ? editValue.id : null;
        this.parent_id = editValue ? editValue.form_id : null;
        this.dialogFormVisible = true;
        this.ruleForm.eval_type = null;
        this.ruleForm.cat_type = null;
      } else if (type == 'edit') {
        this.dialogNumber = dialogNumber;
        this.id = editValue.id;
        this.ruleForm.name = editValue.name;
        this.ruleForm.removed = editValue.removed;
        this.ruleForm.type = editValue.type;
        if (editValue.title && type == 'edit') {
          this.ruleForm.name = editValue.title;
          this.ruleForm.eval_type = editValue.question_type;
          this.ruleForm.cat_type = editValue.question_category;
        }
      }
      this.dialogFormVisible = true;
    },

    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogType == 'edit') {
            this.loading = true;
            this.dialogFormVisible = false;
            let query = Object;
            if (this.dialogNumber == 1) {
              query = {
                title: this.ruleForm.name,
                system: 1,
                removed: this.ruleForm.removed,
                type: this.ruleForm.type,
              };
              this.$store
                .dispatch('form/addForm', { id: this.id, query: query })
                .then(() => {
                  this.init();
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                });
            } else if (this.dialogNumber == 2) {
              query = {
                title: this.ruleForm.name,
                system: 1,
                removed: this.ruleForm.removed,
                question_type: this.ruleForm.eval_type,
                question_category: this.ruleForm.cat_type,
              };
              this.$store
                .dispatch('form/addQuestion', { id: this.id, query: query })
                .then(() => {
                  this.init();
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                });
            }
          } else if (this.dialogType == 'add') {
            this.loading = true;
            this.dialogFormVisible = false;
            let query = Object;
            if (this.dialogNumber == 3) {
              query = {
                title: this.ruleForm.name,
                system: 1,
                removed: this.ruleForm.removed,
                type: this.ruleForm.type,
                // form_id: this.id,
              };
              this.$store
                .dispatch('form/addForm', { id: null, query: query })
                .then(() => {
                  this.init();
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                });
            } else if (this.dialogNumber == 2) {
              query = {
                title: this.ruleForm.name,
                system: 1,
                removed: this.ruleForm.removed,
                form_id: this.parent_id,
                parent_id: this.id,
                question_type: this.ruleForm.eval_type,
                question_category: this.ruleForm.cat_type,
              };
              this.$store
                .dispatch('form/addQuestion', { query: query })
                .then(() => {
                  this.init();
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                });
            } else if (this.dialogNumber == 1) {
              query = {
                title: this.ruleForm.name,
                system: 1,
                removed: this.ruleForm.removed,
                form_id: this.id,
                question_type: this.ruleForm.eval_type,
                question_category: this.ruleForm.cat_type,
              };
              this.$store
                .dispatch('form/addQuestion', { query: query })
                .then(() => {
                  this.init();
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                });
            }
          }
        }
      });
    },

    init() {
      this.$store.dispatch('form/forms', { query: { system: 1 } });
    },
    getAsks(row) {
      if (this.openNode !== row.id) {
        this.$store.commit('form/SET_FORM', []);
        this.$store.dispatch('form/form', row.id).then(() => {
          this.openNode = row.id;
        });
      }
    },
    getSubAsks(row) {
      if (this.openSubNode !== row.id) {
        this.$store.commit('form/SET_SUB_FORM', []);
        this.$store.dispatch('form/subform', row.id).then(() => {
          this.openSubNode = row.id;
        });
      }
    },
    getSubData(row) {
      this.getSubAsks(row);
      this.expand_id = row.id;
      if (this.expand_keys.length == 1) {
        if (this.expand_id == this.expand_keys[0]) {
          this.expand_keys = [];
        } else {
          this.expand_keys = [];
          this.expand_keys.push(row.id);
        }
      } else {
        this.expand_keys = [];
        this.expand_keys.push(row.id);
      }
    },
    getrowkeys(row) {
      return row.id;
    },
  },
  created() {
    this.$nextTick(function () {
      window.addEventListener('scroll', this.onScroll);
      this.onScroll(); // needed for initial loading on page
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
};
</script>

<style lang="scss">
.expanded {
  background-color: #eee !important;
}
.ar .el-select .el-input .el-input__suffix {
  right: unset;
  left: 30px;
}
.ar .el-input .el-input__suffix {
  right: unset;
  left: 15px;
}
.custom_table div.el-table__header-wrapper {
  display: none !important;
}

.custom_table .el-table__body {
  border: 1px solid #ddd !important;
  table-layout: unset;
}
</style>
