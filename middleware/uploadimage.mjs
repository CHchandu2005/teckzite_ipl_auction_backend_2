// // require('dotenv').config()
// // const cloudinary = require('cloudinary').v2;
// // const pLimit = require('p-limit');

// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// // const images = [
// //  'https://www.bing.com/ck/a?!&&p=54f4a1f1ff8710210a2bfd699d2bf1dfbd5970f2f8502e51ff67f8a439dfad3eJmltdHM9MTczNjU1MzYwMA&ptn=3&ver=2&hsh=4&fclid=22e6cc65-ae15-608c-0121-c3b8afb861e1&u=a1L2ltYWdlcy9zZWFyY2g_cT1yY2IlMjBsb2dvJkZPUk09SVFGUkJBJmlkPTVGRUU4NjQ4M0NGNDQ3NDFBRjc0REJDNjQzMjQwMDA3REFGMTdBMTY&ntb=1'
// // ];

// // (async function run() {

// //   // Example using a simple for loop

// //   // for ( const image of images ) {
// //   //   const result = await cloudinary.uploader.upload(image);
// //   //   console.log(`Successfully uploaded ${image}`);
// //   //   console.log(`> Result: ${result.secure_url}`);
// //   // }

// //   // Example with paralell uploads and concurrency
// //   // Default Cloudinary upload limit for the free tier is 10
// //   const limit = pLimit(2);

// //   const imagesToUpload = images.map((image) => {
// //     return limit(async () => {
// //       const result = await cloudinary.uploader.upload(image);
// //       console.log(`Successfully uploaded ${image}`);
// //       console.log(`> Result: ${result.secure_url}`);
// //       return result;
// //     })
// //   });

// //   await Promise.all(imagesToUpload);
// // })();
// import dotenv from 'dotenv';
// import cloudinary from 'cloudinary';
// import pLimit from 'p-limit';

// dotenv.config();

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const images = [
//  'https://cdn.siasat.com/wp-content/uploads/2020/02/Royal-Challengers-Bangalore.jpg',
//  'https://wallpapercave.com/wp/wp4166466.jpg',
//  'https://th.bing.com/th/id/OIP.Do9YjX3cnThK3R1EiwP7mwHaFj?rs=1&pid=ImgDetMain',
//  'https://th.bing.com/th/id/OIP.8nbexGYH865s1maVpPOf9gHaEK?rs=1&pid=ImgDetMain',
//  'https://play-lh.googleusercontent.com/zJo5zcc3EF4DmdMDMj4CTqppNa5XyRFvw6t0ZFE-ucmPS5qBRcughNUTOCJoH-wnbQ',
//  'https://english.cdn.zeenews.com/sites/default/files/2022/02/12/1013876-lsg-logo.jpg',
//  'https://newsd.in/wp-content/uploads/2018/12/mumbai.jpg',
//  'https://th.bing.com/th/id/OIP.Tra0ShVGtA77NmjGMqPVAAHaEK?rs=1&pid=ImgDetMain',
//  'https://staticg.sportskeeda.com/editor/2022/12/c1b50-16710169807950.png',
//  'https://th.bing.com/th/id/OIP.kvLY0xOxOQcNJTkoGE7mhQHaEK?w=315&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
// ];

// (async function run(image) {
//   try {
//     const limit = pLimit(2); // Set concurrency limit to 2

//   //  const imagesToUpload = images.map((image) => {
//       return limit(async () => {
//         const result = await cloudinary.v2.uploader.upload(image);
//         console.log(`Successfully uploaded ${image}`);
//         console.log(`> Result: ${result.secure_url}`);
//         return result;
//       });
//   //  });

//   //   const results = await Promise.all(imagesToUpload);
//   //   console.log('All images uploaded successfully!');
//   //  // console.log(results);
//   } catch (error) {
//     console.error('Error uploading images:', error.message);
//   }
// })();

// Export the function

//const dotenv = require('dotenv');
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

import pLimit from 'p-limit';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// const uploadImages = async (image) => {
//   try {
//     const result = await cloudinary.uploader.upload(image);
//     console.log(`Successfully uploaded ${image}`);
//     console.log(`> Result: ${result.secure_url}`);
//     return result.secure_url;  // Returning the image URL
//   } catch (error) {
//     console.error('Error uploading image:', error.message);
//     throw error;  // Rethrowing error to handle it where the function is called
//   }
// };


// const uploadImages = async (image, concurrency = 2) => {
//   try {
//     const limit = pLimit(concurrency);
//    // const imagesToUpload = images.map((image) =>
//       limit(async () => {
//         const result = await cloudinary.uploader.upload(image);
//         console.log(`Successfully uploaded ${image}`);
//         console.log(`> Result: ${result.secure_url}`);
//         return `${result.secure_url}`;
//       })
//   //  );

//     // const results = await Promise.all(image);
//     // console.log('image uploaded successfully!');
//     // return results;
//   } catch (error) {
//     console.error('Error uploading images:', error.message);
//     throw error;
//   }
// };
// const uploadImages = async (image) => {
//   console.log("in uploadIMages fn")
//   try {
//     const uploadStream = cloudinary.v2.uploader.upload_stream(
//       { resource_type: 'auto' },  // Automatically detect the file type
//       (error, result) => {
//         if (error) {
//           console.error('Error uploading image:', error.message);
//           throw error;  // Handle the error properly
//         }
//         console.log('Successfully uploaded image');
//         console.log(`> Result: ${result.secure_url}`);
//         return result.secure_url;  // Return the URL of the uploaded image
//       }
//     );

//     // Pipe the buffer data directly to Cloudinary
//     uploadStream.end(image.buffer);  // `image.buffer` is the binary data from the image file

//   } catch (error) {
//     console.error('Error uploading image:', error.message);
//     throw error;  // Handle the error where this function is called
//   }
// };
const uploadImages = async (image) => {
  console.log("In uploadImages function");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' },  // Automatically detect the file type
      (error, result) => {
        if (error) {
          console.error('Error uploading image:', error.message);
          reject(error);  // Reject the promise with the error
        } else {
          console.log('Successfully uploaded image');
          console.log(`> Result: ${result.secure_url}`);
          resolve(result.secure_url);  // Resolve the promise with the image URL
        }
      }
    );

    // Pipe the buffer data directly to Cloudinary
    uploadStream.end(image.buffer);  // `image.buffer` is the binary data from the image file
  });
};



export{ uploadImages };
