const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

//

const uri = `mongodb+srv://${process.env.MBD_USER}:${process.env.MBD_PASS}@cluster0.2xlnexh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    const mobileAllCollection = client.db("mobileZoneDb").collection("mobiles");
    const categoriesCollection = client.db("mobileZoneDb").collection("mobileCategories");
    const bookingsCollection = client.db("mobileZoneDb").collection("bookings");
    const usersCollection = client.db("mobileZoneDb").collection("users");
    const bAndSCollection = client.db("mobileZoneDb").collection("buyerAndSeller");

    app.get("/categories/:categoryName", async (req, res) => {
      const categoryName = req.params.categoryName;
      const query = { categoryName: categoryName };
      const result = await mobileAllCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoriesCollection.find(query).toArray();
      res.send(categories);
    });
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });
    app.get("/bookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { buyerEmail: email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });
    //buyerAndSeller
    app.post("/buyerAndSeller", async (req, res) => {
      const bAndS = req.body;
      const result = await bAndSCollection.insertOne(bAndS);
      console.log(result);
      res.send(result);
    });
    app.get("/buyerAndSeller", async (req, res) => {
      const query = {};
      const result = await bAndSCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });
    //buyers
    app.get("/buyerAndSeller/buyers", async (req, res) => {
      const query = { role: "Buyer" };
      const result = await bAndSCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });
    //sellers
    app.get("/buyerAndSeller/sellers", async (req, res) => {
      const query = { role: "Seller" };
      const result = await bAndSCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      const query = {};
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });
    app.patch("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "Booked",
        },
      };
      const result = await mobileAllCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
  } finally {
  }
}
run()
  .then()
  .catch((err) => console.error(err));

app.get("/", async (req, res) => {
  res.send("Mobile Zone Server is running");
});
app.listen(port, () => {
  console.log("Mobile Zone server running on ", port);
});
