import {Login} from "@/views";

export default [

    // Home
    {
        path: '/',
        redirect: '/admin/dashboard'
    },

    // Login
    {
        path: '/admin/login',
        component: Login ,
        name: 'admin.login',
        meta: { guest: true }
    },
]
