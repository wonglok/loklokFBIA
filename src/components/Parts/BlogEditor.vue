<template>
<div class="editor" ref="editor">

  <div class="header">
    <div class="left" @click="() => { $emit('back', false) }">Back</div>
    <div class="title">{{ blog.header.title }}</div>
    <div class="right" @click="saveAgain()">Save</div>
  </div>

  <div class="tool-box">

    <TextInput :title="'Kicker'" v-model="blog.header.kicker" @input="() => { $emit('save', blog) }" />
    <TextInput :title="'Title'" v-model="blog.header.title" @input="() => { $emit('save', blog) }" />
    <TextInput :title="'Subtitle'" v-model="blog.header.subtitle" @input="() => { $emit('save', blog) }" />
    <TextInput :title="'Description'" v-model="blog.description" @input="() => { $emit('save', blog) }" />
    <TextInput :title="'Author Name'" v-model="blog.header.authorName" @input="() => { $emit('save', blog) }" />
    <TextInput :title="'Author Page'" v-model="blog.header.authorPage" @input="() => { $emit('save', blog) }" />

    <TextInput :title="'Hero Caption'" v-model="blog.header.heroCaption" @input="() => { $emit('save', blog) }" />
    <Thumbnail :title="'Hero Image'" @pick="$emit('pick-image', { blog: blog, object: blog.header, member: 'heroImage', desc: 'Please Select Hero Image' })" :src="blog.header.heroImage" />

    <CheckboxInput title="Status" on="Published" off="Draft" v-model="blog.readyToPublish" @input="(v) => { blog.readyToPublish = v; $emit('save', blog) }" />

    <ButtonInput title="Remove" @click="removeThisBlog(blog)" mode="red">Delete Article</ButtonInput>

    <div class="body-contol-section">

      <div class="tool-bar">
        <button @click="adder(0, 0, 'typeIsParagraph')">+Paragraph</button>
        <button @click="adder(0, 0, 'typeIsFigureImage')">+Image</button>
        <button @click="adder(0, 0, 'typeIsPoster')">+Poster</button>
        <button @click="adder(0, 0, 'typeIsSlideShow')">+SlideShow</button>
        <button @click="adder(0, 0, 'typeIsEmbedYoutube')">+Youtube</button>
      </div>

      <div :ref="'body-item-' + index" :key="index" v-for="(item, index) in blog.body">

        <div class="body-section">
          <div class="controls">
            <div class="youtube" v-if="item['typeIsEmbedYoutube'] === true">
              <iframe class="youtube-player" :src="item.youtube" />
              <!-- <br /> -->
              <TextInput :title="'Youtube Embed Link'" v-model="item.youtube" @input="() => { $emit('save', blog) }" />
              <!-- <input type="text" v-model="item.youtube" @input="() => { $emit('save', blog) }" /> -->
            </div>
            <div class="image" v-if="item['typeIsFigureImage'] === true">
              <Thumbnail :title="'Image'" @pick="$emit('pick-image', { blog: blog, object: item, member: 'image', desc: 'Please Select Image' })" :src="item.image" />
              <TextInput :title="'Caption'" v-model="item.caption" @input="() => { $emit('save', blog) }" />
              <!-- <img class="typeIsFigureImage" :src="item.image" /> -->
              <!-- <input type="text" v-model="item.caption" @input="() => { $emit('save', blog) }" /> -->
            </div>

            <div class="paragraph" v-if="item['typeIsParagraph'] === true">
              <TextInput :ref="'p-' + index" mode="textarea" v-model="item.text" @input="() => { $emit('save', blog) }" @onEnter="(event) => { onEnter(item, index, blog, event) }" />
              <!-- <textarea :ref="'p-' + index" cols="50" rows="10" v-model="item.text" @change="() => { $emit('save', blog) }" @keyup.prevent.enter="(event) => { onEnter(item, index, blog, event) }" /> -->
            </div>

            <div class="poster" v-if="item['typeIsPoster'] === true">
              <Thumbnail :title="'Poster Image'" @pick="$emit('pick-image', { blog: blog, object: item, member: 'image', desc: 'Please Select Poster\'s Image' })" :src="item.image" />
              <TextInput :title="'Top'" v-model="item.toptitle" @input="() => { $emit('save', blog) }" />
              <TextInput :title="'Bottom'" v-model="item.subtitle" @input="() => { $emit('save', blog) }" />
              <TextInput :title="'Credit'" v-model="item.credit" @input="() => { $emit('save', blog) }" />
              <!--
              <input type="text" v-model="item.toptitle" @input="() => { $emit('save', blog) }" />
              <input type="text" v-model="item.subtitle" @input="() => { $emit('save', blog) }" />
              <input type="text" v-model="item.credit" @input="() => { $emit('save', blog) }" /> -->
            </div>

            <div class="slide-show" v-if="item['typeIsSlideShow'] === true">
              <div class="slide-show-flex">
                <Thumbnail
                  :style="{
                    display: 'inline-block',
                    width: '100px',
                    margin: '10px'
                  }"
                  :key="index" v-for="(img, index) in item.images"
                  :title="'Slide ' + (index + 1)"
                  @pick="$emit('pick-image', { blog: blog, object: img, member: 'image', desc: 'Please Select Slideshow Image' })"
                  :src="img.image"
                />
              </div>

              <TextInput :title="'Caption'" v-model="item.caption.text" @input="() => { $emit('save', blog) }" />
              <TextInput :title="'Credit'" v-model="item.caption.attribution" @input="() => { $emit('save', blog) }" />
              <!-- <input type="text" v-model="item.caption.text" @input="() => { $emit('save', blog) }" />
              <input type="text" v-model="item.caption.attribution" @input="() => { $emit('save', blog) }" /> -->
              <!-- <img class="typeIsSlideShow" :src="img.image" :key="index" v-for="(img, index) in item.images" /> -->
            </div>
          </div>

          <div class="actions">
            <ButtonInput title="" @click="() => { removeThisItem(item, index, blog.body) }" mode="grey">X</ButtonInput>
          </div>
        </div>


        <div class="tool-bar">
          <button @click="adder(index, 1, 'typeIsParagraph')">+Paragraph</button>
          <button @click="adder(index, 1, 'typeIsFigureImage')">+Image</button>
          <button @click="adder(index, 1, 'typeIsPoster')">+Poster</button>
          <button @click="adder(index, 1, 'typeIsSlideShow')">+SlideShow</button>
          <button @click="adder(index, 1, 'typeIsEmbedYoutube')">+Youtube</button>
        </div>


      </div>

    </div>

    <!-- <pre>{{ blog }}</pre> -->
  </div>

