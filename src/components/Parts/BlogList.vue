<template>
<ul>
  <li :key="blog['.key']" v-for="blog in store.blogs">
    {{ blog.header.title }}
    {{ blog.header.publishDate }}
    <button @click="() => { $emit('edit', blog) }">Edit</button>
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
