<template>
<div>
  <h3 class="title">{{ title }}</h3>
  <div class="btn" :class="{ 'red': mode === 'red', 'grey': mode === 'grey' }" @click="() => { $emit('click') }">
    <slot name="default"></slot>
  </div>
</div>
</template>

<script>
export default {
  props: {
    title: {},
    mode: {}
  }
}
</script>

<style scoped>
.title {
  font-size: 12px;
  margin: 0px;
  padding: 0px;
  margin-bottom: 6px;
}
.btn{
  cursor: pointer;
  max-width: 150px;
  min-width: 50px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-weight: bold;
  border-radius: 6px;
}
.red {
  background-color: red;
  color: white;
}
.grey {
  border-radius: 0px;
  border: #676767 solid 3px;
  color: black;
  transition: background-color 0.5s, border-color 0.5s, color 0.5s;
}
.grey:hover{
  color: white;
  border-color: white;
  background-color: red;
}
</style>
