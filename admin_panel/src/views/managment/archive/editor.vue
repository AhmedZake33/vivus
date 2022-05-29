<template>
  <div>
    <CCard>
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          <i class="el-icon-edit" style="font-size: 18px"></i>
          <span>{{ $store.getters['archive/parents'].length == 0 ? ($i18n.locale == 'en' ? 'Archive' : 'الأرشيف') : '' }}</span>
          <span :key="index" v-for="(item, index) in $store.getters['archive/parents']">
            <span @click="goToNext(item)" class="path" v-if="item !== $store.getters['archive/parents'][$store.getters['archive/parents'].length - 1]">
              {{ item.title === 'Archive' ? $t('Global.archive') : item.title }}
            </span>
            <span v-if="item !== $store.getters['archive/parents'][$store.getters['archive/parents'].length - 1]">
              {{ ' / ' }}
            </span>
            <span v-else class="activeBread">
              {{ $store.getters['archive/parents'].length == 0 ? ($i18n.locale == 'en' ? 'Archive' : 'الأرشيف') : item.title }}
            </span>
          </span>
        </div>
      </CCardHeader>
      <div></div>
      <CCardBody v-loading="$store.getters['archive/contentLoad']">
        <div v-if="editor">
          <div v-if="locale === 'en'">
            <page
              api-key="5134dsngirrl0brc1i314hwj587bk140g03tif8xq86wb1n7"
              v-model="content"
              font_formats="Cairo=Cairo; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats"
              content_css="/mycontent.css"
              :init="init_en"
            />
          </div>
          <div v-else>
            <page api-key="5134dsngirrl0brc1i314hwj587bk140g03tif8xq86wb1n7" v-model="content" :init="init_ar" />
          </div>
        </div>
      </CCardBody>
      <CCardFooter class="customDrop">
        <CButton style="float: right; color: #ffffff" @click="save">
          <CIcon name="cil-check-circle" />
          {{ $t('Global.submit') }}
        </CButton>
      </CCardFooter>
    </CCard>
    <el-dialog @close="reset" title="File Browser" :visible.sync="folderDialog" :lock-scroll="true" width="75%">
      <Browser></Browser>
      <!-- {{authUser()}} -->
      <span slot="footer" class="dialog-footer" v-if="$store.getters['archive/selectedItem'].length > 0">
        <el-button @click="reset" class="mr-2 ml-2">{{ $t('archive.reset') }}</el-button>
        <el-button @click="setContent" @keydown.enter="setContent" class="back-button" color="primary">
          {{ $t('archive.save') }}
          <CBadge color="success">{{ $store.getters['archive/selectedItem'].length }} Items</CBadge>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import Browser from './component/Browser';
import Archive from '../../../api/archive';

const archive = new Archive();

