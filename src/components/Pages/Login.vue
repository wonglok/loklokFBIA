<template>
<button @click="login()">Login</button>
</template>

<script>
import { appState, readyRT, loginToGoogle } from '@/system/auth'
export default {
  data () {
    return {
      appState
    }
  },
  methods: {
    login () {
      readyRT().then(() => {
      }, () => {
        loginToGoogle()
      })
    }
  }
}
</script>

<style>

</style>
