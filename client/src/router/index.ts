import {createRouter, createWebHashHistory} from 'vue-router'
import publicRoutes from './publicRoutes'
import privateRoutes from './privateRoutes'
import store from '@/store'

declare const $: any;

// Start vue router
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes, ...privateRoutes]
})

console.log(router.getRoutes())
// // Middlewares
router.beforeEach((to, from, next) => {
  // https://stackoverflow.com/questions/53788975/vue-router-how-to-get-previous-page-url


  // Force close modal, this should be updated to be less of a bazooka approach
  $('#modal-xl').modal('hide');


//   // Redirect to route
//   const redirectToRoute = (name: string) => {
//     if (name === from.name) {
//       next()
//       return
//     }
//
//     next({ name: name })
//   }
//
//   // Get logged user
//   // const loggedUser = store.getters.getLoggedUser
//
//   // Check if access token expired
//   // if (loggedUser) {
//   //   const currentDateTime = new Date().getTime()
//   //   if (currentDateTime > loggedUser.expiryDate) {
//   //     store.dispatch('logOut')
//   //     return redirectToRoute('admin.login')
//   //   }
//   // }
//
//   // // Auth
//   // if (to.meta.auth) {
//   //   if (loggedUser)
//   //     return next()
//   //   else
//   //     return redirectToRoute('admin.login')
//   // }
//   //
//   // // Guest
//   // // if (to.meta.guest) {
//   // //   if (loggedUser)
//   //     return redirectToRoute('admin.dashboard')
//   //   // else
//   //   //   return next()
//   // // }
  (store as any).commit('changePage', to.name)
  // (store as any).state.title = to.name

  next();
})

// Export
export default router
