

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
}


const searchList: SearchItem[] = [
    {
        alias: 'lensoAi识图',
    }
];
export default searchList;