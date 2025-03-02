const {request} = require("axios");

/**
 * @interface FindByWordPrams
 * @property {string} search - 搜索关键字
 * @property {number} page - 搜索页数
 */

/**
 * 获取bing图片
 * @param {FindByWordPrams} params
 * @returns {Promise<HTMLElement>}
 */
async function getBingContent(params){
    const reqUrl = ' https://cn.bing.com/images/async'
    const reqParam= {
        q: params.search,
        first: 1,
        count: 35,
        mmasync: 1
    }
    reqParam.first = params.page * reqParam.count + 1;
    try {
        const res = await request({
            url: reqUrl,
            params: reqParam,
            method: 'GET',
        })
        return res.data
    }catch (err){
        console.error('bing图片请求错误，请联系开发者进行更新')
        return null
    }
}

/**
 * 获取sougou图片
 * @param {FindByWordPrams} params
 * @returns {Promise<any>}
 *
 */

async function getSouGouSearch(params){
    const reqUrl = 'https://pic.sogou.com/napi/pc/searchList'
    const reqParam= {
        query: params.search,
        mode: 1,
        start: (params.page * 48) + 1,
    }
    // 获取当前时间戳
    const timestamp = Date.now();
    try{
        const res = await request({
            url: reqUrl,
            params: reqParam,
            method: 'GET',
            headers: {
                "X-Time4p": timestamp,
            }
        })
        return res.data
    }catch (err){
        console.error('sougou图片请求错误，请联系开发者进行更新')
        return null
    }
}

async function getBaiduSearch(params){
    const reqUrl = 'https://image.baidu.com/search/acjson'
    const reqParam = {
        word: params.search,
        pn: params.page * 30,
        tn: 'resultjson_com',
    }
    try {
        const res = await request({
            url: reqUrl,
            params: reqParam,
            method: 'GET',
        })
        return res.data
    }catch (err){
        console.error('baidu图片请求错误，请联系开发者进行更新')
        return null
    }
}

module.exports = {
    getBingContent,
    getSouGouSearch,
    getBaiduSearch,
}