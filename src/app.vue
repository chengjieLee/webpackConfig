<template>
  <div class="init">
    {{initApp}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      initApp: 'Hello world'
    }
  }
}
</script>

<style lang="less" scope>
.init {
  color: aqua;
}
</style>