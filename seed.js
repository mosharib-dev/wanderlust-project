if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

// ─── Cloudinary URLs ──────────────────────────────────────────────────────────
const sampleImages = [
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773507613/photo-1757772104284-7796e966e88f_yeijvp.jpg",           filename: "wanderlust_001" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773507981/photo-1584098731526-e3924fad98db_r4e37l.jpg",           filename: "wanderlust_002" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508164/dharma-at-himalayan-retreat-656b00_vm8gwj.jpg",           filename: "wanderlust_003" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508259/photo-1543489822-c49534f3271f_njnhih.jpg",           filename: "wanderlust_004" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508368/photo-1675657144410-0f601cf4edbd_jz95ws.jpg",           filename: "wanderlust_005" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508448/premium_photo-1661964149725-fbf14eabd38c_kft6xl.jpg",           filename: "wanderlust_006" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508543/photo-1617817643768-8855fc457e3a_dar18k.jpg",           filename: "wanderlust_007" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508617/photo-1472508249545-917598a8c985_ouruhh.jpg",           filename: "wanderlust_008" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508690/jorawar-singh-gate-amer-road-subhash-chowk-old-city-gates-in-jaipur-jaipurthrumylens_vnpkwt.jpg",           filename: "wanderlust_009" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508759/photo-1762067412033-83b4420574a3_nuprti.jpg",           filename: "wanderlust_010" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508831/photo-1669021820355-7186908380d9_i2ixol.jpg",           filename: "wanderlust_011" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508905/photo-1730944524570-44f1c584fd54_jwvewm.jpg",           filename: "wanderlust_012" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773508965/premium_photo-1697729438401-fcb4ff66d9a8_rdb8x8.jpg",           filename: "wanderlust_013" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773509041/rustic-tuscan-farmhouse-stockcake_kwow1r.jpg",           filename: "wanderlust_014" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773509100/images_sjtldb.jpg",           filename: "wanderlust_015" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773509194/13-3-9915156_dvh4dt.jpg",           filename: "wanderlust_016" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773509258/photo-1589394815804-964ed0be2eb5_kidyuc.jpg",           filename: "wanderlust_017" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773509351/3_bpsap4.jpg",           filename: "wanderlust_018" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773509439/d144c127-55cc-4d9f-b5a6-faa2f0bde95b_jnbmu6.jpg",           filename: "wanderlust_019" },
    { url: "https://res.cloudinary.com/da21c0qcm/image/upload/v1773509501/photo-1648397831904-24e068d84b05_vhsb7b.jpg",           filename: "wanderlust_020" },
];

