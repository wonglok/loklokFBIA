<template>
<div class="blog-sim">

  <div class="hero-image" :style="{ backgroundImage: 'url(' + blog.header.heroImage + ')' }" @click="$emit('pick-image', { blog: blog, object: blog.header, member: 'heroImage', desc: 'Please Select Hero Image' })">
  </div>

  <div class="brand-like">
    <div class="brand">{{ blog.header.authorName }}</div>
    <div class="like"></div>
  </div>

  <div class="hr"></div>

  <div class="column">
    <div class="kicker">
      {{ blog.header.kicker }}
    </div>

    <div class="title">
      {{ blog.header.title }}
    </div>
    <div class="subtitle">
      {{ blog.header.subtitle }}
    </div>

    <div class="authorName">
      {{ blog.header.authorName }}
    </div>

    <div class="publishDate">
      {{ getDate(blog.header.publishDate) }}
    </div>
  </div>

  <div @click="() => { $emit('focus-item', false); $nextTick(() => { $emit('focus-item', index) }) }" class="body-items" :key="index" v-for="(item, index) in blog.body">
    <!-- youtube -->
    <div class="sub-item youtube" v-if="item['typeIsEmbedYoutube'] === true">
      <iframe class="youtube-player" :src="item.youtube" />
    </div>

    <!-- image -->
    <div class="image-block" v-if="item['typeIsFigureImage'] === true">
      <img class="image-item" :src="item.image" @click="$emit('pick-image', { blog: blog, object: item, member: 'image', desc: 'Please Select Image' })" />
      <p>{{ item.caption }}</p>
    </div>

    <!-- paragraph -->
    <div class="sub-item paragraph" v-if="item['typeIsParagraph'] === true">
      <p>{{ item.text }}</p>
    </div>

    <!-- poster -->
    <div @click="$emit('pick-image', { blog: blog, object: item, member: 'image', desc: 'Please Select Image' })" class="poster" v-if="item['typeIsPoster'] === true" :style="{ backgroundImage: 'url('+ item.image +')' }">
      <div class="top-title">{{ item.toptitle }}</div>
      <div class="bottom-title">{{ item.subtitle }}</div>
    </div>
    <div class="poster-credit" v-if="item['typeIsPoster'] === true">
      {{ item.credit }}
    </div>

    <!-- slideshow -->
    <SlideShow :item="item" @click="({ item }) => { $emit('pick-image', { blog: blog, object: item, member: 'image', desc: 'Please Select Image' }) }" />

  </div>

</div>
</template>

<script>
import SlideShow from './SlideShow.vue'

export default {
  components: {
    SlideShow
  },
  props: {
    blog: {}
  },
  computed: {
    canDelete () {
      return this.blog.body.length >= 2
    }
  },
  methods: {
    getDate (str) {
      var theDate = new Date(Date.parse(str))
      var mm = theDate.getMonth() + 1 // getMonth() is zero-based
      var dd = theDate.getDate()

      return [ theDate.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
      ].join('-')
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-sim{
  background-color: white;
  border: #676767 solid 3px;
  box-sizing: border-box;
  width: 414px;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.hero-image{
  width: 100%;
  height: 285px;
  background-color: silver;
  background-position: center center;
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;
  // cursor: pointer;

  h3 {
    text-decoration: underline;
  }
}
.brand-like{
  height: 125px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .brand{
    margin-left: 30px;
    width: 230px;
    height: 62px;
    background-color: silver;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .like{
    margin-right: 30px;
    width: 62px;
    height: 62px;
    background-color: silver;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.hr{
  width: 350px;
  height: 1px;
  background-color: black;
  margin-left: 30px;
  margin-bottom: 20px;
}

.column{
  width: 100%;
}

$gutter: 30px;

.kicker{
  margin-left: $gutter;
  margin-right: $gutter;
  font-size: 15px;
  margin-bottom: 10px;
}

.title{
  margin-left: $gutter;
  margin-right: $gutter;

  font-weight: bold;
  font-size: 38px;
}

.subtitle{
  margin-left: $gutter;
  margin-right: $gutter;

  font-weight: bold;
  font-size: 24px;
}

.authorName{
  margin-left: $gutter;
  margin-right: $gutter;

  margin-top: 20px;
  font-size: 12px;
}

.publishDate{
  margin-left: $gutter;
  margin-right: $gutter;

  font-size: 12px;
  margin-bottom: 25px;
}

.sub-item{
  margin-left: $gutter;
  margin-right: $gutter;
}

.poster{
  width: 414px - 6px;
  height: 736px;
  position: relative;
  background-size: cover;
  background-position: center center;
}
.top-title{
  background-color: rgba(255,255,255,0.5);
  position: absolute;
  top: 10px;
  width: 100%;
  font-size: 30px;
  text-align: center;
}
.bottom-title{
  background-color: rgba(255,255,255,0.5);

  position: absolute;
  bottom: 10px;
  width: 100%;
  font-size: 30px;
  text-align: center;
}
.poster-credit{
  text-align: center;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 50px;
}
.poster-bg{
  width: 100%;
}

.image-block{
  width: 100%;
  min-height: 414px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}
.image-item{
  width: 100%;
}

.youtube-player{
  border: white solid 0px;
  width: 350px;
  height: 240px;
}

// * {
//   outline: rgba(255,0,0,0.2) solid 1px;
// }

</style>
