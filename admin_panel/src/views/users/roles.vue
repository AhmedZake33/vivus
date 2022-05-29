<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow
          style="    display: flex;
    align-items: center;"
        >
          <CCol col="12" sm="10">
            <el-select
              v-model="roles"
              multiple
              filterable
              placeholder="Select Roles"
              style="width: 100%"
            >
              <el-option
                v-for="(role, id) in $store.getters['roles/roles']"
                :key="id"
                :label="role"
                :value="role"
              >
                 <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ role}}
                  <i class="el-icon-user-solid"></i>
                </span>
              </el-option>
            </el-select>
          </CCol>
          <CCol sm="2">
            <el-button
              type="success"
              icon="el-icon-folder-checked"
              style="width: 100%"
              @click="updateRolesPermissions"
              :loading="$store.getters['roles/rolesLoad']"
            >
              {{ $t("permissions.Update") }}
            </el-button>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CRow v-if="hasPermission('admin_roles')">
      <CCol
        sm="4"
        md="4"
        v-for="(permissions, name) in $store.getters['roles/permissionsGroups']"
      >
        <CCard>
          <CCardHeader v-loading="$store.getters['roles/rolesLoad']">
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''">
              <CIcon name="cil-lock-locked" />
              {{ $t("permissions." + name) }}
            </div>
          </CCardHeader>
          <CCardBody>
            <el-checkbox-group
              v-for="(permission, id) in permissions"
              v-model="Permissions"
              style="text-align: initial"
            >
              <el-checkbox
                :label="id"
                v-if="
                  $store.getters['roles/userRolesPermissions'].indexOf(id) !==
                    -1
                "
                :disabled="true"
                :key="id"
                style="width: 100%"
                >{{ permission }}
              </el-checkbox>
              <el-checkbox
                :label="id"
                v-if="
                  $store.getters['roles/userRolesPermissions'].indexOf(id) ===
                    -1
                "
                :key="id"
                style="width: 100%"
                >{{ permission }}
              </el-checkbox>
            </el-checkbox-group>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
export default {
  name: "UserRoles",
  data() {
    return {
      roles: [],
      Permissions: [],
      disabled: true,
    };
  },
  mounted() {
    this.$store.dispatch("roles/getRoles");
    this.$store
      .dispatch("roles/getUserRolesPermissions", this.$route.params.id)
      .then((response) => {
        this.roles = this.$store.getters["roles/userRoles"];
        this.Permissions.push(
          ...this.$store.getters["roles/userRolesPermissions"]
        );
        this.Permissions.push(...this.$store.getters["roles/userPermissions"]);
      });
  },
  methods: {
    updateRolesPermissions() {
      let direct_permission = this.Permissions.filter(
        (permission) =>
          this.$store.getters["roles/userRolesPermissions"].indexOf(
            permission
          ) === -1
      );
      this.$store
        .dispatch("roles/updateUserRolesPermissions", {
          id: this.$route.params.id,
          data: { roles: this.roles, permissions: direct_permission },
        })
        .then((response) => {
          this.$store
            .dispatch("roles/getUserRolesPermissions", this.$route.params.id)
            .then((response) => {
              this.roles = this.$store.getters["roles/userRoles"];
              this.Permissions = [];
              this.Permissions.push(
                ...this.$store.getters["roles/userRolesPermissions"]
              );
              this.Permissions.push(
                ...this.$store.getters["roles/userPermissions"]
              );
            });
        });
    },
  },
};
</script>

<style>
.el-checkbox__label {
  margin-right: 0.5rem;
}
.el-select__tags {
  margin: 0 2rem;
}
.el-tag__close {
  margin-right: 1rem;
}
</style>
