<template>
   <div 
      v-if="musicInfo"
         ref="card"
        class="musicDetailCard"
        :class="[
         isMusicDetailCardShow ? '' : 'hide',
         backgroundMode ? '' : 'glassCard',
         ]">
      <div class="closeCard"
           @click="closeCard">
         <i class="iconfont icon-arrow-down-bold"></i>
      </div>
      <div class="changeBackground"
           @click="changeBackground">
         <i class="iconfont icon-UniSetBackgroundTextStyle"></i>
      </div>
      <div class="musicDetailCardContainer"
           v-if="!cleanCard && musicInfo.name">

         <div class="top">
            <div class="left">
               <div class="discContainer">
                  <div class="needle"
                       :class="$store.state.isPlay ? 'needleRotate' : ''"
                       ref="needle">
                     <img src="~assets/img/MusicDetailCard/needle.png"
                          alt="" />
                  </div>
                  <!-- 通过音乐的加载时差删除discAnimation类名再添加,达到重置动画的效果 -->
                  <div class="disc"
                       :class="[
                $store.state.isPlay ? '' : 'pause',
                $store.state.isMusicLoad ? '' : 'discAnimation',
              ]"
                       ref="disc">
                     <img src="~assets/img/MusicDetailCard/disc.png"
                          draggable="false"
                          alt="" />
                     <img src="~assets/img/test.jpg"
                          alt=""
                          class="musicAvatar"
                          v-if="!musicInfo.al" />
                     <img :src="musicInfo.al.picUrl"
                          alt=""
                          class="musicAvatar"
                          v-else />
                  </div>
               </div>
            </div>
            <div class="right">
               <div class="lyric-wrap">
                  <div class="title">
                     <div class="musicName">{{ musicInfo.name }}</div>
                     <div class="album"
                          @click="goToDetailPage('album', musicInfo.al.id)">
                        {{ musicInfo.al.name }}
                     </div>
                     <div class="singer"
                          @click="goToDetailPage('singerDetail', musicInfo.ar[0].id)">
                        {{ musicInfo.ar[0].name }}
                     </div>
                  </div>
                  <div class="lyricsWrap">
                     <lyrics-scroll :lyric="lyric"></lyrics-scroll>
                  </div>
               </div>
            </div>
         </div>

         <div class="bottom"
              v-loading="isCommentLoading"
              element-loading-background="rgba(255, 255, 255, 0.1)">
            <comment :comments="hotComments"
                     :commentType="'music'"
                     :commentId="$store.state.musicId + ''"
                     :musicTitle="musicInfo.name"
                     @getComment="getMusicComment($store.state.musicId)"
                     class="commentComponent"
                     v-if="currentCommentPage == 1">
               <div slot="title">热门评论</div>
            </comment>
            <comment :comments="comment.comments"
                     :commentType="'music'"
                     :commentId="$store.state.musicId + ''"
                     :musicTitle="musicInfo.name"
                     @getComment="getMusicComment($store.state.musicId)"
                     class="commentComponent">
               <div slot="title">最新评论({{ comment.total }})</div>
            </comment>
            <!-- 评论分页 -->
            <div class="page"
                 v-show="comment.comments && comment.comments[0]">
               <el-pagination background
                              layout="prev, pager, next"
                              :total="comment.total"
                              small
                              :page-size="20"
                              :current-page="currentCommentPage"
                              @current-change="commentPageChange">
               </el-pagination>
            </div>
         </div>
         <go-top scrollObj=".musicDetailCardContainer"></go-top>
      </div>
      <div v-else
           class="tip">暂无播放音乐</div>
   </div>
</template>

<script>
import Comment from "components/comment/Comment.vue";
import LyricsScroll from "components/lyricsScroll/LyricsScroll.vue";
import GoTop from "components/goTop/GoTop.vue";

// 定时器名称
let timer;

