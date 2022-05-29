<template>
    <Submissions @init="init" system="SC"></Submissions>
</template>

<script>
    import Submissions from '../../components/submissions';
    export default {
        name: 'submission',
        components: {Submissions},
        methods:{
            init(query){
                this.$store.dispatch('submission/submissions', {query: query,system:'SC'});
            }
        }
    };
</script>
