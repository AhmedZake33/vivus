<template>
  <div>
    <div id="toBody">
      <CToaster :autohide="false" v-if="!fileByfile && archive" :show="showUpload">
        <template>
          <CToast :key="'toast'" v-if="showUpload" :show="true" :header="$t('archive.uploadFiles')">
            <ul v-if="files.length != 0" class="el-upload-list el-upload-list--text">
              <li v-for="(file, i) in files" :key="i" class="el-upload-list__item is-success">
                <el-progress v-if="i == 0" :text-inside="true" :stroke-width="2" :percentage="uploadPercentage"></el-progress>
                <div class="el-upload-list__item-name">{{ file.name }}<i class="el-icon-document"></i></div>
                <label v-if="i == 0" class="el-upload-list__item-status-label">
                  <i v-show="uploadPercentage == 100" class="el-icon-upload-success el-icon-circle-check"></i>
                  <span>
                    {{ uploadPercentage != 100 ? '%' + uploadPercentage : '' }}
                  </span>
                </label>
              </li>
            </ul>
          </CToast>
        </template>
      </CToaster>
    </div>
    <i v-if="fileByfile" @click="importData" :class="showUpload ? 'disabledAll' : ''">
      <slot v-if="!showUpload" name="upload-content"></slot>
      <div v-else class="docs_header mx-1">
        <small v-if="uploadPercentage != 100"> {{ uploadPercentage }}% </small>
        <CSpinner v-else size="sm" color="info" />
      </div>
    </i>
    <i v-else-if="archive" @click="importData">
      <slot name="upload-content"></slot>
    </i>
    <slot v-if="!showUpload && fileByfile" name="delete-file"></slot>
  </div>
</template>

<script>
import { getToken } from '../../utils/auth';
const axios = require('axios');
export default {
  name: 'upload',
  props: {
    show: Boolean,
    url: String,
    name: String,
    oneFile: Boolean,
    fileByfile: Boolean,
    archive: Boolean,
    profilePic: Boolean,
    body: Object,
    school: Boolean,
    index: [String, Boolean, Number],
    progFile: Boolean,
    teamFiles: Boolean,
    initDoc: Boolean,
  },
  data() {
    return {
      local: null,
      uploadPercentage: 0,
      files: [],
      showUpload: false,
      baseUrl: process.env.VUE_APP_BASE_URL, //'https://naqaae.fekracomputers.net/api/v1/',  //'http://localhost:8000/api/v1/',
    };
  },
  mounted() {
    document.body.appendChild(document.querySelector('#toBody'));
  },
  computed: {
    header: function () {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${getToken()}`,
      };
    },
  },
  watch: {
    showUpload: function () {
      this.$emit('changeUpload', this.showUpload);
    },
  },
  methods: {
    importData() {
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple = this.oneFile ? '' : 'multiple';
      input.onchange = _ => {
        this.files = Array.from(input.files);
        let formData = new FormData();
        if (this.oneFile) {
          if (this.files[0].size && this.files[0].size > 20971520) {
            this.$notify.error({
              title: 'خطأ',
              message: `${this.$t('Global.sizeError')}`,
            });
            return false;
          }
          formData.append('file', this.files[0]);
          if (this.body) {
            formData.append('folder', this.body.folder);
          }
        } else {
          this.files.forEach((element, i) => {
            formData.append('files[' + i + ']', element);
          });
        }
        if (this.profilePic) {
          input.accept = 'image/*';
          var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
          if (!allowedExtensions.exec(this.files[0].name)) {
            this.$notify.error({
              title: 'خطأ',
              message: 'برجاء التأكد من نوع الملف',
            });
            return false;
          }
        }
        this.showUpload = true;
        let uploadIcon = document.getElementById(`uploadIcon_${this.index}`);
        if (uploadIcon) uploadIcon.style.display = 'none';
        axios
          .post(`${this.baseUrl}${this.url}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
            onUploadProgress: function (progressEvent) {
              this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
              if (this.profilePic && this.uploadPercentage == 100) this.showUpload = false;
              this.$emit('changeFileList', this.files, this.showUpload);
            }.bind(this),
          })
          .then(
            function (res) {
              this.$emit('success', res.data);
              if (this.fileByfile) {
                if (this.school) {
                  this.$store.dispatch('submission/preSubmission', this.$route.params.id).then(() => {
                    this.showUpload = false;
                    this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
                  });
                } else {
                  if (this.initDoc) {
                    this.initDocMethod();
                  } else {
                    this.init();
                  }
                }
              }
              if (this.archive) {
                this.showUpload = false;
              }
            }.bind(this)
          )
          .catch(
            function (er) {
              this.showUpload = false;
              let uploadIcon = document.getElementById(`uploadIcon_${this.index}`);
              if (uploadIcon) uploadIcon.style.display = 'inline-block';
              this.$notify({
                type: 'error',
                message: `${this.$t('Global.reConnect')}`,
              });
            }.bind(this)
          );
      };
      input.click();
    },

    uploadAll() {
      let input = document.createElement('input');
      input.type = 'file';
      input.onchange = _ => {
        this.files.push(this.files);
        let formData = new FormData();
        if (this.oneFile) {
          formData.append('file', this.files[0]);
        } else {
          this.files.forEach((element, i) => {
            formData.append('files[' + i + ']', element);
          });
        }
      };
      input.click();
    },
    init() {
      if (this.progFile) {
        this.$store.dispatch('submission/getDocument', this.$route.params.id).then(() => {
          this.showUpload = false;
        });
      } else if (this.teamFiles) {
        this.$store.dispatch('submission/getSubmissionDocument', this.$route.params.submission_id).then(() => {
          this.showUpload = false;
        });
      } else {
        this.$store.dispatch('submission/getDocument', this.$route.params.id).then(() => {
          this.$store.dispatch('submission/getSubmissionDocument', this.$route.params.submission_id).then(() => {
            this.showUpload = false;
          });
        });
      }
    },
    initDocMethod() {
      this.$store
        .dispatch('submission/SCedit', {
          id: this.$route.params.id ? this.$route.params.id : null,
          query: {},
        })
        .then(_ => {
          this.showUpload = false;
        });
    },
    handleProgress(event, file, fileList) {
      fileList.forEach((element, index) => {
        if (element.uid === file.uid) {
          // Update progress under this uid
          var progress = Math.floor(event.percent);
          // To prevent the interface from returning success value after uploading, the maximum value of progress given here is 99, and the success hook is set to 100 again.
          element.progress = progress === 100 ? 100 : progress;
          this.$set(fileList, index, element);
          this.$emit('changeFileList', fileList);
        }
      });
    },
    success() {
      this.$emit('success');
    },
  },
};
</script>

<style scoped></style>
