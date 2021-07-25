<template>
  <div id="login">
    <PasswordReset
      v-if="showPasswordReset"
      @close="togglePasswordReset()"
    ></PasswordReset>
    <section>
      <div class="col1">
        <h1>Bigo Solutions - My Time</h1>
      </div>
      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Benvenuto</h1>
          <div>
            <label for="email1">Email</label>
            <input
              v-model.trim="loginForm.email"
              type="text"
              placeholder="you@email.com"
              id="email1"
            />
          </div>
          <div>
            <label for="password1">Password</label>
            <input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="******"
              id="password1"
            />
          </div>
         
          <button @click="login()" class="button">Log In</button>
          <v-snackbar v-model="showErrors">
            {{ this.errors }}

            <template v-slot:action="{ attrs }">
              <v-btn
                color="pink"
                text
                v-bind="attrs"
                @click="showErrors = false"
              >
                Close
              </v-btn>
            </template>
          </v-snackbar>
          <div class="extras">
            <a @click="togglePasswordReset()">Password Dimenticata</a>
             <a @click="toggleForm()">Nuovo Utente</a>
          </div>
          <div class="text-center" v-if="this.loading">
            <v-dialog v-model="dialog" hide-overlay persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  Please stand by
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </form>
        <form v-else @submit.prevent>
          <h1>Inizia</h1>
          <div>
            <label for="name">Nominativo</label>
            <input
              v-model.trim="signupForm.name"
              type="text"
              placeholder="Mario Rossi"
              id="name"
            />
          </div>
          <!-- <div>
            <label for="title">Title</label>
            <input
              v-model.trim="signupForm.title"
              type="text"
              placeholder="Company"
              id="title"
            />
          </div> -->
          <div>
            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="you@email.com"
              id="email2"
            />
          </div>
          <div>
            <label for="password2">Password</label>
            <input
              v-model.trim="signupForm.password"
              type="password"
              placeholder="min 6 caratteri"
              id="password2"
            />
          </div>
           <div>
            <v-checkbox
          v-model="signupForm.admin"
          label="Admin"
          ></v-checkbox>
        </div>
          <button @click="signup()" class="button">Sign Up</button>
          <div class="extras">
            <a @click="toggleForm()">Torna Indietro</a>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import PasswordReset from "@/components/PasswordReset";
export default {
  components: {
    PasswordReset,
  },
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      signupForm: {
        name: "",
        title: "",
        email: "",
        password: "",
        admin : false,
      },
      loading: false,
      showLoginForm: true,
      showPasswordReset: false,
      errors: "",
      showErrors: false,
    };
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
    },
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset;
    },
    login() {
      this.loading = true;
      if (this.loginForm.email != "" && this.loginForm.password != "") {
        this.showErrors = true;
        this.errors = "Carimaneto in corso...";
        this.$store
          .dispatch("login", {
            email: this.loginForm.email,
            password: this.loginForm.password,
          })
          .catch((error) => {
            this.showErrors = true;
            this.errors = "Email o password errati";
          });
      } else {
        this.showErrors = true;
        this.errors = "Compilare correttamente i campi";
      }
      this.loading = false;
    },
    signup() {
      this.$store.dispatch("signup", {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name,
        title: this.signupForm.title,
      });
    },
  },
};
</script>
