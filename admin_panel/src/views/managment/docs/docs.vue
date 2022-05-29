<template>
  <div>
    <el-card class="box-card" :class="isLoad ? 'disabledAll' : ''">
      <div slot="header" class="d-flex justify-content-between align-items-center">
        <span>{{ $t('Global.FilesNeeded') }}</span
        ><CSpinner v-if="isLoad" size="sm" color="info" />
      </div>

      <div class="d-flex flex-column" v-if="$store.getters['submission/editableDocs']" v-for="(mainDocument, mainIndex) in $store.getters['submission/editableDocs']">
        <div v-if="(mainDocument.category == 3 && mainIndex == 2) || (mainDocument.category == 4 && mainIndex == 5)" class="my-3 docs_header text-center d-flex align-items-center">
          <span class="text-center info">{{ mainDocument.category == 3 ? `${$t('Global.any_program')}` : `${$t('Global.any_university')}` }}</span>
        </div>

        <div class="docs_header d-flex justify-content-between align-items-center">
          <span class="d-flex justify-content-between">
            <div>
              {{ mainDocument.title }}
            </div>
            <div class="d-flex">
            </div>
          </span>
        </div>

        <div>
          <el-collapse @change="changeArrow(folder.id)" v-for="(folder, index) in mainDocument.all_children" class="custom_collapse custom_collapse_docs" v-model="activeName" accordion>
            <el-collapse-item :class="mainDocument.all_children[index].all_children.length == 0 ? 'avoid_clicks' : ''" :title="folder.title" :name="folder.id">
              <template slot="title">
                <i v-if="mainDocument.all_children[index].all_children.length != 0" class="el-icon-caret-left" :id="folder.id"></i>
                <CCardHeader class="w-100">
                  <div :id="`${folder.id}in`" class="d-flex justify-content-between w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block">
                    <div class="mx-2" :class="folder.mandatory ? 'custom_required' : ''">
                      <strong>{{ folder.title }} </strong>
                    </div>
                    <div v-if="folder.category != 1" class="d-flex" @click="noOpen(folder.id)" style="pointer-events: auto">
                      <div class="d-inline ml-2 mr-2">
                        <span v-if="folder.removed" class="text-danger">{{$t('Global.remove')}}</span>
                      </div>
                      <div @click="deleteDocs(folder)" class="d-inline ml-2 mr-2">
                        <i :class=" (folder.removed)? 'el-icon-refresh' : 'el-icon-delete'"></i>
                      </div>
                      <div @click="openDialog(folder)" class="d-inline">
                        <i class="el-icon-edit-outline"></i>
                      </div>
                    </div>
                  </div>
                </CCardHeader>
              </template>

              <div v-for="(document, index) in folder.all_children" class="p-1 mt-2 text docs d-flex justify-content-between align-items-center">
                <div>
                  <a class="pointer custom_link custom_tooltip" :class="document.mandatory ? 'el-form-item is-required el-form-item--small p-0' : ''"
                    ><span style="line-height: 17px" class="el-form-item__label">{{ document.title }} </span></a
                  >
                  <el-tooltip v-if="document.description" effect="dark" placement="top-start">
                    <i class="mx-1 el-icon-info"></i>
                    <div slot="content">
                      <span v-for="desc in oneLineToLines(20, document.description)"> {{ `${desc}` }} <br /> </span>
                    </div>
                  </el-tooltip>
                </div>
                <div class="d-flex">
                  <div v-if="document.category != 1" class="d-flex" @click="noOpen(folder.id)" style="pointer-events: auto">
                    <div class="d-inline ml-2 mr-2">
                      <span v-if="document.removed" class="text-danger">{{$t('Global.remove')}}</span>
                    </div>
                    <div @click="deleteDocs(document)" class="d-inline ml-2 mr-2">
                      <i :class=" (document.removed)? 'el-icon-refresh' : 'el-icon-delete'"></i>
                    </div>
                    <div @click="openDialog(document)" class="d-inline">
                      <i class="el-icon-edit-outline "></i>
                    </div>
                  </div>
                  <div class="d-flex"></div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-card>
    <el-dialog :title="$t('Global.editDocs')" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" label-position="top" status-icon :model="ruleForm" :rules="rules">
        <el-form-item :rules="validation()" :label="$t('Global.name')" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off" :placeholder="$t('Global.name')"></el-input>
        </el-form-item>
        <el-form-item :rules="{ rule: false }" :label="$t('archive.description')" prop="name">
          <el-input v-model="ruleForm.description" autocomplete="off" :placeholder="$t('archive.description')"></el-input>
        </el-form-item>
        <el-form-item :rules="validation(false, 1)" :label="$t('Global.typeFile')" prop="type">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="ruleForm.type" filterable ref="type" :placeholder="$t('Global.typeForm')" style="width: 100%">
            <el-option class="el-input" :value="0" :label="$t('Global.mandatory')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.mandatory') }}
              </span>
            </el-option>
            <el-option class="el-input" :value="1" :label="$t('Global.notMandatory')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.notMandatory') }}
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
      <span slot="footer" class="dialog-footer" :class="isLoad ? 'disabledAll' : ''">
        <el-button type="primary" @click="save('ruleForm')">{{ $t('Global.save') }}</el-button>
        <el-button
          @click="dialogFormVisible = false; id = null;"
          class="mr-1 ml-1"
          >{{ $t('Global.cancel') }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from '@/views/components/upload';

export default {
  components: { upload },
  data() {
    return {
      isLoad: false,
      isDeleteLoad: false,
      mandatoryFiles: [],
      activeName: 0,
      id: null,
      dialogFormVisible: false,
      ruleForm: {
        name: null,
        type: null,
        system: 1,
        description: null,
      },
      rules: {
        name: [{ required: true, message: 'من فضلك يجب كتابة النموذج', trigger: 'blur' }],
        questions: [{ required: true, message: 'من فضلك يجب كتابة النموذج  ', trigger: 'change' }],
      },
    };
  },
  props: {
    name: String,
  },

  methods: {
    noOpen(id) {
      document.getElementById(`${id}in`).click();
    },
    deleteDocs(document) {
      this.$confirm( (document.removed)? this.$t('Global.RestoreDocument'):this.$t('Global.deleteArchiveMessage'), `${this.$t('Global.warning')}`, {
        confirmButtonText: 'موافق',
        cancelButtonText: 'الغاء',
        type: 'warning',
      })
        .then(() => {
          this.isDeleteLoad = true;
          this.$store.dispatch('submission/deleteDoc', document.id).then(response => {
            this.refresh();
            setTimeout(() => {
              this.isDeleteLoad = false;
            }, 400);
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
          });
        })
        .catch(_ => {});
    },
    changeArrow(id) {
      if (id) {
        let newArrow = document.getElementById(`${id}`);
        if (newArrow) {
          if (newArrow.classList.contains('el-icon-caret-left')) {
            let allArrows = this.$el.querySelectorAll('.custom_collapse .el-icon-caret-bottom');
            allArrows.forEach(element => {
              element.classList.remove('el-icon-caret-bottom');
              element.classList.add('el-icon-caret-left');
            });
            newArrow.classList.remove('el-icon-caret-left');
            newArrow.classList.add('el-icon-caret-bottom');
          } else {
            newArrow.classList.remove('el-icon-caret-bottom');
            newArrow.classList.add('el-icon-caret-left');
          }
        }
      }
      this.hideClass('.el-collapse-item__arrow');
    },

    submitUpload() {
      this.$confirm(this.$t('Global.ensureMessage'), {
        confirmButtonText: 'موافقة',
        cancelButtonText: 'الغاء',
        type: 'success',
      }).then(() => {
        this.isLoad = true;
        this.$store.dispatch('submission/approveQuality', this.$route.params.submission_id).then(() => {
          this.$notify.success({ message: 'تمت العملية بنجاح' });
          this.refresh();
          this.$store.dispatch('notes/subState', this.$route.params.submission_id).then(() => {
            this.isLoad = false;
          });
        });
      });
    },
    refresh() {
      this.init();
      this.$emit('refresh');
      this.progressNum = null;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = { title: this.ruleForm.name, mandatory: this.ruleForm.type, description: this.ruleForm.description };
          this.isLoad = true;
          this.$store
            .dispatch('submission/editDoc', { id: this.id, query })
            .then(_ => {
              this.init();
              this.resetForm('ruleForm');
            })
            .catch(er => {
              this.isLoad = false;
            });
        }
      });
    },
    openDialog(document) {
      this.id = document.id;
      this.ruleForm.name = document.title;
      this.ruleForm.description = document.description;
      this.ruleForm.type = document.type;
      this.dialogFormVisible = true;
    },
    init() {
      this.isLoad = true;
      this.$store.dispatch('submission/getAllDocument').then(_ => {
        this.isLoad = false;
        this.dialogFormVisible = false;
      });
    },
  },
  updated() {
    this.hideClass('.el-collapse-item__arrow');
  },
  mounted() {
    this.init();
    this.changeArrow();
  },
};
</script>

<style lang="scss">
.avoid_clicks {
  pointer-events: none;
}
@media (max-width: 600px) {
  .el-tabs {
    .docs {
      flex-direction: column;
      div:nth-of-type(1) {
        display: flex;
        i {
          margin-top: 0.2rem;
        }
      }
    }
  }
}
.custom_collapse_docs {
  border-right: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  margin-bottom: 0.5rem;
  .el-collapse-item__header {
    height: 37px;
  }
}
.disabled_color {
  background-color: #eee;
  color: #000;
  border-color: transparent;
  opacity: 0.5;

  &:focus {
    background-color: #eee;
    color: #000;
    border-color: transparent;
  }

  &:hover {
    background-color: #eee;
    color: #000;
    border-color: transparent;
  }

  &:active {
    color: #000;
    border-color: transparent;
    outline: 0;
  }
}



.docs {
  .el-progress__text {
    display: none;
  }

  .el-progress-circle {
    width: 20px !important;
    height: 20px !important;
  }
}
</style>
