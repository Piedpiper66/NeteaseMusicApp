<template>
   <div v-if="bannerData !== null"
        class="carousel"
        @mouseover="handleBoxMouseover"
        @mouseout="handleBoxMouseout">
      <!-- music card -->
      <ul class="img-container"
          @click="handleBannerClick">
         <li v-for="(img, index) in bannerData"
             :key="index"
             :index="index"
             :data-id="img.targetId"
             class="imgLi"
             :class="img.currClass"
             @click="handleImgClick">
            <div class="imgWrap">
               <img draggable="false"
                    :data-class="img.currClass"
                    :src="img.imageUrl" />
            </div>
            <div class="bannerTitle"
                 :style="{
            backgroundColor: img.titleColor === 'blue' ? '#4a79cc' : '#cc4a4a',
          }">
               <span>{{ img.typeTitle }}</span>
            </div>
         </li>
      </ul>

      <!-- dots -->
      <ul class="dot-wrap">
         <li v-for="(item, index) in dotList"
             :key="item.index"
             :index="index"
             class="dot"
             :class="{ active: item.isActive }"
             @mouseenter="handleDotEnter"></li>
      </ul>

      <!-- 左按钮 -->
      <!-- <div class="sw-dot-wrap"> -->
      <span class="switch-dot left-0"
            :style="{ display: canBtnShow }"
            @click="handleLeftBtnClick"><i class="el-icon-arrow-left"></i></span>
      <!-- 有按钮 -->
      <span class="switch-dot right-0"
            :style="{ display: canBtnShow }"
            @click="handleRightBtnClick"><i class="el-icon-arrow-right"></i></span>
      <!-- </div> -->
   </div>
</template>

<script>
export default {
   name: "music-carousel",
   props: {
      bannerData: {
         type: Array,
         require: true,
         default: [],
      },
   },
   data() {
      return {
         canBtnShow: "none",
         classList: [],
         dotList: [],
         currDotPosi: JSON.parse(sessionStorage.getItem("carouselIndex")) || 1,
         moveTimer: 0,
         delay: 4000,
         isDotActive: false,
      };
   },
   computed: {
      musicItems() {
         return this.bannerData.filter((item) => +item.targetType === 1);
      },
   },
   watch: {
      $route() {
         sessionStorage.setItem(
            "carouselIndex",
            JSON.stringify(this.currDotPosi)
         );
      },
   },
   created() {
      // console.log(this.bannerData);
      this.classList = this.generateArr(1, this.musicItems.length);
      this.musicItems.forEach((item, index) => {
         this.$set(item, "currClass", this.classList[index]);
      });
      this.dotList = this.musicItems.map((item, index) => ({
         isActive: index !== 1 ? false : true,
      }));
      // console.log(this.dotList);
   },
   mounted() {
      const _img = this.musicItems,
         list = this.classList,
         len = list.length;
      for (let i = 0; i < len; i++) {
         _img[i].currClass = list[i];
      }
      this.initTimer(this.delay);
      this.handleTabsChange();
   },
   beforeUpdate() {
      if (this.moveTimer) clearInterval(this.moveTimer);
   },
   updated() {
      this.initTimer(this.delay);
   },
   destroyed() {
      console.log("carousel destroy");
   },
   activated() {
      console.log('carousel activated');
   },
   deactivated() {
      console.log('carousel dectivated');
   },
   methods: {
      handleBoxMouseover() {
         this.canBtnShow = "inline-block";
         clearInterval(this.moveTimer);
         this.moveTimer = null;
      },
      handleBoxMouseout() {
         this.canBtnShow = "none";
         clearInterval(this.moveTimer);
         this.initTimer(this.delay);
      },
      handleLeftBtnClick() {
         this.moveToLeft();
      },
      handleRightBtnClick() {
         this.moveToRight();
      },
      dotMove() {
         const len = this.dotList.length;
         this.dotList.forEach((dot) => (dot.isActive = false));
         if (this.currDotPosi >= len) this.currDotPosi = 0;
         else if (this.currDotPosi < 0) this.currDotPosi = len - 2;
         this.dotList[this.currDotPosi].isActive = true;
      },
      handleDotEnter(e) {
         // console.log( 'dot enter' );
         const index = e.target.getAttribute("index");
         const midIndexPosi = this.classList.indexOf("list-item2");
         let diff =
            Math.max(index, midIndexPosi) - Math.min(index, midIndexPosi);
         if (index > midIndexPosi) {
            while (diff--) {
               this.moveToRight();
            }
         } else {
            while (diff--) {
               this.moveToLeft();
            }
         }
      },
      handleImgClick(e) {
         // console.log(e.target.classList.value);
         this.$nextTick(() => {
            const imgGrandFather = e.target.parentNode.parentNode;
            const classVal = imgGrandFather.classList.value;
            if (classVal.includes("list-item3")) this.moveToRight();
            else if (classVal.includes("list-item1")) this.moveToLeft();
         });
      },
      moveToRight() {
         let list = this.classList,
            len = list.length;
         const _img = this.musicItems;
         list.unshift(list[len - 1]);
         list.pop();
         for (let i = 0; i < len; i++) {
            _img[i].currClass = list[i];
         }
         this.currDotPosi++;
         this.dotMove();
      },
      moveToLeft() {
         const list = this.classList,
            imgs = this.musicItems,
            len = list.length;
         list.push(this.classList[0]);
         list.shift();
         for (var i = 0; i < len; i++) {
            imgs[i].currClass = list[i];
         }
         this.currDotPosi--;
         this.dotMove();
      },
      generateArr(start, end, number = false) {
         const _arr = Array.from(new Array(end + 1).keys()).slice(start);
         return number
            ? _arr
            : _arr.map((item, index) => {
                 return index <= 2 ? `list-item${index + 1}` : "list-back";
              });
      },
      initTimer(delay) {
         this.moveTimer = setInterval(() => {
            this.moveToRight();
         }, delay);
      },
      getHiddenProp() {
         let prefixes = ["webkit", "moz", "ms", "o"];

         if ("hidden" in document) return "hidden";

         return prefixes.some((prefix) => prefix + "Hidden" in document);
      },
      isHidden() {
         const prop = this.getHiddenProp();
         if (!prop) return false;

         return document[prop];
      },
      handleTabsChange() {
         const isProp = this.getHiddenProp();
         if (isProp) {
            const title = document.title;
            const evtname =
               isProp.replace(/[H|h]idden/, "") + "visibilitychange";
            document.addEventListener(evtname, (e) => {
               if (this.isHidden()) {
                  clearInterval(this.moveTimer);
                  document.title = "你快回来~~";
               } else {
                  if (this.moveTimer) clearInterval(this.moveTimer);
                  this.initTimer(this.delay);
                  document.title = title;
               }
            });
         }
      },
      handleBannerClick(e) {
         const parent = e.target.parentNode.parentNode;
         const id = parent.getAttribute("data-id");
         // const index = parent.getAttribute("index");
         const zIndex = getComputedStyle(parent).zIndex;
         if (+zIndex === 2) {
            this.playCurrMusic(+id);
         }
      },
      async playCurrMusic(id) {
         const result = await this.$request("/song/detail", {
            ids: id,
         });
         this.$store.commit("udpateBannerData", result.data.songs[0]);
      },
   },
};
</script>

