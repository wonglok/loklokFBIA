<template>
<div class="window">
  <div class="border-top"></div>
  <div class="border-left"></div>
  <div class="border-bottom"></div>

  <div :class="{ 'simsim-list': true }">
    Dashbaord
    <button @click="logout">Logout</button>
    <button @click="makeBlog">makeBlog</button>
    <BlogList :store="store" @edit="(v) => { currentBlog = v; }" />
  </div>

  <BlogEditor class="simsim-edit" @back="(v) => { currentBlog = v; }" v-if="currentBlog" :blog="currentBlog" @save="saveBlog" @remove="removeBlog" @pick-image="(v) => { openImagePicker(v) }" />
  <BlogSim class="simsim" v-if="currentBlog" :blog="currentBlog" @pick-image="(v) => { openImagePicker(v) }" />
  <ImagePicker v-show="imagePicker.show" :blog="imagePicker.blog" :object="imagePicker.object" :member="imagePicker.member" :desc="imagePicker.desc" @close="closeImagePicker()" class="image-picker" />
  <!-- <pre>{{ store.blogStore }}</pre> -->

</div>
</template>

<script>
import { logout } from '@/system/auth'
import { getRTBlog, store, makeBlog, saveBlog, removeBlog } from '@/system/blog'
import BlogList from '@/components/Parts/BlogList'
import BlogEditor from '@/components/Parts/BlogEditor'
import BlogSim from '@/components/Parts/BlogSim'
import ImagePicker from '@/components/Parts/ImagePicker'
export default {
  components: {
    BlogSim,
    BlogList,
    BlogEditor,
    ImagePicker
  },
  data () {
    return {
      imagePicker: {
        show: false,
        blog: false,
        target: false,
        key: false,
        desc: false
      },
      currentBlog: false,
      store: store
    }
  },
  mounted () {
    getRTBlog()
  },
  methods: {
    closeImagePicker () {
      this.imagePicker.show = false
    },
    openImagePicker ({ blog, object, member, desc }) {
      this.imagePicker.show = true
      this.imagePicker.blog = blog
      this.imagePicker.object = object
      this.imagePicker.member = member
      this.imagePicker.desc = desc
    },
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

<style scoped>

.simsim{
  position: fixed;
  top: 0px;
  right: 0px;
}
.simsim-edit {
  position: fixed;
  top: 0px;
  right: 414px;
  overflow: scroll;

  width: 500px;
  height: calc(100% - 6px);
  background-color: white;
  margin-top: 3px;
}
.simsim-list{
  position: fixed;
  top: 0px;
  right: 500px + 414px;
  overflow: scroll;

  width: 500px;
  height: calc(100% - 6px);
  background-color: white;
  margin-top: 3px;
}

.image-picker{
  width: calc(100% - 414px - 3px);
  height: calc(100% - 6px);
  background-color: white;
  position: fixed;
  top: 3px;
  left: 3px;
}

.window{
  width: 100%;
  height: calc(100%);
}
.border-top {
  z-index: 1000;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 3px;
  background-color: #676767;
  transform: translateZ(0.011px);
}
.border-left {
  z-index: 1000;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 3px;
  height: 100%;
  background-color: #676767;
  transform: translateZ(0.011px);
}
.border-bottom {
  z-index: 1000;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 3px;
  background-color: #676767;
  transform: translateZ(0.011px);
}
</style>
