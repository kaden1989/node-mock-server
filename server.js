var http = require('http');
var router = require('./fileRoute');
var port = process.argv[2] || 8000;

//个人性化处理
router.get('/',(req, res)=>{
    res.write(`hello world`)
    res.end()
})

const srv = http.createServer((req, res) => {
    router.init(req, res);
})

// 监听端口
srv.listen(port,() => console.log(`Server started on port ${port}`));