<template>
  <div class="custom_info_alert custom_alert">
    <el-alert :closable="false" effect="dark" class="my-2 animate" type="info" show-icon>
      <div class="d-flex">
        <span> {{ $t('Global.FilesNeededInfo') }} </span>
      </div>
    </el-alert>
    <el-card class="box-card my-2">
      <div slot="header">
        <div class="d-flex justify-content-between" v-if="$store.state.documents.options">
          <div class="d-flex">
            <span class="font-weight-bolder" v-if="$store.getters['documents/documents']">
              {{ $t('Global.FilesNeeded') }}
              <span class="small text-muted" v-if="$store.getters['documents/documents'].details">
                {{ $t('Global.document_message', { all: $store.getters['documents/documents'].details.all, need: $store.getters['documents/documents'].details.need, upload: $store.getters['documents/documents'].details.upload_count }) }}
              </span>
            </span>
            <div style="float:left" v-if="$store.getters['documents/documents']  && $store.getters['documents/documents'].details.need > 0">
                &nbsp;<CBadge color="success">{{$t('Global.maxFileSize') }} : 20 MB</CBadge>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column" v-if="$store.getters['documents/documents']" v-for="(mainDocument, mainIndex) in $store.getters['documents/documents'].documents">
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
                <template v-if="evaluatorCheck(['ORGANIZATION_TYPE']) && innerdoc.category == 7">
                  <small v-if="cat == 0" class="small text-muted align-content-center"> لا يمكنك مشاهدة هذه الملفات </small>
                </template>
                <template v-else>
                  <div v-if="innerdoc.category == 6 && cat == 0 && time" class="d-flex justify-content-end">
                    <small class="small text-muted align-content-center">
                      <vue-countdown v-if="time" class="small text-muted mb-0 font-weight-bolder" style="font-size: 12px" :time="time" :interval="100" v-slot="{ days, hours, minutes, seconds }">
                        {{ $t('Global.remainingTime') }}：{{ days }} {{ $t('Global.days') }}, {{ hours }} {{ $t('Global.hours') }}, {{ minutes }} {{ $t('Global.minutes') }}, {{ seconds }} {{ $t('Global.seconds') }}
                      </vue-countdown>
                    </small>
                  </div>
                  <small v-else></small>
                  <el-alert v-if="innerdoc.category == 6 && cat == 0" :closable="false" effect="dark" class="my-2 animate" type="info" show-icon>
                    <div class="d-flex">
                      <span> {{ $t('Global.additionalInfo') + '(' + $t('Global.noLeaderUpload') + ')' }} </span>
                    </div>
                  </el-alert>
                  <el-alert v-if="innerdoc.category == 5 && cat == 0" :closable="false" effect="dark" class="my-2 animate" type="info" show-icon>
                    <div class="d-flex">
                      <span> {{ $t('Global.noLeaderUpload') }} </span>
                    </div>
                  </el-alert>
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
                      <template v-if="(evaluatorCheck(['COMMITTEE_TYPE']) || hasPermission('all_submissions')) && innerdoc.category == 8 ">
                        <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                          <upload v-if="!innerdoc.url" oneFile file-byfile school teamFiles @success="$emit('refresh')" :url="`submission/pre/upload_documents/${$route.params.submission_id}/${innerdoc.id}`" style="display: inline" :index="innerdoc.id">
                            <template #upload-content>
                              <span class="pointer"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                            </template>
                          </upload>
                          <upload v-else oneFile file-byfile teamFiles @success="$emit('refresh')" :url="`submissions/submission/update_document/${innerdoc.id}/${$route.params.submission_id}`" style="display: inline" :index="innerdoc.id">
                            <template #upload-content>
                              <span class="animate"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                            </template>
                            <template #delete-file>
                              <span @click="deleteDocument(innerdoc.id)" :class="isDeleteLoad ? 'disabledAll' : ''" :id="`deleteIcon_${innerdoc.id}`" class="animate"><i class="el-icon-delete" style="margin: 0 10px"></i></span>
                            </template>
                          </upload>
                        </div>
                      </template>

                      <template
                        v-else-if="
                          (innerdoc.category == 6 && time && !evaluatorCheck(['TEAM_TYPE'])) ||
                          (innerdoc.category == 7 && evaluatorCheck(['TEAM_TYPE']) && afterVisit) ||
                          (evaluatorCheck(['LEADER_TYPE']) && showAction && innerdoc.category == 7) ||
                          ($store.state.submission.last_alert && evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.showFiles && $store.state.submission.showFiles == 4 && (evaluatorCheck(['ORGANIZATION_TYPE', 'LEADER_TYPE']) || hasPermission('admin_submissions')))
                        "
                      >
                        <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                          <upload v-if="!innerdoc.url" oneFile file-byfile school teamFiles @success="$emit('refresh')" :url="`submission/pre/upload_documents/${$route.params.submission_id}/${innerdoc.id}`" style="display: inline" :index="innerdoc.id">
                            <template #upload-content>
                              <span class="pointer"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                            </template>
                          </upload>
                          <upload v-else oneFile file-byfile teamFiles @success="$emit('refresh')" :url="`submissions/submission/update_document/${innerdoc.id}/${$route.params.submission_id}`" style="display: inline" :index="innerdoc.id">
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
                </template>
              </div>
              <!--                            </CCardBody>-->
            </CCol>
          </CRow>
        </div>
      </div>
      <div>
        <additionFiles :documents="$store.getters['documents/documents'].extra_documents" @refresh="refresh" @delete_item="deleteDocument"></additionFiles>
      </div>
    </el-card>
  </div>
</template>

<script>
import upload from '../../../components/upload.vue';
import additionFiles from '../../submissions/components/additionFiles';

export default {
  components: {
    upload,
    additionFiles,
  },
  data() {
    return {
      isDeleteLoad: false,
      isLoad: false,
      progressNum: null,
    };
  },
  computed: {
    afterVisit() {
      if (this.lastAlert && this.lastAlert.actual_level == 6 && this.lastAlert.type == 1) {
        return true;
      } else if (this.lastAlert.type == 2) {
        return true;
      } else {
        return false;
      }
    },
    time: function () {
      if (this.$store.getters['submission/team'] && this.$store.getters['submission/team'].length) {
        const now = new Date();
        const end = new Date(Date.parse(this.$store.getters['submission/team'].starts_at.replace(/-/g, ' ')));
        let endTime = end - now;
        if (endTime > 0) {
          return end - now;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    lastAlert: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert;
      }
      return false;
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
    showType: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.submission.last_alert.show_type) {
        return this.$store.state.submission.last_alert.show_type;
      }
      return false;
    },
  },
  methods: {
    documentSeparator(docs) {
      if (docs) {
        let data = Object.values(docs);
        // console.log('object', data);
        return data.filter(el => {
          return el.every(f => {
            return f.category == 7;
          });
        });
        data.forEach(element => {
          console.log('element', element);
        });
        // return data.filter(el=>el.category !== 7)
        if (this.evaluatorCheck(['ORGANIZATION_TYPE'])) {
        }
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
            this.refresh();
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
    init() {
      this.$store.dispatch('submission/preSubmission', this.$route.params.id).then(() => {
        this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
      });
    },
    changePage(stage_id) {
      this.$store.dispatch('documents/documents', { query: { stage_id: stage_id } });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss"></style>
