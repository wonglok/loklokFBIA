<template>
<div class="editor">
  Published: <input type="checkbox" @change="() => { $emit('save', blog) }" v-model="blog.readyToPublish" />
  <button @click="saveAgain()">Save</button>
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

    <div>
      <button @click="adder(0, 0, 'typeIsParagraph')">Paragraph</button>
      <button @click="adder(0, 0, 'typeIsFigureImage')">Image</button>
      <button @click="adder(0, 0, 'typeIsPoster')">Poster</button>
      <button @click="adder(0, 0, 'typeIsSlideShow')">SlideShow</button>
      <button @click="adder(0, 0, 'typeIsEmbedYoutube')">Youtube</button>
    </div>

    <div :key="index" v-for="(item, index) in blog.body">

      <div class="youtube" v-if="item['typeIsEmbedYoutube'] === true">
        <iframe :src="item.youtube" />
        <br />
        <input type="text" v-model="item.youtube" @input="() => { $emit('save', blog) }" />
      </div>
      <div class="image" v-if="item['typeIsFigureImage'] === true">
        <img class="typeIsFigureImage" :src="item.image" />
        <input type="text" v-model="item.caption" @input="() => { $emit('save', blog) }" />
      </div>
      <div class="paragraph" v-if="item['typeIsParagraph'] === true">
        <textarea :ref="'p-' + index" cols="50" rows="10" v-model="item.text" @change="() => { $emit('save', blog) }" @keyup.prevent.enter="(event) => { onEnter(item, index, blog, event) }" />
        <!-- <VueMediumEditor :text="item.text" :options="{ toolbar: { buttons: ['bold', 'italic', 'underline'] } }" v-on:edit="(operation) => { onEdit(operation, item) }" custom-tag="p">
        </VueMediumEditor> -->
      </div>

      <div class="poster" v-if="item['typeIsPoster'] === true">
        <img class="typeIsPoster" :src="item.image" />
        <input type="text" v-model="item.toptitle" @input="() => { $emit('save', blog) }" />
        <input type="text" v-model="item.subtitle" @input="() => { $emit('save', blog) }" />
        <input type="text" v-model="item.credit" @input="() => { $emit('save', blog) }" />
      </div>

      <div class="slide-show" v-if="item['typeIsSlideShow'] === true">
        <input type="text" v-model="item.caption.text" @input="() => { $emit('save', blog) }" />
        <input type="text" v-model="item.caption.attribution" @input="() => { $emit('save', blog) }" />
        <img class="typeIsSlideShow" :src="img.image" :key="index" v-for="(img, index) in item.images" />
      </div>

      <button v-show="canDelete" @click="() => { removeThisItem(item, index, blog.body) }">Remove</button>

      <div>
        <button @click="adder(index, 1, 'typeIsParagraph')">Paragraph</button>
        <button @click="adder(index, 1, 'typeIsFigureImage')">Image</button>
        <button @click="adder(index, 1, 'typeIsPoster')">Poster</button>
        <button @click="adder(index, 1, 'typeIsSlideShow')">SlideShow</button>
        <button @click="adder(index, 1, 'typeIsEmbedYoutube')">Youtube</button>
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
      otherTypes: [
        'typeIsParagraph',
        'typeIsFigureImage',
        'typeIsPoster',
        'typeIsEmbedYoutube',
        'typeIsSlideShow'
      ]
    }
  },
  computed: {
    canDelete () {
      return this.blog.body.length >= 2
    }
  },
  methods: {
    adder (index, dynamic, type) {
      if (type === 'typeIsParagraph') {
        this.blog.body.splice(index + dynamic || 0, 0, templates.getParagraph({ words: '' }))
      }
      if (type === 'typeIsFigureImage') {
        this.blog.body.splice(index + dynamic || 0, 0, templates.getImage({ image: 'http://via.placeholder.com/1024x1024', caption: 'Caption' }))
      }
      if (type === 'typeIsPoster') {
        this.blog.body.splice(index + dynamic || 0, 0, templates.getPoster({ image: 'http://via.placeholder.com/1024x1024', toptitle: 'Top title', subtitle: 'Sub  title', credit: 'Credit' }))
      }
      if (type === 'typeIsEmbedYoutube') {
        this.blog.body.splice(index + dynamic || 0, 0, templates.getYoutube({ videoID: 'UWF7dZTLW4c' }))
      }
      if (type === 'typeIsSlideShow') {
        this.blog.body.splice(index + dynamic || 0, 0, templates.getSlideShow({
          images: [
            { image: 'http://via.placeholder.com/1024x1024' },
            { image: 'http://via.placeholder.com/1024x1024' },
            { image: 'http://via.placeholder.com/1024x1024' }
          ],
          caption: 'Caption',
          credit: 'Credit'
        }))
      }

      this.$emit('save', this.blog)
    },
    removeThisItem (item, index, array) {
      if (array.length >= 2) {
        array.splice(index, 1)
        this.$emit('save', this.blog)
      }
    },
    onEnter (item, index, blog, event) {
      var arr = item.text.split('\n')
      arr.pop()
      item.text = arr.join('\n')
      event.preventDefault()
      event.target.blur()

      this.blog.body.splice(index + 1, 0, templates.getParagraph({ words: '' }))
      setTimeout(() => {
        this.$refs['p-' + (index + 1)][0].focus()
        this.$emit('save', this.blog)
      }, 300)
    },
    saveAgain () {
      this.$emit('save', this.blog)
      window.alert('Saved')
    },
    onEdit (operation, item) {
      if (!operation.api.setBlur) {
        operation.api.setBlur = true
        operation.event.srcElement.addEventListener('blur', () => {
          setTimeout(() => {
            item.text = operation.event.srcElement.innerHTML
            this.$emit('save', this.blog)
          }, 300)
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
.typeIsFigureImage{
  width: 100px;
  height: 100px;
}
.typeIsPoster{
  width: 100px;
  height: 100px;
}
.typeIsSlideShow{
  width: 100px;
  height: 100px;
}
.typeIsEmbedYoutube{
  width: 100px;
  height: 100px;
}
// 'typeIsParagraph',
// 'typeIsFigureImage',
// 'typeIsPoster',
// 'typeIsEmbedYoutube',
// 'typeIsSlideShow'


</style>
