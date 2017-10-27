<template>
<div class="image-picker">
  <div class="header">
    <div class="left"></div>
    <div class="title">{{ desc }}</div>
    <div class="right" @click="() => { $emit('close') }">Done</div>
  </div>
  <div class="container">

    <input type="file" multiple accept="image/*" ref="file-button" value="Choose your Photos">
    <span v-if="loading > 0">Loading Remain: {{ loading }}</span>
    <br />

    <button v-if="canOlder" @click="older()">Older</button>
    <button v-if="canNewer" @click="newer()">Newer</button>

    <br />
    AutoClose: <input type="checkbox" v-model="autoclose">

    <br />

    <div :key="imgKey" v-for="(img, imgKey) in store.images" >
      <img class="image-preview" :src="img.url" @click="() => { updateImage({ img }); if (autoclose) { $emit('close'); } }" />
      <button @click="() => { removeImage({ img }) }">X</button>
    </div>

    <!-- <pre>{{ store.images }}</pre>

    <pre>{{ blog }}</pre>
    <pre>{{ object }}</pre>
    <pre>{{ member }}</pre>
    <pre>{{ desc }}</pre> -->

  </div>
</div>
</template>

<script>
import { makeImage, removeImage, getRTImage, getOlderRTImage, getNewerRTImage, canGetOlderImage, canGetNewerImage, store } from '@/system/blog.js'

export default {
  props: {
    blog: {},
    object: {},
    member: {},
    desc: {}
  },
  created () {
    getRTImage()
  },
  data () {
    return {
      autoclose: true,
      store,
      loading: 0
    }
  },
  mounted () {
    this.$refs['file-button'].addEventListener('change', (e) => {
      // Get files
      for (var i = 0; i < e.target.files.length; i++) {
        this.loading++

        var imageFile = e.target.files[i]
        makeImage({ file: imageFile }).then((newObj) => {
          console.log(newObj)
          this.loading--
        })
      }
    })
  },
  computed: {
    canOlder () {
      return canGetOlderImage()
    },
    canNewer () {
      return canGetNewerImage()
    }
  },
  methods: {
    updateImage ({ img }) {
      if (this.object && this.member) {
        this.object[this.member] = img.url
        this.$emit('save', this.blog)
      }
    },
    newer () {
      getNewerRTImage()
    },
    older () {
      getOlderRTImage()
    },
    removeImage ({ img }) {
      removeImage({ imgObj: img })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  margin: 10px;
}
.image-picker{
  overflow: auto;
}

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

.image-preview{
  max-height: 200px;
  max-width: 200px;
  display: inline-block;
}


</style>
