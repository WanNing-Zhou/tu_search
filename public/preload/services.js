const fs = require('node:fs')
const path = require('node:path')

// const open = require('node:open')


const request = {
    baseAction: {
        method: 'GET',
    },
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    optionFactory: function (options) {
        const reqHeaders = Object.assign({}, this.headers, options.headers || {})
        const reqData = Object.assign({}, this.baseAction, options)
        reqData.headers = reqHeaders
        return reqData
    },
    get: async function (url, options) {
        const reqData = this.optionFactory(options)
        reqData.method = 'GET'
        const res = await fetch(url, reqData)
        return res.json()
    },
    post: async function (url, options) {
        const reqData = this.optionFactory(options)
        reqData.method = 'POST'
        reqData.body = JSON.stringify(reqData.body)
        const res = await fetch(url, reqData)
        return res.json()
    }
}

const searchData = {
    'lensoAi': {
        "image": {
            "id": '',
            "data": '',
        },
        "effects": {
            "rotation": 0,
            "zoom": 1,
            "pX": 0,
            "pY": 0,
            "cX": 0,
            "cY": 0,
            "cW": 1,
            "cH": 1
        },
        "selection": {
            "top": 0,
            "left": 0,
            "right": 1,
            "bottom": 1
        },
        "domain": "",
        "text": "",
        "page": 0,
        "type": "related",
        "sort": "",
        "seed": 0,
        "facial_search_consent": 1
    }
}


const searchList = [
    {
        alias: 'lensoAi识图',
        callBack: async (param) => {
            searchData.lensoAi.page = param.page;
            searchData.lensoAi.image.data = param.imgBase64;

            const getList = async () => {
                const res = await request.post('https://lenso.ai/api/search', {
                    body: searchData.lensoAi
                })
                console.log('lensoAires:', res)
                const dataList = res.results?.related;
                console.log('lensoAires:', dataList)
                const resList = dataList.map((item) => {
                    return {
                        title: item.urlList[0]?.title || '',
                        img: item.proxyUrl || item.urlList[0].imageUrl
                    }
                })
                return resList;
            }

            if (param.page === 0) {
                // 上传图片
                const res = await request.post(" https://lenso.ai/api/upload", {
                    body: {
                        image: param.imgBase64
                    }
                })
                searchData.lensoAi.image.id = res.id;
            }


            return await getList()
        }
    },

    {
        alias: "360识图",
        callBack() {
            console.log("360")
        }
    },
    {
        alias: '百度识图',
        callBack() {
            console.log("baidu")
        }
    },
    {
        alias: '搜狗识图',
        callBack() {
            console.log("搜狗")
        }
    },
    {
        alias: 'bing识图',
        callBack() {
            console.log("bing")
        }
    }

];


/**
 * @typedef {Object} SearchByImgData
 * @property {string}  imgBase64  - 图片的base64编码。
 * @property {number} page - 图片的页数。
 * @property {File} imgFile - 图片的File对象。
 */

// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {
    // 读文件
    readFile(filePath) {
        const filename = path.basename(filePath)
        utools.showNotification(`正在读取文件: ${filename}`)
        // 将filePath 转换为前端可读的File对象
        return new File([fs.readFileSync(filePath)], filename)
    },


    /**
     * 根据图片进行搜索。
     * @param {string} key
     * @param {SearchByImgData} data
     * @returns {Promise<*|void>}
     */

    async searchByImg(key, data) {
        const searchItem = searchList.find((item) => item.alias === key)
        if (!searchItem) return
        const list = await searchItem.callBack(data)
        return list
    },


    /**
     * 下载图片到本地。
     * @param {string} imgBase64
     * @param {string} filename
     */
    writeImgFile(imgBase64,  filename,) {
        const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(imgBase64)
        if (!matchs) return
        const savePath = window.utools.showSaveDialog({
            title: '保存图片',
            defaultPath: path.join(window.utools.getPath('downloads'),filename),
            buttonLabel: '保存',
            filters: [
                { name: '所有文件', extensions: ['*'] },
                { name: '图像文件', extensions: ['jpg', 'png', 'gif'] }
            ]
        })
        if (!savePath) return

        // const filePath = path.join(saveDirPath, filename)
        fs.writeFileSync(savePath, imgBase64.substring(matchs[0].length), {encoding: 'base64'})
        return savePath
    },

    // 文本写入到下载目录
    writeTextFile(text) {
        const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.txt')
        fs.writeFileSync(filePath, text, {encoding: 'utf-8'})
        return filePath
    },
    // 图片写入到下载目录
    writeImageFile(base64Url) {
        const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url)
        if (!matchs) return
        const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.' + matchs[1])
        fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), {encoding: 'base64'})
        return filePath
    },
}
