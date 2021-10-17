<template>
   <div class="headerBar">

      <div class="left">
         <router-link to="/index">
            <img src="~assets/img/logo.png"
                 alt="" />
         </router-link>
      </div>

      <div class="center">
         <div class="buttons">
            <i class="el-icon-arrow-left"
               @click="goBack"
               :class="{active: canGoBack}"></i>
            <i class="el-icon-arrow-right"
               :class="{active: canForward}"
               @click="goForward"></i>
         </div>
         <div class="search">
            <el-popover placement="bottom"
                        width="320"
                        v-model="isSearchPopShow"
                        popper-class="searchPop"
                        trigger="focus">
               <el-input :placeholder="placeholder"
                         prefix-icon="el-icon-search"
                         size="mini"
                         slot="reference"
                         @focus="handlePlaceholderFoucs"
                         @blur="handlePlaceholderBlur"
                         @input="inputSearch"
                         @keyup.enter.native="onSubmit"
                         v-model="searchInput">
               </el-input>
               <!-- 搜索历史不想做了，做的话可以将搜索历史存到localstorage中 -->
               <!-- 热搜榜 -->
               <div class="hotSearch"
                    v-if="!searchSuggestList.songs">
                  <div class="hotSearchTitle">热搜榜</div>
                  <div class="hotSearchItem"
                       v-for="(item, index) in hotSearchList"
                       :key="index"
                       @click="clickHotSearchItem(item.searchWord)">
                     <div class="hotSearchIndex"
                          :class="index < 3 ? 'topThree' : ''">
                        {{ index + 1 }}
                     </div>
                     <div class="hotSearchInfo">
                        <div class="hotSearchWord"
                             :class="index < 3 ? 'hotSearchWordTopThree' : ''">
                           {{ item.searchWord }}
                        </div>
                        <div class="hotSearchContent">{{ item.content }}</div>
                     </div>
                  </div>
               </div>
               <!-- 搜索建议 -->
               <div class="searchSuggest">
                  <div class="hotSearchTitle"
                       v-if="searchSuggestList.songs">
                     搜索建议
                  </div>
                  <!-- 单曲 -->
                  <div class="searchSuggestItem"
                       v-if="
                searchSuggestList.songs && searchSuggestList.songs.length != 0
              ">
                     <div class="searchSuggestItemTitle">
                        <i class="iconfont icon-yinle"></i> 单曲
                     </div>
                     <div class="suggestItemDetail"
                          v-for="(item, index) in searchSuggestList.songs"
                          :key="index"
                          @click="clickSuggestSong(item.id)">
                        {{ item.name + " - " + item.artists[0].name }}
                     </div>
                  </div>
                  <!-- 歌手 -->
                  <div class="searchSuggestItem"
                       v-if="
                searchSuggestList.artists &&
                searchSuggestList.artists.length != 0
              ">
                     <div class="searchSuggestItemTitle">
                        <i class="iconfont icon-mic"></i> 歌手
                     </div>
                     <div class="suggestItemDetail"
                          v-for="(item, index) in searchSuggestList.artists"
                          :key="index"
                          @click="clickSuggestSinger(item.id)">
                        {{ item.name }}
                     </div>
                  </div>
                  <!-- 专辑 -->
                  <div class="searchSuggestItem"
                       v-if="
                searchSuggestList.albums && searchSuggestList.albums.length != 0
              ">
                     <div class="searchSuggestItemTitle">
                        <i class="iconfont icon-more"></i> 专辑
                     </div>
                     <div class="suggestItemDetail"
                          v-for="(item, index) in searchSuggestList.albums"
                          :key="index"
                          @click="clickSuggestAlbum(item.id)">
                        {{ item.name + " - " + item.artist.name }}
                     </div>
                  </div>
                  <!-- 歌单 -->
                  <div class="searchSuggestItem"
                       v-if="
                        searchSuggestList.playlists &&
                        searchSuggestList.playlists.length != 0
                  ">
                     <div class="searchSuggestItemTitle">
                        <i class="iconfont icon-gedan"></i> 歌单
                     </div>
                     <div class="suggestItemDetail"
                          v-for="(item, index) in searchSuggestList.playlists"
                          :key="index"
                          @click="clickSuggestMusicList(item.id)">
                        {{ item.name }}
                     </div>
                  </div>
               </div>
               <!-- <img src="~assets/img/searh.png" alt="" /> -->
            </el-popover>
         </div>
      </div>

      <div class="right">
         <div class="user">
            <div class="avatar">
               <!-- 登录框  登陆前-->
               <el-popover placement="bottom"
                           width="330"
                           trigger="click"
                           :tabindex="0"
                           v-if="!$store.state.isLogin">
                  <!-- 手机号密码登录 -->
                  <el-form v-show="isPassLogin"
                           ref="form"
                           v-model="loginForm"
                           label-width="80px"
                           label-position="right"
                           size="mini">
                     <el-form-item label="手机号码："
                                   size="mini"
                                   label-width="100px"
                                   required>
                        <input type="text"
                               v-model="loginForm.phoneNum">
                     </el-form-item>
                     <el-form-item label="密码："
                                   size="mini"
                                   label-width="100px"
                                   required>
                        <input type="password"
                               v-model="loginForm.password"
                               @keypress="handlePw" />
                     </el-form-item>
                     <div class="loginButton">
                        <el-button type="danger"
                                   @click="login"
                                   size="mini">登录</el-button>
                     </div>
                     <!-- <div class="regEnter"
                          @click="handleQRLogin">二维码登录</div> -->
                     <div class="regEnter"
                          @click="(isCaptchaLogin = true, isQRLogin = false, isPassLogin = false)">验证码登录</div>
                  </el-form>

                  <!-- 二维码登录 -->
                  <!-- <div v-show="isQRLogin">
                     <div>
                        <i class="el-icon-back"></i><span class="back-to-phone"
                              @click="(isQRLogin = false, isPassLogin = true)">手机号登陆</span>
                     </div>
                     <qriously :value="QRLink"
                               :size="150" />
                     <span>{{ scanMessage }}</span>
                  </div> -->

                  <!-- 验证码登录 -->
                  <div v-show="isCaptchaLogin">
                     <el-form ref="form"
                              v-model="loginForm"
                              label-width="80px"
                              label-position="right"
                              size="mini">
                        <el-form-item label="手机号码："
                                      size="mini"
                                      label-width="100px"
                                      required>
                           <input type="text"
                                  v-model="captchaForm.phone"
                                  @input="handlePhoneNumInput">
                        </el-form-item>
                        <el-form-item label="验证码："
                                      size="mini"
                                      label-width="100px"
                                      required>
                           <input type="text"
                                  v-model="captchaForm.captcha"
                                  style="width: 40%; margin-right: 10px" />
                           <el-button type="danger"
                                      size="mini"
                                      style="width: max-content"
                                      @click="sendCaptcha"
                                      :disabled="isSendDisable">{{ sendBtnMsg }}</el-button>
                        </el-form-item>
                        <div class="loginButton">
                           <el-button type="danger"
                                      @click="handleCaptchaLogin"
                                      size="mini">登录</el-button>
                        </div>
                        <!-- <div class="regEnter"
                             @click="handleQRLogin">二维码登录</div> -->
                        <div class="regEnter"
                             @click="(isCaptchaLogin = false, isQRLogin = false, isPassLogin = true)">手机密码登录</div>
                     </el-form>
                  </div>
                  <img src="~assets/img/test.jpg"
                       alt=""
                       slot="reference" />
               </el-popover>

               <!-- 登陆后 -->
               <el-popover placement="bottom"
                           width="150"
                           trigger="hover"
                           :tabindex="1"
                           v-else>
                  <el-button size="default"
                             @click="logout">退出登录</el-button>

                  <img v-if="userInfo && userInfo.avatarUrl"
                       :src="userInfo.avatarUrl"
                       alt=""
                       slot="reference"
                       @click="goToPersonal" />
               </el-popover>

            </div>

            <div class="userName"
                 v-if="!$store.state.isLogin">
               点击头像登录
            </div>
            <div class="userName"
                 v-else>
               {{ userInfo && userInfo.nickname }}
            </div>
         </div>
      </div>
      <!-- <registered :isDialogShow="isRegisteredShow"
                  @closeRegistered="closeRegistered"></registered> -->
   </div>
