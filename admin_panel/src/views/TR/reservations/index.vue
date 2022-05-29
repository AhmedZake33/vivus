<template>
    <Reservations @init="init" system_type="RE"></Reservations>
</template>

<script>
    import Reservations from '../../components/reservations';

    export default {
        name: 'reservations',
        components: {Reservations},
        methods: {
            init(query) {
                this.$store.dispatch('course/reservations', {query: query});
            }
        }
    };
</script>
