if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

// ─── Cloudinary URLs ──────────────────────────────────────────────────────────
// All URLs are from Cloudinary's official demo account.
// Your transform: url.replace("/upload", "/upload/h_300,w_250") will work perfectly.
// The /upload/ segment is present in every URL below.
const sampleImages = [
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/sample.jpg",           filename: "wanderlust_mountain_cabin" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/beach.jpg",            filename: "wanderlust_beach_villa" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/couple.jpg",           filename: "wanderlust_pool_resort" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/woman.jpg",            filename: "wanderlust_forest_cabin" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/bike.jpg",             filename: "wanderlust_alpine_hut" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/docs/models.jpg",      filename: "wanderlust_city_apartment" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/soccer_cloud.jpg",     filename: "wanderlust_bali_villa" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/llama.jpg",            filename: "wanderlust_beach_house" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/cld-sample.jpg",       filename: "wanderlust_tropical_resort" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/cld-sample-2.jpg",     filename: "wanderlust_countryside_cottage" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/cld-sample-3.jpg",     filename: "wanderlust_modern_apartment" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1563282001/cld-sample-4.jpg",     filename: "wanderlust_luxury_villa" },
];

// ─── Sample listings data ─────────────────────────────────────────────────────
// geometry.coordinates = [longitude, latitude]  ← GeoJSON format for Mapbox
const listingsData = [
    {
        title: "Cozy Mountain Cabin in Manali",
        description: "A beautiful wooden cabin nestled in the Himalayas with stunning mountain views, a fireplace, and direct access to trekking trails. Perfect for a peaceful getaway.",
        price: 3500,
        location: "Manali, Himachal Pradesh",
        country: "India",
        geometry: { type: "Point", coordinates: [77.1887, 32.2396] },
        image: sampleImages[0],
    },
    {
        title: "Luxury Beach Villa in Goa",
        description: "An exquisite villa just steps from the beach in North Goa. Features a private pool, outdoor lounge, and breathtaking sunset views over the Arabian Sea.",
        price: 8500,
        location: "Calangute, Goa",
        country: "India",
        geometry: { type: "Point", coordinates: [73.7553, 15.5440] },
        image: sampleImages[1],
    },
    {
        title: "Beachfront Resort Suite in Maldives",
        description: "An overwater bungalow with glass floor panels, direct ocean access, and a private deck. Experience the ultimate luxury in one of the world's most beautiful destinations.",
        price: 25000,
        location: "Malé Atoll, Maldives",
        country: "Maldives",
        geometry: { type: "Point", coordinates: [73.5093, 4.1755] },
        image: sampleImages[2],
    },
    {
        title: "Enchanted Forest Treehouse in Coorg",
        description: "Sleep among the treetops in this magical treehouse surrounded by coffee plantations and misty forests. Wake up to birdsong and fresh mountain air.",
        price: 4200,
        location: "Coorg, Karnataka",
        country: "India",
        geometry: { type: "Point", coordinates: [75.7382, 12.3375] },
        image: sampleImages[3],
    },
    {
        title: "Alpine Chalet in Swiss Alps",
        description: "A traditional Swiss chalet with panoramic views of snow-capped peaks, a hot tub on the balcony, and ski-in/ski-out access to world-class slopes.",
        price: 18000,
        location: "Zermatt, Switzerland",
        country: "Switzerland",
        geometry: { type: "Point", coordinates: [7.7491, 46.0207] },
        image: sampleImages[4],
    },
    {
        title: "Stylish Loft in New York City",
        description: "A chic industrial loft in the heart of Brooklyn with exposed brick walls, floor-to-ceiling windows, and easy subway access to Manhattan attractions.",
        price: 12000,
        location: "Brooklyn, New York",
        country: "United States",
        geometry: { type: "Point", coordinates: [-73.9442, 40.6782] },
        image: sampleImages[5],
    },
    {
        title: "Bali Jungle Villa with Private Pool",
        description: "An authentic Balinese villa hidden in the jungle near Ubud. Features a stunning infinity pool, outdoor shower, and daily breakfast included.",
        price: 6800,
        location: "Ubud, Bali",
        country: "Indonesia",
        geometry: { type: "Point", coordinates: [115.2624, -8.5069] },
        image: sampleImages[6],
    },
    {
        title: "Seaside Cottage in Kerala Backwaters",
        description: "A charming heritage cottage on the edge of the Kerala backwaters. Enjoy houseboat rides, Ayurvedic massages, and fresh seafood right at your doorstep.",
        price: 3800,
        location: "Alleppey, Kerala",
        country: "India",
        geometry: { type: "Point", coordinates: [76.3388, 9.4981] },
        image: sampleImages[7],
    },
    {
        title: "Tropical Cliffside Resort in Phuket",
        description: "Perched on a dramatic cliff overlooking the Andaman Sea, this stunning resort suite features a private plunge pool, panoramic ocean views, and world-class dining.",
        price: 15000,
        location: "Phuket, Thailand",
        country: "Thailand",
        geometry: { type: "Point", coordinates: [98.3923, 7.8804] },
        image: sampleImages[8],
    },
    {
        title: "Rustic Countryside Farmhouse in Tuscany",
        description: "A lovingly restored 18th-century farmhouse surrounded by rolling Tuscan hills, vineyards, and olive groves. Includes a wine cellar and outdoor pizza oven.",
        price: 14000,
        location: "Siena, Tuscany",
        country: "Italy",
        geometry: { type: "Point", coordinates: [11.3307, 43.3186] },
        image: sampleImages[9],
    },
    {
        title: "Modern Apartment in Paris",
        description: "A sleek and elegant apartment in the 7th arrondissement with a balcony offering Eiffel Tower views. Walking distance to top museums, cafés, and boutiques.",
        price: 16000,
        location: "Paris, France",
        country: "France",
        geometry: { type: "Point", coordinates: [2.3022, 48.8566] },
        image: sampleImages[10],
    },
    {
        title: "Luxury Hilltop Villa in Santorini",
        description: "An iconic white-washed villa carved into the Santorini caldera with a private infinity pool, spectacular sunset views, and a fully equipped gourmet kitchen.",
        price: 22000,
        location: "Oia, Santorini",
        country: "Greece",
        geometry: { type: "Point", coordinates: [25.3753, 36.4618] },
        image: sampleImages[11],
    },
];

