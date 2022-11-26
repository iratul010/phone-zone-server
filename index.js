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
