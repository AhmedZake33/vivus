<template>
  <Submissions @init="init" system="HE"></Submissions>
</template>

<script>
import Submissions from '../../components/submissions';
import DataTable from '../../components/DataTable';
export default {
  name: 'submission',
  components: { DataTable, Submissions },
  methods: {
    init(query) {
      this.$store.dispatch('submission/submissions', { query: query,system:'HE' });
    },
  },
};
</script>
