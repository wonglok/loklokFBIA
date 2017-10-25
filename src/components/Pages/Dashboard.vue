<template>
<div>
  Dashbaord
  <button @click="logout">Logout</button>
  <button @click="makeBlog">makeBlog</button>

  <BlogList :store="store" @edit="(v) => { currentBlog = v; }" />

  <BlogEditor v-if="currentBlog" :blog="currentBlog" @save="saveBlog" @remove="removeBlog" />

  <!-- <pre>{{ store.blogStore }}</pre> -->

</div>
</template>

<script>
import { logout } from '@/system/auth'
import { getRTBlog, store, makeBlog, saveBlog, removeBlog } from '@/system/blog'
import BlogList from '@/components/Parts/BlogList'
import BlogEditor from '@/components/Parts/BlogEditor'
export default {
  components: {
    BlogList,
    BlogEditor
  },
  data () {
    return {
      currentBlog: false,
      store: store
    }
  },
  mounted () {
    getRTBlog()
  },
  methods: {
    makeBlog () {
      makeBlog()
    },
    saveBlog (blog) {
      saveBlog(blog.articleID, blog)
    },
    removeBlog (blog) {
      removeBlog(blog.articleID)
      this.currentBlog = false
    },
    logout () {
      logout().then(() => {
        this.$router.push({
          path: '/'
        })
      })
    }
  }
}
</script>

<style>

</style>
