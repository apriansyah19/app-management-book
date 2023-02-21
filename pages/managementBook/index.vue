<template>
  <div>
    <div v-if="loading" class="loading-page">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <b-container class="pt-5">
      <b-button size="md" @click="addData()" variant="primary" class="mb-1">
        Add
      </b-button>
      <b-table :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc" :sort-direction="sortDirection" stacked="md" show-empty small>
        <template #cell(gambar)="row">
          <b-img :height="150" :src="row.value"></b-img>
        </template>

        <template #cell(actions)="row">
          <b-button size="sm" @click="editData(row.item)" variant="outline-success" class="mr-1">
            <b-icon-pencil-square></b-icon-pencil-square>
          </b-button>
          <b-button size="sm" @click="deleteData(row.item)" variant="outline-danger" class="mr-1">
            <b-icon-trash></b-icon-trash>
          </b-button>
        </template>
      </b-table>
      <div class="overflow-auto">
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right"></b-pagination>
      </div>
    </b-container>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    layout: 'default',
    data() {
      return {
        items: [],
        fields: [
          { key: 'gambar', label: 'Gambar', class: 'text-center'  },
          { key: 'judul', label: 'Judul Buku' },
          { key: 'stok', label: 'Stok'},
          { key: 'actions', label: 'Actions' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        loading: false
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        this.loading = true
        const API_URL = "https://satria-budi.hasura.app/v1/graphql";
        const API_HEADERS = {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "QOcEnAWFOG6YIJW3Z1cE7sOibdW1dMrRaX36hqyWUcVkpdiUdcAMWrvW3LAZpAfX",
        };

        const API_QUERY = `
        query MyQuery {
          management_book_tabel_buku(order_by: {id: desc}) {
            gambar
            id
            judul
            stok
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
          this.items = data.data.data.management_book_tabel_buku
          this.totalRows = data.data.data.management_book_tabel_buku.length
          this.loading = false
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
      deleteData(val) {
         this.$swal({
          title: 'apakah yakin data akan dihapus?',
          showDenyButton: true,
          confirmButtonText: 'Ya',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.delete(val)
          }
        })
      },
      async delete(val) {
        this.loading = true
        const API_URL = "https://satria-budi.hasura.app/v1/graphql";
        const API_HEADERS = {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "QOcEnAWFOG6YIJW3Z1cE7sOibdW1dMrRaX36hqyWUcVkpdiUdcAMWrvW3LAZpAfX",
        };

        const API_QUERY = `
        mutation MyMutation {
          delete_management_book_tabel_buku(where: {id: {_eq: ${val.id}}}) {
            affected_rows
          }
        }`;
        try {
          await axios.post(
            API_URL, {
              query: API_QUERY
            }, {
              headers: API_HEADERS
            }
          );          
          this.getData()
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
      editData(val) {
        this.$router.push({ name: 'managementBook-detail-id', params: { id: val.id}})
      },
      addData() {
        this.$router.push({ name: 'managementBook-detail-id'})
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