export default {
   components: {
      LyricsScroll,
      Comment,
      GoTop,
   },
   name: "MusicDetailCard",
   data() {
      return {
         // 是否显示歌曲详情卡片
         isMusicDetailCardShow: false,
         //   歌词
         lyric: [[0, "暂无歌词"]],
         //当前评论页数
         currentCommentPage: 1,
         // 评论数据
         comment: {},
         //   当前歌曲信息
         musicInfo: {},
         // 是否删除卡片渲染的内容
         cleanCard: false,
         // 背景显示模式  true为白色渐变背景  false为毛玻璃背景
         backgroundMode: true,
         // 评论是否在加载中
         isCommentLoading: false,
         // 热门评论
         hotComments: [],
         // 上次的 stylesheets
         lastStyleSheet: null
      };
   },
   watch: {
      "$store.state.isMusicDetailCardShow"(isMusicDetailCardShow) {
         this.isMusicDetailCardShow = isMusicDetailCardShow;
         //   性能优化
         //如果卡片没有展示就不发送请求和渲染里面的内容
         //   删除定时器 避免用户在关闭卡片的1s内又打开卡片 导致展示内容被删除
         clearTimeout(timer);
         this.cleanCard = false;
         if (
            isMusicDetailCardShow &&
            !this.comment.comments &&
            this.$store.state.musicId != ""
         ) {
            console.log("请求歌词和评论");
            this.getLyric(this.$store.state.musicId);
            this.getMusicComment(this.$store.state.musicId);
         }
         //   当卡片关闭时 延迟 3s再删除里面渲染的内容 提升体验
         else if (isMusicDetailCardShow == false) {
            timer = setTimeout(() => {
               this.cleanCard = true;
            }, 3000);
         }
      },
      // 当vuex中的歌曲id发生变化时,需要重新获取评论和歌词
      "$store.state.musicId"(musicId) {
         this.lastStyleSheet = document.styleSheets[0];
         const sheetLen = this.lastStyleSheet.cssRules.length;
         console.log('sheet len: ', sheetLen);
         console.error( 'sheet: ', this.lastStyleSheet );
         // 清空歌词
         this.lyric = [[0, "正在加载歌词"]];
         // 重置评论页数
         this.currentCommentPage = 1;
         // 更新当前歌曲信息
         this.musicInfo =
            this.$store.state.musicList[this.$store.state.currentIndex];

         sheetLen && this.lastStyleSheet.removeRule(0);
         this.musicInfo && document.styleSheets[0].insertRule(
            `.musicDetailCard::after {
               background: url(${this.musicInfo.al.picUrl}) no-repeat;
            }`,
            0
         );

         this.comment = {};
         // 优化性能,仅在卡片展示时才发送请求
         if (this.isMusicDetailCardShow) {
            this.getLyric(musicId);
            this.getMusicComment(musicId);
         }
      },
   },
   methods: {
      // 请求
      //请求并处理歌词数据
      async getLyric(id) {
         let res = await this.$request("/lyric", { id });
         //   console.log(res);
         if (!res.data.lrc) {
            console.log(res.data.lrc);
            this.lyric = [[0, "暂无歌词"]];
            return;
         }
         let lyrics = res.data.lrc.lyric;
         // console.log(lyrics);
         // 对获取到的歌词进行处理
         let arr = lyrics.split("\n");
         let array = [];
         // let obj = {};
         let time = "";
         let value = "";
         let result = [];

         //去除空行
         arr.forEach((item) => {
            if (item != "") {
               array.push(item);
            }
         });
         arr = array;
         arr.forEach((item) => {
            time = item.split("]")[0];
            value = item.split("]")[1];
            //去掉时间里的中括号得到xx:xx.xx
            var t = time.slice(1).split(":");
            //将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
         });

         this.lyric = result;
         // console.log(this.lyric);
      },
      // 请求评论数据
      async getMusicComment(id, type) {
         // 获取时间戳
         var timestamp = Date.parse(new Date());

         this.isCommentLoading = true;
         if (type == "changePage") {
            let musicDetailCardContainer = document.querySelector(
               ".musicDetailCardContainer"
            );
            let top = document.querySelector(".top");
            // console.log([musicDetailCardContainer, top]);
            musicDetailCardContainer.scrollTo({
               behavior: "smooth",
               top: top.clientHeight,
            });
         }

         // 当页数为第一页时，请求10条热门数据
         if (this.currentCommentPage == 1) {
            let res = await this.$request("/comment/hot", {
               id,
               limit: 10,
               type: 0,
               timestamp,
            });
            console.log(res);
            if (res.data.code != 200) {
               this.$message.error("获取热门评论失败,请稍后重试!");
               return;
            }
            this.hotComments = res.data.hotComments;
         }

         let res = await this.$request("/comment/music", {
            id,
            offset: (this.currentCommentPage - 1) * 20,
            timestamp,
         });

         console.log(res);
         if (res.data.code !== 200) {
            this.$message.error("获取评论失败,请稍后重试!");
         }

         this.isCommentLoading = false;
         this.comment = res.data;
      },
      //点击分页按钮的回调
      commentPageChange(page) {
         this.currentCommentPage = page;
         this.getMusicComment(this.$store.state.musicId, "changePage");
      },
      // 点击关闭卡片的回调
      closeCard() {
         this.$store.commit("changeMusicDetailCardState");
      },
      // 点击切换背景的回调
      changeBackground() {
         this.backgroundMode = !this.backgroundMode;
      },

      // 点击跳转至对应的详情页面
      goToDetailPage(name, id) {
         this.$router.push({ name, params: { id } });
         this.$store.commit("changeMusicDetailCardState", false);
      },
   },
   created() {},
};
</script>

