<!-- @format -->


<template>
<v-main class="list">
<h5 class="text-h5 font-weight-medium mb-5">Customer</h5>

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
        Tambah Data Customer
    </v-btn>
        </v-card-title>
            <v-data-table :headers="headers" :items="customers" :search="search">
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
                            @click="deleteHandler(item.id_customer)"
                        color="red" v-if="hakAkses()==1">
                        mdi-delete
                    </v-icon>
                </template> 
            </v-data-table>
        </v-card>

<v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
        <v-card-title>
            <span class="headline">{{ formTitle }} Customer </span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field
                    v-model="form.nama_customer"
                    label="Nama Customer"
                    prepend-icon="mdi-account"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="form.telp_customer"
                    label="Telepon Customer"
                    prepend-icon="mdi-phone"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="form.email_customer"
                    label="Email Customer"
                    prepend-icon="mdi-email"
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

<v-dialog v-model="dialogConfirm" persistent max-width="400px">
    <v-card>
        <v-card-title>
            <span class="headline">Konfirmasi</span>
        </v-card-title>
        <v-card-text>
            Apakah anda yakin ingin menghapus customer ini?
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
                { text: "Nama Customer",
                align: "start",
                sortable: true,
                value: "nama_customer" },
                { text: "Telepon Customer", value: "telp_customer" },
                { text: "Email Customer", value: "email_customer" },
                { text: "Actions", value: "actions" },
            ],
            customer: new FormData,
            customers: [],
            form: {
                nama_customer: null,
                telp_customer: null,
                email_customer: null,
            },
            deleteId: '',
            editId: '',
        };
    },
    methods: {
        hakAkses() {
        if(localStorage.getItem("current_role") === '3' || localStorage.getItem("current_role") === '1')
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
            var url = this.$api + '/customer'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                } 
            }).then(response => {
                this.customers = response.data.data
            })
        },
        //simpan data produk
        save() {
            this.customer.append('nama_customer', this.form.nama_customer);
            this.customer.append('telp_customer', this.form.telp_customer);
            this.customer.append('email_customer', this.form.email_customer);

            var url = this.$api + '/customer/'
            this.load = true
            this.$http.post(url, this.customer, {
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
                nama_customer: this.form.nama_customer,
                telp_customer: this.form.telp_customer,
                email_customer: this.form.email_customer,
            }
            var url = this.$api + '/customer/' + this.editId;
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
            var url = this.$api + '/customer/' + this.deleteId;
            this.load = true
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
            this.editId = item.id_customer;
            this.form.nama_customer = item.nama_customer;
            this.form.telp_customer = item.telp_customer;
            this.form.email_customer = item.email_customer;
            this.dialog = true;
        },
        deleteHandler(id_customer){
            this.deleteId = id_customer;
            this.dialogConfirm = true;
            this.readData();
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
                nama_customer: null,
                telp_customer: null,
                email_customer: null,
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