// ─── Sample users ─────────────────────────────────────────────────────────────
const usersData = [
    { username: "rahul_explorer",   email: "rahul@example.com",  password: "password123" },
    { username: "priya_travels",    email: "priya@example.com",  password: "password123" },
    { username: "john_wanders",     email: "john@example.com",   password: "password123" },
    { username: "sofia_adventures", email: "sofia@example.com",  password: "password123" },
];

// ─── Sample reviews ───────────────────────────────────────────────────────────
const reviewComments = [
    { comment: "Absolutely stunning place! The views were breathtaking and the host was incredibly welcoming.", rating: 5 },
    { comment: "Great location and beautiful property. A few minor issues but overall a wonderful stay.", rating: 4 },
    { comment: "Perfect getaway! Everything was exactly as described. Would definitely come back.", rating: 5 },
    { comment: "Lovely place with amazing amenities. The surrounding area is gorgeous.", rating: 4 },
    { comment: "Had an incredible experience. The property exceeded all our expectations!", rating: 5 },
    { comment: "Very comfortable and well-equipped. The host was responsive and helpful.", rating: 4 },
    { comment: "One of the best stays of my life. The scenery was absolutely magical.", rating: 5 },
    { comment: "Great value for money. Clean, cozy, and in a fantastic location.", rating: 4 },
    { comment: "Truly a hidden gem. We loved every moment of our stay here.", rating: 5 },
    { comment: "Beautiful property but could use some updates. Still a very pleasant stay.", rating: 3 },
];

// ─── Main seed function ───────────────────────────────────────────────────────
async function seedDB() {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing listings, reviews, and users");

    // Create users
    const createdUsers = [];
    for (let userData of usersData) {
        const { username, email, password } = userData;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        createdUsers.push(registeredUser);
        console.log(`👤 Created user: ${username}`);
    }

    // Create listings with reviews
    for (let i = 0; i < listingsData.length; i++) {
        const listingData = listingsData[i];

        // Assign owner — rotate through users
        const owner = createdUsers[i % createdUsers.length];

        // Create 2 reviews per listing from different users
        const createdReviews = [];
        for (let j = 0; j < 2; j++) {
            const reviewData = reviewComments[(i * 2 + j) % reviewComments.length];
            const reviewer = createdUsers[(i + j + 1) % createdUsers.length];
            const review = new Review({
                ...reviewData,
                author: reviewer._id,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            });
            await review.save();
            createdReviews.push(review._id);
        }

        const listing = new Listing({
            ...listingData,
            owner: owner._id,
            reviews: createdReviews,
        });

        await listing.save();
        console.log(`🏡 Created listing: ${listing.title}`);
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log(`   👥 Users created   : ${createdUsers.length}`);
    console.log(`   🏡 Listings created: ${listingsData.length}`);
    console.log(`   ⭐ Reviews created : ${listingsData.length * 2}`);
    console.log("\n📋 Login credentials (all passwords: password123):");
    usersData.forEach(u => console.log(`   ${u.username}  —  ${u.email}`));

    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
}

seedDB().catch((err) => {
    console.error("❌ Seed error:", err);
    mongoose.connection.close();
});
