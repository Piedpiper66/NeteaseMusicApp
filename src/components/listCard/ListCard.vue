<template>
   <div class="listCard"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        :infinite-scroll-distance="300"
        :infinite-scroll-immediate="false"
        ref="listCard">
      <div class="listCardItem"
           :class="{row5: rowCount === 5, row6: rowCount === 6}"
           v-for="(item, index) in listCardData"
           :key="index"
           @click="clickListCardItem(item.id)">
         <div class="image">
            <img draggable="false"
                 :src="(item.picUrl || item.coverImgUrl) + '?param=400y400'"
                 alt="" />
            <div class="playCount"
                 v-if="showPlayCount"><span>{{ (item.playCount || item.playcount) && (Math.floor((item.playCount || item.playcount) / 10000) + '万') }}</span></div>
            <!-- <div class="playShow">
               <i class="iconfont icon-icon_play"></i>
            </div> -->
            <play-circle v-if="showPlayCircle"
                         :transition="transition"
                         :position="position"
                         :opacity="opacity"
                         :size="size"
                         class="circle"></play-circle>
         </div>
         <div class="title">{{ item.name }}</div>
      </div>
   </div>
</template>

<script>
import PlayCircle from "components/playCircle/playCircle.vue";

export default {
   name: "ListCard",
   components: {
      PlayCircle,
   },
   props: {
      listCardData: {
         type: Array,
         default() {
            return [];
         },
      },
      // 是否使用上拉触底事件
      isLoad: {
         type: Boolean,
         default() {
            return false;
         },
      },
      position: {
         type: String,
         default() {
            return "center";
         },
      },
      opacity: {
         type: Number,
         default() {
            return 0.8;
         },
      },
      size: {
         type: String,
         default() {
            return "normal";
         },
      },
      transition: {
         type: Boolean,
         default() {
            return false;
         },
      },
      showPlayCount: {
         type: Boolean,
         default() {
            return true;
         },
      },
      showPlayCircle: {
         type: Boolean,
         default() {
            return true;
         },
      },
      rowCount: {
         type: Number,
         default() {
            return 5;
         },
      },
      index: {
         type: Boolean,
         default: () => false,
      },
   },
   data() {
      return {
         // 无限滚动是否可用
         disabled: true,
      };
   },
   created() {
      // console.log(this.listCardData);
      // console.log(this.position, this.opacity, this.size, this.trainsition);
      // console.log( this.rowCount );
   },
   mounted() {
      const single = 100 / this.rowCount - 2;
      this.$refs.listCard.style.setProperty("--imageWidth", single + "%");
      // this.$nextTick(() => {
      //    console.log(this.$refs.listCard.firstElementChild);
      //    this.$refs.listCard.firstElementChild.querySelector(
      //       ".image>img"
      //    ).style.filter = "blur(15px)";
      // });
   },
   methods: {
      clickListCardItem(id) {
         this.$emit("clickListCardItem", id);
      },
      // 上拉触底触发
      load() {
         //   console.log("滑动到底部");
         this.$emit("bottomLoad");
         // 触发load后加载数据 期间不允许再次触发load事件
         this.disabled = true;
      },
   },
   watch: {
      //   数据更新后，可再次运行触发load事件
      listCardData() {
         if (this.isLoad == true) {
            if (this.listCardData.length != 0) {
               this.disabled = false;
            } else {
               this.disabled = true;
            }
         }
      },
      // "$store.state.isLogin"(current) {
         // if (current && this.index) {
            // this.$nextTick(() => {
            //    this.$refs.listCard.querySelector('.listCardItem:first-of-type > .image > img')
            //    .style.filter = 'blur(15px)';
            // })
            // this.$refs.listCard.style.setProperty("--blur", "15px");
         // }
      // },
   },
};
</script>

<style scoped>
.listCard {
   --imageWidth: 18.4%;
   --blur: "0px";
   display: flex;
   flex-wrap: wrap;
   margin: 10px 0;
}

.listCardItem {
   box-sizing: border-box;
   width: var(--imageWidth);
   margin: 0 2% 20px 0;
   overflow: hidden;
   cursor: pointer;
}

/* .listCardItem:first-of-type > .image > img {
   filter: blur(10px);
} */

/* .listCardItem:nth-child(6n) {
   margin-right: 0;
} */

.row5:nth-child(5n) {
   margin-right: 0;
}

.row6:nth-child(6n) {
   margin-right: 0;
}

.image {
   width: 100%;
   padding-bottom: 100%;
   height: 0;
   position: relative;
   overflow: hidden;
   border-radius: 6px;
}

.image::after {
   content: "";
   width: 100%;
   height: 100%;
   position: absolute;
   top: 0;
   left: 0;
   background: url("~assets/img/imgLoading.png") no-repeat center;
   background-size: contain;
   /* border-radius: 10px; */
   z-index: -1;
}

.image img {
   width: 100%;
   border-radius: 6px;
}

.image .playCount {
   position: absolute;
   right: 10px;
   top: 5px;
   font-size: 0.75rem;
   color: #fff;
}

.image > .playShow {
   position: absolute;
   right: 15px;
   bottom: 15px;
   width: 16%;
   height: 16%;
   background-color: rgba(255, 255, 255, 0.8);
   opacity: 0;
   border-radius: 50%;
   display: flex;
   justify-content: center;
   align-items: center;
   transition: opacity 0.7s ease-in-out;
}

.image:hover .circle {
   opacity: 1;
}

.playShow i {
   color: #ec4141;
   font-size: 1rem;
}

.title {
   margin-top: 8px;
   padding: 0 2px;
   font-size: 0.85rem;
   color: black;
   line-height: 17px;
   /* 两行溢出 */
   text-overflow: -o-ellipsis-lastline;
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2;
   line-clamp: 2;
   -webkit-box-orient: vertical;
}
</style>