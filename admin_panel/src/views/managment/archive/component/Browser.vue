<template>
    <div>
        <el-row>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions customFlex' : ''" style="display: flex">
                <div><i :class=" $i18n.locale === 'ar' ? `el-icon-caret-left`: `el-icon-caret-right`"></i>
                    <span>{{$store.getters["archive/parentsBrowser"].length == 0 ? $i18n.locale == 'en'? 'Archive' : 'الأرشيف' : ""}}</span>
                    <span :key="index" v-for="(item, index) in $store.getters['archive/parentsBrowser']">
                                <span @click="goToNext(item)" class="path"
                                      v-if="item !== $store.getters['archive/parentsBrowser'][$store.getters['archive/parentsBrowser'].length - 1]">
                                  {{item.title === 'Archive' ? $t('Global.archive') :item.title }}
                                </span>
                                <span v-if="item !== $store.getters['archive/parentsBrowser'][$store.getters['archive/parentsBrowser'].length - 1]">
                                  {{ " / " }}
                                </span>
                                <span v-else>
                                  {{$store.getters["archive/parentsBrowser"].length == 0 ?  $i18n.locale == 'en'? 'Archive' : 'الأرشيف' : item.title}}
                                </span>
                            </span>
                </div>
                <div :style="$i18n.locale === 'en' ? 'display:flex;' : ''">
                    <CSpinner v-if="$store.state.archive.loadingUpload" size="sm" class="mr-2 ml-2" color="info"/>
                    <CDropdown color="success" placement="bottom-end" size="sm" class="customDrop">
                        <template #toggler-content>
                            <CIcon name="cil-settings"/>
                            {{$t('Global.action')}}
                            <CBadge color="info" v-if="selectedPaths.length > 0">{{ selectedPaths.length }}
                                {{$t('Global.items')}}
                            </CBadge>
                        </template>
                        <a :href="exported()"
                           style="padding: 8px; cursor: pointer" class="item d-block">
                            <i class="el-icon-download"></i>
                            {{ $t("archive.export_file") }}
                        </a>
                        <div class="item" style="padding: 8px">
                            <upload @success="Refresh"
                                    :url="`archive/import/${  this.$store.getters['archive/currentIdBrowser']? this.$store.getters['archive/currentIdBrowser']: 0}`">
                                <template #upload-content>
                                    <i class="el-icon-upload"></i>
                                    {{$t('archive.Import_Files')}}
                                </template>
                            </upload>
                        </div>
                        <CDropdownDivider></CDropdownDivider>
                        <a :href="downloadAll($store.getters['archive/currentIdBrowser'])"
                           style="padding: 8px; cursor: pointer;" class="item d-block">
                            <i class="el-icon-download"></i>
                            {{ $t("archive.download_all") }}
                        </a>
                        <a :href="downloadFiles()"
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
                            <upload @success="Refresh"
                                    :url="`archive/upload/${this.$store.getters['archive/currentIdBrowser']? this.$store.getters['archive/currentIdBrowser']: 0}`">
                                <template #upload-content>
                                    <i class="el-icon-upload"></i>
                                    {{$t('archive.uploadFiles')}}
                                </template>
                            </upload>
                        </div>
                    </CDropdown>
                </div>
            </div>
        </el-row>
        <el-row dir="ltr">
            <div v-model="locale = $i18n.locale"></div>
            <div v-loading="$store.getters['archive/archiveLoad']">
                <el-card :key="index" v-for="(item, index) in $store.getters['archive/binaries']"
                         class="folder centerIcons"
                         :style=" $store.getters['archive/selectedItem'].includes(item) ? 'box-shadow: 0 6px 15px 0 #0000ff9e;': '' ">
                    <div v-if="item.type === 0" @click="goToNext(item)">
                        <fa-icon color="#173f5f" :icon="['fas', 'folder']" size="3x"/>
                        <el-tooltip effect="dark"
                                    :content="item.short_name? `${item.title}(${item.short_name})`:item.title"
                                    placement="top-start">
                            <span style="display: block; text-align: center" class="name">{{ item.title }}</span>
                        </el-tooltip>
                    </div>
                    <div v-else-if="item.type === 2" @click="selectedItem(item)">
                        <div>
                            <fa-icon v-if="item.extension != 'html' && !['jpg','png','jpeg'].includes(item.extension)"
                                     :icon="['fas', 'file-alt']" size="3x"/>
                            <fa-icon v-if="item.extension == 'html'" :icon="['fas', 'file-code']"
                                     size="3x"/>
                            <img v-if="['jpg','png','jpeg','svg'].includes(item.extension)"
                                 :src="`${baseUrl}archive/download/${item.id}`"
                                 style=" width: 47px;height: 47px;vertical-align: middle;border-radius: 50%;"/>
                            <el-tooltip effect="dark"
                                        :content="item.short_name? `${item.title}(${item.short_name})`:item.title"
                                        placement="top-start">
                            <span style="display: block; text-align: center" class="name">
                                {{ item.title }}
                                 <span style="font-weight: bold; color: #555555" class="name" v-if="item.short_name">{{ `(${item.short_name})` }}</span>
                            </span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div v-else class="centerIcons folder">
                        <fa-icon :icon="['fas', 'file-code']" size="3x"/>
                        <el-tooltip effect="dark"
                                    :content="item.short_name? `${item.title}(${item.short_name})`:item.title"
                                    placement="top-start">
                            <span style="display: block; text-align: center" class="name">{{item.title}}</span>
                        </el-tooltip>
                    </div>
                    <hr/>
                    <div style="justify-content: center; text-align: center; width: 100%;">
                        <el-tooltip effect="dark" content="DELETE " placement="top-start">
                            <i class="el-icon-delete mr-2 ml-2" @click="deleteB(item.id)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="RENAME " placement="top-start">
                            <i class="el-icon-edit" @click="openDialog(true, item)"
                               style="margin-right: 10px;"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="SELECT " placement="top-start">
                            <i :class="selectedPaths.includes(item.id)? 'el-icon-circle-check': 'el-icon-circle-plus-outline'"
                               :style=" selectedPaths.includes(item.id)? 'margin-right: 10px; color:#321fdb': 'margin-right: 10px; '"
                               @click="select(item.id)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="UPDATE FILE" placement="top-start" v-if="item.type === 2">
                            <upload @success="Refresh" :url="`archive/update/${item.id}`"
                                    style="display: inline">
                                <template #upload-content>
                                    <i class="el-icon-refresh"
                                       style="margin-right: 10px; color: #321fdb"></i>
                                </template>
                            </upload>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="DOWNLOAD FILE" placement="top-start" v-if="item.type === 2">
                            <a :href="download(item.id)">
                                <i class="el-icon-download" style="margin-right: 10px; color: #321fdb"></i>
                            </a>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="Edit Html File" placement="top-start"
                                    v-if="item.type === 1 || item.extension == 'html'">
                            <router-link :to="{path: '/Management/content',query: { id: item.id },}">
                                <i class="el-icon-edit-outline"
                                   style="margin-right: 10px; color: #321fdb"></i>
                            </router-link>
                        </el-tooltip>
                    </div>
                </el-card>
            </div>
        </el-row>
        <el-dialog :title="title" :visible.sync="folderDialog" :close-on-click-modal="false">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="type">
                    <el-select v-model="ruleForm.type" style="width: 100%;" v-if="!edit">
                        <el-option :value="0" label="Folder"></el-option>
                        <el-option :value="1" label="Page"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="binaryName">
                    <el-input :placeholder="$t('archive.title')" v-model="ruleForm.binaryName"
                              style="width: 100%;"></el-input>
                </el-form-item>
                <el-input :placeholder="$t('archive.sub_title')" v-model="ruleForm.subTitle"
                          style="width: 100%; margin-bottom: 20px"></el-input>
                <el-input :placeholder="$t('archive.description')" v-model="ruleForm.description"
                          style="width: 100%; margin-bottom: 20px"></el-input>
                <el-select style="width: 100%; margin-bottom: 20px" v-model="ruleForm.contentType"
                           v-if="ruleForm.type === 0" clearable filterable allow-create
                           :placeholder="$t('archive.content_type')">
                    <el-option :key="i" v-for="(item, i) in contentTypeMap" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-form-item prop="shortName">
                    <el-input :placeholder="$t('archive.short_name')" v-model="ruleForm.shortName"
                              style="width: 100%"></el-input>
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
    </div>
