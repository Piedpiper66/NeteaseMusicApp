<template>
   <el-container direction="vertical">
      <el-header height="">
         <header-bar></header-bar>
      </el-header>
      <el-container direction="horizontal">
         <el-aside width="190px">
            <el-menu active-text-color="#000"
                     router
                     :default-active="defaultActive"
                     text-color="#333">
               <el-menu-item index="/discover/recommend">
                  <i class="iconfont icon-yinle"></i>
                  <span slot="title">发现音乐</span>
               </el-menu-item>
               <el-menu-item index="/video">
                  <i class="iconfont icon-shipin"></i>
                  <span slot="title">视频</span>
               </el-menu-item>
               <el-menu-item index="/records">
                  <i class="el-icon-time"></i>
                  <span slot="title">最近播放</span>
               </el-menu-item>
               <el-menu-item-group v-if="createdMusicList.length != 0">
                  <template slot="title"
                            class="groupTitle">创建的歌单</template>
                  <el-menu-item v-for="(item, index) in createdMusicList"
                                :key="index"
                                :index="'/musiclistdetail/' + item.id">
                     <i class="iconfont icon-gedan"></i>{{ item.name }}
                  </el-menu-item>
               </el-menu-item-group>

               <el-menu-item-group v-if="collectedMusicList.length != 0">
                  <template slot="title"
                            class="groupTitle">收藏的歌单</template>
                  <el-menu-item v-for="(item, index) in collectedMusicList"
                                :key="index"
                                :index="'/musiclistdetail/' + item.id">
                     <i class="iconfont icon-gedan"></i>{{ item.name }}
                  </el-menu-item>
               </el-menu-item-group>
            </el-menu>
         </el-aside>
         <el-container direction="vertical">
            <el-main height="">
               <router-view class="routerView"
                            :key="$route.fullPath"></router-view>
            </el-main>
         </el-container>
      </el-container>

      <bottom-control></bottom-control>
      <music-detail-card class="musicDetailCard"></music-detail-card>

   </el-container>
</template>

<script>
import HeaderBar from "components/headerBar/HeaderBar.vue";
import BottomControl from "components/bottomControl/BottomControl";
import MusicDetailCard from "views/musicDetailCard/MusicDetailCard.vue";

export default {
   name: "",
   components: {
      HeaderBar,
      BottomControl,
      MusicDetailCard,
   },
   data() {
      return {
         defaultActive: "",
         // 用户信息
         // userInfo: {},
         // 用户创建的歌单
         createdMusicList: [],
         // 用户收藏的歌单
         collectedMusicList: [],
         // 下载的音乐的信息
         downloadMusicInfo: {
            name: "",
            url: "",
         },
      };
   },
   created() {
      document.addEventListener('keypress', e => {
         if (e.code === 'Space') {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return true;
            else e.preventDefault();
         }
      })
      // 取路由中的首地址 用于侧边栏的导航active
      this.defaultActive = "/" + this.$route.path.split("/")[1];
      // 顶部栏读取登录状态需要一定时间，这里延迟500毫秒再执行
      // setTimeout(() => {
      //   this.getUserMusicList();
      // }, 500);
   },
   methods: {
      // 请求
      // 请求用户歌单
      async getUserMusicList() {
         // 需先登录
         if (!this.$store.state.isLogin) {
            this.$message.error("请先进行登录操作");
            return;
         }
         let timestamp = Date.parse(new Date());
         // 先从localStorage里面读取用户信息  如果登录成功是有存的
         // this.userInfo =
         //   window.localStorage.getItem("userInfo") &&
         //   JSON.parse(window.localStorage.getItem("userInfo"));

         let res = await this.$request("/user/playlist", {
            uid: localStorage.getItem("userId"),
            timestamp,
         });
         // console.log(res);
         // 对数据进行处理分类
         res = res.data.playlist;
         let index = res.findIndex((item) => item.subscribed == true);
         this.createdMusicList = res.slice(0, index);
         this.collectedMusicList = res.slice(index);
         this.createdMusicList[0].name = "我喜欢的音乐";
         // console.log(this.createdMusicList, this.collectedMusicList);
         // 将收藏的歌单上传至vuex
         this.$store.commit("updateCollectMusicList", this.collectedMusicList);
         // 将创建的歌单上传至vuex
         this.$store.commit("updateCreatedMusicList", this.createdMusicList);
      },
   },
   watch: {
      // 监听收藏歌单的变化
      "$store.state.collectMusicList"(current) {
         this.collectedMusicList = current;
      },
      // 更改侧边栏 item 状态
      "$route.path"() {
         this.defaultActive = "/" + this.$route.path.split("/")[1];
      },

      // 监听当前下载音乐信息
      "$store.state.downloadMusicInfo"(current) {
         axios
            .get(current.url, { responseType: "blob" })
            .then((res) => {
               let blob = res.data;
               let url = URL.createObjectURL(blob);
               // console.log(url);
               let a = document.querySelector("#downloadCurrentMusic");
               this.downloadMusicInfo.url = url;
               this.downloadMusicInfo.name = current.name;
               this.$nextTick(() => {
                  a.click();
                  // 用完释放URL对象
                  URL.revokeObjectURL(url);
               });
            })
            .catch((err) => {
               console.log(err);
               this.$message.error("下载失败,请稍后重试!");
            });
      },
      // 监听vuex中的登录状态
      "$store.state.isLogin"(current) {
         console.log("current Login state: ", current);
         if (current) {
            this.getUserMusicList();
         } else {
            // 清空收藏和创建歌单
            this.createdMusicList = [];
            this.collectedMusicList = [];
         }
      },
   },
};
</script>

<style>
.el-header {
   background-color: #ec4141;
   height: 65px !important;
   padding: 0;
   margin: 0;
   z-index: 100;
}
/* .iconfont {
   font-size: 18px;
   margin-right: 10px;
} */

.routerView,
.el-aside {
   height: calc(100vh - 140px);
}

.routerView {
   padding: 15px;
   margin: 0;
   width: 100%;
   min-width: calc(100vw - 190px);
   overflow-x: scroll;
}

.el-aside {
   border-right: 1px solid #ccc;
}

.el-aside .iconfont {
   font-size: 18px;
   margin-right: 10px;
}

.el-menu {
   border: none;
   padding: 5px 10px;
}

.el-menu-item:hover {
   background-color: #f5f5f6 !important;
}

.el-menu-item {
   font-size: 14px;
   padding-left: 10px !important;
   margin: 5px 0 !important;
   height: 40px;
   line-height: 40px;
   border-radius: 8px;
}

.el-menu-item-group {
   margin-top: 10px;
}

.el-main {
   padding: 0;
}
</style>