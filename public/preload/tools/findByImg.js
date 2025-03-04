const fbiReq=  require('../request/findByImg')
const {handleError} = require('./utils')


const lensoAiParam = {
    imgBase64: '',
    page: 0,
    id: '',
}
async function getLensoAiImages(param) {
    lensoAiParam.imgBase64 = param.imgBase64
    if(param.page === 0){
       try {
           const res = await fbiReq.postLensoAiImg({
               img: param.imgBase64
           })
           if (!res){
               return []
           }
           lensoAiParam.id = res.id
       } catch (err){
           handleError(new Error('lensoAi上传数据解析异常，请联系开发者进行更新'))
           return []
       }
    }

    try {
        const res = await fbiReq.getLensoAiSearch({
            imgBase64: lensoAiParam.imgBase64,
            page: param.page,
            id: lensoAiParam.id
        })
        if (!res){
            return []
        }
        const dataList = res.results?.related;
        console.log('resList', res)
        const resList = dataList.map(item => {
            return {
                name: item.urlList[0]?.title || '',
                src:  item.proxyUrl || item.urlList[0].imageUrl,
                orgSrc: item.urlList[0]?.imageUrl || item.proxyUrl,
            }
        })
        return resList
    }catch (err){
        handleError(new Error('lensoAi搜索数据解析异常，请联系开发者进行更新'))
        return []
    }
}


module.exports = {
    getLensoAiImages
}