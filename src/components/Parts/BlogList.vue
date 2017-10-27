<template>
<ul>
  <li class="options" :key="blog['.key']" v-for="blog in store.blogs" @click="() => { $emit('go', blog) }">
    {{ blog.header.title }}
    <br />
    {{ getFormatedDate(blog.header.publishDate) }}
  </li>
</ul>
</template>

<script>
export default {
  props: {
    store: {}
  },
  methods: {
    getFormatedDate (date) {
      date = new Date(Date.parse(date))
      var mm = date.getMonth() + 1 // getMonth() is zero-based
      var dd = date.getDate()

      return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
      ].join('-')
    }
  }
}
</script>

<style scoped>
.options{
  cursor: pointer;
}
.options:hover{
  text-decoration: underline;
}
</style>
