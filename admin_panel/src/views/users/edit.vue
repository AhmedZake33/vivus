<template>
  <div>
    <CRow v-loading="loading" v-if="hasPermission('edit_users') || authUser().id == this.$route.params.id">
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
              <CIcon name="cil-people" color="bg-primary"></CIcon>
              {{ $t('Global.userDetails') }}
            </div>
          </CCardHeader>
          <CCardBody :class="isLoad ? 'disabledAll' : ''" dir="rtl" style="text-align: initial">
            <el-form v-if="validation(null, 1) && validation(null, 0)" label-position="top" :model="ruleForm" status-icon size="large" :rules="rules" ref="ruleForm" label-width="120px">
              <CRow>
                <CCol v-if="!show" lg="12" sm="12" class="d-flex flex-column align-items-center justify-content-center mb-3">
                  <label class="el-form-item__label">{{ $t('Global.userAvatar') }}</label>
                  <div v-if="$store.state.user.rerender" style="position: relative">
                    <el-avatar :src="$store.state.user.photo || ruleForm.photo || '/img/avatars/avatardf.png'" class="custom_avatar" :size="100" icon="el-icon-user-solid custom_avatar_icon"></el-avatar>
                    <upload profilePic archive oneFile @success="Refresh" :url="`user/photo/${authUser().id == $route.params.id ? authUser().id : $route.params.id}`">
                      <template #upload-content>
                        <el-button size="small" class="edit_photo" icon="el-icon-edit" circle></el-button>
                      </template>
                    </upload>
                  </div>
                </CCol>
                <CCol lg="6" sm="12">
                  <el-form-item prop="ar_name" :rules="validation(null, 0)" :label="$t('Global.ar_name')">
                    <el-input name="ar_name" id="ar_name" v-model="ruleForm.ar_name"></el-input>
                  </el-form-item>
                </CCol>
                <CCol lg="6" sm="12">
                  <el-form-item class="leftToRight left_right" prop="en_name" :rules="validation(null, 0)" :label="$t('Global.en_name')">
                    <el-input name="en_name" id="en_name" v-model="ruleForm.en_name"></el-input>
                  </el-form-item>
                </CCol>
                <CCol lg="6" sm="12">
                  <el-form-item class="leftToRight left_right" prop="email" :rules="validation($t('Validation.email'), 'email')" :label="$t('user.email')">
                    <el-input name="email" id="email" suffix-icon="el-icon-message" v-model="ruleForm.email"></el-input>
                  </el-form-item>
                </CCol>
                <CCol lg="6" sm="12">
                  <el-form-item class="leftToRight left_right" prop="mobile" :rules="validation(null, 0)" :label="$t('user.mobile')">
                    <el-input :maxlength="12" suffix-icon="el-icon-mobile" v-model="ruleForm.mobile"></el-input>
                  </el-form-item>
                </CCol>
                <CCol lg="6" sm="12">
                  <el-form-item class="leftToRight left_right" :label="$t('user.alt_mobile')">
                    <el-input suffix-icon="el-icon-mobile" v-model="ruleForm.alt_mobile"></el-input>
                  </el-form-item>
                </CCol>
                <CCol lg="6" sm="12">
                  <el-form-item class="leftToRight left_right" prop="national_id" :rules="validation($t('Validation.nId'), 'n_id')" :label="$t('Global.n_id')">
                    <el-input :maxlength="14" style="width: 100%" suffix-icon="el-icon-bank-card" v-model="ruleForm.national_id"></el-input>
                  </el-form-item>
                </CCol>
                <CCol lg="4" sm="12">
                  <el-form-item :rules="validation(null, 0)" :label="$t('Global.birthdate')" prop="birthdate">
                    <el-date-picker :picker-options="pickerOptions" @focus="changePicker" style="width: 100%" v-model="ruleForm.birthdate" value-format="yyyy-MM-d" type="date" placeholder="Pick a day"> </el-date-picker>
                  </el-form-item>
                </CCol>
                <CCol lg="4" sm="12">
                  <el-form-item prop="address" :rules="validation(null, 0)" :label="$t('Global.address')">
                    <el-input suffix-icon="el-icon-address" v-model="ruleForm.address"></el-input>
                  </el-form-item>
                </CCol>
                <CCol lg="4" sm="12">
                  <el-form-item :rules="validation(null, 1)" prop="birth_government" :label="$t('Global.selectGovernments')">
                    <div>
                      <el-select ref="government" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectGovernments')" style="width: 100%" v-model="ruleForm.birth_government" filterable clearable>
                        <el-option v-for="government in $store.getters['user/governments']" :key="government.id" :label="government.name" :value="government.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ government.name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </div>
                  </el-form-item>
                </CCol>

                <CCol sm="5">
                  <div class="box-card docs_body el-form-item el-form-item--feedback is-success is-required el-form-item--small" style="line-height: 20px">
                    <label class="el-form-item__label">{{ $t('Global.userId') }}</label>
                    <el-form-item :show-message="error" :error="$t('Validation.userId')">
                      <div class="p-1 border rounded mb-2 text flex-wrap docs d-flex justify-content-between align-items-center">
                        <div>
                          <a class="custom_link" download target="_blank" v-if="userId" :href="userId">
                            <span style="line-height: 10px" class="el-form-item__label">{{ $t(`Global.userId`) }} ( {{ $t('Global.download') }} )</span></a
                          >
                          <span v-else>
                            {{ $t('Global.noPhoto') }}
                          </span>
                        </div>
                        <FormUpload @deleteFile="deleteFile" type="userId" :label="1" :index="1" @getFile="upload"></FormUpload>
                      </div>
                    </el-form-item>
                  </div>
                </CCol>
                <CCol sm="5">
                  <div class="box-card docs_body el-form-item el-form-item--feedback is-success el-form-item--small" style="line-height: 20px">
                    <label class="el-form-item__label">{{ $t('Global.userCv') }}</label>
                    <el-form-item :show-message="errorCv" :error="$t('Validation.userCv')">
                      <div class="p-1 border rounded mb-2 text flex-wrap docs d-flex justify-content-between align-items-center">
                        <div>
                          <a class="custom_link" download target="_blank" v-if="userCv" :href="userCv">
                            <span style="line-height: 10px" class="el-form-item__label">{{ $t(`Global.userCv`) }} ( {{ $t('Global.download') }} )</span></a
                          >
                          <span v-else>
                            {{ $t('Global.noUserCv') }}
                          </span>
                        </div>
                        <FormUpload @deleteFile="deleteFile" type="userId" :label="2" :index="2" @getFile="upload"></FormUpload>
                      </div>
                    </el-form-item>
                  </div>
                </CCol>
                <CCol sm="2">
                  <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                    <div class="mt-2 el-form-item__label custom_required">{{ $t('Global.gender') }}</div>
                    <el-radio-group v-model="ruleForm.gender">
                      <el-radio-button label="1">{{ $t('Global.man') }}</el-radio-button>
                      <el-radio-button label="2">{{ $t('Global.women') }}</el-radio-button>
                    </el-radio-group>
                  </div>
                </CCol>
                <CCol sm="6" v-if="show || hasPermission('admin_users')">
                  <el-form-item class="leftToRight left_right" :label="$t('user.password')" prop="password">
                    <el-input type="password" v-model="ruleForm.password" :placeholder="$t('user.password')" autocomplete="off"></el-input>
                  </el-form-item>
                </CCol>
                <CCol sm="6" v-if="show || hasPermission('admin_users')">
                  <el-form-item class="leftToRight left_right" :label="$t('user.confirm_password')" prop="confirm_password">
                    <el-input type="password" v-model="ruleForm.confirm_password" :placeholder="$t('user.confirm_password')" autocomplete="off"></el-input>
                  </el-form-item>
                </CCol>
                <el-divider class="my-5" content-position="center"><i class="el-icon-map-location"></i> {{ $t('Global.degreesDetails') }}</el-divider>
                <CCol lg="4" sm="12">
                  <el-form-item  :label="$t('Global.selectLevel')">
                    <div>
                      <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectLevel')" style="width: 100%" v-model="ruleForm.degree_education_level_id" filterable clearable>
                        <el-option v-for="level in getLevels($store.getters['user/levels'], 1)" :key="level.id" :label="level.name" :value="level.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ level.name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </div>
                  </el-form-item>
                </CCol>
                <CCol lg="4" sm="12">
                  <el-form-item  :label="$t('Global.specialization')">
                    <div>
                      <el-select ref="qualification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.specialization')" style="width: 100%" v-model="ruleForm.degree_qualification_id" :disabled="qualification_status" filterable clearable>
                        <el-option v-for="qualification in $store.getters['user/qualifications']" :key="qualification.id" :label="qualification.name" :value="qualification.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ qualification.name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </div>
                  </el-form-item>
                </CCol>
                <CCol lg="4" sm="12">
                  <el-form-item  prop="degree_specification_id" :label="$t('Global.Specialty')">
                    <el-select ref="specification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.Specialty')" style="width: 100%" v-model="ruleForm.degree_specification_id" :disabled="specification_status" filterable clearable>
                      <el-option v-for="specification in $store.getters['user/specifications']" :key="specification.id" :label="specification.name" :value="specification.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ specification.name }}
                          <i class="el-icon-user-solid"></i>
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
                <CCol lg="6" sm="12">
                  <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                    <el-form-item v-if="!temp_university_degree_name"  prop="university_degree_id" :label="$t('Global.selectUniversity')">
                      <el-select ref="university_degree_id" :no-data-text="$t('Global.nodata')" clearable :placeholder="$t('Global.selectUniversity')" style="width: 100%" v-model="ruleForm.university_degree_id" filterable>
                        <el-option v-for="university in $store.getters['university/universities']" :key="university.id" :label="university.name" :value="university.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ university.name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                        <el-option key="new" :label="$t('Global.other')" :value="0">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ $t('Global.other') }}
                              <i class="el-icon-user-solid"></i>
                            </span>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>

                    <el-form-item v-else :label="$t('Global.selectUniversityName')"  prop="temp_university_degree_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.selectUniversityName')" v-model="ruleForm.temp_university_degree_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item>

                    <div v-if="temp_university_degree_name" class="animate left_input" @click="resetUni('temp_university_degree_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                  </div>
                </CCol>
                <CCol lg="6" sm="12">
                  <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                    <el-form-item v-if="!temp_organization_degree_name"  prop="organization_degree_id" :label="$t('Global.selectCollage')">
                      <div>
                        <el-select :disabled="dis_org_degree" ref="collage" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectCollage')" clearable style="width: 100%" v-model="ruleForm.organization_degree_id" filterable>
                          <el-option v-for="collage in $store.state.organization.organizationNamesDegree" :key="collage.id" :label="collage.name" :value="collage.id">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ collage.name }}
                              <i class="el-icon-user-solid"></i>
                            </span>
                          </el-option>
                          <el-option key="new" :label="$t('Global.other')" :value="0">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              <span style="float: right; color: #8492a6; font-size: 13px">
                                {{ $t('Global.other') }}
                                <i class="el-icon-user-solid"></i>
                              </span>
                            </span>
                          </el-option>
                          <template #empty>
                            <div class="text-center" style="padding: 10px; font-weight: bold">
                              {{ $t('Global.nodata') }}
                            </div>
                          </template>
                        </el-select>
                      </div>
                    </el-form-item>

                    <el-form-item v-else :label="$t('Global.organization_name')"  prop="temp_organization_degree_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.organization_name')" v-model="ruleForm.temp_organization_degree_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item>

                    <div v-if="temp_organization_degree_name" class="animate left_input" @click="resetUni('temp_organization_degree_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                  </div>
                </CCol>
                <el-divider class="my-5" content-position="center"><i class="el-icon-map-location"></i> {{ $t('Global.specificationsDetails') }}</el-divider>
                <CCol lg="4" sm="12">
                  <el-form-item :rules="validation(null, 1)" prop="education_level_id" :label="$t('Global.Certificate')">
                    <div>
                      <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.Certificate')" style="width: 100%" v-model="ruleForm.education_level_id" filterable clearable>
                        <el-option v-for="level in getLevels($store.getters['user/levels'], 2)" :key="level.id" :label="level.name" :value="level.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ level.name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </div>
                  </el-form-item>
                </CCol>
                <CCol lg="4" sm="12">
                  <el-form-item :rules="validation(null, 1)" prop="qualification_id" :label="$t('Global.specialization')">
                    <div>
                      <el-select ref="qualification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.specialization')" style="width: 100%" v-model="ruleForm.qualification_id" :disabled="qualification_edu_status" filterable clearable>
                        <el-option v-for="qualification in $store.state.user.edu_qualifications" :key="qualification.id" :label="qualification.name" :value="qualification.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ qualification.name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </div>
                  </el-form-item>
                </CCol>
                <CCol lg="4" sm="12">
                  <el-form-item :rules="$store.state.user.edu_specifications.length ? validation(null, 1) : [{ required: false, trigger: 'blur' }]" prop="specification_id" :label="$t('Global.Specialty')">
                    <el-select ref="specification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.Specialty')" style="width: 100%" v-model="ruleForm.specification_id" :disabled="specification_edu_status" filterable clearable>
                      <el-option v-for="specification in $store.state.user.edu_specifications" :key="specification.id" :label="specification.name" :value="specification.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ specification.name }}
                          <i class="el-icon-user-solid"></i>
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
                <CCol lg="6" sm="12">
                  <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                    <el-form-item :rules="validation(null, 1)" prop="university_education_id" :label="$t('Global.selectUniversity')">
                      <el-select :no-data-text="$t('Global.nodata')" clearable :placeholder="$t('Global.selectUniversity')" style="width: 100%" v-model="ruleForm.university_education_id" filterable>
                        <el-option v-for="university in $store.getters['university/universities']" :key="university.id" :label="university.name" :value="university.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ university.name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                        <!-- <el-option key="new" :label="$t('Global.other')" :value="0">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ $t('Global.other') }}
                              <i class="el-icon-user-solid"></i>
                            </span>
                          </span>
                        </el-option> -->
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>
                    <!-- 
                    <el-form-item v-else :label="$t('Global.selectUniversityName')" :rules="validation(false, 'textarea')" prop="temp_university_degree_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.selectUniversityName')" v-model="ruleForm.temp_university_degree_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item> -->

                    <!-- <div v-if="temp_university_degree_name" class="animate left_input" @click="resetUni('temp_university_degree_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div> -->
                  </div>
                </CCol>
                <CCol lg="6" sm="12">
                  <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                    <el-form-item prop="organization_education_id" :label="$t('Global.selectCollage')">
                      <div>
                        <el-select :disabled="organization_education_status" ref="collage" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectCollage')" clearable style="width: 100%" v-model="ruleForm.organization_education_id" filterable>
                          <el-option v-for="collage in $store.state.organization.organization_edu_names" :key="collage.id" :label="collage.name" :value="collage.id">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ collage.name }}
                              <i class="el-icon-user-solid"></i>
                            </span>
                          </el-option>
                          <!-- <el-option key="new" :label="$t('Global.other')" :value="0">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              <span style="float: right; color: #8492a6; font-size: 13px">
                                {{ $t('Global.other') }}
                                <i class="el-icon-user-solid"></i>
                              </span>
                            </span>
                          </el-option> -->
                          <template #empty>
                            <div class="text-center" style="padding: 10px; font-weight: bold">
                              {{ $t('Global.nodata') }}
                            </div>
                          </template>
                        </el-select>
                      </div>
                    </el-form-item>
                    <!-- 
                    <el-form-item v-else :label="$t('Global.organization_name')" :rules="validation(false, 'textarea')" prop="temp_organization_degree_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.organization_name')" v-model="ruleForm.temp_organization_degree_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item> -->

                    <!-- <div v-if="temp_organization_degree_name" class="animate left_input" @click="resetUni('temp_organization_degree_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div> -->
                  </div>
                </CCol>
                <el-divider class="my-5" content-position="center"><i class="el-icon-map-location"></i> {{ $t('Global.Job_place') }}</el-divider>
                <CCol lg="4" sm="12">
                  <el-form-item :rules="validation(null, 1)" prop="education_degree_id" :label="$t('Global.selectDegree')">
                    <el-select ref="education_degree_id" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectDegree')" style="width: 100%" v-model="ruleForm.education_degree_id" filterable clearable>
                      <el-option v-for="degree in $store.getters['user/degrees']" :key="degree.id" :label="degree.name" :value="degree.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ degree.name }}
                          <i class="el-icon-user-solid"></i>
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

                <CCol v-if="show_select == 1" lg="4" sm="12">
                  <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                    <el-form-item v-if="!temp_university_name" :label="$t('Global.selectUniversity')" :rules="validation(null, 1)" prop="university">
                      <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.university" filterable ref="all" :placeholder="$t('Global.selectUniversity')">
                        <el-option v-for="item in $store.getters['university/universities']" :key="item.id" :label="item.name" :value="item.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.name }}
                          </span>
                        </el-option>
                        <el-option key="new" :label="$t('Global.other')" :value="0">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ $t('Global.other') }}
                            </span>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>

                    <el-form-item v-else :label="$t('Global.selectUniversityName')" :rules="validation(false, 'textarea')" prop="temp_university_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.selectUniversityName')" v-model="ruleForm.temp_university_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item>

                    <div v-if="temp_university_name" class="animate left_input" @click="resetUni('temp_university_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                  </div>
                </CCol>

                <CCol v-if="show_select == 1" lg="4" sm="12">
                  <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                    <el-form-item v-if="!temp_organization_name" :rules="validation(null, 1)" :label="$t('Global.selectCollage')" prop="organization_id" class="m-0 hide_border">
                      <el-select class="long_place_holder" clearable :disabled="disabled_org" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.organization_id" filterable ref="all" :placeholder="$t('Global.selectCollage')">
                        <el-option v-for="item in $store.getters['organization/organizationNames']" :key="item.id" :label="item.name" :value="item.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.name }}
                          </span>
                        </el-option>
                        <el-option key="new" :label="$t('Global.other')" :value="0">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ $t('Global.other') }}
                            </span>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>

                    <el-form-item v-else :label="$t('Global.organization_name')" :rules="validation(false, 'textarea')" prop="temp_organization_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.organization_name')" v-model="ruleForm.temp_organization_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item>

                    <div v-if="temp_organization_name" class="animate left_input" @click="resetUni('temp_organization_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                  </div>
                </CCol>

                <CCol v-if="show_select == 2" lg="4" sm="12">
                  <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                    <el-form-item v-if="!temp_university_name" :label="$t('Global.directorate')" :rules="validation(null, 1)" prop="university">
                      <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.university" filterable ref="all" :placeholder="$t('Global.directorate')">
                        <el-option v-for="item in $store.getters['directorate/directorates']" :key="item.id" :label="item.name" :value="item.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.name }}
                          </span>
                        </el-option>
                        <el-option key="new" :label="$t('Global.other')" :value="0">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ $t('Global.other') }}
                            </span>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>

                    <el-form-item v-else :label="$t('Global.directorate')" :rules="validation(false, 'textarea')" prop="temp_university_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.directorate')" v-model="ruleForm.temp_university_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item>

                    <div v-if="temp_university_name" class="animate left_input" @click="resetUni('temp_university_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                  </div>
                </CCol>

                <CCol v-if="show_select == 2" lg="4" sm="12">
                  <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                    <el-form-item v-if="!temp_organization_name" :rules="validation(null, 1)" :label="$t('Global.institute')" prop="organization_id" class="m-0 hide_border">
                      <el-select class="long_place_holder" clearable :disabled="disabled_org" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.organization_id" filterable ref="all" :placeholder="$t('Global.institute')">
                        <el-option v-for="item in $store.getters['directorate/institutes']" :key="item.id" :label="item.name" :value="item.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.name }}
                          </span>
                        </el-option>
                        <el-option key="new" :label="$t('Global.other')" :value="0">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ $t('Global.other') }}
                            </span>
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>

                    <el-form-item v-else :label="$t('Global.institute')" :rules="validation(false, 'textarea')" prop="temp_organization_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.institute')" v-model="ruleForm.temp_organization_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item>

                    <div v-if="temp_organization_name" class="animate left_input" @click="resetUni('temp_organization_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                  </div>
                </CCol>
                <CCol sm="12" lg="8" v-if="show_select == 3">
                  <el-form-item :label="$t('Global.jobName')" :rules="validation(false, 'textarea')" prop="temp_organization_name" class="animate hide_border m-0">
                    <el-input clearable :placeholder="$t('Global.jobName')" v-model="ruleForm.temp_organization_name">
                      <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                    </el-input>
                  </el-form-item>
                </CCol>
                <CCol sm="12" lg="6">
                  <el-form-item :label="$t('Global.experience')" prop="experience" class="custom_area">
                    <el-input autosize resize="none" type="textarea" v-model="ruleForm.experience"></el-input>
                  </el-form-item>
                </CCol>
                <CCol sm="12" lg="6">
                  <el-form-item :label="$t('Global.reviewer_experience')" prop="reviewer_experience" class="custom_area">
                    <el-input autosize resize="none" type="textarea" v-model="ruleForm.reviewer_experience"></el-input>
                  </el-form-item>
                </CCol>
              </CRow>
            </el-form>
          </CCardBody>
          <CCardFooter>
            <div class="baseButton resetButton" style="justify-content: flex-start">
              <button class="mx-1 el-button el-button--default is-round sec_color" @click="updateUser('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
                <i class="el-icon-check-circle"></i><CSpinner v-if="isLoad" color="default" size="sm" />
                <span class="ml-2 mr-2" v-if="$store.state.uploadProgress && $store.state.uploadProgress != 100">{{ $store.state.uploadProgress }}%</span>
                {{ $t('Global.submit') }}
              </button>
              <button v-if="!isLoad" @click="resetForm('ruleForm')" class="el-button--small el-button el-button--default is-round base_color" type="reset" style="padding: 0.6rem 1rem">
                <i class="el-icon-refresh"></i>
                {{ $t('archive.reset') }}
              </button>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import User from '../../api/user';
