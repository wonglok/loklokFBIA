<template>
<div class="editor">
  Published: <input type="checkbox" @change="() => { $emit('save', blog) }" v-model="blog.readyToPublish" />
  <br />

  Title: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.header.title" />
  <br />

  Subtitle: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.header.subtitle" />
  <br />

  Description: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.description" />
  <br />

  kicker: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.header.kicker" />
  <br />

  AuthorName: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.header.authorName" />
  <br />

  AuthorPage: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.header.authorPage" />
  <br />

  heroImage: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.header.heroImage" />
  <br />

  Hero Caption: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.header.heroCaption" />
  <br />

  heroImage: <input type="text" @input="() => { $emit('save', blog) }" v-model="blog.header.heroImage" />
  <br />

  remove: <button @click="removeThisBlog(blog)">Remove This Blog</button>
  <br />

  <div>

    <div :key="index" v-for="(item, index) in blog.body">
      <div v-if="item['typeIsEmbedYoutube'] === true">
        <input type="text" v-model="item.youtube" @input="() => { $emit('save', blog) }" />
        <iframe :src="item.youtube" />
      </div>
      <div v-if="item['typeIsFigureImage'] === true">
        <img class="figureImage" :src="item.image" />
        <input type="text" v-model="item.caption" @input="() => { $emit('save', blog) }" />
      </div>
      <div v-if="item['typeIsParagraph'] === true">
        <textarea v-model="item.text" />
      </div>

      <div v-if="item['typeIsPoster'] === true">
        <img :src="item.image" />
        <input type="text" v-model="item.toptitle" @input="() => { $emit('save', blog) }" />
        <input type="text" v-model="item.subtitle" @input="() => { $emit('save', blog) }" />
        <input type="text" v-model="item.credit" @input="() => { $emit('save', blog) }" />
      </div>

      <div v-if="item['typeIsSlideShow'] === true">
        <input type="text" v-model="item.caption.text" @input="() => { $emit('save', blog) }" />
        <input type="text" v-model="item.caption.attribution" @input="() => { $emit('save', blog) }" />
        <img :src="img.image" :key="index" v-for="(img, index) in item.images" />
      </div>

    </div>

  </div>

  <pre>{{ blog }}</pre>
</div>
</template>

<script>
import { templates } from '@/system/blog'

export default {
  props: {
    blog: {}
  },
  data () {
    return {
      addType: 'typeIsEmbedYoutube',
      otherTypes: [
        'typeIsEmbedYoutube',
        'typeIsFigureImage',
        'typeIsParagraph',
        'typeIsPoster',
        'typeIsSlideShow'
      ]
    }
  },
  methods: {
    addYoutube (videoID) {
      templates.addYoutube({ videoID })
    },
    removeThisBlog (blog) {
      if (window.confirm('Delete?')) {
        this.$emit('remove', blog)
      }
    }
  }
}
</script>

<style scoped>
.editor {
  border: black solid 1px;
}
.figureImage{
  width: 100px;
  height: 100px;
}
</style>
