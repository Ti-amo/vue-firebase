<template>
  <div>
    <h5>{{ post.userName }}</h5>
    <span>{{ createdOnDate(post.createdOn) }}</span>
    <p>{{ contentTrimLength(post.content) }}</p>
    <ul>
      <li>
        <a @click="toggleShowCommentModal()"
          >comments {{ post.countcomments }}</a
        >
      </li>
      <li>
        <a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a>
      </li>
      <li><a @click="viewPost(post)">view full post</a></li>
    </ul>
    <transition name="fade">
      <div v-show="showPostModal" class="comments">
        <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <p>{{ comment.userName }}</p>
          <span>{{ createdOnDate(comment.createdOn) }}</span>
          <p>{{ comment.content }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { commentsCollection } from "@/firebase";
import { mapState } from "vuex";
import moment from "moment";
import CommentModal from "./CommentModal";

export default {
  props: ["post"],
  data() {
    return {
      selectedPost: {},
      showPostModal: false,
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
   
    toggleShowCommentModal() {
       this.$store.dispatch('setShowCommentModal')
        // console.log("toggleCommentModal -> showCommentModal", this.showCommentModal)
        console.log("toggleShowCommentModal -> showCommentModal", this.showCommentModal)
      this.$emit('childToParent', this.post)
      // if opening modal set selectedPost, else clear
    //   if (this.showCommentModal) {
    //     this.selectedPost = post;
    //   } else {
    //     this.selectedPost = {};
    //   }
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
