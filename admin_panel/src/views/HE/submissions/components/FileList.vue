<template>
  <div>
    <el-card class="box-card" :class="isLoad ? 'disabledAll' : ''">
      <div slot="header" class="d-flex justify-content-between align-items-center">
        <span>{{ $t('Global.FilesNeeded') }}</span>
      </div>
      <div v-for="(parent, index) in $store.getters['submission/mainDocuments']">
        <div class="docs_header d-flex justify-content-between align-items-center">
          <span>{{ parent.title }} </span>
        </div>
        <div v-for="(document, index) in parent.children" class="p-1 border mb-2 text item docs d-flex justify-content-between align-items-center">
          <div>
            <a class="custom_required mr-4 pointer custom_link custom_tooltip" download target="_blank" :href="getDocUrl($store.getters['submission/MainUploadsDocuments'], document.short_name)">
              <span class="mr-0" :class="!checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name) ? 'text-danger' : ''">{{ document.title }} </span></a
            >
            <el-tooltip v-if="document.description" effect="dark" :content="document.description" placement="top-start">
              <i class="mx-1 el-icon-info"></i>
            </el-tooltip>
          </div>
          <div class="d-flex">
            <span class="ml-2 mr-2" :class="!checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name) ? 'text-danger' : ''">
              <span class="small text-muted"> {{ getDocDate($store.getters['submission/MainUploadsDocuments'], document.short_name) ? getDocDate($store.getters['submission/MainUploadsDocuments'], document.short_name) : '' }}</span>
              {{ getDocSize($store.getters['submission/MainUploadsDocuments'], document.short_name) }} {{ !checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name) ? '( لم يتم الرفع )' : '' }}
            </span>
            <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
              <div class="d-flex" v-if="$store.state.submission.showFiles && (hasPermission('admin_submissions') || evaluatorCheck(['ORGANIZATION_TYPE']))">
                <upload
                  oneFile
                  file-byfile
                  teamFiles
                  @success="$emit('refresh')"
                  v-if="!checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name)"
                  :url="`submission/upload_documents/${$route.params.submission_id}/${document.id}`"
                  :body="{ folder: true }"
                  style="display: inline"
                  :index="document.short_name"
                >
                  <template #upload-content>
                    <span class="pointer"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                  </template>
                </upload>
                <upload
                  oneFile
                  file-byfile
                  teamFiles
                  @success="$emit('refresh')"
                  v-if="checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name)"
                  :url="`submissions/submission/update_document/${getDocId($store.getters['submission/MainUploadsDocuments'], document.short_name)}/${$route.params.submission_id}`"
                  style="display: inline"
                  :index="document.short_name"
                >
                  <template #upload-content>
                    <span class="animate"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                  </template>
                  <template #delete-file>
                    <span
                      :class="isDeleteLoad ? 'disabledAll' : ''"
                      :id="`deleteIcon_${document.short_name}`"
                      class="animate"
                      @click="deleteDocument(getDocId($store.getters['submission/MainUploadsDocuments'], document.short_name))"
                      v-if="checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name)"
                      ><i class="el-icon-delete" style="margin: 0 10px"></i
                    ></span>
                  </template>
                </upload>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import upload from '../../../components/upload';

export default {
  components: { upload },
  data() {
    return {
      isLoad: false,
      mandatoryFiles: [],
    };
  },
  props: {
    name: String,
  },

  methods: {
    deleteDocument(id) {
      this.$confirm(this.$t('Global.deleteArchiveMessage'), 'Warning', {
        confirmButtonText: 'موافق',
        cancelButtonText: 'الغاء',
        type: 'warning',
      }).then(() => {
        this.$store
          .dispatch('archive/delete', {
            resource: {
              id: id,
            },
          })
          .then(response => {
            this.refresh();
          });
      });
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
          this.isLoad = false;
        });
      });
    },
    refresh() {
      this.init();
      this.$store.dispatch('notes/subState', this.$route.params.submission_id);
      this.$emit('refresh');
    },
    init() {
      this.$store.dispatch('submission/getSubmissionDocument', this.$route.params.submission_id);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
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
