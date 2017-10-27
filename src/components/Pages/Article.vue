<template>
<div class="home">
 <BlogSim v-if="currentBlog" class="sim" :blog="currentBlog"/>
 <h3  @click="$router.push({ path: '/' })">Home</h3>
</div>
</template>

<script>
import { getOneBlog } from '@/system/blog'
import BlogSim from '@/components/Parts/BlogSim'

export default {
  components: {
    BlogSim
  },
  data () {
    return {
      currentBlog: false
    }
  },
  mounted () {
    getOneBlog({ articleID: this.$route.params.id }).then((blog) => {
      console.log(blog)
      this.currentBlog = blog
    })
  }
}
</script>

<style scoped>
.home{
  display: flex;
}
.sim{
  display: inline-block;
}
</style>
