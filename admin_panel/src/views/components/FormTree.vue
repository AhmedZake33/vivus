<template>
  <div>
    <CCard>
      <CCardHeader>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
            <i class="el-icon-star-on"></i>
            {{ $t('Global.forms') }}
          </div>
          <CDropdown v-if="!hide_action" color="success" placement="bottom-end" size="sm" class="customDrop">
            <template #toggler-content>
              <CIcon name="cil-settings" />
              <span style="font-weight: bold">{{ $t('Global.action') }}</span>
            </template>
            <slot name="header_action"></slot>
          </CDropdown>
        </div>
      </CCardHeader>
      <CCardBody id="tree">
        <CCol sm="12">
          <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''" style="width: 100%">
            <el-tree :expand-on-click-node="closeAll" class="filter-tree tree_form" :data="data" accordion icon-class=" top" ref="tree" :highlight-current="false" :lazy="true" :default-expand-all="false" :load="loadTreeNodes">
              <div slot-scope="{ node, data }" :class="`tree_form_node tree_form_node_level_${node.level} mr-${node.level != 1 ? node.level + 1 : 0} ml-${node.level + 1 != 1 ? node.level : 0}`" style="width: 100%">
                <i class="el-icon-question questions"></i>
                <div class="tree_form_content" v-if="node.level === 1">
                  <div class="tree_form_header">
                    <i class="el-icon-caret-left"></i>
                    <CSpinner v-if="node.expanded && $store.getters['form/formLoad']" size="sm" color="info" />
                    {{ data.name }}
                  </div>
                  <div class="actions d-flex" @click="collapseAll">
                    <!-- <div class="d-inline">
                      <i class="el-icon-view"></i>
                    </div> -->
                    <span v-if="data.removed" class="text-danger">{{ $t('Global.remove') }}</span>
                    <div @click="edit(data, 'edit', 1)" class="d-inline ml-2 mr-2">
                      <i class="el-icon-edit-outline"></i>
                    </div>
                    <div @click="addSub(data, 'add', 1)" class="d-inline">
                      <i class="el-icon-circle-plus-outline"></i>
                    </div>
                  </div>
                </div>
                <div class="tree_form_content" v-if="node.level === 2">
                  <div class="tree_form_header">
                    <i class="el-icon-caret-left"></i>
                    {{ data.title }}
                  </div>
                  <div class="actions d-flex" @click="collapseAll">
                    <span v-if="data.removed" class="text-danger">{{ $t('Global.remove') }}</span>
                    <div @click="edit(data, 'edit', 2)" class="d-inline ml-2 mr-2">
                      <i class="el-icon-edit-outline"></i>
                    </div>
                    <div @click="addSub(data, 'add', 2)" class="d-inline">
                      <i class="el-icon-circle-plus-outline"></i>
                    </div>
                  </div>
                </div>
                <div class="tree_form_content" v-if="node.level === 3">
                  <div class="tree_form_header">
                    <i class="el-icon-caret-left"></i>
                    {{ data.title }}
                  </div>
                  <div class="actions d-flex" @click="collapseAll">
                    <span v-if="data.removed" class="text-danger">{{ $t('Global.remove') }}</span>
                    <div @click="edit(data, 'edit', 2)" class="d-inline ml-2 mr-2">
                      <i class="el-icon-edit-outline"></i>
                    </div>
                    <div v-if="system == 'SC'" @click="addSub(data, 'add', 2)" class="d-inline">
                      <i class="el-icon-circle-plus-outline"></i>
                    </div>
                  </div>
                </div>
                <div class="tree_form_content" v-if="node.level === 4 && system == 'SC'">
                  <div class="tree_form_header">
                    <i class="el-icon-caret-left"></i>
                    {{ data.title }}
                  </div>
                  <div class="actions d-flex" @click="collapseAll">
                    <span v-if="data.removed" class="text-danger">{{ $t('Global.remove') }}</span>
                    <div @click="edit(data, 'edit', 2)" class="d-inline ml-2 mr-2">
                      <i class="el-icon-edit-outline"></i>
                    </div>
                    <div v-if="system == 'SC'" @click="addSub(data, 'add', 2)" class="d-inline">
                      <i class="el-icon-circle-plus-outline"></i>
                    </div>
                  </div>
                </div>
                <div class="tree_form_content" v-if="node.level === 5 && system == 'SC'">
                  <div class="tree_form_header">
                    <i class="el-icon-caret-left"></i>
                    {{ data.title }}
                  </div>
                  <div class="actions d-flex" @click="collapseAll">
                    <span v-if="data.removed" class="text-danger">{{ $t('Global.remove') }}</span>
                    <div @click="edit(data, 'edit', 2)" class="d-inline ml-2 mr-2">
                      <i class="el-icon-edit-outline"></i>
                    </div>
                    <div v-if="system == 'SC'" @click="addSub(data, 'add', 2)" class="d-inline">
                      <i class="el-icon-circle-plus-outline"></i>
                    </div>
                  </div>
                </div>
                <div class="tree_form_content flex-column" v-if="node.level === 6 && system == 'SC'">
                  <div class="d-flex justify-content-between">
                    <div class="tree_form_header">
                      <i class="el-icon-caret-left"></i>
                      {{ data.title }}
                    </div>
                    <div class="actions d-flex" @click="collapseAll">
                      <span v-if="data.removed" class="text-danger">{{ $t('Global.remove') }}</span>
                      <div @click="edit(data, 'edit', 2)" class="d-inline ml-2 mr-2">
                        <i class="el-icon-edit-outline"></i>
                      </div>
                    </div>
                  </div>
                  <div class="mt-2">
                    <div v-if="data.relation_tools && data.relation_tools.length" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                      <div class="position-relative report_style p-2 mx-3 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                        <CBadge color="info badge-pill" class="topRight">{{ $t('Global.tool') }}</CBadge>
                        <div v-for="tool in data.relation_tools" class="mt-1 mb-1 d-flex justify-content-between">
                          <span class="mb-2">
                            {{ tool.name }}
                          </span>
                          <div class="d-inline ml-2 mr-2">
                            <i @click="addTools(data, 'edit', tool)" class="el-icon-edit-outline"></i>
                          </div>
                        </div>
                        <div class="mt-3">
                          <el-button @click="addTools(data, 'add', null)" icon="el-icon-plus" round size="mini" type="primary">{{ $t('Global.add') }} </el-button>
                        </div>
                      </div>
                    </div>
                    <div v-else class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                      <div class="position-relative report_style p-2 mx-3 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                        <CBadge color="info badge-pill" class="topRight">{{ $t('Global.tool') }}</CBadge>
                        <div class="mt-1">
                          <span class="text-muted">{{ $t('Global.nodata') }}</span>
                          <el-button @click="addTools(data, 'add', null)" icon="el-icon-plus" round size="mini" type="primary">{{ $t('Global.add') }} </el-button>
                        </div>
                      </div>
                    </div>
                    <div v-if="data.rubrics && data.rubrics.length" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                      <div class="position-relative report_style p-2 mx-3 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                        <CBadge color="info badge-pill" class="topRight">{{ $t('Global.Rubrics') }}</CBadge>
                        <div v-for="rubric in data.rubrics" class="mt-1 mb-1 d-flex justify-content-between">
                          <span class="mb-2">
                            {{ rubric.name }}
                          </span>
                          <div class="d-inline ml-2 mr-2">
                            <i @click="addRubrics(data, 'edit', rubric)" class="el-icon-edit-outline"></i>
                          </div>
                        </div>
                        <div class="mt-3">
                          <el-button @click="addRubrics(data, 'add', null)" icon="el-icon-plus" round size="mini" type="primary">{{ $t('Global.add') }} </el-button>
                        </div>
                      </div>
                    </div>
                    <div v-else class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                      <div class="position-relative report_style p-2 mx-3 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                        <CBadge color="info badge-pill" class="topRight">{{ $t('Global.Rubrics') }}</CBadge>
                        <div class="mt-1">
                          <span class="text-muted">{{ $t('Global.nodata') }}</span>
                          <el-button @click="addRubrics(data, 'add', null)" icon="el-icon-plus" round size="mini" type="primary">{{ $t('Global.add') }} </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tree_form_content" v-for="(tool, i) in data.tools" :key="i" v-if="node.level === 6 && system == 'SC'">
                <div class="tree_form_header">
                  <i class="el-icon-question questions"></i>
                  {{ tool.question }} ({{ tool.type }})
                </div>
                <div class="actions d-flex" @click="collapseAll">
                  <span v-if="tool.removed" class="text-danger">{{ $t('Global.remove') }}</span>
                  <div @click="edit(data, 'edit', 2)" class="d-inline ml-2 mr-2">
                    <i class="el-icon-edit-outline"></i>
                  </div>
                </div>
              </div>
            </el-tree>
          </div>
        </CCol>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import DataTable from '../components/DataTable';
