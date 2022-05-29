<template>
    <CRow v-if="hasPermission('show_archive') || archive_id">
        <CCol col="12" lg="12">
            <div v-model="locale = $i18n.locale"></div>
            <DataTable
                    :items="$store.getters['archive/binaries']"
                    @Refresh="Refresh"
                    :loading="$store.getters['archive/archiveLoad']"
                    :search_type="search_type"
                    :content="content"
                    :type_id="type"
                    :archive_select_item="selectedPaths.length"
                    :draggable="ifNotMobile"
                    :hidden_action="insubmission ? true : false"
                    @Drag="sort"
                    :total="$store.getters['archive/totalArchive']">
                <template #table-option>
                    <div><i :class=" $i18n.locale === 'ar' ? `el-icon-caret-left`: `el-icon-caret-right`"></i>
                        <span>{{$store.getters["archive/parents"].length == 0 ? $i18n.locale == 'en'? 'Archive' : 'الأرشيف' : ""}}</span>
                        <span :key="index" v-for="(item, index) in $store.getters['archive/parents']">
                            <span @click="goToNext(item)" class="path"
                                  v-if="item !== $store.getters['archive/parents'][$store.getters['archive/parents'].length - 1]">
                                {{item.title === 'Archive' ? $t('Global.archive') :item.title }}
                            </span>
                            <span v-if="item !== $store.getters['archive/parents'][$store.getters['archive/parents'].length - 1]">
                                {{ " / " }}
                            </span>
                            <span v-else class="activeBread">
                                {{$store.getters["archive/parents"].length == 0 ?  $i18n.locale == 'en'? 'Archive' : 'الأرشيف' : item.title}}
                            </span>
                        </span>
                    </div>
                </template>
                <template #action_table>
                    <div>
                        <a v-if="hasPermission('admin_archive')" :href="exported()"
                           style="padding: 8px; cursor: pointer" class="item d-block">
                            <i class="el-icon-download"></i>
                            {{ $t("archive.export_file") }}
                        </a>
                        <div v-if="hasPermission('admin_archive')" class="item" style="padding: 8px">
                            <upload archive oneFile @changeFileList="fileList" @success="Refresh"
                                    :url="`archive/import/${$store.getters['archive/currentId']?$store.getters['archive/currentId']: 0}`">
                                <template #upload-content>
                                    <i class="el-icon-upload"></i>
                                    {{$t('archive.Import_Files')}}
                                </template>
                            </upload>
                        </div>
                        <CDropdownDivider></CDropdownDivider>
                        <a v-if="hasPermission('admin_archive')" :href="downloadAll($store.getters['archive/currentId'])"
                           style="padding: 8px; cursor: pointer;" class="item d-block">
                            <i class="el-icon-download"></i>
                            {{ $t("archive.download_all") }}
                        </a>
                        <a v-if="hasPermission('admin_archive')" :href="downloadFiles()"
                           style="padding: 8px; cursor: pointer" class="item d-block">
                            <i class="el-icon-download"></i>
                            {{ $t("archive.download_files") }}
                        </a>
                        <div v-if="selectedPaths.length > 0" style="width: 107%;">
                            <CDropdownDivider></CDropdownDivider>
                            <div @click="move" style="padding: 8px; cursor: pointer; text-align: initial"
                                 class="item">
                                <i class="el-icon-document-add"></i> {{$t('archive.move')}}
                            </div>
                            <div @click="paste" style="padding: 8px; cursor: pointer; text-align: initial"
                                 class="item">
                                <i class="el-icon-document-copy"></i> {{$t('archive.paste')}}
                            </div>
                            <div @click="resetSelected()" style="padding: 8px; cursor: pointer; text-align: initial"
                                 class="item">
                                <i class="el-icon-refresh"></i> {{$t('archive.resetItem')}}
                            </div>
                        </div>
                        <CDropdownDivider></CDropdownDivider>
                        <div @click="openDialog()" style="padding: 8px; cursor: pointer" class="item">
                            <i class="el-icon-folder-add"></i> {{$t('archive.addItem')}}
                        </div>
                        <div class="item" style="padding: 8px">
                            <upload archive @changeFileList="fileList" @success="Refresh"
                                    :url="`archive/upload/${$store.getters['archive/currentId']?$store.getters['archive/currentId']: 0}`">
                                <template #upload-content>
                                    <i class="el-icon-upload"></i>
                                    {{$t('archive.uploadFiles')}}
                                </template>
                            </upload>
                        </div>
                    </div>
                </template>
                <template #filter_table>
                    <div class="ml-2 mr-2 mb-2 fullWidth">
                        <el-select :no-data-text="$t('Global.nodata')" v-model="search_type" style="width: 100%">
                            <el-option class="el-input" value="0" :label="$t('Global.folder')">
                                          <span style="float: right; color: #8492a6; font-size: 13px">
                                           {{ $t('Global.folder')}}
                                        </span>
                            </el-option>
                            <el-option class="el-input" value="1" :label="$t('Global.subfolder')">
                                          <span style="float: right; color: #8492a6; font-size: 13px">
                                           {{ $t('Global.subfolder')}}
                                        </span>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ml-2 mr-2 mb-2 fullWidth">
                        <el-select :no-data-text="$t('Global.nodata')" clearable v-model="content" style="width: 100%">
                            <el-option v-for="content in contentTypeMap" :value="content.value" :label="content.label">
                                          <span style="float: right; color: #8492a6; font-size: 13px">
                                           {{ content.label}}
                                        </span>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ml-2 mr-2 mb-2 fullWidth">
                        <el-select :no-data-text="$t('Global.nodata')" clearable v-model="type" style="width: 100%">
                            <el-option :value="0" :label="$t('Global.folder')">
                                          <span style="float: right; color: #8492a6; font-size: 13px">
                                           {{ $t('Global.folder')}}
                                            <fa-icon :icon="['fas', 'folder']" size="lg"/>
                                        </span>
                            </el-option>
                            <el-option :value="1" :label="$t('Global.page')">
                                          <span style="float: right; color: #8492a6; font-size: 13px">
                                           {{ $t('Global.page')}}
                                            <fa-icon :icon="['fas', 'file-code']" size="lg"/>
                                        </span>
                            </el-option>
                            <el-option :value="2" :label="$t('Global.file')">
                                          <span style="float: right; color: #8492a6; font-size: 13px">
                                           {{ $t('Global.file')}}
                                            <fa-icon :icon="['fas', 'file-alt']" size="lg"/>
                                        </span>
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template #cols>
                    <el-table-column prop="id" sortable width="80" label="#"></el-table-column>
                    <el-table-column prop="order" sortable width="80" :label="$t('archive.order')"></el-table-column>
                    <el-table-column prop="title" width="450" :label="$t('archive.name')">
                        <template slot-scope="scope">
                            <div @click="goToNext(scope.row)" v-if="scope.row.type === 0" class="path">
                                <fa-icon :icon="['fas', 'folder']" size="lg" class="mr-2 ml-2" :class="actionStyle(scope.row.flags)"/>
                                {{ scope.row.title }}
                                <span style="font-weight: bold; color: #555555" v-if="scope.row.short_name">{{ `(${scope.row.short_name})` }}</span>
                                <span style="font-weight: bold; color: #555555" v-if="scope.row.sub_title">{{ `${scope.row.sub_title}` }}</span>
                            </div>
                            <div v-else-if="scope.row.type === 2">
                                <a :href="scope.row.url" download target="_blank"
                                   v-if="['jpg','png','jpeg','svg'].includes(scope.row.extension)">
                                    <!--                                    <img :src="`${baseUrl}archive/download/${scope.row.id}`"-->
                                    <!--                                         style=" width: 30px;height: 30px;vertical-align: middle;border-radius: 50%;"/>-->
                                    <img :src="scope.row.url"
                                         style=" width: 30px;height: 30px;vertical-align: middle;border-radius: 50%;"/>
                                    {{ scope.row.title }}
                                    <span style="font-weight: bold; color: #555555" v-if="scope.row.short_name">{{ `(${scope.row.short_name})` }}</span>
                                </a>
                                <el-tooltip placement="top" :content="scope.row.title" v-else>
                                    <div class="text-truncate" >
                                        <fa-icon
                                                v-if="scope.row.extension != 'html' && !['jpg','png','jpeg'].includes(scope.row.extension)"
                                                :icon="['fas', 'file-alt']" size="lg" :class="actionStyle(scope.row.flags)"/>
                                        <fa-icon v-if="scope.row.extension == 'html'" :icon="['fas', 'file-code']"
                                                 size="lg" :class="actionStyle(scope.row.flags)"/>
                                        <span >{{ scope.row.title }}</span>
                                        <span style="font-weight: bold; color: #555555" v-if="scope.row.short_name">{{ `(${scope.row.short_name})` }}</span>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div v-else>
                                <i class="el-icon-document-checked"
                                   style="font-size: 20px; margin: 0px 8px" :class="actionStyle(scope.row.flags)"></i>
                                {{ scope.row.title.replace(".html", "") }}
                                <span style=" color: #555555" v-if="scope.row.short_name">{{ `(${scope.row.short_name})` }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" sortable :label="$t('archive.type')">
                        <template slot-scope="scope">
                            <div v-if="scope.row.type === 0" style="font-weight: bold"><span
                                    v-if="scope.row.content_type">{{capitalize(scope.row.content_type)}}</span>
                                <span v-else>-</span>
                            </div>
                            <div v-else style="font-weight: bold">
                                {{ capitalize(scope.row.type) ? capitalize(scope.row.type) : "-" }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="size" sortable :label="$t('archive.size')">
                        <template slot-scope="scope">
                            <div style="font-weight: bold">
                                <span v-if="scope.row.size < 1048576">{{ scope.row.size > 0 ? Math.ceil(scope.row.size / 1024) + " KB" : "-" }}</span>
                                <span v-else>{{ scope.row.size > 0 ? Math.ceil(scope.row.size / 1048576) + " MB" : "-" }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created_at" sortable :label="$t('archive.date')">
                        <template slot-scope="scope">
                            <div style="font-weight: bold">
                                {{ toLocalDatetime(scope.row.created_at) }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div >
                                <el-tooltip effect="dark" :content="$t('archive.editHtml')" placement="top-start"
                                            v-if="(hasPermission('edit_archive') && scope.row.type === 2) && scope.row.extension != 'html' && !['jpg','jpeg','png','svg'].includes(scope.row.extension)">
                                    <a :href="download(scope.row.id)" target="_blank" download>
                                        <i class="el-icon-download"
                                           style="margin-right: 10px; color: #321fdb"></i>
                                    </a>
                                </el-tooltip>
                                <el-tooltip effect="dark" :content="$t('archive.editHtml')" placement="top-start"
                                            v-if="(hasPermission('edit_archive') && (scope.row.type === 1 || scope.row.extension == 'html')) || (scope.row.type === 1 || scope.row.extension == 'html')">
                                    <router-link
                                            :to="{path: '/Management/archive/content',query: { id: scope.row.id,archiveId:archive_id },}">
                                        <i class="el-icon-edit-outline"
                                           style="margin-right: 10px; color: #321fdb"></i>
                                    </router-link>
                                </el-tooltip>
                                <el-tooltip  effect="dark" :content="$t('archive.updateFile')" placement="top-start"
                                            v-if="(scope.row.type === 2 && !insubmission && hasPermission('edit_archive')) " >
                                    <upload archive oneFile @changeFileList="fileList" @success="Refresh"
                                            :url="`archive/update/${scope.row.id}`"
                                            style="display: inline">
                                        <template #upload-content>
                                            <i class="el-icon-refresh"
                                               style="margin-right: 10px; color: #321fdb"></i>
                                        </template>
                                    </upload>

                                </el-tooltip>
                                <el-tooltip  effect="dark" :content="$t('archive.rename')" placement="top-start" v-if="(!insubmission && hasPermission('edit_archive') ) ||scope.row.type === 1 ">
                                    <i class="el-icon-edit" @click="openDialog(true, scope.row)"
                                       style="margin-right: 10px"></i>
                                </el-tooltip>
                                <el-tooltip  effect="dark" :content="$t('archive.select')" placement="top-start" v-if="(!insubmission && hasPermission('admin_archive')) ||scope.row.type === 1 ">
                                    <i :class=" selectedPaths.includes(scope.row.id) ? 'el-icon-circle-check' : 'el-icon-circle-plus-outline'"
                                       :style=" selectedPaths.includes(scope.row.id)? 'margin-right: 10px;  color:#76ba1b' : 'margin-right: 10px; color:#321fdb'"
                                       @click="select(scope.row.id)"></i>
                                </el-tooltip>
                                <el-tooltip effect="dark" :content="$t('archive.delete')" placement="top-start" v-if="(!insubmission && hasPermission('delete_archive')) ||scope.row.type === 1 ">
                                    <i class="el-icon-delete mr-2 ml-2" @click="deleteB(scope.row.id)"></i>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </template>
            </DataTable>
        </CCol>
        <div>
            <el-dialog :title="title" :visible.sync="folderDialog" :close-on-click-modal="false" top="4vh">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <div :style="edit?'': 'display:flex'">
                        <el-form-item prop="type" style="width: 50% ; margin: 10px 3px;">
                            <el-select v-model="ruleForm.type" style="width: 100%;" v-if="!edit">
                                <el-option :value="0" :label="$t('Global.folder')">
                                 <span style="float: right; color: #8492a6; font-size: 13px">
                                           {{ $t('Global.folder')}}
                                            <fa-icon :icon="['fas', 'folder']" size="lg"/>
                                   </span>
                                </el-option>
                                <el-option :value="1" :label="$t('Global.page')">
                                 <span style="float: right; color: #8492a6; font-size: 13px">
                                           {{ $t('Global.page')}}
                                            <fa-icon :icon="['fas', 'file-code']" size="lg"/>
                                        </span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="binaryName" :style="edit? 'width: 100%;  margin: 10px 3px;' : 'width: 50%;  margin: 10px 3px;'">
                            <el-input :placeholder="$t('archive.title')" v-model="ruleForm.binaryName"
                                      style="width: 100%;"  :disabled="edit && !ruleForm.writable"></el-input>
                        </el-form-item>
                    </div>
                    <div style="display: flex" class="mb-3">
                        <el-input :placeholder="$t('archive.sub_title')" v v-model="ruleForm.subTitle"
                                  style="width: 50%;  margin: 10px 3px;" :disabled="edit && !ruleForm.writable"></el-input>
                        <el-form-item prop="shortName" style="width: 50%;  margin: 10px 3px;">
                            <el-input :placeholder="$t('archive.short_name')" v-model="ruleForm.shortName"
                                      style="width: 100%"  :disabled="edit && !ruleForm.writable"></el-input>
                        </el-form-item>
                    </div>
                    <el-input type="textarea" :placeholder="$t('archive.description')" v-model="ruleForm.description"
                              style="width: 100%; margin-bottom: 10px"  maxlength="200"
                              show-word-limit  :disabled="edit && !ruleForm.writable"></el-input>

                    <div style="display: flex">
                        <el-select style="width: 50%; margin: 10px 3px;" v-model="ruleForm.contentType"
                                   v-if="ruleForm.type === 0" clearable filterable allow-create
                                   :placeholder="$t('archive.content_type')" :disabled="edit && !ruleForm.writable">
                            <el-option :key="i" v-for="(item, i) in contentTypeMap" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <el-form-item prop="link" style="width: 50%;  margin: 10px 3px;">
                            <el-input :placeholder="$t('archive.link')" v-model="ruleForm.archive_link"
                                      style="width: 100%"  :disabled="edit && !ruleForm.writable"></el-input>
                        </el-form-item>
                    </div>
                    <div style="display: flex">
                        <el-form-item prop="role" style="width: 50%; margin: 10px 3px;">
                            <el-select ref="role" :no-data-text="$t('Global.nodata')" :placeholder="$t('roles.selectRole')"
                                       style="width: 100%" v-model="ruleForm.roles" filterable multiple  :disabled="edit && !ruleForm.writable">
                                <el-option
                                        v-for="(role) in $store.getters['archive/roles']"
                                        :key="role.id"
                                        :label="role.name"
                                        :value="role.id"
                                >
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  {{ role.name}}
                                  <i class="el-icon-user-solid"></i>
                                </span>
                                </el-option>
                                <template #empty>
                                    <div class="text-center" style="padding: 10px; font-weight: bold">
                                        {{ $t('Global.nodata') }}
                                    </div>
                                </template>
                            </el-select>
                        </el-form-item>
                        <el-form-item  prop="date" style="width: 50%; margin: 10px 3px;">
                            <el-date-picker format="yyyy-MM-d" value-format="yyyy-MM-d" clearable style="width: 100%;"
                                            v-model="ruleForm.created_at" type="date"
                                            :placeholder="$t('archive.date')"  :disabled="edit && !ruleForm.writable"></el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="d-flex content-center">
                        <el-checkbox v-model="ruleForm.visible" style="width: 50%">{{$t('archive.visible')}}</el-checkbox>
                        <el-checkbox v-model="ruleForm.writable"  style="width: 50%">{{$t('archive.writable')}}</el-checkbox>
                    </div>
                    <el-form-item prop="user" style=" margin: 10px 3px;">
                        <el-select ref="users" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.users')"
                                   style="width: 100%" v-model="ruleForm.users_ids" filterable multiple remote
                                   reserve-keyword :remote-method="search"
                                   :loading="$store.getters['archive/usersLoad']" :disabled="edit && !ruleForm.writable">
                            <el-option v-for="user in users" :key="user.id" :label="user.ar_name" :value="user.id">
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  {{ user.ar_name}}
                                  <i class="el-icon-user-solid"></i>
                                </span>
                            </el-option>
                            <el-option
                                    v-for="(user) in $store.getters['archive/users']"
                                    v-if="ruleForm.users_ids?!ruleForm.users_ids.includes(user.id):true"
                                    :key="user.id"
                                    :label="user.ar_name"
                                    :value="user.id"
                            >
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  {{ user.ar_name}}
                                  <i class="el-icon-user-solid"></i>
                                </span>
                            </el-option>
                            <template #empty>
                                <div class="text-center" style="padding: 10px; font-weight: bold">
                                    {{ $t('Global.nodata') }}
                                </div>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="mr-2 mt-2" type="primary" @click="createOrUpdate('ruleForm')">
                            {{ edit ? $t("archive.update") : $t("archive.add") }}
                        </el-button>
                        <el-button class="mr-2 ml-0 mt-2" @click="resetForm('ruleForm');folderDialog = false;">
                            {{ $t("archive.cancel") }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
<!--            <el-dialog :title="$t('Global.uploadLetterQulityFile')" :visible.sync="openDocsDialog" width="90%">-->
<!--                <el-card class="box-card docs_body" v-if="reRender">-->
<!--                    <div slot="header" class="text-initial d-flex justify-content-between">-->
<!--                        <span>{{ $t('Global.uploadDocsPrimary') }}</span>-->
<!--                        <div class="resetButton d-inline" style="flex-grow: unset;">-->
<!--                            <button class="el-button el-button&#45;&#45;default is-round base_color" @click="RefreshAll" type="reset" style="padding: 0.6rem 1rem;">-->
<!--                                <i class="el-icon-refresh"></i>-->
<!--                                Reset-->
<!--                            </button>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <FormUpload :key="num" v-for="num in 10" :type="num == 8 ? 'video' : 'file'" :label="num" @getFile="upload"></FormUpload>-->
<!--                </el-card>-->
<!--                <el-card class="box-card mt-4 docs_body">-->
<!--                    <div slot="header" class="text-initial">-->
<!--                        <span>{{ $t('Global.uploadDocsSupport') }}</span>-->

<!--                    </div>-->
<!--                    <FormUpload type="zipFile" :label="11" @getFile="upload"></FormUpload>-->
<!--                </el-card>-->
<!--                <div style="width:100%" class="d-flex mt-2">-->
<!--                    <button class="el-button el-button&#45;&#45;default is-round sec_color mx-1" @click="importApiData()" style="padding: 0.6rem 1rem;">-->
<!--                        <i class="el-icon-check-circle"></i> <CSpinner v-if="isLoad" color="default" size="sm" />-->
<!--                        {{ $t('Global.upload') }}-->
<!--                    </button>-->
<!--                </div>-->
<!--            </el-dialog>-->
        </div>
    </CRow>
</template>

<script>
    import {getToken} from "../../../utils/auth";
    import upload from "../../components/upload";
    import FormUpload from "../../components/FormUpload";
    import {toLocalDatetime, formatDatetime} from '../../../utils/helper';
    import DataTable from "../../components/DataTable";
    const axios = require('axios');
    export default {
        name: "index",
        props: {
            archive_id: {default: 0, type: Number},
            insubmission: {
                type: Boolean,
                required: false
            },
            notArchiveRoot: {
                type: Boolean,
                required: false,
            }
        },
        components: {
            DataTable,
            upload,
            FormUpload
        },
        data() {
            let checkShortName = (rule, value, callback) => {
                if (this.checkShortName == value) {
                    callback();
                } else {
                    if (value || value != "") {
                        return this.$store
                            .dispatch("archive/checkShortName", {
                                name: value,
                                id: this.$store.getters["archive/currentId"]
                                    ? this.$store.getters["archive/currentId"]
                                    : 0,
                            })
                            .then((response) => {
                                if (this.$store.state.archive.checkShortName.exist == false) {
                                    return true;
                                } else {
                                    return callback(new Error(this.$t('Global.item_exist')));
                                }
                            });
                    } else {
                        callback();
                    }
                }
            };
            return {
                errorFile:false,
                reRender:true,
                isLoad:false,
                file:[],
                file_list:[],
                supportFiles:null,
                openDocsDialog:false,
                showUpload: false,
                uploadingFile: [],
                progress:0,
                rules: {
                    shortName: [{validator: checkShortName, trigger: "blur"}],
                    binaryName: [
                        {
                            required: true,
                            message: this.$t('Global.item_required'),
                            trigger: "blur",
                        },
                    ],
                },
                baseUrl: process.env.VUE_APP_BASE_URL, //'https://naqaae.fekracomputers.net/api/v1/',  //,
                folderDialog: false,
                checkShortName: "",
                title: "",
                edit: false,
                selectedPaths: [],
                contentTypeMap: [
                    {
                        value: "section",
                        label: "Section",
                    },
                    {
                        value: "mainSection",
                        label: "Main Section",
                    },
                    {
                        value: "group",
                        label: "Group",
                    },
                    {
                        value: "folder",
                        label: "Folder",
                    },
                    {
                        value: "gallery",
                        label: "Gallery",
                    },
                    {
                        value: "tree",
                        label: "Tree",
                    },
                    {
                        value: "files",
                        label: "Files",
                    },
                    {
                        value: "modules",
                        label: "Modules",
                    },
                    {
                        value: "banner",
                        label: "Banner",
                    },
                ],
                ruleForm: {
                    contentType: "",
                    subTitle: "",
                    description: "",
                    shortName: "",
                    created_at: null,
                    users_ids: null,
                    roles: null,
                    binaryName: "",
                    archive_link: "",
                    type: "",
                    visible: false,
                    writable: false,
                },
                search_type: "0",
                type: null,
                users: [],
                content: null,
                show: true,
                locale: this.$i18n.locale,
                ifNotMobile: true,
                width: 0,
                listOffile:[],
                error:false,
                uploadPercentage:0
            };
        },
        watch: {
            locale: function (val) {
                this.Refresh();
                if (this.$store.getters["archive/currentId"]) {
                    this.$store.dispatch("archive/getParents", {
                        id: this.$store.getters["archive/currentId"],
                        locale: val
                    });
                }
            },
            width: function (val) {
                if (this.width < 720) {
                    this.ifNotMobile = false;
                } else {
                    this.ifNotMobile = true;
                }
            }
        },
        beforeMount() {
            if (!this.notArchiveRoot) {
                if (this.$store.state.archive.editorParent) {
                    this.goToNext(this.$store.state.archive.editorParent)
                } else {
                    this.$store.commit("archive/SET_CURRENT_ID", 0);
                    this.$store.commit("archive/SET_PARENTS", []);
                }
            } else {
                if (this.$store.state.archive.editorParent) {
                    this.goToNext(this.$store.state.archive.editorParent)
                } else {
                    this.$store.commit("archive/SET_CURRENT_ID", this.archive_id);
                    this.$store.commit("archive/SET_PARENTS", []);
                }
            }
        },
        mounted() {
            this.usersRoles();
        },

        created() {
            window.addEventListener("resize", this.handleResize);
            this.handleResize();
        },
        destroyed() {
            this.$store.commit("archive/SET_CURRENT_ID", null);
            this.$store.commit("archive/SET_EDITOR_PARENT", null);
            window.removeEventListener("resize", this.handleResize);

        },
        methods: {

            RefreshAll(){
                this.file_list = [];
                this.supportFiles = null
            },

            importApiData(){
                if(this.file_list.length >= 10){
                    let formData = new FormData();
                    this.file_list.forEach((element, i) => {
                        formData.append('docs[' + i + ']', element.file);
                    });
                    if(this.supportFiles)formData.append('docs[10]',this.supportFiles.file)
                    this.showUpload = true;
                    axios.post(`${this.baseUrl}submissions/submission/upload_documents/${this.$route.params.submission_id}/2`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Accept: 'application/json',
                            Authorization: `Bearer ${getToken()}`,
                        },
                        onUploadProgress: function(progressEvent) {
                            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                        }.bind(this),
                    }).then(function(res) {
                        this.showUpload = false;
                        this.openDocsDialog = false;
                        this.Refresh();
                    }.bind(this))
                }else{
                    this.$notify.error({
                        title: 'خطأ',
                        message: ' برجاء رفع جميع الوثائق الأساسية ',
                    });
                }
            },
            upload(file,index){
                if(index == 11) {
                    this.supportFiles = file
                }else{
                    this.file_list[index-1]  = file
                }
            },
            fileList(files,progress) {
                this.uploadingFile = files;
                this.progress = progress;
                this.showUpload = true;
            },

            handleResize() {
                this.width = window.innerWidth;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            toLocalDatetime(date) {
                return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`)
            },
            Refresh(query) {
                if (this.insubmission) {
                    this.$store.dispatch('notes/subState', this.$route.params.submission_id);
                }
                query = {...query, language: this.$i18n.locale,order_direction:'ASC'};
                query = {query: query, id: this.$store.getters["archive/currentId"]};
                this.$store.dispatch("archive/getArchive", query).then(() => {
                    this.showUpload = false
                });
            },
            capitalize(str) {
                if (typeof str !== "string") return "";
                return str.charAt(0).toUpperCase() + str.slice(1);
            },
            goToNext(item) {
                this.$store.commit("archive/SET_CURRENT_ID", item.id);
                item.id ? this.$store.dispatch("archive/getParents", {
                    id: item.id,
                    locale: this.locale,
                    root_id: this.archive_id
                }) : this.$store.commit("archive/SET_PARENTS", []);
                this.Refresh();
            },
            createOrUpdate(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!this.edit) {
                            this.$store
                                .dispatch("archive/createDirectories", {
                                    resource: {
                                        parent_id: this.$store.getters["archive/currentId"]
                                            ? this.$store.getters["archive/currentId"]
                                            : 0,
                                        title: this.ruleForm.binaryName,
                                        description: this.ruleForm.description,
                                        sub_title: this.ruleForm.subTitle,
                                        content_type: this.ruleForm.contentType,
                                        archive_link: this.ruleForm.archive_link,
                                        created_at: this.ruleForm.created_at,
                                        users_ids: this.ruleForm.users_ids,
                                        roles: this.ruleForm.roles,
                                        short_name: this.ruleForm.shortName,
                                        language: this.$i18n.locale,
                                        type: this.ruleForm.type,
                                        visible: this.ruleForm.visible,
                                        writable: this.ruleForm.writable,
                                    },
                                })
                                .then((response) => {
                                    this.folderDialog = false;
                                    this.Refresh();
                                });
                        } else {
                            this.$store
                                .dispatch("archive/rename", {
                                    resource: {
                                        parent_id: this.$store.getters["archive/currentId"]
                                            ? this.$store.getters["archive/currentId"]
                                            : 0,
                                        title: this.ruleForm.binaryName,
                                        description: this.ruleForm.description,
                                        sub_title: this.ruleForm.subTitle,
                                        content_type: this.ruleForm.contentType,
                                        archive_link: this.ruleForm.archive_link,
                                        users_ids: this.ruleForm.users_ids,
                                        created_at: this.ruleForm.created_at,
                                        roles: this.ruleForm.roles,
                                        short_name: this.ruleForm.shortName,
                                        language: this.$i18n.locale,
                                        type: this.ruleForm.type,
                                        visible: this.ruleForm.visible,
                                        writable: this.ruleForm.writable,
                                    },
                                    id: {
                                        id: this.id,
                                    },
                                })
                                .then((response) => {
                                    this.folderDialog = false;
                                    this.Refresh();
                                });
                        }
                    } else {
                        return false;
                    }
                });
            },
            deleteB(id) {
                this.$confirm(
                    this.$t('Global.deleteArchiveMessage'),
                    "Warning",
                    {
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        type: "warning",
                    }
                ).then(() => {
                    this.$store
                        .dispatch("archive/delete", {
                            resource: {
                                id: id,
                            },
                        })
                        .then((response) => {
                            this.Refresh();
                        });
                });
            },
            openDialog(edit = false, item) {
                if (!edit) {
                    this.id = item ? item.id : null;
                    this.title = this.$t("archive.folderDialogTitle");
                } else {
                    this.checkShortName = item ? item.short_name : "";
                    this.id = item ? item.id : null;
                    if (item.type === "folder") {
                        this.title = this.$t("archive.Rename_Folder_Title");
                    } else {
                        this.title = this.$t("archive.Rename_File_Title");
                    }
                }
                this.edit = edit;
                this.ruleForm.type = item ? item.type : 0;
                this.ruleForm.visible = (item && (item.flags === 3 || item.flags === 1)) ? true : false,
                    this.ruleForm.writable = (item && (item.flags === 3 || item.flags === 2)) ? true : false,
                    this.ruleForm.binaryName = item ? item.title : "";
                this.ruleForm.shortName = item ? item.short_name : "";
                this.ruleForm.created_at =  item ? item.created_at : null;
                this.ruleForm.archive_link = item ? item.archive_link : "";
                this.ruleForm.subTitle = item ? item.sub_title : "";
                this.ruleForm.description = item ? item.description : "";
                this.ruleForm.contentType = item ? item.content_type : "";
                this.ruleForm.users_ids = item ? Array.from(item.users, user => user.id) : null;
                this.users = item ? item.users : null;
                this.ruleForm.roles = item ? item.roles : null;
                this.folderDialog = true;
            },
            exported() {
                let id = this.$store.getters["archive/currentId"] ? this.$store.getters["archive/currentId"] : 0;
                return `${this.baseUrl}archive/export/${id}?token=${getToken()}`;
            },
            download(id) {
                return `${this.baseUrl}archive/download/${id}`;
            },
            downloadAll(id) {
                if (!id) {
                    return `${this.baseUrl}archive/zip/all/0?token=${getToken()}`;
                } else {
                    return `${this.baseUrl}archive/zip/all/${id}?token=${getToken()}`;
                }
            },
            downloadFiles() {
                let id = this.$store.getters["archive/currentId"] ? this.$store.getters["archive/currentId"] : 0;
                return `${this.baseUrl}archive/zip/files/${id}?token=${getToken()}`;
            },
            select(id) {
                if (!this.selectedPaths.includes(id)) {
                    this.selectedPaths.push(id);
                } else {
                    for (var i = 0; i < this.selectedPaths.length; i++) {
                        if (this.selectedPaths[i] === id) {
                            this.selectedPaths.splice(i, 1);
                        }
                    }
                }
            },
            resetSelected() {
                this.selectedPaths = [];
            },
            actionStyle(flags){
                switch (Number(flags)) {
                    case 0:
                        return 'can-not-all';
                    case 1:
                        return  'can-not-writable';
                    case 2:
                        return  'can-not-visible';
                }
            },
            move() {
                this.$store.dispatch("archive/move", {
                    marked_ids: this.selectedPaths,
                    currentId: this.$store.getters["archive/currentId"]
                        ? this.$store.getters["archive/currentId"]
                        : 0,
                }).then((response) => {
                    this.Refresh();
                    this.$message({
                        message: this.$t('Global.moveMessage'),
                        type: "success",
                        duration: 2 * 1000,
                    });
                    this.resetSelected();
                });
            },
            paste() {
                this.$store
                    .dispatch("archive/paste", {
                        marked_ids: this.selectedPaths,
                        currentId: this.$store.getters["archive/currentId"]
                            ? this.$store.getters["archive/currentId"]
                            : 0,
                    })
                    .then((response) => {
                        this.Refresh();
                        this.$message({
                            message: this.$t('Global.pasteMessage'),
                            type: "success",
                            duration: 2 * 1000,
                        });
                        this.resetSelected();
                    });
            },
            usersRoles(search = '', limit = 10) {
                this.$store.dispatch('archive/usersRoles', {query: {search_text: search, limit: limit}})
            },
            search(query) {
                this.usersRoles(query)
            },
            sort(columns) {
                if (columns.first != "" && columns.second != "") {
                    if (columns.first.order < columns.second.order) {
                        this.$store
                            .dispatch("archive/reOrder", {
                                fid: columns.first.id,
                                sid: columns.second.id,
                                ordertype: "after",
                                pid: {
                                    parent_id: this.$store.getters["archive/currentId"],
                                },
                            })
                            .then(() => {
                                this.Refresh();
                            });
                    } else {
                        this.$store
                            .dispatch("archive/reOrder", {
                                fid: columns.first.id,
                                sid: columns.second.id,
                                ordertype: "before",
                                pid: {
                                    parent_id: this.$store.getters["archive/currentId"],
                                },
                            })
                            .then(() => {
                                this.Refresh();
                            });
                    }
                }
            }
        },
        computed:{
            spasificFile:function(){
                return this.file;
            }
        }
    };
</script>

<style lang="scss" scoped >
    .item{
        i{
            font-style: normal ;
        }
    }
    .item:hover {
        background-color: #dddddd;
    }

    .path {
        color: #173f5f !important;
        cursor: pointer !important;
        font-weight: bold !important;
    }

    a {
        display: inline-block;
        cursor: pointer;
    }

    .option {
        float: right;
        width: 100%;
        justify-content: right;
        text-align: right;
        margin: 0px 16px;
    }

    .activeBread {
        opacity: 0.7;
        font-weight: lighter;
    }
    .can-not-writable{
        color: #0d86ff;
    }
    .can-not-visible{
        opacity: 0.5;
        color: #5daf34;
    }
    .can-not-all{
        color: #ce0c0c;
    }

</style>

<style lang="scss">
    .el-upload-list__item .el-progress{
        top: -9px;
    }
    .toast-header {
        justify-content: space-between;

        strong {
            margin: 0 !important;
        }
    }

    .toaster {
        z-index: 99999;
    }

    .disabled {
        cursor: not-allowed !important;
        pointer-events: all !important;
    }
</style>