// ─── Listings Data (20 listings) ─────────────────────────────────────────────
const listingsData = [
    // MOUNTAINS
    {
        title: "Cozy Mountain Cabin in Manali",
        description: "A beautiful wooden cabin nestled in the Himalayas with stunning mountain views, a fireplace, and direct access to trekking trails. Perfect for a peaceful getaway.",
        price: 3500,
        location: "Manali, Himachal Pradesh",
        country: "India",
        category: "mountains",
        geometry: { type: "Point", coordinates: [77.1887, 32.2396] },
        image: sampleImages[0],
    },
    {
        title: "Alpine Chalet in Swiss Alps",
        description: "A traditional Swiss chalet with panoramic views of snow-capped peaks, a hot tub on the balcony, and ski-in/ski-out access to world-class slopes.",
        price: 18000,
        location: "Zermatt, Switzerland",
        country: "Switzerland",
        category: "mountains",
        geometry: { type: "Point", coordinates: [7.7491, 46.0207] },
        image: sampleImages[1],
    },
    {
        title: "Himalayan Retreat in Dharamshala",
        description: "A serene mountain retreat with breathtaking views of the Dhauladhar range. Ideal for yoga, meditation, and trekking with Tibetan cultural experiences nearby.",
        price: 2800,
        location: "Dharamshala, Himachal Pradesh",
        country: "India",
        category: "mountains",
        geometry: { type: "Point", coordinates: [76.3234, 32.2190] },
        image: sampleImages[2],
    },

    // AMAZING POOLS
    {
        title: "Luxury Beach Villa in Goa",
        description: "An exquisite villa just steps from the beach in North Goa. Features a private pool, outdoor lounge, and breathtaking sunset views over the Arabian Sea.",
        price: 8500,
        location: "Calangute, Goa",
        country: "India",
        category: "amazing pools",
        geometry: { type: "Point", coordinates: [73.7553, 15.5440] },
        image: sampleImages[3],
    },
    {
        title: "Bali Jungle Villa with Private Pool",
        description: "An authentic Balinese villa hidden in the jungle near Ubud. Features a stunning infinity pool, outdoor shower, and daily breakfast included.",
        price: 6800,
        location: "Ubud, Bali",
        country: "Indonesia",
        category: "amazing pools",
        geometry: { type: "Point", coordinates: [115.2624, -8.5069] },
        image: sampleImages[4],
    },
    {
        title: "Luxury Hilltop Villa in Santorini",
        description: "An iconic white-washed villa carved into the Santorini caldera with a private infinity pool, spectacular sunset views, and a fully equipped gourmet kitchen.",
        price: 22000,
        location: "Oia, Santorini",
        country: "Greece",
        category: "amazing pools",
        geometry: { type: "Point", coordinates: [25.3753, 36.4618] },
        image: sampleImages[5],
    },

    // ICONIC CITIES
    {
        title: "Stylish Loft in New York City",
        description: "A chic industrial loft in the heart of Brooklyn with exposed brick walls, floor-to-ceiling windows, and easy subway access to Manhattan attractions.",
        price: 12000,
        location: "Brooklyn, New York",
        country: "United States",
        category: "iconic cities",
        geometry: { type: "Point", coordinates: [-73.9442, 40.6782] },
        image: sampleImages[6],
    },
    {
        title: "Modern Apartment in Paris",
        description: "A sleek and elegant apartment in the 7th arrondissement with a balcony offering Eiffel Tower views. Walking distance to top museums, cafés, and boutiques.",
        price: 16000,
        location: "Paris, France",
        country: "France",
        category: "iconic cities",
        geometry: { type: "Point", coordinates: [2.3022, 48.8566] },
        image: sampleImages[7],
    },
    {
        title: "Heritage Haveli in Jaipur",
        description: "Stay in a beautifully restored 200-year-old Haveli in the heart of the Pink City. Rooftop dining, courtyard gardens, and royal Rajasthani hospitality included.",
        price: 5500,
        location: "Jaipur, Rajasthan",
        country: "India",
        category: "iconic cities",
        geometry: { type: "Point", coordinates: [75.7873, 26.9124] },
        image: sampleImages[8],
    },

    // CAMPING
    {
        title: "Enchanted Forest Treehouse in Coorg",
        description: "Sleep among the treetops in this magical treehouse surrounded by coffee plantations and misty forests. Wake up to birdsong and fresh mountain air.",
        price: 4200,
        location: "Coorg, Karnataka",
        country: "India",
        category: "camping",
        geometry: { type: "Point", coordinates: [75.7382, 12.3375] },
        image: sampleImages[9],
    },
    {
        title: "Jungle Camp in Jim Corbett",
        description: "An immersive jungle camping experience in the heart of Jim Corbett National Park. Evening safaris, bonfire nights, and wake up to tiger territory around you.",
        price: 3200,
        location: "Jim Corbett, Uttarakhand",
        country: "India",
        category: "camping",
        geometry: { type: "Point", coordinates: [78.7742, 29.5300] },
        image: sampleImages[10],
    },

    // BOATS
    {
        title: "Beachfront Resort Suite in Maldives",
        description: "An overwater bungalow with glass floor panels, direct ocean access, and a private deck. Experience the ultimate luxury in one of the world's most beautiful destinations.",
        price: 25000,
        location: "Malé Atoll, Maldives",
        country: "Maldives",
        category: "boats",
        geometry: { type: "Point", coordinates: [73.5093, 4.1755] },
        image: sampleImages[11],
    },
    {
        title: "Kerala Houseboat on Backwaters",
        description: "A traditional Kerala kettuvallam houseboat gliding through the scenic backwaters of Alleppey. Includes a private chef, AC bedrooms, and a sun deck.",
        price: 7500,
        location: "Alleppey, Kerala",
        country: "India",
        category: "boats",
        geometry: { type: "Point", coordinates: [76.3388, 9.4981] },
        image: sampleImages[12],
    },

    // FARMS
    {
        title: "Rustic Countryside Farmhouse in Tuscany",
        description: "A lovingly restored 18th-century farmhouse surrounded by rolling Tuscan hills, vineyards, and olive groves. Includes a wine cellar and outdoor pizza oven.",
        price: 14000,
        location: "Siena, Tuscany",
        country: "Italy",
        category: "farms",
        geometry: { type: "Point", coordinates: [11.3307, 43.3186] },
        image: sampleImages[13],
    },
    {
        title: "Organic Farm Stay in Wayanad",
        description: "A peaceful organic farm stay surrounded by spice plantations and paddy fields in the green hills of Wayanad. Includes farm tours, cooking classes, and forest walks.",
        price: 2500,
        location: "Wayanad, Kerala",
        country: "India",
        category: "farms",
        geometry: { type: "Point", coordinates: [76.0820, 11.6854] },
        image: sampleImages[14],
    },

    // ARCTIC
    {
        title: "Glass Igloo in Finnish Lapland",
        description: "Sleep under the Northern Lights in a heated glass igloo in the Finnish wilderness. Experience snowshoeing, reindeer safaris, and magical aurora borealis nights.",
        price: 28000,
        location: "Rovaniemi, Finland",
        country: "Finland",
        category: "arctic",
        geometry: { type: "Point", coordinates: [25.7294, 66.5039] },
        image: sampleImages[15],
    },

    // TRENDING
    {
        title: "Tropical Cliffside Resort in Phuket",
        description: "Perched on a dramatic cliff overlooking the Andaman Sea, this stunning resort suite features a private plunge pool, panoramic ocean views, and world-class dining.",
        price: 15000,
        location: "Phuket, Thailand",
        country: "Thailand",
        category: "trending",
        geometry: { type: "Point", coordinates: [98.3923, 7.8804] },
        image: sampleImages[16],
    },
    {
        title: "Seaside Cottage in Kerala Backwaters",
        description: "A charming heritage cottage on the edge of the Kerala backwaters. Enjoy houseboat rides, Ayurvedic massages, and fresh seafood right at your doorstep.",
        price: 3800,
        location: "Alleppey, Kerala",
        country: "India",
        category: "trending",
        geometry: { type: "Point", coordinates: [76.3388, 9.4981] },
        image: sampleImages[17],
    },

    // ROOM
    {
        title: "Cozy Studio in Mumbai",
        description: "A modern and well-equipped studio apartment in Bandra West, Mumbai. Minutes from the beach, cafés, and nightlife. Perfect for solo travelers and couples.",
        price: 2200,
        location: "Bandra, Mumbai",
        country: "India",
        category: "room",
        geometry: { type: "Point", coordinates: [72.8347, 19.0596] },
        image: sampleImages[18],
    },

    // CASTLES
    {
        title: "Medieval Castle Stay in Scotland",
        description: "Live like royalty in a fully restored medieval castle in the Scottish Highlands. Stone turrets, grand fireplaces, a dungeon tour, and highland whisky tasting included.",
        price: 32000,
        location: "Inverness, Scotland",
        country: "United Kingdom",
        category: "castles",
        geometry: { type: "Point", coordinates: [-4.2247, 57.4778] },
        image: sampleImages[19],
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
    { comment: "Incredible hosts and stunning surroundings. Highly recommend to everyone!", rating: 5 },
    { comment: "A wonderful escape from the city. Peaceful, clean and well maintained.", rating: 4 },
];

// ─── Main seed function ───────────────────────────────────────────────────────
async function seedDB() {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");

    await Listing.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing data");

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
        const owner = createdUsers[i % createdUsers.length];

        // 2 reviews per listing
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
        console.log(`🏡 Created listing: ${listing.title} [${listing.category}]`);
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log(`   👥 Users     : ${createdUsers.length}`);
    console.log(`   🏡 Listings  : ${listingsData.length}`);
    console.log(`   ⭐ Reviews   : ${listingsData.length * 2}`);
    console.log("\n📋 Login credentials (all passwords: password123):");
    usersData.forEach(u => console.log(`   ${u.username}  —  ${u.email}`));

    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
}

seedDB().catch((err) => {
    console.error("❌ Seed error:", err);
    mongoose.connection.close();
});
