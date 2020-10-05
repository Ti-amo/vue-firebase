<template>
  <div id="dashboard">
    <transition name="fade">
      <CommentModal
        v-if="showCommentModal"
        :post="selectedPost"
        @close="toggleCommentModal()"
      ></CommentModal>
    </transition>
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ userProfile.name }}</h5>
          <p>{{ userProfile.title }}</p>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button
                @click="createPost()"
                :disabled="post.content === ''"
                class="button"
              >
                post
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col2">
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post">
            <Post :post="post" :showCommentModal="showCommentModal" @childToParent="toggleCommentModal">

            </Post>
          </div>
        </div>

        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { commentsCollection } from "@/firebase";
import { mapState } from "vuex";
import moment from "moment";
import CommentModal from "@/components/CommentModal";
import Post from "@/components/Post"

export default {
  components: {
    CommentModal,
    Post,
  },
  data() {
    return {
      post: {
        content: "",
      },
      selectedPost: {},
      showPostModal: false,
      fullPost: {},
      postComments: [],
    };
  },
  computed: {
    ...mapState(["userProfile", "posts", "comments","showCommentModal"]),
  },
  methods: {
    createdOnDate(val) {
      if (!val) {
        return "-";
      }

      let date = val.toDate();
      return moment(date).fromNow();
    },
    contentTrimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    },
    createPost() {
      this.$store.dispatch("createPost", { content: this.post.content });
      this.post.content = "";
    },
    toggleCommentModal(value) {
      // this.$store.dispatch('setShowCommentModal')
      if (this.showCommentModal) {
         this.selectedPost = value
      } else {
        this.selectedPost = {};
      }
      // 

          console.log("jisooooo", value) // someValue

      // if opening modal set selectedPost, else clear
      
    },
    likePost(id, likesCount) {
      this.$store.dispatch("likePost", { id, likesCount });
    },
    viewPost(post) {
      this.showPostModal = !this.showPostModal;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
