<template>
  <CSidebar fixed :minimize="minimize" :aside="$i18n.locale === 'ar' ? true : false" :show="show" @update:show="value => $store.commit('set', ['sidebarShow', value])">
    <CSidebarBrand class="d-md-down-none" to="/">
      <h1 class="c-sidebar-brand-full">NAQAAE</h1>
      <h1 class="c-sidebar-brand-minimized">N</h1>
    </CSidebarBrand>

    <CSidebarNav :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" :style="$i18n.locale === 'ar' ? 'margin: 8px;' : ''">
      <router-link v-if="$store.state.user.rerender" :to="`/users/${authUser().id}`" class="mt-2 mb-2 c-sidebar-nav-item sidebar-item sidebar_avatar" style="position: relative">
        <el-avatar :src="authUser().photo || '/img/avatars/avatardf.png'" class="custom_avatar" :size="35" icon="el-icon-user-solid custom_avatar_icon"></el-avatar>
        <span class="sidebar_name px-2 text-initial" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
          <span class="mx-2">
            {{ authUser().ar_name }}
          </span>
        </span>
      </router-link>
      <CSidebarNavItem :style="$i18n.locale === 'ar' ? '' : 'margin-top: 60px;'" icon="cil-speedometer" :name="$t('route.dashboard')" color="#00000f" class="sidebar-item" to="/"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_he')" fontIcon="el-icon-office-building" :name="$t('route.higherEduction')" class="sidebar-item" to="/higher" color="#00000f"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_sc')" fontIcon="el-icon-school" :name="$t('route.schoolSystem')" color="#00000f" to="/school" class="sidebar-item"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_tr')" fontIcon="el-icon-data-board" :name="$t('route.trainingSystem')" class="sidebar-item" color="#00000f" to="/course"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_ot')" fontIcon="el-icon-reading" :name="$t('route.onlineTraining')" class="sidebar-item" color="#00000f"></CSidebarNavItem>
      <!-- v-if="$store.getters['roles/userRolesPermissionsName'].includes('show_cs')" -->
      <CSidebarNavItem v-if="hasPermission('access_cs')" fontIcon="el-icon-video-camera" :name="$t('route.conferenceSystem')" class="sidebar-item" color="#00000f"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_fs')" fontIcon="el-icon-money" :name="$t('route.financialSystem')" class="sidebar-item" color="#00000f" to="/finance"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_users')" icon="cil-people" :name="$t('route.users')" color="#00000f" class="sidebar-item" to="/users"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_tickets')" icon="cil-life-ring" :name="$t('Global.ticket')" color="#00000f" class="sidebar-item" to="/management/tickets"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_tickets')" icon="cil-life-ring" :name="$t('Global.recoveries')" color="#00000f" class="sidebar-item" to="/management/users/recoveries"></CSidebarNavItem>
      <CSidebarNavItem v-if="hasPermission('access_management')" icon="cil-settings" :name="$t('route.management')" color="#00000f" class="sidebar-item" to="/management"></CSidebarNavItem>
    </CSidebarNav>

    <CSidebarMinimizer class="d-md-down-none" @click.native="$store.commit('set', ['sidebarMinimize', !minimize])" />
  </CSidebar>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'TheSidebar',
  data() {
    return {
      // Auth: JSON.parse(Cookies.get("user")),
    };
  },
  // watch: {
  //   $route(to, from) {
  //     this.$store.dispatch("roles/getUserRolesPermissions", this.Auth.id)
  //   },
  // },
  //   updated() {
  //     this.removeShow =
  //       Cookies.get("userPermissions").includes("show_cs") ||
  //       Cookies.get("userRolesPermissions").includes("show_cs");
  //   },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
  },
  // mounted() {
  //   this.$store.dispatch("roles/getUserRolesPermissions", this.Auth.id)
  //
  // },
};
</script>
<style lang="scss">
.c-sidebar-nav-link {
  background: #3c4b64 !important;
}

.ps__rail-y {
  display: none !important;
}

.c-sidebar-right .sidebar_avatar {
  display: flex;
  margin: 0;
  position: relative !important;
  align-items: center;
  border: 1px #eee solid;
  border-radius: 25px;
  padding: 2px;

  &:hover {
    background: #3c4b64 !important;

    .sidebar_name {
      display: contents !important;
    }
  }
}

.sidebar_avatar {
  display: flex;
  align-items: center;
  position: absolute !important;
  border: 1px #eee solid;
  border-radius: 25px;
  margin: 0 0.5rem;
  padding: 2px;
  &:hover {
    background: #3c4b64 !important;

    .sidebar_name {
      display: contents !important;
    }
  }
}

.c-sidebar-minimized .sidebar_avatar .sidebar_name {
  display: none;
  width: 200px;
}

.sidebar_name {
  color: #fff;
}

.c-sidebar-right .c-sidebar-nav-link svg,
.c-sidebar-right .c-sidebar-nav-link i {
  margin-right: -23px !important;
  margin-left: 0 !important;
}

.c-sidebar-right.c-sidebar-minimized .sidebar_avatar .sidebar_name {
  display: none;
}

@media (max-width: 991.98px) {
  .c-sidebar-right .sidebar_name {
    display: block !important;
  }
}
</style>
