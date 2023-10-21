const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected');
});

//Chooses Random value from array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    console.log('SeedDb called')
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dvsqdme9h/image/upload/v1697897842/YelpCamp/zhbyrrmwqnftea1cygfx.jpg',
                    filename: 'YelpCamp/zhbyrrmwqnftea1cygfx',
                    // _id: new ObjectId("6533dd741f25f0c00e6f74ab")
                },
                {
                    url: 'https://res.cloudinary.com/dvsqdme9h/image/upload/v1697897842/YelpCamp/xdqgrsovsa0vq9pxivi7.jpg',
                    filename: 'YelpCamp/xdqgrsovsa0vq9pxivi7',
                    // _id: new ObjectId("6533dd741f25f0c00e6f74ac")
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: price,
            author: '652fe1dd137b070aa0b8af6d'
        })
        await camp.save();
    }
};

seedDb();