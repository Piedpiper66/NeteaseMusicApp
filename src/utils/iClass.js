export class MusicDetailBasic {
   constructor(musicDetail) {
      this.id = musicDetail.id;
      this.coverImgUrl = musicDetail.coverImgUrl;
      this.name = musicDetail.name;
      this.creator = musicDetail.creator;
      this.createTime = musicDetail.createTime;
      this.tags = musicDetail.tags;
      this.trackCount = musicDetail.trackCount;
      this.playCount = musicDetail.playCount;
      this.commentCount = musicDetail.commentCount;
      this.description = musicDetail.description;
      this.tracksLen = musicDetail.tracks?.length;
      this.trackIdsLen = musicDetail.trackIds?.length;
   }
}

export class Track {
   constructor(track) {
      this.id = track.id;
      this.name = track.name;
      this.ar = track.ar;
      this.al = track.al;
      this.dt = track.dt;
   }
}

// export default {
//    MusicDetailBasic,
//    Track
// }