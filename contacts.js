import fs from "fs";
const Data = JSON.parse(fs.readFileSync("./posts/items.json"));


const posts = Data.map((post) => {
    if(post.hasOwnProperty("updated")){
        return Object.assign({}, {
            title: post.title[0],
            link: post.url[0],
            view: post.view[0],
            updated: post.updated[0]
        })
    }else{
        return {}
    }
    
});

//去掉{}
const postsData = posts.filter((value) => {
    return Object.keys(value).length
})

//单个页面抓取数据处理
// const DataLength = Object.keys(Data[0]).length;
// for (let i = 0; i < DataLength; i++) {
//   if (Data[0].hasOwnProperty("image_urls")) {
//     const item = Object.assign(
//       {},
//       {
//         title: Data[0].title[i],
//         image_urls: Data[0].image_urls[i],
//         link: Data[0].link[i],
//         view: Data[0].view[i],
//         updated: Data[0].updated[i]
//       }
//     );
//     posts.push(item);
//   }
// }

export default postsData;
