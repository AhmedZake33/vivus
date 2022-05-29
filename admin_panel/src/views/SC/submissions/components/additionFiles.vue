<template>
  <div>
    <div class="box-card my-2">
      <div class="w-100 mx-2">
        <div v-if="$store.state.user.allowPu || hasPermission('admin_system')" class="bg-light text-black px-3 docs_header rounded-pill d-flex justify-content-between align-items-center">
          <span class="font_16 bg-light rounded mb-0 px-0"> {{ $t('Global.additionalFiles') }} </span>
          <upload
            v-if="time() && ($store.state.submission.last_alert && evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.last_alert.actual_level >= 3)"
            class="w-50"
            oneFile
            file-byfile
            @success="$emit('refresh')"
            :url="`submission/evaluation/pre/upload_documents/${$route.params.id}`"
          >
            <template #upload-content>
              <i style="cursor: pointer" class="el-icon-upload pt-1"></i>
            </template>
          </upload>
        </div>
      </div>
    </div>
    <div v-for="document in documents" :class="isLoad ? 'disabledAll' : ''">
      <div class="p-1 border mb-2 text item docs d-flex justify-content-between align-items-center">
        <div class="d-flex">
          <a :href="document.url" class="mr-4 pointer custom_link custom_tooltip" download target="_blank">{{ document.title }}</a>
          <el-tooltip v-if="document.description" effect="dark" :content="document.description" placement="top-start">
            <i class="mx-1 el-icon-info m-1"></i>
          </el-tooltip>
        </div>
        <div class="d-flex">
          <span class="small text-muted pt-1">{{ document.updated_at ? ' (' + toLocalDatetime(document.updated_at) + ') ' : '' }}</span>
          {{ document.size ? '( ' + document.size + ' ) ' : '' }}
          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
            <el-tooltip effect="dark" :content="$t('archive.updateFile')" placement="top-start">
              <upload
                      v-if="time && ($store.state.submission.last_alert && evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.last_alert.actual_level >= 3)"
                      oneFile
                      file-byfile
                      @success="$emit('refresh')"
                      :url="`archive/update/${document.id}`"
                      style="display: inline"
              >
                <template #upload-content>
                  <span class="pointer"><i class="el-icon-upload m-1 ml-2 mr-2"></i></span>
                </template>
              </upload>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('archive.rename')" placement="top-start">
              <i class="el-icon-edit m-1 ml-2 mr-2" @click="openDialog(document)"></i>
            </el-tooltip>
            <el-tooltip :class="isDeleteLoad ? 'disabledAll' : ''" effect="dark" :content="$t('archive.delete')" placement="top-start">
              <i class="el-icon-delete m-1 ml-2 mr-2" @click="deleteDocument(document.id)" style="cursor: pointer"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="folderDialog" :close-on-click-modal="false" top="4vh">
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <div>
          <el-form-item class="mb-4" :rules="validation(null, 0)" prop="binaryName" :style="'width: 100%;  margin: 10px 3px;'">
            <el-input :placeholder="$t('archive.title')" v-model="ruleForm.binaryName" style="width: 100%"></el-input>
          </el-form-item>
        </div>
        <el-input type="textarea" :placeholder="$t('archive.description')" v-model="ruleForm.description" style="width: 100%; margin-bottom: 10px" maxlength="200" show-word-limit></el-input>

        <el-form-item>
          <el-button class="mr-2 mt-2" type="primary" @click="updateFile('ruleForm')">
            {{ $t('archive.update') }}
          </el-button>
          <el-button class="mr-2 ml-0 mt-2" @click="folderDialog = false">
            {{ $t('archive.cancel') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import upload from '../../../components/upload';

export default {
  name: 'additionFiles',
  props: {
    documents: [Array, Object],
  },
  components: { upload },
  data() {
    return {
      id: null,
      isLoad: false,
      isDeleteLoad: false,
      title: '',
      rules: { binaryName: [{ required: true, message: this.$t('Global.item_required'), trigger: 'blur' }] },
      folderDialog: false,
      ruleForm: {
        description: '',
        binaryName: null,
      },
    };
  },
  methods: {
    time: function () {
      if (this.$store.getters['submission/team']) {
        const now = new Date();
        const end = new Date(Date.parse(this.$store.getters['submission/team'].ends_at.replace(/-/g, ' ')));
        let endTime = end - now;
        if (endTime > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    deleteDocument(id) {
      this.$confirm(this.$t('Global.deleteArchiveMessage'), `${this.$t('Global.warning')}`, {
        confirmButtonText: 'موافق',
        cancelButtonText: 'الغاء',
        type: 'warning',
      }).then(() => {
        this.isDeleteLoad = true;
        this.$store
          .dispatch('archive/delete', {
            resource: {
              id: id,
            },
          })
          .then(response => {
            this.$emit('refresh');
            setTimeout(() => {
              this.isDeleteLoad = false;
            }, 400);
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
          });
      });
    },
    openDialog(item) {
      this.title = this.$t('archive.Rename_File_Title');
      this.id = item.id;
      this.ruleForm.binaryName = item ? item.title : '';
      this.ruleForm.description = item ? item.description : '';
      this.folderDialog = true;
    },
    updateFile(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.folderDialog = false;
          this.isLoad = true;
          this.$store
            .dispatch('archive/rename', {
              resource: { title: this.ruleForm.binaryName, description: this.ruleForm.description },
              id: { id: this.id },
            })
            .then(_ => {
              this.isLoad = false;
              this.$emit('refresh');
              this.$notify({
                type: 'success',
                message: `${this.$t('Global.successMessage')}`,
              });
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.text-black {
  color: #000;
}
</style>
