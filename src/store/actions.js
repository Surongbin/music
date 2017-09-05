//如果一个动作中多次改变mutation,那么就可以封装action
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/cache'

function findIndex(list,song){
	return list.findIndex((item)=>{
		return item.id === song.id
	})
}

export const selectPlay = function({commit,state},{list,index}){
	commit(types.SET_SEQUENCE_LIST,list)
	if(state.mode === playMode.random){
		let randomlist = shuffle(list)
		commit(types.SET_PLAYLIST,randomlist)
		index = findIndex(randomlist,list[index])//顺序列表的歌在随机列表歌单中的索引
		commit(types.SET_CURRENT_INDEX,index)
	}else{
		commit(types.SET_PLAYLIST,list)
	}
	commit(types.SET_CURRENT_INDEX,index)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_PLAYING_STATE,true)
}
export const randomPlay = function({commit},{list}){
	commit(types.SET_PLAY_MODE,playMode.random)
	commit(types.SET_SEQUENCE_LIST,list)
	let randomlist = shuffle(list)
	commit(types.SET_PLAYLIST,randomlist)
	commit(types.SET_CURRENT_INDEX,0)
}

export const insertSong = function({commit,state},song){
	let playlist = state.playlist.slice()//操作副本，否则修改state的会报错
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex//值类型没关系

	//记录当前歌曲
	let currentSong = playlist[currentIndex]

	let fpIndex = findIndex(playlist,song)//查询插入的歌曲是否在列表，并返回索引
	//因为是插入歌曲，所以索引+1
	currentIndex++
	playlist.splice(currentIndex,0,song)//插入这首歌到当前索引位置
	//如果已经包含这首歌，则删掉这首歌
	if(fpIndex > -1){
		//如果当前插入的序号大于之前列表中的序号
		if(currentIndex>fpIndex){
			playlist.splice(fpIndex,1)
			currentIndex--
		}else{//新插入的是currentindex后的元素
			playlist.splice(fpIndex+1,1)//增加1位去删除
		}
	}

	let currentSIndex = findIndex(sequenceList,currentSong)+1
	let fsIndex = findIndex(sequenceList,song)

	sequenceList.splice(currentIndex,0,song)

	if(fsIndex > -1){
		if(currentSIndex>fsIndex){//要插入的在之前的后面
			sequenceList.splice(fsIndex,1)
		}else{
			sequenceList.splice(fsIndex+1,1)
		}
	}
	commit(types.SET_PLAYLIST,playlist)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_CURRENT_INDEX,currentIndex)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_PLAYING_STATE,true)
}

export const saveSearchHistory = function({commit},query){
	commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

export const deleteSearchHistory = function({commit},query){
	commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}

export const clearSearchHistory = function({commit}){
	commit(types.SET_SEARCH_HISTORY,clearSearch())
}

export const deleteSong = function({commit,state},song){
	let playlist = state.playlist.slice()//操作副本，否则修改state的会报错
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex//值类型没关系

	let pIndex = findIndex(playlist,song)
	playlist.splice(pIndex,1)
	let sIndex = findIndex(sequenceList,song)
	sequenceList.splice(sIndex,1)

	if(currentIndex > pIndex || currentIndex === playlist.length){//当前歌曲在删除歌曲之后||删除最后一首歌
		currentIndex--
	}

	commit(types.SET_PLAYLIST,playlist)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_CURRENT_INDEX,currentIndex)

	const playlistState = playlist.length ? true:false
	commit(types.SET_PLAYING_STATE,playlistState)

}

export const deleteSonglist = function({commit}){
	commit(types.SET_PLAYLIST,[])
	commit(types.SET_SEQUENCE_LIST,[])
	commit(types.SET_CURRENT_INDEX,-1)
	commit(types.SET_PLAYING_STATE,false)
}

export const savePlayHistory = function({commit},song){
	commit(types.SET_PLAY_HISTORY,savePlay(song))	
}

export const saveFavoriteList = function({commit},song){
	commit(types.SET_FAVORATE_LIST,saveFavorite(song))
}

export const deleteFavoriteList = function({commit},song){
	commit(types.SET_FAVORATE_LIST,deleteFavorite(song))
}