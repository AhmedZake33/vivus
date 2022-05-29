<template>
    <div class="custom_info_alert">
        <CRow class="user_icons animate"
              v-if="!$store.getters['user/userLoad'] && (hasPermission('show_users') || authUser().id == $route.params.id || user)">
            <el-alert effect="dark" class="mb-2 mx-3"
                      v-if="($store.getters['user/isRequired'] && $route.params.id && authUser().id == $route.params.id) || ($store.getters['user/isRequired'] && !$route.params.id)"
                      :title="$t('Global.fillDataTitle')" type="error" show-icon>
                <div class="d-flex">
          <span>
            {{ $t('Global.fillDataMessage') }}
          </span>
                    <router-link class="text-white"
                                 v-if="hasPermission('edit_users') || authUser().id == $route.params.id || user"
                                 :to="{ path: `/users/user/edit/${$route.params.id ? $route.params.id : user.id}`.toString() }">
                        <div style="margin: 0 5px">{{ $t('Global.press', { type: $t('Global.edit') }) }}</div>
                    </router-link>
                </div>
            </el-alert>
            <el-alert effect="dark" class="mb-2 mx-3"
                      v-if="$store.state.user.user.status && $store.state.user.user.status.available === 0"
                      :title="$t('Global.unavailable')" type="error" show-icon>
                <div class="d-flex">
          <span>
            {{ `${$t('Global.excusedNote')} : ${$store.state.user.user.status.note}` }}
            <br/>
            {{ `${$t('Global.from')} : ${toLocalDatetime($store.state.user.user.status.from)} ${$t('Global.to')} : ${toLocalDatetime($store.state.user.user.status.to)}` }}
          </span>
                </div>
            </el-alert>

            <CCol sm="3" v-if="!$route.params.id && !$store.getters['user/isRequired']">
                <el-dropdown class="w-100 custom_drop_menu" trigger="click">
                    <router-link class="text_right" to="">
                        <CWidgetIcon :header="$t('submission.add_request')" :text="$t('submission.add_sub_request')"
                                     color="info" :icon-padding="false">
                            <i class="el-icon-message" style="font-size: 25px"></i>
                        </CWidgetIcon>
                    </router-link>

                    <el-dropdown-menu slot="dropdown" v-if="$store.state.user.allowNewSubmission">
                        <el-dropdown-item
                                v-if="hasPermission('he_request') && ($store.state.user.allowHr || hasPermission('admin_system'))">
                            <router-link class="text-white" :to="{ path: `/higher/submissions/add/1`.toString() }">
                                <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1"
                                           type="primary">
                                    {{ $t('submission.add_request') + '(' + $t('Global.HEstatistc') + ')' }}
                                </el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="$store.state.user.allowTr || hasPermission('admin_system')">
                            <router-link class="text-white" to="/course">
                                <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1"
                                           type="primary">
                                    {{ $t('Global.join_course') }}
                                </el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="false">
                            <router-link v-if="$store.state.user.apply_to_id != 4"
                                         @click.native="applyTo(getTypeOfReq('HIGH_REVIEWER'))" class="text_right"
                                         to="">
                                <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1"
                                           type="primary">
                                    {{ $t('Global.apply_to_reviwer') + ' (' + $t('Global.HEstatistc') + ') ' }}
                                </el-button>
                            </router-link>
                            <el-button v-else round size="mini"
                                       class="w-100 disabled disabled_color position-relative custom_pulse mx-1"
                                       type="primary">
                                {{ $t('Global.apply_to_reviwer_done') + ' (' + $t('Global.HEstatistc') + ') ' }}
                            </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="false">
                            <router-link v-if="$store.state.user.apply_to_id != 1" class="text_right"
                                         @click.native="applyTo(getTypeOfReq('TRAINEE_COORDINATOR'))" to="">
                                <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1"
                                           type="primary">
                                    {{ $t('Global.apply_to_trainer') + ' (' + $t('Global.HEstatistc') + ') ' }}
                                </el-button>
                            </router-link>
                            <el-button v-else round size="mini"
                                       class="w-100 disabled disabled_color position-relative custom_pulse mx-1"
                                       type="primary">
                                {{ $t('Global.apply_to_trainer_done') + ' (' + $t('Global.HEstatistc') + ') ' }}
                            </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item
                                v-if="hasPermission('sc_request') && ($store.state.user.allowPu || hasPermission('admin_system'))">
                            <!--              v-if="$store.getters['user/canMakeRequest'] && $store.state.user.allowPu"-->
                            <router-link class="text-white" :to="{ path: `/school/submissions/add/1`.toString() }">
                                <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1"
                                           type="primary">
                                    {{ $t('submission.add_request') + '(' + $t('Global.SCstatistc') + ')' }}
                                </el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="false">
                            <!-- <router-link v-if="$store.state.user.apply_to_id != 4" @click.native="applyTo(getTypeOfReq('HIGH_REVIEWER'))" class="text_right" to="">
                                                          <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1" type="primary">
                                                            {{ $t('Global.apply_to_reviwer') + ' (' + $t('Global.SCstatistc') + ') ' }}
                                                          </el-button>
                                                        </router-link> -->
                            <el-button round size="mini"
                                       class="w-100 disabled disabled_color position-relative custom_pulse mx-1"
                                       type="primary">
                                {{ $t('Global.apply_to_reviwer') + ' (' + $t('Global.SCstatistc') + ') ' }}
                            </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="false">
                            <!-- <router-link v-if="$store.state.user.apply_to_id != 1" class="text_right" @click.native="applyTo(getTypeOfReq('TRAINEE_COORDINATOR'))" to="">
                                                          <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1" type="primary">
                                                            {{ $t('Global.apply_to_trainer') + ' (' + $t('Global.SCstatistc') + ') ' }}
                                                          </el-button>
                                                        </router-link> -->
                            <el-button round size="mini"
                                       class="w-100 disabled disabled_color position-relative custom_pulse mx-1"
                                       type="primary">
                                {{ $t('Global.apply_to_trainer') + ' (' + $t('Global.SCstatistc') + ') ' }}
                            </el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </CCol>
            <CCol sm="3" v-if="$store.getters['user/submissions'] && !$store.getters['user/isRequired']">
                <el-dropdown class="w-100 custom_drop_menu" trigger="click">
                    <router-link class="text_right" to="">
                        <CWidgetIcon :header="$t('submission.followSubmissions')"
                                     :text="$t('Global.userSubmissionInfo')" color="info" :icon-padding="false">
                            <!--              <el-badge class="submission_count" type="warning" v-if="$store.getters['user/submissions']" :value="$store.getters['user/submissions']">-->
                            <!--                <i class="el-icon-message" style="font-size: 25px"></i>-->
                            <!--              </el-badge>-->
                            <i class="el-icon-message" style="font-size: 25px"></i>
                        </CWidgetIcon>
                    </router-link>
                    <el-dropdown-menu slot="dropdown" v-if="hasPermission('access_he') || hasPermission('access_sc')">
                        <el-dropdown-item v-if="hasPermission('access_he')">
                            <router-link class="text-white"
                                         :to="{ path: `/users/user/submission/${$route.params.id ? $route.params.id : user.id}/1`.toString() }">
                                <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1"
                                           type="primary">
                                    {{ $t('Global.followHigh') }}
                                </el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="hasPermission('access_sc')">
                            <router-link class="text-white"
                                         :to="{ path: `/users/user/submission/${$route.params.id ? $route.params.id : user.id}/2`.toString() }">
                                <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1"
                                           type="primary">
                                    {{ $t('Global.followPre') }}
                                </el-button>
                            </router-link>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </CCol>
            <CCol sm="3" v-if="$store.getters['user/submissions'] && !$store.getters['user/isRequired']">
                <el-dropdown class="w-100 custom_drop_menu" trigger="click">
                    <router-link class="text_right" to="">
                        <CWidgetIcon :header="$t('Global.followCourse')" :text="$t('Global.followCourse')" color="info"
                                     :icon-padding="false">
                            <i class="el-icon-message" style="font-size: 25px"></i>
                        </CWidgetIcon>
                    </router-link>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="hasPermission('access_tr')">
                            <router-link class="text-white"
                                         :to="{ path: `/users/user/reservation/${$route.params.id ? $route.params.id : user.id}/3`.toString() }">
                                <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1"
                                           type="primary">
                                    {{ $t('Global.followCourse') }}
                                </el-button>
                            </router-link>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item v-if="hasPermission('access_sc')">
                          <router-link class="text-white" :to="{ path: `/users/user/submission/${$route.params.id ? $route.params.id : user.id}/2`.toString() }">
                            <el-button round size="mini" class="w-100 position-relative custom_pulse mx-1" type="primary">
                              {{ $t('Global.followPre') }}
                            </el-button>
                          </router-link>
                        </el-dropdown-item> -->
                    </el-dropdown-menu>
                </el-dropdown>
            </CCol>
            <CCol sm="3" v-if="hasPermission('manage_archive') && !$store.getters['user/isRequired']">
                <router-link class="text_right"
                             :to="{ path: `/users/user/archives/${$route.params.id ? $route.params.id : user.id}`.toString() }">
                    <CWidgetIcon :text="$t('manage.archiveInfo')" :header="$t('manage.archive')" color="info"
                                 :icon-padding="false">
                        <i class="el-icon-message" style="font-size: 25px"></i>
                    </CWidgetIcon>
                </router-link>
            </CCol>
            <CCol sm="3"
                  v-if="hasPermission('access_fs') && !$store.getters['user/isRequired'] && (authUser().id == $route.params.id || hasPermission('access_fs'))">
                <router-link class="text_right"
                             :to="{ path: `/finance/users/${$route.params.id ? $route.params.id : user.id}`.toString() }">
                    <CWidgetIcon :text="$t('Global.finance_user')" :header="$t('Global.finance_user')" color="info"
                                 :icon-padding="false">
                        <i class="el-icon-money" style="font-size: 25px"></i>
                    </CWidgetIcon>
                </router-link>
            </CCol>
            <CCol sm="3"
                  v-if="$store.getters['user/task'] && $store.getters['user/task'].reviewer && !$store.getters['user/isRequired'] && (hasPermission('manager_approval') || hasPermission('president_approval'))">
                <router-link class="text_right"
                             :to="{ path: `/users/user/evaluations/${$route.params.id ? $route.params.id : user.id}`.toString() }">
                    <CWidgetIcon :text="$t('Global.userEvaluations')" :header="$t('Global.userEvaluations')"
                                 color="info" :icon-padding="false">
                        <i class="el-icon-message" style="font-size: 25px"></i>
                    </CWidgetIcon>
                </router-link>
            </CCol>
        </CRow>
        <CRow v-if="!$store.getters['user/isRequired']">
            <CCol col="12" lg="12"
                  v-if="$store.getters['user/task'] && (hasPermission('show_users') || authUser().id == $route.params.id || user)">
                <CCard>
                    <CCardBody>
                        <el-tabs type="card" class="right" dir="rtl" tab-position="top" stretch @tab-click="getTask">
                            <el-tab-pane lazy v-if="option && $store.getters['user/task'].manager">
                                <span slot="label"><i class="el-icon-s-management"></i> {{ $t('Global.managementTask') }}</span>
                                <Tasks :type="Number(4)"></Tasks>
                            </el-tab-pane>
                            <el-tab-pane lazy v-if="option && $store.getters['user/task'].committee">
                                <span slot="label"><i class="el-icon-user"></i> {{ $t('Global.committeeTask') }}</span>
                                <Tasks :type="Number(3)"></Tasks>
                            </el-tab-pane>
                            <el-tab-pane lazy v-if="option && $store.getters['user/task'].reviewer">
                                <span slot="label"><i class="el-icon-view"></i> {{ $t('Global.auditTask') }}</span>
                                <Tasks :type="Number(2)"></Tasks>
                            </el-tab-pane>
                            <el-tab-pane lazy v-if="option && $store.getters['user/task'].isRepresentative">
                                <span slot="label"><i class="el-icon-office-building"></i> {{ $t('Global.organizationTask') }}</span>
                                <Tasks :type="Number(1)"></Tasks>
                            </el-tab-pane>
                            <el-tab-pane lazy v-if="option && $store.getters['user/task'].trainee">
                                <span slot="label"><i class="el-icon-office-building"></i> {{ $t('Global.traineeTask') }}</span>
                                <Tasks :type="Number(5)"></Tasks>
                            </el-tab-pane>
                            <el-tab-pane lazy v-if="option && $store.getters['user/task'].trainer">
                                <span slot="label"><i class="el-icon-office-building"></i> {{ $t('Global.coachTask') }}</span>
                                <Tasks :type="Number(6)"></Tasks>
                            </el-tab-pane>
                        </el-tabs>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        <Activity
                v-if="!$store.getters['user/isRequired'] && $route.params.id && (hasPermission('admin_system') || hasPermission('president_approval') || authUser().id == $route.params.id || user)"
                :user_id="Number($route.params.id)"></Activity>
        <CRow v-if="$route.params.id">
            <CCol col="12" lg="12" sm="12">
                <Show big_th :loading="$store.getters['user/userLoad']" icon="el-icon-user" profile
                      :items="$store.getters['user/user']" @init="init" :name="$store.getters['user/name']"
                      :status="$store.getters['user/status']" except="teams">
                    <template #custom_show>
            <span v-for="user in $store.getters['user/user']">
              <span v-show="user.key === 'teams'">
                <span v-for="team in user.value" style="margin: 5px" @click="show(team, hasPermission('all_submissions'))">
                  <router-link v-if="team" to="" > {{ team.name }} ( {{ team.job }} ) </router-link>
                  <br/>
                </span>
              </span>
            </span>
                    </template>

                    <template #custom_avatar>
                        <div style="position: relative">
                            <el-avatar :src="$store.state.user.photo || '/img/avatars/avatardf.png'"
                                       class="custom_avatar" :size="60"
                                       icon="el-icon-user-solid custom_avatar_icon"></el-avatar>
                            <upload profilePic v-if="authUser().id == $route.params.id" archive oneFile
                                    @success="Refresh" :url="`user/photo/${authUser().id}`">
                                <template #upload-content>
                                    <el-button size="small" class="edit_photo" icon="el-icon-edit" circle></el-button>
                                </template>
                            </upload>
                        </div>
                    </template>
                    <template #show_action>
                        <el-tooltip effect="dark" :content="$t('Global.userStatus')" placement="top-start"
                                    v-if="hasPermission('admin_users') || hasPermission('show_users')">
                            <i class="el-icon-s-release mx-2"
                               style="font-weight: bold; font-size: medium; cursor: pointer"
                               @click="openExcusedDialog"></i>
                        </el-tooltip>
                        <template
                                v-if="hasPermission('admin_users') && $store.getters['user/status'] !== 0 && !$store.getters['user/userLoad']">
                            <el-button icon="el-icon-check" v-if="ifEmail" @click="approve($route.params.id)" round
                                       size="mini" class="mx-1 right_icon" type="success"> {{ $t('Global.acceptUser') }}
                            </el-button>
                            <template v-else>
                                <span class="red font-weight-bolder">{{ $t('Global.EmailNotFound') }}</span>
                                <el-button icon="el-icon-check" round size="mini" class="disabledAll mx-1 right_icon"
                                           type="success"> {{ $t('Global.acceptUser') }}
                                </el-button>
                            </template>
                        </template>
                        <el-tooltip effect="dark" :content="$t('Global.membersGovernment')"
                                    v-if="hasPermission('admin_users') || hasPermission('manager_approval')"
                                    placement="top-start">
              <span class="pointer" @click="openDialog()">
                <fa-icon :icon="['fas', 'building']"/>
              </span>
                        </el-tooltip>
                        <router-link class="mx-2" v-if="hasPermission('admin_users')"
                                     :to="{ path: `/management/ticket/add/${$route.params.id}`.toString() }">
                            <fa-icon :icon="['fas', 'question-circle']"/>
                        </router-link>
                        <router-link :to="`/management/logs/${$route.params.id}/1`" v-if="hasPermission('admin_users')">
                            <fa-icon :icon="['fas', 'bug']"/>
                        </router-link>
                        <router-link class="mx-2"
                                     v-if="hasPermission('edit_users') || (authUser().id == $route.params.id && !hasPermission('unedit_users'))"
                                     :to="{ path: `/users/user/edit/${$route.params.id}`.toString() }">
                            <fa-icon :icon="['fas', 'edit']"/>
                        </router-link>
                        <router-link v-if="hasPermission('edit_roles')"
                                     :to="{ path: `/users/user/roles/${$route.params.id}`.toString() }">
                            <fa-icon :icon="['fas', 'lock']"/>
                        </router-link>
                        <el-tooltip effect="dark" :content="$t('archive.reset')" v-if="hasPermission('admin_users')"
                                    placement="top-start">
                            <i class="el-icon-refresh mx-2"
                               style="font-weight: bold; font-size: medium; cursor: pointer" @click="reset"></i>
                        </el-tooltip>
                    </template>
                    <template #bottom_other_data>
                        <tr>
                            <th scope="row" width="20%">{{ $t(`Global.userAge`) }}</th>
                            <td width="80%">
                                <span v-if="$store.state.user.user && $store.state.user.user.birthdate">{{ getAge($store.state.user.user.birthdate) }}</span>
                            </td>
                        </tr>
                        <tr v-for="(item, key) in $store.getters['user/details']"
                            v-if="item.key !== 'grade' && item.key !== 'current_job'">
                            <th scope="row" width="20%">{{ $t(`Global.${item.key}`) }}</th>
                            <td width="80%">{{ item.value }}</td>
                        </tr>

                        <tr v-if="hasPermission('show_users') || authUser().id == $route.params.id">
                            <th scope="row" width="20%">{{ $t(`Global.userId`) }}</th>
                            <td width="80%">
                                <a v-if="$store.state.user.userId" download target="_blank"
                                   :href="$store.state.user.userId">
                                    <span>{{ $t(`Global.download`) }} </span></a
                                >
                            </td>
                        </tr>
                        <tr v-if="hasPermission('show_users') || authUser().id == $route.params.id">
                            <th scope="row" width="20%">{{ $t(`Global.userCv`) }}</th>
                            <td width="80%">
                                <a v-if="$store.state.user.userCv" download target="_blank"
                                   :href="$store.state.user.userCv">
                                    <span>{{ $t(`Global.download`) }} </span></a
                                >
                            </td>
                        </tr>
                    </template>
                </Show>
            </CCol>
            <!--            <CCol col="12" lg="12" sm="12">-->
            <!--                <Show :loading="$store.getters['user/userLoad']" icon="el-icon-user"-->
            <!--                      :items="$store.getters['user/details']" :name="$t('Global.userInfo')"-->
            <!--                      :status="$store.getters['user/status']"-->
            <!--                      v-if="hasPermission('show_users') || Auth.id == $route.params.id">-->
            <!--                    <template #show_action>-->
            <!--                        <router-link v-if="hasPermission('edit_users') || Auth.id == $route.params.id"-->
            <!--                                     :to="{ path: `/users/user/edit/${$route.params.id}`.toString() }">-->
            <!--                            <CIcon name="cil-pencil" color="bg-primary"></CIcon>-->
            <!--                        </router-link>-->
            <!--                    </template>-->
            <!--                </Show>-->
            <!--            </CCol>-->
        </CRow>
        <el-dialog :title="$t('Global.membersGovernment')" :visible.sync="governmentDialog" width="80%">
            <div>
                <CCardBody :class="isLoad ? 'disabledAll' : ''" class="pb-0">
                    <CRow>
                        <el-form @submit.native.prevent label-position="top" :model="ruleForm" status-icon size="large"
                                 ref="ruleForm" label-width="120px" class="demo-ruleForm">
                            <el-form-item class="d-flex_item"
                                          :rules="validation(`${$t('Global.myGovernmentError')}`, 1)"
                                          prop="government_id">
                                <div v-for="(item, id) in $store.getters['directorate/directorates']">
                                    <el-checkbox-group v-model="ruleForm.government_id" style="text-align: initial">
                                        <el-checkbox-button class="roundedCheck" :label="item.id" :key="item.id"
                                                            style="width: 100%">{{ item.name }}
                                        </el-checkbox-button>
                                    </el-checkbox-group>
                                </div>
                            </el-form-item>
                        </el-form>
                    </CRow>
                </CCardBody>
                <CCardFooter :class="isLoad ? 'disabledAll' : ''" class="pt-3 border-top">
                    <div class="baseButton resetButton" style="justify-content: flex-start">
                        <button class="el-button el-button--default is-round sec_color mx-1"
                                @click="saveMyGovernment('ruleForm')" style="padding: 0.6rem 1rem">
                            <i class="el-icon-check-circle"></i>
                            <CSpinner v-if="isLoad" color="default" size="sm"/>
                            {{ $t('Global.submit') }}
                        </button>
                    </div>
                </CCardFooter>
            </div>
        </el-dialog>

        <el-dialog :title="$t('Global.userStatus')" :visible.sync="excusedDialog" width="300">
            <el-form label-position="top" :model="form" status-icon size="large" ref="form" label-width="120px"
                     class="d-flex flex-column demo-ruleForm">
                <div class="mt-2 el-form-item__label">
                    <el-radio-group size="mini" v-model="form.available">
                        <el-radio border :label="1">{{ $t('Global.available') }}</el-radio>
                        <el-radio border :label="0" class="mx-1">{{ $t('Global.unavailable') }}</el-radio>
                    </el-radio-group>
                </div>
                <div :class="form.available == 1 ? 'disabledAll' : ''">
                    <el-form-item class="mb-3 w-100"
                                  :rules="form.available == 1 ? { rule: false } : validation(false, 'textarea')"
                                  prop="note" :label="$t('Global.excusedNote')">
                        <el-input autosize resize="none" class="" type="textarea"
                                  :placeholder="$t('Global.excusedNote')" v-model="form.note"></el-input>
                    </el-form-item>
                    <el-form-item :rules="form.available == 1 ? { rule: false } : validation()"
                                  :label="$t('Global.from')" prop="from">
                        <el-date-picker :picker-options="pickerOptions" @focus="changePicker"
                                        @change="onFromPickValidation" format="yy-MM-d" value-format="yyyy-MM-d"
                                        clearable style="width: 100%" v-model="form.from" type="date"
                                        :placeholder="$t('Global.from')"></el-date-picker>
                    </el-form-item>
                    <el-form-item :rules="form.available == 1 ? { rule: false } : validation()" :label="$t('Global.to')"
                                  prop="to">
                        <el-date-picker :picker-options="pickerOptionsTo" @change="onPickValidation"
                                        @focus="changePicker" format="yy-MM-d" value-format="yyyy-MM-d" clearable
                                        style="width: 100%" v-model="form.to" type="date"
                                        :placeholder="$t('Global.to')"></el-date-picker>
                    </el-form-item>
                </div>
            </el-form>

            <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
        <el-button @click="excused('form')" round size="mini" class="mx-1 right_icon" type="primary">{{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="excusedDialog = false" round
                   size="small">{{ $t('Global.discard') }}</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import upload from '@/views/components/upload';
    import Tasks from '../components/Tasks';
    import Show from '../components/Show';
    import Activity from './profile/activity';
    import Cookies from 'js-cookie';

    export default {
        name: 'user',
        components: {Show, Tasks, upload, Activity},
        props: {user: Object},
        data() {
            return {
                showTasks: false,
                approveNum: 1,
                isLoad: false,
                excusedDialog: false,
                readOnlyOption: process.env.APP_VUE_READONLY,
                governmentDialog: false,
                ruleForm: {
                    government_id: [],
                },
                form: {
                    available: 1,
                    note: null,
                    from: null,
                    to: null,
                },
                option: true,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                },
                pickerOptionsTo: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                },
            };
        },
        watch: {
            $route(to, from) {
                this.init();
            },
        },
        mounted() {
            this.$store.dispatch('directorate/directorates');
            if (this.user) {
                this.$store.dispatch('user/user', this.user.id);
            }
        },
        destroyed() {
            this.$store.commit('SET_PATH_TITLE', null);
        },
        methods: {
            resetStatus() {
                this.form.available = 1;
                this.form.note = null;
                this.form.from = null;
                this.form.to = null;
            },
            getAge(birthday) {
                var birthDate = new Date(birthday);
                var ageDifMs = Date.now() - birthDate.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                return Math.abs(ageDate.getUTCFullYear() - 1970);
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
            onFromPickValidation(pick) {
                if (this.form.to) {
                    var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
                    var toDate = new Date(Date.parse(this.form.to.replace(/-/g, ' ')));
                    if (pickedDate > toDate) {
                        this.$notify.error({message: `${this.$t('Validation.pickerTo')}`});
                        this.form.from = null;
                    }
                }
            },
            onPickValidation(pick) {
                var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
                var todaysDate = new Date(Date.parse(this.form.from.replace(/-/g, ' ')));
                if (pickedDate < todaysDate) {
                    this.$notify.error({message: `${this.$t('Validation.pickerTo')}`});
                    this.form.to = null;
                }
            },
            openDialog() {
                this.governmentDialog = true;
            },
            openExcusedDialog() {
                this.excusedDialog = true;
                if (this.$store.state.user.user && this.$store.state.user.user.status) {
                    this.form.available = this.$store.state.user.user.status.available;
                    this.form.note = this.$store.state.user.user.status.note;
                    this.form.from = this.$store.state.user.user.status.from;
                    this.form.to = this.$store.state.user.user.status.to;
                }
            },
            show(team, status) {
                if (status) {
                    if (team.system == 2) {
                        this.$router.push(`/school/team/${team.id}`);
                    } else {
                        this.$router.push(`/higher/team/${team.id}`);
                    }
                }
            },
            excused(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.isLoad = true;
                        var query = {
                            available: this.form.available,
                            note: this.form.note,
                            from: this.form.from,
                            to: this.form.to
                        };
                        this.$store
                            .dispatch('user/excused', {
                                query,
                                id: this.$route.params.id,
                            })
                            .then(_ => {
                                this.isLoad = false;
                                this.excusedDialog = false;
                                this.init();
                                this.$notify({type: 'success', message: this.$t('Global.successMessage')});
                            })
                            .catch(_ => {
                                this.isLoad = false;
                            });
                    }
                });
            },
            saveMyGovernment(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.isLoad = true;
                        var query = {directorate_ids: this.ruleForm.government_id};
                        this.$store
                            .dispatch('directorate/getMyGovernment', {
                                query,
                                id: this.$route.params.id,
                            })
                            .then(_ => {
                                this.isLoad = false;
                                this.$notify({type: 'success', message: this.$t('Global.successMessage')});
                            })
                            .catch(_ => {
                                this.isLoad = false;
                            });
                    }
                });
            },
            Refresh(res) {
                this.$store.commit('user/SET_PHOTO', res.user.photo);
                this.$store.commit('user/SET_RERENDER', false);
                Cookies.remove('user');
                Cookies.set('user', res.user);
                setTimeout(() => {
                    this.$store.commit('user/SET_RERENDER', true);
                }, 100);
            },
            applyTo(type) {
                let query = {apply_to: type};
                this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
                    confirmButtonText: 'موافقة',
                    cancelButtonText: 'الغاء',
                    type: 'success',
                }).then(_ => {
                    this.$store.dispatch('user/applyTo', {query, id: this.authUser().id}).then(() => {
                        this.$store.dispatch('user/user', this.authUser().id);
                    });
                });
            },
            init(id = this.$route.params.id) {
                this.isLoad = true;
                id = this.$route.params.id ? this.$route.params.id : this.user.id;
                this.$store.dispatch('user/user', id).then(_ => {
                    this.ruleForm.government_id = this.$store.state.user.user.directorate_ids || [];
                    this.$store.commit('SET_PATH_TITLE', this.$store.getters['user/name']);
                    this.isLoad = false;
                });
            },
            getTask(tab, e) {
                this.option = false;
                this.$nextTick(function () {
                    this.option = true;
                });
            },
            reset() {
                this.$confirm(this.$t('Global.RestoreMessage'), `${this.$t('Global.warning')}`, {
                    confirmButtonText: `${this.$t('Global.accept')}`,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    type: 'warning',
                }).then(() => {
                    this.$store.dispatch('user/resetUser', this.$route.params.id).then(() => {
                        this.$message({message: this.$t('Global.successMessage'), type: 'success'});
                    });
                });
            },
            approve(id) {
                this.$store.dispatch('user/approve', id).then(() => {
                    this.$notify({
                        type: 'success',
                        message: this.$t('Global.approveMessage'),
                    });
                    this.init();
                });
            },
        },
        computed: {
            ifEmail: function () {
                if (this.$store.state.user.user) return this.$store.state.user.user.email;
            },
        },
    };
