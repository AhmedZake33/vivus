<template>
  <div v-if="hasPermission('show_forms')">
    <FormTree v-loading="$store.state.form.formsLoad" class="filter-tree tree_form" @openToolsDialog="openToolsDialog" @openRubricsDialog="openRubricsDialog" @openDialog="openDialog" :system="'SC'" @init="init" :data="$store.getters['form/forms']">
      <template #header_action>
        <div class="item" @click="openDialog('add', 3)">
          <i class="el-icon-document"></i>
          <span v-if="hasPermission('edit_forms')">
            {{ $t('Global.add_form') }}
          </span>
        </div>
      </template>
    </FormTree>
    <!--    <div class="w-100 d-flex justify-content-center mt-2 mb-2">-->
    <!--      <CSpinner v-if="$store.state.form.formsLoad" color="default" size="sm" />-->
    <!--    </div>-->
    <div class="dialogPart">
      <el-dialog :title="$t('Global.forms')" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" label-position="top" status-icon :model="ruleForm" :rules="rules">
          <el-form-item :rules="validation()" :label="$t('Global.name')" prop="name" v-if="dialogNumber !== 6">
            <el-input v-model="ruleForm.name" autocomplete="off" :placeholder="$t('Global.name')"></el-input>
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
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save('ruleForm')">{{ dialogType == 'edit' ? $t('Global.save') : $t('Global.add') }}</el-button>
          <el-button @click="dialogFormVisible = false" class="mr-1 ml-1">{{ $t('Global.cancel') }}</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="$t('Global.forms')" :visible.sync="rubricsDialogOpen">
        <el-form ref="ruleForm" label-position="top" status-icon :model="ruleForm" :rules="rules">
          <el-form-item :rules="validation()" :label="$t('Global.name')" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off" :placeholder="$t('Global.name')"></el-input>
          </el-form-item>
          <el-form-item :rules="validation(false, 1)" :label="$t('Global.answer')" prop="answer_option_id">
            <el-select class="w-100" ref="level" v-model="ruleForm.answer_option_id" :label="$t('Global.answer')" :placeholder="$t('Global.answer')">
                <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saverubric('ruleForm')">{{ dialogType == 'edit' ? $t('Global.save') : $t('Global.add') }}</el-button>
          <el-button @click="rubricsDialogOpen = false" class="mr-1 ml-1">{{ $t('Global.cancel') }}</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="$t('Global.forms')" :visible.sync="toolsDialogOpen">
        <el-form ref="ruleForm" label-position="top" status-icon :model="ruleForm" :rules="rules">
          <el-form-item :rules="validation()" :label="$t('Global.name')" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off" :placeholder="$t('Global.name')"></el-input>
          </el-form-item>
          <el-form-item :rules="validation(false, 1)" :label="$t('Global.category')" prop="tool_category_id">
            <el-select class="w-100" ref="level" v-model="ruleForm.tool_category_id" :label="$t('Global.category')" :placeholder="$t('Global.category')">
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
          <el-form-item :rules="validation(false, 1)" :label="$t('Global.value')" prop="tool_type_id">
            <el-select class="w-100" ref="level" v-model="ruleForm.tool_type_id" :label="$t('Global.value')" :placeholder="$t('Global.value')">
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
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="savetool('ruleForm')">{{ dialogType == 'edit' ? $t('Global.save') : $t('Global.add') }}</el-button>
          <el-button @click="toolsDialogOpen = false" class="mr-1 ml-1">{{ $t('Global.cancel') }}</el-button>
        </span>
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
      //   questions : [],
      openNode: Number,
      openSubNode: Number,
      rubricsDialogOpen: false,
      toolsDialogOpen: false,
      flag: false,
      dialogType: null,
      expand_keys: [],
      removeShow: false,
      id: null,
      dialogFormVisible: false,
      dialogNumber: null,
      rubric_id: null,
      tool_id: null,
      ruleForm: {
        answer_option_id: null,
        tool_type_id: null,
        tool_category_id: null,
        name: null,
        questions: null,
        removed: null,
      },
      levels: [
        { id: 1, name: this.$t('Global.level_1') },
        { id: 2, name: this.$t('Global.level_2') },
        { id: 3, name: this.$t('Global.level_3') },
        { id: 4, name: this.$t('Global.level_4') },
      ],
      rules: {
        name: [{ required: true, message: 'من فضلك يجب كتابة النموذج', trigger: 'blur' }],
        questions: [{ required: true, message: 'من فضلك يجب كتابة النموذج  ', trigger: 'change' }],
      },
    };
  },
  computed: {
    questions() {
      return this.$store.getters['form/form'];
    },
    subquestions() {
      return this.$store.getters['form/subform'];
    },
  },
  methods: {
    saverubric(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {};
          query = {
            name: this.ruleForm.name,
            answer_option_id: this.ruleForm.answer_option_id,
            question_id: this.id,
          };
          let formData = new FormData();
          for (const [key, value] of Object.entries(query)) {
            if (value || value == 0) {
              formData.append(key, value);
            }
          }
          this.$store.dispatch('form/addRubric', { id: this.rubric_id, query: formData }).then(_ => {
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
            this.init();
            this.rubricsDialogOpen = false;
          });
        }
      });
    },
    savetool(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {};
          query = {
            name: this.ruleForm.name,
            tool_category_id: this.ruleForm.tool_category_id,
            tool_type_id: this.ruleForm.tool_type_id,
            question_id: this.id,
          };
          let formData = new FormData();
          for (const [key, value] of Object.entries(query)) {
            if (value || value == 0) {
              formData.append(key, value);
            }
          }
          this.$store.dispatch('form/addTool', { id: this.tool_id, query: formData }).then(_ => {
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
            this.init();
            this.toolsDialogOpen = false;
          });
        }
      });
    },
    edit(id) {
      this.$router.push(`/school/form/edit/${id}`);
    },
    openRubricsDialog(data, type, rubric) {
      this.rubricsDialogOpen = true;
      this.dialogType = type;
      if (type == 'add') {
        this.id = data ? data.id : null;
        this.ruleForm.name = null;
        this.rubric_id = null;
        this.ruleForm.answer_option_id = null;
      } else {
        this.ruleForm.name = rubric.name || rubric.title;
        this.id = data.id;
        this.rubric_id = rubric.id;
        this.ruleForm.answer_option_id = rubric.answer_option_id;
      }
    },
    openToolsDialog(data, type, tool) {
      this.toolsDialogOpen = true;
      this.dialogType = type;
      if (type == 'add') {
        this.id = data ? data.id : null;
        this.ruleForm.name = null;
        this.tool_id = null;
        this.ruleForm.tool_category_id = null;
        this.ruleForm.tool_type_id = null;
      } else {
        this.ruleForm.name = tool.name || tool.title;
        this.id = data.id;
        this.tool_id = tool.id;
        this.ruleForm.tool_category_id = tool.tool_category_id;
        this.ruleForm.tool_type_id = tool.tool_type_id;
      }
    },
    openDialog(type, dialogNumber, editValue) {
      this.ruleForm.name = null;
      this.id = null;
      if (type == 'add') {
        this.dialogNumber = dialogNumber;
        this.dialogType = type;
        this.id = editValue ? editValue.id : null;
        this.dialogFormVisible = true;
      } else if (type == 'edit') {
        this.dialogNumber = dialogNumber;
        this.dialogType = type;
        this.id = editValue.id;
        this.ruleForm.removed = editValue.removed;
        this.ruleForm.name = editValue.name || editValue.title;
        // if (editValue.title) {
        //   this.ruleForm.name = editValue.title;
        // }
        this.dialogFormVisible = true;
      }
    },
    loadTreeNodes(node, resolve) {
      if (node.level === 1) {
        this.$store.dispatch('form/form', node.data.id).then(() => {
          return resolve(this.$store.getters['form/form'].questions);
        });
      } else if (node.level == 2) {
        this.$store.dispatch('form/subform', node.data.id).then(() => {
          return resolve(this.$store.getters['form/subform'].sub_questions);
        });
      }
      return resolve([]);
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {};
          if (this.dialogType == 'add') {
            if (this.dialogNumber == 3) {
              query = {
                title: this.ruleForm.name,
                system: 2,
                removed: Number(this.ruleForm.removed),
              };
              let formData = new FormData();
              for (const [key, value] of Object.entries(query)) {
                if (value || value == 0) {
                  formData.append(key, value);
                }
              }
              this.$store.dispatch('form/addForm', { id: this.id, query: formData }).then(_ => {
                this.$notify({
                  type: 'success',
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.init();
              });
            } else if (this.dialogNumber == 1) {
              query = {
                title: this.ruleForm.name,
                system: 2,
                removed: this.ruleForm.removed,
                form_id: this.id,
              };
              this.$store.dispatch('form/addQuestion', { query: query }).then(() => {
                this.$notify({
                  type: 'success',
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.init();
              });
            } else if (this.dialogNumber == 2) {
              query = {
                title: this.ruleForm.name,
                system: 2,
                removed: this.ruleForm.removed,
                form_id: this.parent_id,
                parent_id: this.id,
              };
              this.$store.dispatch('form/addQuestion', { query: query }).then(() => {
                this.$notify({
                  type: 'success',
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.init();
              });
            }
          } else if (this.dialogType == 'edit') {
            if (this.dialogNumber == 1) {
              query = {
                title: this.ruleForm.name,
                system: 2,
                removed: this.ruleForm.removed,
              };
              this.$store.dispatch('form/addForm', { id: this.id, query: query }).then(() => {
                this.$notify({
                  type: 'success',
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.init();
              });
            } else if (this.dialogNumber == 2) {
              query = {
                title: this.ruleForm.name,
                system: 2,
                removed: this.ruleForm.removed,
              };
              this.$store.dispatch('form/addQuestion', { id: this.id, query: query }).then(() => {
                this.$notify({
                  type: 'success',
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.init();
              });
            }
          }
          this.dialogFormVisible = false;
        }
      });
    },

    init(query) {
      this.$store.dispatch('form/forms', {
        query: {
          limit: 5,
          system: 2,
        },
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
    show(id) {
      // this.$router.push(`/higher/team/${id}`)
    },
    getAsks(row) {
      // console.log("id in form ",id)
      if (this.openNode !== row.id) {
        this.$store.commit('form/SET_FORM', []);
        this.$store.dispatch('form/form', row.id).then(() => {
          this.openNode = row.id;
        });
      }
    },
    // edit(id) {
    //   console.log('edit -> id', id);
    // },
    getSubAsks(row) {
      if (this.openSubNode !== row.id) {
        console.log('subask', this.openSubNode, 'row id', row.id);
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
      //   }
    },
    //   if (row.from == "teamMemberEvaluationForms") {
    getrowkeys(row) {
      return row.id;
    },
  },
  mounted() {
    // this.Refresh({ limit: 200 });
  },
};
</script>

<style lang="scss">
.dialogPart {
  .el-dialog__body {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
}
.tree_form {
  .el-tree-node__children {
    border-right: 1px solid #555;
    border-radius: 10px;
    padding-right: 1rem;
  }

  .el-tree-node__content {
    padding: 0 !important;
    margin-bottom: 0.5rem;
  }

  .el-tree-node__content:hover {
    background-color: transparent !important;
  }

  .tree_form_node.tree_form_node_level_1 {
    i.questions {
      display: none;
    }
  }

  .tree_form_node {
    position: relative;

    i.questions {
      position: absolute;
      right: -8px;
      top: 10px;
      border: 2px solid #fff;
      border-radius: 50%;
      z-index: 2;
    }

    //   &:before{
    //       content: "?";
    //       position: absolute;
    //       right: 0;
    //       top: 50%;
    //       transform: translateY(-50%);
    //      padding: 0.1rem;
    //       background: transparent;
    //       border-radius: 50%;
    //       border: 1px solid #000;
    //   }
  }

  .tree_form_node {
    &:hover {
      background-color: #f5f7fa;
    }

    .tree_form_content {
      font-size: 0.8rem;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      padding: 0.5rem !important;
      border: 1px solid #eee;
    }
  }
}

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
