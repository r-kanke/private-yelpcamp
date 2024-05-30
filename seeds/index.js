const path = require("path");
const mongoose = require("mongoose");

const cities = require("./cities.js");
const { descriptors , places } = require("./seedHelpers.js");
const Campground = require("../models/campground.js");

mongoose.connect('mongodb://localhost:27017/yelp-camp',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("MongoDB connection Established!!!");
    })
    .catch((err) => {
        console.log("Connection error: MongoDB!!!");
        console.log(err);
    });

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    const randomImages = () => {
        const imgList = [
            {
                url: "https://res.cloudinary.com/dcifckxbo/image/upload/v1716894090/YelpCamp/xzckhwp5zddpxiar8chm.gif",
                filename: "YelpCamp/xzckhwp5zddpxiar8chm", // pikachu変顔
            },
            {
                url: "https://res.cloudinary.com/dcifckxbo/image/upload/v1716897344/YelpCamp/utpqygum0zsydplfblap.gif",
                filename: "YelpCamp/utpqygum0zsydplfblap", // クロールカビゴン
            },
            {
                url: "https://res.cloudinary.com/dcifckxbo/image/upload/v1716895189/YelpCamp/zogf4tva0wbvfezfvrka.gif",
                filename: "YelpCamp/zogf4tva0wbvfezfvrka", // パクパク neko meme
            },
            {
                url: "https://res.cloudinary.com/dcifckxbo/image/upload/v1716897298/YelpCamp/t1rjsp52tycbmv3fjizi.gif",
                filename: "YelpCamp/t1rjsp52tycbmv3fjizi", // 高解像パクパクneko meme
            },
            {
                url: "https://res.cloudinary.com/dcifckxbo/image/upload/v1716897344/YelpCamp/tleiv1atp5ozaxprdalt.gif",
                filename: "YelpCamp/tleiv1atp5ozaxprdalt", // amongus crew hip dance
            },
            {
                url: "https://res.cloudinary.com/dcifckxbo/image/upload/v1716943450/YelpCamp/dfxkkgucrokcxxyrusmn.webp",
                filename: "YelpCamp/dfxkkgucrokcxxyrusmn", // endless doge
            },
        ];
        const imgNum = Math.floor(Math.random() * 3) + 1;
        const shuffled = imgList.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, imgNum);
    };
    for (let i=0; i<20; i++) {
        const idx = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 80) * 100 + 2000;
        const c = new Campground({
            title: `${sample(descriptors)}・${sample(places)}`,
            location: `${cities[idx].prefecture}${cities[idx].city}`,
            images: randomImages(),
            description: "富士山を眺めることのできる大草原、とても広大な芝生エリアが広がる場内、木々に囲まれたキャンプサイトなど開放的にすごしていただけます。 テントサイトのほか、貸し別荘のような宿泊施設もあり初心者の方やファミリーまで気軽に利用していただけます。 家族や友人と、のんびりとした時間を過ごしてみてはいかがでしょう。",
            geometry: {
                type: "Point",
                coordinates: [cities[idx].longitude, cities[idx].latitude],
            },
            author: "665543e9585b970d9c742c95",
            price: price,
        });
        await c.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log("MongoDB connection closed!!!");
});
