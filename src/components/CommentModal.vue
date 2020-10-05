<template>
  <div class="c-modal">
    <div class="c-container">
      <a @click="close()">close</a>
      <p>add a comment</p>
      <form @submit.prevent>
        <textarea v-model.trim="comment"></textarea>
        <button @click="addComment()" :disabled="comment == ''" class="button">
          add comment
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { commentsCollection, postsCollection, auth } from "@/firebase";

export default {
  props: ["post"],
  data() {
    return {
      comment: "",
    };
  },
  methods: {
    async addComment() {
      // create comment
      await commentsCollection.add({
        createdOn: new Date(),
        content: this.comment,
        postId: this.post.id,
        userId: auth.currentUser.uid,
        userName: this.$store.state.userProfile.name,
      });

      let newComment = {
        createdOn: new Date(),
        content: this.comment,
        userId: auth.currentUser.uid,
        userName: this.$store.state.userProfile.name,
      };

      await postsCollection.doc(this.post.id).update({
        countcomments: parseInt(this.post.countcomments) + 1,
        comments: [...this.post.comments, newComment],
      });

      // close modal
      this.$store.dispatch("setShowCommentModal");
    },
    close() {
      this.$store.dispatch("setShowCommentModal");
    },
  },
};
</script>