export default {
  name: 'editor',
  components: { page: Editor, Browser },
  data() {
    return {
      folderDialog: false,
      archive_id: null,
      editor: true,
      init_ar: {
        height: 400,
        font_formats:
          'Cairo=Cairo; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
        content_style: `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap')`,
        menubar: 'file edit view insert format tools table custom help',
        images_upload_handler: this.imageUpload,
        convert_urls: false,
        relative_urls: false,
        remove_script_host: true,
        automatic_uploads: true,
        directionality: 'rtl',
        language: 'ar',
        toolbar:
          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
        plugins: ['print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount  imagetools  textpattern help code'],
        menu: { custom: { title: 'المزيد', items: 'insert_file files_browser video_capture audio_capture' } },
        setup: this.setup,
      },
      init_en: {
        height: 400,
        menubar: 'file edit view insert fromat tools table custom help',
        images_upload_handler: this.imageUpload,
        font_formats:
          'Cairo=Cairo; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
        content_style: `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap')`,
        convert_urls: false,
        relative_urls: false,
        remove_script_host: true,
        automatic_uploads: true,
        directionality: 'ltr',
        language: 'en',
        toolbar:
          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
        plugins: ['print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount  imagetools  textpattern help code'],
        menu: { custom: { title: 'More', items: 'insert_file files_browser video_capture audio_capture' } },
        setup: this.setup,
      },
      content: '',
      baseUrl: process.env.VUE_APP_BASE_URL, //'https://naqaae.fekracomputers.net/api/v1/', //'http://localhost:8000/api/v1/',
    };
  },
  computed: {
    locale: function () {
      return this.$i18n.locale;
    },
  },
  watch: {
    locale: function (val) {
      this.editor = false;
      this.$store.dispatch('archive/getContent', { id: this.$route.query.id, query: { language: val } }).then(response => {
        this.content = this.$store.getters['archive/content'];
        this.editor = true;
      });

      this.$store.dispatch('archive/getParents', {
        id: this.$route.query.id,
        locale: val,
      });
    },
  },
  mounted() {
    this.$store.dispatch('archive/getContent', { id: this.$route.query.id, query: { language: this.$i18n.locale } }).then(response => {
      this.content = this.$store.getters['archive/content'];
      this.$store.commit('archive/SET_CURRENT_ID_EDITOR', this.$store.state.archive.editorParent);
    });

    this.$store.dispatch('archive/getParents', {
      id: this.$route.query.id,
      locale: this.$i18n.locale,
    });
  },
  created() {
    // EventBus.$on('archiveId', data => {
    //   this.archive_id = data;
    //   console.log("event bus",data);
    // });
  },
  methods: {
    setup(editor) {
      const obj = this;
      editor.ui.registry.addMenuItem('files_browser', {
        text: 'استعراض الملفات',
        onAction: function () {
          obj.folderDialog = true;
        },
      });
    },
    setContent() {
      let content = '';
      this.$store.getters['archive/selectedItem'].forEach(item => {
        if (this.isImage(item.extension)) {
          content += `<img src="${process.env.VUE_APP_BASE_URL}archive/download/${item.id}" />`;
        } else {
          content += `<a href="${process.env.VUE_APP_BASE_URL}archive/download/${item.id}" >${item.title}</a>`;
        }
      });
      this.content = content + this.content;
      this.folderDialog = false;
    },
    isImage(ex) {
      if (ex) {
        const extension = ex.toLowerCase();
        if (extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'tif' || extension == 'jpeg' || extension == 'bmp') {
          return true;
        }
      }
      return false;
    },
    reset() {
      this.$store.commit('archive/SET_RESET');
    },
    goBack: function () {
      this.$router.go(-1); // this.$router.push({path: '/users'})
    },
    save() {
      this.$store
        .dispatch('archive/setContent', {
          id: this.$route.query.id,
          content: this.content === '' ? '<p></p>' : this.content,
          language: this.$i18n.locale,
        })
        .then(() => {
          this.$message({
            message: this.$t('Global.saveContent'),
            type: 'success',
            duration: 3 * 1000,
          });
          this.$router.go(-1);
        });
    },
    imageUpload(blobInfo, success, failure, progress) {
      var formData;
      formData = new FormData();
      let imageFolder = this.$store.getters['archive/imageFolder'];
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      if (imageFolder) {
        archive.upload(formData, imageFolder.id).then(response => {
          progress(100);
          success(`${process.env.VUE_APP_BASE_URL}archive/download/${response.files[0].id}`);
        });
      } else {
        this.$message({
          message: 'the Images folder is not exist',
          type: 'error',
        });
      }
    },
    goToNext(item) {
      this.$store.commit('archive/SET_EDITOR_PARENT', item);
      this.$router.push('/management/archive');
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
.pointer {
  cursor: pointer;
}

.baseHover {
  opacity: 0.7;
}

.baseHover:hover {
  opacity: 1;
}

.tox-notifications-container {
  display: none !important;
}

.back-button {
  background-color: #173f5f !important;
  border-color: #173f5f !important;
  color: #fff;
}
.path {
  color: #173f5f !important;
  cursor: pointer !important;
  font-weight: bold !important;
}

.activeBread {
  opacity: 0.7;
  font-weight: lighter;
}
</style>
