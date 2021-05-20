<!-- @format -->
  
<template>
<v-main class="list">
<h5 class="text-h5 font-weight-medium mb-5"> Menu </h5>

<v-card>
    <v-card-title>
    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
    ></v-text-field>
    <v-spacer></v-spacer>
    <v-btn color="success" dark @click="dialog = true" v-if="hakAkses()==1">
        Tambah Data Menu
    </v-btn>
        </v-card-title>
            <v-data-table :headers="headers" :items="menus" :search="search">
               <template v-slot:[`item.actions`]="{ item }">
                    
                   <v-icon
                        medium
                        class="mr-5"
                        @click="editHandler(item)"
                        color="blue" v-if="hakAkses()==1">
                        mdi-pencil
                    </v-icon>
                        <v-icon
                            medium
                            @click="deleteHandler(item.id_menu)"
                        color="red" v-if="hakAkses()==1">
                        mdi-delete
                    </v-icon>
                </template> 
                <template v-slot:[`item.harga_menu`]="{ item }">
                    <div class="text-center" >
                        Rp. {{ item.harga_menu }}
                    </div>  
                </template>
            </v-data-table>
        </v-card>

<v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
        <v-card-title>
            <span class="headline">{{ formTitle }} Menu</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field
                    v-model="formMenu.nama_menu"
                    label="Nama Menu"
                    prepend-icon="mdi-account"
                    required
                ></v-text-field>

                <v-select
                    :items="namaBahans"
                    item-text="nama_bahan"
                    item-value="id_bahan"
                    label="Nama Bahan"
                    prepend-icon="mdi-semantic-web"
                    v-model="formMenu.nama_bahan"
                    required
                ></v-select>

                <v-select
                    v-model="formMenu.kategori_menu"
                    label="Kategori Menu"
                    :items ="['Menu Utama', 'Side Dish', 'Minuman']"
                    prepend-icon="mdi-shape"
                    required
                ></v-select>

                <!-- <v-text-field
                    v-model="formMenu.unit_menu"
                    label= "Unit Menu"
                    prepend-icon="mdi-bowl"
                    required
                ></v-text-field> -->
                <v-select
                    v-model="formMenu.unit_menu"
                    label="Unit Menu"
                    :items ="['Plate', 'Bowl', 'Mini Bowl', 'Glass', 'Bottle']"
                    prepend-icon="mdi-bowl"
                    required
                ></v-select>

                <v-text-field
                    v-model="formMenu.deskripsi_menu"
                    label="Deskripsi Menu"
                    prepend-icon="mdi-format-text"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="formMenu.harga_menu"
                    label= "Harga Menu"
                    prepend-icon="mdi-currency-usd"
                    required
                ></v-text-field>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel">
                Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="setForm">
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<v-dialog v-model="dialogConfirm" persistent max-width="450px">
    <v-card>
        <v-card-title>
            <span class="headline">Konfirmasi</span>
        </v-card-title>
        <v-card-text>
            Apakah anda yakin ingin menghapus menu ini?
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteData"> 
                Delete
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
    {{error_message}}
</v-snackbar>

</v-main>
</template>
<script>
export default {
    name: "List",
    data() {
        return {
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            headers: [
                { text: "Nama Menu",
                align: "start",
                sortable: true,
                value: "nama_menu" },
                { text: "Nama Bahan", value: "nama_bahan" },
                { text: "Kategori Menu", value: "kategori_menu" },
                { text: "Unit Menu", value: "unit_menu" },
                { text: "Deskripsi Menu", value: "deskripsi_menu" },
                { text: "Harga Menu", value: "harga_menu" },
                { text: "Actions", value: "actions" },
            ],
            menu: new FormData,
            menus: [],
            formMenu: {
                nama_menu: null,
                nama_bahan: null,
                unit_menu: null,
                kategori_menu: null,
                deskripsi_menu: null,
                harga_menu: null
            },
            nama_bahan:"",
            deleteId: '',
            editId: '',
            namaBahans:[],
        };
    },
    methods: {
        hakAkses() {
        if(localStorage.getItem("current_role") == '3')
          return 1
        else
          return 0
      },
        setForm() {
            if (this.inputType === 'Tambah') {
                this.save()
            } else {
                this.update()
            }
        },
        //read data Menu
        readData() {
            var url = this.$api + '/menu'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                } 
            }).then(response => {
                this.menus = response.data.data
            })
        },

        getBahan() {
            var url = this.$api + '/bahan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer' + localStorage.getItem('token')
                }
            }).then(response => {
                this.namaBahans = response.data.data;
                
                console.log(this.namaBahans);
            })
        },
        //simpan data menu
        save() {
            this.menu.append('nama_menu', this.formMenu.nama_menu);
            this.menu.append('id_bahan', this.formMenu.nama_bahan);
            this.menu.append('unit_menu', this.formMenu.unit_menu);
            this.menu.append('kategori_menu', this.formMenu.kategori_menu);
            this.menu.append('deskripsi_menu', this.formMenu.deskripsi_menu);
            this.menu.append('harga_menu', this.formMenu.harga_menu);

            var url = this.$api + '/menu'
            this.load = true
            this.$http.post(url, this.menu, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
            })
        },
        //ubah data menu
        update() {
            let newData = {
                'nama_menu': this.formMenu.nama_menu,
                'id_bahan': this.formMenu.nama_bahan,
                'unit_menu': this.formMenu.unit_menu,
                'kategori_menu': this.formMenu.kategori_menu,
                'deskripsi_menu': this.formMenu.deskripsi_menu,
                'harga_menu': this.formMenu.harga_menu
            }
            var url = this.$api + '/menu/' + this.editId;
            this.load = true
            this.$http.put(url, newData, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
            }) 
        },

    deleteData() {
            var url = this.$api + '/menu/' + this.deleteId;
            this.load = true
            this.$http.delete(url,{
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
            }) 
        },
        
        editHandler(item){
            this.inputType = 'Ubah Data Menu';
            this.editId = item.id_menu;
            this.formMenu.nama_menu = item.nama_menu;
            this.formMenu.id_bahan = item.nama_bahan;
            this.formMenu.unit_menu = item.unit_menu;
            this.formMenu.kategori_menu = item.kategori_menu;
            this.formMenu.deskripsi_menu = item.deskripsi_menu;
            this.formMenu.harga_menu = item.harga_menu;
            this.dialog = true;

            for(var i=0;i < this.namaBahans.length; i++)
            {
                if(this.namaBahans[i].nama_bahan == item.nama_bahan)
                {
                    this.formMenu.nama_bahan = this.namaBahans[i];
                }
            }
        },
        deleteHandler(id_menu){
            this.deleteId = id_menu;
            this.dialogConfirm = true;
            this.readData();
        },
        close() {
            this.resetForm();
            this.readData();
            this.dialog = false
            this.dialogConfirm = false
            this.inputType = 'Tambah';
        },
        cancel() {
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.inputType = 'Tambah';
        },
        resetForm() {
            this.formMenu = {
                nama_menu: null,
                nama_bahan: null,
                unit_menu: null,
                kategori_menu: null,
                deskripsi_menu: null,
                harga_menu: null,
            };
        },
    },
    computed: {
        formTitle() {
            return this.inputType 
        },
    },
    mounted() {
        this.readData();
        this.getBahan();
    },
};
</script>