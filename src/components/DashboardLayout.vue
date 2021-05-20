<!-- @format -->

<template>
    <div class="dashboard">
        <v-navigation-drawer v-model="drawer" class="fullheight" width="256" app dark>
             <v-list-item>
                 <v-list-item-content>
                    <v-list-item-title class="title"> Atma Korean BBQ </v-list-item-title>
                    <v-list-item-subtitle> Daeeebaakkkk !!! </v-list-item-subtitle>
                 </v-list-item-content>
             </v-list-item>

             <v-divider></v-divider>

             <v-list dense nav>
                 <v-list-item
                     v-for="item in UserRole"
                     :key="item.title"
                     link
                     tag="router-link"
                     :to="item.to"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

    <!-- header -->
    <v-app-bar app fixed height="60px">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>Atma Korean Barbeque
        <VSpacer />
        <v-toolbar-items>
            <!-- <v-btn text router><v-icon>mdi-account</v-icon></v-btn> -->
            <v-btn text router @click="logout()"><v-icon>mdi-logout</v-icon> Logout </v-btn>
        </v-toolbar-items>
    </v-app-bar>
    <div class="fullheight pa-5">
        <router-view></router-view>
      </div>
    </div>
 </template>
 <script>
 export default {
    name: "Dashboard",  
    data() {
        return {
            drawer: true,
            itemsManager: [
                { title: "Dashboard", icon:"mdi-apps-box" ,to: "/dashboard" },
                { title: "Karyawan", icon:"mdi-account", to: "/karyawans" },
                { title: "Customer", icon:"mdi-account-details", to: "/customers" },
                { title: "Meja", icon:"mdi-sofa-single", to: "/mejas" },
                { title: "Menu", icon:"mdi-food", to: "/menus" },
                { title: "Bahan", icon:"mdi-filter-menu", to: "/bahans" },
                { title: "Stok", icon:"mdi-warehouse", to: "/stoks" },
                { title: "Reservasi", icon:"mdi-notebook-edit", to: "/Reservasi" },
                { title: "Pesanan", icon:"mdi-clipboard-list", to: "/Pesanan" },
                { title: "Transaksi", icon:"mdi-cash-multiple", to: "/Transaksi" },
                { title: "Laporan", icon:"mdi-alert", to: "/Laporan" }
            ],
            itemsOwner: [
                { title: "Dashboard", icon:"mdi-apps-box" ,to: "/dashboard" },
                { title: "Karyawan", icon:"mdi-account", to: "/karyawans" },
                { title: "Meja", icon:"mdi-sofa-single", to: "/mejas" },
            ],
            itemsWaiter: [
                { title: "Dashboard", icon:"mdi-apps-box" ,to: "/dashboard" },
                { title: "Customer", icon:"mdi-account-details", to: "/customers" },
                { title: "Meja", icon:"mdi-sofa-single", to: "/mejas" },
                { title: "Reservasi", icon:"mdi-notebook-edit", to: "/Reservasi" },
            ],
            itemsCashier: [
                { title: "Dashboard", icon:"mdi-apps-box" ,to: "/dashboard" },
                { title: "Meja", icon:"mdi-sofa-single", to: "/mejas" },
                { title: "Menu", icon:"mdi-food", to: "/menus" },
                { title: "Reservasi", icon:"mdi-notebook-edit", to: "/Reservasi" },
                { title: "Pesanan", icon:"mdi-clipboard-list", to: "/Pesanan" },
            ],
            itemsChef: [
                { title: "Dashboard", icon:"mdi-apps-box" ,to: "/dashboard" },
                { title: "Meja", icon:"mdi-sofa-single", to: "/mejas" },
                { title: "Bahan", icon:"mdi-filter-menu", to: "/bahans" },
                { title: "Stok", icon:"mdi-warehouse", to: "/stoks" },
                { title: "Pesanan", icon:"mdi-clipboard-list", to: "/Pesanan" },
            ],
        };
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            this.$router.push({
                name:"login",
            });
        }
        
    },
    computed: {
    UserRole: function() {
      if(localStorage.getItem("current_role") === '2') {
        return this.itemsOwner
      } else if(localStorage.getItem("current_role") === '3') {
        return this.itemsManager
      } else if(localStorage.getItem("current_role") === '1') {
        return this.itemsWaiter
      } else if(localStorage.getItem("current_role") === '4') {
        return this.itemsCashier
      } else if(localStorage.getItem("current_role") === '5') {
        return this.itemsChef
      }

      return null;
    }
  },
 };
 </script>

<style scoped>
 .fullheight {
    min-height: 150vh !important;
 }
 .router {
text-decoration: none; 
 color: black;
 }
 </style> 