const app = require('./app');
const { connectDatabase } = require('./config/database');
const cloudinary = require('cloudinary');

/**connect database */
connectDatabase();


/**connect cloudinary for uploading images */
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})


/**connect server and running */
app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on PORT:${process.env.PORT}`)
})