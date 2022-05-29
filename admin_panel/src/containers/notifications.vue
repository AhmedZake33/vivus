<template>
  <div>
    <el-dropdown class="w-100 custom_drop_menu" trigger="click">
      <CHeaderNavItem class="mx-2">
        <CHeaderNavLink>
          <el-badge class="custom_notifications_badge" :value="$store.state.user.unseen" :max="99" type="primary">
            <CIcon name="cil-bell" class="mt-2" />
          </el-badge>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <el-dropdown-menu slot="dropdown">
        <div v-infinite-scroll="load" class="transition infinite-list pt-0 dropdown-menu show custom_notify" data-popper-placement="bottom-end" style="overflow: auto; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(-128px, 16px)">
          <div class="transition dropdown-header text-center px-2 bg-light d-flex justify-content-between align-items-center">
            <div class="pointer" @click="deleteAllNotification()">
              <i class="el-icon-delete"></i>
              <span>{{ $t('Global.deleteAll') }}</span>
            </div>
            <strong>{{ $t('Global.notifications_unseen', { message: $store.state.user.unseen }) }}</strong>
          </div>
          <a @click="seen(notify.id)" :id="notify.id" v-if="rerender" v-for="notify in $store.getters['user/notifications']" role="menuitem" href="#" target="_self" class="menuitem animate dropdown-item border-bottom transition">
            <div class="message transition">
              <div class="mx-2" dir="rtl" :class="isLoad ? 'disabledAll' : ''">
                <i class="el-icon-delete position-absolute mt-1" @click="deleteNotification(notify.id)"></i>
                <el-dropdown-item  v-if="hasPermission('finance_approval')">
                  <router-link :to="`/finance/show/${notify.system}/${notify.submission_id}`">
                    <div style="width: 300px; text-align: initial" class="text-truncate font-weight-bold" @click="seen(notify.id)">
                      {{ notify.title }}
                    </div>
                    <div style="width: 315px; text-align: initial" class="small text-muted text-truncate">{{ notify.message }}</div>
                    <span dir="rtl" class="small text-muted d-block text-initial">
                      <i class="el-icon-time"></i>
                      {{ toLocalDatetime(notify.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, true) }}
                    </span>
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item v-else-if="notify.type == 1 && notify.submission_id">
                  <router-link v-if="notify.system == 1" :to="notify.evaluation_id ? `/higher/submissions/submission/${notify.submission_id}/${notify.evaluation_id}` : `/higher/submissions/group/${notify.submission_id}`">
                    <div style="width: 300px; text-align: initial" class="text-truncate font-weight-bold" @click="seen(notify.id)">
                      {{ notify.title }}
                    </div>
                    <div style="width: 315px; text-align: initial" class="small text-muted text-truncate">{{ notify.message }}</div>
                    <span dir="rtl" class="small text-muted d-block text-initial">
                      <i class="el-icon-time"></i>
                      {{ toLocalDatetime(notify.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, true) }}
                    </span>
                  </router-link>
                  <router-link :to="`school/teams`" v-else-if="notify.system == 2 && hasPermission('reservation_approval')">
                    <div style="width: 300px; text-align: initial" class="text-truncate font-weight-bold" @click="seen(notify.id)">
                      {{ notify.title }}
                    </div>
                    <div style="width: 315px; text-align: initial" class="small text-muted text-truncate">{{ notify.message }}</div>
                    <span dir="rtl" class="small text-muted d-block text-initial">
                      <i class="el-icon-time"></i>
                      {{ toLocalDatetime(notify.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, true) }}
                    </span>
                  </router-link>
                  <router-link :to="`/course/reservations/reservation/${notify.submission_id}`" v-else-if="notify.system == 3">
                    <div style="width: 300px; text-align: initial" class="text-truncate font-weight-bold" @click="seen(notify.id)">
                      {{ notify.title }}
                    </div>
                    <div style="width: 315px; text-align: initial" class="small text-muted text-truncate">{{ notify.message }}</div>
                    <span dir="rtl" class="small text-muted d-block text-initial">
                      <i class="el-icon-time"></i>
                      {{ toLocalDatetime(notify.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, true) }}
                    </span>
                  </router-link>
                  <router-link v-else :to="`/school/submissions/submission/${notify.submission_id}/${notify.evaluation_id}`">
                    <div style="width: 300px; text-align: initial" class="text-truncate font-weight-bold" @click="seen(notify.id)">{{ notify.title }}</div>
                    <div style="width: 315px; text-align: initial" class="small text-muted text-truncate">{{ notify.message }}</div>
                    <span dir="rtl" class="small text-muted d-block text-initial">
                      <i class="el-icon-time"></i>
                      {{ toLocalDatetime(notify.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, true) }}
                    </span>
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item v-else>
                  <router-link :to="notify.submission_id ? `/school/messages/${notify.submission_id}/${notify.created_by}` : `/management/ticket/add`">
                    <div style="width: 300px; text-align: initial" class="text-truncate font-weight-bold">
                      {{ notify.title }}
                    </div>
                    <div style="width: 315px; text-align: initial" class="small text-muted text-truncate">{{ notify.message }}</div>
                    <span dir="rtl" class="small text-muted d-block text-initial">
                      <i class="el-icon-time"></i>
                      {{ toLocalDatetime(notify.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, true) }}
                    </span>
                  </router-link>
                </el-dropdown-item>
              </div>
              <router-link v-if="notify.system == 1" :to="notify.evaluation_id ? `/higher/submissions/submission/${notify.submission_id}/${notify.evaluation_id}` : `/higher/submissions/group/${notify.submission_id}`">
                <div class="c-avatar" @click="seen(notify.id)">
                  <img class="c-avatar-img" :src="notify.logo || getLogo(notify.type)" alt="user@email.com" />
                  <span v-if="!notify.seen" class="c-avatar-status pulse bg-success"> </span>
                </div>
              </router-link>
              <router-link v-else-if="notify.system == 2 && !hasPermission('reservation_approval')" :to="`/school/submissions/submission/${notify.submission_id}/${notify.evaluation_id}`">
                <div class="c-avatar" @click="seen(notify.id)">
                  <img class="c-avatar-img" :src="notify.logo || getLogo(notify.type)" alt="user@email.com" />
                  <span v-if="!notify.seen" class="c-avatar-status pulse bg-success"> </span>
                </div>
              </router-link>
              <router-link :to="`school/teams`" v-else-if="notify.system == 2 && hasPermission('reservation_approval')">
                <div class="c-avatar" @click="seen(notify.id)">
                  <img class="c-avatar-img" :src="notify.logo || getLogo(notify.type)" alt="user@email.com" />
                  <span v-if="!notify.seen" class="c-avatar-status pulse bg-success"> </span>
                </div>
              </router-link>
              <router-link :to="`/course/reservations/reservation/${notify.submission_id}`" v-else-if="notify.system == 3">
                <div class="c-avatar" @click="seen(notify.id)">
                  <img class="c-avatar-img" :src="notify.logo || getLogo(notify.type)" alt="user@email.com" />
                  <span v-if="!notify.seen" class="c-avatar-status pulse bg-success"> </span>
                </div>
              </router-link>
            </div>
          </a>
          <!-- <span v-if="$store.state.user.loadNotifications">Loading...</span> -->
          <div class="w-100 d-flex justify-content-center mt-2">
            <CSpinner v-if="$store.state.user.loadNotifications" color="default" size="sm" />
          </div>
        </div>
      </el-dropdown-menu>
      <!--        {{$store.getters['user/notifications']}}-->
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'notifications',
  data() {
    return {
      count: 5,
      list: [],
      isLoad: false,
      rerender: true,
    };
  },

  methods: {
    load() {
      this.count = this.count + 5;
      if (this.count <= this.$store.state.user.totalNotifications) {
        this.$store.dispatch('user/getNotifications', { query: { limit: this.count } });
      }
    },
    getNotifications() {
      this.$store.dispatch('user/getNotifications', { query: { limit: this.count } }).then(() => {
        this.isLoad = false;
      });
    },
    seen(id) {
      this.$store.dispatch('user/seen', id).then(() => {
        this.getNotifications();
      });
    },
    deleteNotification(id) {
      this.isLoad = true;
      document.getElementById(`${id}`).classList.add('delete_animate');
      setTimeout(() => {
        this.$store.dispatch('user/deleteNotification', id).then(() => {
          this.rerender = false;
          setTimeout(() => {
            this.rerender = true;
          }, 5);
          this.getNotifications();
        });
      }, 300);
    },
    deleteAllNotification() {
      this.isLoad = true;
      this.$store.dispatch('user/deleteAllNotification').then(() => {
        this.getNotifications();
      });
    },
  },
  mounted() {
    this.getNotifications();
    // window.Echo.channel('Notification').listen('PushNotification', (e)=>{
    //     this.$notify({
    //         title: `${e.user.ar_name}`,
    //         message: `${e.notification.message}`,
    //         type: 'success'
    //     });
    //     console.log(e)
    // })
    // this.$echo.private('Notification').listen('PushNotification', (payload) => {
    //   console.log(payload);
    // });
  },
};
</script>

