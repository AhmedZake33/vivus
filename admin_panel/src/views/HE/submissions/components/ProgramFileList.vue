<template>
  <div class="custom_info_alert custom_alert">
    <el-alert :closable="false" effect="dark" class="my-2 animate" type="info" show-icon>
      <div class="d-flex">
        <span> {{ $t('Global.FilesNeededInfo') }} </span>
      </div>
    </el-alert>
    <el-card class="box-card" :class="isLoad ? 'disabledAll' : ''">
      <div slot="header" class="d-flex justify-content-between align-items-center">
        <span>{{ $t('Global.FilesNeeded') }}</span>
      </div>
      <div v-for="(parent, index) in $store.getters['submission/allDocuments']">
        <div class="docs_header d-flex justify-content-between align-items-center">
          <span :style="parent.mandatory !== 1 ? 'direction: ltr;' : ''">
            <div :style="parent.mandatory !== 1 ? 'width: auto; order: 1' : ''">{{ parent.title }}</div>
            <small class="small text-muted align-content-center" v-if="parent.mandatory !== 1 && $store.getters['submission/extraFile']">
              <vue-countdown class="small text-muted mb-0" v-if="time" :time="time" :interval="100" v-slot="{ days, hours, minutes, seconds }">
                {{ $t('Global.remainingTime') }}：{{ days }} {{ $t('Global.days') }}, {{ hours }} {{ $t('Global.hours') }}, {{ minutes }} {{ $t('Global.minutes') }}, {{ seconds }} {{ $t('Global.seconds') }}
              </vue-countdown>
            </small>
            <small v-else></small>
            <div
             v-if="
                ($store.state.submission.last_alert && evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.last_alert.actual_level >= 3 && parent.short_name == 'ORGANIZATION_DOCUMENT') ||
                (parent.short_name == 'ORGANIZATION_DOCUMENT' && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update)
              "
            >
              <upload oneFile file-byfile @success="$emit('refresh')" :url="`submissions/evaluation/upload_documents/${$route.params.id}/${parent.id}`" :body="{ folder: true }" style="display: inline">
                <template #upload-content>
                  <i style="cursor: pointer" class="el-icon-upload pt-1"></i>
                </template>
              </upload>
            </div>
          </span>
        </div>
        <el-alert class="mb-2 animate" v-if="parent.mandatory !== 1" :closable="false" effect="dark" type="info" show-icon>
          <div class="d-flex">
            <span> {{ $t('Global.additionalInfo') }} </span>
          </div>
        </el-alert>
        <el-alert class="mb-2 animate" v-if="parent.short_name == 'SUPPORT_DOCUMENT'" :closable="false" effect="dark" type="info" show-icon>
          <div class="d-flex">
            <span> {{ $t('Global.supportInfo') }} </span>
          </div>
        </el-alert>
        <div v-for="(document, index) in parent.children">
          <div v-if="document.type === 0" class="p-1 border mb-2 text item docs d-flex justify-content-between align-items-center">
            <div class="d-flex">
              <a :class="document.mandatory == 1 ? 'custom_required' : ''" class="mr-4 pointer custom_link custom_tooltip" download target="_blank" :href="getDocUrl($store.getters['submission/documents'], document.short_name)">
                <span class="mr-0" :class="!checkIfExist($store.getters['submission/documents'], document.short_name) ? 'text-danger' : ''">{{ document.title }} </span></a
              >
              <el-tooltip v-if="document.description" effect="dark" :content="document.description" placement="top-start">
                <i class="mx-1 el-icon-info"></i>
              </el-tooltip>
            </div>
            <div class="d-flex">
              <span class="ml-2 mr-2" :class="!checkIfExist($store.getters['submission/documents'], document.short_name) ? 'text-danger' : ''">
                <span class="small text-muted"> {{ getDocDate($store.getters['submission/documents'], document.short_name) ? getDocDate($store.getters['submission/documents'], document.short_name) : '' }} </span> {{ getDocSize($store.getters['submission/documents'], document.short_name) }}
                {{ !checkIfExist($store.getters['submission/documents'], document.short_name) ? '( لم يتم الرفع )' : '' }}
              </span>
              <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                <div
                  class="d-flex"
                   v-if="(document.mandatory !== 1 && $store.getters['submission/extraFile'] && $store.getters['submission/extraFile'].status && isAuth($store.getters['submission/representative'])) ||
                    ($store.state.submission.last_alert && evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                    ($store.state.submission.showFiles && $store.state.submission.showFiles == 4 && (evaluatorCheck(['ORGANIZATION_TYPE']) || hasPermission('admin_submissions')))
                  "
                >
                  <upload
                    oneFile
                    file-byfile
                    @success="$emit('refresh')"
                    :index="document.short_name"
                    v-if="!checkIfExist($store.getters['submission/documents'], document.short_name)"
                    :url="`submissions/evaluation/upload_documents/${$route.params.id}/${document.id}`"
                    :body="{ folder: true }"
                    style="display: inline"
                  >
                    <template #upload-content>
                      <span class="pointer" :id="`uploadIcon_${document.short_name}`"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                    </template>
                  </upload>
                  <upload
                    oneFile
                    file-byfile
                    @success="$emit('refresh')"
                    :index="document.short_name"
                    v-if="checkIfExist($store.getters['submission/documents'], document.short_name)"
                    :url="`submissions/evaluation/update_document/${getDocId($store.getters['submission/documents'], document.short_name)}/${$route.params.id}`"
                    style="display: inline"
                  >
                    <template #upload-content>
                      <span class="pointer"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                    </template>
                    <template #delete-file>
                      <span
                        :class="isDeleteLoad ? 'disabledAll' : ''"
                        :id="`deleteIcon_${document.short_name}`"
                        class="animate pointer"
                        @click="deleteDocument(getDocId($store.getters['submission/documents'], document.short_name))"
                        v-if="checkIfExist($store.getters['submission/documents'], document.short_name)"
                      >
                        <i class="el-icon-delete" style="margin: 0 10px"></i
                      ></span>
                    </template>
                  </upload>
                </div>
              </template>
            </div>
          </div>
          <div v-else>
            <el-collapse @change="changeArrow(index + 1)" class="custom_collapse custom_collapse_docs" v-model="activeName" accordion>
              <el-collapse-item :title="document.title">
                <template slot="title">
                  <i class="el-icon-caret-left" :id="index + 1"></i>
                  <CCardHeader>
                    <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block">
                      <div :id="`parent_${checkSubIfExist($store.getters['submission/documents'], document.children)}`" class="mx-2 custom_required">
                        <strong :class="!checkSubIfExist($store.getters['submission/documents'], document.children) ? 'text-danger' : ''">{{ document.title }} </strong>
                      </div>
                    </div>
                  </CCardHeader>
                </template>
                <div class="p-1 mt-2 text docs d-flex justify-content-between align-items-center" v-for="(subDocument, index) in document.children" v-if="subDocument.type === 0">
                  <div>
                    <a download class="pointer custom_link custom_tooltip" :class="subDocument.mandatory ? 'el-form-item is-required el-form-item--small p-0' : ''" target="_blank" :href="getDocUrl($store.getters['submission/documents'], subDocument.short_name)"
                      ><span style="line-height: 17px" class="el-form-item__label" :class="!checkSubIfExist($store.getters['submission/documents'], document.children) ? 'text-danger' : !checkIfExist($store.getters['submission/documents'], subDocument.short_name) ? 'text-black-50' : ''"
                        >{{ subDocument.title }}
                      </span></a
                    >
                    <el-tooltip v-if="subDocument.description" effect="dark" placement="top-start">
                      <i class="mx-1 el-icon-info"></i>
                      <div slot="content">
                        <span v-for="desc in oneLineToLines(20, subDocument.description)"> {{ `${desc}` }} <br /> </span>
                      </div>
                    </el-tooltip>
                  </div>
                  <div class="d-flex">
                    <span class="ml-2 mr-2" :class="!checkSubIfExist($store.getters['submission/documents'], document.children) ? 'text-danger' : ''">
                      <span class="small text-muted"> {{ getDocDate($store.getters['submission/documents'], subDocument.short_name) ? getDocDate($store.getters['submission/documents'], subDocument.short_name) : '' }} </span>
                      {{ getDocSize($store.getters['submission/documents'], subDocument.short_name) }}
                      {{ !checkIfExist($store.getters['submission/documents'], subDocument.short_name) ? '( لم يتم الرفع )' : '' }}
                    </span>
                    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                      <div
                        class="d-flex"
                        v-if="
                          ($store.state.submission.last_alert && evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.showFiles && $store.state.submission.showFiles == 4 && (evaluatorCheck(['ORGANIZATION_TYPE']) || hasPermission('admin_submissions')))
                        "
                      >
                        <upload
                          oneFile
                          file-byfile
                          :index="subDocument.short_name"
                          @success="$emit('refresh')"
                          v-if="!checkIfExist($store.getters['submission/documents'], subDocument.short_name)"
                          :body="{ title: subDocument.title, folder: document.title }"
                          :url="`submissions/evaluation/upload_documents/${$route.params.id}/${subDocument.id}`"
                          style="display: inline"
                        >
                          <template #upload-content>
                            <span class="pointer" :id="`uploadIcon_${subDocument.short_name}`"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                          </template>
                        </upload>
                        <upload
                          oneFile
                          file-byfile
                          @success="$emit('refresh')"
                          :index="subDocument.short_name"
                          v-if="checkIfExist($store.getters['submission/documents'], subDocument.short_name)"
                          :url="`submissions/evaluation/update_document/${getDocId($store.getters['submission/documents'], subDocument.short_name)}/${$route.params.id}`"
                          style="display: inline"
                        >
                          <template #upload-content>
                            <span class="animate pointer"><i class="el-icon-upload" style="margin: 0 10px"></i></span>
                          </template>
                          <template #delete-file>
                            <span
                              :class="isDeleteLoad ? 'disabledAll' : ''"
                              :id="`deleteIcon_${subDocument.short_name}`"
                              class="animate pointer"
                              @click="deleteDocument(getDocId($store.getters['submission/documents'], subDocument.short_name))"
                              v-if="checkIfExist($store.getters['submission/documents'], subDocument.short_name)"
                              ><i class="el-icon-delete" style="margin: 0 10px"></i
                            ></span>
                          </template>
                        </upload>
                      </div>
                    </template>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div v-if="parent.short_name == 'ORGANIZATION_DOCUMENT'">
          <additionFiles @delete_item="deleteDocument" @refresh="refresh" :documents="$store.getters['submission/documents']"></additionFiles>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import upload from '../../../components/upload';
import additionFiles from '../components/additionFiles';

export default {
  components: { upload, additionFiles },
  data() {
    return {
      isLoad: false,
      isDeleteLoad: false,
      activeName: 0,
      mandatoryFiles: [],
    };
  },
  props: {
    name: String,
  },
  computed: {
    time: function () {
      if (this.$store.getters['submission/team']) {
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
  },
  methods: {
    progress(files, progress) {
      this.progressNum = progress;
    },
    changeArrow(id) {
      if (id) {
        let newArrow = document.getElementById(`${id}`);
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
      this.hideClass('.el-collapse-item__arrow');
    },
    deleteDocument(id) {
      this.$confirm(this.$t('Global.deleteArchiveMessage'), `${this.$t('Global.warning')}`, {
        confirmButtonText: 'موافق',
        cancelButtonText: 'الغاء',
        type: 'warning',
      }).then(() => {
        this.isDeleteLoad = true;
        this.$store.dispatch('archive/delete', { resource: { id: id } }).then(response => {
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
    },
    init() {
      this.isLoad = true;
      this.$store.dispatch('submission/getDocument', this.$route.params.id).then(() => {
        this.isLoad = false;
      });
    },
  },
  updated() {
    this.hideClass('.el-collapse-item__arrow');
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.custom_collapse_docs .custom_tooltip {
  display: inline-block;
}

.ar .el-tooltip__popper {
  text-align: right !important;
  direction: rtl;
}

.en .el-tooltip__popper {
  text-align: left !important;
  direction: ltr;
}

.el-tooltip__popper {
  //   margin-left: 2rem !important;
  //   margin-right: 2rem !important;
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

@media screen and (max-width: 600px) {
  .docs_header {
    margin-right: -0.5rem;

    span {
      justify-content: center !important;
    }
  }
}

.docs_header {
  margin-right: -0.5rem;

  span {
    &.small {
      font-size: 12px;
    }

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 5px 15px;
    font-size: 16px;
    width: 100%;
    text-align: initial;
    margin-bottom: 0.5rem;
    font-weight: bolder;
    background-color: #eee;
    border-radius: 30px;
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
