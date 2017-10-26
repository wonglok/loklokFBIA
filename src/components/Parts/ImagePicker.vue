<template>
<div class="image-picker">
  <div class="header">
    <div class="left"></div>
    <div class="title">{{ desc }}</div>
    <div class="right" @click="() => { $emit('close') }">Done</div>
  </div>
  <div class="container">
    <pre>{{ blog }}</pre>
    <pre>{{ object }}</pre>
    <pre>{{ member }}</pre>
    <pre>{{ desc }}</pre>
  </div>
</div>
</template>

<script>
export default {
  props: {
    blog: {},
    object: {},
    member: {},
    desc: {}
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


</style>
