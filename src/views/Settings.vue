<template>
  <section id="settings">
    <div class="col1">
      <h3>Configurazione</h3>
      <p>Aggiornamento Profilo</p>

      <transition name="fade">
        <p v-if="showSuccess" class="success">profile updated</p>
      </transition>

      <form @submit.prevent>
        <label for="name">Nome</label>
        <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />

        <label for="title">Cognome</label>
        <input v-model.trim="title" type="text" :placeholder="userProfile.title" id="title" />

       <v-checkbox
          v-model="allowSpaces"
          label="Admin"
        ></v-checkbox>

        <button @click="updateProfile()" class="button">Salva</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      name: '',
      title: '',
      showSuccess: false
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
    updateProfile() {
      this.$store.dispatch('updateProfile', {
        name: this.name !== '' ? this.name : this.userProfile.name,
        title: this.title !== '' ? this.title : this.userProfile.title
      })
      this.name = ''
      this.title = ''
      this.showSuccess = true
      setTimeout(() => {
        this.showSuccess = false
      }, 2000)
    }
  }
}
</script>