<template>
  <DataTable permission="admin_submissions" hidden_action :items="$store.getters['setting/settings']" @Refresh="Refresh" :loading="$store.state.setting.load" :name="$t('Global.settings')" :total="$store.getters['setting/total']" fontIcon="cil-speedometer">
    <template #cols>
      <el-table-column prop="name" :label="$t(`Global.name`)">
        <template slot-scope="scope">
          <span style="font-size: 12px">{{ $t(`Global.${scope.row.name}`) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" :label="$t(`Global.status`)">
        <template slot-scope="scope">
          <span style="font-size: 12px">{{ $t(`Global.settings_${scope.row.value}`) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label=" " width="70">
        <template slot-scope="scope">
          <el-switch
            @change="
              updateValue;
              changeSetting(scope.row.id);
            "
            :value="scope.row.value == 0 ? false : true"
            active-color="#13ce66"
            inactive-color="#ddd"
          >
          </el-switch>
        </template>
      </el-table-column>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '../../components/DataTable';
export default {
  name: 'settings',
  components: { DataTable },
  data() {
    return {
      removed: null,
      value: false,
    };
  },
  methods: {
    Refresh(query) {
      this.$store.dispatch('setting/settings', { query: query });
    },
    changeSetting(id) {
      this.$store.dispatch('setting/change', id).then(_ => {
        this.Refresh();
      });
    },
    updateValue(event) {
      this.value = event;
    },
  },
};
</script>

<style scoped></style>
