<template>
   <div class="records">
      <div class="header clear-fix">
         <div class="title">
            <div class="left">
               <span class="recent-title">最近播放</span>
               <span class="list-count">共{{ musicList.length }}首</span>
            </div>
            <div class="right" @click="clear">
               <span >清空列表</span>
            </div>
         </div>
         <div class="btn-wrap">
            <div class="playbtn"
                 @click="handlePlay">
               <i class="iconfont icon-icon_play"></i><span>播放全部</span>
            </div>
         </div>
      </div>

      <div class="record-list">
         <el-tabs value="first">
            <el-tab-pane name="first">
               <!-- 表格 -->
               <el-table :data="musicList"
                         size="mini"
                         style="width: 100%;"
                         @row-dblclick="clickRow"
                         @cell-click="clickCell"
                         highlight-current-row
                         stripe
                         lazy
                         :row-key="
                           (row) => {
                              return row.id;
                           }
                        "
                         :infinite-scroll-distance="1500"
                         :infinite-scroll-immediate="false">
                  <el-table-column label=""
                                   width="40"
                                   type="index"
                                   :index="handleIndex">
                  </el-table-column>
                  <el-table-column prop="name"
                                   label="音乐标题"
                                   min-width="350">
                  </el-table-column>
                  <el-table-column prop="ar[0].name"
                                   label="歌手"
                                   min-width="120">
                  </el-table-column>
                  <el-table-column prop="al.name"
                                   label="专辑"
                                   min-width="170">
                  </el-table-column>
                  <el-table-column prop="dt"
                                   label="时长"
                                   min-width="100">
                  </el-table-column>
                  <!-- <el-table-column prop="id"></el-table-column> -->
               </el-table>
               <!-- <div class="loadMore"
                    v-if="isMore && !this.$store.state.isLogin">
                  登陆后查看更多音乐
               </div>
               <div class="placeholder"
                    v-else></div> -->
               <!-- <div class="placeholder"></div> -->
            </el-tab-pane>
         </el-tabs>
      </div>
   </div>
</template>

<script>
export default {
   name: "Records",
   data() {
      return {
         musicList: this.$store.state.records.filter(item => item.name),
      };
   },
   created() {
      console.log(this.musicList);
   },
   updated() {
      console.log("record update: ", this.musicList);
   },
   methods: {
      async clickRow(row) {
         console.log(row);
         // 将musicId提交到vuex中 供bottomControl查询歌曲url和其它操作
         this.$store.commit("updateMusicId", row.id);
         // 如果歌单发生变化,则提交歌单到vuex
         // 将歌单传到vuex
         this.$store.commit("updateMusicList", {
            musicList: this.musicList,
            musicListId: -1,
         });

         // let result = await this.$request("/song/url", { id: row.id, br: 320000 });
         // console.log(result.data.data[0].url);
         // this.$store.commit("updateMusicUrl", result.data.data[0].url);
      },
      handlePlay() {
         this.$store.commit("updateMusicId", this.musicList[0].id);
         // 如果歌单发生变化,则提交歌单到vuex
         // 将歌单传到vuex
         this.$store.commit("updateMusicList", {
            musicList: this.musicList,
            musicListId: -1,
         });
         // this.$messageBox
         //    .confirm("是否替换当前播放列表", "提示", {
         //       confirmButtonText: "确定",
         //       cancelButtonText: "取消",
         //       type: "warning",
         //    })
         //    .then(() => {
         //       this.$message({
         //          type: "success",
         //          message: "删除成功!",
         //       });
         //    })
         //    .catch(() => {
         //       this.$message({
         //          type: "info",
         //          message: "已取消删除",
         //       });
         //    });
      },
      clear() {
         console.log('clear');
         this.$store.commit('clearRecords');
         this.$nextTick(() => {
            this.musicList = this.$store.state.records;
         })
      },
      handleIndex(index) {
         // console.log(index);
         index += 1;
         if (index < 10) {
            return "0" + index;
         } else {
            return index;
         }
      },
      async clickCell(row, column, cell) {
         // 判断点击的是下载按钮
         if (cell.querySelector(".icon-download")) {
            // 请求该歌曲的url
            console.log(row);
            let res = await this.$request("/song/url", { id: row.id });
            console.log(res.data.data[0].url);
            console.log(res);
            if (res.data.data[0].url == null) {
               this.$message.warning("暂时无法获取该资源哦!");
               return;
            }

            // 匹配资源的域名
            let url = res.data.data[0].url.match(/\http.*?\.net/);
            // 匹配域名名称，并匹配对应的代理
            let serve = url[0].match(/http:\/(\S*).music/)[1];
            if (
               serve != "/m7" &&
               serve != "/m701" &&
               serve != "/m8" &&
               serve != "/m801"
            ) {
               // 没有对应的代理
               this.$message.error("匹配不到对应的代理,下载失败!");
               return;
            }
            // 截取后面的参数
            let params = res.data.data[0].url.slice(url[0].length);
            // console.log(url[0], serve, params);

            let downloadMusicInfo = {
               url: serve + params,
               name:
                  row.name +
                  " - " +
                  row.ar[0].name +
                  "." +
                  res.data.data[0].type.toLowerCase(),
            };
            console.log(downloadMusicInfo);
            this.$store.commit("updateDownloadMusicInfo", downloadMusicInfo);
         }
      },
   },
};
</script>

<style scoped>
.header {
   height: max-content;
   padding: 10px 20px 0 20px;
}

.title::after {
   content: "";
   clear: both;
   display: block;
}

.title {
   display: flex;
   /* justify-content: space-between; */
   align-items: center;
   position: relative;
}

.left {
   left: 0;
}

.right {
   position: absolute;
   right: 20px;
   justify-self: flex-end;
   cursor: pointer;
}

.recent-title {
   font-size: 1.35rem;
   font-weight: bolder;
   color: #373737;
}

.list-count {
   font-size: 1rem;
   margin-left: 10px;
   color: #9f9f9f;
}

.playbtn {
   background-color: #ec4141;
   display: inline-block;
   border-radius: 999px;
   padding: 6px 20px;
   color: #fff;
   cursor: pointer;
   font-size: 0.9rem;
   margin-top: 30px;
}

.playbtn span {
   margin-left: 10px;
   line-height: 20px;
}
</style>