<style scope>
.carousel {
   position: relative;
   height: 220px;
   margin: auto;
   user-select: none;
   width: 100%;
   box-sizing: border-box;
}
.img-container {
   position: relative;
   width: 58%;
   height: 100%;
   left: 50%;
   transform: translateX(-50%);
   padding-bottom: 20px;
}

.imgLi {
   position: absolute;
   width: 100%;
   height: 100%;
   transition-duration: 0.8s;
}

.imgWrap {
   /* position: relative; */
   width: 100%;
   height: 100%;
}

.imgWrap img {
   width: 100%;
   border-radius: 10px;
   height: 100%;
   /* object-fit: cover; */
}
/* #4a79cc */
.bannerTitle {
   position: absolute;
   right: 0;
   bottom: 0;
   background: #cc4a4a;
   color: white;
   padding: 1px 8px 2px 8px;
   border-radius: 10px 0 10px 0;
}
.bannerTitle span {
   font-size: 0.5rem;
}

.list-item1 {
   transform: translate(-42%, 0px) scale(0.8);
   z-index: 1;
}
.carousel .list-item2 {
   z-index: 2;
   cursor: pointer;
}
.list-item3 {
   transform: translate(42%, 0px) scale(0.8);
   z-index: 1;
}

.list-back {
   transform: scale(0.6);
   z-index: 0;
}

.dot-wrap {
   position: absolute;
   border-radius: 10px;
   /* padding: 5px 5px; */
   margin: 15px 0px;
   /* bottom: 20px; */
   left: 50%;
   /* width: 50%; */
   transform: translateX(-50%);
}

.dot {
   background-color: rgba(0, 0, 0, 0.1);
   float: left;
   width: 6px;
   height: 6px;
   border-radius: 50%;
   margin-right: 10px;
}

.dot.active {
   background-color: #ec4141;
}

.dot li:last-child {
   margin-right: 0;
}

.switch-dot {
   position: absolute;
   transition: opacity 0.4s;
   background-color: rgba(0, 0, 0, 3);
   display: table-cell;
   text-align: center;
   height: 25px;
   width: 25px;
   border-radius: 50%;
   color: #fff;
   cursor: pointer;
   opacity: 0.2;
   line-height: 28px;
   top: 50%;
   transform: translateY(-50%);
}

.switch-dot:hover {
   opacity: 0.7;
}

.switch-dot i {
   vertical-align: baseline;
}

.left-0 {
   left: 5%;
}

.right-0 {
   right: 5%;
}

.music-descri {
   position: absolute;
   bottom: 20px;
   right: 20px;
   display: inline-block;
   color: #fff;
   border-radius: 10px;
   padding: 15px 8px;
   background-color: rgba(0, 0, 0, 0.2);
   -webkit-text-shadow: 1px -1px 10px rgb(0 0 0 / 50%);
   text-shadow: 1px -1px 10px rgb(0 0 0 / 50%);
   opacity: 0;
   visibility: hidden;
   font-family: "Courier New", Courier, monospace;
}

.list-item2 .music-descri {
   visibility: visible;
   transition: opacity 0.3s;
   opacity: 0.1;
}

.descri-top {
   display: block;
   text-align: right;
   font-size: 18px;
   letter-spacing: 2px;
   font-weight: 300;
}

.descri-bottom {
   display: block;
   text-align: right;
   font-size: 10px;
   font-weight: 300;
}
</style>