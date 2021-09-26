<template>
   <div class="recommendContainer">
      <!-- 轮播图 -->
      <div class="recommend">
         <!-- <div class="carousel"> -->
         <carousel :bannerData="bannerData"
                   v-if="bannerData.length > 0"></carousel>
         <!-- </div> -->

         <!-- 推荐歌单 -->
         <div class="recommendMusicList">
            <h3>推荐歌单<i class="iconfont icon-arrow-right-bold"
                  style="color: #4c4c4c"></i></h3>
            <list-card :listCardData="musicList"
                       @clickListCardItem="clickListCardItem"
                       :transition="true"
                       position="right-bottom"></list-card>
         </div>
      </div>
   </div>
</template>

<script>
import Carousel from "./Carousel.vue";
import ListCard from "components/listCard/ListCard.vue";

export default {
   name: "Recommend",
   components: {
      Carousel,
      ListCard,
   },
   data() {
      return {
         // 轮播图数据
         bannerData: [],
         // recommend页面显示的musicList
         musicList: [],
      };
   },
   created() {
      this.getBannerData();
      this.getMusicList();
   },
   methods: {
      // 请求轮播图数据
      async getBannerData() {
         let result = await this.$request("/banner");
         console.log(result);
         this.bannerData = result.data.banners.filter(
            (banner) => banner.targetType === 1
         );
      },

      // 请求推荐歌单数据的前十个
      getMusicList() {
         this.$request("/personalized", { limit: 10 }).then((res) => {
            // console.log(res);
            this.musicList = res.data.result;
         });
      },
      // 点击歌单封面的回调
      clickListCardItem(id) {
         // console.log(id);
         this.$router.push({ name: "musicListDetail", params: { id } });
      },
   },
};
</script>

<style>
.recommendContainer {
   display: flex;
   justify-content: center;
}

.recommend {
   max-width: 1100px;
   width: 100%;
}

.carousel {
   width: 100%;
}

.el-carousel {
   margin: auto;
   width: 800px;
}

.el-carousel__item {
   border-radius: 10px;
}

.el-carousel__item img {
   height: 100%;
}

.recommendMusicList {
   margin: 40px 10px;
}

.recommendMusicList h3 {
   color: #373737;
   font-size: 1.25rem;
   margin: 20px 0;
}
</style>