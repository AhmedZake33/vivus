<template>
    <DataTable hidden_action :government="government" :has_reservation="has_reservation" :group_id="group_id" :items="$store.getters['team/teams']" @Refresh="Refresh"
               :loading="$store.getters['team/teamsLoad']" :name="$t('teams.teams')"
               :total="$store.getters['team/totalTeams']" icon="el-icon-message" permission="admin_teams"
               v-if="hasPermission('show_teams')">
        <template #cols>
            <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
            <el-table-column prop="name" :label="$t('Global.name')" sortable>
                <template slot-scope="scope">
                    <div style="text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap; width:100%; ">
                        {{ scope.row.name }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="starts_at" :label="$t('submission.starts_at')" sortable>
                <template slot-scope="scope">
                    {{ (scope.row.starts_at)? DateFormat(scope.row.starts_at) : '_' }}
                </template>
            </el-table-column>
            <el-table-column prop="ends_at" :label="$t('submission.ends_at')">
                <template slot-scope="scope">
                    {{ (scope.row.ends_at)? DateFormat(scope.row.ends_at) : '_'}}
                </template>
            </el-table-column>
            <el-table-column prop="reservation" :label="$t('submission.reservation')">
                <template slot-scope="scope">
                    {{scope.row.reservation?scope.row.reservation.name : '_'}}
                </template>
            </el-table-column>
            <el-table-column prop="removed" width="60" :label="$t('users.status')" v-if="hasPermission('edit_teams')">
                <template slot-scope="scope">
                    <CBadge :color="getBadge(scope.row.removed)">
                        <span v-if="scope.row.removed == 0">{{ $t('Global.active') }}</span>
                        <span v-if="scope.row.removed == 1">{{ $t('Global.remove') }}</span>
                    </CBadge>
                </template>
            </el-table-column>
            <el-table-column prop="" label=" ">
                <template slot-scope="scope">
                    <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                        <i class="el-icon-view table-action-item" @click="show(scope.row.id)"></i>
                        <!-- <i class="el-icon-edit table-action-item"  @click="show(scope.row.id)"></i> -->
                    </div>
                </template>
            </el-table-column>
        </template>
        <template #filter_table>
            <div class="ml-2 mr-2 mb-2 fullWidth">
                <el-select :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.reservation')"
                           style="width: 100%" v-model="has_reservation">
                    <el-option class="el-input" :value="1" :label="$t('Global.has_reservation')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.has_reservation') }}
              </span>
                    </el-option>
                    <el-option class="el-input" :value="0" :label="$t('Global.no_reservation')">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.no_reservation') }}
              </span>
                    </el-option>
                </el-select>
            </div>
            <div class="ml-2 mr-2 mb-2 fullWidth" v-if="$store.getters['team/lookup']">
                <el-select :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.group')"
                           style="width: 100%" v-model="group_id">
                    <el-option v-for="(group, i) in $store.getters['team/lookup'].groups" class="el-input" :key="i"
                               :value="group.id" :label="group.name">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ group.name }}
              </span>
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-select clearable :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.government')" v-model="government" >
                    <el-option
                        v-for="item in $store.getters['team/lookup'].governments"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>

            </div>
        </template>
    </DataTable>
</template>

<script>
    import DataTable from '../../components/DataTable';
    import * as helper from '../../../utils/helper';
    import Cookies from 'js-cookie';

    export default {
        name: 'teams',
        components: {DataTable},
        data() {
            return {
                removeShow: false,
                has_reservation: 0,
                group_id:null,
                government:null
            };
        },
        methods: {
            Refresh(query) {
                query = {...query, system: 2}
                this.$store.dispatch('team/teams', {query: query});
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
            DateFormat(date) {
                return helper.toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
            },
            show(id) {
                this.$router.push(`/school/team/${id}`);
            },
        },
    };
</script>

<style scoped></style>
