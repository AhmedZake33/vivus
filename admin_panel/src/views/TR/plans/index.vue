<template>
    <Plans @init="init" ></Plans>
</template>

<script>
    import Plans from '../../components/plans';
    export default {
        name: 'Plan',
        components: {Plans},
        methods:{
            init(query){
                this.$store.dispatch('course/plans', {query: query});
            }
        }
    };
</script>
