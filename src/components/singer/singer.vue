<template>
	<div class="singer" ref="singer">
		<list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import {getSingerList}  from 'api/singer'
	import {ERR_OK} from 'api/config'
	import Singer from 'common/js/singer'
	import ListView from 'base/listview/listview'
  	import {mapMutations} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'

	const HOT_NAME = "热门"
	const HOT_SINGER_LEN = 10 //定义前10条为热门数据
	export default{
		mixins:[playlistMixin],
		data(){
			return {
				singers:[]
			}
		},
		components: {
	      	ListView
	   	},
		created(){
			this._getSingerList()
		},
		methods:{
			handlePlaylist(playlist){
		        const bottom = playlist.length>0?'60px':''
		        this.$refs.singer.style.bottom=bottom
		        this.$refs.list.refresh()//scroll重新计算
		    },
	      	selectSinger(singer){
	        	this.$router.push({
	          		path:`/singer/${singer.id}`
	        	})
	        	this.setSinger(singer)//实际上调用的是store的方法
	      	},
			_getSingerList(){
				getSingerList().then((res)=>{
					if(res.code === ERR_OK){
						this.singers = this._normalizeSinger(res.data.list)
					}
				})
			},
			_normalizeSinger(list){//规范分类数据
				let map = {
					hot:{
						title:HOT_NAME,
						items:[]
					}
				}
				list.forEach((item,index)=>{
					if(index < HOT_SINGER_LEN){
						map.hot.items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name
						}))
					}
					const key = item.Findex

					if(!map[key]){
						map[key] = {
							title:key,
							items:[]
						}
					}

					map[key].items.push(new Singer({
						id:item.Fsinger_mid,
						name:item.Fsinger_name
					}))
				})
				console.log(map)
				//对象的遍历是无序的,将map处理成有序列表
				let hot = []
				let ret = []

				for(let key in map){
					let val = map[key]
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val)
					}else if(val.title === HOT_NAME){
						hot.push(val)
					}
				}
				//按字母升序
				ret.sort((a,b)=>{
					//>0是true
					return a.title.charCodeAt(0)-b.title.charCodeAt(0)
				})
				console.log(hot.concat(ret))
				return hot.concat(ret)
			},
	      ...mapMutations({//映射setSinger，这样不用调用store.commit等复杂的操作
	        setSinger:'SET_SINGER'
	      })
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"

	.singer
		position:fixed
		top:88px
		bottom:0
		width:100%

</style>
