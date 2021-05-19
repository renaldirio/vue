import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            //OP
            path: "/dashboard",
            name: "DashboardLayout",
            component: importComponent('DashboardLayout'),
            beforeEnter: (to, from, next) => {
                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                else
                next()
            },
            children: [
            //Dashboard
                        {
                        path: "/dashboard",
                        name: "Dashboard",
                        meta: {tittle: 'Dashboard'},
                        component: importComponent('Dashboard'),
                        beforeEnter: (to, from, next) => {
                            if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                            else
                            next()
                        },
                        },
                        //products
                        {
                        path: "/customers",
                        name: "Customers",
                        meta: {tittle: 'Customers'},
                        component: importComponent('DataMaster/Customer'),
                        beforeEnter: (to, from, next) => {
                            if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                            else
                            next()
                        },
                        },
                        //karyawan
                        {
                            path: "/karyawans",
                            name: "Karyawans",
                            meta: {tittle: 'Karyawans'},
                            component: importComponent('DataMaster/Karyawan'),
                            beforeEnter: (to, from, next) => {
                                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                else
                                next()
                            },
                            },
                        //menu
                        {
                            path: "/menus",
                            name: "menus",
                            meta: {tittle: 'Menus'},
                            component: importComponent('DataMaster/Menu'),
                            beforeEnter: (to, from, next) => {
                                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                else
                                next()
                            },
                            }, 
                            {
                                path: "/laporan",
                                name: "laporan",
                                meta: {tittle: 'Laporans'},
                                component: importComponent('DataMaster/Laporan'),
                                beforeEnter: (to, from, next) => {
                                    if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                    else
                                    next()
                                },
                                },  
                            //karyawan
                        {
                            path: "/transaksi",
                            name: "transaksi",
                            meta: {tittle: 'Transaksis'},
                            component: importComponent('DataMaster/Transaksi'),
                            beforeEnter: (to, from, next) => {
                                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                else
                                next()
                            },
                            }, 
                        //karyawan
                        {
                            path: "/pesanan",
                            name: "Pesanans",
                            meta: {tittle: 'Pesanans'},
                            component: importComponent('DataMaster/Pesanan'),
                            beforeEnter: (to, from, next) => {
                                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                else
                                next()
                            },
                            },
                        
                        //meja
                        {
                            path: "/mejas",
                            name: "Mejas",
                            meta: {tittle: 'Mejas'},
                            component: importComponent('DataMaster/Meja'),
                            beforeEnter: (to, from, next) => {
                                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                else
                                next()
                            },
                        },
                        //bahan
                        {
                            path: "/bahans",
                            name: "Bahan",
                            meta: {tittle: 'Bahan'},
                            component: importComponent('DataMaster/Bahan'),
                            beforeEnter: (to, from, next) => {
                                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                else
                                next()
                            },
                        },
                        //stok
                        {
                            path: "/stoks",
                            name: "Stok",
                            meta: {tittle: 'Stok'},
                            component: importComponent('DataMaster/Stok'),
                            beforeEnter: (to, from, next) => {
                                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                else
                                next()
                            },
                        },
                        //reservasi
                        {
                            path: "/Reservasi",
                            name: "Reservasi",
                            meta: {tittle: 'Reservasi'},
                            component: importComponent('DataMaster/Reservasi'),
                            beforeEnter: (to, from, next) => {
                                if(!localStorage.getItem('token')&&to.name!=='login')next({name:'login'})
                                else
                                next()
                            },
                        },
                    ]
        },
        
    //login
    {
        path: "/login",
        name: "login",
        meta: {tittle: 'Login'},
        component: importComponent('Login'),
    },
    {
        path:'*',
        redirect: '/login'
    },
]
});
//mengset judul
router.beforeEach((to, from, next)=>{
    document.title = to.meta.tittle
    next()
});

export default router;