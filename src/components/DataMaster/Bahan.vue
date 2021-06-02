<!-- @format -->
  
<template>
<v-main class="list">
<h5 class="text-h5 font-weight-medium mb-5"> Bahan </h5>

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
        Tambah Data Bahan
    </v-btn>
        </v-card-title>
            <v-data-table :headers="headers" :items="bahans" :search="search">
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
                            @click="deleteHandler(item.id_bahan)"
                        color="red">
                        mdi-delete
                    </v-icon>
                </template> 
            </v-data-table>
        </v-card>

<v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
        <v-card-title>
            <span class="headline">{{ formTitle }} Bahan</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field
                    v-model="formBahan.nama_bahan"
                    label="Nama Bahan"
                    :rules="bahanRules"
                    required
                    prepend-icon="mdi-semantic-web"
                ></v-text-field>

                <v-text-field
                    v-model="formBahan.jml_bahanTersedia"
                    label="Jumlah Tersedia"
                    prepend-icon="mdi-flask-empty-plus"
                    :rules="jmlRules"
                    required
                ></v-text-field>

                <v-select
                    v-model="formBahan.unit_bahan"
                    label="Unit Bahan"
                    :items ="['Plate', 'Bowl', 'Mini Bowl', 'Glass', 'Bottle']"
                    prepend-icon="mdi-bowl"
                    :rules="unitRules"
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
            Apakah anda yakin ingin menghapus bahan ini?
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
    {{message}}
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
                // { text: "Id Bahan",
                // align: "start",
                // sortable: true,
                // value: "id_bahan" },
                { text: "Nama Bahan",
                align: "start",
                sortable: true,
                value: "nama_bahan" },
                { text: "Jumlah Bahan Tersedia", value: "jml_bahanTersedia" },
                { text: "Unit Bahan", value: "unit_bahan" },
                { text: "Actions", value: "actions" },
            ],
            bahan: new FormData,
            bahans: [],
            formBahan: {
                nama_bahan: null,
                unit_bahan: null,
                jml_bahanTersedia: null,
            },
            deleteId: '',
            editId: '',
            bahanRules: [v => !!v || 'Nama Bahan is required'],
            jmlRules: [v => !!v || 'Jumlah Bahan Tersedia is required'],
            unitRules: [v => !!v || 'Unit Bahan is required'],

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
        //read data Bahan
        readData() {
            var url = this.$api + '/bahan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                } 
            }).then(response => {
                this.bahans = response.data.data
            })
        },
        //simpan data Bahan
        save() {
            this.bahan.append('nama_bahan', this.formBahan.nama_bahan);
            this.bahan.append('unit_bahan', this.formBahan.unit_bahan);
            this.bahan.append('jml_bahanTersedia', this.formBahan.jml_bahanTersedia);

            var url = this.$api + '/bahan'
            this.load = true
            this.$http.post(url, this.bahan, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.message='Berhasil Menambahkan Bahan';
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.message='Field Harus di Isi';
                this.color="red"
                this.snackbar=true;
                this.load = false;
            })
        },
        //ubah data Bahan
        update() {
            let newData = {
                'nama_bahan': this.formBahan.nama_bahan,
                'unit_bahan': this.formBahan.unit_bahan,
                'jml_bahanTersedia': this.formBahan.jml_bahanTersedia,
            }
            var url = this.$api + '/bahan/' + this.editId;
            this.load = true
            this.$http.put(url, newData, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.message='Berhasil Mengupdate Bahan';
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.message='Gagal Update, Field Harus di Isi';
                this.color="red"
                this.snackbar=true;
                this.load = false;
            }) 
        },

    deleteData() {
            var url = this.$api + '/bahan/' + this.deleteId;
            this.load = true
            this.$http.delete(url,{
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.message='Berhasil Hapus Bahan';
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.message='Gagal Hapus Bahan';
                this.color="red"
                this.snackbar=true;
                this.load = false;
            }) 
        },
        
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id_bahan;
            this.formBahan.nama_bahan = item.nama_bahan;
            this.formBahan.unit_bahan = item.unit_bahan;
            this.formBahan.jml_bahanTersedia = item.jml_bahanTersedia;
            this.dialog = true;
        },
        deleteHandler(id_bahan){
            this.deleteId = id_bahan;
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
            this.formBahan = {
                nama_bahan: null,
                unit_bahan: null,
                jml_bahanTersedia:null,
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
    },
};
</script>