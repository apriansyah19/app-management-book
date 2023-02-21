<template>
  <div class="d-flex align-items-center" style="height: 450px">
    <div v-if="loading" class="loading-page">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div class="container w-50">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.prevent="handleSubmit(regisUser)">
          <validation-provider name="E-mail" :rules="{ required: true, email: true }" v-slot="validationContext">
            <b-input-group prepend="E-mail" class="mt-3">
              <b-form-input id="input-1" name="input-1" v-model="form.email"
                :state="getValidationState(validationContext)" aria-describedby="input-1-live-feedback">
              </b-form-input>

              <b-form-invalid-feedback id="input-1-live-feedback">{{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-input-group>
          </validation-provider>

          <validation-provider name="Password"
            :rules="{ required: true, regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/ }"
            v-slot="validationContext">
            <b-input-group prepend="Password" class="mt-3">
              <b-form-input id="input-2" name="input-2" v-model="form.password" :type="statusPw ? `text` : 'password'"
                :state="getValidationState(validationContext)" aria-describedby="input-2-live-feedback">
              </b-form-input>

              <b-form-invalid-feedback id="input-2-live-feedback">{{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-input-group>
          </validation-provider>
          <b-form-checkbox size="sm" class="mb-3 mt-1" v-model="statusPw" :value="true" :unchecked-value="false">
            Show Password
          </b-form-checkbox>

          <validation-provider name="Confirm Password" :rules="{ required: true, is: form.password }"
            v-slot="validationContext">
            <b-input-group prepend="Confirm Password" class="mt-3">
              <b-form-input :disabled="!form.password" id="input-3" name="input-3" v-model="form.confirmPassword"
                :type="statusPw2 ? `text` : 'password'" :state="getValidationState(validationContext)"
                aria-describedby="input-3-live-feedback">
              </b-form-input>

              <b-form-invalid-feedback id="input-3-live-feedback">{{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-input-group>
          </validation-provider>
          <b-form-checkbox :disabled="!form.password" size="sm" class="mb-3 mt-1" v-model="statusPw2" :value="true"
            :unchecked-value="false">
            Show Password
          </b-form-checkbox>

          <b-button type="submit" variant="primary" class="mt-3">Registrasi</b-button>
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
        email: null,
        password: null,
        confirmPassword: null
      },
      loading: false,
      statusPw: false,
      statusPw2: false
    };
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
     async regisUser() {
     this.loading = true
      const API_URL = "https://satria-budi.hasura.app/v1/graphql";
      const API_HEADERS = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "QOcEnAWFOG6YIJW3Z1cE7sOibdW1dMrRaX36hqyWUcVkpdiUdcAMWrvW3LAZpAfX",
      };

      const API_QUERY = `
      query MyQuery {
        management_book_tabel_user(where: {email: {_eq: "${this.form.email}"}}) {
          id
        }
      }
      `;
      try {
        const data =await axios.post(
          API_URL,
          { query: API_QUERY },
          { headers: API_HEADERS }
        );
        if (data.data.data.management_book_tabel_user.length > 0) {
            this.loading = false
            this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Username Telah digunakan',
          });
        } else {
          this.insertRegis()
        }
        return
      } catch (error) {
        console.error(error)
        this.loading = false
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    },
    async insertRegis() {
      const API_URL = "https://satria-budi.hasura.app/v1/graphql";
      const API_HEADERS = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "QOcEnAWFOG6YIJW3Z1cE7sOibdW1dMrRaX36hqyWUcVkpdiUdcAMWrvW3LAZpAfX",
      };

      const API_QUERY = `
      mutation MyMutation {
        insert_management_book_tabel_user(objects: {email: "${this.form.email}", password: "${this.form.password}", updated_by: "${this.form.email}", created_by: "${this.form.email}"}) {
          affected_rows
        }
      }
      `;
      try {
        await axios.post(
          API_URL,
          { query: API_QUERY },
          { headers: API_HEADERS }
        );
        this.loading = false
        await this.$swal({
          icon: 'success',
          title: 'Register Success',
          showConfirmButton: false,
          timer: 1500
        })
        this.$router.push('/login')
        return
      } catch (error) {
        console.error(error)
        this.loading = false
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    }
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

