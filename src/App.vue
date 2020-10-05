<template>
  <div id="app">
    <link rel="stylesheet" 
        href="../node_modules/@fortawesome/fontawesome-free/css/all.css">
    <SiteNav v-if="showNav"></SiteNav>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SiteNav from '@/components/SiteNav'

export default {
  components: {
    SiteNav
  },
  computed: {
    ...mapState(['userProfile']),
    showNav() {
      return Object.keys(this.userProfile).length > 1
    }
  }
}
</script>
