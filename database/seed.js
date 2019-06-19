const fetch = require('node-fetch');
const dbConnection = require('./db.js');
const key = require('./../src/unsplashAPI/unsplash.js');
const faker = require('faker');

const seed = () => {
  let productsS = [];
  let counter = 0;
  while (counter < 50) {
    productsS.push(faker.fake("{{commerce.product}}"))
    counter++;
  }
  let products = productsS.filter((item, index) => productsS.indexOf(item) === index);
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
      .then((data) => {
        for (let k = 0; k < 5; k++) {
          dbConnection.insertIntoDB(
            data.results[k].id,
            data.results[k].user.username,
            data.results[k].urls.full,
            products[i],
            i);
        }
        // for (let photoData of data.results) {
        //   dbConnection.insertIntoDB(
        //     photoData.id,
        //     photoData.user.username,
        //     photoData.urls.full,
        //     products[i]);
        // }
      })
  }
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

seed();