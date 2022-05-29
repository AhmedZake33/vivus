<template>
  <div>
    <div v-for="document in documents" v-if="!document.short_name">
      <div class="p-1 border mb-2 text item docs d-flex justify-content-between align-items-center">
        <div class="d-flex">
          <a :href="document.url" class="mr-4 pointer custom_link custom_tooltip" download target="_blank">{{ document.title }}</a>
          <el-tooltip v-if="document.description" effect="dark" :content="document.description" placement="top-start">
            <i class="mx-1 el-icon-info m-1"></i>
          </el-tooltip>
        </div>
        <!-- $store.getters['submission/lastStatus'] &&
            $store.getters['evaluation/currentLevel'] &&
            $store.getters['evaluation/currentLevel'] === 4 &&
            $store.getters['submission/lastStatus'].status &&
            $store.getters['submission/lastStatus'].status.task_id != 4 &&
            isAuth($store.getters['submission/representative']) -->
        <div class="d-flex" v-if="$store.getters['submission/canUpload'] || ($store.state.submission.current_status && isGthCurrentStatus($store.state.submission.current_status, this.constants('FINANCE_STATUS')) && $store.getters['evaluation/currentLevel'] == 0)">
          <span class="small text-muted pt-1">({{ toLocalDatetime(document.updated_at) }})</span>
          ( {{ document.size }})

  
          <template v-if="($store.state.user.allowHr || hasPermission('admin_system') )&& ($store.state.submission.last_alert && $store.state.submission.last_alert.type == 1 )">
            <el-tooltip effect="dark" :content="$t('archive.rename')" placement="top-start">
              <i class="el-icon-edit m-1" @click="openDialog(document)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('archive.updateFile')" placement="top-start">
              <upload oneFile file-byfile @success="$emit('refresh')" :url="`archive/update/${document.id}`" style="display: inline">
                <template #upload-content>
                  <span class="pointer"><i class="el-icon-upload pt-1 m-1"></i></span>
                </template>
              </upload>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('archive.delete')" placement="top-start">
              <i class="el-icon-delete m-1" @click="deleteDocument(document.id)" style="cursor: pointer"></i>
            </el-tooltip>
          </template>
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
    documents: Array,
  },
  components: { upload },
  data() {
    return {
      id: null,
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
    deleteDocument(id) {
      this.$emit('delete_item', id);
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
          this.$store
            .dispatch('archive/rename', {
              resource: { title: this.ruleForm.binaryName, description: this.ruleForm.description },
              id: { id: this.id },
            })
            .then(_ => {
              this.folderDialog = false;
              this.$emit('refresh');
            });
        }
      });
    },
  },
};
</script>

<style scoped></style>
