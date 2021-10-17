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
                       position="right-bottom"
                       :index="true"></list-card>
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
         flag: true
      };
   },
   created() {
      if (this.flag) {
         this.getBannerData();
         this.getMusicList();
      }
   },
   methods: {
      // 请求轮播图数据
      async getBannerData() {
         let result = await this.$request("/banner");
         // console.log(result);
         this.bannerData = result.data.banners.filter(
            (banner) => banner.targetType === 1
         );
      },

      // 请求推荐歌单数据的前十个
      getMusicList() {
         this.$request("/top/playlist", { limit: 15 }).then((res) => {
            console.log('hot list:', res);
            this.musicList = res.data.playlists;
         });
      },
      // 点击歌单封面的回调
      clickListCardItem(id) {
         // console.log(id);
         this.$router.push({ name: "musicListDetail", params: { id } });
      },
   },
   watch: {
      "$store.state.isLogin"(current) {
         if (current) {
            // 把推荐歌单的第一个歌单插入, 再把每天个人8个推荐歌单插入
            // this.$request('/recommend/songs').then(res => {
            //    // const songs = res.data.
            //    // this.musicList[0].
            // })
            this.$store.commit('updateRecomment', false);
            this.$request('/recommend/resource').then(res => {
               // console.log('person musiclist:', res.data );
               this.musicList.splice(0, res.data.recommend.length, ...res.data.recommend);
            })
         }
      },
      "$store.state.recommentNeedFresh"(status) {
         if (status === false) {
            this.flag = false;
         }
      }
   }
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