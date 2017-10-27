<template>
  <div class="hello">
    <BlogList :store="store" @go="(v) => { currentBlog = v; $router.push({ path: '/articles/' + v['.key'] }); }" />
  </div>
</template>

<script>
import BlogList from '@/components/Parts/BlogList'
import { getBlog, store } from '@/system/blog'

export default {
  name: 'hello',
  components: {
    BlogList
  },
  data () {
    return {
      store,
      currentBlog: false
    }
  },
  mounted () {
    getBlog()
  },
  methods: {

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
