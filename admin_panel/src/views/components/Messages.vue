<template>
  <CRow>
    <CCard style="width: 100%">
      <CCardBody class="text-initial">
        <CCardHeader class="d-flex justify-content-between align-items-center pt-0">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions center' : 'center'" style="display: inline-block; font-weight: bold">
            <i class="el-icon-chat-dot-round"></i>
            {{ $t('Global.messages') }}
          </div>
        </CCardHeader>
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px">
          <CRow>
            <CCol sm="12" lg="10" class="mt-3">
              <el-form-item :rules="validation(false, 'textarea')" prop="message" class="custom_area custom_text_area">
                <el-input autosize resize="none" type="textarea" :placeholder="$t('Global.ticketMessage')" v-model="ruleForm.message"></el-input>
              </el-form-item>
            </CCol>
            <CCol lg="1" sm="12" class="d-flex align-items-center align-self-start mt-lg-4">
              <el-form-item :show-message="photoError" :error="photoError == 1 ? 'برجاء رفع صورة البطاقة الشخصية ' : 'برجاء التأكد من نوع الملف'" prop="national_id_photo" class="mb-0 left_right">
                <div :class="`${errorFile ? 'shake' : ''}`" class="upload-btn-wrapper">
                  <i class="el-icon-close" style="color: red" v-if="errorFile"></i>
                  <el-tooltip content="jpg , png , jpeg , pdf" placement="top-start">
                    <el-button style="overflow: hidden; max-width: 100px; position: relative" round size="small" type="primary" class="no_hover_effect right_icon">
                      <input type="file" multiple style="height: 33px; width: 100%" accept=".jpg,.png,.jpeg,.pdf" id="fileInput" @change="upload" ref="file" />
                      <span style="height: 15px; max-width: 170px; overflow: hidden"> {{ $t('Global.ticketAttachments') }}</span>
                    </el-button>
                  </el-tooltip>
                </div>
              </el-form-item>
            </CCol>
            <CCol lg="1" sm="12" class="d-flex align-items-center align-self-start mt-lg-4">
              <button class="mx-1 el-button el-button--default is-round sec_color" @click="addTicket('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
                <i class="el-icon-check-circle"></i><CSpinner v-if="isLoad" color="default" size="sm" />
                <span class="ml-2 mr-2" v-if="$store.state.uploadProgress && $store.state.uploadProgress != 100">{{ $store.state.uploadProgress }}%</span>
                {{ $t('Global.sendMessage') }}
              </button>
            </CCol>
            <CCol>
              <div>
                <span class="text-initial" v-if="files && files.length !== 0">
                  <div v-for="file in files">
                    {{ `${file ? file.name : ''}` }}
                  </div>
                </span>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
    </CCard>

    <CCard style="width: 100%" v-if="$store.getters['ticket/tickets'] && $store.getters['ticket/tickets'].length">
      <CCardBody v-loading="$store.state.ticket.load">
        <div class="custom_report mb-3 pb-2">
          <div v-for="ticket in $store.getters['ticket/tickets']">
            <div class="reviewHeard" style="text-align: initial" :class="ticket.status == 1 ? 'mx-4' : ''">
              <div class="review_header justify-content-between mb-0">
                <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
                  <div class="img_avatar" style="width: 20px; height: 20px">
                    <img src="/img/avatars/avatardf.png" class="c-avatar-img" />
                  </div>
                  <div>
                    <router-link :to="`/users/${ticket.id}`" class="mx-1">
                      <span> {{ ticket.name }}</span>
                    </router-link>
                    <h6 class="custom_badge">
                      <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(ticket.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
                      <CBadge color="info badge-pill" class="m-1" style="direction: ltr">{{ ticket.diff }}</CBadge>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div :class="ticket.status == 1 ? 'mx-5' : ''" class="report_style button_after" style="margin-left: 20px; margin-right: 20px">
              <p class="mb-0 text-initial" style="word-break: break-word">{{ ticket.message }}</p>
              <div class="d-flex flex-wrap">
                <div v-for="document in ticket.documents" class="pointer d-flex custom_link mx-1 text-initial">
                  <el-image style="width: 100px; height: 100px" v-if="isImage(document.extension)" :src="document.url" :preview-src-list="srcList(ticket.documents)"> </el-image>
                  <!-- <img v-if="isImage(document.extension)" :src="document.url" width="300" height="180" class="img-thumbnail img-fluid" /> -->
                  <a v-else class="mr-0" target="_blank" :href="document.url">{{ document.title }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <el-button round size="mini" @click="More" class="right_icon custom_send_icon" type="primary">{{ $t('Global.more') }} </el-button>
        </div>
      </CCardBody>
    </CCard>

    <CCard v-else style="width: 100%">
      <CCardBody class="text-center">
        <div class="text-center">
          {{ $t('Global.noItem') }}
        </div>
      </CCardBody>
    </CCard>
  </CRow>
</template>

<script>
export default {
  name: 'add',
  data() {
    return {
      errorFile: false,
      photoError: false,
      files: null,
      isLoad: false,
      error: false,
      limit: 5,
      ruleForm: {
        message: null,
      },
    };
  },
  mounted() {
    this.Refresh();
  },

  methods: {
    srcList(list) {
      let newList = list.filter(doc => doc.extension == 'jpg' || doc.extension == 'png' || doc.extension == 'gif' || doc.extension == 'jpeg');
      let lastList = newList.map(doc => doc.url);
      return lastList;
    },
    upload() {
      this.files = this.$refs.file.files;
    },
    Refresh() {
      this.$store.dispatch('ticket/get', { query: { limit: this.limit  , submission_id: this.$route.params.submission_id}, id: this.$route.params.id });
    },
    More() {
      this.limit = this.limit + 5;
      this.Refresh();
    },
    addTicket(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          for (const [key, value] of Object.entries(this.ruleForm)) {
            if (value || value == 0) {
              formData.append(key, value);
            }
          }
          formData.append('submission_id', this.$route.params.submission_id);
          if (this.files) {
            this.files.forEach((element, i) => {
              formData.append('files[' + i + ']', element);
            });
          }
          this.isLoad = true;
          this.$store
            .dispatch('ticket/add', { query: formData, id: this.$route.params.id})
            .then(() => {
              this.$notify({
                type: 'success',
                message: `${this.$t('Global.successMessage')}`,
              });
              this.Refresh();
              this.isLoad = false;
            })
            .catch(error => {
              this.isLoad = false;
              this.clicked = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.custom_text_area {
  .el-textarea textarea {
    min-height: 20px !important;
  }
}

@-moz-document url-prefix() {
  .custom_text_area {
    .el-textarea textarea {
      min-height: 55px !important;
    }
  }
}
</style>
