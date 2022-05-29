<template>
    <div>
        <DataTable :type_id="type" permission="access_tickets" ticket hidden_action
                   :items="$store.getters['ticket/tickets']" @Refresh="Refresh" :loading="$store.state.ticket.load"
                   :name="$t('Global.ticket')" :total="$store.getters['ticket/total']" fontIcon="cil-speedometer">
            <template #filter_table>
                <div v-if="hasPermission('all_tickets')" class="ml-2 mr-2 mb-2 fullWidth">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="type" :placeholder="$t('Global.sendTo')"
                               style="width: 100%">
                        <el-option v-for="item in types" :key="item.id" :label="$t(`Global.${item.name}`)"
                                   :value="item.id">
                            <div style="float: right; color: #8492a6; font-size: 13px">
                                {{ $t(`Global.${item.name}`) }}
                            </div>
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
                <el-table-column prop="owner" :label="$t('Global.owner')" sortable>
                    <template slot-scope="scope">
                        <router-link :to="scope.row.owner_id ? `/users/${scope.row.owner_id}` : ''">
                            {{ scope.row.owner }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="last_message" :label="$t('Global.Date')" sortable>
                    <template slot-scope="scope">
                        <span style="font-size: 12px">{{ toLocalDatetime(scope.row.last_message, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, true) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('Global.sendTo')" sortable>
                    <template slot-scope="scope">
                        <CBadge color="info" v-if="scope.row.type === 0"> {{ $t(`Global.ticket`) }}</CBadge>
                        <CBadge color="info" v-if="scope.row.type === 1">{{ $t(`Global.ACCREDITATION_TYPE`) }}</CBadge>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="user_name" :label="$t('Global.user_name')" sortable></el-table-column> -->
                <el-table-column prop="status" :label="$t('Global.status')" sortable>
                    <template slot-scope="scope">
                        <CBadge color="info">
                            {{ scope.row.status == 0 ? '( ' + scope.row.count + ' ) ' + $t('Global.message') :
                            $t('Global.replyDone') }}
                        </CBadge>
                    </template>
                </el-table-column>

                <el-table-column prop="" label=" ">
                    <template slot-scope="scope">
                        <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                            <router-link :to="{ path: `/management/ticket/add/${scope.row.owner_id}`.toString() }">
                                <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view"
                                           circle></el-button>
                            </router-link>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </DataTable>
    </div>
</template>

<script>
    import DataTable from '../../components/DataTable';

    export default {
        name: 'tickets',
        components: {DataTable},
        data() {
            return {
                types: [
                    {id: 0, name: 'ticket'},
                    {id: 1, name: 'ACCREDITATION_TYPE'},
                ],
                type: null,
                removed: null,
            };
        },
        methods: {
            Refresh(query) {
                this.$store.dispatch('ticket/tickets', {query: query});
            },
        },
    };
</script>

<style scoped></style>
