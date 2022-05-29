<template>
  <div :class="type != 'editSubFile' && type != 'userId' ? 'w-100' : ''">
    <div v-if="treeDoucment">
      <input type="file" style="height: 19px; width: 3%; position: absolute; opacity: 0" accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" id="fileInput" @change="upload()" ref="file" />
      <span><i class="el-icon-upload" style="margin: 0 10px"></i></span>
    </div>
    <div v-else-if="type != 'editSubFile' && type != 'userId'" class="flex-wrap custom_center custom_gap w-100 docs p-1 d-flex flex-row align-items-center justify-content-between">
      <h6 class="text-initial mx-2 my-0 custom_required">{{ title }}</h6>
      <!-- <span>{{ `${file && valid ? '' : $t('archive.uploadFile') + ' ' + '( docs , pdf )'}` + `${file && valid ? ' | ' + file.name : ''}` }}</span> -->
      <!-- <p class="text-initial text-muted" style="height: 22px;">{{ $t(`Global.docsInfo_${label}`) }}</p> -->
      <div class="upload-btn-wrapper d-flex simple_upload custom_pill">
        <div v-if="label != 8 && label != 11" style="position: relative; overflow: hidden; max-width: 290px" round size="small" type="primary" class="no_hover_effect">
          <input class="pointer" type="file" style="height: 33px; width: 100%" accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" id="fileInput" @change="upload()" ref="file" />
          <div class="d-flex">
            <span class="text-nowrap overflow-hidden" style="text-overflow: ellipsis">{{ `${file && valid ? '' : $t('archive.uploadFile') + ' ' + '( jpg , jpeg , png , pdf )'}` + `${file && valid ? file.name : ''}` }}</span>
            <span class="mx-2"><i class="el-icon-upload"></i></span>
          </div>
        </div>

        <el-button v-if="label == 8" style="position: relative; overflow: hidden; max-width: 290px" round size="small" type="primary" icon="el-icon-upload2" class="no_hover_effect">
          <input type="file" style="height: 33px; width: 100%" accept="video/*" id="fileInput" @change="upload()" ref="file" />
          <span class="fileName" style="height: 15px; max-width: 240px; overflow: hidden"> {{ $t('archive.uploadFile') + ' ' + '( mp4,mkv,webm,avi,wmv )' + `${file && valid ? ' | ' + file.name : ''}` }} </span>
        </el-button>
        <el-button v-if="label == 11" style="position: relative; overflow: hidden; max-width: 290px" round size="small" type="primary" icon="el-icon-upload2" class="no_hover_effect">
          <input type="file" style="height: 33px; width: 100%" accept=".zip,application/vnd.comicbook+zip" id="fileInput" @change="upload()" ref="file" />
          <span class="fileName" style="height: 15px; max-width: 240px; overflow: hidden"> {{ $t('archive.uploadFile') + ' ' + '( zip )' + `${file && valid ? ' | ' + file.name : ''}` }} </span>
        </el-button>
      </div>
    </div>
    <div v-if="type == 'editSubFile'">
      <div v-if="editable" class="flex-wrap animate custom_gap d-flex upload-btn-wrapper simple_upload m-1 custom_pill">
        <div style="position: relative; overflow: hidden; max-width: 290px" round size="small" type="primary" class="pointer no_hover_effect">
          <input type="file" class="pointer" style="height: 33px; width: 100%" accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" id="fileInput" @change="upload()" ref="file" />
          <div class="d-flex">
            <span class="text-nowrap overflow-hidden" style="text-overflow: ellipsis">{{ `${file && valid ? '' : $t('archive.uploadFile') + ' ' + '( jpg , jpeg , png , pdf )'}` + `${file && valid ? file.name : ''}` }}</span>
            <span class="mx-2"><i class="el-icon-upload"></i></span>
          </div>
        </div>
        <span
          ><i
            @click="
              $emit('deleteFile', file);
              file = null;
              editable = !editable;
            "
            class="el-icon-close pointer"
            style="margin: 0 5px"
          ></i
        ></span>
      </div>
      <div v-else>
        <div class="animate upload-btn-wrapper simple_upload m-1">
          <div style="position: relative; overflow: hidden; max-width: 290px" round size="small" type="primary" class="no_hover_effect">
            <div class="d-flex">
              <span class="mx-2"><i @click="editable = !editable" class="hover_icon el-icon-edit-outline pointer"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type == 'userId'">
      <div v-if="editable" class="animate flex-wrap custom_gap d-flex upload-btn-wrapper simple_upload py-2 custom_pill">
        <div style="position: relative; overflow: hidden; max-width: 290px" round size="small" type="primary" class="no_hover_effect">
          <input type="file" class="pointer" style="height: 33px; width: 100%" accept=".jpg,.png,.jpeg,.pdf" id="fileInput" @change="upload()" ref="file" />
          <div class="d-flex">
            <span class="text-nowrap overflow-hidden" style="text-overflow: ellipsis">{{ `${file && valid ? '' : $t('archive.uploadFile') + ' ' + '( jpg , jpeg , png , pdf )'}` + `${file && valid ? file.name : ''}` }}</span>
            <span class="mx-2"><i class="el-icon-upload"></i></span>
          </div>
        </div>
        <span
          ><i
            @click="
              $emit('deleteFile', file);
              file = null;
              editable = !editable;
            "
            class="el-icon-close pointer"
            style="margin: 0 5px"
          ></i
        ></span>
      </div>
      <div v-else>
        <div class="animate upload-btn-wrapper simple_upload py-2">
          <div style="position: relative; overflow: hidden; max-width: 290px" round size="small" type="primary" class="no_hover_effect">
            <div class="d-flex">
              <span class="mx-2"><i @click="editable = !editable" class="hover_icon el-icon-edit-outline pointer"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      file: null,
      editable: false,
    };
  },
  props: {
    treeDoucment: Boolean,
    label: [Number, String],
    type: String,
    index: Number,
    title: String,
  },

  methods: {
    upload() {
      this.file = this.$refs.file.files[0];
      let doc = { num: this.type == 'subFile' || this.type == 'editSubFile' ? this.index : this.label, file: this.file };
      this.valid = this.validData(this.file);
      this.$emit('getFile', this.valid ? doc : false, this.type == 'subFile' || this.type == 'editSubFile' ? this.index : this.label);
    },
    validData(file) {
      var allowedExtensions = /(\.pdf|\.txt|\.doc|\.docx|\.png|\.jpg|\.jpeg)$/i;
      var allowedImgExtensions = /(\.pdf|\.png|\.jpg|\.jpeg)$/i;
      var allowedZipExtensions = /(\.zip|\.rar)$/i;
      var allowedVidExtensions = /(\.mp4|\.mkv|\.avi|\.wmv)$/i;
      if (this.type == 'zipFile') {
        if (!allowedZipExtensions.exec(file.name)) {
          setTimeout(() => {
            this.$notify.error({
              title: 'خطأ',
              message: 'برجاء التأكد من نوع الملف المضغوط',
            });
          }, 1000);
          return false;
        } else {
          return true;
        }
      } else if (this.type == 'video') {
        if (!allowedVidExtensions.exec(file.name)) {
          this.$notify.error({
            title: 'خطأ',
            message: 'برجاء التأكد من نوع الفيديو',
          });
          return false;
        } else {
          return true;
        }
      } else if (this.type == 'subFile' || this.type == 'editSubFile') {
        console.log("file name allowedExtensions",file);
        if (file) {
          if (file.size) {
            var fileSize = Math.round(file.size / 1024);
          }
          if(file.size){
            if (!allowedExtensions.exec(file.name) || fileSize > 214572800 ) {
              this.$notify.error({
                title: 'خطأ',
                message: `${this.$t('Global.sizeExtentionError')}`,
              });
              return false;
            } else {
              return true;
            }
          }
        }
      } else if (this.type == 'userId') {
        if (file) {
          //   if (file.size) {
          //     var fileSize = Math.round(file.size / 1024);
          //   }
          if (!allowedImgExtensions.exec(file.name)) {
            this.$notify.error({
              title: 'خطأ',
              message: 'برجاء التأكد من نوع الملف عن  ',
            });
            return false;
          } else {
            return true;
          }
        }
      } else {
        if (!allowedExtensions.exec(file.name)) {
          this.$notify.error({
            title: 'خطأ',
            message: 'برجاء التأكد من نوع الملفات',
          });
          return false;
        } else {
          return true;
        }
      }
    },
  },
};
</script>

<style lang="scss">
@media (max-width: 600px) {
  .custom_center {
    justify-content: center !important;
  }
}
.custom_gap {
  gap: 0.2rem;
}
.custom_pill {
  background-color: #ddd;
  padding: 0 0.4rem;
  border-radius: 30px;
}
.docs_item {
  border: 1px solid #ddd;
}
.ar .custom_required {
  position: relative;
  &::after {
    content: '*';
    position: absolute;
    top: -2px;
    right: -7px;
    color: #f56c6c;
  }
}
.en .custom_required {
  position: relative;
  &::after {
    content: '*';
    position: absolute;
    top: -2px;
    right: unset;
    left: -7px;
    color: #f56c6c;
  }
}
.simple_upload {
  .el-button {
    background: transparent !important;
    color: #000;
    border: 0;
    padding: 0;
  }
}
</style>
