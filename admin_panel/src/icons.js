import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faFileArchive,
    faFolder,
    faFileAlt,
    faFileCode,
    faFileDownload,
    faEdit,
    faSync,
    faChevronCircleLeft,
    faSpinner,
    faFileWord,
    faFilePdf,
    faUndo,
    faRedo,
    faFileExcel,
    faUserCheck,
    faUserTimes,
    faBug,
    faLock,
    faQuestionCircle,
    faCogs,
    faBuilding,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBuilding,faCogs,faUndo,faRedo,faQuestionCircle,faLock,faBug,faUserTimes,faFileArchive,faFolder,faFileAlt,faFileCode,faFileDownload ,faFileExcel ,faFilePdf, faFileWord,faEdit,faSync,faChevronCircleLeft,faSpinner , faUserCheck)

Vue.component('fa-icon', FontAwesomeIcon)
