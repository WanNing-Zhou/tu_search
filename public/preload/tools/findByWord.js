const cheerio = require('cheerio');
const fbwReq = require('../request/findByWord')

async function getBingImages(params){
   const resData =  await fbwReq.getBingContent(params)
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
    console.log(resData)
    try {
        return resData.data.items.map((item) => {
            return {
                src: item?.picUrl || item?.oriPicUrl || '',
                name: item?.title || ''
            }
        })
    }catch (err){
        console.error('搜狗响应解析失败，请联系开发者进行更新')
        return []
    }
}

async function getBaiduImages(params){
    const resData = await fbwReq.getBaiduSearch(params)
    try {
        return resData.data.map((item) => {
            return {
                src: item?.replaceUrl?.ObjURL || item?.replaceUrl?.objUrl || item?.thumbURL || '',
                name: item?.fromPageTitleEnc || ''
            }
        })
    }catch (err){
        console.error('百度响应解析失败，请联系开发者进行更新')
        return []
    }
}

module.exports = {
    getBingImages,
    getSouGouImages,
    getBaiduImages
}