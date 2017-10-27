<template>
<div class="home">
 <h3  @click="$router.push({ path: '/' })">Home</h3>
 <BlogSim v-if="currentBlog" class="sim" :blog="currentBlog"/>
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
  flex-direction: column;
}
.sim{
  display: inline-block;
}
</style>