</template>

<script>
import { handleMusicTime } from "@/utils/formateTime";
// import Registered from "components/registered/Registered.vue";
// 节流定时器名称
let timer;

export default {
   // components: { Registered },
   name: "HeaderBar",
   inject: ["reload"],
   data() {
      return {
         loginForm: {
            password: "",
            phoneNum: "",
         },
         captchaForm: {
            phone: "",
            captcha: "",
         },
         userInfo: {},
         isPopoverShow: false,
         // 是否显示searchPop
         isSearchPopShow: false,
         // 热搜列表数据
         hotSearchList: [],
         // 需要搜索的内容
         searchInput: "",
         // 搜索建议列表
         searchSuggestList: {},
         // 是否显示注册框
         isRegisteredShow: false,
         placeholder: "搜索",
         isForwartBtnClick: false,
         canGoBack: true,
         backCount: 0,
         canForward: true,
         forwordCount: 0,
         routesCount: 0,
         currRouteIndex: 0,
         historyList: [],
         isPassLogin: true,
         isQRLogin: false,
         QRLink: "",
         QRcodeTimer: 0,
         scanMessage: "",
         isCaptchaLogin: false,
         isSendDisable: false,
         sendBtnMsg: "发送验证码",
         captchaTimer: 0,
      };
   },
   computed: {},
   created() {
      this.getHotSearch();
      // 从localstorage中读取userInfo
      if (window.localStorage.getItem("userId")) {
         this.$request("/login/refresh").then((res) => {
            console.log(res);
         });

         // 进入这里表示已经登录，更新登录状态到vuex
         this.$store.commit("updataLoginState", true);
         // 从localStorage中取userinfo
         this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
         console.log("header user info: ", this.userInfo);
      }
      this.$request("/user/subcount", {
         timestamp: Date.now(),
      }).then(res => {
         console.log("info: ", res);
      });
      // this.getCurrentUserInfo();
   },
   updated() {},
   methods: {
      handlePlaceholderFoucs() {
         this.placeholder = "";
      },
      handlePlaceholderBlur() {
         this.placeholder = "搜索";
      },
      //   请求
      // 手机前端验证正则表达式
      // let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;

      //   手机登录请求
      async loginByCellphone() {
         let timestamp = Date.now();
         let result = await this.$request("/login/cellphone", {
            phone: this.loginForm.phoneNum.trim(),
            password: this.loginForm.password.trim(),
            withCredentials: true,
            timestamp,
         });
         // console.log(result);
         // 登录成功
         if (result.data.code == 200) {
            // 将请求到的用户id存入localstorage
            window.localStorage.setItem("userId", result.data.profile.userId);
            this.userInfo = result.data.profile;
            window.localStorage.setItem(
               "userInfo",
               JSON.stringify(this.userInfo)
            );
            // 修改vuex中的登录状态
            this.$store.commit("updataLoginState", true);
            this.$message.success("登录成功!");

            // 刷新页面
            // this.$router.go(0);
            // this.$store.commit("updateCurrentUserId", result.data.profile.userId);
         } else if (result.data.code == 400) {
            // 手机号错误
            this.$message.error("手机号错误!");
            return;
         } else if (result.data.code == 502) {
            // 密码错误
            this.$message.error("密码错误!");
            return;
         } else {
            // 登录失败，请稍后重试
            this.$message.error("登录失败，请稍后重试!");
            return;
         }

         // 清空输入框的内容
         this.loginForm.password = "";
         this.loginForm.phoneNum = "";
      },
      // 获取热搜列表
      async getHotSearch() {
         let res = await this.$request("/search/hot/detail");
         // console.log(res);
         this.hotSearchList = res.data.data;
      },
      // 获取搜索建议
      async getSearchSuggest(keywords) {
         let res = await this.$request("/search/suggest", { keywords });
         console.log(res);
         this.searchSuggestList = res.data.result;
      },
      // 根据id获取歌曲详情
      async getMusicInfo(ids) {
         let res = await this.$request("/song/detail", { ids });
         console.log(res);
         // 处理时间
         res.data.songs[0].dt = handleMusicTime(res.data.songs[0].dt);
         return res.data.songs[0];
      },
      // 获取当前用户信息
      async getCurrentUserInfo() {
         var timestamp = Date.now();
         let res = await this.$request("/user/account", {
            timestamp,
         });
         console.log("getUserInfo result: ", res);
         if (res.data.profile != null) {
            this.userInfo = res.data.profile;
            // 更新登录状态
            this.$store.commit("updataLoginState", true);
            // 更新当前用户id
            // this.$store.commit("updateCurrentUserId", res.data.profile.userId);
            // 将请求到的用户id存入localstorage
            window.localStorage.setItem("userId", res.data.profile.userId);
         } else {
            // 未登录
            this.$store.commit("updataLoginState", false);
            // 如果localstorage存有userId就清除
            if (window.localStorage.getItem("userId")) {
               window.localStorage.removeItem("userId");
            }
         }
      },

      // 事件
      // 点击登录按钮的回调
      login() {
         // console.log("提交表单");
         //   console.log(this.loginForm);
         this.loginByCellphone();
         // this.getCurrentUserInfo();
      },

      // 点击退出登录的回调
      async logout() {
         let res = await this.$request("/logout");
         console.log(res);

         if (res.data.code != 200) {
            this.$message("退出登录失败, 请稍后重试!");
            return;
         }

         // 清空data和localstorage中的数据，以及cookie
         this.userInfo = {};
         window.localStorage.setItem("userInfo", "");
         window.localStorage.removeItem("userId");
         this.clearAllCookie();
         //   在vuex中更新登录状态
         this.$store.commit("updataLoginState", false);
         this.$store.commit("updateRecomment", true);
         this.$message.success("退出成功!");
         // 刷新页面
         //   this.$router.go(0);
      },

      //清除所有cookie函数
      clearAllCookie() {
         var date = new Date();
         date.setTime(date.getTime() - 10000);
         var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
         // console.log("需要删除的cookie名字：" + keys);
         if (keys) {
            for (var i = keys.length; i--; )
               document.cookie = keys[i] + "=0; expire=-1; path=/";
         }
      },

      // 点击前进按钮的回调
      goForward() {
         // if (this.forwordCount <= 0) return false;
         this.forwordCount++;
         // this.backCount--;
         this.$router.go(1);
      },
      // 点击后退按钮的回调
      goBack() {
         // if (this.backCount <= 0) return false;
         this.backCount++;
         // this.forwordCount--;
         this.$router.go(-1);
      },

      // 在搜索框中输入的回调
      inputSearch(e) {
         // console.log(e);
         clearTimeout(timer);
         if (e != "") {
            timer = setTimeout(() => {
               this.getSearchSuggest(e);
            }, 500);
         } else {
            // 清空searchSuggestList
            this.searchSuggestList = {};
            return;
         }
      },
      // 在输入框按下回车的回调
      onSubmit(e) {
         if (e.keyCode == 13 && this.searchInput != "") {
            this.goSearch();
         }
      },
      // 跳转至搜索详情页面
      goSearch() {
         this.isSearchPopShow = false;
         this.$router.push({
            name: "search",
            params: { id: this.searchInput },
         });
      },
      // 点击热搜榜item的回调
      clickHotSearchItem(searchWord) {
         this.searchInput = searchWord;
         this.goSearch();
      },
      // 点击搜索建议中专辑的回调
      clickSuggestAlbum(id) {
         this.$router.push({ name: "album", params: { id } });
         this.isSearchPopShow = false;
      },
      // 点击搜索建议中歌手的回调
      clickSuggestSinger(id) {
         this.$router.push({ name: "singerDetail", params: { id } });
         this.isSearchPopShow = false;
      },
      // 点击搜索建议中歌单的回调
      clickSuggestMusicList(id) {
         this.$router.push({ name: "musicListDetail", params: { id } });
         this.isSearchPopShow = false;
      },
      // 点击搜索建议中单曲的回调
      async clickSuggestSong(id) {
         let row = await this.getMusicInfo(id);
         this.isSearchPopShow = false;
         // 首先获取当前的歌单列表和歌曲索引
         let musicList = this.$store.state.musicList;
         let currentIndex = this.$store.state.currentIndex;
         // 先判断该歌曲是否已经在歌单中存在，避免重复点击导致歌单出现相同歌曲
         let isExist = musicList.find((item) => item.id == row.id);
         if (isExist) {
            // 如果已经存在 则只提交歌曲id并return出去
            this.$store.commit("updateMusicId", row.id);
            return;
         }
         this.$store.commit("changePlayState", false);
         // 将请求到的歌曲详情插入到歌单对应位置并提交至vuex
         musicList.splice(currentIndex + 1, 0, row);
         this.$store.commit("updateMusicId", row.id);
         this.$store.commit("updateMusicList", {
            musicList,
            musicListId: this.$store.state.musicListId,
         });
      },

      // 关闭注册框
      closeRegistered() {
         this.isRegisteredShow = false;
      },

      goToPersonal() {
         if (this.$route.path != `/personal/${this.userInfo.userId}`)
            this.$router.push({
               name: "personal",
               params: { uid: this.userInfo.userId },
            });
         // console.log(this.$route);
      },
      handlePw(e) {
         if (["Enter", "NumpadEnter"].includes(e.code)) this.login();
      },

      handlePhoneNumInput(e) {
         const reg = /[0-9]/;
         if (!reg.test(e.data)) return false;
      },
      sendCaptcha() {
         let minutes = 60;
         let interupt = false;
         this.$request("/captcha/sent", {
            phone: this.captchaForm.phone,
         });
         console.log(this.captchaForm.phone);
         this.isSendDisable = true;
         this.captchaTimer = setInterval(() => {
            if (minutes >= 0) {
               this.sendBtnMsg = minutes-- + "s后再发送";
            } else {
               clearInterval(this.captchaTimer);
               this.isSendDisable = false;
               this.sendBtnMsg = "发送验证码";
            }
         }, 1000);
      },
      async handleCaptchaLogin() {
         const result = await this.$request("/captcha/verify", {
            ...this.captchaForm,
         });
         console.log("captcha result: ", result);
         if (result.data.data === true) {
            const loginRes = await this.$request("/login/cellphone", {
               ...this.captchaForm,
            });
            clearInterval(this.captchaTimer);
            console.log("captcha login res:", loginRes);
            const profile = loginRes.data.profile;
            if (profile != null) {
               localStorage.setItem("userId", profile.userId);
               this.userInfo = profile;
               localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
               this.$message.success("登录成功!");
               // 刷新页面
               // this.$router.go(0);
               // 修改vuex中的登录状态
               this.$store.commit("updataLoginState", true);
            }
         } else {
            this.$message.error("验证码错误");
         }
      },
      /**
       *    1. key
       *       /login/qr/key
       *    2. url
       *       /login/qr/create?key=xxx
       *    3. check status
       *       /login/qr/check?key=xxx
       *       status:
       *          800 过期 -> 刷新图标显现
       *          801 等待扫码 -> 无操作
       *          802 待确认 -> 等待确认提示显现
       *          803 授权登录成功, 返回 cookies -> 获取 cookies -> 登录(getCurrentUserInfo)
       *
       */
      // async handleQRLogin() {
      //    this.isQRLogin = true;
      //    this.isPassLogin = false;
      //    this.isCaptchaLogin = false;
      //    const keyRes = await this.$request("/login/qr/key", {
      //       timestamp: Date.now(),
      //    });
      //    if (keyRes.data.code == 200) {
      //       const key = keyRes.data.data.unikey;
      //       const urlRes = await this.$request("/login/qr/create", {
      //          key,
      //          timestamp: Date.now(),
      //       });
      //       if (urlRes.data.code == 200) {
      //          this.QRLink = urlRes.data.data.qrurl;

      //          this.QRcodeTimer = setInterval(async () => {
      //             const { data } = await this.$request("/login/qr/check", {
      //                key,
      //                timestamp: Date.now(),
      //             });
      //             // console.log("status data", data);
      //             switch (data.code) {
      //                case 800:
      //                   break;
      //                case 801:
      //                   break;
      //                case 802:
      //                   this.scanMessage = data.message;
      //                   // console.log(data.message);
      //                   break;
      //                case 803:
      //                   this.scanMessage = data.message;
      //                   this.setUserCookie(data.cookie);
      //                   // this.getCurrentUserInfo();
      //                   clearInterval(this.QRcodeTimer);
      //                   break;
      //             }
      //          }, 1000);
      //       }
      //    }
      // },
      // async refreshQRcode() {},
      // setUserCookie(cookiesStr) {
      //    const cookieArr = cookiesStr.split(";");
      //    const subKeys = ["Max-Age", "Expires", "Path", "HttpOnly"];

      //    cookieArr.forEach((item, index) => {
      //       const options = {};
      //       if (index % 5 === 0) {
      //          subKeys.forEach((subItem, i) => {
      //             const value = cookieArr[index + i + 1].trimLeft().split("=");
      //             if (subItem == "HttpOnly") {
      //                if (value[0]) {
      //                   options[subItem] = true;
      //                } else return;
      //             } else {
      //                options[subItem] = value[1];
      //             }
      //          });
      //          const entry = item.split("=");
      //          console.log(options);
      //          this.$cookie.set(entry[0], entry[1], options);
      //       }
      //    });
      // },
   },
   watch: {
      "$store.state.isLogin"(current) {
         // 如果退出登录后数据还没清空，则清空数据
         if (!current && this.userInfo.nickname) {
            this.userInfo = {};
         }
      },
      // "loginForm.password"(val) {
      //    console.log(val);
      // },
      // $route(to, from) {
      //    const { fullPath, meta } = to;
      //    let _index;
         // if (fullPath !== from.fullPath && to.meta.host === from.meta.host) {
         //    // 倘若当前路由已经存在, 从历史记录中删除,
         //    if ((_index = this.historyList.indexOf(fullPath) !== -1)){
         //       this.historyList.splice(_index, 1);
         //       this.currRouteIndex--;
         //    }
         //    this.historyList.push(fullPath);
         // }
      // },
      // currRouteIndex(index) {
      //    if (this.historyList.length > 0) {
            // switch (true) {
            //    case index:
            //       break;
            //    default:
            //       break;
            // }
         // }
      // },
   },
};
</script>

