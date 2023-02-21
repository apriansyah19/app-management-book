<template>
  <div class="d-flex align-items-center" style="height: 450px">
    <div v-if="loading" class="loading-page">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div class="container w-50">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.prevent="handleSubmit(Login)">
          <validation-provider name="E-mail" :rules="{ required: true, email: true }" v-slot="validationContext">
            <b-input-group prepend="E-mail">
              <b-form-input id="input-1" name="input-1" v-model="form.name"
                :state="getValidationState(validationContext)" aria-describedby="input-1-live-feedback">
              </b-form-input>

              <b-form-invalid-feedback id="input-1-live-feedback">{{ validationContext.errors[0] }}
              </b-form-invalid-feedback>

            </b-input-group>
          </validation-provider>

          <validation-provider name="Password" :rules="{ required: true }" v-slot="validationContext">

            <b-input-group prepend="Password" class="mt-3">
              <b-form-input id="input-2" name="input-2" v-model="form.password" :type="statusPw ? `text` : 'password'"
                :state="getValidationState(validationContext)" aria-describedby="input-2-live-feedback">
              </b-form-input>

              <b-form-invalid-feedback id="input-2-live-feedback">{{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-input-group>
          </validation-provider>
          <b-form-checkbox size="sm" class="mb-3 mt-1" v-model="statusPw" :value="true"
            :unchecked-value="false">
            Show Password
          </b-form-checkbox>

          <b-button type="submit" variant="primary">Login</b-button>
          <b-button class="ml-2" @click="toRegis()">Registrasi</b-button>
        </b-form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  layout: 'none',
  data() {
    return {
      form: {
        name: null,
        password: null
      },
      loading: false,
      statusPw: false
    };
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    toRegis() {
      this.$router.push('/register')
    },
    async Login() {
      this.loading = true
      const API_URL = "https://satria-budi.hasura.app/v1/graphql";
      const API_HEADERS = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "QOcEnAWFOG6YIJW3Z1cE7sOibdW1dMrRaX36hqyWUcVkpdiUdcAMWrvW3LAZpAfX",
      };

      const API_QUERY = `
      query MyQuery {
        management_book_tabel_user(where: {email: {_eq: "${this.form.name}"}}) {
          password
          email
        }
      }
      `;
      try {
        const data = await axios.post(
          API_URL,
          { query: API_QUERY },
          { headers: API_HEADERS }
        );

        if (data.data.data.management_book_tabel_user.length > 0) {
          if (data.data.data.management_book_tabel_user[0].password === this.form.password) {
            this.$cookies.set('libraryState', data.data.data.management_book_tabel_user[0].email, {})
            this.$router.push('managementBook')
          } else {
            this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Password anda salah',
          });
          }
        } else {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Username Anda Tidak ditemukan',
          });
        }
        this.loading = false
        return
      } catch (error) {
        this.loading = false
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    },
  }
};
</script>

<style scoped>
  .loading-page {
    top: 0;
    left: 0;
    z-index: 3000;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    justify-content: center;
    display: flex;
    align-items: center;
  }
</style>

<style>
#cover {
  display: flex;
  align-items: center;
}
</style>


