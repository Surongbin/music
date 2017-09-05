import jsonp from 'common/js/jsonp'
import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid){
	//跳过referer
	const url = '/api/lyric'
	const data = Object.assign({},commonParams,{
		pcachetime:+new Date(),
		songmid:mid,
		g_tk:1159010821,
		hostUin:0,
		format:'json',
		platform:'yqq',
		needNewCode:0	
	})
	return axios.get(url,{
		params:data    //params不能拼错
	}).then((res)=>{
		return Promise.resolve(res.data)
	})
}
