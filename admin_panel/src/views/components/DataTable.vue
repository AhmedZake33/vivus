<template>
    <CRow>
        <CCol col="12" xl="12">
            <CCard>
                <CCardHeader v-if="frame">
                    <div :class="$i18n.locale === 'ar' ? 'custom_float card-header-actions' : ''"
                         style="display: inline-block; font-weight: bold">
                        <i :class="icon" style="font-size: 18px"></i>
                        <CIcon :name="fontIcon" v-if="fontIcon" color="bg-primary"></CIcon>
                        {{ name }}
                        <slot name="table-option"></slot>
                    </div>
                    <slot name="print-option"></slot>
                    <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''"
                         style="display: flex; justify-content: flex-end; align-items: center">
                        <CSpinner v-if="$store.getters['archive/loadingUpload']" size="sm" class="mr-2 ml-2"
                                  color="info"/>
                        <slot name="reports" v-if="reports"></slot>
                        <CDropdown v-if="!hidden_action" color="success" placement="bottom-end" size="sm"
                                   class="customDrop">
                            <template #toggler-content>
                                <CIcon name="cil-settings"/>
                                <span style="font-weight: bold">{{ $t('Global.action') }}</span>
                                <CBadge class="mx-1" color="info" v-if="archive_select_item > 0 && !showSelected"
                                >{{ archive_select_item }}
                                    {{ submissions ? $t('Global.selectedSubmissions') : $t('Global.items') }}
                                </CBadge>
                            </template>
                            <slot name="action_table"></slot>
                        </CDropdown>
                    </div>
                </CCardHeader>
                <CCardBody :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="text-align: initial">
                    <CRow v-if="frame" class="flex_small_screen flexGrow_3">
                        <!--            <form style="display: contents; width: 100%">-->
                        <div class="ml-2 mr-2 mb-2 fullWidth order-9 print_hide">
                            <el-input :placeholder="$t('Global.search')" clearable prepend="@" v-model="search"
                                      @keyup.enter.native="Refresh(true)">
                                <i slot="prefix" class="el-input__icon el-icon-search" @click="Refresh(true)"></i>
                            </el-input>
                        </div>
                        <div class="ml-2 mr-2 mb-2 fullWidth order-8" v-if="hasPermission(permission) && !places">
                            <el-select v-if="!ticket" class="fullWidth" ref="status" v-model="status"
                                       :label="$t('Global.active')"
                                       :placeholder="recovery ? $t('Global.recoveryremove') : $t('Global.active')">
                                <el-option v-if="!recovery" class="el-input" :value="0" :label="$t('Global.active')">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ $t('Global.active') }}
                    <i class="el-icon-check"></i>
                  </span>
                                </el-option>
                                <el-option v-if="!recovery" class="el-input" :value="1" :label="$t('Global.remove')">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ $t('Global.remove') }}
                    <i class="el-icon-close"></i>
                  </span>
                                </el-option>
                                <el-option v-if="recovery" class="el-input" :value="1"
                                           :label="$t('Global.recoveryactive')">
                                      <span style="float: right; color: #8492a6; font-size: 13px">
                                        {{ $t('Global.recoveryactive') }}
                                        <i class="el-icon-check"></i>
                                      </span>
                                </el-option>
                                <el-option v-if="recovery" class="el-input" :value="0"
                                           :label="$t('Global.recoveryremove')">
                                          <span style="float: right; color: #8492a6; font-size: 13px">
                                            {{ $t('Global.recoveryremove') }}
                                            <i class="el-icon-close"></i>
                                          </span>
                                </el-option>
                                <el-option v-if="recovery" class="el-input" :value="2"
                                           :label="$t('Global.recoverypending')">
                                      <span style="float: right; color: #8492a6; font-size: 13px">
                                        {{ $t('Global.recoverypending') }}
                                        <i class="el-icon-check"></i>
                                      </span>
                                </el-option>
                                <el-option v-if="componentType == 'user'" class="el-input" :value="2"
                                           :label="$t('Global.inProgress')">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ $t('Global.inProgress') }}
                    <i class="el-icon-warning-outline"></i>
                  </span>
                                </el-option>
                            </el-select>
                            <el-select v-if="ticket" class="fullWidth" ref="status" v-model="status"
                                       :label="$t('Global.notReply')" :placeholder="$t('Global.notReply')">
                                <el-option class="el-input" :value="0" :label="$t('Global.notReply')">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ $t('Global.notReply') }}
                    <i class="el-icon-check"></i>
                  </span>
                                </el-option>
                                <el-option class="el-input" :value="1" :label="$t('Global.replyDone')">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ $t('Global.replyDone') }}
                    <i class="el-icon-close"></i>
                  </span>
                                </el-option>
                            </el-select>
                        </div>
                        <slot name="filter_table" class=" " style="margin-bottom: 10px"></slot>
                        <!--            </form>-->
                        <div v-if="!hidden_reset" class="resetButton mb-2 order-10">
                            <button class="el-button el-button--default is-round base_color" @click="RefreshAll"
                                    type="reset" style="padding: 0.6rem 1rem">
                                <i class="el-icon-refresh"></i>
                                {{ $t('archive.reset') }}
                            </button>
                        </div>
                    </CRow>

                    <div v-if="task_type && task_type == 4" class="mainStatistics mt-4">
                        <slot name="task_type"></slot>
                    </div>

                    <DragTable @drop="Drag" v-if="draggable && !cards">
                        <el-table
                                @row-click="expandChange"
                                @expand-change="expandChange"
                                :data="items"
                                :row-key="getrowkeys"
                                :expand-row-keys="expand_keys"
                                :row-class-name="getRowClassName"
                                stripe
                                fit
                                @sort-change="sortChange"
                                v-loading="loading"
                                style="width: 100%"
                                :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                                :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                        >
                            <slot name="cols"></slot>
                            <template slot="empty" v-if="!cards">
                                <strong> {{ $t('Global.noItem') }} </strong>
                            </template>
                        </el-table>
                    </DragTable>
                    <el-table
                            @row-click="expandChange"
                            @expand-change="expandChange"
                            @selection-change="emitSelection"
                            :data="items"
                            :row-key="getrowkeys"
                            :expand-row-keys="expand_keys"
                            :row-class-name="getRowClassName"
                            stripe
                            fit
                            @sort-change="sortChange"
                            v-loading="loading"
                            style="width: 100%"
                            :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                            :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                            v-if="!draggable && !cards"
                    >
                        <slot name="cols"></slot>
                        <template slot="empty" v-if="!cards">
                            <strong> {{ $t('Global.noItem') }} </strong>
                        </template>
                    </el-table>

                    <slot name="cards"></slot>
                    <div class="resetHeader flex-wrap print_hide" v-if="!hidden_pagination">
                        <div style="margin-top: 10px">
                            <CPagination v-if="pages !== 0" :activePage.sync="page" :pages="pages" align="end"/>
                        </div>
                        <div class="w-auto align-items-center d-flex justify-content-sm-end direction">
                            <label class="text-nowrap mr-2">{{ paginationSelect.label }}</label>
                            <select class="form-control" v-model="itemsPerPage">
                                <option v-for="(value, key) in paginationSelect.values" :val="value" :key="key">
                                    {{ value }}
                                </option>
                            </select>
                            <label class="text-nowrap mr-2">{{ $t('Global.total') }}</label>
                            <span class="text-nowrap">{{ total }}</span>
                        </div>
                    </div>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>

