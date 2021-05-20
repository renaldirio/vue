<template>
<v-app class="main">
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="5" md="4">
        <v-card class="cardColor">
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="12" class="text-center">
                  <h3 class="headline">
                    Login Atma Korean BBQ
                  </h3>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="12" class="align-center">
                  <v-form v-model="valid" ref="form">
                    <v-text-field 
                        v-model="email_karyawan" 
                        label="Email" type="email" 
                        filled
                        rounded
                        dense />
                    <v-text-field
                        id="password"
                        type="password"
                        v-model="password"
                        label="Password"
                        filled
                        rounded
                        dense
                    />
                    <div class="d-flex mt-5">
                      <v-btn 
                        color="#a7002a" 
                        class="white--text"
                        width="100%"
                        style="margin-bottom: 10px;"
                        @click="submit()"
                      >
                        Login
                      </v-btn>
                    </div>
                  </v-form>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-snackbar v-model="snackbar" :color="color" timeout="3000" bottom>
    {{error_message}}
  </v-snackbar>
</v-app>

</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      valid: false,
      visibility: false,
      email_karyawan: '',
      password: '',
      load: false,
      error_message: '',
      color: '',
      snackbar: false,
    }
  },
  methods: {
    submit(){
      if(this.$refs.form.validate()){
        this.load = true
        this.$http.post(this.$api + '/login', {
          email_karyawan: this.email_karyawan,
          password: this.password
        }).then((response) => {
          localStorage.setItem('id', response.data.user.id_karyawan);
          localStorage.setItem('nama_karyawan', response.data.user.nama_karyawan);
          localStorage.setItem('token', response.data.access_token);
          localStorage.setItem('current_role', response.data.user.id_jabatan);
          this.error_message = response.data.message;
          this.color="green"
          this.snackbar=true;
          this.load = false;
          console.log(JSON.stringify(response));
          this.clear();
          this.$router.push({
            name: 'DashboardLayout'
          })
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.load = false;
          this.color="red"
          this.snackbar=true;
          localStorage.removeItem('token');
        })
      }
    },
    clear(){
      this.$refs.form.reset();
    }
  }
}
</script>
<style scoped>
    .main{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: url( 'https://firefoodchef.com/wp-content/uploads/2020/01/5-Best-Cuts-Of-Steak-For-Charcoal-Grilling.jpg');
    background-size: 100%;
    background-blend-mode: soft-light;
    transform: scale(1.1);
    }
    .cardColor {
   background-color: rgba(255, 255, 255, 0.90) !important;
   border-color: white !important;
 }
</style>
