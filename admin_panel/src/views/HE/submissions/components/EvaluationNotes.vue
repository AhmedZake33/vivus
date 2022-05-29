<template>
  <div class="grid-content" style="width: 50%">
    <div :key="index" v-for="(note, index) in $store.getters['evaluationNotes/evNotes']" dir="rtl" style="text-align: initial" v-if="$store.getters['evaluationNotes/evNotes'].length != 0">
      <div :key="i" v-for="(evNote, i) in note.messages">
        <div class="adminReply mb-4" v-if="evNote.final && evNote.final == 1">
          <div class="reply_header">
            <router-link to="" class="ml-1 mr-1"> {{ isAuth($store.getters['submission/representative']) || $store.getters['evaluation/evaluator'] === evConstants('TEAM_TYPE') || $store.getters['evaluation/evaluator'] === evConstants('COMMITTEE_TYPE') ? $t('Global.SystemManagement') : evNote.ar_name }} </router-link>
            <CBadge color="success">{{ $t(`Global.approvals_status_${evNote.level}`) }}</CBadge>
            <div class="ml-1 mr-1" v-if="evNote.created_at">
              <i class="el-icon-time small"></i>
              <small style="color: #909399"> {{ DateFormat(evNote.created_at) }}</small>
            </div>
          </div>
          <div class="reply_body success">
            <p class="ml-1 mr-1">{{ $t(`Global.ev_note_finish_${evNote.level}`) }}</p>
            <div v-if="i === 0">
              <div v-if="$store.state.evaluationNotes.canApprove && $store.state.evaluationNotes.complete" class="d-inline"></div>
            </div>
          </div>
        </div>

        <div class="adminReply mb-4" v-if="!isAuth($store.getters['submission/representative'])">
          <div class="reply_header">
            <router-link :to="isAuth($store.getters['submission/representative']) || $store.getters['evaluation/evaluator'] === evConstants('TEAM_TYPE') || $store.getters['evaluation/evaluator'] === evConstants('COMMITTEE_TYPE') ? '' : `/users/${evNote.user_id || evNote.id}`" class="ml-1 mr-1"> {{ isAuth($store.getters['submission/representative']) || $store.getters['evaluation/evaluator'] === evConstants('TEAM_TYPE') || $store.getters['evaluation/evaluator'] === evConstants('COMMITTEE_TYPE') ? $t('Global.SystemManagement') : evNote.ar_name }} </router-link>
            <CBadge color="info">{{ $t(`Global.approvals_status_${evNote.level}`) }}</CBadge>
            <div class="ml-1 mr-1" v-if="evNote.created_at">
              <i class="el-icon-time small"></i>
              <small style="color: #909399"> {{ DateFormat(evNote.created_at) }}</small>
            </div>
          </div>
          <div class="reply_body">
            <p class="ml-1 mr-1" v-html="ntBr(evNote.message)"></p>
            <div v-if="i === 0">
              <div v-if="$store.state.evaluationNotes.canApprove && $store.state.evaluationNotes.complete" class="d-inline">
                <!--                <el-button @click="handleAccept" round size="mini" class="mx-1 right_icon" type="success">موافقه </el-button>-->
                <!--                <el-button  @click="dialogOpen(0)" round size="mini" class="mx-1 right_icon" type="danger">رفض </el-button>-->
              </div>
              <!-- <div class="d-inline" v-else-if="$store.getters['notes/canReplay'] && isEqualStatus(note, constants('REFUSE_STATUS'))">
                              <el-button icon="el-icon-chat-round" @click="dialogOpen(true)" round size="mini" class="mx-1 right_icon" type="primary">كتابة رد </el-button>
                            </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$store.getters['evaluationNotes/evNotes'].length == 0 && !isAuth($store.getters['submission/representative'])">
      <div class="adminReply mb-4" v-if="$store.state.evaluationNotes.complete">
        <div class="reply_header">
          <!-- <router-link to="" class="ml-1 mr-1"> {{ evNote.ar_name }}</router-link> -->
          <!-- <CBadge color="info">{{ $t(`Global.approvals_status_${1}`) }}</CBadge> -->
          <!-- <div class="ml-1 mr-1">
                      <i class="el-icon-time small"></i>
                      <small style="color:#909399"> {{ DateFormat(evNote.created_at) }}</small>
                    </div> -->
        </div>
        <div class="reply_body">
          <p class="ml-1 mr-1"> تم اكتمال التقرير المبدئي برجاء التأكيد وانتظار موافقة الفريق</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toLocalDatetime } from '../../../../utils/helper';

export default {
  data() {
    return {
      dialogVisible: false,
      type: 0,
      form: {
        rejectReason: null,
        comment: null,
      },
      rules: {
        rejectReason: [{ required: true, message: 'من فضلك يجب كتابة الرساله', trigger: 'blur' }],
        comment: [{ required: true, message: 'من فضلك يجب كتابة الرساله', trigger: 'blur' }],
      },
    };
  },
  methods: {
    init() {
      this.$store.dispatch('notes/subState', this.$route.params.submission_id);
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`, true);
    },
    dialogOpen(type = 0) {
      this.type = type;
      this.dialogVisible = true;
    },
    sendReject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {
            note: String(this.form.rejectReason),
            status: this.evConstants('REJECT_STATUS'),
          };

          this.$store
            .dispatch('evaluationNotes/changeSubState', {
              id: this.$route.params.id,
              query: query,
            })
            .then(() => {
              if (this.ifRejected) {
                this.$notify.error({ title: 'تم الرفض', message: 'تم الرفض وارسال الملاحظة ' });
              } else {
                this.$notify.success({ title: 'تم الارسال', message: 'تم ارسال ملاحظتك بنجاح ' });
              }
              this.$emit('Refresh');
              this.dialogVisible = false;
            });
        }
      });
    },

    handleAccept() {
      this.$confirm('هل انت متأكد من الموافقة علي الطلب', {
        confirmButtonText: 'موافقة',
        cancelButtonText: 'الغاء',
        type: 'success',
      }).then(_ => {
        let query = { note: null, status: this.evConstants('APPROVE_STATUS') };
        // if (type === 2) {
        //   query = { note: null, status: this.constants('PRESIDENT_APPROVE_STATUS') };
        // }
        // if (type === 3) {
        //   query = { note: null, status: this.constants('FINANCE_APPROVE_STATUS') };
        // }
        this.$store
          .dispatch('evaluationNotes/changeSubState', {
            id: this.$route.params.id,
            query: query,
          })
          .then(() => {
            this.$notify({
              type: 'success',
              message: 'تمت العملية بنجاح',
            });
            this.$emit('Refresh');
            this.dialogVisible = false;
          });
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss"></style>
