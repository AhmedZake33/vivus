<template>
  <div>
    <el-card class="box-card mb-2" :class="isLoad ? 'disabledAll' : ''">
      <div slot="header" class="d-flex justify-content-between align-items-center">
        <span>{{ $t('Global.addBaseFiles') }}</span>
      </div>
      <div class="d-flex flex-column" v-if="documents" v-for="(mainDocument, mainIndex) in documents.documents">
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12">
              <div class="w-100 mx-2">
                <div class="docs_header d-flex justify-content-between align-items-center">
                  <span class="font_16 d-block">
                    {{ mainIndex }}
                  </span>
                </div>
              </div>
              <div v-for="(innerdoc, cat) in mainDocument">
                <div class="p-1 border mb-2 text item docs d-flex justify-content-between align-items-center">
                  <div class="d-flex justify-content-between">
                    <a download target="_blank" :href="innerdoc.url" :class="innerdoc.category != 6 ? 'custom_required' : ''" class="mr-4 pointer custom_link">
                      <span :class="!innerdoc.url ? 'text-danger' : ''" style="line-height: 17px">
                        {{ innerdoc.name }}
                        <span class="small">
                          {{ innerdoc.url ? '' : '' }}
                        </span>
                      </span>
                    </a>
                  </div>
                  <div class="d-flex">
                    <div>
                      <span class="small text-muted pt-1">{{ innerdoc.updated_at ? '(' + toLocalDatetime(innerdoc.updated_at) + ')' : '' }}</span>
                      {{ innerdoc.size ? '(' + innerdoc.size + ')' : '' }}
                      <span class="text-danger" v-if="!innerdoc.size">( لم يتم الرفع )</span>
                    </div>
                    <template>
                      <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                        <upload initDoc v-if="!innerdoc.url" oneFile file-byfile teamFiles @success="$emit('refresh')" :url="`submission/pre/upload_documents/${$route.params.id}/${innerdoc.id}`" style="display: inline" :index="innerdoc.id">
                          <template #upload-content>
                            <span class="pointer"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                          </template>
                        </upload>
                        <upload initDoc v-else oneFile file-byfile teamFiles @success="$emit('refresh')" :url="`submissions/submission/update_document/${innerdoc.id}/${$route.params.id}`" style="display: inline" :index="innerdoc.id">
                          <template #upload-content>
                            <span class="animate"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                          </template>
                          <template #delete-file>
                            <span @click="deleteDocument(innerdoc.id)" :class="isDeleteLoad ? 'disabledAll' : ''" :id="`deleteIcon_${innerdoc.id}`" class="animate"><i class="el-icon-delete" style="margin: 0 10px"></i></span>
                          </template>
                        </upload>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <!--                            </CCardBody>-->
            </CCol>
          </CRow>
        </div>
      </div>
      <el-footer style="height: auto">
        <div v-if="$store.state.submission.initDocuments"  class="baseButton resetButton" style="justify-content: flex-start">
          <button :class="$store.state.submission.initDocuments.details.need == 0 ? '' : 'disabledAll'" class="el-button el-button--default is-round sec_color mx-1" @click="next()" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            <CSpinner v-if="isLoad" color="default" size="sm" />
            {{ $route.params.id ? $t('Global.next') : $t('Global.next') }}
          </button>
          <button @click="back" class="el-button--small el-button el-button--default is-round" type="reset" style="padding: 0.6rem 1rem">
            {{ $t('Global.undo') }}
          </button>
        </div>
      </el-footer>
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
    documents: [Array, Object],
  },

  methods: {
    next() {
      this.$router.push(`/school/submissions/edit/${this.$route.params.ev_id||2}/${this.$route.params.id}/3`);
    },
    back(){
      this.$router.go(-1)
    },
    deleteDocument(id) {
      this.$confirm(this.$t('Global.deleteArchiveMessage'), 'انتبة', {
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
            this.init();
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
        this.$store.dispatch('submission/approveQuality', this.$route.params.id).then(() => {
          this.$notify.success({ message: 'تمت العملية بنجاح' });
          this.init();
          this.isLoad = false;
        });
      });
    },
    // refresh() {
    //   this.init();
    //   this.$store.dispatch('notes/subState', this.$route.params.id);
    //   this.$emit('refresh');
    // },
    init() {
      this.$store.dispatch('submission/SCedit', {
        id: this.$route.params.id ? this.$route.params.id : null,
        query: {},
      });
    },
  },
  mounted() {
    // this.init();
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
