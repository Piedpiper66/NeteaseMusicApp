
<template>
   <!-- 这个组件为了复用写的很乱，懒得整理了 -->
   <div>
      <div class="officalItem">
         <!-- cover -->
         <div class="listCover">
            <img :src="officialListDetailItem.coverImgUrl || cover"
                 @click="
            officialListDetailItem.coverImgUrl
              ? clickCheckAll(officialListDetailItem.id)
              : ''
          " />
            <div class="update-time"
                 v-show="showUpdate"><span>{{ formateDate }}</span></div>
            <play-circle v-if="circleShow"
                         class="circle"
                         :position="'center'"
                         size="bigger"
                         :opacity="0.5">
            </play-circle>
         </div>

         <!-- list -->
         <div class="listContainer">
            <slot name="header"></slot>
            <table>
               <tr class="listRows"
                   v-for="(item, index) in (
                     officialListDetailItem.tracks &&
                     officialListDetailItem.tracks.slice(0, 5)) ||
                     (
                        officialListDetailItem.topSongs &&
                        (
                           officialListDetailItem.isOpen ? 
                           officialListDetailItem.topSongs :
                           officialListDetailItem.topSongs.slice(0, 10))
                        )  ||
                       officialListDetailItem.songs.slice(0, 10)"
                   :key="index"
                   @click="handleRowClick"
                   @dblclick="handleRowDbClick(officialListDetailItem.id || item.id, index)">
                  <td class="index"
                      :class="{topthree: index <= 2}">{{ index + 1 }}</td>
                  <td class="musicName">{{ item.name }}</td>
                  <td class="singer">{{ item.ar[0].name }}</td>
               </tr>
               <div class="checkAll"
                    @click="clickCheckAll(officialListDetailItem.id)"
                    v-show="isCheckAllShow">
                  查看全部
                  <span v-show="showSongsNum">
                     {{
                        (officialListDetailItem.songs && officialListDetailItem.songs.length) ||
                        (officialListDetailItem.hotSongs && officialListDetailItem.hotSongs.length) ||
                        (officialListDetailItem.tracksLen)
                     }}首
                  </span>
                  <i class="iconfont icon-arrow-right-bold"></i>
               </div>
            </table>

         </div>
      </div>
   </div>
</template>

<script>
import playCircle from "components/playCircle/playCircle.vue";

export default {
   name: "ListTable",
   data() {
      return {};
   },
   components: {
      playCircle,
   },
   props: {
      officialListDetailItem: {
         type: Object,
         default() {
            return {};
         },
      },
      // 传过来的封面
      cover: {
         type: String,
         default() {
            return "";
         },
      },
      // 传过来的listId
      listId: {
         type: String,
         default() {
            return "";
         },
      },
      // 是否显示查看全部按钮
      isCheckAllShow: {
         type: Boolean,
         default() {
            return true;
         },
      },
      showSongsNum: {
         type: Boolean,
         default() {
            return false;
         },
      },
      showUpdate: {
         type: Boolean,
         default() {
            return true;
         },
      },
      circleShow: {
         type: Boolean,
         default() {
            return true;
         },
      },
   },
   computed: {
      formateDate() {
         const date = new Date(this.officialListDetailItem.updateTime);
         const y = date.getMonth() + 1,
            d = date.getDate();
         return `${y}月${d}日更新`;
      },
   },
   created() {
      // this.officialListDetailItem.tracks[0].al.picUrl
      // console.log(this.officialListDetailItem);
   },
   methods: {
      // 点击行的回调 （选中）
      handleRowClick(event) {
         // 点击时，事件对象可能是td或tr，这里做下判断
         let path;
         if (event.path[0].localName == "tr") {
            path = event.path[0];
         } else {
            path = event.path[1];
         }
         this.$emit("handleRowClick", path);
      },
      // 双击行的回调 播放
      // id 为当前歌单的id index为双击歌曲在歌单的索引
      handleRowDbClick(id, index) {
         let listId = this.listId;
         this.$emit("handleRowDbClick", { id, index, listId });
      },
      // 点击查看全部的回调
      // 这里传来的id是用于Rangking的
      clickCheckAll(id) {
         let listId = this.listId;
         this.$emit("clickCheckAll", { id, listId });
      },
   },
};
</script>

<style scoped>
.officalItem {
   display: flex;
   margin-bottom: 55px;
}

.listCover {
   width: 180px;
   height: 180px;
   /* margin-right: 20px; */
   cursor: pointer;
   position: relative;
   align-items: flex-start;
}

.listCover img {
   width: 100%;
   height: 100%;
   border-radius: 6px;
}

.listCover .update-time {
   position: absolute;
   top: 65%;
   left: 50%;
   transform: translateX(-50%);
   font-size: 0.75rem;
   color: #fff;
}

.listCover:hover .circle {
   opacity: 1;
}

.listContainer {
   width: calc(100% - 200px);
   margin-left: 30px;
}

table {
   width: 100%;
   /* height: 100%; */
   border-collapse: collapse;
   border-radius: 5px;
   overflow: hidden;
   padding-left: 40px;
   flex-shrink: initial;
}

.listRows {
   height: 35px;
   font-size: 12px;
   color: rgb(153, 153, 153);
   width: 100%;
   display: flex;
   align-items: center;
   position: relative;
}

.listRows:nth-child(odd) {
   background-color: #f9f9f9;
}
.listRows:hover {
   background-color: #f4f4f4;
}

.listRows td {
   transform: scale(0.9);
}

.index {
   text-align: center;
   line-height: 28px;
   width: 30px;
   font-size: 1rem;
}

.topthree {
   color: #ed4141;
}

.listRows .musicName {
   color: rgb(31, 31, 31);
   transform: translate(-5%, -5%) scale(0.9);
   text-overflow: ellipsis;
   overflow: hidden;
   white-space: nowrap;
   width: 80%;
}

.singer {
   text-align: right;
   position: absolute;
   right: 10px;
}

.checkAll {
   color: rgb(134, 134, 134);
   font-size: 13px;
   /* transform: scale(0.9) translateX(-5%); */
   width: max-content;
   height: 30px;
   line-height: 30px;
   cursor: pointer;
   padding-left: 14px;
}

.checkAll i {
   font-size: 12px;
}

.selectRow {
   background-color: #efefef !important;
}

tr {
   cursor: pointer;
}
</style>