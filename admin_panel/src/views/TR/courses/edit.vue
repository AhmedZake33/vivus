<template>
    <CRow class="edit_submission" v-loading="$store.getters['course/coursesLoad']">
        <CCol sm="12">
            <CCard>
                <CCardHeader>
                    <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
                        <CIcon name="cil-people" color="bg-primary"></CIcon>
                        {{ $t('Global.editCourse') }}
                    </div>
                </CCardHeader>
                <CCardBody :class="isLoad ? 'disabledAll' : ''" dir="rtl" style="text-align: initial">
                    <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm"
                             label-width="120px" class="demo-ruleForm">
                        <CRow>
                            <CCol sm="4">
                                <el-form-item :rules="validation(null)" prop="name" :label="$t('Global.ar_name')">
                                    <el-input clearable :placeholder="$t('Global.ar_name')" v-model="ruleForm.name"
                                              style="width: 100%"></el-input>
                                </el-form-item>
                            </CCol>
                            <CCol sm="4">
                                <el-form-item :rules="validation(null)" prop="en_name" :label="$t('Global.en_name')">
                                    <el-input clearable :placeholder="$t('Global.en_name')" v-model="ruleForm.en_name"
                                              style="width: 100%"></el-input>
                                </el-form-item>
                            </CCol>
                            <CCol sm="4">
                                <!-- :rules="validation(null, 1)" -->
                                <el-form-item :rules="validation(null, 1)" prop="type" :label="$t('Global.category')">
                                    <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%"
                                               v-model="ruleForm.type" :placeholder="$t('Global.category')">
                                        <el-option v-for="item in lookups.types" :key="item.id" :label="item.name"
                                                   :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                      </span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </CCol>
                            <CCol sm="4">
                                <!-- :rules="validation(null, 1)" -->
                                <el-form-item :rules="validation(null, 0)" prop="source" :label="$t('Global.source')">
                                    <el-input clearable :placeholder="$t('Global.source')" v-model="ruleForm.source"
                                              style="width: 100%"></el-input>
                                </el-form-item>
                            </CCol>

                            <CCol sm="12" lg="4">
                                <el-form-item :label="$t('Global.days_count')" prop="days">
                                    <el-input clearable :placeholder="$t('Global.days_count')"
                                              v-model="ruleForm.days"></el-input>
                                </el-form-item>
                            </CCol>
                            <CCol sm="4">
                                <el-form-item :rules="validation(null, 0)" prop="hours"
                                              :label="$t('Global.hours_count')">
                                    <el-input clearable disabled :placeholder="$t('Global.hours_count')"
                                              v-model="ruleForm.hours" style="width: 100%"></el-input>
                                </el-form-item>
                            </CCol>
                            <CCol sm="12" lg="4">
                                <el-form-item :label="$t('Global.content')" prop="content">
                                    <el-input autosize resize="none" type="textarea"
                                              v-model="ruleForm.content"></el-input>
                                </el-form-item>
                            </CCol>
                            <!--              <CCol sm="12" lg="4">-->
                            <!--                <el-form-item :label="$t('Global.en_content')" prop="en_content">-->
                            <!--                  <el-input autosize resize="none" type="textarea" v-model="ruleForm.en_content"></el-input>-->
                            <!--                </el-form-item>-->
                            <!--              </CCol>-->
                            <CCol sm="12" lg="4">
                                <el-form-item :label="$t('Global.why', {'name' :ruleForm.name})" prop="objective">
                                    <el-input autosize resize="none" type="textarea"
                                              v-model="ruleForm.objective"></el-input>
                                </el-form-item>
                            </CCol>
                            <CCol sm="4">
                                <!-- :rules="validation(null, 1)" -->
                                <el-form-item prop="target_id" :label="$t('Global.target_id')">
                                    <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%"
                                               v-model="ruleForm.target_id" :placeholder="$t('Global.target_id')">
                                        <el-option v-for="item in lookups.job_targets" :key="item.id" :label="item.name"
                                                   :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                      </span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </CCol>
                        </CRow>
                    </el-form>
                </CCardBody>
                <CCardFooter>
                    <div class="baseButton resetButton" style="justify-content: flex-start">
                        <button class="el-button el-button--default is-round sec_color mx-1" @click="save('ruleForm')"
                                style="padding: 0.6rem 1rem">
                            <i class="el-icon-check-circle"></i>
                            <CSpinner v-if="isLoad" color="default" size="sm"/>
                            {{ $route.params.id ? $t('Global.submit') : $t('Global.add') }}
                        </button>
                        <button v-if="!isLoad" @click="resetForm('ruleForm')"
                                class="el-button--small el-button el-button--default is-round base_color" type="reset"
                                style="padding: 0.6rem 1rem">
                            <i class="el-icon-refresh"></i>
                            {{ $t('archive.reset') }}
                        </button>
                    </div>
                </CCardFooter>
            </CCard>
        </CCol>
    </CRow>
</template>

<script>
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    en_name: '',
                    content: null,
                    en_content: null,
                    target_id: null,
                    source: null,
                    days: null,
                    objective: null,
                    hours: null,
                },
                disabled: false,
                isLoad: false,
            };
        },
        watch: {
            'ruleForm.name'(value) {
                this.ruleForm.name = value.replace(/[a-zA-Z]/, '');
            },
            'ruleForm.en_name'(value) {
                this.ruleForm.en_name = value.replace(/[أ-ي]/, '');
            },
            'ruleForm.days'(value) {
                if (this.ruleForm.days) {
                    this.ruleForm.days = value.toString().replace(/[^0-9]/g, '');
                    this.ruleForm.hours = this.ruleForm.days * 5;
                }
            },
            'ruleForm.hours'(value) {
                if (this.ruleForm.hours) {
                    this.ruleForm.hours = value.toString().replace(/[^0-9]/g, '');
                }
            },
        },
        computed: {
            lookups: function () {
                if (this.$store.state.course.lookups) {
                    return this.$store.state.course.lookups;
                }
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            init() {
                this.$store.dispatch('course/getCourse', this.$route.params.id ? this.$route.params.id : null).then(_ => {
                    if (this.$store.state.course.course) {
                        this.ruleForm = {...this.$store.state.course.course};
                    }
                });
            },
            save(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.isLoad = true;
                        let formData = new FormData();
                        for (const [key, value] of Object.entries(this.ruleForm)) {
                            if (value || value == 0) {
                                formData.append(key, value);
                            }
                        }
                        this.$store
                            .dispatch('course/saveCourse', {
                                query: formData,
                                id: this.$route.params.id ? this.$route.params.id : null,
                            })
                            .then(() => {
                                this.isLoad = false;
                                this.$router.go(-1);
                            });
                    }
                });
            },
        },
    };
</script>
