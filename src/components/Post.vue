<template>
  <div>
    <h5>{{ post.userName }}</h5>
    <span>{{ createdOnDate(post.createdOn) }}</span>
    <p>{{ contentTrimLength(post.content) }}</p>
    <img class="banner" :src="post.picture" />
    <ul>
      <li>
        <a @click="toggleShowCommentModal()"
          >comments {{ post.countcomments }}</a
        >
      </li>
      <li>
        <a @click="likePost(post.id, post.likes, post.isLiked)"
          >likes {{ post.likes }}
          <i :class="post.isLiked ? solidHeart : regularHeart"></i>
        </a>
      </li>
      <li>
        <a v-show="post.comments.length" @click="viewPost(post)"
          >view full post</a
        >
      </li>
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
      solidHeart: '',
      regularHeart: 'fas fa-fire',
      selectedPost: {},
      showPostModal: false,
    };
  },
  computed: {
    ...mapState(["userProfile", "posts", "comments", "showCommentModal"]),
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
      this.$store.dispatch("setShowCommentModal");
      this.$emit("childToParent", this.post);
    },
    likePost(id, likesCount, isLiked) {
      console.log("likePost -> isLiked", this.post.isLiked);

      this.$store.dispatch("likePost", { id, likesCount, isLiked });
    },
    viewPost(post) {
      this.showPostModal = !this.showPostModal;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
