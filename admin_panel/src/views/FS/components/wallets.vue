<template>
    <div>
        <CRow class="user_icons" v-if="!transaction">
            <CCol v-if="$store.state.finance.exchanges" :md="12 / $store.getters['finance/exchanges'].length"
                  v-for="data in $store.getters['finance/exchanges']">
                <router-link class="text-initial" to="">
                    <CWidgetIcon class="pa-0 mr-0" :text="String(data.value) || '-'" :header="$t(`Global.F${data.key}`)"
                                 :color="data.value ? (data.value == 2 ? 'danger' : 'success') : 'warning'"
                                 :icon-padding="false">
                        <i class="el-icon-money" style="font-size: 25px"></i>
                    </CWidgetIcon>
                </router-link>
            </CCol>
        </CRow>
        <DataTable
                @reset="reset"
                permission="admin_fs"
                :system="system"
                wallet
                :university_id="universityFilter"
                :institute_id="institute_id"
                :organization_id="organization_id"
                :items="credit_id ? $store.state.finance.credit_data : $store.getters['finance/data']"
                :status_id="status"
                @Refresh="Refresh"
                :loading="$store.getters['finance/bonusesLoad']"
                :name="credit_id ? $t('Global.requests') : transaction ? $t('Global.transaction') : $t('Global.wallet')"
                :total="$store.state.finance.total"
                icon="el-icon-money"
        >
            <template #action_table>
                <div v-if="!transaction" @click="openFinanceDialog(null)" class="item">
                    {{ $t('Global.addCombinedPayment') }}
                </div>
                <slot name="add"></slot>
            </template>
            <template #filter_table>
                <div class="ml-2 mr-2 mb-2 fullWidth" v-if="!transaction">
                    <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.edu_type')"
                               style="width: 100%" v-model="system">
                        <el-option class="el-input" :value="1" :label="$t('Global.HEstatistc')">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t('Global.HEstatistc') }}
                          </span>
                        </el-option>
                        <el-option class="el-input" :value="2" :label="$t('Global.SCstatistc')">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t('Global.SCstatistc') }}
                          </span>
                        </el-option>
                        <template #empty>
                            <div class="text-center" style="padding: 10px; font-weight: bold">
                                {{ $t('Global.nodata') }}
                            </div>
                        </template>
                    </el-select>
                </div>
            </template>
            <template #cols>
                <el-table-column prop="name" width="250" :label="$t('Global.name')">
                    <template slot-scope="scope">
                        <router-link class="d-block custom-link text_badge" to="">
                            {{ scope.row.institute_name || scope.row.organization_name || scope.row.name || '-' }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_number" width="150" :label="$t('Global.pay_number')">
                    <template slot-scope="scope">
                        <router-link class="d-block custom-link text_badge" to="">
                            {{ scope.row.pay_number || '-' }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="system" :label="$t('Global.edu_type')">
                    <template slot-scope="scope">
                        <div class="text-muted">
                            {{ `${scope.row.system == 1 ? $t('Global.HEstatistc') : $t('Global.SCstatistc')}` }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="url" :label="$t('Global.FINANCIAL_LETTER')">
                    <template slot-scope="scope">
                        <a :href="scope.row.url" target="blank" download class="text-muted">
                            {{ $t('Global.download') }}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="total" :label="$t('Global.total_balance')"></el-table-column>
                <!--                <el-table-column  prop="created_at" :label="$t('Global.created_at')">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <div class="text-muted">-->
                <!--                            {{ `${scope.row.created_at ? toLocalDatetime(scope.row.created_at, 'ar', false) : '_'}` }}-->
                <!--                        </div>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->


                <el-table-column prop="pull" :label="$t('Global.pull_balance')"></el-table-column>
                <!--                <el-table-column v-if="!transaction" prop="code" :label="$t('Global.code')"></el-table-column>-->
                <el-table-column prop="amount"
                                 :label="transaction ? $t('Global.Ftotal') : $t('Global.restAmount')"></el-table-column>
                <el-table-column prop="payment_date" :label="$t('Global.payment_date')">
                    <template slot-scope="scope">
                        <div class="text-muted">
                            {{ `${scope.row.payment_date ? (scope.row.payment_date ?
                            toLocalDatetime(scope.row.payment_date, 'ar', false) : '-') : '_'}` }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="removed" :label="$t('Global.status')">
                    <template slot-scope="scope">
                        <CBadge :color="getBadge(scope.row.removed)">
                            <span v-if="scope.row.removed == 0">{{ $t('Global.active') }}</span>
                            <span v-if="scope.row.removed == 1">{{ $t('Global.remove') }}</span>
                        </CBadge>
                    </template>
                </el-table-column>
                <!--                <el-table-column v-if="!transaction" prop="code" :label="$t('Global.code')">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <span>-->
                <!--                          {{ scope.row.code ||'-' }}-->
                <!--                        </span>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->

                <el-table-column prop="" label=" ">
                    <template slot-scope="scope">
                        <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                            <router-link :to="{ path: `/finance/wallet/show/${scope.row.id}` }">
                                <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view"
                                           circle></el-button>
                            </router-link>
                            <i @click="cancelTransaction(scope.row.id)"
                               :class="scope.row.removed == 1 ? 'el-icon-refresh table-action-item' : 'el-icon-delete table-action-item'"></i>
                            <i @click="openFinanceDialog(scope.row)" :class="'el-icon-edit table-action-item'"></i>
                            <!--                            <el-tooltip effect="dark" placement="top">-->
                            <!--                                <div slot="content">-->
                            <!--                                  <span>-->
                            <!--                                    {{ $t('Global.transactionGp') }}-->
                            <!--                                  </span>-->
                            <!--                                </div>-->
                            <!--                                <i v-if="transaction && !credit_id" @click="openTransactionGpDialog(scope.row)"-->
                            <!--                                   :class="'el-icon-money table-action-item'"></i>-->
                            <!--                            </el-tooltip>-->
                        </div>
                    </template>
                </el-table-column>
            </template>
        </DataTable>
        <el-dialog :title="$t('Global.wallet')" :visible.sync="finance_dialog" class="p-0" width="60%">
            <CCardBody dir="rtl" style="text-align: initial" class="p-0">
                <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm"
                         label-width="120px" class="demo-ruleForm">
                    <CRow>
                        <CCol sm="12">
                            <el-form-item :label="$t('Global.edu_type')" prop="system">
                                <el-select ref="level" :no-data-text="$t('Global.nodata')"
                                           :placeholder="$t('Global.edu_type')" style="width: 100%"
                                           v-model="ruleForm.system">
                                    <el-option class="el-input" :value="1" :label="$t('Global.HEstatistc')">
                                        <span style="float: right; color: #8492a6; font-size: 13px">
                                          {{ $t('Global.HEstatistc') }}
                                        </span>
                                                        </el-option>
                                                        <el-option class="el-input" :value="2" :label="$t('Global.SCstatistc')">
                                        <span style="float: right; color: #8492a6; font-size: 13px">
                                          {{ $t('Global.SCstatistc') }}
                                        </span>
                                    </el-option>
                                    <template #empty>
                                        <div class="text-center" style="padding: 10px; font-weight: bold">
                                            {{ $t('Global.nodata') }}
                                        </div>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="12">
                            <el-form-item :rules="validation()" prop="name" :label="`${$t('Global.name')}  `">
                                <el-input clearable :placeholder="$t('Global.name')" v-model="ruleForm.name"
                                          style="width: 100%">
                                    <i slot="suffix" class="el-icon-s-marketing"></i>
                                </el-input>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6">
                            <el-form-item prop="pay_number" :label="$t('Global.pay_number')">
                                <el-input :placeholder="$t('Global.pay_number')"
                                          v-model="ruleForm.pay_number"></el-input>
                            </el-form-item>
                        </CCol>

                        <CCol sm="6">
                            <el-form-item :rules="validation(false, 1)" :label="$t('Global.payment_date')"
                                          prop="payment_date">
                                <el-date-picker @focus="changePicker" format="yyyy-MM-d" value-format="yyyy-MM-d"
                                                clearable style="width: 100%" v-model="ruleForm.payment_date"
                                                type="date" :placeholder="$t('Global.payment_date')"></el-date-picker>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6">
                            <el-form-item prop="amount" :label="$t('Global.amount')">
                                <el-input :maxlength="8" :controls="false" clearable :min="0" :step="Number(100)"
                                          :placeholder="$t('Global.amount')" v-model="ruleForm.amount"></el-input>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6" class="el-form-item el-form-item--feedback is-required el-form-item--large">
                            <strong class="el-form-item__label">{{ $t('Global.attachment') }}</strong>
                            <el-form-item :show-message="filesError ? true : false" :error="filesError ? filesError : ''" prop="file" class="p-0 left_right">
                                <div class="mb-2 box-card docs_body edit_upload border rounded text docs d-flex justify-content-between align-items-center">
                                    <div>
                                        <a class="custom_link" v-if="doc" download target="_blank" :href="doc">
                                            <span style="line-height: 18px; text-align: initial"
                                                  class="el-form-item__label mx-1">{{ $t('Global.download') }}</span>
                                        </a>
                                    </div>
                                    <FormUpload v-if="doc" @deleteFile="deleteFile" :title="$t('Global.download')"
                                                type="editSubFile" :label="finance_id" :index="finance_id"
                                                @getFile="upload"></FormUpload>
                                    <FormUpload v-else type="subFile" title="الدفع المجمع" :label="55" :index="55"
                                                @getFile="upload"></FormUpload>
                                </div>
                            </el-form-item>
                        </CCol>
                    </CRow>
                </el-form>
            </CCardBody>
            <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer">
        <el-button @click="save('ruleForm')" @keyup.enter="save('ruleForm')"
                   type="primary">{{ $t('Global.save') }}</el-button>
        <el-button @click="finance_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import DataTable from '../../components/DataTable';
    import FormUpload from '@/views/components/FormUpload';
    import upload from '@/views/components/upload';
    import {EventBus} from '../../../main';

    export default {
        name: 'users',
        components: {DataTable, FormUpload, upload},
        props: {
            parent_id: Number,
            transaction: Boolean,
            orgSystem: null,
            credit_id: Number,
        },
        data() {
            return {
                finance_dialog: false,
                status: null,
                file: [],
                admin_disabled: true,
                admin_disabledFilter: true,
                disabled: true,
                disabledFilter: true,
                file_list: [],
                doc: null,
                loading: false,
                isLoad: false,
                filesError: false,
                errorFile: false,
                system: 1,
                organization_id: null,
                institute_id: null,
                directorateFilter: null,
                universityFilter: null,
                ruleForm: {
                    system: 1,
                    amount: null,
                    pay_number: null,
                    name: null,
                    payment_date: null,
                    organization_id: null,
                    institute_id: null,
                    directorate: null,
                },
                data: [{name: 'test', total_balance: '200', pull_balance: '2035', rest: '200000'}],
                finance_id: null,
                directorate: null,
                university: null,
            };
        },
        methods: {
            openTransactionDialog(item) {
                EventBus.$emit('openTransactionDialog', item);
            },
            openTransactionGpDialog(item) {
                EventBus.$emit('openTransactionGpDialog', item);
            },
            save(formName) {
                this.$refs[formName].validate(valid => {
                    if (!this.$route.params.id) {
                        if (valid) {
                            let formData = new FormData();
                            for (const [key, value] of Object.entries(this.ruleForm)) {
                                if (value || value == 0) {
                                    formData.append(key, value);
                                }
                            }
                            this.file.forEach((element, i) => {
                                formData.append('file', element.file);
                            });
                            var query = {query: formData};
                            // if (!this.$store.state.submission.inDocuments.url) {
                            if (formData.has('file') || this.doc) {
                                this.isLoad = true;
                                this.$store
                                    .dispatch('finance/saveTransaction', {id: this.finance_id, query: formData})
                                    .then(() => {
                                        this.$notify({type: 'success', message: this.$t('Global.successMessage')});
                                        this.isLoad = false;
                                        this.finance_dialog = false;
                                        this.Refresh();
                                    })
                                    .catch(() => {
                                        this.error = true;
                                        this.isLoad = false;
                                    });
                            } else {
                                this.filesError = 'برجاء رفع جميع الملفات ';
                            }
                            // }
                        }
                    }
                });
            },
            getBadge(status) {
                switch (status) {
                    case 0:
                        return 'success';
                    case 1:
                        return 'danger';
                    default:
                        'primary';
                }
            },
            upload(file, num) {
                if (file) {
                    this.file[num - 2] = file;
                }
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
            deleteFile(file) {
                this.file = this.file.filter(myfile => file.name != myfile.file.name);
            },
            reset() {
                this.status = null;
                this.universityFilter = null;
                this.directorateFilter = null;
                this.organization_id = null;
                this.institute_id = null;
            },
            init() {
                this.$store.dispatch('university/universities');
                this.$store.dispatch('directorate/directorates');
            },
            Refresh(query) {
                this.$emit('init', query);
                let obj;
                let allQuery;
                if (this.parent_id) {
                    obj = {parent_id: this.parent_id};
                    allQuery = {...query, ...obj};
                }

                if (this.parent_id) {
                    this.$store.dispatch('finance/wallets', {query: allQuery});
                } else if (this.credit_id) {
                    allQuery['system'] = this.$store.state.finance.wallet && this.$store.state.finance.wallet.system && this.transaction ? this.$store.state.finance.wallet.system : 1;
                    this.$store.dispatch('finance/wallets', {query: query});
                } else {
                    this.$store.dispatch('finance/wallets', {query: query});
                }
            },
            openFinanceDialog(finance) {
                if (finance) {
                    this.finance_id = finance.id;
                    this.ruleForm.amount = finance.amount;
                    this.ruleForm.payment_date = finance.payment_date;
                    this.ruleForm.pay_number = finance.pay_number;
                    this.ruleForm.system = finance.system;
                    this.ruleForm.name = finance.name;
                    this.doc = finance.url;
                } else {
                    this.finance_id = null;
                    this.doc = null;
                    this.ruleForm.amount = null;
                    this.ruleForm.payment_date = null;
                    this.ruleForm.pay_number = null;
                    this.ruleForm.system = null;
                    this.ruleForm.name = null;
                }
                this.finance_dialog = true;
            },
            saveFinance(form) {
                this.$store
                    .dispatch('finance/saveBonus', {
                        id: this.finance_id ? `/${this.finance_id}` : '',
                        query: this.ruleForm,
                    })
                    .then(_ => {
                        this.finance_dialog = false;
                        this.Refresh();
                    });
            },
            cancelTransaction(id) {
                this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
                    confirmButtonText: `${this.$t('Global.accept')}`,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    type: 'warning',
                }).then(_ => {
                    this.$store.dispatch('finance/cancelTransaction', id).then(_ => {
                        this.Refresh();
                    });
                });
            },
        },
        watch: {
            'ruleForm.amount': function (value) {
                if (this.ruleForm.amount) {
                    this.ruleForm.amount = value.toString().replace(/[^0-9]/g, '');
                }
            },
            status: function (val) {
                this.status = val;
            },
            universityFilter: function (val) {
                this.universityFilter = val;
                if (val) {
                    this.disabledFilter = false;
                } else {
                    this.organization_id = null;
                    this.disabledFilter = true;
                }
                this.$store.dispatch('organization/names', {
                    query: {
                        parent_id: val,
                    },
                });
            },
            university: function (val) {
                if (val || val == 0) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
                this.$store.dispatch('organization/names', {
                    query: {
                        parent_id: val,
                    },
                });
            },
            // organization_id: function (val) {
            //   if (val || val == 0) {
            //     this.disabledFilter = false;
            //   } else {
            //     this.disabledFilter = true;
            //   }
            // },
            'ruleForm.organization_id': function (val) {
                if (val || val == 0) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
            },
            directorateFilter: function (val) {
                this.ruleForm.directorate = val;
                if (val) {
                    this.admin_disabledFilter = false;
                } else {
                    this.institute_id = null;
                    this.admin_disabledFilter = true;
                }
                this.$store.dispatch('directorate/institutes', {
                    parent_id: val,
                });
            },
            'ruleForm.directorate': function (val) {
                this.ruleForm.directorate = val;
                if (val || val === 0) {
                    this.admin_disabled = false;
                    this.ruleForm.institute_id = null;
                } else {
                    this.admin_disabled = true;
                }
                this.$store.dispatch('directorate/institutes', {
                    parent_id: val,
                });
            },
        },
        mounted() {
            this.init();
        },
    };
</script>

<style scoped></style>
