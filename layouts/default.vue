<template>
  <div>
    <Navbar />
    <div>
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Navbar from '@/components/layouts/Navbar.vue'
import Footer from '@/components/layouts/Footer.vue'

export default Vue.extend({
  components: {
    Navbar,
    Footer,
  },
})
</script>
