//被多个组件共享的数据
import {playMode} from 'common/js/config'
import {loadSearch,loadPlay,loadFavorite} from 'common/js/cache'

const state = {
  singer:{},
  playing:false,//播放状态
  fullScreen:false,//是否展开播放器
  playlist:[],//播放列表
  sequenceList:[],//顺序列表
  mode:playMode.sequence,//播放模式
  currentIndex:-1,//当前播放歌曲的索引  
  disc:{},
  topList:{},
  searchHistory:loadSearch(),//搜索历史
  playHistory: loadPlay(), //播放历史
  favoriteList: loadFavorite()//收藏列表
}

export default state
