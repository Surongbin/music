var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()
//代理,定义路由
var apiRoutes = express.Router()
apiRoutes.get('/getDiscList',function(req,res){//res是自己接口返回的response
	var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
	axios.get(url,{
		headers:{
			referer:'https://c.y.qq.com',
			host:'c.y.qq.com'
		},
		params:req.query
	}).then((response)=>{//response是qq接口返回的response
		res.json(response.data)//把数据给浏览器前端
	}).catch((e)=>{
		console.log(e)
	})
})
apiRoutes.get('/getDiscSongList',function(req,res){//res是自己接口返回的response
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{//response是qq接口返回的response
    // res.json(response.data)//把数据给浏览器前端
    debugger
    console.log(response.data)
    var ret = response.data
    if(typeof ret === 'string'){//"MusicJsonCallback({\"retcode\":0,\"code\":0,\"subco
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if(matches){
        ret = JSON.parse(matches[1])
      }
    }
  }).catch((e)=>{
    console.log(e)
  })
})
apiRoutes.get('/lyric',function(req,res){//res是自己接口返回的response
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{//response是qq接口返回的response
    var ret = response.data
    if(typeof ret === 'string'){//"MusicJsonCallback({\"retcode\":0,\"code\":0,\"subco
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if(matches){
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)//把数据给浏览器前端
  }).catch((e)=>{
    console.log(e)
  })
})
app.use('/api',apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port
module.exports = app.listen(port,function(err){
	if(err){
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:'+port+'\n')
})