export default {
    changePage (state: any, title: string) {
        state.title = title
    },
    modalState (state: any, isOpen: boolean) {
        state.isModalOpen = isOpen
    },
    isLoggedIn (state: any, loggedIn: boolean) {
        state.isLoggedIn = loggedIn
    }
}
