<template>
  <header>
    <section>
      <div class="col1">
        <router-link to="/">
          <h3>My Times - {{this.userProfile.name }}</h3>
        </router-link>
        <ul class="inline">
            <!-- <li>
            <router-link to="/dashboard">dashboard</router-link>
          </li> -->
          <li>
            <router-link to="/calendar">Presenze Personali</router-link>
          </li>
          <li>
            <router-link to="/reports" v-if="userProfile.admin == true">Presenze Azienda</router-link>
          </li>
          <li><a @click="logout()">Logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
    ...mapState(['userProfile', 'posts'])
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>