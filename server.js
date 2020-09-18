var http = require('http');
var url = require('url');
var util = require('util');
var fs = require('fs');
var path = require("path");
var router = require('./fileRoute');
var port = process.argv[2] || 8000;
var pagePath = "/index.html"

const mockData = require('./mockData')

router.setRootPath(__dirname);

router.get('/', function(req, res){
    // 文件首页
    router.sendFile(res, pagePath);
});
// router.get('/ajax_web',(req, res)=>{
// 	console.log('this is get /ajax_web')
// 	res.writeHeader(200,{
// 		'Content-type': 'application/json; charset=utf-8'
// 	})
// 	res.end('this is response Data')
// })
const srv = http.createServer((req, res) => {
    router.init(req, res);
})

// 监听端口
srv.listen(port);