<template>
	<transition name="list-fade">
		<div class="playlist" v-show="showFlag" @click="hide">
			<div class="list-wrapper" @click.stop>
			<!-- click.stop停止冒泡，点击蒙层关闭，解决导致点击列表页关闭 -->
				<div class="list-header">
					<h1 class="title">
						<i class="icon" :class="iconMode" @click="changeMode"></i>
						<span class="text">{{modeText}}</span>
						<span class="clear" @click="showConfirm">
							<i class="icon-clear"></i>
						</span>
					</h1>
				</div>
				<scroll ref="listContent" :refreshDelay="refreshDelay" class="list-content" :data="sequenceList">
					<transition-group name='list' tag="ul">
						<li :key="item.id" ref="listItem" class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
							<i class="current" :class="getCurrentIcon(item)"></i>
							<span class="text">{{item.name}}</span>
							<span class="like" @click.stop="toggleFavorite(item)">
								<i class="icon" :class="getFavoriteIcon(item)"></i>
							</span>
							<span class="delete" @click.stop="deleteOne(item)">
								<i class="icon-delete"></i>
							</span>
						</li>
					</transition-group>
				</scroll> 
				<div class="list-operate">
					<div class="add" @click="addSong">
						<i class="icon-add"></i>
						<span class="text">添加歌曲到队列</span>
					</div>
				</div>
				<div class="list-close" @click="hide">
					<span>关闭</span>
				</div>
			</div>
            <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confimBtnText="清空"></confirm>
            <add-song ref="addSong"></add-song>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import {mapMutations,mapActions} from 'vuex'
	import Scroll from 'base/scroll/scroll'
	import {playMode} from 'common/js/config'
  import Confirm from 'base/confirm/confirm'
  import {playerMixin} from 'common/js/mixin'
  import AddSong from 'components/add-song/add-song'

	export default {
        mixins:[playerMixin],
		data() {
			return {
				showFlag:false,
                refreshDelay:100//动画渲染时间大于原本scroll组件的20秒刷新时间
			}
		},
		computed:{
			/*...mapGetters([
				'sequenceList',
				'currentSong',
				'mode',
				'playlist'
			])*/
            modeText() {
                return this.mode === playMode.sequence?'顺序播放':this.mode === playMode.random?'随机播放':'单曲循环'
            }
		},
		methods: {
			show() {
				this.showFlag = true
				//show的时候才会计算dom，scroll的高度还没有初始化
				setTimeout(()=>{
					this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
				},20)
			},
			hide() {
				this.showFlag = false
			},
			getCurrentIcon(item) {
				if(this.currentSong.id === item.id){
					return 'icon-play'
				}
				return ''
			},
			selectItem(item,index) {
			//如果是随机模式，需要去找那首歌的索引，再设置索引
				if(this.mode === playMode.random){
					index = this.playlist.findIndex((song)=>{
						return song.id === item.id
					})
				}
				this.setCurrentIndex(index)
                this.setPlayingState(true)
                this.scrollToCurrent(item)
			},
            deleteOne(item) {
                this.deleteSong(item)
                if(!this.playlist.length) {//没有播放列表，隐藏
                    this.hide()
                }
            },
            scrollToCurrent(current) {
                const index = this.sequenceList.findIndex((song)=>{
                    return song.id === current.id
                })
                this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            confirmClear() {
                this.deleteSonglist()
                this.hide()
            },
			/*...mapMutations({
				'setCurrentIndex':'SET_CURRENT_INDEX',
                'setPlayingState':'SET_PLAYING_STATE'
			}),*/
            addSong() {
                this.$refs.addSong.show()
            },
            ...mapActions([
                'deleteSong','deleteSonglist'
            ])
		},
        watch: {
            currentSong(newSong,oldSong) {
                if(!this.songFlag || newSong.id === oldSong.id){
                    return
                }
                this.scrollToCurrent(newSong)//歌曲切换成功就把这首歌滚动到最上面
            }
        },  
		components:{
			Scroll,
            Confirm,
            AddSong
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          // 删除时高度是从40变为0 
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s linear
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>