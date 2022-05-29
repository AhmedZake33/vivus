<template>
    <div v-if="hasPermission('access_teams')" id="print">
        <el-alert  v-if="hasPermission('edit_hotels')" effect="dark" class="mb-2 animate" :title="$t('Global.SystemManagement')" type="warning" show-icon>
            <div class="d-flex">
                <template>
                  <p v-if="hasPermission('reservation_approval') && $store.state.team.status">تم تأكيد الفريق من الاعضاءو الهيئة برجاء تأكيد الحجز   </p>
                  <p v-else>برجاء التاكد من الفريق قبل الحجز والتعديل على الحجز  </p>
                </template>
            </div>
        </el-alert>
        <Show :loading="$store.getters['team/teamLoad']" icon="el-icon-user" :items="$store.getters['team/team']"
              @init="init" :name="$store.getters['team/name']" v-has-permissions="'show_teams'">
            <template #show_action>
                <a class="mx-1" :href="`${baseUrl}team/document/${$route.params.id}`" target="_blank">
                    <fa-icon :icon="['fas', 'file-pdf']" size="md"/>
                </a>
                <i class="el-icon-printer mr-2 pointer print_hide" style="font-size: 17px"
                   @click="print('print', $store.getters['team/name'])"></i>
                <router-link class="print_hide mr-2" v-if="hasPermission('admin_teams')"
                             :to="{ path: `/school/team/edit/${$route.params.id}`.toString() }">
                    <CIcon name="cil-pencil" color="bg-primary"></CIcon>
                </router-link>
                <el-button v-if="hasPermission('edit_hotels')"
                           @click="openReservationDialog($store.state.team.reservation)" round size="mini"
                           class="mx-1 p-2 right_icon" style="font-size: 13px" type="primary">
                    <i class="el-icon-circle-plus"></i>
                    {{ $store.state.team.reservation ? $t('Global.edit_reservation') : $t('Global.add_reservation') }}
                </el-button>
                <el-button v-if="hasPermission('reservation_approval') && $store.state.team.status"
                           @click="approve($store.state.team.submission)" round size="mini" class="mx-1 p-2 right_icon"
                           style="font-size: 13px" type="success">
                    <i class="el-icon-circle-check" style="font-weight: bold"></i>
                    {{ $store.state.team.reservation ? $t('Global.done_reservation') : $t('Global.without_reservation')
                    }}
                </el-button>
            </template>
            <template #bottom_other_data>
                <tr v-if="$store.state.team.team">
                    <th scope="row" width="20%">{{ $t('Global.team') }}</th>
                    <td width="80%">
            <span v-if="member" v-for="member in $store.state.team.team.all_members" style="margin: 5px">
              <router-link :to="{ path: `/users/${member.user_id}` }"
                           v-if="$store.getters['evaluation/evaluator'] !== evConstants('TEAM_TYPE')">
                <template v-if="isMember && member.team_job != 6">
                  {{ member.ar_name }} ({{ member.job }})
                  <CBadge color="warning" v-if="member.excused === 1">{{ $t('Global.excused') }}</CBadge>
                  <CBadge color="info" v-if="member.excused === 0">{{ $t('Global.exist') }}</CBadge>
                </template>
                <template v-else-if="!isMember">
                  {{ member.ar_name }} ({{ member.job }})
                  <CBadge color="warning" v-if="member.excused === 1">{{ $t('Global.excused') }}</CBadge>
                  <CBadge color="info" v-if="member.excused === 0">{{ $t('Global.exist') }}</CBadge>
                  <CBadge color="warning" v-if="member.excused === 2">{{$t('Global.sub_excused')}}</CBadge>
                </template>
              </router-link>
              <router-link :to="{ path: `/users/${member.user_id}` }"
                           v-else-if="$store.getters['evaluation/evaluator'] == evConstants('TEAM_TYPE') && member.team_job != constants('COMMITTEE')">
                {{ member.ar_name }} ({{ member.job }})
                <CBadge color="warning" v-if="member.excused === 1">{{ $t('Global.excused') }}</CBadge>
                <CBadge color="info" v-if="member.excused === 0">{{ $t('Global.exist') }}</CBadge>
              </router-link>
              <br/>
            </span>
                    </td>
                </tr>
                <tr v-if="$store.getters['team/reservation'] && $store.state.team.reservation">
                    <th scope="row" width="20%">{{ $t('Global.hotel') }}</th>
                    <td width="80%" v-if="$store.state.team.reservation.hotel">
                        <div class="mb-2" style="cursor: pointer"
                             @click="$router.push(`/higher/hotel/${$store.getters['team/reservation'].hotel.id}`)">
                            <span>{{ $t('Global.name') + ': ' }} </span>
                            <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.team.reservation.hotel.name || ' - ' }}),</span>
                            <span>{{ $t('Global.manager') + ': ' }} </span>
                            <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.team.reservation.hotel.contact || ' - ' }}),</span>
                            <span>{{ $t('Global.phone') + ': ' }} </span>
                            <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.team.reservation.hotel.phone || ' - ' }}),</span>
                            <span>{{ $t('Global.email') + ': ' }} </span>
                            <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.team.reservation.hotel.email || ' - ' }}),</span>
                            <span>{{ $t('Global.city') + ': ' }} </span>
                            <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.team.reservation.hotel.city ? $store.state.team.reservation.hotel.city.name : ' - ' }}),</span>
                            <span>{{ $t('Global.government') + ': ' }} </span>
                            <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.team.reservation.hotel.government ? $store.state.team.reservation.hotel.government.name : ' - ' }}),</span>
                        </div>
                    </td>
                </tr>
                <tr v-if="$store.getters['team/reservation'] && $store.state.team.reservation">
                    <th scope="row" width="20%">{{ $t('Global.topic') }}</th>
                    <td width="80%" v-if="$store.state.team.reservation">
                        <div v-html="ntBr($store.state.team.reservation.topic)"></div>
                    </td>
                </tr>
            </template>
        </Show>
        <Show v-if="$store.getters['team/submission']" :loading="$store.getters['team/teamLoad']" icon="el-icon-user"
              :items="$store.getters['team/submission']" :name="$t('Global.order')">
            <template #show_status>
                <router-link v-if="$store.state.team.submission"
                             :to="hasPermission('access_organizations') ? { path: $store.state.team.submission.organization_id ? `/school/organization/${$store.state.team.submission.organization_id}` : '' } : ''">
                    {{ $store.state.team.submission.name ? $store.state.team.submission.name :
                    $store.state.team.submission.temp_organization_name ?
                    $store.state.team.submission.temp_organization_name : '' }}
                </router-link>
            </template>
            <template #other_data>
                <tr v-if="$store.getters['team/submission']">
                    <th scope="row" width="20%">{{ $t('Global.organization') }}</th>
                    <td width="80%">
                        <router-link v-if="$store.state.team.submission"
                                     :to="hasPermission('access_organizations') ? { path: $store.state.team.submission.organization_id ? `/school/organization/${$store.state.team.submission.organization_id}` : '' } : ''">
                            {{ $store.state.team.submission.name ? $store.state.team.submission.name :
                            $store.state.team.submission.temp_organization_name ?
                            $store.state.team.submission.temp_organization_name : '' }}
                        </router-link>
                    </td>
                </tr>
            </template>
            <template #bottom_other_data>
                <tr>
                    <th scope="row" width="20%">{{ $t('Global.representative') }}</th>
                    <td width="80%" v-if="$store.getters['team/representative']">
                        <router-link class="custom-link"
                                     :to="{ path: `/users/${$store.getters['team/representative'].id}` }">
                            {{ $store.getters['team/representative'].ar_name }}
                        </router-link>
                    </td>
                </tr>
            </template>
        </Show>
        <CCard v-loading="$store.getters['team/teamLoad']"
               v-if="$store.getters['team/reservation']">
            <CCardHeader>
                <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''"
                     style="display: inline-block; font-weight: bold">
                    {{ $t('Global.reservation_members') }}
                </div>
                <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''"
                     style="display: flex; justify-content: flex-end; align-items: center">
                    <el-button v-if="hasPermission('edit_teams')" @click="openAddServiceDialog" round size="mini"
                               class="mx-1 p-2 right_icon" style="font-size: 13px" type="primary">
                        <i class="el-icon-circle-plus"></i>
                        {{ $t('Global.addService') }}
                    </el-button>
                </div>
            </CCardHeader>
            <CCardBody>
                <el-table
                        v-if=" $store.getters['team/reservation'] && $store.getters['team/reservation'].services"
                        :data="servicesData"
                        style="width: 100%"
                        :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                        :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                >
                    <el-table-column prop="user_name" :label="$t('Global.name')">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="scope.row.user_name" placement="top-start">
                                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                                    <router-link :to="{ path: `/users/${scope.row.user_id}` }">{{ scope.row.user_name
                                        }}
                                    </router-link>
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="room_count" :label="$t('Global.roomCount')"></el-table-column>
                    <el-table-column prop="service" :label="$t('Global.roomType')"></el-table-column>
                    <el-table-column prop="starts" :label="$t('Global.arrivalDate')">
                        <template slot-scope="scope">
                            <span>{{ toLocalDatetime(scope.row.starts, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ends" :label="$t('Global.departureDate')">
                        <template slot-scope="scope">
                            <span>{{ toLocalDatetime(scope.row.ends, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stay_type" :label="$t('Global.stayType')">
                        <template slot-scope="scope">
                            {{ scope.row.stay_type ? $t(`Global.stayType${scope.row.stay_type}`) : '_' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="national_id" v-if="hasPermission('edit_teams')" :label="$t('Global.n_id')"></el-table-column>
                    <el-table-column prop="" label=" " v-if="hasPermission('reservation_approval')">
                        <template slot-scope="scope">
                            <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                                <i class="el-icon-delete table-action-item" @click="deleteService(scope.row.id)"></i>
                                <i class="el-icon-edit table-action-item" @click="openServiceDialog(scope.row)"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-else class="d-flex justify-content-center">{{ $t('Global.nodata') }}</div>
            </CCardBody>
        </CCard>
        <el-dialog :title="$t('route.services')" :visible.sync="add_service_dialog" class="p-0" width="60%"
                   v-if="$store.state.team.team">
            <CCardBody dir="rtl" style="text-align: initial" class="p-0">
                <el-form label-position="top" :model="addForm" status-icon size="large" ref="ruleForm"
                         label-width="120px" class="demo-ruleForm">
                    <CRow>
                        <CCol sm="12">
                            <el-form-item :rules="validation(null, 1)" prop="users" :label="$t('Global.members')">
                                <el-select filterable multiple style="width: 100%" v-model="addForm.users"
                                           :placeholder="$t('Global.members')">
                                    <el-option v-if="$store.state.team.team"
                                               v-for="member in members"
                                               :key="member.user_id" :label="member.ar_name" :value="member.user_id">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ member.ar_name }}
                    </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="4">
                            <el-form-item :rules="validation(null, 1)" :label="$t('Global.roomCount')"
                                          prop="room_count">
                                <el-select filterable style="width: 100%" v-model="addForm.room_count"
                                           :placeholder="$t('Global.roomCount')">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item }}
                    </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="4">
                            <el-form-item :rules="validation(null, 1)" :label="$t('Global.roomType')"
                                          prop="service_type">
                                <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%"
                                           v-model="addForm.service_type" :placeholder="$t('Global.roomType')">
                                    <el-option v-for="item in $store.getters['team/services']" :key="item.id"
                                               :label="item.name" :value="item.id">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item.name }}
                    </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="4">
                            <el-form-item :rules="validation(null, 1)" :label="$t('Global.stayType')" prop="stay_type">
                                <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%"
                                           v-model="addForm.stay_type" :placeholder="$t('Global.stayType')">
                                    <el-option v-for="item in 4" :key="item" :label="$t(`Global.stayType${item}`)"
                                               :value="item">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ $t(`Global.stayType${item}`) }}
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
                        <CCol sm="6">
                            <el-form-item :rules="validation(null, 0)" :label="$t('Global.arrivalDate')" prop="starts">
                                <el-date-picker @change="onFromPickValidation" clearable style="width: 100%"
                                                value-format="yyyy-MM-d" v-model="addForm.starts" type="date"
                                                :placeholder="$t('Global.arrivalDate')"></el-date-picker>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6">
                            <el-form-item :rules="validation(null, 0)" :label="$t('Global.departureDate')" prop="ends">
                                <el-date-picker @change="onPickValidation" clearable style="width: 100%"
                                                value-format="yyyy-MM-d" v-model="addForm.ends" type="date"
                                                :placeholder="$t('Global.departureDate')"></el-date-picker>
                            </el-form-item>
                        </CCol>
                    </CRow>
                </el-form>
            </CCardBody>
            <span slot="footer" class="dialog-footer" :class="load ? 'disabledAll' : ''">
        <el-button @click="addService('ruleForm')" @keyup.enter="addService('ruleForm')" type="primary">{{ $t('Global.add') }}</el-button>
        <el-button @click="add_service_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
        </el-dialog>
        <el-dialog :title="$t('route.services')" :visible.sync="service_dialog" class="p-0" width="60%"
                   v-if="$store.state.team.team">
            <CCardBody dir="rtl" style="text-align: initial" class="p-0">
                <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm"
                         label-width="120px" class="demo-ruleForm">
                    <CRow>
                        <CCol sm="12">
                            <el-form-item :rules="validation(null, 1)" prop="employee" :label="$t('Global.member')">
                                <el-select filterable style="width: 100%" v-model="ruleForm.employee"
                                           :placeholder="$t('Global.member')">
                                    <el-option v-if="$store.state.team.team"
                                               v-for="member in members"
                                               :key="member.user_id" :label="member.ar_name" :value="member.user_id">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ member.ar_name }}
                    </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="4">
                            <el-form-item :rules="validation(null, 1)" :label="$t('Global.roomCount')"
                                          prop="room_count">
                                <el-select filterable style="width: 100%" v-model="ruleForm.room_count"
                                           :placeholder="$t('Global.roomCount')">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item }}
                    </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="4">
                            <el-form-item :rules="validation(null, 1)" :label="$t('Global.roomType')"
                                          prop="service_type">
                                <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%"
                                           v-model="ruleForm.service_type" :placeholder="$t('Global.roomType')">
                                    <el-option v-for="item in $store.getters['team/services']" :key="item.id"
                                               :label="item.name" :value="item.id">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item.name }}
                    </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="4">
                            <el-form-item :rules="validation(null, 1)" :label="$t('Global.stayType')" prop="stay_type">
                                <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%"
                                           v-model="ruleForm.stay_type" :placeholder="$t('Global.stayType')">
                                    <el-option v-for="item in 4" :key="item" :label="$t(`Global.stayType${item}`)"
                                               :value="item">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ $t(`Global.stayType${item}`) }}
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
                        <CCol sm="6">
                            <el-form-item :rules="validation(null, 0)" :label="$t('Global.arrivalDate')" prop="starts">
                                <el-date-picker @change="onFromPickValidation" clearable style="width: 100%"
                                                value-format="yyyy-MM-d" v-model="ruleForm.starts" type="date"
                                                :placeholder="$t('Global.arrivalDate')"></el-date-picker>
                            </el-form-item>
                        </CCol>
                        <CCol sm="6">
                            <el-form-item :rules="validation(null, 0)" :label="$t('Global.departureDate')" prop="ends">
                                <el-date-picker @change="onPickValidation" clearable style="width: 100%"
                                                value-format="yyyy-MM-d" v-model="ruleForm.ends" type="date"
                                                :placeholder="$t('Global.departureDate')"></el-date-picker>
                            </el-form-item>
                        </CCol>
                    </CRow>
                </el-form>
            </CCardBody>
            <span slot="footer" class="dialog-footer" :class="load ? 'disabledAll' : ''">
        <el-button @click="saveService('ruleForm')" @keyup.enter="saveService('ruleForm')" type="primary">{{ $t('Global.add') }}</el-button>
        <el-button @click="service_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
        </el-dialog>
        <el-dialog :title="$t('Global.add_reservation')" :visible.sync="reservation_dialog" class="p-0" width="60%">
            <CCardBody dir="rtl" style="text-align: initial" class="p-0">
                <el-form label-position="top" :model="reservationForm" status-icon size="large" ref="reservationForm"
                         label-width="120px" class="demo-ruleForm">
                    <CRow>
                        <CCol sm="12">
                            <el-form-item :rules="validation(null, 1)" prop="hotel_id" :label="$t('Global.hotel')">
                                <el-select filterable style="width: 100%" v-model="reservationForm.hotel_id"
                                           :placeholder="$t('Global.hotel')">
                                    <el-option v-for="hotel in $store.state.team.hotels" :key="hotel.id"
                                               :label="hotel.name" :value="hotel.id">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ hotel.name }}
                    </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </CCol>
                        <CCol sm="12">
                            <el-form-item :label="$t('Global.topic')" style="width: 100%" prop="topic">
                                <el-input autosize type="textarea" :placeholder="$t('Global.topic')"
                                          v-model="reservationForm.topic"></el-input>
                            </el-form-item>
                        </CCol>
                    </CRow>
                </el-form>
            </CCardBody>
            <span slot="footer" class="dialog-footer" :class="load ? 'disabledAll' : ''">
        <el-button @click="saveReservation('reservationForm')" @keyup.enter="saveReservation('reservationForm')"
                   type="primary">{{ $t('Global.add') }}</el-button>
        <el-button @click="reservation_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import Show from '../../components/Show';

    export default {
        name: 'team',
        components: {Show},
        data() {
            return {
                baseUrl: process.env.VUE_APP_BASE_URL,
                service_dialog: false,
                add_service_dialog: false,
                reservation_dialog: false,
                service_id: null,
                load: false,
                reservation_id: null,
                reservationForm: {
                    hotel_id: null,
                    topic: null,
                },
                ruleForm: {
                    employee: null,
                    room_count: null,
                    service_type: null,
                    stay_type: null,
                    starts: null,
                    ends: null,
                },
                addForm: {
                    users: [],
                    room_count: null,
                    service_type: null,
                    stay_type: null,
                    starts: null,
                    ends: null,
                },
            };
        },
        computed: {
            servicesData: function () {
                if (this.$store.getters['team/reservation'] && this.isMember) {
                    let data = this.$store.getters['team/reservation'].services.filter(member => member.user_id == this.authUser().id);
                    return data;
                } else {
                    return this.$store.getters['team/reservation'].services;
                }
            },
            isMember: function () {
                if (this.$store.state.team.team) {
                    let member = this.$store.state.team.team.all_members.find(member => member.user_id == this.authUser().id);
                    if (member && (member.user_id == this.authUser().id)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            members: function () {
                if (this.$store.state.team.team && this.$store.state.team.team.all_members) {
                   return  this.$store.state.team.team.all_members.filter((member) => member.excused === 0);
                }
                return  [];
            }
        },
        methods: {
            onFromPickValidation(pick) {
                if (this.ruleForm.ends) {
                    var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
                    var toDate = new Date(Date.parse(this.ruleForm.ends.replace(/-/g, ' ')));
                    if (pickedDate > toDate) {
                        this.$notify.error({message: `${this.$t('Validation.pickerTo')}`});
                        this.ruleForm.starts = null;
                    }
                }
            },
            onPickValidation(pick) {
                var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
                var todaysDate = new Date(Date.parse(this.ruleForm.starts.replace(/-/g, ' ')));
                if (pickedDate < todaysDate) {
                    this.$notify.error({message: `${this.$t('Validation.pickerTo')}`});
                    this.ruleForm.ends = null;
                }
            },
            init() {
                this.$store.dispatch('team/team', this.$route.params.id).then(() => {
                    this.$store.commit('SET_PATH_TITLE', this.$store.getters['team/name']);
                });
            },
            openServiceDialog(service) {
                if (service) {
                    this.service_id = service.id;
                    this.ruleForm.employee = service.user_id;
                    this.ruleForm.room_count = service.room_count;
                    this.ruleForm.stay_type = service.stay_type;
                    this.ruleForm.service_type = service.service_type;
                    this.ruleForm.starts = service.starts;
                    this.ruleForm.ends = service.ends;
                }
                this.service_dialog = true;
            },
            openAddServiceDialog() {
                this.add_service_dialog = true;
            },
            openReservationDialog(reservation) {
                if (reservation) {
                    this.reservationForm.hotel_id = reservation.hotel.id;
                    this.reservationForm.topic = reservation.topic;
                    this.reservation_id = reservation.id;
                }
                this.reservation_dialog = true;
            },
            saveReservation(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.load = true;
                        let query = {...this.reservationForm, team_id: this.$route.params.id};
                        this.$store
                            .dispatch('hotel/addReservation', {
                                query: query,
                                id: this.reservation_id ? this.reservation_id : null,
                            })
                            .then(_ => {
                                this.init();
                                this.load = false;
                                this.reservation_dialog = false;
                                this.$notify({
                                    type: 'success',
                                    message: `${this.$t('Global.successMessage')}`,
                                });
                            })
                            .catch(error => {
                                this.load = false;
                            });
                    }
                });
            },
            saveService(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.$store.state.team.reservation) {
                            this.load = true;
                            this.$store
                                .dispatch('hotel/saveService', {
                                    id: this.service_id ? `/${this.service_id}` : '',
                                    query: {
                                        ...this.ruleForm,
                                        hotel_reservation_id: this.$store.state.team.reservation.id
                                    },
                                })
                                .then(_ => {
                                    this.service_dialog = false;
                                    this.load = false;
                                    this.init();
                                    this.$notify({
                                        type: 'success',
                                        message: `${this.$t('Global.successMessage')}`,
                                    });
                                })
                                .catch(error => {
                                    this.load = false;
                                });
                        }
                    }
                });
            },
            addService(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.$store.state.team.reservation) {
                            this.load = true;
                            this.$store
                                .dispatch('hotel/addService', {
                                    query: {
                                        ...this.addForm,
                                        hotel_reservation_id: this.$store.state.team.reservation.id
                                    },
                                })
                                .then(_ => {
                                    this.add_service_dialog = false;
                                    this.load = false;
                                    this.init();
                                    this.$notify({
                                        type: 'success',
                                        message: `${this.$t('Global.successMessage')}`,
                                    });
                                })
                                .catch(error => {
                                    this.load = false;
                                });
                        }
                    }
                });
            },
            deleteService(id) {
                this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
                    confirmButtonText: `${this.$t('Global.accept')}`,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    type: 'success',
                }).then(_ => {
                    this.$store
                        .dispatch('hotel/deleteService', id)
                        .then(_ => {
                            this.$notify.success({
                                message: `${this.$t('Global.successMessage')}`,
                            });
                            this.init();
                        })
                        .catch(error => {
                            this.load = false;
                        });
                });

                //   this.dangerModal = false;
            },
            approve(submission) {
                if (submission) {
                    this.load = true;
                    this.$store.dispatch('hotel/approve', submission.id)
                        .then(_ => {
                            this.init();
                            this.load = false;
                            this.$notify({
                                type: 'success',
                                message: `${this.$t('Global.successMessage')}`,
                            });
                        })
                        .catch(error => {
                            this.load = false;
                        });
                }
            },
        },

        destroyed() {
            this.$store.commit('SET_PATH_TITLE', null);
        },
    };
</script>

<style scoped></style>
