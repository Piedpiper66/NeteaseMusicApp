<template>
   <div class="album"
        v-if="albumInfo.album">
      <!-- 类名可能不太对应文件，因为html和样式都是直接搬MusicListDetail里面的 -->
      <!-- 专辑跳到歌手页面正在播放的样式不会渲染，这些操作DOM写的有些乱，懒得搞了-->
      <!-- 歌单信息 -->
      <div class="listInfo">
         <!-- 歌单封面 -->
         <div class="listAvatar">
            <img :src="albumInfo.album.picUrl + '?param=300y300'"
                 alt="" />
         </div>
         <div class="right">
            <!-- 标题 -->
            <div class="title">
               <div class="titleTag">专辑</div>
               <div class="titleContent">{{ albumInfo.album.name }}</div>
            </div>
            <!-- 操作按钮 -->
            <div class="buttons">
               <div class="buttonItem playAll"
                    @click="playAll">
                  <i class="iconfont icon-bofang playAll"></i>
                  <span>播放全部</span>
               </div>
               <div class="buttonItem"
                    @click="subAlbum">
                  <i class="iconfont icon-xihuan"
                     :class="isSub ? 'red' : ''"></i>
                  <span>{{ isSub ? "已收藏" : "收藏" }}</span>
               </div>
               <div class="buttonItem">
                  <i class="iconfont icon-zhuanfa"></i>
                  <span>分享</span>
               </div>
            </div>
            <div class="otherInfo">
               <div class="playCount">
                  歌手 :
                  <span @click="
                $router.push({
                  name: 'singerDetail',
                  params: { id: albumInfo.album.artist.id },
                })
              ">{{ albumInfo.album.artist.name }}</span>
               </div>
            </div>
            <div class="otherInfo">
               <div class="playCount">
                  时间 : {{ albumInfo.album.publishTime | showDate }}
               </div>
            </div>
         </div>
      </div>
      <!-- 歌曲列表 -->
      <keep-alive>
         <div class="musicList">
            <el-tabs value="first">
               <el-tab-pane label="歌曲列表"
                            name="first">
                  <!-- 表格 -->
                  <!-- 第三方组件的table在退出后不会销毁，而是继续保留，导致多个table同时存在 ref变得不唯一 
              解决办法：避免使用refs..（拼接也不好使） -->
                  <el-table :data="songs"
                            size="mini"
                            style="width: 100%"
                            @row-dblclick="clickRow"
                            highlight-current-row
                            stripe>
                     <el-table-column label=""
                                      width="30"
                                      type="index"
                                      :index="handleIndex">
                     </el-table-column>
                     <el-table-column prop="name"
                                      label="音乐标题"
                                      min-width="200">
                     </el-table-column>
                     <el-table-column prop="ar[0].name"
                                      label="歌手"
                                      min-width="100">
                     </el-table-column>
                     <el-table-column prop="al.name"
                                      label="专辑"
                                      min-width="140">
                     </el-table-column>
                     <el-table-column prop="dt"
                                      label="时长"
                                      min-width="100">
                     </el-table-column>
                  </el-table>
               </el-tab-pane>
               <el-tab-pane label="评论"
                            name="second">
                  <div class="commentList"
                       v-loading="isCommentLoading">
                     <!-- 精彩评论 -->
                     <comment :comments="comments.hotComments"
                              :commentType="'album'"
                              :commentId="albumInfo.album.id + ''"
                              @getComment="getAlbumComment"
                              v-if="comments.hotComments">
                        <div slot="title">精彩评论</div>
                     </comment>
                     <!-- 最新评论 -->
                     <comment :comments="comments.comments"
                              :commentType="'album'"
                              :commentId="albumInfo.album.id + ''"
                              :isHotComment="comments.hotComments ? false : true"
                              @getComment="getAlbumComment">
                        <div slot="title">热门评论</div>
                     </comment>
                  </div>
                  <!-- 分页 -->
                  <div class="page"
                       v-if="comments && comments.comments">
                     <el-pagination background
                                    layout="prev, pager, next"
                                    :total="comments.total"
                                    small
                                    :page-size="50"
                                    :current-page="currentCommentPage"
                                    @current-change="commentPageChange">
                     </el-pagination>
                  </div>
               </el-tab-pane>
               <el-tab-pane label="专辑详情"
                            name="third">
                  <div class="albumDesc">{{ albumInfo.album.description }}</div>
               </el-tab-pane>
            </el-tabs>
         </div>
      </keep-alive>
   </div>
