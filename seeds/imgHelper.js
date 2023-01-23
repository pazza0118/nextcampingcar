const cloudinary = require("cloudinary").v2
cloudinary.config({
  cloud_name: 'dytfoucya',
  api_key: '164844287334396',
  api_secret: '17-Sz5S4fH8TfmztTgnyvaoElp8'
});

// Code for extracting imageNames
// var fs = require('fs');
// var files = fs.readdirSync('./yelpcampImages');
// console.log(files)
const imageNames = [
  '20190617134853_lorhfd.jpg',
  '20190925171525_sbk42a.jpg',
  '20191119150340_eyplvm.jpg',
  'asoggetti-F_VpK14kvM8-unsplash_rhgrxm.jpg',
  'b6fa1db2gy1g7clpmnq82j218g0tn4qq_oglrtz.jpg',
  'cosmea-flower-plant-cosmos-a3d1a437edd247f60e9943e83bb960ea_mspxj0.jpg',
  'df29wusq5jb73qwyeoas.jpg',
  'iozd8ljwsqvcxwonhu9b.jpg',
  'photo-1444124818704-4d89a495bbae_jvlk4v.jpg',
  'photo-1464895216333-d859b45bf394_vl2gxl.jpg',
  'photo-1489606835953-ed2a1627e77a_peqkrb.jpg',
  'photo-1494112142672-801c71472ba5_j6pzvx.jpg',
  'photo-1497373637916-e47a55e22d0a_kxt2to.jpg',
  'photo-1503516459261-40c66117780a_ptmxp2.jpg',
  'photo-1504106379193-10da019d1e9e_sgnaxs.jpg',
  'photo-1505489304219-85ce17010209_m1nzgg.jpg',
  'photo-1507499244229-be438d3c06d0_xnlgv2.jpg',
  'photo-1507584359040-f44a16355689_zzaj1y.jpg',
  'photo-1515444744559-7be63e1600de_xofxxu.jpg',
  'photo-1520095972714-909e91b038e5_zhijga.jpg',
  'photo-1521292270410-a8c4d716d518_qldfhm.jpg',
  'photo-1534447677768-be436bb09401_yd1xmc.jpg',
  'photo-1547448020-9f1fa36063fe_gpjmo9.jpg',
  'photo-1576508575858-9074a0194b2e_bzzect.jpg',
  'wolf-wolves-snow-wolf-landscape-985ca149f06cd03b9f0ed8dfe326afdb_kelddr.jpg'
]

let imageUrlFilenameArray = [];
let i = 0;
try {
  imageNames.forEach(async (img) => {
    // i++;
    const result = await cloudinary.uploader.upload(`./yelpcampImages/${img}`, {
      resource_type: "image",
      folder: "YelpCamp"
    })
    i++;
    let imageUrlFilename = { url: result.secure_url, filename: result.public_id };
    imageUrlFilenameArray.push(imageUrlFilename)
    // console.log("i is ", i)
    // console.log("imageNames.length is ", imageNames.length)
    if (i === imageNames.length) {
      return console.log(imageUrlFilenameArray)
    }
  })
}
catch (err) {
  console.log(err)
}
