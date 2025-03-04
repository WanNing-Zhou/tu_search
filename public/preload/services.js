const fs = require('node:fs')
const path = require('node:path')
const fbw = require('./tools/findByWord')
const fbi = require('./tools/findByImg')
const {handleError} = require('./tools/utils')
// const mime = require('mime')


// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {

    // 根据文字搜索
    findByWord: async(param)=>{
        switch (param.engine){
            case 'bing':
                return await fbw.getBingImages(param)
            case 'sougou':
                return await fbw.getSouGouImages(param)
            case 'baidu':
                return await fbw.getBaiduImages(param)
            default:
                handleError(new Error('未找到对应的搜索引擎'))
                return []
        }
    },

    // 读文件
    readFile(filePath) {
        const filename = path.basename(filePath)
        utools.showNotification(`正在读取文件: ${filename}`)
        // const type = mime.getType(filePath) || 'application/octet-stream'
        // 判断文件扩展名
        const ext = path.extname(filePath).toLowerCase()
        // 根据扩展名设置文件类型
        let type = ''
        if (ext === '.png') {
            type = 'image/png'
        }
        else if (ext === '.jpg' || ext === '.jpeg') {
            type = 'image/jpeg'
        }
        else if (ext === '.gif') {
            type = 'image/gif'
        }
        else {
            type = 'application/octet-stream'
        }
        // 将filePath 转换为前端可读的File对象
        return new File([fs.readFileSync(filePath)], filename, {type: type} )
    },

    /**
     * @typedef {Object} SearchByImgData
     * @property {string}  imgBase64  - 图片的base64编码。
     * @property {number} page - 图片的页数。
     * @property {File} imgFile - 图片的File对象。
     */

    /**
     * 根据图片进行搜索。
     * @param {string} key
     * @param {SearchByImgData} data
     * @returns {Promise<*|void>}
     */

    async searchByImg(key, data) {
        switch (key){
            case 'lensoAi识图':
                return await fbi.getLensoAiImages(data)
            default:
                handleError(new Error('未找到对应的搜索引擎'))
                return []
        }
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
