<!-- @format -->
  
<template>
<v-main class="list">
<h5 class="text-h5 font-weight-medium mb-5"> Data Karyawan </h5>
<div v-if="hakAkses()==0">
    <h2>Maaf Anda tidak memiliki hak akses</h2>
</div>

<div v-if="hakAkses()==1">
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
        Tambah Data Karyawan
    </v-btn>
        </v-card-title>
            <v-data-table :headers="headers" :items="karyawans" :search="search">
                <template v-slot:[`item.status_karyawan`]="{ item }">
                    
                    <v-chip
                    :color="getstatus_karyawanColor(item.status_karyawan)"
                    dark
                    >
                    {{ item.status_karyawan }}
                    </v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon medium class="mr-2" @click="editHandler(item)" color="blue">
                        mdi-pencil
                    </v-icon>
                    <v-icon medium @click="nonAktifActions(item.id_karyawan)" color="red">
                        mdi-close
                    </v-icon>
                </template>
            </v-data-table>
                
        </v-card>

<v-dialog v-model="dialog" @keydown.esc="dialog = false" persistent max-width="600px">
    <v-card>
        <v-card-title>
            <span class="headline">{{ formTitle }} </span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field
                    v-model="form.nama_karyawan"
                    label="Nama Karyawan"
                    prepend-icon="mdi-card-account-details"
                    required
                ></v-text-field>
                <v-select
                    :items="jabatans"
                    item-text="nama_jabatan"
                    item-value="id_jabatan"
                    label="Nama Jabatan"
                    prepend-icon="mdi-police-badge"
                    dense
                    v-model="form.nama_jabatan"
                    :rules="RoleRules"
                    required>
                </v-select>

                <v-select
                    v-model="form.jk_karyawan"
                    prepend-icon="mdi-gender-male"
                    label="Jenis Kelamin"
                    :items="['Laki-laki','Perempuan']"
                    required
                ></v-select>

                <v-text-field
                    v-model="form.telp_karyawan"
                    prepend-icon="mdi-phone"
                    label="No Telpon"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="form.email_karyawan"
                    label="Email"
                    prepend-icon="mdi-email"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="form.password"
                    label="Password"
                    :type="passwordFieldType"
                    prepend-icon="mdi-lock"
                    required
                ></v-text-field>
                <v-select
                    v-model="form.status_karyawan"
                    label="Status Karyawan"
                    prepend-icon="mdi-alert"
                    :items="['Aktif', 'Non-Aktif']"
                    required
                ></v-select>
                <v-text-field
                    v-model="form.tgl_bergabung"
                    prepend-icon="mdi-calendar"
                    type="date"
                    label="Tanggal Bergabung"
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

<v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
    {{error_message}}
