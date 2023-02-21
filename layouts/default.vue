<template>
  <div>
    <b-navbar toggleable="lg" variant="light">
    <div class="container">
      <b-navbar-brand href="#">Satria Library</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <button type="button" class="btn btn-dark btn-sm" @click="logout">Logout</button>
          <div class="nav-link mt-1" to="/keranjang">
            {{ $cookies.get('libraryState') }}
          </div>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
    <Nuxt />
  </div>
</template>

<script>
  export default {
    methods: {
      logout() {
        this.$swal({
          title: 'Do you want to logout?',
          showDenyButton: true,
          confirmButtonText: 'Ya',
          allowOutsideClick: false,
        }).then((result) => {
        if (result.isConfirmed) {
          this.$cookies.remove('libraryState')
          this.$router.push('login')
        }
      })
      }
    }
  }
</script>
