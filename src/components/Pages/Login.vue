<template>
<button @click="login()">Login</button>
</template>

<script>
import { appState, loginDefault, readyRT } from '@/system/auth'
export default {
  data () {
    return {
      appState
    }
  },
  mounted () {
    readyRT().then(() => {
      this.$router.push({
        path: '/dashboard'
      })
    }, () => {
      this.$router.push({
        path: '/login'
      })
    })
  },
  methods: {
    login () {
      loginDefault().then(() => {
        this.$router.push({
          path: '/dashboard'
        })
      }, () => {
        this.$router.push({
          path: '/login'
        })
      })
    }
  }
}
</script>

<style>

</style>