<style scoped>
@import "./HeaderBar-element.css";
.headerBar {
   display: flex;
   align-items: center;
   width: 100%;
   height: 100%;
   position: relative;
   z-index: 30000;
}

.left {
   width: 120px;
   margin: 0 100px 0 40px;
}

.left img {
   width: 100%;
   transform: scale(1.3);
}

.center {
   display: flex;
   align-items: center;
}

.buttons {
   color: rgb(226, 106, 106);
}

.buttons i {
   background-color: rgba(0, 0, 0, 0.1);
   font-size: 6px;
   padding: 6px;
   border-radius: 50%;
   margin: 0 6px;
}

.buttons i.active {
   color: rgb(242, 185, 185);
}

.right {
   display: flex;
   position: absolute;
   right: 50px;
   top: 0;
   line-height: 65px;
}

.user {
   display: flex;
   align-items: center;
}

.avatar {
   width: 35px;
   height: 35px;

   /* overflow: hidden; */
   margin-right: 7px;
   cursor: pointer;
}

.avatar img {
   width: 100%;
   height: 100%;
   border-radius: 50%;
}

.userName {
   font-size: 13px;
   color: rgba(255, 255, 255, 0.85);
   width: max-content;
}

.loginButton {
   width: 100%;
   text-align: center;
}

