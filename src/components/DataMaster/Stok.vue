<!-- @format -->
  
<template>
<v-main class="list">
<h5 class="text-h5 font-weight-medium mb-5"> Stok Bahan </h5>

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
    <v-btn color="success" dark @click="dialog = true">
        Tambah Stok Bahan
    </v-btn>
        </v-card-title>
            <v-data-table :headers="headers" :items="stoks" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                        medium
                        class="mr-5"
                        @click="editHandler(item)"
                        color="blue">
                        mdi-pencil
                    </v-icon>
                        <v-icon
                            medium
                            @click="deleteHandler(item.id_stok)"
                        color="red">
                        mdi-delete
                    </v-icon>
                </template> 
            </v-data-table>
        </v-card>

<v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
        <v-card-title>
            <span class="headline">{{ formTitle }} Stok</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-select
                    :items="namaBahans"
                    item-text="nama_bahan"
                    item-value="id_bahan"
                    label="Nama Bahan"
                    prepend-icon="mdi-semantic-web"
                    v-model="formStok.nama_bahan"
                    required
                ></v-select>

                <v-select
                    v-model="formStok.unit_stok"
                    label="Unit Stok"
                    :items ="['Gram', 'Mililiter']"
                    prepend-icon="mdi-bowl"
                    required
                ></v-select>

                <v-text-field
                    v-model="formStok.jumlah_stok"
                    label="Jumlah stok"
                    :rules="jumlahRules"
                    prepend-icon="mdi-flask-empty-plus"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="formStok.harga_beli"
                    label="Harga Beli"
                    :rules="hargaRules"
                    prepend-icon="mdi-currency-usd"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="formStok.incoming_stok"
                    label="Incoming Stok"
                    :rules="IncomingRules"
                    prepend-icon="mdi-arrow-right-bold-circle"
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
            Anda yakin ingin menghapus Stok ini?
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
                { text: "Id Stok",
                align: "start",
                sortable: true,
                value: "id_stok" },
                { text: "Nama Bahan", value: "nama_bahan"},
                { text: "Jumlah Stok", value: "jumlah_stok"},
                { text: "Unit Stok", value: "unit_stok"},
                { text: "Harga Beli", value: "harga_beli"},
                { text: "Incoming Stok", value: "incoming_stok"},
                { text: "Actions", value: "actions" },
            ],
            stok: new FormData,
            stoks: [],
            formStok: {
                nama_bahan: null,
                jumlah_stok: null,
                harga_beli: null,
                unit_stok: null,
                incoming_stok: null,
            },
            nama_bahan:"",
            deleteId: '',
            editId: '',
            namaBahans:[],
        };
    },
    methods: {
        setForm() {
            if (this.inputType === 'Tambah') {
                this.save()
            } else {
                this.update()
            }
        },
        //read data stok
        readData() {
            var url = this.$api + '/stokbahan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                } 
            }).then(response => {
                this.stoks = response.data.data
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
        
        //simpan data stok
        save() {
            this.stok.append('id_bahan', this.formStok.nama_bahan);
            this.stok.append('jumlah_stok', this.formStok.jumlah_stok);
            this.stok.append('unit_stok', this.formStok.unit_stok);
            this.stok.append('incoming_stok', this.formStok.incoming_stok);
            this.stok.append('harga_beli', this.formStok.harga_beli);

            var url = this.$api + '/stokbahan'
            this.load = true
            this.$http.post(url, this.stok, {
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
        //ubah data stok
        update() {
            let newData = {
                'id_bahan': this.formStok.nama_bahan,
                'jumlah_stok': this.formStok.jumlah_stok,
                'unit_stok': this.formStok.unit_stok,
                'incoming_stok': this.formStok.incoming_stok,
                'harga_beli': this.formStok.harga_beli
            }
            var url = this.$api + '/stokbahan/' + this.editId;
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
            var url = this.$api + '/stokbahan/' + this.deleteId;
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
            this.inputType = 'Ubah';
            this.editId = item.id_stok;
            this.formStok.nama_bahan = item.id_bahan;
            this.formStok.jumlah_stok = item.jumlah_stok;
            this.formStok.harga_beli = item.harga_beli;
            this.formStok.unit_stok = item.unit_stok;
            this.formStok.incoming_stok = item.incoming_stok;
            this.dialog = true;
        },
        deleteHandler(id_stok){
            this.deleteId = id_stok;
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
            this.formStok = {
                nama_bahan: null,
                jumlah_stok: null,
                unit_stok: null,
                incoming_stok: null,
                harga_beli: null
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