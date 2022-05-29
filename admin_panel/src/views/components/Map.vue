<template>
  <CRow>
    <CCol col="12" lg="12">
      <CCard>
        <CCardHeader class="d-flex justify-content-between align-items-center" :dir="$i18n.locale === 'ar' ? 'rtl' : ''">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''">
            <CIcon name="cil-location-pin" />
            {{ $t('dashboard.mapLocations') }}
          </div>
          <div class="el-input el-input--prefix el-input--suffix" style="width:30%">
            <GmapPlaceInput class="mapInput" style="width:100%"></GmapPlaceInput>
            <i class="el-icon-map-location custom_icon_position" ></i>
          </div>
        </CCardHeader>
        <CCardBody>
          <GmapMap ref="map" :center="{ lat: parseFloat(center.lat ? center.lat : 0), lng: parseFloat(center.lng ? center.lng : 0) }" v-if="locations != null" :zoom="zoom" style="width: 100%; height: 400px">
            <GmapMarker
              :key="index"
              v-for="(m, index) in locations"
              :position="{
                lat: parseFloat(isNaN(m.latitude) ? 0 : m.latitude),
                lng: parseFloat(isNaN(m.longitude) ? 0 : m.longitude),
              }"
              :clickable="true"
              @click="openWindow(m)"
            />
            <GmapInfoWindow
              @closeclick="window_open = false"
              :opened="window_open"
              :position="{
                lat: infoWindow.latitude,
                lng: infoWindow.longitude,
              }"
            >
              <div style="width:100%;">
                <div style="display: flex; justify-content: center;width: 100%;">
                  <div class="c-avatar map-avatar" style="width: 60px; height: 60px; border: 1px solid;">
                    <i class="el-icon-office-building" style="font-size: 33px;"></i>
                  </div>
                </div>
              </div>
              <div style="text-align: center" class="mt-2">
                <router-link :to="{ path: `/higher/organization/${infoWindow.id}`.toString() }">
                  {{ infoWindow.name }}
                </router-link>
                <div style="display: flex;margin: 12px 3px ; font-weight: bold">
                  {{ $t('Global.address') }} : <span style="font-weight: 200; margin: 0 8px;"> {{ infoWindow.address }}</span>
                </div>
                <div style="display: flex;margin: 12px 3px; font-weight: bold">
                  {{ $t('Global.email') }} : <span style="font-weight: 200; margin: 0 8px;"> {{ infoWindow.email }}</span>
                </div>
                <div style="display: flex;margin: 12px 3px; font-weight: bold">
                  {{ $t('Global.phone') }} : <span style="font-weight: 200; margin: 0 8px;"> {{ infoWindow.phone }}</span>
                </div>
              </div>
            </GmapInfoWindow>
          </GmapMap>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: 'Map',
  props: {
    locations: {},
    center: {
      type: Object,
      default: function() {
        return { lat: 30.033333, lng: 31.233334 };
      },
    },
    zoom: { type: Number, default: 8 },
  },
  data() {
    return {
      infoWindow: { latitude: 0, longitude: 0 },
      window_open: false,
    };
  },
  methods: {
    openWindow(info) {
      this.window_open = true;
      this.infoWindow = info;
    },
  },
};
</script>

<style lang="scss">
    .ar .custom_icon_position{
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
    }
.mapInput {
    margin-bottom: 0;
  input {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    padding: 0 2rem;
    &:hover {
      border-color: #c0c4cc;
    }
  }
}
.gm-style-iw {
  padding-right: 12px !important;
  padding-bottom: 12px !important;
}

.gm-style-iw-d {
  overflow: visible !important;
}
.gm-style-iw {
  overflow: visible !important;
}
.map-avatar {
  margin-top: -40px;
  background-color: #fff;
}
</style>
