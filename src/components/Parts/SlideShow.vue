<template>
<div>

  <div class="slide-show" v-if="item['typeIsSlideShow'] === true">
    <div class="slide-show-con" :style="transStyle()">
      <div
      @click="$emit('click', { item: img })"
      class="slide-page" :style="{
        left: (index * width) + 'px',
        backgroundImage: 'url(' + img.image + ')'
      }" :key="index" v-for="(img, index) in item.images"></div>
    </div>
    <button class="btn-next" @click="bnext()">+</button>
    <button class="btn-prev" @click="bprev()">-</button>
  </div>
  <div class="sub-item slide-show-caption" v-if="item['typeIsSlideShow'] === true">
    {{ item.caption.text }}
  <br />
    {{ item.caption.attribution }}
    <!-- <input type="text" v-model="item.caption.text" @input="() => { $emit('save', blog) }" />
    <input type="text" v-model="item.caption.attribution" @input="() => { $emit('save', blog) }" /> -->
  </div>

</div>
</template>

<script>
export default {
  props: {
    item: {}
  },
  data () {
    return {
      width: window.innerWidth > 414 ? 414 - 6 : window.innerWidth - 6,
      index: 0
    }
  },
  computed: {

  },
  methods: {
    transStyle () {
      return {
        transform: `translateX(${parseInt(-408 * this.index, 10)}px)`
      }
    },
    bnext () {
      this.index++
      if (this.index > this.item.images.length - 1) {
        this.index = 0
      }
    },
    bprev () {
      this.index--
      if (this.index < 0) {
        this.index = this.item.images.length - 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.slide-show{
  position: relative;
  overflow: hidden;
  width: 414px - 6px;
  height: 736px;
  .slide-show-con{
    position: relative;
    width: 100%;
    height: 736px;

    transition: transform 1s;
    display: flex;
    justify-content: center;
    align-items: center;

    .slide-page{
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }

  }
  .btn-next{
    top: 50%;
    right: 10px;
    position: absolute;
  }
  .btn-prev{
    top: 50%;
    left: 10px;
    position: absolute;
  }
}
.slide-show-caption{
  text-align: center;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 50px;
}

</style>
