<template>
   <div id="app">
      <router-view v-if="isAlive" />
   </div>
</template>
<script>
export default {
   provide() {
      return {
         reload: this.reload
      }
   },
   data() {
      return {
         isAlive: true
      }
   },
   methods: {
      reload() {
         this.isAlive = false;
         this.$nextTick(() => {
            this.isAlive = true;
         })
      }
   }
}
</script>
<style>


#app {
   /* font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale; */
   /* text-align: center;
   color: #2c3e50; */
}
</style>
