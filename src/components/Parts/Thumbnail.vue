<template>
<div class="thumbnail">
  <h3 class="title">{{ title }}</h3>
  <img class="image" :src="src" @click="() => { $emit('pick') }" />
</div>
</template>

<script>
export default {
  props: {
    title: {},
    src: {}
  },
  methods: {

  }
}
</script>

<style scoped>
.title{
  font-size: 12px;
  margin: 0px;
  margin-bottom: 5px;
  padding: 0px;
}
.image{
  cursor: pointer;
  width: 100px;
  height: 100px;
}
.thumbnail{
  width: 380px;
}
</style>
