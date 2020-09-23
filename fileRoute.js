const mockData = require('./mockData')

module.exports = {
    fileType: {
        "css": "text/css",
        "gif": "image/gif",
        "html": "text/html",
        "ico": "image/x-icon",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tiff": "image/tiff",
        "txt": "text/plain",
        "wav": "audio/x-wav",
        "wma": "audio/x-ms-wma",
        "wmv": "video/x-ms-wmv",
        "xml": "text/xml"
    },
    routePathGet: {},
    routePathPost: {},
    get: function(pathname, fn) {
        this.routePathGet[pathname] = fn;
    },
    post: function(pathname, fn) {
        this.routePathPost[pathname] = fn;
    },
    init: function(request, response) {
        let fn = undefined;
        let pathname = request.url,
            reqPram = '';
        if (pathname.includes('?')){
            pathname = pathname.split('?')[0];
            reqPram = request.url.split('?')[1].split('&');
        }
        //去除URL中的参数影响
        [...pathname].forEach((e,i)=>{
            if(e === '?'){
                pathname = pathname.slice(0,i)
            }
        })
        response.on('error',(err)=>{
            console.log(`response err:${err}`)
        })
        request.on('error',(err)=>{
            console.log(`request err:${err}`)
        })
        response.setHeader( "Content-Type", "text/json; charset=utf-8");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        response.setHeader("Access-Control-Allow-Origin", "*");
        const mockHandle = (item)=>{
                        if (request.method.toLowerCase() === 'get') {
                            if(reqPram.length){
                                item.data.urlPram = listToJson(reqPram)
                            }
                            fn = this.routePathGet[pathname];
                        } else {
                            fn = this.routePathPost[pathname];
                        }
                        if (fn) {
                            fn(request, response);
                            response.end()
                        } else {
                            response.write(JSON.stringify(item.data))
                            response.end()
                        }
                    }
        let curItem = ''
        mockData.forEach((item,index)=>{
            if(item.url == pathname){
                curItem = item
                mockHandle(item)
            }
        })
        if (pathname == '/') {
            fn = this.routePathGet[pathname];
            fn(request, response)
            response.end()
        }else if(!curItem) {
            let wrongHtml = `<h1 style="text-align:center;width:100%;margin-top:200px;">404</h1>
            <h2 style="text-align:center;width:100%;margin-top:40px;">this is wrong mockData, please check mockData.js file!</h2>`
            response.statusCode = 404
            response.write(wrongHtml)
            response.end()
        }
        console.log(`method:${request.method.toLowerCase()} ---> path:${pathname}`);

    }
};
// 获取url查询参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    //  if (r != null) return escape(r[2]); return null;
    if (r != null) return r[2]; return null;
}
// 参数数组转为json
function listToJson(listData) {
    let resData = {}
    listData.forEach((i,e)=>{
        let ix = i.split('=')
        resData[ix[0]] = ix[1]
    })
    return resData
}