import axios from "axios";

export type SearchRes = {
    title: string;
    img: string;
}

export type ReqParams = {
    imgBase64: string;
    imgFile: File;
    page: number;
}

export type SearchItem = {
    alias: string;
    callBack: (param:ReqParams) => Promise<SearchRes[]>;
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
        "type": "",
        "sort": "",
        "seed": 0,
        "facial_search_consent": 1
    }
}


const searchList: SearchItem[] = [
    {
        alias: 'lensoAi识图',
        callBack: async (param: ReqParams): Promise<any> => {
            searchData.lensoAi.page = param.page;
            searchData.lensoAi.image.data = param.imgBase64;

            const getList = async () => {
               const res :any = await axios.post('https://lenso.ai/api/search', searchData.lensoAi)
                console.log('lensoAires:', res)
                const dataList = res.data.results.related;
                const resList: SearchRes[] = dataList.map((item: any) => {
                   return {
                       tilte: item.urlList[0].tilte,
                       img: item.urlList[0].imageUrl
                   }
               })
               return resList;
            }

            if (param.page === 0) {
                // 上传图片
                const res = await fetch(" https://lenso.ai/api/upload", {
                    image: param.imgBase64
                })
                searchData.lensoAi.image.id = res.data.id;
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
export default searchList;