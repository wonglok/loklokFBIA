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
      <div class="youtube" v-if="item['typeIsEmbedYoutube'] === true">
        <input type="text" v-model="item.youtube" @input="() => { $emit('save', blog) }" />
        <iframe :src="item.youtube" />
      </div>
      <div class="image" v-if="item['typeIsFigureImage'] === true">
        <img class="figureImage" :src="item.image" />
        <input type="text" v-model="item.caption" @input="() => { $emit('save', blog) }" />
      </div>
      <div class="paragraph" v-if="item['typeIsParagraph'] === true">
        <!-- <textarea v-model="item.text" /> -->
        <VueMediumEditor :text="item.text" :options="{ toolbar: { buttons: ['bold', 'italic', 'underline'] } }" v-on:edit="(operation) => { onEdit(operation, item) }" custom-tag="p">
        </VueMediumEditor>
      </div>

      <div class="poster" v-if="item['typeIsPoster'] === true">
        <img :src="item.image" />
        <input type="text" v-model="item.toptitle" @input="() => { $emit('save', blog) }" />
        <input type="text" v-model="item.subtitle" @input="() => { $emit('save', blog) }" />
        <input type="text" v-model="item.credit" @input="() => { $emit('save', blog) }" />
      </div>

      <div class="slide-show" v-if="item['typeIsSlideShow'] === true">
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
import VueMediumEditor from 'vue2-medium-editor'

export default {
  components: {
    VueMediumEditor
  },
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
    onEdit (operation, item) {
      if (!operation.api.setBlur) {
        operation.api.setBlur = true
        operation.event.srcElement.addEventListener('blur', () => {
          item.text = operation.event.srcElement.innerHTML
          this.$emit('save', this.blog)
        })
      }
      // item.text = operation.event.srcElement.innerHTML
      clearTimeout(operation.api.timer)
      operation.api.timer = setTimeout(() => {
        if (item.text !== operation.event.srcElement.innerHTML) {
          item.text = operation.event.srcElement.innerHTML
          this.$emit('save', this.blog)
        }
      }, 10 * 1000)
    },
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

<style lang="scss" scoped>
@import '../../../node_modules/medium-editor/dist/css/medium-editor.css';
@import '../../../node_modules/medium-editor/dist/css/themes/default.css';

.editor {
  border: black solid 1px;
}
.figureImage{
  width: 100px;
  height: 100px;
}
</style>
