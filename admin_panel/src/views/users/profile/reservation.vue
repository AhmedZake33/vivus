<template>
    <CRow>
        <CCol col="12" lg="12" sm="12" v-if="hasPermission('show_plans') || isAuthUser($route.params.id)">
            <Reservations :user="Number($route.params.id)" @init="init"></Reservations>
        </CCol>
    </CRow>
</template>

<script>
    import Reservations from '../../components/reservations';

    export default {
        name: 'reservations',
        components: {Reservations},
        methods: {
            init(query) {
                this.$store.dispatch('course/reservations', {query: query});
            },
        },
    };
</script>

<style scoped></style>
