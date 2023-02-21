<template>
  <div>
    <div v-if="loading" class="loading-page">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div class="pt-5">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-container class="container bv-example-row text-center">
          <b-row class="my-1">
            <b-col sm="3" align-self="end">
              <label><b>Judul</b></label>
            </b-col>
            <b-col sm="9">
              <b-form-input v-model="form.title" required></b-form-input>
            </b-col>
          </b-row>

          <b-row class="my-2">
            <b-col sm="3" align-self="end">
              <label><b>Stok</b></label>
            </b-col>
            <b-col sm="9">
              <b-form-input v-model="form.stok" required></b-form-input>
            </b-col>
          </b-row>

          <b-row class="my-2">
            <b-col sm="3" align-self="end">
              <label><b>Gambar</b></label>
            </b-col>
            <b-col sm="9">
              <b-form-file v-model="form.image" required class="my-2" @input="chooseImage" plain></b-form-file>
            </b-col>
          </b-row>

          <b-row v-if="form.imageBase64" class="my-2">
            <b-img center :src="form.imageBase64" :height="200"></b-img>
          </b-row>

        </b-container>
        <div class="d-flex justify-content-end container">
          <b-button type="submit" class="mr-2" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        title: '',
        stok: '',
        image: null,
        imageBase64: null
      },
      loading: false,
      show: true
    }
  },
  async mounted() {
    if (this.$route.params.id) {
      this.loading = true
      const API_URL = "https://satria-budi.hasura.app/v1/graphql";
      const API_HEADERS = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "QOcEnAWFOG6YIJW3Z1cE7sOibdW1dMrRaX36hqyWUcVkpdiUdcAMWrvW3LAZpAfX",
      };

      const API_QUERY = `
      query MyQuery {
        management_book_tabel_buku(where: {id: {_eq: ${+this.$route.params.id}}}) {
          judul
          stok
          gambar
        }
      }
      `;
      try {
        const data = await axios.post(
          API_URL, {
            query: API_QUERY
          }, {
            headers: API_HEADERS
          }
        );
        const res = data.data.data.management_book_tabel_buku
        this.loading = false
        if (res.length > 0) {
          this.form.title = res[0].judul
          this.form.stok = res[0].stok
          this.form.imageBase64 = res[0].gambar
        } else {
          await this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Mohon Maaf Data Tidak Ditemukan',
          timer: 1500
        });
        this.$router.push('/managementBook')
        }
        return;
      } catch (error) {
        this.loading = false
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
        this.$router.push('/managementBook')
      }
    }
  },
  methods: {
    async onSubmit(event) {
      if (this.$route.params.id) {
        event.preventDefault()
        this.loading = true
        const API_URL = "https://satria-budi.hasura.app/v1/graphql";
        const API_HEADERS = {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "QOcEnAWFOG6YIJW3Z1cE7sOibdW1dMrRaX36hqyWUcVkpdiUdcAMWrvW3LAZpAfX",
        };

        const API_QUERY = `
        mutation MyMutation {
        update_management_book_tabel_buku(where: {id: {_eq: ${this.$route.params.id}}}, 
          _set: {
          judul: "${this.form.title}", 
          stok: ${+this.form.stok}, 
          gambar: "${this.form.imageBase64}", 
          updated_by: "${this.$cookies.get('libraryState')}"
        }) {
          affected_rows
        }
      }
      `;
        try {
          const data = await axios.post(
            API_URL, {
              query: API_QUERY
            }, {
              headers: API_HEADERS
            }
          );
          const res = data.data.data.update_management_book_tabel_buku.affected_rows
          this.loading = false
          if (res > 0) {
            await this.$swal({
              icon: 'success',
              title: 'Update Data Success',
              showConfirmButton: false,
              timer: 1000
            })
          }
          this.$router.push('/managementBook')
          return;
        } catch (error) {
          this.loading = false
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
        return
      }
      event.preventDefault()
      this.loading = true
      const API_URL = "https://satria-budi.hasura.app/v1/graphql";
      const API_HEADERS = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "QOcEnAWFOG6YIJW3Z1cE7sOibdW1dMrRaX36hqyWUcVkpdiUdcAMWrvW3LAZpAfX",
      };

      const API_QUERY = `
      mutation MyMutation {
        insert_management_book_tabel_buku(objects: {
          created_by: "${this.$cookies.get('libraryState')}", 
          gambar: "${this.form.imageBase64}",
          judul: "${this.form.title}", 
          stok: ${+this.form.stok}, 
          updated_by: "${this.$cookies.get('libraryState')}"}) {
          affected_rows
        }
      }
      `;
      try {
        const data = await axios.post(
          API_URL, {
            query: API_QUERY
          }, {
            headers: API_HEADERS
          }
        );
        const res = data.data.data.insert_management_book_tabel_buku.affected_rows
        this.loading = false
        if (res > 0) {
          await this.$swal({
            icon: 'success',
            title: 'Insert Data Success',
            showConfirmButton: false,
            timer: 1000
          })
        }
        this.$router.push('/managementBook')
        return;
      } catch (error) {
        this.loading = false
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.title = ''
      this.form.stok = ''
      this.form.image = null
      this.form.imageBase64 = null
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    async chooseImage(val) {
      if (!val.type.includes('image')) {
        this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Ekstension yang diperbolehkan : JPG, JPEG, PNG',
          });
          this.form.image = null
          this.form.imageBase64 = null
          return;
        }
      const res = await this.toBase64(val)
      this.form.imageBase64 = res
    },
    toBase64(file) { 
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
  }
}
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