</template>

<script>
import { formatDate, handleNum, handleMusicTime } from "@/utils/formateTime";
import Comment from "components/comment/Comment.vue";
import { Track, MusicDetailBasic } from "@/utils/iClass";

export default {
   name: "Album",
   components: {
      Comment,
   },
   data() {
      return {
         albumInfo: {},
         comments: {},
         songs: [],
         // 当前评论页数
         currentCommentPage: 1,
         isSub: false,
         // 评论是否在加载中
         isCommentLoading: false,
      };
   },
   watch: {
      "$store.state.musicId"(current, last) {
         this.handleDOM(current, last);
      },
   },
   methods: {
      // 请求
      // 请求专辑详情
      async getAlbumDetail() {
         let { data } = await this.$request("album", { id: this.$route.params.id });
         console.log('ablum data: ', data);
         // 处理歌曲时间
         data.songs.forEach((item) => {
            item.dt = handleMusicTime(item.dt);
            this.songs.push(new Track(item));
         });
         // console.log(res);
         this.albumInfo = data;
      },
      // 获取歌单评论
      async getAlbumComment(type) {
         // 获取时间戳
         var timestamp = Date.parse(new Date());
         this.isCommentLoading = true;

         // 每次请求前先清空comment
         // this.comments.comments = [];

         if (type == "changePage") {
            let album = document.querySelector(".album");
            let listInfo = document.querySelector(".listInfo");
            console.log([listInfo]);
            album.scrollTo({
               behavior: "smooth",
               top: listInfo.clientHeight - 25,
            });
         }

         let res = await this.$request("/comment/album", {
            id: this.$route.params.id,
            offset: (this.currentCommentPage - 1) * 50,
            limit: 50,
            timestamp,
         });
         this.isCommentLoading = false;
         if (res.data.code !== 200) {
            this.$message.error("获取评论失败,请稍后重试!");
            return;
         }

         // console.log(res);
         this.comments = res.data;
      },
      // 获取已收藏专辑列表并判断用户是否收藏当前专辑  因为喜欢和收藏具有较高实时性，所以每次请求都添加时间戳，避免缓存304
      async getAlbumSublist() {
         let timestamp = Date.parse(new Date());
         let res = await this.$request("/album/sublist", {
            limit: 1000,
            timestamp,
         });
         console.log(res);
         this.$store.commit("updateSubAlbumList", res.data.data);
      },

      // 事件函数
      handleIndex(index) {
         // console.log(index);
         index += 1;
         if (index < 10) {
            return "0" + index;
         } else {
            return index;
         }
      },

      // 双击table的row的回调
      async clickRow(row) {
         // console.log(row);
         // 将musicId提交到vuex中 供bottomControl查询歌曲url和其它操作
         this.$store.commit("updateMusicId", row.id);
         // 如果歌单发生变化,则提交歌单到vuex
         if (this.albumInfo.album.id != this.$store.state.musicListId) {
            // 将歌单传到vuex
            this.$store.commit("updateMusicList", {
               musicList: this.songs,
               musicListId: this.albumInfo.album.id,
            });
         }
      },
      // 点击全部播放按钮的回调
      playAll() {
         this.$store.commit("updateMusicId", this.songs[0].id);
         this.$store.commit("updateMusicList", {
            musicList: this.songs,
            musicListId: this.albumInfo.album.id,
         });
      },
      // 评论点击翻页的回调
      commentPageChange(page) {
         this.currentCommentPage = page;
         this.getAlbumComment("changePage");
      },
      // 通过DOM操作样式
      handleDOM(current, last) {
         if (document.querySelector(".album")) {
            let tableRows = document
               .querySelector(".album")
               .querySelectorAll(".el-table__row");
            // 遍历当前musicList 找到当前播放的index的行进行渲染
            // console.log(tableRows);
            let index = this.songs.findIndex(
               (item) => item.id == current
            );
            // console.log(index);
            if (index != -1) {
               // 直接修改dom样式的颜色无效  可能是因为第三方组件的原故
               // 通过引入全局样式解决
               // 将正在播放的音乐前面的索引换成小喇叭
               tableRows[index].children[0].querySelector(
                  ".cell"
               ).innerHTML = `<div><i class="iconfont icon-yinliang"></i></div>`;
               tableRows[index].children[0]
                  .querySelector(".iconfont")
                  .classList.add("currentRow");
               tableRows[index].children[2]
                  .querySelector(".cell")
                  .classList.add("currentRow");
            }
            // 清除上一首的样式
            if (last != -1) {
               let lastIndex = this.songs.findIndex(
                  (item) => item.id == last
               );
               if (lastIndex != -1) {
                  // 将上一个播放的dom的小喇叭换回索引
                  tableRows[lastIndex].children[0].querySelector(
                     ".cell"
                  ).innerHTML = `<div>${
                     lastIndex + 1 < 10 ? "0" + (lastIndex + 1) : lastIndex + 1
                  }</div>`;

                  // 将上一首的类名删掉  小喇叭的html已经被替换了，不需要再还原
                  tableRows[lastIndex].children[2]
                     .querySelector(".cell")
                     .classList.remove("currentRow");
               }
            }
         }
      },

      // 点击收藏专辑的回调
      async subAlbum() {
         this.isSub = !this.isSub;
         await this.$request("/album/sub", {
            id: this.$route.params.id,
            t: this.isSub ? 1 : 0,
         });
         this.getAlbumSublist();
      },

      // 判断用户是否收藏了该专辑
      getIsSub() {
         this.isSub = this.$store.state.subAlbumList.find(
            (item) => item.id == this.$route.params.id
         );
      },
   },
   filters: {
      showDate(value) {
         // 1、先将时间戳转成Date对象
         const date = new Date(value);

         // 2、将date进行格式化
         return formatDate(date, "yyyy-MM-dd");
      },
      handleNum,
   },
   created() {
      this.getAlbumComment();
   },
   async mounted() {
      await this.getAlbumDetail();
      // 判断是否和上一次打开的歌单相同
      if (this.$route.params.id == this.$store.state.musicListId) {
         this.handleDOM(this.$store.state.musicId);
      }
      if (this.$store.state.subAlbumList == null) {
         await this.getAlbumSublist();
      }
      this.getIsSub();
   },
};
</script>