<style scoped>
.glassCard {
   backdrop-filter: blur(50px) brightness(95%) !important;
   background-color: unset !important;
   background-image: unset !important;
   color: rgb(37, 37, 37);
}

.glassCard .commentComponent {
   color: rgb(37, 37, 37);
   border-color: rgb(143, 143, 143);
}

.commentComponent .replied {
   border-radius: 5px;
   background-color: rgba(0, 0, 0, 0.1);
}

.musicDetailCard {
   position: absolute;
   width: 100%;
   height: calc(100vh - 75px);
   top: 0;
   left: 0;
   z-index: 1000;
   transition: transform 0.5s;
   z-index: 999;
   background: transparent;
   background-color: white;
   min-width: 1000px;
   overflow: hidden;
}

.musicDetailCard::after {
   content: "";
   position: absolute;
   width: 150%;
   background-size: 150% 25%;
   background-position: left 50% top 0;
   filter: blur(200px);
   top: 0;
   right: 0;
   bottom: 0px;
   left: 0;
   z-index: -1;
}

.blur-bg {
   position: absolute;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   z-index: 99;
   filter: blur(20px);
}

.closeCard .iconfont {
   position: absolute;
   top: 15px;
   left: 35px;
   font-size: 21px !important;
   z-index: 999;
}

.musicDetailCardContainer {
   height: 100%;
   overflow-y: scroll;
}

.hide {
   transform: translateY(calc(100vh - 75px));
}

.top {
   display: flex;
   justify-content: center;
   height: 70vh;
   width: 80%;
   margin: auto;
}

.left {
   width: 200px;
   flex: 1;
}

.discContainer {
   margin-top: 60px;
   width: 220px;
   position: relative;
   left: 50%;
   transform: translateX(-50%);
}

.needle {
   position: relative;
   left: 50%;
   width: 100px;
   height: 88px;
   z-index: 10000;
   transition: all 1s;
   transform-origin: 5.3px 5.3px;
}

.needle img {
   width: 100%;
}

.needleRotate {
   transform-origin: 5.3px 5.3px;
   transform: rotate(22deg);
}

.disc {
   width: 260px;
   height: 260px;
   position: relative;
   top: -12px;
}

.disc img:nth-child(1) {
   width: 100%;
}

.disc .musicAvatar {
   position: absolute;
   top: 40px;
   left: 40px;
   width: 180px;
   z-index: -1;
}

/* 碟子设置旋转动画 */
.discAnimation {
   /* infinite动画无限循环 */
   animation: disc 25s linear infinite;
   /* 动画延迟一秒 */
   animation-delay: 0.8s;
}

@keyframes disc {
   from {
      transform: rotate(0deg);
   }
   to {
      transform: rotate(360deg);
   }
}

.pause {
   animation-play-state: paused;
   -webkit-animation-play-state: paused;
}

.right {
   flex: 2;
}

.lyric-wrap {
   width: 70%;
}

.title {
   width: 100%;
   text-align: center;
   font-size: 0.85rem;
   margin: 50px 0;
   color: rgb(145, 145, 145);
}

.title div {
   margin: 7px 0;
}

.musicName {
   font-size: 1.9rem;
   color: rgb(22, 22, 22);
}

.bottom {
   margin: 40px auto;
   width: 55vw;
}

.page {
   width: 100%;
   text-align: center;
   padding-bottom: 20px;
}

.tip {
   font-size: 20px;
   position: absolute;
   left: 50%;
   top: 50%;
   transform: translate(-50%, -50%);
}

.changeBackground {
   position: absolute;
   bottom: 10px;
   right: 20px;
   cursor: pointer;
}

.bottom /deep/ .el-loading-spinner {
   top: 40px;
}

.album,
.singer {
   cursor: pointer;
}
</style>
