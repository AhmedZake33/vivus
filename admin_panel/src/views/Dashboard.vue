<template>
    <div v-if="hasPermission('dashboard_system')">
        <div class="mainStatistics">
            <div :class="`${option === 2 ? 'switch_view ml-2' : 'active switch_view ml-2'}`" style="display: inline-flex">
                <span :class="`${option === 2 ? `${$i18n.locale === 'en' ? 'h6 mr-2' : 'h6 ml-2'}` : `${$i18n.locale === 'en' ? 'active h6  mr-2' : 'active h6  ml-2'}`}`" style=" cursor: pointer; margin: 0 0" @click="option = 1">{{ $t('Global.HEstatistc') }}</span>
                <span :class="`${option === 2 ? 'active h6' : 'h6'}`" style=" cursor: pointer; margin: 0 0" @click="option = 2">{{ $t('Global.SCstatistc') }}</span>
            </div>
        </div>
        <MainStatistics v-if="hasPermission('dashboard_system')" :system="option"></MainStatistics>
        <DashboardCharts v-if="hasPermission('dashboard_system')" :system="option"></DashboardCharts>
        <Map :locations="$store.getters['statistics/locations']" v-if="hasPermission('dashboard_system')"></Map>
    </div>
    <div v-else-if="!hasPermission('dashboard_system')">
        <profile :user="authUser()"></profile>
    </div>

</template>

<script>
    import Map from './components/Map'
    import MainStatistics from "./components/MainStatistics";
    import DashboardCharts from "./components/DashboardCharts";
    import profile from "./users/show";

    export default {
        name: 'Dashboard',
        mounted() {
            this.$store.dispatch('statistics/setLocations')
        },
        data() {
            return {
                option: 1,
            };
        },
        components: {
            DashboardCharts,
            MainStatistics,
            Map,
            profile
        },
    }
</script>



