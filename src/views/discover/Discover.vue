<template>
   <div class="discoverContainer">
      <nav-bar @clickBarItem="clickBarItem"
               :navBarItem="navBarData"></nav-bar>
      <keep-alive>
          <router-view class="discover"></router-view>
      </keep-alive>
   </div>
</template>

<script>
import NavBar from "components/navBar/NavBar";

export default {
   name: "Discover",
   components: {
      NavBar,
   },
   data() {
      return {
         navBarData: [
            { name: "个性推荐", path: "/discover/recommend" },
            { name: "歌单", path: "/discover/musiclist" },
            { name: "排行榜", path: "/discover/ranking" },
            { name: "歌手", path: "/discover/singer" },
         ],
      };
   },
   created() {
      // console.log( 'discover created' );
   },
   methods: {
      // 接收navbar传来的点击事件
      clickBarItem(path) {
         this.$router.push(path);
      },
   },
};
</script>

<style scoped>
.discoverContainer {
   overflow: hidden;
   padding: 0 !important;
}

.discover {
   /* max-width: 1000px; */
   margin: auto;
   overflow-y: scroll;
   height: calc(100vh - 200px);
   padding: 15px;
}
</style>