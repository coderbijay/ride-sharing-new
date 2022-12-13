const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;

async function seedUser() {
  const client = new MongoClient("mongodb://localhost:27017/", {
    useNewUrlParser: true,
  });

  try {
    await client.connect();
    const userCollection = client.db("ridesharing").collection("users");

    const collectionCount = await userCollection.countDocuments();

    if (collectionCount > 0) userCollection.drop();

    // make a bunch of time series data
    let total = 5;
    let users = [];

    for (let i = 1; i <= total; i++) {
      let newUser = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        profile_pic: faker.image.avatar(),
        role: "user",
        location: {
          type: "Point",
          coordinates: [
            parseFloat(faker.address.longitude(90, 85, 4)),
            parseFloat(faker.address.latitude(27, 25, 4)),
          ],
        },
      };

      users.push(newUser);
    }

    const { insertedCount } = await userCollection.insertMany(users);

    if (insertedCount === total) {
      console.log("Database seeded! :)");
      client.close();
    }

    userCollection.createIndex({ location: "2dsphere" });
  } catch (err) {
    console.log(err.message);
  }
}

seedUser();