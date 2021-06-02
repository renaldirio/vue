<!-- @format -->
  
<template>
  <v-main class="list">
    <h5 class="text-h5 font-weight-medium mb-5">Pesanan</h5>

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
      </v-card-title>
      <v-data-table :headers="headers" :items="pesanans" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon medium class="mr-5" @click="editHandler(item)" color="blue">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Reservasi</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- <v-select
                    :items="namaKaryawans"
                    item-text="nama_karyawan"
                    item-value="id_karyawan"
                    label="Nama Karyawan"
                    prepend-icon="mdi-card-account-details"
                    v-model="form.nama_karyawan"
                    required
                ></v-select> -->
            <v-text-field
              item-text="nama_karyawan"
              item-value="id_karyawan"
              label="Nama Karyawan"
              readonly
              prepend-icon="mdi-card-account-details"
              v-model="form.nama_karyawan"
              required
            ></v-text-field>
            <v-select
              :items="noMejas"
              item-text="no_meja"
              item-value="id_meja"
              label="No Meja"
              prepend-icon="mdi-numeric-6-box-multiple-outline"
              v-model="form.no_meja"
              :rules="noRules"
              required
            ></v-select>
            <v-select
              :items="namaCustomers"
              item-text="nama_customer"
              item-value="id_customer"
              label="Nama customer"
              prepend-icon="mdi-account"
              v-model="form.nama_customer"
              :rules="custRules"
              required
            ></v-select>

            <v-select
              v-model="form.jam_reservasi"
              label="Sesi Reservasi"
              :items="['Lunch', 'Dinner']"
              prepend-icon="mdi-clock-time-five"
              :rules="sesiRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.jml_orgReservasi"
              label="Jumlah Orang"
              prepend-icon="mdi-account-group"
              :rules="jmlRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.tgl_reservasi"
              prepend-icon="mdi-calendar"
              type="date"
              label="Tanggal Reservasi"
              :rules="tglRules"
              required
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      qrdialog:false,
      dialogConfirm: false,
      headers: [
        // { text: "Id Reservasi",
        // align: "start",
        // sortable: true,
        // value: "id_reservasi" },
        { text: "Id Pesanan", value: "id_detailTransaksi" },
        { text: "No Meja", value: "no_meja" },
        { text: "Nama Customer", value: "nama_customer" },
        { text: "Nama Menu", value: "nama_menu" },
        {text: "Jumlah Item", value:"jml_item"},
        {text:"Harga SUbtotal", value:"harga_subtotal"},
        { text: "Status Pesanan", value: "status_pesanan" },
        { text: "Actions", value: "actions" },
      ],
      pesanan: new FormData(),
      pesanans: [],
      form: {
        nama_karyawan: localStorage.getItem("nama_karyawan"),
        nama_customer: null,
        no_meja: null,
        jam_reservasi: null,
        jml_orgReservasi: null,
        tgl_reservasi: null,
      },
      deleteId: "",
      editId: "",
      namaCustomers: [],
      namaKaryawans: [],
      noMejas: [],
      noRules: [(v) => !!v || "No Meja is required"],
      custRules: [(v) => !!v || "Nama Customer is required"],
      sesiRules: [(v) => !!v || "Sesi Reservasi is required"],
      jmlRules: [(v) => !!v || "Jumlah Orang is required"],
      tglRules: [(v) => !!v || "Tanggal Reservasi is required"],
      qrid: "",
    };
  },
  methods: {
    hakAkses() {
      if (localStorage.getItem("current_role") == "3") return 1;
      else return 0;
    },
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    //read data Menu
    readData() {
      var url = this.$api + "/detailtransaksi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesanans = response.data.data;
        });
    },

    getKaryawan() {
      var url = this.$api + "/karyawan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.namaKaryawans = response.data.data;

          console.log(this.namaKaryawans);
        });
    },
    getMeja() {
      var url = this.$api + "/mejaEmpty";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.noMejas = response.data.data;

          console.log(this.noMejas);
        });
    },
    getCustomer() {
      var url = this.$api + "/customer";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.namaCustomers = response.data.data;

          console.log(this.namaCustomers);
        });
    },
    //simpan data menu
    save() {
      var name = localStorage.getItem("id");
      this.reservasi.append("id_karyawan", name);
      this.reservasi.append("id_customer", this.form.nama_customer);
      this.reservasi.append("id_meja", this.form.no_meja);
      this.reservasi.append("jam_reservasi", this.form.jam_reservasi);
      this.reservasi.append("jml_orgReservasi", this.form.jml_orgReservasi);
      this.reservasi.append("tgl_reservasi", this.form.tgl_reservasi);

      var url = this.$api + "/reservasi";
      this.load = true;
      this.$http
        .post(url, this.reservasi, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.message = "Berhasil Menambahkan Reservasi";
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.message = "Field Harus di Isi";
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    //ubah data menu
    update() {
      let newData = {
        id_customer: this.form.nama_customer,
        id_meja: this.form.no_meja,
        jam_reservasi: this.form.jam_reservasi,
        jml_orgReservasi: this.form.jml_orgReservasi,
        tgl_reservasi: this.form.tgl_reservasi,
      };
      var url = this.$api + "/reservasi/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.message = "Berhasil Mengupdate Reservasi";
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.message = "Gagal update, Field harus di isi";
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    deleteData() {
      var url = this.$api + "/reservasi/" + this.deleteId;
      this.load = true;
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.message = "Berhasil Menghapus Reservasi";
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.message = "Gagal Hapus Reservasi";
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    editHandler(item) {
      this.inputType = "Ubah Data Reservasi";
      this.editId = item.id_reservasi;
      this.form.nama_customer = item.nama_customer;
      this.form.no_meja = item.no_meja;
      this.form.jam_reservasi = item.jam_reservasi;
      this.form.jml_orgReservasi = item.jml_orgReservasi;
      this.form.tgl_reservasi = item.tgl_reservasi;
      this.dialog = true;

      for (var j = 0; j < this.noMejas.length; j++) {
        if (this.noMejas[j].no_meja == item.no_meja) {
          this.form.no_meja = this.noMejas[j];
        }
      }
      for (var k = 0; k < this.namaCustomers.length; k++) {
        if (this.namaCustomers[k].nama_customer == item.nama_customer) {
          this.form.nama_customer = this.namaCustomers[k];
        }
      }
    },
    deleteHandler(id_reservasi) {
      this.deleteId = id_reservasi;
      this.dialogConfirm = true;
      this.readData();
    },
    close() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        nama_karyawan: null,
        nama_customer: null,
        no_meja: null,
        jam_reservasi: null,
        jml_orgReservasi: null,
        tgl_reservasi: null,
      };
    },
    qrdialogOpen(id) {
      this.qrdialog = true;
      this.qrid = id.toString();
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
    this.getKaryawan();
    this.getCustomer();
    this.getMeja();
  },
};
</script>