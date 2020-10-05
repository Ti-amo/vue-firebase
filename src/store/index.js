import { auth } from "firebase";
import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "../router/index";
import Toasted from "vue-toasted";

Vue.use(Vuex);
Vue.use(Toasted);

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

fb.commentsCollection.orderBy("createdOn", "desc").onSnapshot((snapshot) => {
  let commentsArray = [];

  snapshot.forEach((doc) => {
    let comment = doc.data();
    comment.id = doc.id;

    commentsArray.push(comment);
  });

  store.commit("setComments", commentsArray);
});

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: [],
    comments: [],
    showCommentModal: false,
  },
  mutations: {
    setCommentModal(state, val) {
      state.showCommentModal = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPerformingRequest(state, val) {
      state.performingRequest = val;
    },
    setPosts(state, val) {
      state.posts = val;
    },
    setComments(state, val) {
      state.comments = val;
    },
  },
  actions: {
    setShowCommentModal({ commit }) {
      commit("setCommentModal", !store.state.showCommentModal);
    },

    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth
        .signInWithEmailAndPassword(form.email, form.password)
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          Vue.toasted.error(errorMessage, {
            theme: "bubble",
            position: "top-right",
            duration: 5000,
          });
        });

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
      Vue.toasted.success("Login successful!", {
        theme: "bubble",
        position: "top-right",
        duration: 5000,
      });
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
        email: form.email,
      });

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get();

      // set user profile in state
      commit("setUserProfile", userProfile.data());

      // change route to dashboard
      if (router.currentRoute.path === "/login") {
        router.push("/", () => {
        });
      }
    },
    async logout({ commit }) {
      // log user out
      await fb.auth.signOut();

      // clear user data from state
      commit("setUserProfile", {});

      // redirect to login view
      router.push("/login");
    },
    async createPost({ state, commit }, post) {
      // create post in firebase
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        countcomments: 0,
        likes: 0,
        isLiked: false,
        picture: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/500/300`,
        comments: [],
      });
    },
    async likePost({ commit }, post) {
      const userId = fb.auth.currentUser.uid;
      const docId = `${userId}_${post.id}`;

      // check if user has liked post
      if (post.isLiked == true) {
        await fb.likesCollection
          .doc(docId)
          .delete()
          .then(function() {
            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });

        // update post likes count
        fb.postsCollection.doc(post.id).update({
          likes: post.likesCount - 1,
          isLiked: false,
        });
        return
      } else {
        await fb.likesCollection.doc(docId).set({
          postId: post.id,      
          userId: userId,
        });

        // update post likes count
        fb.postsCollection.doc(post.id).update({
          likes: post.likesCount + 1,
          isLiked: true,
        });
      }
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
