<template>
  <div id="app">
    年龄: {{ this.$store.state.age }}
    我的年龄: {{ this.$store.getters.myAge }}
    我的年龄: {{ this.$store.getters.myAge }}
    我的年龄: {{ this.$store.getters.myAge }}
    <button @click="$store.state.age+=33">修改年龄</button>
    <button @click="$store.commit('b/addAge', 10)">直接mutation修改</button>
    <button @click="$store.dispatch('addAge', 10)">action修改</button>
    <button @click="$store.state.age+=100">错误的修改</button>

    <!-- {{ $store.state.a }} -->
      {{ $store.state.a }}
      {{ $store.state.b }}
      {{ $store.state.cc }}
      ({{ $store.getters.myA }})
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    changeAge() {

    }
  }
}
</script>

<style>