export default {
  name: 'forms',
  components: { DataTable },
  props: {
    data: Array,
    system: String,
    hide_action: Boolean,
  },
  data() {
    return {
      closeAll: true,
      openNode: Number,
      openSubNode: Number,
      id: null,
      dialogFormVisible: false,
      dialogNumber: null,
      ruleForm: {
        name: null,
        questions: null,
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
    collapseAll() {
      this.closeAll = false;
      setTimeout(() => {
        this.closeAll = true;
      }, 100);
    },
    addRubrics(data, type, rubric) {
      this.$emit('openRubricsDialog', data, type, rubric);
    },
    addTools(data, type, tool) {
      this.$emit('openToolsDialog', data, type, tool);
    },
    edit(data, type, num) {
      if (this.system == 'HE') {
        this.$emit('openDialog', type, num, data);
      } else if (this.system == 'SC' && num == 6) {
        this.$router.push(`/school/form/edit/${data.id}`);
      } else {
        this.$emit('openDialog', type, num, data);
      }
    },
    addSub(data, type, num) {
      if (this.system == 'HE') {
        this.$emit('openDialog', type, num, data);
      } else if (this.system == 'SC' && num == 6) {
        this.$router.push(`/school/form/add`);
      } else {
        this.$emit('openDialog', type, num, data);
      }
    },
    openDialog(type, dialogNumber, editValue) {
      this.ruleForm.name = null;
      this.id = null;
      if (type == 'add') {
        this.dialogNumber = dialogNumber;
        this.id = editValue ? editValue.id : null;
        this.dialogFormVisible = true;
      } else if (type == 'edit') {
        this.dialogNumber = dialogNumber;
        this.id = editValue.id;
        this.ruleForm.name = editValue.name;
        if (editValue.title) {
          this.ruleForm.name = editValue.title;
        }
        this.dialogFormVisible = true;
      }
    },
    loadTreeNodes(node, resolve) {
      if (node.level === 1) {
        this.$store.dispatch('form/form', node.data.id).then(() => {
          return resolve(this.$store.getters['form/form'].all_questions);
        });
      } else if ([2, 3, 4, 5].includes(node.level)) {
        this.$store.dispatch('form/subquestions', node.data.id).then(() => {
          return resolve(this.$store.getters['form/subQuestions']);
        });
      }
      return resolve([]);
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('form/addForm', { id: this.id, query: this.ruleForm });
          this.dialogFormVisible = false;
        }
      });
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
  },
  mounted() {
    this.$emit('init');
  },
};
</script>

<style lang="scss">
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
