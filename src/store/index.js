import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "../router/index";

Vue.use(Vuex);

// realtime firebase
fb.postsCollection.orderBy("createdOn", "desc").onSnapshot((snapshot) => {
  let postsArray = [];

  snapshot.forEach((doc) => {
    let post = doc.data();
    post.id = doc.id;

    postsArray.push(post);
  });

  store.commit("setPosts", postsArray);
});

fb.timesCollection.orderBy("createdOn", "desc").onSnapshot((snapshot) => {
  let timesArray = [];
  snapshot.forEach((doc) => {
    if (doc.data().userId === fb.auth.currentUser.uid) {
      let time = doc.data();
      time.id = doc.id;

      timesArray.push(time);
    }
  });

  store.commit("setTimes", timesArray);
});

fb.usersCollection.onSnapshot((snapshot) => {
  let usersArray = [];

  snapshot.forEach((doc) => {
    let post = doc.data();
    post.id = doc.id;

    usersArray.push(post);
  });
  store.commit("setUtenti", usersArray);
});

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: [],
    events: [],
    users: [],
    eventsById: [],
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPerformingRequest(state, val) {
      state.performingRequest = val;
    },
    setPosts(state, val) {
      state.posts = val;
    },
    setTimes(state, val) {
      state.events = val;
    },
    setUtenti(state, val) {
      state.users = val;
    },
    setEventsById(state, val) {
      state.eventsById = val;
    },
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );

      // create user object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        title: form.title,
      });

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    /* async fetchEvents({ commit }, user) {
      let timesArray = [];
      const get = await fb.timesCollection.where("userId", "==", user).get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              let time = doc.data()
              time.id = doc.id
          
              timesArray.push(time)
          });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });

      commit('setTimes', timesArray)
    },*/
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get();

      // set user profile in state
      commit("setUserProfile", userProfile.data());

      // change route to dashboard
      if (router.currentRoute.path === "/login") {
        router.push("/");
      }
    },
    async getEventsById({ commit }, user) {

      fb.timesCollection.where("userId", "==",  user.content).orderBy("dateDay", "asc").onSnapshot((snapshot) => {
        let timesArray = [];
        snapshot.forEach((doc) => {
          if (doc.data().userId === fb.auth.currentUser.uid) {
            let time = doc.data();
            time.id = doc.id;
      
            timesArray.push(time);
          }
        });
      
        store.commit("setEventsById", timesArray);
      });

//       let usersArray = [];
//       let timesArray = [];
//       const get = await fb.timesCollection.where("userId", "==",  user.content).orderBy("dateDay", "desc").get()
//       .then((querySnapshot) => {
//           querySnapshot.forEach((doc) => {
//               // doc.data() is never undefined for query doc snapshots
//               let time = doc.data()
//               time.id = doc.id
          
//               timesArray.push(time)
//           });
//       })
//       .catch((error) => {
//           console.log("Error getting documents: ", error);
//       });
// console.log(timesArray)
//       commit('setEventsById', timesArray)
    },
    async logout({ commit }) {
      // log user out
      await fb.auth.signOut();

      // clear user data from state
      commit("setUserProfile", {});

      // redirect to login view
      router.push("/login");
    },
    async createTime({ state, commit }, time) {
      // create time in firebase
      await fb.timesCollection.add({
        createdOn: new Date(),
        dateDay: new Date(time.content[0].start),
        name: time.content[0].name,
        start: time.content[0].start,
        end: time.content[0].end,
        giorno_name: time.content[0].giorno_name,
        color: time.content[0].color,
        timed: time.content[0].timed,
        details: time.content[0].details,
        tipologia: time.content[0].tipologia,
        entrata_mattino: time.content[0].entrata_mattino,
        uscita_mattino: time.content[0].uscita_mattino,
        entrata_pomeriggio: time.content[0].entrata_pomeriggio,
        uscita_pomeriggio: time.content[0].uscita_pomeriggio,
        totale_giorno: time.content[0].totale_giorno,
        ferie: time.content[0].ferie,
        permessi: time.content[0].permessi,
        ticket: time.content[0].ticket,
        note: time.content[0].note,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        check_mese: time.content[0].check_mese,
        mese: time.content[0].mese,
        anno: time.content[0].anno,
        ore_ferie_totali: time.content[0].ore_ferie_totali,
        ore_permesso_totali: time.content[0].ore_permesso_totali,
        ore_lavoro_totali: time.content[0].ore_lavoro_totali,
      });
    },
    async updateTime({ state, commit }, time) {
      // update time in firebase
      await fb.timesCollection.doc(time.id).update({
        name: time.content[0].name,
        dateDay: new Date(time.content[0].start),
        start: time.content[0].start,
        end: time.content[0].end,
        giorno_name: time.content[0].giorno_name,
        color: time.content[0].color,
        timed: time.content[0].timed,
        details: time.content[0].details,
        tipologia: time.content[0].tipologia,
        entrata_mattino: time.content[0].entrata_mattino,
        uscita_mattino: time.content[0].uscita_mattino,
        entrata_pomeriggio: time.content[0].entrata_pomeriggio,
        uscita_pomeriggio: time.content[0].uscita_pomeriggio,
        totale_giorno: time.content[0].totale_giorno,
        ferie: time.content[0].ferie,
        permessi: time.content[0].permessi,
        ticket: time.content[0].ticket,
        note: time.content[0].note,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        check_mese: time.content[0].check_mese,
        mese: time.content[0].mese,
        anno: time.content[0].anno,
        ore_ferie_totali: time.content[0].ore_ferie_totali,
        ore_permesso_totali: time.content[0].ore_permesso_totali,
        ore_lavoro_totali: time.content[0].ore_lavoro_totali,
      });
    },
    async deleteTime({ state, commit }, time) {
      // delete post in firebase
      await fb.timesCollection.doc(time.content.id).delete();
    },
    async createPost({ state, commit }, post) {
      // create post in firebase
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0,
      });
    },
  
    async likePost({ commit }, post) {
      const userId = fb.auth.currentUser.uid;
      const docId = `${userId}_${post.id}`;

      // check if user has liked post
      const doc = await fb.likesCollection.doc(docId).get();
      if (doc.exists) {
        return;
      }

      // create post
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId,
      });

      // update post likes count
      fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1,
      });
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid;
      // update user object
      const userRef = await fb.usersCollection.doc(userId).update({
        name: user.name,
        title: user.title,
      });

      dispatch("fetchUserProfile", { uid: userId });

      // update all posts by user
      const postDocs = await fb.postsCollection
        .where("userId", "==", userId)
        .get();
      postDocs.forEach((doc) => {
        fb.postsCollection.doc(doc.id).update({
          userName: user.name,
        });
      });

      // update all comments by user
      const commentDocs = await fb.commentsCollection
        .where("userId", "==", userId)
        .get();
      commentDocs.forEach((doc) => {
        fb.commentsCollection.doc(doc.id).update({
          userName: user.name,
        });
      });
    },
  },
});

export default store;
