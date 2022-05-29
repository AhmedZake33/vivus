
const mutations = {
    toggleSidebarDesktop (state) {
        const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
        state.sidebarShow = sidebarOpened ? false : 'responsive'
    },
    toggleSidebarMobile (state) {
        const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
        state.sidebarShow = sidebarClosed ? true : 'responsive'
    },
    SET_PATH_TITLE(state , title){
        state.pathTitle =  title;
    },
    set (state, [variable, value]) {
        state[variable] = value
    },
    SET_FILES(state,[num,file]){
        state.fileList[num] = file
    },
    SET_UPLOAD_PROGRESS(state,uploadProgress){
        state.uploadProgress = uploadProgress
    }
}

export default mutations;