<style lang="scss">
@media (max-width: 600px) {
  .custom_notify {
    width: 360px !important;
    inset: 0px auto auto -140px !important;
  }
}

.menuitem {
  line-height: 1.5 !important;
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: transparent !important;
  }
  .el-dropdown-menu__item {
    line-height: 1.5 !important;
    padding: 0 !important;
  }
}
.el-dropdown-menu__item i {
  margin-right: 0;
}
// .delete_animate{
//     // transition: transform 1.5s 0s, opacity 1.25s 0s;
//     // transform: translateX(100vw);
//     // opacity: 0;
//     // display: none;
//     height: 0px;//or anything you need
//     transition: height 1s;
// }
.delete_animate {
  animation: removed-item-animation 1s cubic-bezier(0.55, -0.04, 0.91, 0.94) forwards;
  /*transform origin is moved to the bottom left corner*/
  transform-origin: 0% 100%;
  display: block;
}

@keyframes removed-item-animation {
  0% {
    opacity: 1;
    transform: rotateZ(0);
  }

  100% {
    opacity: 0;
    display: none !important;
    transform: translateY(-600px) rotateZ(-90deg);
  }
}
.infinite-list {
  width: 400px;
}

.infinite-list::-webkit-scrollbar {
  background-color: #fff;
  width: 12px;
}

