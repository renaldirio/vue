<!-- @format -->
  
<template>
<v-main class="list">
<h5 class="text-h5 font-weight-medium mb-5">Meja</h5>

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
        Tambah Data Meja
    </v-btn>
        </v-card-title>
            <v-data-table :headers="headers" :items="mejas" :search="search">
                <template v-slot:[`item.status_meja`]="{ item }">
                    
                    <v-chip
                    :color="getstatus_mejaColor(item.status_meja)"
                    dark
                    >
                    {{ item.status_meja }}
                    </v-chip>
                </template>
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
                            @click="deleteHandler(item)"
                        color="red" v-if="hakAkses()==1">
                        mdi-delete
                    </v-icon>
                </template> 
            </v-data-table>
        </v-card>

<v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
        <v-card-title>
            <span class="headline">{{ formTitle }} Meja</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field
                    v-model="form.no_meja"
                    label="No Meja"
                    prepend-icon="mdi-numeric-6-box-multiple-outline"
                    required
                ></v-text-field>

                 <v-select
                    v-model="form.status_meja"
                    prepend-icon="mdi-table"
                    label="Status Meja"
                    :items="['Tidak Tersedia','Tersedia']"
                    required
                ></v-select>
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
            Apakah anda yakin ingin menghapus Meja ini ?
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
                { text: "No Meja",
                align: "start",
                sortable: true,
                value: "no_meja" },
                { text: "Status Meja", value: "status_meja" },
                { text: "Actions", value: "actions" },
            ],
            meja: new FormData,
            mejas: [],
            form: {
                no_meja: null,
                status_meja: null,
            },
            deleteId: '',
            editId: '',
        };
    },
    methods: {

        hakAkses() {
        if(localStorage.getItem("current_role") === '3')
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
        //read data product
        readData() {
            var url = this.$api + '/meja/'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                } 
            }).then(response => {
                this.mejas = response.data.data
            })
        },
        //simpan data produk
        save() {
            this.meja.append('no_meja', this.form.no_meja);
            this.meja.append('status_meja', this.form.status_meja);

            var url = this.$api + '/meja/'
            this.load = true
            this.$http.post(url, this.meja, {
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
        //ubah data produk
        update() {
            let newData = {
                no_meja: this.form.no_meja,
                status_meja: this.form.status_meja,
            }
            var url = this.$api + '/meja/' + this.editId;
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
        //hapus data produk
        deleteData() {
            //mengahapus data
            var url = this.$api + '/meja/' + this.deleteId;
            //data dihapus berdasarkan id
            this.$http.delete(url, {
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
            this.dialogConfirm = false
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id_meja;
            this.form.no_meja = item.no_meja;
            this.form.status_meja = item.status_meja;
            this.dialog = true;
        },
        deleteHandler(item){
            this.deleteId = item.id_meja;
            this.dialogConfirm = true;
        },
        close() {
            this.dialog = false
            this.inputType = 'Tambah';
        },
        cancel() {
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.inputType = 'Tambah';
        },
        resetForm() {
            this.form = {
                no_meja: null,
                status_meja: null,
            };
        },
        getstatus_mejaColor (status_meja) {
        if (status_meja === 'Tidak Tersedia') return 'red'
        else if (status_meja === 'Tersedia') return 'green'
        else return 'orange'},
    },
    computed: {
        formTitle() {
            return this.inputType 
        },
    },
    mounted() {
        this.readData();
    },
};
</script>