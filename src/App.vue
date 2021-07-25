<template>
  <v-app>
    <div id="app">
      <SiteNav v-if="showNav"></SiteNav>
      <router-view />
    </div>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import SiteNav from "@/components/SiteNav";


export default {
  components: {
    SiteNav,
  },
  computed: {
    ...mapState(["userProfile"]),
    showNav() {
      return Object.keys(this.userProfile).length > 1;
    },
  },
  mounted() {
	window.onpopstate = event => {
		if (!this.$session.exists()) {
			this.$router.push("/");
		}
	};
  }
};
</script>