</v-snackbar>
</div>
</v-main>
</template>
<script>
export default {
    name: "List",
    data() {
        return {
            passwordFieldType : "password",

            RoleRules: [(v) => !!v || "Jabatan tidak boleh kosong"],
            namaRules: [(v) => !!v || "Nama tidak boleh kosong"],
            jenisKelaminRules:[(v) => !!v || "Jenis Kelamin tidak boleh kosong"],
            teleponRules:[(v) => !!v || "Nomor Telepon tidak boleh kosong"],
            emailRules:[(v) => !!v || "Email tidak boleh kosong"],
            tanggalRules:[(v) => !!v || "Tanggal Bergabung tidak boleh kosong"],
            status_karyawanRules:[(v) => !!v || "status_karyawan Karyawan tidak boleh kosong"],
            passwordRules:[(v) => !!v || "Password tidak boleh kosong"],

            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            headers: [
                { text: "Id",
                align: "start",
                sortable: true,
                value: "id_karyawan" },
                { text: "Jabatan", value: "nama_jabatan" },
                { text: "Nama Karyawan", value: "nama_karyawan" },
                { text: "Jenis Kelamin", value: "jk_karyawan" },
                { text: "No Telepon", value: "telp_karyawan" },
                { text: "Email Karyawan", value: "email_karyawan" },
                { text: "Status Karyawan", value: "status_karyawan" },
                { text: "Tanggal Bergabung", value: "tgl_bergabung" },
                { text: "Actions", value: "actions" },
            ],
            karyawan: new FormData,
            karyawans: [],
            jabatans: [],
            form: {
                nama_jabatan: "",
                nama_karyawan: null,
                jk_karyawan: null,
                telp_karyawan: null,
                email_karyawan: null,
                password: null,
                status_karyawan: null,
                tgl_bergabung: null,
            },
            nama_jabatan: "",
            deleteId: '',
            namaJabatans:[],
            editId: '',
        };
    },
    methods: {
        hakAkses() {
        if(localStorage.getItem("current_role") === '2' || localStorage.getItem("current_role") === '3')
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
        //read data karyawan
        readDataKaryawan() {
            var url = this.$api + '/karyawan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                } 
            }).then(response => {
                this.karyawans = response.data.data
            })
        },
        //read data role
        readDataRole() {
            var url = this.$api + '/jabatan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                } 
            }).then(response => {
                this.jabatans = response.data.data
            })
        },
        //simpan data produk
        save() {
            this.karyawan.append('id_jabatan', this.form.nama_jabatan);
            this.karyawan.append('nama_karyawan', this.form.nama_karyawan);
            this.karyawan.append('jk_karyawan', this.form.jk_karyawan);
            this.karyawan.append('telp_karyawan', this.form.telp_karyawan);
            this.karyawan.append('email_karyawan', this.form.email_karyawan);
            this.karyawan.append('password', this.form.password);
            this.karyawan.append('status_karyawan', this.form.status_karyawan);
            this.karyawan.append('tgl_bergabung', this.form.tgl_bergabung);

            var url = this.$api + '/karyawan/'
            this.load = true
            this.$http.post(url, this.karyawan, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readDataKaryawan(); //mengambil data
                this.resetForm(); 
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
            })
        },
        //ubah data karyawan
        update() {
            let newData = {
                id_jabatan: this.form.nama_jabatan,
                nama_karyawan: this.form.nama_karyawan,
                jk_karyawan: this.form.jk_karyawan,
                telp_karyawan:this.form.telp_karyawan,
                email_karyawan: this.form.email_karyawan,
                password: this.form.password,
                status_karyawan: this.form.status_karyawan,
                tgl_bergabung: this.form.tgl_bergabung,
            }
            var url = this.$api + '/karyawan/' + this.editId;
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
                this.readDataKaryawan(); //mengambil data
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
            var url = this.$api + '/karyawan/' + this.deleteId;
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
                this.readDataKaryawan(); //mengambil data
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
            this.inputType = 'Ubah Data Karyawan';
            this.editId = item.id_karyawan;
            this.form.nama_jabatan= item.id_jabatan;
            this.form.nama_karyawan = item.nama_karyawan;
            this.form.jk_karyawan = item.jk_karyawan;
            this.form.telp_karyawan = item.telp_karyawan;
            this.form.email_karyawan = item.email_karyawan;
            this.form.status_karyawan = item.status_karyawan;
            this.form.tgl_bergabung=item.tgl_bergabung;
            this.dialog = true;

            for(var i=0;i < this.jabatans.length; i++)
            {
                if(this.jabatans[i].nama_jabatan == item.nama_jabatan)
                {
                    this.form.nama_jabatan = this.jabatans[i];
                }
            }

        },

        getJabatan() {
            var url = this.$api + '/jabatan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer' + localStorage.getItem('token')
                }
            }).then(response => {
                this.namaJabatans = response.data.data;
                
                console.log(this.namaJabatans);
            })
        },

        deleteHandler(id){
            this.deleteId = id;
            this.dialogConfirm = true;
        },
        close() {
            this.dialog = false
            this.inputType = 'Tambah';
        },
        cancel() {
            this.resetForm();
            this.readDataKaryawan();
            this.dialog = false;
            this.inputType = 'Tambah';
        },
        resetForm() {
            this.form = {
                nama_jabatan: "",
                nama_karyawan: null,
                jk_karyawan: null,
                telp_karyawan: null,
                email_karyawan: null,
                password: null,
                status_karyawan: null,
                tgl_bergabung: null,
            };
        },
        nonAktifActions(resignId) {
            var url = this.$api + '/resignkaryawan/'+ resignId;
            this.load = true
            this.$http.put(url, null, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('current_token')
            }
            }).then(response => {
            this.error_message = response.data.message;
            this.color = "green"
            this.snackbar = true;
            this.load = false;
            this.readDataKaryawan(); //mengambil data
            }).catch(error => {
            this.error_message = error.response.data.message;
            this.color = "red"
            this.snackbar = true;
            this.load = false;
            })
        },

        haveAccess() {
        if(localStorage.getItem("current_role") === '1' || localStorage.getItem("current_role") === '2')
          return 1
        else
          return 0
        },
        getstatus_karyawanColor (status_karyawan) {
        if (status_karyawan === 'Non-Aktif') return 'red'
        else if (status_karyawan === 'Aktif') return 'blue'
        else return 'orange'
      },
    },
    computed: {
        formTitle() {
            return this.inputType 
        },
    },
    mounted() {
        this.readDataKaryawan();
        this.readDataRole();
        this.getJabatan();
    },
};
</script>

<style scoped>

</style>