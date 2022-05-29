<template>
  <div v-if="hasPermission('show_roles')">
    <CCard v-if="hasPermission('edit_roles')">
      <CCardBody>
        <CRow style="display: flex; align-items: center">
          <CCol col="12" sm="4">
            <el-select v-model="role" filterable :placeholder="$t('roles.selectRole')" style="width: 100%">
              <el-option v-for="(role, id) in $store.getters['roles/roles']" :key="id" :label="role" :value="id + '#' + role">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ role }}
                  <i class="el-icon-user-solid"></i>
                </span>
              </el-option>
            </el-select>
          </CCol>
          <CCol sm="2">
            <el-input :placeholder="$t('roles.roleName')" :disabled="disabled" v-model="role_name" style="width: 100%"></el-input>
          </CCol>
          <CCol sm="2">
            <el-button type="primary" icon="el-icon-plus" style="width: 100%" @click="roleDialog = true">
              {{ $t('roles.add_role') }}
            </el-button>
          </CCol>
          <CCol sm="2">
            <el-button type="success" icon="el-icon-folder-checked" style="width: 100%" @click="updateRole">
              {{ $t('roles.update') }}
            </el-button>
          </CCol>
          <CCol sm="2">
            <el-button type="danger" @click="deleteRole" icon="el-icon-delete" style="width: 100%">
              {{ $t('roles.delete_role') }}
            </el-button>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CRow>
      <CCol sm="4" md="4" v-for="(permissions, name) in $store.getters['roles/permissionsGroups']">
        <CCard>
          <CCardHeader v-loading="$store.getters['roles/rolesLoad']">
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''">
              <CIcon name="cil-lock-locked" />
              {{ $t('permissions.' + name) }}
            </div>
          </CCardHeader>
          <CCardBody>
            <el-checkbox-group v-for="(permission, id) in permissions" v-model="Permissions" style="text-align: initial">
              <el-checkbox :disabled="disabled" :label="id" :key="id" style="width: 100%">{{ permission }} </el-checkbox>
            </el-checkbox-group>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <el-dialog :title="$t('roles.add_role')" :visible.sync="roleDialog">
      <el-input :placeholder="$t('roles.add_role')" v-model="new_role" style="width: 100%"></el-input>
      <span slot="footer" class="dialog-footer" v-loading="$store.getters['roles/addLoad']">
        <el-button type="primary" @click="addRole">{{ $t('Global.accept') }}</el-button>
        <el-button class="mx-2" @click="roleDialog = false">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Cookies from 'js-cookie';

export default {
  name: 'roles',
  data() {
    return {
      role: '',
      Auth: JSON.parse(Cookies.get('user')),
      Permissions: [],
      disabled: true,
      role_name: '',
      new_role: '',
      roleDialog: false,
    };
  },
  watch: {
    role: function (role) {
      if (role !== '') {
        this.disabled = false;
        let roleObject = role.split('#');
        this.role_name = roleObject[1];
        this.$store.dispatch('roles/getRolePermissions', roleObject[0]).then(response => {
          this.Permissions = this.$store.getters['roles/rolePermissions'];
        });
      } else {
        this.Permissions = [];
      }
    },
  },
  mounted() {
    this.$store.dispatch('roles/getRoles');
  },
  methods: {
    addRole() {
      if (this.new_role !== '') {
        this.$store.dispatch('roles/addRole', { name: this.new_role }).then(response => {
          this.roleDialog = false;
          this.$store.dispatch('roles/getRoles').then(response => {
            this.role = `${this.$store.getters['roles/newRoleId']}#${this.new_role}`;
          });
          this.$store.dispatch('roles/getAuthUserRolesPermissions', this.Auth.id);
        });
      } else {
        Message({
          message: 'يجب كتابة اسم المهنه',
          type: 'error',
          duration: 2 * 1000,
        });
      }
    },
    updateRole() {
      let roleObject = this.role.split('#');
      if (roleObject[0]) {
        this.$store
          .dispatch('roles/updateRole', {
            id: roleObject[0],
            data: { name: this.role_name, permissions: this.Permissions },
          })
          .then(response => {
            this.$store.dispatch('roles/getRoles').then(response => {
              this.role = `${roleObject[0]}#${this.role_name}`;
            });
            // this.$store.dispatch("roles/getUserRolesPermissions", this.Auth.id)
            this.$store.dispatch('roles/getAuthUserRolesPermissions', this.Auth.id);
          });
      }
    },
    deleteRole() {
      let roleObject = this.role.split('#');
      if (roleObject[1]) {
        this.$confirm(`  سوف يتم حذف هذه المهنه (${roleObject[1]}) استمرار؟  `, `${this.$t('Global.warning')}`, {
          confirmButtonText: `${this.$t('Global.accept')}`,
          cancelButtonText: `${this.$t('Global.cancel')}`,
          type: 'warning',
        }).then(() => {
          this.$store.dispatch('roles/deleteRole', roleObject[0]).then(response => {
            this.$store.dispatch('roles/getRoles').then(response => {
              this.role = '';
              this.disabled = true;
              this.role_name = '';
            });
            this.$store.dispatch('roles/getAuthUserRolesPermissions', this.Auth.id);
          });
        });
      }
    },
  },
};
</script>

<style scoped></style>