<style scoped>
.album {
   overflow-y: scroll;
}

.listInfo {
   display: flex;
   padding: 25px 15px;
   align-items: flex-start;
}

.listAvatar {
   width: 190px;
   height: 190px;
   overflow: hidden;
   border-radius: 10px;
   margin-right: 25px;
}

.listAvatar img {
   width: 100%;
}

.right {
   width: calc(100% - 200px);
   display: flex;
   flex-direction: column;
}

.title {
   display: flex;
   align-items: center;
}

.titleTag {
   font-size: 12px;
   color: #ec4141;
   border: 1px solid #ec4141;
   padding: 1px 2px;
   border-radius: 2px;
   margin-right: 5px;
   transform: scale(0.8);
}

.titleContent {
   font-size: 20px;
   font-weight: 600;
   color: #373737;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
   width: 90%;
}

.createTime {
   transform: scale(0.9);
}

.buttons {
   margin: 15px 0 0 -5px;
   display: flex;
}

.buttonItem {
   font-size: 12px;
   padding: 8px 15px;
   border: 1px solid #ddd;
   border-radius: 20px;
   transform: scale(0.9);
}

.buttonItem i {
   font-size: 12px;
   margin-right: 3px;
   transform: scale(0.9);
}

.playAll {
   background-color: #ec4141;
   color: white;
}

.otherInfo {
   margin-top: 10px;
   /* display: flex; */
   font-size: 0.85rem;
   /* transform: scale(0.9); */
}

.otherInfo:first-of-type {
   margin-top: 30px;
}

.musicNum {
   margin-right: 13px;
}

.musicList {
   margin: -15px 15px 0;
}

.page {
   width: 100%;
   text-align: center;
   padding-bottom: 20px;
}

.albumDesc {
   font-size: 12px;
   color: #373737;
   line-height: 25px;
   letter-spacing: 0.5px;
   text-indent: 2em;
}

.red {
   color: #ec4141;
}

.album /deep/ .el-loading-spinner {
   top: 40px;
}

.playCount span {
   cursor: pointer;
}
</style>