.infinite-list::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 3px;
}

.infinite-list::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #ddd;
  border: 2px solid #fff;
}

.custom_notifications_badge {
  .el-badge__content.is-fixed {
    top: 5px;
  }

  .el-badge__content {
    font-size: 11px;
    padding: 0 5px;
    border-radius: 50%;
    border: 0;
  }
}
.en {
  .custom_notify {
    inset: 0px auto auto -79px !important;
  }
}
.custom_notify {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item.active,
.dropdown-item:active {
  background-color: #fff;
  color: #4f5d73;
}

.dropdown-item.active,
.dropdown-item:focus {
  background-color: #fff;
  color: #4f5d73;

  .message {
    background-color: #ddd;
    border-radius: 10px;
  }
}

.el-badge__content.is-fixed.is-dot {
  right: 7px !important;
  top: 17px !important;
}

.el-badge__content.is-dot {
  height: 13px !important;
  width: 13px !important;
}

.custom_notify .dropdown-item {
  padding: 0.2rem;
}
.transition {
  transition: all 0.2s ease-in-out;
}
.message {
  padding: 0.5rem;
  display: flex;
  width: 100%;
}

.dropdown-item:hover {
  background-color: #fff;
  color: #4f5d73;

  .message {
    background-color: #ddd;
    border-radius: 10px;
  }
}

.popper__arrow {
  // display: none !important;
  border-bottom-color: #fff !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