</div>
</template>

<script>
import { templates } from '@/system/blog'
import TextInput from '@/components/Parts/TextInput'
import Thumbnail from '@/components/Parts/Thumbnail'
import CheckboxInput from '@/components/Parts/CheckboxInput'
import ButtonInput from '@/components/Parts/ButtonInput'
// import VueMediumEditor from 'vue2-medium-editor'

export default {
  components: {
    TextInput,
    Thumbnail,
    CheckboxInput,
    ButtonInput
    // VueMediumEditor
  },
  props: {
    focusItem: {},
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
  watch: {
    focusItem () {
      var redo = () => {
        try {
          var el = this.$refs['body-item-' + this.focusItem][0]
          el.style.outline = 'red solid 3px'
          setTimeout(() => {
            el.style.transition = 'outline-color 1s'
            el.style.outline = 'white solid 3px'
          }, 1000)
          var editor = this.$refs['editor']
          var scrollTop = editor.scrollTop
          var top = el.getBoundingClientRect().top
          editor.scrollTo(0, scrollTop + top)
          console.log(this.focusItem, scrollTop + top)
        } catch (e) {
          console.log(e)
          setTimeout(redo, 300)
        }
      }
      if (this.focusItem !== false) {
        setTimeout(redo, 300)
      }
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
        this.blog.body.splice(index + dynamic || 0, 0, templates.getParagraph({ words: 'text' }))
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
      if (window.confirm('Delete?')) {
        if (array.length >= 2) {
          array.splice(index, 1)
          this.$emit('save', this.blog)
        }
      }
    },
    onEnter (item, index, blog, event) {
      var arr = item.text.split('\n')
      var nextText = arr.pop()
      item.text = arr.join('\n')
      event.preventDefault()
      event.target.blur()

      this.blog.body.splice(index + 1, 0, templates.getParagraph({ words: nextText || 'text' }))
      this.$emit('save', this.blog)

      this.$nextTick(() => {
        var redo = () => {
          try {
            this.$refs['p-' + (index + 1)][0].ta.focus()
            this.$refs['p-' + (index + 1)][0].ta.select()
          } catch (e) {
            console.log(e)
            setTimeout(redo, 300)
          }
        }
        setTimeout(redo, 300)
      })
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
// @import '../../../node_modules/medium-editor/dist/css/medium-editor.css';
// @import '../../../node_modules/medium-editor/dist/css/themes/default.css';

.editor {
  overflow-x: hidden;
  border-left: #676767 solid 3px;
  box-sizing: border-box;
  // border: black solid 3px;
  // box-sizing: border-box;
}
// .typeIsFigureImage{
//   width: 100px;
//   height: 100px;
// }
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

.header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: #676767 solid 3px;
  height: 50px;
  .left{
    text-decoration: underline;
    margin-left: 20px;
    cursor: pointer;
  }
  .title{
    font-weight: bold;
  }
  .right{
    text-decoration: underline;
    margin-right: 20px;
    cursor: pointer;
  }
}

.tool-box{
  margin: 10px 20px;
}

.body-section{
  margin-top: 30px;
}

// .tool-bar:after {
//   content: '+';
//   display: block;
//   position: absolute;
//   font-size: 30px;
//   top: calc(50% - 20px);
//   left: calc(50% - 15px);
//   transition: opacity 0.75s, transform 0.75s;
// }
.tool-bar{
  position: relative;
  border-top: #676767 solid 3px;
  border-bottom: #676767 solid 3px;
  // border-top: #676767 solid 3px;
  // border-bottom: #676767 solid 3px;

  // border: black solid 3px;
  height: 55px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: border 0.75s;
  // &:hover{
  //   border: silver dashed 3px;
  //   // border-bottom: silver solid 3px;
  // }
  // &:hover:after{
  //   opacity: 0;
  //   transform: translateY(-30px) rotate(180deg);
  // }
  button{
    border: red solid 0px;
    background-color: transparent;
    display:inline-block;
    cursor:pointer;
    color:black;
    font-weight:bold;
    padding:6px 12px;
    font-size: 12px;
    text-decoration:none;
    transition: transform 0.75s, opacity 0.75s;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  // button:nth-child(2n + 1) {
  //   opacity: 0;
  //   transform: translateY(-5px);
  // }
  // button:nth-child(2n) {
  //   opacity: 0;
  //   transform: translateY(5px);
  // }
  // &:hover button:nth-child(2n + 1) {
  //   opacity: 1;
  //   transform: translateY(0px);
  // }
  // &:hover button:nth-child(2n) {
  //   opacity: 1;
  //   transform: translateY(-0px);
  // }
  button:hover{
    text-decoration: underline;
  }
  margin-bottom: 35px;
  margin-top: 35px;
}


.body-section{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.youtube-player{
  width: 350px;
  height: 200px;
  border: black solid 0px;
}

.slide-show-flex{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

</style>
