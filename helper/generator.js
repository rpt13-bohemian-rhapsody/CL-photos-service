const fetch = require('node-fetch');
//const dbConnection = require('./db.js');
const fs = require('fs');
const key = require('../src/unsplashAPI/unsplash.js');
const faker = require('faker');

const photoGenerator = () => {
  let productsS = [];
  let photoData = [];
  let counter = 0;
  while (counter < 50) {
    productsS.push(faker.fake("{{commerce.product}}"))
    counter++;
  }
  let products = productsS.filter((item, index) => productsS.indexOf(item) === index);
  //products is an array with product id

  for (let i in products) {
    fetch(
      `https://api.unsplash.com/search/photos/?query=${products[i]}&client_id=${key.accessKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => response.json())
      .then(async (data) => {
        //data.result is an array of all the related photos
        //only need the first 5 photos
        
        for (let k = 0; k < 5; k++) {
          //push each item info into an object
          //note: autoincrement id
          //push each item into an array
          photoData.push({
            photoid: data.results[k].id, 
            username: data.results[k].user.username, 
            link: data.results[k].urls.full,
            productTag: products[i],
            tagID: i
          });
          // dbConnection.insertIntoDB(
          //   data.results[k].id,
          //   data.results[k].user.username,
          //   data.results[k].urls.full,
          //   products[i],
          //   i);
          //console.log('what is it?', photoData);
        }
        //write
    
        // for (let photoData of data.results) {
        //   dbConnection.insertIntoDB(
        //     photoData.id,
        //     photoData.user.username,
        //     photoData.urls.full,
        //     products[i]);
        // }
      })
      .then(() => {
        //console.log('this is', photoData);
        fs.writeFileSync(__dirname+'/photos.js', JSON.stringify(photoData, null, '\t'));
      })
     
  }
  return;
}

/*

product name < generated by faker
list of products > 50 items or 100 items or X items
look up images from unsplash
  > each product = 5 photos 
  > each photo has 
    > username, productid // 1, url link, 
    query for productid === :id
*/








// const collections = {
//   headphones: 4950245,
//   markers: 4950300,
//   peacoat: 4950343,
//   nike: 4950361,
//   camera: 4950372,
//   bedding: 4950375,
//   mugs: 4950382,
//   nonfiction: 4950397,
// };

// const seed = () => {
//   for (let products in collections) {
//     fetch(
//       `https://api.unsplash.com/collections/${
//       collections[products[i]]
//       }/photos/?client_id=${key.accessKey}`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         for (let photoData of data) {
//           dbConnection.insertIntoDB(
//             photoData.id,
//             photoData.user.username,
//             photoData.urls.full, 
//             products);
//         }
//         console.log(data);
//       })
//   }
//   return 'Finished seeding';
// }
module.exports = {
  photoGenerator
}