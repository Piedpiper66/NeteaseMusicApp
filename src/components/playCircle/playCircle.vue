<template>
   <div ref="playCircle"
        class="play-circle"
        :class="{
         'transition': transition === true, 
         'center': position.trim() === 'center',
         'right-bottom': position.trim() === 'right-bottom',
         'left-bottom': position.trim() === 'left-bottom',
         'left-top': position.trim() === 'left-top',
         'right-top': position.trim() === 'right-top',
         'normal': size.trim() === 'normal',
         'bigger': size.trim() === 'bigger'
      }">
      <i class="iconfont icon-icon_play"></i>
   </div>
</template>

<script>
export default {
   name: "play-circle",
   props: {
      transition: {
         type: Boolean,
         default: false,
      },
      position: {
         type: String,
         default: "right-bottom",
      },
      opacity: {
         type: Number,
         default: 0.8,
      },
      size: {
         type: String,
         default: "normal",
      },
   },
   data() {
      return {
         normalIconSize: "1rem",
         biggerIconSize: "1.25rem",
      };
   },
   mounted() {
      const circleStyle = this.$refs.playCircle.style;
      circleStyle.setProperty("--opacity", this.opacity);
      circleStyle.setProperty(
         "--iconSize",
         this.size === "bigger" ? this.biggerIconSize : this.normalIconSize
      );
   },
};
</script>

<style scoped>
.play-circle {
   --posi: 6%;
   --opacity: 0.8;
   --iconSize: 1rem;
   position: absolute;
   background-color: rgba(255, 255, 255, var(--opacity));
   opacity: 0;
   border-radius: 50%;
   display: flex;
   justify-content: center;
   align-items: center;
}

.normal {
   width: 16%;
   height: 16%;
}

.bigger {
   width: 20%;
   height: 20%;
}

.center {
   left: 50%;
   top: 50%;
   transform: translate(-50%, -50%);
}

.right-bottom {
   right: var(--posi);
   bottom: var(--posi);
}

.right-top {
   right: var(--posi);
   top: var(--posi);
}

.left-top {
   left: var(--posi);
   top: var(--posi);
}

.left-bottom {
   left: var(--posi);
   bottom: var(--posi);
}

.play-circle.transition {
   transition: opacity 0.6s ease-in-out;
}

.play-circle i {
   color: #ec4141;
   font-size: var(--iconSize);
}
</style>