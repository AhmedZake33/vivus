<template>
    <div>
        <DataTable
                :items="$store.getters['user/users']"
                @Refresh="Refresh"
                :loading="$store.getters['user/usersLoad']"
                :name="$t('Global.recoveries')"
                :total="$store.getters['user/totalUsers']"
                icon="el-icon-refresh"
                :level="level"
                recovery
                :qualification="qualification"
                :specification="specification"
                :degree="degree"
                :university_id="university"
                :organization_id="organization"
                @reset="reset"
                permission="show_users"
        >
            <template #action_table></template>
            <template #filter_table>
                <div class="ml-2 mr-2 mb-2 fullWidth">
                    <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectLevel')"
                               style="width: 100%" v-model="level" @change="resetAll" filterable clearable>
                        <el-option v-for="level in $store.getters['user/levels']" :key="level.id" :label="level.name"
                                   :value="level.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ level.name }}
                <i class="el-icon-user-solid"></i>
              </span>
                        </el-option>
                    </el-select>
                </div>
                <div class="ml-2 mr-2 mb-2 fullWidth">
                    <el-select ref="qualification" :no-data-text="$t('Global.nodata')"
                               :placeholder="$t('Global.selectQualifications')" style="width: 100%"
                               v-model="qualification" :disabled="qualification_status" @change="resetSpecification"
                               filterable clearable>
                        <el-option v-for="qualification in $store.getters['user/qualifications']"
                                   :key="qualification.id" :label="qualification.name" :value="qualification.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ qualification.name }}
                <i class="el-icon-user-solid"></i>
              </span>
                        </el-option>
                    </el-select>
                </div>
                <div class="ml-2 mr-2 mb-2 fullWidth">
                    <el-select ref="specification" :no-data-text="$t('Global.nodata')"
                               :placeholder="$t('Global.selectSpecification')" style="width: 100%"
                               v-model="specification" :disabled="specification_status" filterable clearable>
                        <el-option v-for="specification in $store.getters['user/specifications']"
                                   :key="specification.id" :label="specification.name" :value="specification.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ specification.name }}
                <i class="el-icon-user-solid"></i>
              </span>
                        </el-option>
                    </el-select>
                </div>
                <div class="ml-2 mr-2 mb-2 fullWidth">
                    <el-select clearable :no-data-text="$t('Global.nodata')" v-model="university" @clear="resetUni"
                               ref="uni" filterable :placeholder="$t('Global.selectUniversity')" style="width: 100%">
                        <el-option v-for="item in $store.getters['university/universities']" :key="item.id"
                                   :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
                <i class="el-icon-office-building"></i>
              </span>
                        </el-option>
                        <el-option key="new" :label="$t('Global.other')" :value="0">
              <span style="float: right; color: #8492a6; font-size: 13px">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.other') }}
                  <i class="el-icon-office-building"></i>
                </span>
              </span>
                        </el-option>
                        <template #prefix>
                            <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''"
                               style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
                        </template>
                    </el-select>
                </div>
                <div class="ml-2 mr-2 mb-2 fullWidth">
                    <el-select clearable :no-data-text="$t('Global.nodata')" v-model="organization" filterable ref="org"
                               :disabled="disabled" :placeholder="$t('Global.selectOrganization')" style="width: 100%">
                        <el-option v-for="item in $store.getters['organization/organizations']" :key="item.id"
                                   :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
                <i class="el-icon-school"></i>
              </span>
                        </el-option>
                        <el-option key="new" :label="$t('Global.other')" :value="0">
              <span style="float: right; color: #8492a6; font-size: 13px">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.other') }}
                  <i class="el-icon-school"></i>
                </span>
              </span>
                        </el-option>
                        <template #prefix>
                            <i class="el-icon-school" :dir="$i18n.locale === 'ar' ? 'rtl' : ''"
                               style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
                        </template>
                    </el-select>
                </div>
            </template>
            <template #cols>
                <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
                <el-table-column prop="name" :label="$t('users.name')" sortable>
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="scope.row.ar_name" placement="top-start">
                            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                                {{ scope.row.ar_name }}
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="organization_id" :label="$t('Global.organization')" sortable>
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top-start">
                            <div slot="content">
                                <span>{{ scope.row.organization }} <br/><br/>
                                  <div class="small text-muted">{{ ` ${scope.row.university}` }}</div>
                                </span>
                            </div>
                            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                                <router-link :to="{ path: `/higher/organization/${scope.row.organization_id}` }">
                                    {{ scope.row.organization }}
                                </router-link>
                                <div class="small text-muted" v-if="scope.row.university">
                                    {{ `${scope.row.university}` }}
                                </div>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="degree_qualification_id" :label="$t('Global.qualifications')" sortable>
                    <template slot-scope="scope">
                        <div>{{ scope.row.qualification }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="degree_specification_id" :label="$t('Global.specification')" sortable>
                    <template slot-scope="scope">
                        <div>{{ scope.row.specification }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="email" width="400" :label="$t('users.contact')">
                    <template slot-scope="scope">
                        <span>{{ $t('Global.email') + ': ' }} </span>
                        <span style="font-weight: bolder" class="ml-3"> ({{ scope.row.email }}),</span><br/>
                        <span>{{ $t('Global.mobile') + ': ' }} </span>
                        <span style="font-weight: bolder" class="ml-3"> ({{ scope.row.mobile }}),</span>
                        <span>{{ $t('Global.n_id') + ': ' }} </span>
                        <span style="font-weight: bolder" class="ml-3"> ({{ scope.row.national_id }}),</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" :label="$t('Global.created_at')">
                    <template slot-scope="scope">
                        {{ scope.row.created_at ? toLocalDatetime(scope.row.created_at, 'ar') : `${$t('Global.noAction')}` }}
                    </template>
                </el-table-column>
                <el-table-column prop="removed" width="120" :label="$t('users.status')">
                    <template slot-scope="scope">
                        <CBadge :color="getRecoveryBadge(scope.row.removed)">
                            <span v-if="scope.row.removed == 0">{{ $t('Global.recoveryremove') }}</span>
                            <span v-if="scope.row.removed == 1">{{ $t('Global.recoveryactive') }}</span>
                            <span v-if="scope.row.removed == 2">{{ $t('Global.recoverypending') }}</span>
                        </CBadge>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <div v-if="editable" class="d-flex justify-content-center align-items-center flex-wrap"
                             :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                            <i class="el-icon-delete table-action-item" @click="removeRecovery(scope.row)"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="editable" type="expand" style="width: 100%"
                                 :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                                 :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <template slot-scope="props">
                        <el-table :data="props.row.users">
                            <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
                            <el-table-column prop="name" :label="$t('users.name')">
                                <template slot-scope="scope">
                                    <el-tooltip effect="dark" :content="scope.row.ar_name" placement="top-start">
                                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                                            <router-link :to="{ path: `/users/${scope.row.id}`.toString() }">
                                                <i class="el-icon-user"></i>
                                                {{ scope.row.ar_name }}
                                            </router-link>
                                        </div>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column prop="national_id" :label="$t('Global.n_id')"></el-table-column>
                            <el-table-column prop="old_email" :label="$t('Global.email')">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.email }}</span>
                                    <span> {{ scope.row.old_email }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="mobile" :label="$t('Global.mobile')"></el-table-column>
                            <el-table-column prop="removed" width="120" :label="$t('users.status')">
                                <template slot-scope="scope">
                                    <CBadge :color="getBadge(scope.row.removed)">
                                        <span v-if="scope.row.removed == 0">{{ $t('Global.active') }}</span>
                                        <span v-if="scope.row.removed == 1">{{ $t('Global.remove') }}</span>
                                        <span v-if="scope.row.removed == 2">{{ $t('Global.inProgress') }}</span>
                                    </CBadge>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label=" ">
                                <template slot-scope="scope">
                                    <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'"
                                         v-if="!props.row.removed">
                                        <i class="el-icon-refresh table-action-item" style="font-size: 17px"
                                           @click="restore(scope.row.id, props.row.id)"></i>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </template>
        </DataTable>
    </div>
</template>

<script>
    import DataTable from '../../../components/DataTable';

    export default {
        name: 'index',
        components: {DataTable},
        props: {editable: true},
        data() {
            return {
                disabled: true,
                level: this.$store.state.level ? this.$store.state.level : null,
                qualification: this.$store.state.qualification ? this.$store.state.qualification : null,
                specification: this.$store.state.specification ? this.$store.state.specification : null,
                degree: this.$store.state.degree ? this.$store.state.degree : null,
                university: this.$store.state.university_user ? this.$store.state.university_user : null,
                organization: this.$store.state.organization_id_user ? this.$store.state.organization_id_user : null,
                qualification_status: this.$store.state.level ? false : true,
                specification_status: this.$store.state.qualification ? false : true,
            };
        },
        watch: {
            university: function (val) {
                this.$store.commit('set', ['university_user', val]);
                if (val || val == 0) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
                this.$store.dispatch('organization/names', {
                    query: {
                        parent_id: this.university,
                    },
                });
            },
            organization: function (val) {
                this.$store.commit('set', ['organization_id_user', val]);
                if (val || val == 0) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
            },
            specification: function (val) {
                this.$store.commit('set', ['specification', val]);
                val ? this.$refs.specification.blur() : '';
            },
            degree: function (val) {
                this.$store.commit('set', ['degree', val]);
                val ? this.$refs.degree.blur() : '';
            },
            level: function (val) {
                if (val) {
                    this.$store.commit('set', ['level', val]);
                    this.qualification_status = false;
                    this.$refs.level.blur();
                } else {
                    this.qualification_status = true;
                }
            },
            qualification: function (val) {
                if (val) {
                    this.$store.commit('set', ['qualification', val]);
                    this.specification_status = false;
                    this.$refs.qualification.blur();
                } else {
                    this.specification_status = true;
                }
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            removeRecovery(row) {
                if (!row.id) return;
                this.$confirm(this.$t('Global.deleteMessage'), `${this.$t('Global.warning')}`, {
                    confirmButtonText: `${this.$t('Global.accept')}`,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    type: 'warning',
                }).then(() => {
                    this.$store.dispatch('user/removeRecovery', row.id).then(() => {
                        this.Refresh();
                        this.$message({message: this.$t('Global.successMessage'), type: 'success'});
                    });
                }).catch(() => {
                    //   this.$message({ type: 'info', message: this.$t('Global.errorRestore') });
                });
            },
            resetUni() {
                this.organization = null;
            },
            init() {
                this.$store.dispatch('university/universities');
            },
            getBadge(status) {
                switch (status) {
                    case 0:
                        return 'success';
                    case 1:
                        return 'danger';
                    case 2:
                        return 'warning';
                    default:
                        return 'primary';
                }
            },
            getRecoveryBadge(status) {
                switch (status) {
                    case 1:
                        return 'success';
                    case 0:
                        return 'danger';
                    default:
                        return 'primary';
                }
            },
            Refresh(query) {
                this.$store.dispatch('user/recoveries', {query: query});
            },
            reset() {
                this.level = null;
                this.qualification = null;
                this.specification = null;
                this.degree = null;
                this.university = null;
            },

            restore(user, recovery) {
                this.$confirm(this.$t('Global.RestoreMessage'), `${this.$t('Global.warning')}`, {
                    confirmButtonText: `${this.$t('Global.accept')}`,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    type: 'warning',
                })
                    .then(() => {
                        this.$store.dispatch('user/restore', {user: user, recovery: recovery}).then(() => {
                            this.Refresh();
                            this.$message({message: this.$t('Global.successMessage'), type: 'success'});
                        });
                    })
                    .catch(() => {
                        //   this.$message({ type: 'info', message: this.$t('Global.errorRestore') });
                    });
            },
            resetAll() {
                this.qualification = null;
                this.specification = null;
            },
            resetSpecification() {
                this.specification = null;
            },
        },
    };
</script>
