<template>
    <div>
        <CCard>
            <CCardHeader>
                <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
                    <CIcon name="cil-people" color="bg-primary"></CIcon>
                    {{ $t('Global.uploadLetterOrgFile') }}
                </div>
            </CCardHeader>
            <CCardBody :class="isLoad ? 'disabledAll' : ''" v-loading="loading" dir="rtl" style="text-align: initial">
                <el-form label-position="top" :model="editFormData" status-icon size="large" ref="editFormData"
                         label-width="120px" class="demo-editFormData">
                    <CRow>
                        <CCol sm="12">
                            <!-- <small v-if="amount">{{ editFormData.type == 2 ? ' ' + $t('Global.availableAmount') + ' ' + amount : '' }}</small> -->
                            <!-- <small v-if="!amount && editFormData.type == 2" class="text-danger">{{ $t('Global.unavailableAmount') }}</small> -->
                            <div class="mainStatistics mt-3">
                                <div :class="`${editFormData.type === 2 ? 'switch_view ml-2' : 'active switch_view ml-2'}`"
                                     style="display: inline-flex">
                                    <span :class="`${editFormData.type === 2 ? `${$i18n.locale === 'en' ? 'h6 mr-2' : 'h6 ml-2'}` : `${$i18n.locale === 'en' ? 'active h6  mr-2' : 'active h6  ml-2'}`}`"
                                          style="cursor: pointer; margin: 0 0" @click="editFormData.type = 1">{{ $t('Global.baseType') }}</span>
                                    <span :class="`${editFormData.type === 2 ? 'active h6' : 'h6'}`"
                                          style="cursor: pointer; margin: 0 0" @click="editFormData.type = 2">{{ $t('Global.combinedPayment') }}</span>
                                </div>
                            </div>
                            <!-- <div class="d-flex justify-content-lg-center">
                              <el-form-item class="text-center" :label="$t('Global.payment_type')" prop="type">
                                <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.payment_type')" style="width: 100%" v-model="editFormData.type">
                                  <el-option class="el-input" :value="1" :label="$t('Global.baseType')">
                                    <span style="float: right; color: #8492a6; font-size: 13px">
                                      {{ $t('Global.baseType') }}
                                    </span>
                                  </el-option>
                                  <el-option class="el-input" :value="2" :label="$t('Global.combinedPayment')">
                                    <span style="float: right; color: #8492a6; font-size: 13px">
                                      {{ $t('Global.combinedPayment') }}
                                    </span>
                                  </el-option>
                                  <template #empty>
                                    <div class="text-center" style="padding: 10px; font-weight: bold">
                                      {{ $t('Global.nodata') }}
                                    </div>
                                  </template>
                                </el-select>
                              </el-form-item>
                            </div> -->
                        </CCol>
                        <CCol sm="6" v-if="editFormData.type == 2">
                            <!--              <el-form-item :rules="validation()" prop="gp_code" :label="`${$t('Global.gp_code')}  `">-->
                            <!--                <el-input  clearable :placeholder="$t('Global.gp_code')" v-model="editFormData.gp_code" style="width: 100%">-->
                            <!--                  <i slot="suffix" class="el-icon-s-marketing"></i>-->
                            <!--                </el-input>-->
                            <!--              </el-form-item>-->
                            <el-form-item :rules="validation()" prop="pay_number" :label="$t('Global.pay_number')">
                                <el-input :maxlength="50" clearable :placeholder="$t('Global.pay_number')"
                                          v-model.trim="editFormData.pay_number" style="width: 100%">
                                    <i slot="suffix" class="el-icon-s-marketing"></i>
                                </el-input>
                            </el-form-item>
                            <!-- <span v-if="editFormData.pay_value > amount && editFormData.type == 2" class="text-danger">{{ $t('Global.errorAmount') }}</span> -->
                        </CCol>
                        <CCol sm="6" v-if="editFormData.type == 2">

                            <el-form-item v-if="fees" :rules="validation()" prop="pay_value"
                                          :label="`${$t('Global.pay_value')}  `">
                                <el-input disabled :maxlength="10" :controls="false" clearable
                                          :placeholder="$t('Global.pay_value')" :value="fees" :min="0"
                                          :step="Number(1000)" style="width: 100%">
                                    <i slot="suffix" class="el-icon-s-marketing"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-else :rules="validation()" prop="pay_value"
                                          :label="`${$t('Global.pay_value')}  `">
                                <el-input  :maxlength="10" :controls="false" clearable
                                          :placeholder="$t('Global.pay_value')" v-model="editFormData.pay_value" :min="0"
                                          :step="Number(1000)" style="width: 100%">
                                    <i slot="suffix" class="el-icon-s-marketing"></i>
                                </el-input>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6" v-if="editFormData.type == 1">
                            <el-form-item :rules="validation()" prop="pay_number" :label="$t('Global.pay_number')">
                                <el-input :maxlength="50" clearable :placeholder="$t('Global.pay_number')"
                                          v-model.trim="editFormData.pay_number" style="width: 100%">
                                    <i slot="suffix" class="el-icon-s-marketing"></i>
                                </el-input>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6" v-if="editFormData.type == 1">
                            <el-form-item v-if="fees" :rules="validation()" prop="pay_value"
                                          :label="`${$t('Global.pay_value')}  `">
                                <el-input disabled :maxlength="10" :controls="false" clearable
                                          :placeholder="$t('Global.pay_value')" :value="fees" :min="0"
                                          :step="Number(1000)" style="width: 100%">
                                    <i slot="suffix" class="el-icon-s-marketing"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-else :rules="validation()" prop="pay_value"
                                          :label="`${$t('Global.pay_value')}  `">
                                <el-input  :maxlength="10" :controls="false" clearable
                                           :placeholder="$t('Global.pay_value')" v-model="editFormData.pay_value" :min="0"
                                           :step="Number(1000)" style="width: 100%">
                                    <i slot="suffix" class="el-icon-s-marketing"></i>
                                </el-input>
                            </el-form-item>
                            <!-- <span v-if="editFormData.pay_value > amount && editFormData.type == 2" class="text-danger">{{ $t('Global.errorAmount') }}</span> -->
                        </CCol>
                        <CCol sm="6" v-if="editFormData.type == 1">
                            <el-form-item :rules="validation(false, 1)" :label="$t('Global.payment_date')"
                                          prop="payment_date">
                                <el-date-picker @focus="changePicker" format="yyyy-MM-d" value-format="yyyy-MM-d"
                                                clearable style="width: 100%" v-model="editFormData.payment_date"
                                                type="date" :placeholder="$t('Global.payment_date')"></el-date-picker>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6" v-if="false">
                            <el-form-item
                                    :rules="[{ required: true, message: `${$t('Global.selectFiled')}`, trigger: 'change' }]"
                                    :label="$t('Global.government_id')" prop="government_id">
                                <el-select clearable :multiple-limit="3" :no-data-text="$t('Global.nodata')"
                                           style="width: 100%" v-model="editFormData.government_id" filterable
                                           :placeholder="$t('Global.government_id')">
                                    <div>
                                        <el-option v-for="user in 4" :key="user.id" :label="user.ar_name"
                                                   :value="user.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ user.ar_name }}
                        <i class="el-icon-user-solid"></i>
                      </span>
                                        </el-option>
                                    </div>
                                    <template #empty>
                                        <div class="text-center" style="padding: 10px; font-weight: bold">
                                            {{ $t('Global.nodata') }}
                                        </div>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6" v-if="false">
                            <el-form-item
                                    :rules="[{ required: true, message: `${$t('Global.selectFiled')}`, trigger: 'blur' }]"
                                    prop="organizationNum" :label="$t('Global.organizationNum')">
                                <el-input clearable :placeholder="$t('Global.organizationNum')"
                                          v-model="editFormData.organizationNum">
                                    <i slot="suffix" class="el-icon-s-marketing"></i>
                                </el-input>
                            </el-form-item>
                        </CCol>
                        <CCol v-if="editFormData.type == 1" sm="6"
                              class="el-form-item el-form-item--feedback is-required el-form-item--large">
                            <strong class="el-form-item__label">{{ $t('Global.attachment') }}</strong>
                            <el-form-item :show-message="filesError ? true : false"
                                          :error="filesError ? filesError : ''" prop="file" class="p-0 left_right">
                                <div v-if="$store.state.submission.inDocuments"
                                     class="mb-2 box-card docs_body edit_upload border rounded text docs d-flex justify-content-between align-items-center">
                                    <div>
                                        <a class="custom_link" v-if="$store.state.submission.inDocuments.url" download
                                           target="_blank" :href="$store.state.submission.inDocuments.url">
                                            <span style="line-height: 18px; text-align: initial"
                                                  class="el-form-item__label mx-1">{{ $store.state.submission.inDocuments.name }} ( {{ $store.state.submission.inDocuments.size }} )</span>
                                        </a>
                                    </div>
                                    <FormUpload v-if="$store.state.submission.inDocuments.url" @deleteFile="deleteFile"
                                                :title="$store.state.submission.inDocuments.name" type="editSubFile"
                                                :label="$store.state.submission.inDocuments.id"
                                                :index="$store.state.submission.inDocuments.id"
                                                @getFile="upload"></FormUpload>
                                    <FormUpload v-else type="subFile" :title="$store.state.submission.inDocuments.name"
                                                :label="$store.state.submission.inDocuments.id"
                                                :index="$store.state.submission.inDocuments.id"
                                                @getFile="upload"></FormUpload>
                                </div>
                            </el-form-item>
                        </CCol>
                    </CRow>
                </el-form>
            </CCardBody>
            <CCardFooter>
                <div :class="isLoad ? 'disabledAll' : ''" class="baseButton resetButton"
                     style="justify-content: flex-start">
                    <!-- <button v-if="editFormData.pay_value > amount && editFormData.type == 2" class="disabledAll el-button el-button--default is-round sec_color mx-1" type="reset" style="padding: 0.6rem 1rem">
                      <i class="el-icon-check-circle"></i>
                      {{ $route.params.id ? $t('Global.submit') : $t('Global.send') }}
                    </button> -->
                    <button class="el-button el-button--default is-round sec_color mx-1" @click="save('editFormData')"
                            type="reset" style="padding: 0.6rem 1rem">
                        <i class="el-icon-check-circle"></i>
                        <CSpinner v-if="isLoad" color="default" size="sm"/>
                        <span class="ml-1 mr-1"
                              v-if="$store.state.uploadProgress && $store.state.uploadProgress != 100">{{ $store.state.uploadProgress }}%</span>
                        {{ $route.params.id ? $t('Global.submit') : $t('Global.send') }}
                    </button>
                    <button v-if="!isLoad" @click="resetForm('editFormData')"
                            class="el-button--small el-button el-button--default is-round base_color" type="reset"
                            style="padding: 0.6rem 1rem">
                        <i class="el-icon-refresh"></i>
                        {{ $t('archive.reset') }}
                    </button>
                    <button @click="back" class="el-button--small el-button el-button--default is-round" type="reset"
                            style="padding: 0.6rem 1rem">
                        {{ $t('Global.undo') }}
                    </button>
                </div>
            </CCardFooter>
        </CCard>
    </div>
