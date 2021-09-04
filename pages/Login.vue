<template>
  <div class="login">
    <form @submit.prevent="onSubmit">
      <button type="submit">submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    onSubmit():void {
      this.$store.dispatch('auth/login')
    }
  }
})
</script>
