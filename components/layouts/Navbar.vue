<template>
  <div>
    <nuxt-link
      v-for="item in menu"
      :key="item.name"
      :to="item.link"
      class="link"
    >
      {{ item.name }}
    </nuxt-link>
    <template v-if="isLoggedIn"> 
      <nuxt-link class="link" :to="{name: 'Profile'}">
        {{profile.name}}
      </nuxt-link>
      <a class="link" @click="onLogout">
        logout
      </a>
    </template>
    <template v-else>
      <nuxt-link class="link" :to="{name: 'Login'}">
        login
      </nuxt-link>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { menu } from '@/config/menu'
export default Vue.extend({
  data() {
    return {
      menu,
    }
  },

  computed: {
    ...mapState('auth', ['isLoggedIn']),
    ...mapState('me', ['profile']),
  },

  methods: {
    onLogout():void {
      this.$store.dispatch('auth/logout')
    }
  }
})
</script>

<style lang="sass" scoped>
.link
  @apply text-blue-500

  &:hover
    @apply underline
</style>
