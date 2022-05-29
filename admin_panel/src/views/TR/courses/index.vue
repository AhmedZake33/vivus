<template>
    <Courses @init="init" system_type='CO'></Courses>
</template>

<script>
    import Courses from '../../components/courses';
    export default {
        name: 'course',
        components: {Courses},
        methods:{
            init(query){
                this.$store.dispatch('course/courses', {query: query});
            }
        }
    };
</script>
