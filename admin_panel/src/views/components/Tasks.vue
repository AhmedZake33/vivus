<template>
  <DataTable
    custom_task
    class="custom_task"
    :items="$store.getters['user/tasks'] ? $store.getters['user/tasks'] : []"
    @Refresh="Refresh"
    hidden_action
    :frame="false"
    :task_type="type"
    :option="option"
    :loading="$store.getters['user/loadTasks']"
    :name="$t('user.tasks')"
    :total="$store.getters['user/totalTasks']"
    icon="el-icon-message"
  >
    <template #task_type>
      <div :class="`${option === 2 ? 'switch_view ml-2' : 'active switch_view ml-2'}`" style="display: inline-flex">
        <span :class="`${option === 2 ? `${$i18n.locale === 'en' ? 'h6 mr-2' : 'h6 ml-2'}` : `${$i18n.locale === 'en' ? 'active h6  mr-2' : 'active h6  ml-2'}`}`" style="cursor: pointer; margin: 0 0" @click="option = 1">{{ $t('Global.HEstatistc') }}</span>
        <span :class="`${option === 2 ? 'active h6' : 'h6'}`" style="cursor: pointer; margin: 0 0" @click="option = 2">{{ $t('Global.SCstatistc') }}</span>
      </div>
    </template>
    <template #cols>
      <el-table-column class="tasks" prop="logo" width="65">
        <template #header>
          <i class="el-icon-s-home"></i>
        </template>
        <template slot-scope="scope">
          <router-link v-if="scope.row.system == 1" :to="scope.row.evaluation_id ? `/higher/submissions/submission/${scope.row.submission_id}/${scope.row.evaluation_id}` : `/higher/submissions/group/${scope.row.submission_id}`">
            <div class="c-avatar">
              <img class="c-avatar-img" :src="scope.row.logo || getLogo(scope.row.evaluation_type)" alt="user@email.com" />
              <span :class="scope.row.status ? `c-avatar-status pulse bg-danger` : `c-avatar-status pulse bg-success`"> </span>
            </div>
          </router-link>
          <router-link v-if="scope.row.system == 2" :to="`/school/submissions/submission/${scope.row.submission_id}/${scope.row.evaluation_id}`">
            <div class="c-avatar">
              <img class="c-avatar-img" :src="scope.row.logo || getLogo(scope.row.evaluation_type)" alt="user@email.com" />
              <span :class="scope.row.status ? `c-avatar-status pulse bg-danger` : `c-avatar-status pulse bg-success`"> </span>
            </div>
          </router-link>
          <router-link v-if="scope.row.system == 3" :to="`/course/reservations/reservation/${scope.row.submission_id}`">
            <div class="c-avatar">
              <img class="c-avatar-img" :src="scope.row.logo || getLogo(scope.row.evaluation_type)" alt="user@email.com" />
              <span :class="scope.row.status ? `c-avatar-status pulse bg-danger` : `c-avatar-status pulse bg-success`"> </span>
            </div>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="task" :label="$t('user.tasks')" width="300">
        <template slot-scope="scope">
          <div class="d-inline-flex" style="width: 100%">
            <div>
              <div>
                <router-link :to="`/finance/show/${scope.row.system}/${scope.row.submission_id}`" v-if="hasPermission('finance_approval')">
                  {{ `${scope.row.name || '-'}` }}
                </router-link>
                <router-link :to="`/higher/team/${scope.row.team_id}`" v-else-if="scope.row.system == 1 && hasPermission('reservation_approval')">
                  {{ `${scope.row.name || '-'}` }}
                </router-link>
                <router-link :to="`/school/team/${scope.row.team_id}`" v-else-if="scope.row.system == 2 && hasPermission('reservation_approval')">
                  {{ `${scope.row.name || '-'}` }}
                </router-link>
                <router-link v-else-if="scope.row.system == 1" :to="scope.row.evaluation_id ? `/higher/submissions/submission/${scope.row.submission_id}/${scope.row.evaluation_id}` : `/higher/submissions/group/${scope.row.submission_id}`">
                  {{ `${scope.row.name || '-'}` }}
                </router-link>
                <router-link v-else-if="scope.row.system == 2" :to="scope.row.evaluation_id ? `/school/submissions/submission/${scope.row.submission_id}/${scope.row.evaluation_id}` : ``">
                  {{ `${scope.row.name || '-'}` }}
                </router-link>
                <router-link v-else :to="`/course/reservations/reservation/${scope.row.submission_id}`">
                  {{ `${scope.row.name || '-'}` }}
                </router-link>
              </div>
              <div class="small text-muted">
                <span v-if="scope.row.university">{{ scope.row.university }} - </span>
                <span>{{ scope.row.submission_id }}</span> | {{ `${$t('Global.submitted_at')} :  ${toLocalDatetime(scope.row.created_at, 'ar', false)}` }}
                <span v-if="scope.row.program">|{{ scope.row.program }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="task" min-width="100">
        <template slot-scope="scope">
          <div class="d-inline-flex" style="width: 100%">
            <div>
              <div>
                <router-link :to="`/finance/show/${scope.row.system}/${scope.row.submission_id}`" v-if="hasPermission('finance_approval')">
                  {{ `${scope.row.task}` }}
                </router-link>
                <router-link :to="`/higher/team/${scope.row.team_id}`" v-else-if="scope.row.system == 1 && hasPermission('reservation_approval')">
                  {{ `${scope.row.task}` }}
                </router-link>
                <router-link :to="`/school/team/${scope.row.team_id}`" v-else-if="scope.row.system == 2 && hasPermission('reservation_approval')">
                  {{ `${scope.row.task}` }}
                </router-link>
                <router-link v-else-if="scope.row.system == 1" :to="scope.row.evaluation_id ? `/higher/submissions/submission/${scope.row.submission_id}/${scope.row.evaluation_id}` : `/higher/submissions/group/${scope.row.submission_id}`" class="ml-1 font-weight-bolder">
                  {{ `${scope.row.task}` }}
                </router-link>
                <router-link v-else-if="scope.row.system == 2" :to="scope.row.evaluation_id ? `/school/submissions/submission/${scope.row.submission_id}/${scope.row.evaluation_id}` : ``" class="ml-1 font-weight-bolder">
                  {{ `${scope.row.task}` }}
                </router-link>
                <router-link v-else :to="`/course/reservations/reservation/${scope.row.submission_id}`">
                  {{ `${scope.row.task || '-'}` }}
                </router-link>
              </div>
              <div class="small text-muted d-flex">
                <span>{{ scope.row.name }} </span>
                <span v-if="scope.row.university"> - {{ scope.row.university }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="reported_at" :label="$t('user.reportedAt')" width="130" sortable>
        <template slot-scope="scope">
          <small class="d-block">{{ toLocalDatetime(scope.row.date, 'ar', false) }}</small>
          <CBadge :color="scope.row.status ? 'danger' : 'info'" dir="ltr" class="text-center" style="font-size: 10px"> <i class="el-icon-time"></i> {{ scope.row.diffDate }} </CBadge>
        </template>
      </el-table-column>
      <el-table-column prop="task" label=" " width="150">
        <template slot-scope="scope">
          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
            <router-link :to="`/finance/show/${scope.row.system}/${scope.row.submission_id}`" v-if="hasPermission('finance_approval')">
              <el-button round size="mini" class="position-relative custom_pulse mx-1 right_icon" type="primary">
                {{ $t('Global.pressNow') }}
              </el-button>
            </router-link>
            <router-link :to="`higher/team/${scope.row.team_id}`" v-else-if="scope.row.system == 1 && hasPermission('reservation_approval')">
              <el-button round size="mini" class="position-relative custom_pulse mx-1 right_icon" type="primary">
                {{ $t('Global.pressNow') }}
                <!-- <div style="left:-20px;right:unset" class="c-avatar-status bg-danger circle pulse orange"></div> -->
              </el-button>
            </router-link>
            <router-link :to="`school/team/${scope.row.team_id}`" v-else-if="scope.row.system == 2 && hasPermission('reservation_approval')">
              <el-button round size="mini" class="position-relative custom_pulse mx-1 right_icon" type="primary">
                {{ $t('Global.pressNow') }}
                <!-- <div style="left:-20px;right:unset" class="c-avatar-status bg-danger circle pulse orange"></div> -->
              </el-button>
            </router-link>
            <router-link v-else-if="scope.row.system == 1" :to="scope.row.evaluation_id ? `/higher/submissions/submission/${scope.row.submission_id}/${scope.row.evaluation_id}` : `/higher/submissions/group/${scope.row.submission_id}`">
              <!--               <i class="el-icon-setting table-action-item" style="font-size: 13px; color: #3a4555"></i> -->
              <el-button round size="mini" class="position-relative custom_pulse mx-1 right_icon" type="primary">
                {{ $t('Global.pressNow') }}
                <!-- <div style="left:-20px;right:unset" class="c-avatar-status bg-danger circle pulse orange"></div> -->
              </el-button>
            </router-link>
            <router-link v-else-if="scope.row.system == 2" :to="scope.row.evaluation_id ? `/school/submissions/submission/${scope.row.submission_id}/${scope.row.evaluation_id}` : ``">
              <!--               <i class="el-icon-setting table-action-item" style="font-size: 13px; color: #3a4555"></i> -->
              <el-button round size="mini" class="position-relative custom_pulse mx-1 right_icon" type="primary">
                {{ $t('Global.pressNow') }}
                <!-- <div style="left:-20px;right:unset" class="c-avatar-status bg-danger circle pulse orange"></div> -->
              </el-button>
            </router-link>
            <router-link v-else :to="`/course/reservations/reservation/${scope.row.submission_id}`">
              <el-button round size="mini" class="position-relative custom_pulse mx-1 right_icon" type="primary">
                {{ $t('Global.pressNow') }}
              </el-button>
            </router-link>
          </div>
        </template>
      </el-table-column>
    </template>
  </DataTable>
</template>

<script>
import DataTable from './DataTable';

export default {
  name: 'Tasks',
  components: { DataTable },
  props: { type: { type: Number } },
  data() {
    return {
      option: 1,
    };
  },
  methods: {
    Refresh(query) {
      this.$store.dispatch('user/getTasks', { id: this.$route.params.id ? this.$route.params.id : this.authUser().id, query: { ...query, type: this.type } });
    },
  },
};
</script>

<style lang="scss">
.en .el-table__body,
.en .el-table__header {
  direction: ltr;
}
.c-avatar {
  border: 1px solid #ddd;
  border-radius: 50%;
}
.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0px 0px 1px 1px #0000001a;
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
}
.orange {
  background: #f17c57fa;
}
.custom_pulse {
  span {
    position: relative;
  }
}
.custom_task .el-table__row {
  td {
    padding: 0.5rem 0 !important;
  }
}
.el-tabs__content {
  overflow: visible !important;
}
.custom_task {
  .card-body {
    padding: 0;
    table {
      thead {
        th,
        tr {
          background: #eee !important;
          .cell {
            font-size: 14px;
          }
        }
      }
      tr {
        th:first-child {
          text-align: center !important;
        }
      }
    }
  }
}
</style>
