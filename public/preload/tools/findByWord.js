const cheerio = require('cheerio');
const fbwReq = require('../request/findByWord')
const  {handleError} = require('./utils')

async function getBingImages(params){
   const resData =  await fbwReq.getBingContent(params)
    if (!resData) return []
   const $ = cheerio.load(resData);
   const images = $('a.iusc').map((index, element)=>{
       const data = JSON.parse($(element).attr('m') || '')
       const name = $(element).attr('aria-label') || ''
       return {
           src:data.murl,
           name
       }
   })
    return images;
}


async function getSouGouImages(params){
    const resData = await fbwReq.getSouGouSearch(params)
    if (!resData) return []
    try {
        return resData.data.items.map((item) => {
            return {
                src: item?.picUrl || item?.oriPicUrl || '',
                name: item?.title || ''
            }
        })
    }catch (err){
        handleError(new Error('搜狗响应解析失败，请联系开发者进行更新'))
        return []
    }
}

async function getBaiduImages(params){
    let resData = await fbwReq.getBaiduSearch(params)
    console.log('resData', resData)

    if (!resData) return []
    try {


        // 返回resData 为字符串时转换成json
        if (typeof resData === 'string'){
            resData = JSON.parse(resData)
        }
        return resData.data.map((item) => {
            return {
                src: item?.replaceUrl?.ObjURL || item?.replaceUrl?.objUrl || item?.thumbURL || '',
                name: item?.fromPageTitleEnc || ''
            }
        })
    }catch (err){
        console.log('err', err)
        handleError('百度响应解析失败，请联系开发者进行更新')
        return []
    }
}

module.exports = {
    getBingImages,
    getSouGouImages,
    getBaiduImages
}