<template>
<div>
  <BlogSim v-if="currentBlog" class="simsim" :blog="currentBlog"/>
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
    getOneBlog(this.$route.params.id).then((blog) => {
      this.currentBlog = blog
    })
  }
}
</script>

<style>

</style>
