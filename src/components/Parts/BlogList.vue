<template>
<ul>
  <li :key="blog['.key']" v-for="blog in store.blogs">
    <button @click="() => { $emit('edit', blog) }">Edit</button>
    {{ blog.header.title }}
    <br />
    {{ blog.header.publishDate }}
  </li>
</ul>
</template>

<script>
export default {
  props: {
    store: {}
  }
}
</script>

<style>

</style>
