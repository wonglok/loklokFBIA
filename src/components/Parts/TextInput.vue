<template>

<div class="text-input">
  <h3>{{ title }}</h3>
  <input v-if="mode === 'oneliner'" class="input-element" type="text" :value="value" @input="onInput" />
  <textarea v-if="mode === 'textarea'" ref="ta" cols="50" rows="10" class="textarea-element" type="text" :value="value" @input="onInput" @keyup.prevent.enter="(v) => { $emit('onEnter', v) }" />
</div>

</template>

<script>
export default {
  props: {
    value: {},
    mode: {
      default: 'oneliner'
    },
    title: {}
  },
  methods: {
    onInput (evt) {
      this.$emit('input', evt.target.value)
    }
  },
  mounted () {
    this.ta = this.$refs['ta']
  }
}
</script>

<style lang="scss" scoped>
.text-input{
  h3 {
    font-size: 12px;
    margin: 0px;
    padding: 0px;
  }
  .textarea-element:focus,
  .input-element:focus{
    outline: none;
  }
  .input-element{
    width: 380px;

    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    border: 0px solid white;
    box-shadow: inset 0 0 1px  rgba(0,0,0,0);
    padding: 5px;
    font-size: 20px;
    background: rgba(255,255,255,0.0);
    border-bottom: #767676 solid 3px;
    margin: 0 0 10px 0;
  }
  .textarea-element{
    width: 380px;

    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    border: 0px solid white;
    box-shadow: inset 0 0 1px  rgba(0,0,0,0);
    padding: 5px;
    font-size: 20px;
    background: rgba(255,255,255,0.0);
    border: #767676 solid 3px;
    margin: 0 0 10px 0;
  }
}
</style>
