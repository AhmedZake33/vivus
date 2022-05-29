<template>
  <div>
    <el-card class="box-card" :class="isLoad ? 'disabledAll' : ''">
      <div v-if="$store.state.submission.teamDocuments" v-for="(parent, index) in $store.state.submission.teamDocuments">
        <div class="docs_header d-flex justify-content-between align-items-center">
          <span>{{ parent.title }}</span>
        </div>
        <div v-for="(document, index) in parent.children" class="p-1 border mb-2 text item docs d-flex justify-content-between align-items-center">
          <div class="d-flex">
            <a download class="mr-2 pointer custom_link custom_tooltip" :class="document.mandatory == 1 ? 'custom_required' : ''" target="_blank" :href="getDocUrl($store.getters['submission/MainUploadsDocuments'], document.short_name)"
              ><span style="line-height: 17px" class="p-0 el-form-item__label" :class="!checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name) ? 'text-danger' : ''">{{ document.title }} </span></a
            >
            <el-tooltip v-if="document.description" effect="dark" placement="top-start">
              <i class="mx-1 el-icon-info"></i>
              <div slot="content">
                <span v-for="desc in oneLineToLines(20, document.description)"> {{ `${desc}` }} <br /> </span>
              </div>
            </el-tooltip>
          </div>
          <div class="d-flex">
            <span class="ml-2 mr-2" :class="!checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name) ? 'text-danger' : ''"
              >{{ getDocSize($store.getters['submission/MainUploadsDocuments'], document.short_name) }} {{ !checkIfExist($store.getters['submission/MainUploadsDocuments'], document.short_name) ? '( لم يتم الرفع )' : '' }}</span
            >
            <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
              <div v-if="(!$store.getters['submission/decision'] || ($store.getters['submission/decision'] && !$store.getters['submission/decision'].name)) && evaluatorCheck(['TEAM_TYPE'])">
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
      isDeleteLoad: false,
    };
  },
  props: {
    name: String,
  },

  methods: {
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
            this.refresh();
            setTimeout(() => {
              this.isDeleteLoad = false;
            }, 400);
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
          this.$store.dispatch('notes/subState', this.$route.params.submission_id).then(() => {
            this.isLoad = false;
          });
        });
      });
    },
    refresh() {
      this.init();
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