import FormUpload from '@/views/components/FormUpload';
import upload from '@/views/components/upload';
import Cookies from 'js-cookie';
const user = new User();
export default {
  name: 'edit',
  components: { FormUpload, upload },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value) {
        if (value.search(/[A-Z]/) == -1) {
          callback(new Error('يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)'));
        } else if (value.search(/[@\#\!\_\$\%\^\&\*\(\)\~\*\-\?\>\<\}\{\}]/) == -1) {
          callback(new Error('يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validateConfirmPass = (rule, value, callback) => {
      var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if (value === '' && this.show) {
        callback(new Error('يجب ان تكون كلمة المرور متشابهة'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('يجب ان تكون كلمة المرور متشابهة'));
      } else {
        callback();
      }
      //   else if(!regularExpression.text(value)){
      //      callback(new Error('يجب ان تحتوي كلمة المرور علي رموز'));
      //   }
    };
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        },
      },
      temp_university_degree_name: false,
      temp_organization_degree_name: false,
      temp_university_name: false,
      temp_organization_name: false,
      show_select: 1,
      disabled_org: true,
      dis_org_degree: true,
      isLoad: false,
      qualification_status: true,
      specification_status: true,
      qualification_edu_status: true,
      specification_edu_status: true,
      organization_education_status: true,
      clicked: false,
      loading: true,
      error: false,
      errorCv: false,
      file: [],
      userId: null,
      photo: null,
      userCv: null,
      ruleForm: {
        temp_university_degree_name: null,
        temp_organization_degree_name: null,
        temp_university_name: null,
        temp_organization_name: null,
        ar_name: null,
        education_level_id: null,
        specification_id: null,
        qualification_id: null,
        organization_education_id: null,
        university_education_id: null,
        en_name: null,
        password: null,
        confirm_password: null,
        address: '',
        alt_mobile: null,
        mobile: null,
        birth_government: null,
        national_id: null,
        gender: '1',
        birthdate: null,
        email: null,
        degree_specification_id: null,
        education_degree_id: null,
        organization_degree_id: null,
        university_degree_id: null,
        university: null,
        organization_id: null,
        degree_education_level_id: null,
        degree_qualification_id: null,
        current_job_place: null,
        grade_id: null,
        experience_year: null,
        reviewer_experience_years: null,
        reviewer_experience: null,
        experience: null,
      },
      rules: {
        password: [
          { validator: this.show ? validatePass : false, trigger: 'blur' },
          { required: this.show ? true : false, message: 'من فضلك يجب إدخال  كلمة المرور', trigger: 'blur' },
          { trigger: 'blur' },
          { min: 8, message: 'يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)' },
        ],
        confirm_password: [
          { validator: this.show ? validateConfirmPass : true, trigger: 'blur' },
          { required: this.show ? true : false, message: 'من فضلك يجب إدخال  كلمة المرور', trigger: 'blur' },
        ],
      },
      show: true,
    };
  },
  watch: {
    'ruleForm.ar_name'(value) {
      this.ruleForm.ar_name = value.toString().replace(/[a-zA-Z]/, '');
    },
    'ruleForm.en_name'(value) {
      this.ruleForm.en_name = value.toString().replace(/[أ-ي]/, '');
    },
    'ruleForm.national_id'(value) {
      this.ruleForm.national_id = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.mobile'(value) {
      this.ruleForm.mobile = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.alt_mobile'(value) {
      this.ruleForm.alt_mobile = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.degree_specification_id': function (val) {
      val ? this.$refs.specification.blur() : '';
    },
    'ruleForm.education_degree_id': function (val, newVal) {
      val ? this.$refs.education_degree_id.blur() : '';
      let type = this.$store.getters['user/degrees'].find(type => type.id == val);
      if (type) {
        this.show_select = type.type;
      }
      if (this.show_select == 3) {
        this.ruleForm.temp_university_name = '';
      }
      if (newVal) {
        this.ruleForm.university = null;
        this.ruleForm.temp_university_name = null;
        (this.ruleForm.temp_organization_name = null), (this.ruleForm.organization_id = null);
      }
    },
    // 'ruleForm.temp_organization_degree_name':function (val) {
    //    if (val == 0) {
    //     this.temp_organization_degree_name = true;
    //   } else {
    //     this.temp_organization_degree_name = false;
    //   }
    // },
    'ruleForm.organization_degree_id': function (val) {
      if (val) {
        this.temp_organization_degree_name = false;
        this.ruleForm.temp_organization_degree_name = null;
        this.ruleForm.temp_university_degree_name = null;
      } else {
        if (!val && !this.temp_university_degree_name) {
          if (!this.ruleForm.temp_university_degree_name) {
            let selectedUniversityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(university => university.id == this.ruleForm.university_degree_id) : null;
            this.ruleForm.temp_university_degree_name = selectedUniversityName ? selectedUniversityName.name : null;
          }
        } else if (this.ruleForm.university_degree_id != 0 && this.ruleForm.organization_degree_id != 0) {
          this.ruleForm.temp_university_degree_name = null;
          this.ruleForm.temp_organization_degree_name = null;
        }
        if (val === 0) {
          this.temp_organization_degree_name = true;
        }
      }
      val ? this.$refs.collage.blur() : '';
    },
    'ruleForm.university_degree_id': function (val, newVal) {
      if (newVal) {
        this.ruleForm.organization_degree_id = null;
        this.temp_organization_degree_name = null;
      }
      if (val || val === 0) {
        if (val === 0) {
          this.temp_university_degree_name = true;
          this.$store.commit('organization/SET_ORGANIZATIONS_NAMES_DEGREE', []);
        } else {
          this.$store.dispatch('organization/names', {
            query: {
              parent_id: this.ruleForm.university_degree_id,
            },
            degree: true,
          });
          if (this.temp_organization_degree_name) {
            let selectedUniversityName;
            if (this.show_select == 2) {
              selectedUniversityName = this.$store.getters['directorate/directorates'] ? this.$store.getters['directorate/directorates'].find(university => university.id == this.ruleForm.university) : null;
            } else {
              selectedUniversityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(university => university.id == val) : null;
            }
            this.ruleForm.temp_university_degree_name = selectedUniversityName ? selectedUniversityName.name : null;
          } else if (this.ruleForm.university_degree_id != 0 && this.ruleForm.organization_degree_id != 0) {
            this.ruleForm.temp_university_degree_name = null;
            this.ruleForm.temp_organization_degree_name = null;
          }
          this.temp_university_degree_name = false;
        }
        this.dis_org_degree = false;
      } else {
        this.dis_org_degree = true;
      }

      val ? this.$refs.university_degree_id.blur() : '';
    },
    'ruleForm.degree_education_level_id': function (val, newVal) {
      if (newVal) {
        this.ruleForm.degree_specification_id = null;
        this.ruleForm.degree_qualification_id = null;
      }
      if (val) {
        this.$store.dispatch('user/lookup', { qualification: this.ruleForm.degree_qualification_id, level: val }).then(() => {
          this.qualification_status = false;
        });
        this.$refs.level.blur();
      } else {
        this.qualification_status = true;
      }
    },
    'ruleForm.degree_qualification_id': function (val, newVal) {
      if (newVal) {
        this.ruleForm.degree_specification_id = null;
      }
      if (val) {
        this.$store.dispatch('user/lookup', { qualification: val, level: this.ruleForm.degree_education_level_id }).then(() => {
          this.specification_status = false;
        });
        this.$refs.qualification.blur();
      } else {
        this.specification_status = true;
      }
    },
    'ruleForm.organization_id': function (val) {
      if (val) {
        this.temp_organization_name = false;
        this.ruleForm.temp_university_name = null;
        this.ruleForm.temp_organization_name = null;
      } else {
        if (val === 0) {
          if (this.ruleForm.university != 0) {
            let selectedUniversityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(university => university.id == val) : null;
            this.ruleForm.temp_university_name = selectedUniversityName ? selectedUniversityName.name : null;
          }
        }
        if (val === 0) {
          this.temp_organization_name = true;
        }
      }
    },
    'ruleForm.education_level_id': function (val, newVal) {
      if (newVal) {
        this.ruleForm.specification_id = null;
        this.ruleForm.qualification_id = null;
      }
      if (val) {
        this.$store.dispatch('user/lookup', { edu: true, qualification: this.ruleForm.qualification_id, level: val }).then(() => {
          this.qualification_edu_status = false;
        });
      } else {
        this.qualification_edu_status = true;
      }
    },
    'ruleForm.qualification_id': function (val, newVal) {
      if (newVal) {
        this.ruleForm.specification_id = null;
      }
      if (val) {
        this.$store.dispatch('user/lookup', { edu: true, qualification: val, level: this.ruleForm.education_level_id }).then(() => {
          this.specification_edu_status = false;
        });
      } else {
        this.specification_edu_status = true;
      }
    },
    'ruleForm.university_education_id': function (val, newVal) {
      if (newVal) {
        this.ruleForm.organization_education_id = null;
      }
      if (val || val === 0) {
        if (val === 0) {
          this.$store.commit('organization/SET_EDU_ORGANIZATIONS_NAMES', []);
        } else {
          this.$store.dispatch('organization/names', {
            edu: true,
            query: {
              parent_id: this.ruleForm.university_education_id,
            },
          });
        }
        this.organization_education_status = false;
      } else {
        this.organization_education_status = true;
      }
    },
    'ruleForm.university': function (val, newVal) {
      if (this.show_select == 2) {
        this.$store.dispatch('directorate/institutes', {
          parent_id: val,
        });
      }
      if (newVal) {
        this.ruleForm.organization_id = null;
        this.temp_organization_name = null;
      }
      if (val || val === 0) {
        if (val === 0) {
          this.temp_university_name = true;
          this.$store.commit('organization/SET_ORGANIZATIONS_NAMES', []);
        } else {
          this.$store.dispatch('organization/names', {
            query: {
              parent_id: this.ruleForm.university,
            },
            degree: false,
          });
          if (this.temp_organization_name) {
            let selectedUniversityName;
            if (this.show_select == 2) {
              selectedUniversityName = this.$store.getters['directorate/directorates'] ? this.$store.getters['directorate/directorates'].find(university => university.id == val) : null;
            } else {
              selectedUniversityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(university => university.id == val) : null;
            }
            this.ruleForm.temp_university_name = selectedUniversityName ? selectedUniversityName.name : null;
          }
        }
        this.disabled_org = false;
      } else {
        this.disabled_org = true;
      }
    },
  },
  mounted() {
    this.$store.dispatch('user/lookup');
    this.$store.dispatch('university/universities');
    this.$store.dispatch('directorate/directorates');
    if (this.$route.params.id) {
      this.show = false;
      this.getUserById(val => {
        this.ruleForm.ar_name = val.user.ar_name;
        this.ruleForm.en_name = val.user.en_name;
        this.ruleForm.address = val.user.address;
        this.ruleForm.email = val.user.email;
        this.ruleForm.gender = val.user.gender;
        this.ruleForm.national_id = val.user.n_id;
        this.ruleForm.birthdate = val.user.birthdate;
        this.ruleForm.mobile = val.user.mobile;
        this.ruleForm.photo = val.user.photo;
        this.ruleForm.alt_mobile = val.user.alt_mobile;
        this.ruleForm.degree_specification_id = val.user.degree_qualification_id ? val.user.degree_specification_id : null;
        this.ruleForm.education_degree_id = val.user.education_degree_id;
        this.ruleForm.birth_government = val.user.birth_government;
        this.ruleForm.organization_degree_id = val.user.organization_degree_id;
        this.ruleForm.university_degree_id = val.user.university_degree_id;
        this.ruleForm.university = val.user.work_government;
        this.ruleForm.education_level_id = val.user.education_level_id;
        this.ruleForm.specification_id = val.user.specification_id;
        this.ruleForm.qualification_id = val.user.qualification_id;
        this.ruleForm.organization_education_id = val.user.organization_education_id;
        this.ruleForm.university_education_id = val.user.university_education_id;
        this.ruleForm.organization_id = val.user.organization_id;
        this.ruleForm.degree_education_level_id = val.user.degree_education_level_id;
        this.ruleForm.degree_qualification_id = val.user.degree_qualification_id;
        this.ruleForm.current_job_place = val.user.current_job_place;
        this.ruleForm.experience_year = val.user.experience_year;
        this.ruleForm.reviewer_experience_years = val.user.reviewer_experience_years;
        this.ruleForm.reviewer_experience = val.user.reviewer_experience;
        this.ruleForm.experience = val.user.experience;
        this.ruleForm.temp_organization_degree_name = val.user.temp_organization_degree_name;
        this.ruleForm.temp_university_degree_name = val.user.temp_university_degree_name;
        this.ruleForm.temp_organization_name = val.user.temp_organization_name;
        this.ruleForm.temp_university_name = val.user.temp_university_name;
        this.ruleForm.grade_id = val.user.grade_id;
        this.userId = val.user.userId;
        this.userCv = val.user.userCv;
      }).then(_ => {
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  },
  methods: {
    resetUni(type) {
      if (type == 'temp_university_degree_name') {
        this.temp_university_degree_name = false;
        this.ruleForm.university_degree_id = null;
      } else if (type == 'temp_organization_degree_name') {
        this.temp_organization_degree_name = false;
        this.ruleForm.organization_degree_id = null;
      } else if (type == 'temp_organization_name') {
        this.temp_organization_name = false;
        this.ruleForm.organization_id = null;
      } else if (type == 'temp_university_name') {
        this.temp_university_name = false;
        this.ruleForm.university = null;
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
    Refresh(res) {
      if (this.authUser().id == this.$route.params.id) {
        this.$store.commit('user/SET_PHOTO', res.user.photo);
        this.$store.commit('user/SET_RERENDER', false);
        Cookies.remove('user');
        Cookies.set('user', res.user);
        setTimeout(() => {
          this.$store.commit('user/SET_RERENDER', true);
        }, 100);
      } else {
        this.ruleForm.photo = res.user.photo;
        this.$store.commit('user/SET_RERENDER', false);
        setTimeout(() => {
          this.$store.commit('user/SET_RERENDER', true);
        }, 100);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getUserById(cb) {
      this.loading = true;
      const id = this.$route.params.id;
      return user.get(id).then(response => {
        cb(response);
        this.loading = false;
      });
    },
    upload(file, num) {
      if (file) {
        this.file[num - 1] = file;
      }
    },
    deleteFile(file) {
      this.file = this.file.filter(myfile => file.name != myfile.file.name);
    },
    updateUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.params.id) {
            let formData = new FormData();
            for (const [key, value] of Object.entries(this.ruleForm)) {
              if ((value || value == 0) && key != 'university_degree_id' && key != 'university_education_id' && key != 'university') {
                formData.append(key, value);
              }
            }
            if (this.ruleForm.university) {
              formData.append('work_government', this.ruleForm.university);
            }
            if (this.file.length) {
              this.file.forEach((element, i) => {
                if (element.num == 2) {
                  formData.append('cv', element.file);
                } else {
                  formData.append('file', element.file);
                }
              });
            }

            if (!this.userId) {
              if (!formData.has('file')) {
                this.error = true;
                this.$notify.error({
                  message: `${this.$t('Global.completeFields')}`,
                });
                return false;
              } else {
                this.error = false;
              }
            }

            // if (!this.userCv) {
            //   if (!formData.has('cv')) {
            //     this.errorCv = true;
            //     this.$notify.error({
            //       message: `${this.$t('Global.completeFields')}`,
            //     });
            //     return false;
            //   } else {
            //     this.errorCv = false;
            //   }
            // }

            if (this.clicked) return;
            this.clicked = true;
            this.isLoad = true;
            user
              .update(this.$route.params.id, formData)
              .then(() => {
                this.$notify({
                  type: 'success',
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.isLoad = false;
                this.$router.push({ path: `/users/${this.$route.params.id}` });
              })
              .catch(error => {
                this.isLoad = false;
                this.clicked = false;
              });
          } else {
            let formData = new FormData();
            for (const [key, value] of Object.entries(this.ruleForm)) {
              if ((value || value == 0) && key != 'university_degree_id' && key != 'university') {
                formData.append(key, value);
              }
            }
            if (this.file.length) {
              this.file.forEach((element, i) => {
                if (element.num == 2) {
                  formData.append('cv', element.file);
                } else {
                  formData.append('file', element.file);
                }
              });
            }

            if (!this.userId) {
              if (!formData.has('file')) {
                this.error = true;
                this.$notify.error({
                  message: `${this.$t('Global.completeFields')}`,
                });
                return false;
              } else {
                this.error = false;
              }
            }
            // if (!this.userCv) {
            //   if (!formData.has('cv')) {
            //     this.errorCv = true;
            //     this.$notify.error({
            //       message: `${this.$t('Global.completeFields')}`,
            //     });
            //     return false;
            //   } else {
            //     this.errorCv = false;
            //   }
            // }

            if (this.clicked) return;
            this.clicked = true;
            this.isLoad = true;
            user
              .store(formData)
              .then(response => {
                this.$router.push({ path: `/users/${response.success.id}` });
                this.$notify({
                  type: 'success',
                  message: `${$t('Global.successMessage')}`,
                });
                this.clicked = false;
                this.isLoad = false;
              })
              .catch(error => {
                this.clicked = false;
                this.isLoad = false;
              });
          }
        } else {
          this.$notify.error({
            message: `${this.$t('Global.completeFields')}`,
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.ar .leftToRight {
  .el-input .el-input__suffix {
    left: unset !important;
    right: 20px !important;
  }
  &.left_right .el-form-item__content .el-input input {
    padding-left: 1rem !important;
  }
}
.el-form-item__label {
  margin-bottom: 0;
  padding-bottom: 0 !important;
  font-weight: bold;
  text-align: right !important;
}
.datePicker {
  .el-form-item__label {
    text-align: right;
    display: block;
  }
}
.baseButton {
  display: flex;
}

.sec_color {
  color: #fff;
  background: #2ecc71;
  opacity: 0.9;
}
.el-button.is-round.sec_color:focus,
.el-button.is-round.sec_color:hover,
.el-button.is-round.sec_color:active {
  color: #fff;
  background: #2ecc71;
  border-color: #2ecc71;
  opacity: 1;
}
.el-radio-button__inner {
  border-radius: 4px !important;
  border: 1px solid #dcdfe6 !important;
}
.el-radio-button {
  margin-left: 1rem;
}
.plus_icon_label .left_input {
  top: 49px;
  left: 2px;
}
</style>
