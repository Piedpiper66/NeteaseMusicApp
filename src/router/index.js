import Vue from 'vue';
import VueRouter from 'vue-router';

const Index = () => import('views/Index.vue');
const Discover = () => import('views/discover/Discover.vue');
const Records = () => import('views/records/Records');
const Recommend = () => import('views/discover/discoverChildren/Recommend.vue');
const Ranking = () => import('views/discover/discoverChildren/Ranking.vue');
const Album = () => import('views/album/Album.vue');
const Singer = () => import('views/discover/discoverChildren/Singer.vue');
const SingerDetail = () => import('views/singerDetail/SingerDetail.vue');
const Video = () => import('views/video/Video.vue');
const VideoList = () => import('views/video/videoChildren/VideoList.vue');
const MvList = () => import('views/video/videoChildren/MvList.vue');
const VideoDetail = () => import('views/videoDetail/VideoDetail.vue');
const MusicListDetail = () => import('views/musicListDetail/MusicListDetail.vue');
const MusicList = () => import('views/discover/discoverChildren/MusicList.vue');
const MusicListIndex = () => import('views/discover/discoverChildren/musicListChildren/MusicListIndex.vue');
const MusicListHighquality = () => import('views/discover/discoverChildren/musicListChildren/MusicListHighquality.vue');
const Personal = () => import('views/personal/Personal.vue');
const Follows = () => import('views/personal/personalChildren/Follows.vue');
const Followeds = () => import('views/personal/personalChildren/Followeds.vue');

const Search = () => import('views/search/Search.vue');
const SearchSong = () => import('views/search/searchChildren/SearchSong.vue');
const SearchSinger = () => import('views/search/searchChildren/SearchSinger.vue');
const SearchAlbum = () => import('views/search/searchChildren/SearchAlbum.vue');
const SearchVideo = () => import('views/search/searchChildren/SearchVideo.vue');
const SearchMusicList = () => import('views/search/searchChildren/SearchMusicList.vue');

Vue.use(VueRouter);

const routes = [
   { path: '/', redirect: '/index' },
   {
      path: '/index',
      component: Index,
      redirect: '/discover',
      children: [
         {
            path: '/discover',
            component: Discover,
            redirect: '/discover/recommend',
            children: [
               { path: '/discover/recommend', component: Recommend },
               {
                  path: '/discover/musiclist',
                  component: MusicList,
                  redirect: '/discover/musiclist/musiclistindex',
                  children: [
                     { path: '/discover/musiclist/musiclistindex', component: MusicListIndex },
                     { path: '/discover/musiclist/musiclisthighquality', component: MusicListHighquality },
                  ]
               },
               { path: '/discover/ranking', component: Ranking },
               { path: '/discover/singer', component: Singer },
            ]
         },
         { path: '/records', component: Records },
         {
            path: '/video', component: Video,
            redirect: '/video/videolist',
            children: [
               { path: '/video/videolist', component: VideoList },
               { path: '/video/mvlist', component: MvList },
            ]
         },
         { path: '/singerdetail/:id', name: 'singerDetail', component: SingerDetail },
         { path: '/album/:id', name: 'album', component: Album },
         { path: '/musiclistdetail/:id', name: 'musicListDetail', component: MusicListDetail },
         { path: '/personal/:uid', name: 'personal', component: Personal },
         { path: '/personal/follows/:uid', name: 'follows', component: Follows },
         { path: '/personal/followeds/:uid', name: 'followeds', component: Followeds },
         { path: '/videodetail/:id/:type', name: 'videoDetail', component: VideoDetail },
         {
            path: '/search/:id', name: 'search', component: Search,
            redirect: '/search/searchsong/:id',
            children: [
               { path: '/search/searchsong/:id', name: 'searchSong', component: SearchSong },
               { path: '/search/searchsinger/:id', name: 'searchSinger', component: SearchSinger },
               { path: '/search/searchalbum/:id', name: 'searchAlbum', component: SearchAlbum },
               { path: '/search/searchvideo/:id', name: 'searchVideo', component: SearchVideo },
               { path: '/search/searchmusiclist/:id', name: 'searchMusicList', component: SearchMusicList },
            ]
         },
      ]
   },
   { path: '*', redirect: '/index' }
];

const router = new VueRouter({
   mode: 'history',
   routes
});

router.beforeEach((to, from, next) => {
   to.meta.host = location.host;
   next();
})

export default router;