</script>

<style lang="scss">
    .d-flex_item {
        .el-form-item__content {
            display: flex;
            gap: 2px;
            flex-wrap: wrap;
        }
    }

    .roundedCheck {
        .el-checkbox-button__inner {
            border-radius: 30px !important;
        }
    }

    .el-dropdown-menu__item:focus,
    .el-dropdown-menu__item:not(.is-disabled):hover {
        background-color: #fff !important;
        color: unset;
    }

    .el-popper {
        margin: 0 !important;
        border: 0;
    }

    .text_right {
        .small {
            text-align: right;
        }

        .card {
            margin: 0 !important;
            margin-bottom: 0.5rem !important;
        }
    }

    .disabled {
        .card {
            opacity: 0.9;
            background-color: #ddd;

            .text-info {
                color: #555 !important;
            }

            .bg-info {
                background-color: #555 !important;
            }
        }
    }

    .startNow {
        transform: translateY(-4.7rem);
        position: relative;
        margin-left: 2rem;
        z-index: 9999;
    }

    .task {
        border: 1px solid #eee !important;
        padding: 4px !important;
        text-align: center !important;
        border-radius: 9px !important;
        background-color: #eee !important;
    }

    .user_icons {
        .statistcColor .text-warning {
            color: #27ae60 !important;
        }

        .bg-info,
        .bg-danger,
        .bg-warning,
        .bg-primary,
        .bg-success,
        .bg-dark,
        .bg-light,
        .bg-secondary {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            // padding: 0.5rem !important;
        }
    }

    .ar .user_icons {
        .bg-info,
        .bg-danger,
        .bg-warning,
        .bg-success,
        .bg-primary,
        .bg-dark,
        .bg-light,
        .bg-secondary {
            margin-right: 0 !important;
            margin-left: 0.3rem !important;
            border-top-left-radius: unset;
            border-bottom-left-radius: unset;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }

        .text-value {
            text-align: initial;
        }
    }

    .submission_count {
        .el-badge__content.is-fixed {
            top: 11px;
            right: 14px;
        }
    }

    .el-rate__text {
        margin-right: 0.8rem;
    }

    .custom_avatar {
        img {
            width: 100%;
        }
    }

    .custom_avatar_icon {
        line-height: 2;
        font-size: 4rem;
    }

    .in_same_line {
        display: flex;
        align-items: center;
    }

    .edit_photo {
        padding: 0.2rem !important;
        font-size: 12px;
        position: absolute;
        top: 4px;
        left: -4px;
        opacity: 0.7;

        &:hover {
            opacity: 1;
            background-color: #fff;
            border-color: #eee;

            i {
                background-color: #fff;
                color: #000;
            }
        }

        &:focus {
            opacity: 1;
            background-color: #fff;
            border-color: #eee;

            i {
                background-color: #fff;
                color: #000;
            }
        }
    }
</style>
