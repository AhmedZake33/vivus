<template>
    <Places @init="init" ></Places>
</template>

<script>
    import Places from '../../components/places';
    export default {
        name: 'palces',
        components: {Places},
        methods:{
            init(query){
                this.$store.dispatch('course/places', {query: query});
            }
        }
    };
</script>
