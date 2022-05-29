<template>
  <div class="custom_info_alert custom_alert">
    <el-card class="box-card my-2" v-loading="$store.state.archive.generalLoad">
      <div slot="header">
        <div class="d-flex justify-content-between">
          <div class="d-flex">
            <span class="font-weight-bolder">
              {{ $t('manage.subSC') }}
            </span>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column" v-if="$store.getters['submission/subSettingData']" v-for="(types, mainIndex) in $store.getters['submission/subSettingData']">
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12">
              <div class="w-100 mx-2 mt-2">
                <div class="docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12 info">
                    {{ $t(`Global.type_${mainIndex}`) }}
                  </span>
                </div>
              </div>
              <div v-for="(alert, index) in types">
                <div class="w-100 mx-2 mt-2">
                  <div class="docs_header d-flex justify-content-between align-items-center">
                    <span class="font_12 success">
                      {{ $t(`Global.Alert_${mainIndex}_${index}`) }}
                      <i @click="openEdit()" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer"></i>
                    </span>
                  </div>
                </div>
                <el-table :data="alert" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                  <el-table-column prop="order" width="55" :label="$t('Global.SCorder')"></el-table-column>
                  <el-table-column prop="title" :label="$t('Global.name')">
                    <template slot-scope="scope">
                      <el-tooltip effect="dark" :content="scope.row.title" placement="top-start">
                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                          {{ scope.row.title }}
                        </div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="alert_message" :label="$t('Global.alert_message')">
                    <template slot-scope="scope">
                      <el-tooltip effect="dark" :content="scope.row.alert_message" placement="top-start">
                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                          {{ scope.row.alert_message }}
                        </div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="contact_message" :label="$t('Global.contact_message')">
                    <template slot-scope="scope">
                      <el-tooltip effect="dark" :content="scope.row.contact_message" placement="top-start">
                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                          {{ scope.row.contact_message }}
                        </div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="task_message" :label="$t('Global.task_message')">
                    <template slot-scope="scope">
                      <el-tooltip effect="dark" :content="scope.row.task_message" placement="top-start">
                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                          {{ scope.row.task_message }}
                        </div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="thread_message" :label="$t('Global.message')">
                    <template slot-scope="scope">
                      <el-tooltip effect="dark" :content="scope.row.thread_message" placement="top-start">
                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                          {{ scope.row.thread_message }}
                        </div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="evaluator_type" width="120" :label="$t('Global.evaluator_type')">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.evaluator_type ? $t(`Global.${evaluatorConstants('num', scope.row.evaluator_type)}`) : '' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="task_id" width="120" :label="$t('Global.SCtask')">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.task_id ? $t(`Global.${taskConstants('num', scope.row.task_id)}`) : '' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="show_type" width="150" :label="$t('Global.show_type')">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.show_type ? $t(`Global.${showConstants('num', scope.row.show_type)}`) : '' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="" label=" " width="100">
                    <template slot-scope="scope">
                      <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'">
                        <span v-if="scope.row.removed" class="text-danger">{{ $t('Global.remove') }}</span>
                        <i class="el-icon-edit-outline table-action-item" style="font-size: 17px" @click="openEdit(scope.row)"></i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </CCol>
          </CRow>
        </div>
      </div>
    </el-card>
    <el-dialog :title="$t(`Global.add`)" :visible.sync="alertDialog" class="p-0" width="65%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <div class="d-flex">
                    <el-form-item class="mb-2 mr-2" prop="task_id" :rules="validation(null, 1)" :label="$t('Global.SCtask')" style="width: 25%">
                      <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.task_id" :placeholder="$t('Global.SCtask')" style="width: 100%">
                        <el-option v-for="item in taskConstants('array')" :key="item.id" :label="$t(`Global.${item.name}`)" :value="item.id">
                          <div style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t(`Global.${item.name}`) }}
                          </div>
                        </el-option>
                      </el-select>
                      
                    </el-form-item>
                    <el-form-item class="mb-2 mr-2" prop="show_type" :rules="validation(null, 1)" :label="$t('Global.show_type')" style="width: 25%">
                      <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.show_type" :placeholder="$t('Global.show_type')" style="width: 100%">
                        <el-option v-for="item in showConstants('array')" :key="item.id" :label="$t(`Global.${item.name}`)" :value="item.id">
                          <div style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t(`Global.${item.name}`) }}
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2 mr-2" prop="evaluator_type" :rules="validation(null, 1)" :label="$t('Global.evaluator_type')" style="width: 25%">
                      <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.evaluator_type" :placeholder="$t('Global.evaluator_type')" style="width: 100%">
                        <el-option v-for="item in evaluatorConstants('array')" :key="item.id" :label="$t(`Global.${item.name}`)" :value="item.id">
                          <div style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t(`Global.${item.name}`) }}
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2 mr-2" prop="allow_update" :rules="validation(null, 1)" :label="$t('Global.updates')" style="width: 25%">
                      <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.allow_update" :placeholder="$t('Global.updates')" style="width: 100%">
                        <el-option v-for="item in updateConstants('array')" :key="item.id" :label="$t(`Global.${item.name}`)" :value="item.id">
                          <div style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t(`Global.${item.name}`) }}
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2 mr-2" prop="created_by" :rules="validation(null, 1)" :label="$t('Global.createdBy')" style="width: 25%">
                      <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.created_by" :placeholder="$t('Global.createdBy')" style="width: 100%">
                        <el-option v-for="item in createdByConstants('array')" :key="item.id" :label="$t(`Global.${item.name}`)" :value="item.id">
                          <div style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t(`Global.${item.name}`) }}
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="d-flex">
                    <el-form-item class="mb-2 mr-2" :rules="validation(null, 1)" style="width: 30%" prop="title" :label="$t('Global.name')">
                      <el-input autosize resize="none" class="" :placeholder="$t('Global.name')" v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item class="mb-2 mr-2" :rules="validation(null, 1)" style="width: 70%" prop="thread_message" :label="$t('Global.message')">
                      <el-input autosize resize="none" class="" :placeholder="$t('Global.message')" v-model="ruleForm.thread_message"></el-input>
                    </el-form-item>
                  </div>
                  <el-form-item class="mb-2" :rules="validation(null, 1)" style="width: 100%" prop="alert_message" :label="$t('Global.alert_message')">
                    <el-input autosize resize="none" class="" :placeholder="$t('Global.alert_message')" v-model="ruleForm.alert_message"></el-input>
                  </el-form-item>
                  <el-form-item class="mb-2" :rules="validation(null, 1)" style="width: 100%" prop="contact_message" :label="$t('Global.contact_message')">
                    <el-input autosize resize="none" class="" :placeholder="$t('Global.contact_message')" v-model="ruleForm.contact_message"></el-input>
                  </el-form-item>
                  <el-form-item class="mb-2" :rules="validation(null, 1)" style="width: 100%" prop="task_message" :label="$t('Global.task_message')">
                    <el-input autosize resize="none" class="" :placeholder="$t('Global.task_message')" v-model="ruleForm.task_message"></el-input>
                  </el-form-item>

                  <el-form-item class="mb-2 mr-2" prop="can_approve"  :label="$t('Global.can_approve')" style="width: 100%">
                        <!-- test can_approve -->
                       <el-select multiple :no-data-text="$t('Global.nodata')" v-model="ruleForm.can_approve" :placeholder="$t('Global.can_approve')" style="width: 100%">
                        <el-option v-for="item in evaluatorConstants('array')" :key="item.id" :label="$t(`Global.${item.name}`)" :value="item.id">
                          <div style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t(`Global.${item.name}`) }}
                          </div>
                        </el-option>
                      </el-select>                      
                    </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isDeleteLoad: false,
      isLoad: false,
      progressNum: null,
      alertDialog: false,
      ruleForm: {
        title: null,
        allow_update: null,
        alert_message: null,
        contact_message: null,
        task_message: null,
        thread_message: null,
        order: null,
        task_id: null,
        evaluator_type: null,
        created_by: null,
        show_type: null,
        can_approve:null
      },
    };
  },
  watch: {
    'ruleForm.order'(value) {
      if (this.ruleForm.order) {
        this.ruleForm.order = value.toString().replace(/[^0-9]/g, '');
      }
    },
  },
  methods: {
    openEdit(data) {
      if (data) {
        this.ruleForm.title = data.title;
        this.ruleForm.allow_update = data.allow_update;
        this.ruleForm.alert_message = data.alert_message;
        this.ruleForm.contact_message = data.contact_message;
        this.ruleForm.task_message = data.task_message;
        this.ruleForm.thread_message = data.thread_message;
        this.ruleForm.order = data.order;
        this.ruleForm.evaluator_type = data.evaluator_type;
        this.ruleForm.task_id = data.task_id;
        this.ruleForm.show_type = data.show_type;
        this.ruleForm.created_by = data.created_by;
        this.ruleForm.can_approve = data.can_approve;
        this.id = data.id || null;
      } else {
        this.ruleForm.title = null;
        this.ruleForm.allow_update = null;
        this.ruleForm.alert_message = null;
        this.ruleForm.contact_message = null;
        this.ruleForm.task_message = null;
        this.ruleForm.thread_message = null;
        this.ruleForm.order = null;
        this.ruleForm.evaluator_type = null;
        this.ruleForm.task_id = null;
        this.ruleForm.show_type = null;
        this.ruleForm.created_by = null;
        this.ruleForm.can_approve = null;
        this.id = null;
      }
      this.alertDialog = true;
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let obj = {};
          for (const [key, value] of Object.entries(this.ruleForm)) {
            if (value || value == 0) {
              obj[key] = value;
            }
          }
          this.$store
            .dispatch('submission/saveSCsubSetting', {
              id: this.id ? `/${this.id}` : '',
              query: obj,
            })
            .then(_ => {
              this.alertDialog = false;
              this.isLoad = false;
              this.$refs[formName].resetFields();
              this.init();
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
    init() {
      this.$store.dispatch('submission/subSetting', { query: { system: 1 } });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.el-table .warning-border {
  border-right: 2px solid red !important;
  border-radius: 30px !important;
  border-collapse: collapse !important;
  //   &:before {
  //     content: '';
  //     position: absolute;
  //     top: 0;
  //     right: 0;
  //     background: #000;
  //     width: 1px;
  //     height: 50px;
  //   }
}

.el-table .success-row {
  border-right: 2px solid green;
  border-radius: 30px;
}
</style>
