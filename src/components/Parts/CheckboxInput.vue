<template>
<div>
  <div class="checkbox">
    <h3 class="title">{{ title }}</h3>
    <div class="on" v-if="value" @click="() => { this.$emit('input', !value) }">✔ {{ on }}</div>
    <div class="off" v-if="!value" @click="() => { this.$emit('input', !value) }"> {{ off }}</div>
    <input :value="value" type="checkbox" class="cb" @change="onChange" />
  </div>
</div>
</template>

<script>
export default {
  props: {
    title: {},
    value: {},
    on: {},
    off: {}
  },
  methods: {
    onChange (evt) {
      this.$emit('input', evt.target.value)
    }
  }
}
</script>

<style scoped>
.checkbox{
  margin-bottom: 6px;
}
.title {
  font-size: 12px;
  margin: 0px;
  padding: 0px;
  margin-bottom: 6px;
}
.cb{
  display: none;
}
.on,
.off{
  cursor: pointer;
  max-width: 150px;
  min-width: 50px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-weight: bold;
  border-radius: 6px;
}
.on{
  background-color: lawngreen;
  color: white;
}
.off{
  background-color: darkblue;
  color: white;
}
</style>
