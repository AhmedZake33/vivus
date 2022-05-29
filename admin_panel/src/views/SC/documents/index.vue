<template>
  <div>
    <el-card class="box-card my-2" v-loading="$store.getters['documents/documentsLoad']">
      <div slot="header">
        <div class="d-flex justify-content-between" v-if="$store.state.documents.options">
          <el-button style="height: max-content" icon="el-icon-arrow-right" round size="mini" class="custom_send_icon" type="primary" @click="changePage($store.state.documents.options.next)" :disabled="!Number.isInteger($store.state.documents.options.next)">
            {{ $t('Global.next') }}
          </el-button>
          <div class="d-flex">
            <span class="font-weight-bolder" v-if="$store.getters['documents/documents'] && $store.getters['documents/documents'][0]">
              {{ $t('Global.FilesNeeded') }}
              ({{ $store.getters['documents/documents'][0].name }})
            </span>
          </div>
          <el-button style="height: max-content" icon="el-icon-arrow-left" round size="mini" class="right_icon custom_send_icon" type="primary" @click="changePage($store.state.documents.options.prev)" :disabled="!Number.isInteger($store.state.documents.options.prev)">
            {{ $t('Global.prev') }}
          </el-button>
        </div>
      </div>

      <div class="d-flex flex-column" v-if="$store.getters['documents/documents']" v-for="(mainDocument, mainIndex) in $store.getters['documents/documents']">
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol v-for="(innerDocument, innerIndex) in mainDocument.documents" v-if="mainDocument.documents" sm="12">
              <el-collapse v-model="activeName" class="custom_collapse custom_collapse_docs" accordion>
                <el-collapse-item :name="innerIndex" :title="innerIndex">
                  <template slot="title">
                    <CCardHeader>
                      <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block">
                        <div class="mx-2">
                          <strong>{{ innerIndex }} </strong>
                        </div>
                      </div>
                    </CCardHeader>
                  </template>
                  <div v-for="(innerdoc, cat) in innerDocument">
                    <div class="w-100 mx-1">
                      <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                        <span class="font_12 d-block text-center success">{{ cat }}</span>
                      </div>
                    </div>
                    <div v-for="document in innerdoc" class="p-1 border mb-2 text item docs d-flex justify-content-between align-items-center">
                      <div>
                        <a class="pointer custom_link">
                          <span style="line-height: 17px" class="el-form-item__label">
                            {{ document.name }}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <!-- <div class="w-100 mx-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12 d-block info text-center">
                    {{ innerIndex }}
                  </span>
                </div>
              </div> -->
              <!--                            <CCardBody>-->

              <!--                            </CCardBody>-->
            </CCol>
          </CRow>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'زيارة اعادة تقييم',
    };
  },
  methods: {
    init() {
      this.$store.dispatch('documents/documents', { query: {} }).then(_ => {});
    },
    changePage(stage_id) {
      this.$store.dispatch('documents/documents', { query: { stage_id: stage_id } });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.custom_collapse .el-collapse-item__arrow {
  order: -1;
}
</style>
