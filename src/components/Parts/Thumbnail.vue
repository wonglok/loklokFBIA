<template>
<div class="thumbnail">
  <h3 class="title">{{ title }}</h3>
  <div class="image"  @click="() => { $emit('pick') }">
    <img class="" :src="src" />
  </div>
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

<style lang="scss" scoped>
.title{
  font-size: 12px;
  margin: 0px;
  margin-bottom: 5px;
  padding: 0px;
}
.image{
  cursor: pointer;
  background-color: #e0e0e0;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 100px;
    max-height: 100px;
  }
}
.thumbnail{
  width: 380px;
}
</style>
