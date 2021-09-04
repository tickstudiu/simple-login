<template>
  <div class="login">
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="form.username" required placeholder="username">
      <input type="text" v-model="form.password" required placeholder="password">
      <button type="submit">submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {LoginForm} from '@/types/auth'
export default Vue.extend({
  middleware: ['notLoggedIn'],

  data() {
    return {
      form: {
        username: 'username',
        password: 'password'
      } as LoginForm
    }
  },

  methods: {
    onSubmit():void {
      this.$store.dispatch('auth/login', this.form)
    }
  }
})
</script>