<script>
    import DragTable from './DragTable';
    import {EventBus} from '../../main';

    export default {
        name: 'DataTable',
        components: {
            DragTable,
        },
        props: {
            course_id: [Number, String],
            places: Boolean,
            task_type: {
                default: null,
                type: Number,
            },
            place: [Number, String],
            is_credit: [Number, String],
            code_plan: [Number, String],
            expired: [Number, String],
            area_type: [Number, String],
            period: [Number, String],
            job_target: [Number, String],
            organization_target: [Number, String],
            ticket: Boolean,
            has_reservation: [Number, String],
            government:[Number],
            decision:[Number],
            reports: Boolean,
            cards: Boolean,
            recovery: Boolean,
            hidden_pagination: {default: false, type: Boolean},
            items: Array,
            hidden_reset: Boolean,
            frame: {
                default: true,
                type: Boolean,
            },
            componentType: String,
            name: String,
            visit_type: [Number, String, Array],
            user_id: [Number, String],
            taskType: {type: Number},
            apply_to: String,
            loading: Boolean,
            draggable: {default: false, type: Boolean},
            count: Number,
            total: Number,
            fontIcon: String,
            archive_select_item: Number,
            new_request: {
                default: 0,
                type: Number,
            },
            icon: String,
            university_id: [Number, String],
            university: [Number, String],
            collage: [Number, String],
            organization_id: [Number, String],
            decision_id: Number,
            option: [Number, Boolean],
            team_id: [Number, String],
            type_id: [Number, String],
            educationType: [Number, String],
            sector: Number,
            user: Number,
            available: Number,
            role: [Number, String],
            level: Number,
            qualification: Number,
            specification: Number,
            degree: Number,
            report_level: [Number, String],
            sc_level: [Number, String],
            type: [Number, String],
            content: String,
            search_type: String,
            range: String,
            visitRange: String,
            system: Number,
            directorate: [Number, Array],
            stage: Number,
            submissions: Boolean,
            dayType: Number,
            administration: Number,
            institute_id: Number,
            SCgender: Number,
            group_id: Number,
            showSelected: Boolean,
            permission: String,
            resetSearch: Number,
            submission_status: [Number, String],
            report_id: [Number, String],
            status_id: Number,
            undirectorate: Number,
            age: Number,
            groups: Boolean,
            wallet: Boolean,
            noReset: Boolean,
            degree_level: [Number, String],
            degree_qualification_id: [Number, String],
            degree_specification_id: [Number, String],
            role_job: [Number, String, Array],
            qualifications_ids: [Array, String],
            qualification_name: [Array, Number, String],
            hidden_action: {
                default: false,
                type: Boolean,
            },
        },
        data() {
            return {
                expand_keys: [],
                search: this.$store.state.search_all ? this.$store.state.search_all : '',
                page: 1,
                itemsPerPageSelect: {Boolean, Object},
                itemsPerPage: 10,
                status: 0,
                sort: {column: 'id', asc: false},
            };
        },
        computed: {
            pages: function () {
                return Math.ceil(this.total / this.itemsPerPage);
            },
            paginationSelect: function () {
                return {
                    label: this.$t('Global.items'),
                    values: [5, 10, 20, 50],
                };
            },
        },
        mounted() {
            let obj = {};
            let query = {
                limit: this.itemsPerPage,
                offset: 0,
                target_organization_id: this.organization_target,
                target_id: this.job_target,
                is_credit: this.is_credit,
                undirectorate: this.undirectorate,
                course_id: this.course_id,
                has_reservation: this.has_reservation,
                government:this.government,
                decision:this.decision,
                place_id: this.place,
                available: this.available,
                group_id: this.group_id,
                code: this.code_plan,
                area_id: this.area_type,
                qualification_name: this.qualification_name,
                period_id: this.period,
                status: this.status_id,
                submission_status: this.submission_status,
                user_id: this.user_id,
                sc_level: this.sc_level,
                expired: this.expired,
                order_by: this.sort.column ? this.sort.column : 'id',
                search_text: this.$store.state.search_all ? this.$store.state.search_all : '',
                removed: this.status ? this.status : 0,
                visit_type: this.visit_type,
                role: this.role,
                team_id: this.team_id,
                apply_to: this.apply_to,
                search_type: this.search_type,
                content_type: this.content,
                order_direction: this.sort.asc ? 'ASC' : 'DESC',
                university_id: this.university_id,
                organization_id: this.organization_id,
                decision_id: this.decision_id,
                new_request: this.new_request,
                university: this.university,
                system: this.system,
                collage: this.collage,
                count: this.count,

                degree_level: this.degree_level,
                degree_qualification_id: this.degree_qualification_id,
                degree_specification_id: this.degree_specification_id,

                level: this.level,
                qualification_id: this.qualification,
                specification_id: this.specification,
                qualifications_ids: this.qualifications_ids,
                degree: this.degree,
                type: this.type_id,
                task_type: this.task_type,
                educationType: this.educationType,
                sector: this.sector,
                user: this.user,
                directorate: this.directorate,
                stage: this.stage,
                age: this.age,
                filter_option: this.role_job,
                day_type: this.dayType,
                administration: this.administration,
                institute_id: this.institute_id,
                gender: this.SCgender,
                option: this.option,
                from: this.range ? this.range.split(',')[0] : null,
                to: this.range ? this.range.split(',')[1] : null,
                visit_from: this.visitRange ? this.visitRange.split(',')[0] : null,
                visit_to: this.visitRange ? this.visitRange.split(',')[1] : null,
                report_id: this.report_id ? this.report_id : null,
                alert_id: this.report_level,
            };
            // if (this.system == 'SC' || this.system == 2) {
            //     obj = {alert_id: this.report_level};
            //     query = {...query, ...obj};
            // } else {
            //     obj = {report_level: this.report_level};
            //     query = {...query, ...obj};
            // }

            this.$emit('Refresh', query);
        },
        watch: {
            system: function () {
                if (this.wallet) {
                    this.Refresh();
                }
            },
            search: function (val) {
                EventBus.$emit('getSearch', val);
                this.$store.commit('set', ['search_all', val]);
                if (!val || val == '') {
                    this.search = '';
                    this.Refresh();
                }
            },
            resetSearch: function () {
                this.search = '';
            },
            undirectorate: function () {
                this.Refresh();
            },
            has_reservation: function () {
                this.Refresh();
            },
            government:function () {
                this.Refresh();
            },
            decision:function(){
                this.Refresh();
            },
            available: function () {
                this.Refresh();
            },
            qualifications_ids() {
                this.Refresh();
            },
            is_credit() {
                this.Refresh();
            },
            qualification_name() {
                this.Refresh();
            },
            group_id: function () {
                this.Refresh();
            },
            degree_level() {
                this.Refresh();
            },
            degree_specification_id() {
                this.Refresh();
            },
            degree_qualification_id() {
                this.Refresh();
            },
            organization_target: function () {
                this.Refresh();
            },
            role_job() {
                this.Refresh();
            },
            job_target: function () {
                this.Refresh();
            },
            course_id: function () {
                this.Refresh();
            },
            code_plan: function () {
                this.Refresh();
            },
            area_type: function () {
                this.Refresh();
            },
            period: function () {
                this.Refresh();
            },
            place: function () {
                this.Refresh();
            },
            submission_status: function () {
                this.Refresh();
            },
            institute_id() {
                this.Refresh();
            },
            report_id: function () {
                this.Refresh();
            },
            sc_level: function () {
                this.Refresh();
            },
            page: function () {
                this.Refresh();
            },
            status_id: function () {
                this.Refresh();
            },
            itemsPerPage: function () {
                this.Refresh();
            },
            visit_type: function () {
                this.Refresh();
            },
            status: function (value) {
                EventBus.$emit('getStatus', value);
                this.$store.commit('set', ['status', value]);
                if (value) {
                    this.$refs.status.blur();
                }
                this.Refresh();
            },
            university_id: function (value) {
                this.Refresh();
            },
            apply_to: function (value) {
                this.Refresh();
            },
            university: function (value) {
                this.Refresh();
            },
            collage: function (value) {
                this.Refresh();
            },
            age() {
                this.Refresh();
            },
            user_id: function (value) {
                this.Refresh();
            },
            option: function () {
                this.Refresh();
            },
            content: function () {
                this.Refresh();
            },
            search_type: function () {
                this.Refresh();
            },
            task_type: function () {
                this.Refresh();
            },
            role: function () {
                this.Refresh();
            },
            count: function () {
                this.Refresh();
            },
            level: function () {
                this.Refresh();
            },
            user: function () {
                this.Refresh();
            },
            qualification: function () {
                this.Refresh();
            },
            specification: function () {
                this.Refresh();
            },
            degree: function () {
                this.Refresh();
            },
            decision_id: function (value) {
                this.$store.commit('set', ['decision_id', value]);
                this.Refresh();
            },
            type_id: function (value) {
                this.$store.commit('set', ['type', value]);
                this.Refresh();
            },
            organization_id: function (value) {
                this.Refresh();
            },
            administration: function (val) {
                this.Refresh();
            },
            dayType: function (val) {
                this.Refresh();
            },
            SCgender: function (val) {
                this.Refresh();
            },
            type: function (val) {
                this.Refresh();
            },
            stage: function (val) {
                this.Refresh();
            },
            directorate: function (val) {
                this.Refresh();
            },
            new_request: function (value) {
                this.Refresh();
            },
            team_id: function (val) {
                this.$store.commit('set', ['team_id', val]);
                this.Refresh();
            },
            educationType: function (val) {
                this.$store.commit('set', ['educationType', val]);
                this.Refresh();
            },
            expired: function () {
                this.Refresh();
            },
            sector: function (val) {
                this.$store.commit('set', ['sector', val]);
                this.Refresh();
            },
            range: function (val) {
                this.$store.commit('set', ['range', val.split(',')]);
                this.Refresh();
            },
            visitRange: function (val) {
                this.$store.commit('set', ['visitRange', val.split(',')]);
                this.Refresh();
            },
            report_level: function (val) {
                // this.$store.commit('set', ['level_sub', val]);
                this.Refresh();
            },
        },

        methods: {
            emitSelection(val) {
                this.$emit('selection-change', val);
            },
            RefreshAll() {
                this.search = '';
                this.status = 0;
                this.$emit('reset');
                let query;
                if (this.submissions) {
                    query = {
                        limit: this.itemsPerPage,
                        offset: (this.page - 1) * this.itemsPerPage,
                        system: this.system,
                        order_by: this.sort.column ? this.sort.column : 'id',
                        removed: this.status,
                        option: this.option,
                    };
                } else if (this.places) {
                    query = {
                        limit: this.itemsPerPage,
                        offset: (this.page - 1) * this.itemsPerPage,
                        order_direction: this.sort.asc ? 'ASC' : 'DESC',
                        system: this.system,
                    };
                } else if (this.groups) {
                    query = {
                        limit: this.itemsPerPage,
                        offset: (this.page - 1) * this.itemsPerPage,
                        order_direction: this.sort.asc ? 'ASC' : 'DESC',
                        system: this.system,
                    };
                } else {
                    query = {
                        limit: this.itemsPerPage,
                        offset: (this.page - 1) * this.itemsPerPage,
                        system: this.system,
                    };
                }
                if (!this.noReset) {
                    this.$emit('Refresh', query);
                }
            },

            Refresh(search = false) {
                let obj = {};
                let query = {
                    user_id: this.user_id,
                    limit: this.itemsPerPage,
                    offset: search ? 0 : (this.page - 1) * this.itemsPerPage,
                    search_text: this.search,
                    course_id: this.course_id,
                    undirectorate: this.undirectorate,
                    group_id: this.group_id,
                    is_credit: this.is_credit,
                    has_reservation: this.has_reservation,
                    government: this.government,
                    decision:this.decision,
                    available: this.available,
                    place_id: this.place,
                    age: this.age,
                    filter_option: this.role_job,
                    code: this.code_plan,
                    institute_id: this.institute_id,
                    area_id: this.area_type,
                    target_organization_id: this.organization_target,
                    target_id: this.job_target,
                    period_id: this.period,
                    qualification_name: this.qualification_name,
                    apply_to: this.apply_to,
                    order_by: this.sort.column ? this.sort.column : 'id',
                    order_direction: this.sort.asc ? 'ASC' : 'DESC',
                    removed: this.status,
                    count: this.count,
                    submission_status: this.submission_status,
                    university_id: this.university_id,
                    organization_id: this.organization_id,
                    decision_id: this.decision_id,
                    team_id: this.team_id,
                    role: this.role,
                    qualifications_ids: this.qualifications_ids,
                    sc_level: this.sc_level,
                    visit_type: this.visit_type,
                    status: this.status_id,
                    option: this.option,
                    type: this.type_id,
                    task_type: this.task_type,
                    educationType: this.educationType,
                    sector: this.sector,
                    search_type: this.search_type,
                    content_type: this.content,
                    system: this.system,
                    user: this.user,
                    directorate: this.directorate,
                    stage: this.stage,
                    day_type: this.dayType,
                    administration: this.administration,
                    gender: this.SCgender,
                    university: this.university,
                    new_request: this.new_request,
                    collage: this.collage,
                    degree_level: this.degree_level,
                    degree_qualification_id: this.degree_qualification_id,
                    degree_specification_id: this.degree_specification_id,

                    level: this.level,
                    qualification_id: this.qualification,
                    specification_id: this.specification,
                    degree: this.degree,
                    expired: this.expired,
                    from: this.range ? this.range.split(',')[0] : null,
                    to: this.range ? this.range.split(',')[1] : null,
                    visit_from: this.visitRange ? this.visitRange.split(',')[0] : null,
                    visit_to: this.visitRange ? this.visitRange.split(',')[1] : null,
                    report_id: this.report_id,
                    alert_id: this.report_level
                };
                // if (this.system == 2) {
                //     obj = {alert_id: this.report_level};
                //     query = {...query, ...obj};
                // } else {
                //     obj = {report_level: this.report_level};
                //     query = {...query, ...obj};
                // }
                this.$emit('Refresh', query);
            },
            show(id) {
                this.$emit('show', id);
            },
            sortChange(val) {
                this.sort.column = val.prop;
                this.sort.asc = val.order == 'ascending' ? true : false;
                this.Refresh();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            expandChange(row) {
                this.$emit('expand-change', row);
                this.expand_id = row.evaluation_id ? row.evaluation_id : row.id;
                if (this.expand_keys.length == 1) {
                    if (this.expand_id == this.expand_keys[0]) {
                        this.expand_keys = [];
                    } else {
                        this.expand_keys = [];
                        this.expand_keys.push(row.evaluation_id ? row.evaluation_id : row.id);
                    }
                } else {
                    this.expand_keys = [];
                    this.expand_keys.push(row.evaluation_id ? row.evaluation_id : row.id);
                }
            },
            getrowkeys(row) {
                return row.evaluation_id ? row.evaluation_id : row.id;
            },
            getRowClassName(row) {
                if (!row.row.program && !row.row.users) {
                    return 'hidden';
                } else {
                    return 'custom_expand';
                }
            },
            Drag(e) {
                this.$emit('Drag', e);
            },
        },
    };
</script>

<style lang="scss">
    /*.header-align .cell {*/
    /*    display: inline-block;*/
    /*    justify-content: right;*/
    /*}*/
    .custom_expand {
        cursor: pointer !important;
    }

    .resetButton .el-button.is-round:focus,
    .resetButton .el-button.is-round:hover,
    .resetButton .el-button.is-round:active {
        border-color: #173f5f;
        color: #173f5f;
        color: #fff;
        background-color: #173f5f;
        opacity: 1;
    }

    // .el-input {
    //   margin: 0.5rem 0;
    // }

    .base_color {
        opacity: 0.9;
        color: #fff;
        background-color: #173f5f;
    }

    .resetHeader {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
        width: 100%;
        margin: 0.5rem 0rem;

        .el-button {
            margin: 0rem 0.7rem;
        }

        div label {
            margin: 0rem 0.3rem;
        }
    }

    .resetButton {
        color: #fff;
        display: flex;
        align-items: center;
        flex-grow: 1;
        justify-content: flex-end;
        margin-left: 1rem;
    }

    .flex {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
</style>