.loginButton .el-button {
   width: 200px;
}

.el-form /deep/ .el-form-item__label {
   font-size: 13px !important;
}

.hotSearchTitle {
   font-size: 13px;
   margin: 10px 0 5px 20px;
}

.hotSearchItem {
   display: flex;
   align-items: center;
   padding: 6.5px 15px;
   cursor: pointer;
}

.hotSearchItem:hover {
   background-color: #f2f2f2;
}

.hotSearchIndex {
   margin-right: 15px;
   color: #c4c4c4;
}

.topThree {
   color: #e13e3e;
}

.hotSearchWord {
   font-size: 12px;
   color: rgb(51, 51, 51);
}

.hotSearchWordTopThree {
   font-weight: 600;
   color: black;
}

.hotSearchContent {
   font-size: 12px;
   color: #929292;
   transform: scale(0.9) translateX(-5%);
}

.searchSuggest {
   font-size: 12px;
}

.searchSuggestItemTitle {
   background-color: #f5f5f7;
   padding: 4px 8px;
}

.searchSuggestItemTitle i {
   font-size: 15px;
}

.searchSuggestItem {
   cursor: pointer;
}

.suggestItemDetail {
   padding: 4px 27px;
   font-size: 12px;
}

.suggestItemDetail:hover {
   background-color: #f2f2f2;
}

.regEnter {
   /* width: 100%; */
   text-align: center;
   margin-top: 10px;
   font-size: 12px;
   text-decoration: underline;
   cursor: pointer;
   /* display: inline-block; */
   float: right;
   margin: 10px 10px 5px 10px;
}
.back-to-phone:hover {
   text-decoration: underline;
   cursor: pointer;
}
</style>