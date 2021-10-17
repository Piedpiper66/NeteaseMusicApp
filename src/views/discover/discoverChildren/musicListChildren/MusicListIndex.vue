<template>
   <div class="musicListIndex">
      <!-- 精选歌单入口展示 -->
      <div class="highqualityEntry"
           ref="qtBg">
         <!-- <img :src="theFirstOfHighquality.coverImgUrl"
              alt=""
              class="backgroundImg" /> -->
         <div class="cover">
            <img :src="theFirstOfHighquality.coverImgUrl"
                 alt="" />
         </div>
         <div class="EntryInfo">
            <div class="tag"><i class="iconfont icon-good"></i> 精品歌单</div>
            <div class="name">{{ theFirstOfHighquality.name }}</div>
            <div class="desc">{{ theFirstOfHighquality.copywriter }}</div>
         </div>
      </div>
      <!-- 歌单列表 -->
      <div class="musicListNavBar">
         <div class="left">
            <sort-box :currentTag="currentTag"
                      :sortList="sortList"
                      @getSortList="getSortList"
                      @clickSortBoxItem="clickSortBoxItem"></sort-box>
         </div>
         <div class="right">
            <second-nav-bar :SecondNavBarData="hotTags"
                            :itemWidth="0"
                            :currentTag="currentTag"
                            @clickSecondBarItem="clickSecondBarItem"></second-nav-bar>
         </div>
      </div>
      <!-- 展示歌单列表 -->
      <list-card :listCardData="musicList.playlists"
                 @clickListCardItem="clickListCardItem"
                 :transition="true"
                 position="right-bottom"></list-card>
      <!-- 分页 -->
      <div class="page"
           v-if="musicList.playlists">
         <el-pagination background
                        layout="prev, pager, next"
                        :total="musicList.total"
                        :page-size="50"
                        small
                        :current-page="currentPage"
                        @current-change="pageChange">
         </el-pagination>
      </div>
   </div>
</template>

<script>
import SecondNavBar from "components/secondNavBar/SecondNavBar.vue";
import ListCard from "components/listCard/ListCard.vue";
import SortBox from "components/sortBox/SortBox.vue";
export default {
   components: {
      SecondNavBar,
      ListCard,
      SortBox,
   },
   name: "musicListIndex",
   data() {
      return {
         theFirstOfHighquality: {},
         hotTags: [],
         musicList: {},
         currentTag: {},
         currentPage: 1,
         // 分类数据
         sortList: [],
      };
   },
   methods: {
      // 处理请求事件
      // 获取高质量歌单的第一条数据
      async getTheFirstOfHighquality() {
         let result = await this.$request("/top/playlist/highquality", {
            limit: 1,
            timestamp: Date.now()
         });
         this.theFirstOfHighquality = result.data.playlists[0];
         // console.log( document.styleSheets );
         document.styleSheets.length && document.styleSheets[1].removeRule(0);
         document.styleSheets[1].addRule(
               ".highqualityEntry::before",
               `
                  background: url(${this.theFirstOfHighquality.coverImgUrl}) no-repeat;
               `,
               0
            );
      },
      // 获取热门歌单tag数据
      async getHotTag() {
         let result = await this.$request("/playlist/hot");
         // console.log(result);
         this.currentTag = result.data.tags[0];
         this.hotTags = result.data.tags;
      },
      // 根据歌名请求歌单列表
      async getMusicList() {
         this.musicList = {};
         let result = await this.$request("/top/playlist", {
            cat: this.currentTag.name,
            offset: 50 * (this.currentPage - 1),
         });
         // console.log(result);
         // 里面的total可以用于分页，所以把整个对象都保存下来
         this.musicList = result.data;
      },

      // 获取歌单分类数据
      async getSortList() {
         let res = await this.$request("/playlist/catlist");
         // console.log(res);
         this.sortList = res.data.sub;
         console.log(this.sortList);
      },

      // 处理点击事件
      // 接收点击二级navbar的回调
      clickSecondBarItem(index) {
         // console.log(this.hotTags[index].name);
         this.currentTag = this.hotTags[index];
         this.currentPage = 1;
         // 先清空musicList
         this.getMusicList();
      },
      //当页数发生改变时
      pageChange(page) {
         // page是当前页数
         // console.log(e);
         this.currentPage = page;
         this.getMusicList();
      },
      // 点击歌单的回调
      clickListCardItem(id) {
         console.log(id);
         this.$router.push({ name: "musicListDetail", params: { id } });
      },
      // 点击sortBoxItem中的回调
      clickSortBoxItem(item) {
         this.currentTag = item;
         this.currentPage = 1;
         this.getMusicList();
      },
   },
   // created生命周期
   async created() {
      this.getTheFirstOfHighquality();
      await this.getHotTag();
      this.getMusicList();
   },
};
</script>

<style scoped>
.highqualityEntry {
   position: relative;
   width: 100%;
   height: 170px;
   border-radius: 6px;
   overflow: hidden;
   display: flex;
   background-color: rgba(0, 0, 0, 0.3);
   align-items: center;
}

.highqualityEntry::before {
   content: "";
   position: absolute;
   background-position: center;
   background-size: cover;
   background-attachment: fixed;
   top: 0;
   right: 0;
   bottom: 0;
   left: 0;
   filter: blur(40px);
   margin: -30px;
   z-index: -2;
}

.cover {
   width: 145px;
   height: 145px;
   margin: 0 15px;
}

.cover img {
   border-radius: 6px;
   width: 100%;
   height: 100%;
}

.EntryInfo {
   display: flex;
   flex-direction: column;
}

.tag {
   color: #e7aa5a;
   border: 1px solid #d59e54;
   padding: 5px 10px;
   width: max-content;
   font-size: 14px;
   border-radius: 15px;
   margin-bottom: 13px;
}

.tag i {
   font-size: 14px;
}

.name {
   color: white;
   font-size: 16px;
   margin: 10px 0;
}

.desc {
   color: rgba(255, 255, 255, 0.5);
   font-size: 12px;
}

.musicListNavBar {
   /* padding: 10px 0; */
   display: flex;
   justify-content: space-between;
   font-size: 12px;
   margin: 20px 0;
}

.page {
   width: 100%;
   text-align: center;
   padding-bottom: 20px;
}
</style>