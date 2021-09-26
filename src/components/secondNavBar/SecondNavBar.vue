<template>
   <div class="navBar">
      <!-- 如果传入的宽度是0则不设置宽度，宽度自适应 -->
      <div class="barItem"
           :class="index == activeNum ? 'active' : ''"
           v-for="(item, index) in SecondNavBarData"
           :key="index"
           @click="clickSecondBarItem(index)"
           :style="itemWidth == 0 ? '' : 'width:' + itemWidth + 'px;'">
         <span>{{ item.name }}</span>
      </div>
   </div>
</template>

<script>
export default {
   name: "SecondNavBar",
   data() {
      return {
         activeNum: 0,
      };
   },
   props: {
      SecondNavBarData: {
         type: Array,
         default() {
            return [];
         },
      },
      itemWidth: {
         type: Number,
         default() {
            return 40;
         },
      },
      currentTag: {
         type: Object,
         default() {
            return {};
         },
      },
   },
   methods: {
      clickSecondBarItem(index) {
         if (this.activeNum == index) {
            return;
         }

         this.activeNum = index;
         // 将点击事件发射出去 供使用改组件接收事件使用
         this.$emit("clickSecondBarItem", index);
      },
   },
   watch: {
      currentTag(current) {
         this.activeNum = this.SecondNavBarData.findIndex(
            (item) => item.name == current.name
         );
      },
   },
};
</script>

<style scoped>
.navBar {
   display: flex;
   flex-wrap: wrap;
}

.barItem {
   padding: 3px 5px;
   margin: 5px;
   font-size: 13px;
   text-align: center;
   box-sizing: content-box;
   cursor: pointer;
}

.barItem:not(:last-of-type) {
   border-right: 2px solid #f2f2f2;
}

.active {
   background-color: #fdf5f5;
   color: #ec4747;
   border-radius: 11px;
   /* padding: 2px; */
   /* margin-bottom: 4px; */
}
</style>