</template>

<script>
    import {getToken} from "../../../../utils/auth";
    import upload from "../../../components/upload";
    export default {
        name: "Browser",
        components: {upload},
        data() {
            var checkShortName = (rule, value, callback) => {
                if (this.checkShortName == value) {
                    callback();
                } else {
                    return this.$store
                        .dispatch("archive/checkShortName", {
                            name: value,
                            id: this.$store.getters["archive/currentIdBrowser"]
                                ? this.$store.getters["archive/currentIdBrowser"]
                                : 0,
                        })
                        .then((response) => {
                            if (this.$store.state.archive.checkShortName.exist == false) {
                                return true;
                            } else {
                                return callback(new Error("this short name is exist"));
                            }
                        });
                }
            };
            return {
                folderDialog: false,
                archive_id:null,
                rules: {
                    shortName: [{validator: checkShortName, trigger: "blur"}],
                    binaryName: [
                        {
                            required: true,
                            message: "Please input Activity name",
                            trigger: "blur",
                        },
                        {
                            min: 1,
                            max: 30,
                            message: "Length should be 3 to 5",
                            trigger: "blur",
                        },
                    ],
                },
                binaryName: "",
                currentPath: "archive",
                full: [],
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
                        value: "modules",
                        label: "Modules",
                    },
                    {
                        value: "banner",
                        label: "Banner",
                    },
                ],
                itemsPerPage: 5,
                title: "",
                edit: false,
                type: "",
                locale: this.$i18n.locale,
                editPath: "",
                selectedPaths: [],
                show: true,
                baseUrl: process.env.VUE_APP_BASE_URL,// 'https://naqaae.fekracomputers.net/api/v1/', //'http://localhost:8000/api/v1/',
                ruleForm: {
                    contentType: "",
                    subTitle: "",
                    description: "",
                    shortName: "",
                    binaryName: "",
                    type: "",
                },
            };
        },
        watch: {
            locale: function (val) {
                this.Refresh();
                if (this.$store.getters["archive/currentIdBrowser"]) {
                    this.$store.dispatch("archive/getParentsBrowser", {
                        id: this.$store.getters["archive/currentIdBrowser"],
                        locale: val
                    });
                }
            },
        },
        mounted() {
            this.initBrowserData();
        },

        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            exported() {
                let id = this.$store.getters["archive/currentIdBrowser"] ? this.$store.getters["archive/currentIdBrowser"] : 0;
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
                let id = this.$store.getters["archive/currentIdBrowser"] ? this.$store.getters["archive/currentIdBrowser"] : 0;
                return `${this.baseUrl}archive/zip/files/${id}?token=${getToken()}`;
            },
            initBrowserData() {
                // this.$store.dispatch('user/archive',{id:this.authUser().id , query:{lang:this.$i18n.locale}})
                let query = {
                    limit: 100,
                    language: this.$i18n.locale,
                };
                this.$store.dispatch("archive/getArchive", {query: query, id: this.$route.query.archiveId})
                    .then(() => {
                        this.$store.commit('archive/SET_LODGING_UPLOAD_IMG', false)
                    });
                this.$store.commit("archive/SET_PARENTS_BROWSER", []);
            },
            goToNext(item) {
                this.$store.commit("archive/SET_CURRENT_ID_BROWSER", item.id);
                let query = {
                    limit: 100,
                    offset: 0,
                    language: this.$i18n.locale,
                    search_text: "",
                };
                if (item.id == 0) {
                    this.$store.dispatch("archive/getArchive", {query: query, id: null});
                    this.$store.commit("archive/SET_PARENTS_BROWSER", []);
                } else {
                    this.$store.dispatch("archive/getArchive", {
                        query: query,
                        id: item.id,
                    });
                    this.$store.dispatch("archive/getParentsBrowser", {id: item.id, locale: this.locale});
                }
            },
            createOrUpdate(formName) {
                this.$refs[formName].validate((valid) => {
                    console.log(valid)
                    if (valid) {
                        if (!this.edit) {
                            this.$store
                                .dispatch("archive/createDirectories", {
                                    resource: {
                                        parent_id: this.$store.getters["archive/currentIdBrowser"]
                                            ? this.$store.getters["archive/currentIdBrowser"]
                                            : 0,
                                        title: this.ruleForm.binaryName,
                                        description: this.ruleForm.description,
                                        sub_title: this.ruleForm.subTitle,
                                        content_type: this.ruleForm.contentType,
                                        short_name: this.ruleForm.shortName,
                                        language: this.$i18n.locale,
                                        type: this.ruleForm.type,
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
                                        parent_id: this.$store.getters["archive/currentIdBrowser"]
                                            ? this.$store.getters["archive/currentIdBrowser"]
                                            : 0,
                                        title: this.ruleForm.binaryName,
                                        description: this.ruleForm.description,
                                        sub_title: this.ruleForm.subTitle,
                                        content_type: this.ruleForm.contentType,
                                        short_name: this.ruleForm.shortName,
                                        language: this.$i18n.locale,
                                        type: this.ruleForm.type,
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
                //   console.log("asdsdasfasfas", this.$store.getters["archive/currentId"]);
                this.$confirm( this.$t('Global.deleteArchiveMessage'), "Warning", {
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    type: "warning",
                }).then(() => {
                    this.$store
                        .dispatch("archive/delete", {resource: {id: id}})
                        .then((response) => {
                            //   console.log("asdsdasfasfas",this.$store.getters['archive/currentId'])
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
                this.ruleForm.binaryName = item ? item.title : "";
                this.ruleForm.shortName = item ? item.short_name : "";
                this.ruleForm.subTitle = item ? item.sub_title : "";
                this.ruleForm.description = item ? item.description : "";
                this.ruleForm.contentType = item ? item.content_type : "";
                this.folderDialog = true;
            },
            isImage(path) {
                if (path.indexOf(".") >= 0) {
                    const extension = path
                        .split(".")
                        .pop()
                        .toLowerCase();
                    if (
                        extension == "jpg" ||
                        extension == "png" ||
                        extension == "gif" ||
                        extension == "tif" ||
                        extension == "jpeg" ||
                        extension == "bmp"
                    ) {
                        return true;
                    }
                }
                return false;
            },
            Refresh() {
                let query = {
                    limit: 100,
                    offset: 0,
                    language: this.$i18n.locale,
                };
                this.$store.dispatch("archive/getArchive", {
                    query: query,
                    id: this.$store.getters["archive/currentIdBrowser"]
                        ? this.$store.getters["archive/currentIdBrowser"]
                        : null,
                }).then(() => {
                    this.$store.commit('archive/SET_LODGING_UPLOAD_IMG', false)
                });
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
            move() {
                this.$store
                    .dispatch("archive/move", {
                        marked_ids: this.selectedPaths,
                        currentId: this.$store.getters["archive/currentId"]
                            ? this.$store.getters["archive/currentId"]
                            : 0,
                    })
                    .then((response) => {
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
                        currentId: this.$store.getters["archive/currentIdBrowser"]
                            ? this.$store.getters["archive/currentIdBrowser"]
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
            selectedItem(item) {
                if (!this.$store.getters["archive/selectedItem"].includes(item)) {
                    this.$store.commit("archive/SET_SELECTED_ITEM", item);
                } else {
                    for (
                        var i = 0;
                        i < this.$store.getters["archive/selectedItem"].length;
                        i++
                    ) {
                        if (this.$store.getters["archive/selectedItem"][i] === item) {
                            this.$store.commit("archive/REMOVE_SELECTED_ITEM", i);
                        }
                    }
                }
            },
        },
    };
</script>

<style scoped>
    .folder {
        display: inline-block;
        margin: 10px;
        cursor: pointer;
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

    a:hover {
        text-decoration: none;
    }

    .content {
        font-size: 90px;
        width: 100%;
    }

    .name {
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 92px;
        overflow: hidden;
    }

    .customFlex {
        float: none !important;
        padding: 0px 15px !important;
        justify-content: space-between;
    }

    .centerIcons div:first-child {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