</template>

<script>
    import Browser from '../../../components/userBrowser';
    import FormUpload from '@/views/components/FormUpload';
    import upload from '@/views/components/upload';

    export default {
        components: {Browser, FormUpload, upload},
        name: 'approve',
        data() {
            return {
                approveDialog: false,
                type: null,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                },
                fees: null,
                file: [],
                file_list: [],
                loading: false,
                isLoad: false,
                filesError: false,
                errorFile: false,
                clicked: false,
                editFormData: {
                    pay_number: '',
                    pay_value: null,
                    gp_code: null,
                    type: 1,
                    credit_id: null,
                    payment_date: null,
                    government_id: null,
                    // organizationNum: null,
                },
            };
        },
        computed: {
            amount() {
                if (this.$store.state.finance.wallet && this.$store.state.finance.wallet.amount) {
                    return this.$store.state.finance.wallet.amount;
                } else {
                    return false;
                }
            },
            id() {
                if (this.$store.state.finance.wallet && this.$store.state.finance.wallet.id) {
                    return this.$store.state.finance.wallet.id;
                } else {
                    return false;
                }
            },
        },
        mounted() {
            this.init();
        },
        watch: {
            'editFormData.gp_code'(value) {
                if (this.editFormData.gp_code) {
                    this.editFormData.gp_code = value.toString().replace(/^[أ-ي][a-z0-9]*$/i, '');
                }
            },
            'editFormData.pay_value'(value) {
                if (this.editFormData.pay_value) {
                    this.editFormData.pay_value = value.toString().replace(/[^0-9]/g, '');
                }
            },
            'editFormData.type'(value) {
                if (value == 2) {
                    this.editFormData.pay_number = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].pay_number : null;
                } else {
                    this.editFormData.pay_number = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].pay_number : null;
                    this.editFormData.pay_value = this.$store.state.submission.fees;
                    this.editFormData.payment_date = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].payment_date : null;
                }
            },
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            changePicker() {
                this.$nextTick(() => {
                    let picker = document.querySelectorAll('.el-picker-panel .el-date-picker__header .el-date-picker__header-label');
                    picker.forEach((element, i) => {
                        if (i == 1) {
                            element.style.position = 'absolute';
                            element.style.top = '15px';
                        }
                    });
                });
            },
            init() {
                this.loading = true;
                this.$store
                    .dispatch('submission/SCedit', {
                        id: this.$route.params.id,
                        query: {},
                    })
                    .then(() => {
                        this.editFormData.pay_number = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].pay_number : null;
                        this.editFormData.pay_value = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].pay_value : null;;
                        this.editFormData.payment_date = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].payment_date : null;
                        this.editFormData.government_id = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].government_id : null;
                        this.editFormData.type = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].type : 1;
                        this.fees = this.$store.state.submission.fees;
                        this.loading = false;
                    });
            },
            // uploadDone() {
            //   this.loading = true;
            //   this.$store
            //     .dispatch('submission/edit', {
            //       id: this.$route.params.id,
            //       query: {},
            //     })
            //     .then(() => {
            //       this.editFormData.pay_number = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].pay_number : null;
            //       this.editFormData.pay_value = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].pay_value : null;
            //       this.editFormData.payment_date = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].payment_date : null;
            //       this.editFormData.government_id = this.$store.getters['submission/payment'] ? this.$store.getters['submission/payment'].government_id : null;
            //       this.$notify({
            //         type: 'success',
            //         message: 'تمت العملية بنجاح',
            //       });
            //       this.loading = false;
            //     });
            // },
            openDialog(type) {
                this.approveDialog = true;
                this.type = type;
            },
            save(formName) {
                this.$refs[formName].validate(valid => {
                    if (!this.$route.params.id) {
                        if (valid) {
                            let formData = new FormData();
                            for (const [key, value] of Object.entries(this.editFormData)) {
                                if (value || value == 0) {
                                    formData.append(key, value);
                                }
                            }
                            this.file.forEach((element, i) => {
                                formData.append('file', element.file);
                            });
                            if (this.$route.params.system) {
                                formData.append('system', this.$route.params.system);
                            }
                            var query = {query: formData};
                            if (!this.$store.state.submission.inDocuments.url) {
                                if ((formData.has('file') && this.editFormData.type == 1) || this.editFormData.type == 2) {
                                    this.isLoad = true;
                                    this.$store
                                        .dispatch('submission/saveFinance', query)
                                        .then(() => {
                                            this.$message({
                                                message: this.$t('Global.successMessage'),
                                                type: 'success',
                                            });
                                            this.isLoad = false;
                                            if (this.$route.params.ev_id) {
                                                this.$router.push(`/school/submissions/submission/${this.$route.params.id}/${this.$route.params.ev_id}`);
                                            } else {
                                                this.$router.go(-1);
                                            }
                                        })
                                        .catch(() => {
                                            this.error = true;
                                            this.isLoad = false;
                                        });
                                } else {
                                    this.filesError = 'برجاء رفع جميع الملفات ';
                                }
                            } else {
                                this.isLoad = true;
                                this.$store
                                    .dispatch('submission/saveFinance', query)
                                    .then(() => {
                                        this.$message({
                                            message: this.$t('Global.successMessage'),
                                            type: 'success',
                                        });
                                        this.isLoad = false;
                                        if (this.$route.params.ev_id) {
                                            this.$router.push(`/school/submissions/submission/${this.$route.params.id}/${this.$route.params.ev_id}`);
                                        } else {
                                            this.$router.go(-1);
                                        }
                                    })
                                    .catch(() => {
                                        this.error = true;
                                        this.isLoad = false;
                                    });
                            }
                        }
                    } else {
                        if (valid) {
                            let formData = new FormData();
                            for (const [key, value] of Object.entries(this.editFormData)) {
                                if (value || value == 0) {
                                    formData.append(key, value);
                                }
                            }
                            if (this.$route.params.system) {
                                formData.append('system', this.$route.params.system);
                            }
                            this.file.forEach((element, i) => {
                                formData.append('file', element.file);
                            });
                            var query = {query: formData};
                            if (this.$route.params.id) {
                                query = {query: formData, id: this.$route.params.id};
                            }
                            if (!this.$store.state.submission.inDocuments.url) {
                                if ((formData.has('file') && this.editFormData.type == 1) || this.editFormData.type == 2) {
                                    this.isLoad = true;
                                    this.$store
                                        .dispatch('submission/saveFinance', query)
                                        .then(() => {
                                            this.$message({
                                                message: this.$t('Global.successMessage'),
                                                type: 'success',
                                            });
                                            this.isLoad = false;
                                            this.clicked = false;
                                            if (this.$route.params.ev_id) {
                                                this.$router.push(`/school/submissions/submission/${this.$route.params.id}/${this.$route.params.ev_id}`);
                                            } else {
                                                this.$router.go(-1);
                                            }
                                        })
                                        .catch(() => {
                                            this.error = true;
                                            this.isLoad = false;
                                        });
                                } else {
                                    this.filesError = 'برجاء رفع جميع الملفات ';
                                }
                            } else {
                                this.isLoad = true;
                                this.$store
                                    .dispatch('submission/saveFinance', query)
                                    .then(() => {
                                        this.$message({
                                            message: this.$t('Global.successMessage'),
                                            type: 'success',
                                        });
                                        this.isLoad = false;
                                        if (this.$route.params.ev_id) {
                                            this.$router.push(`/school/submissions/submission/${this.$route.params.id}/${this.$route.params.ev_id}`);
                                        } else {
                                            this.$router.go(-1);
                                        }
                                    })
                                    .catch(() => {
                                        this.error = true;
                                        this.isLoad = false;
                                    });
                            }
                        }
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.file = null;
            },
            upload(file, num) {
                if (file) {
                    this.file[num - 2] = file;
                }
            },
            deleteFile(file) {
                this.file = this.file.filter(myfile => file.name != myfile.file.name);
            },
        },
    };
</script>

<style scoped lang="scss">
    .custom_left {
        position: absolute;
        top: 50px;
        left: 7px;
        z-index: 999;
        cursor: pointer;
    }

    .custom_members {
        top: 71% !important;
        transform: translateY(-50%);
    }
</style>

<style lang="scss">
    // .members_hide_close {
    //   .el-form-item {
    //     .el-select span i.el-tag__close.el-icon-close {
    //       display: none;
    //     }
    //   }
    // }
    .userDialog {
        .el-dialog__header {
            display: none !important;
        }

        .resetHeader {
            margin-bottom: 0;
        }

        .el-dialog__footer {
            padding: 0 1rem !important;
        }

        .el-dialog__body {
            padding: 0 !important;
        }

        .card {
            .card-body {
                padding-bottom: 0 !important;
            }

            box-shadow: none !important;

            &:hover {
                box-shadow: none !important;
            }
        }

        .el-table th {
            padding: 0 !important;
        }

        .el-table td {
            padding: 0.2rem;
        }
    }

    .el-input-number .el-input__inner {
        text-align: initial !important;
    }
</style>
