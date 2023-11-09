const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port= process.env.PORT || 5000


// midelware
app.use(cors());
app.use(express.json());






const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clf7ui5.mongodb.net/?retryWrites=true&w=majority`
// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Connect to the "brandDB" database and access its "brandCollection" collection
    const database = client.db("hotelBookingDB");
    const roomCollection = database.collection("room");
    
    app.post("/room", async(req, res)=> {
      const newAddRoom = req.body;
      console.log("new add room", newAddRoom);
      const result = await roomCollection.insertOne(newAddRoom);
      res.send(result);
      console.log("data send mongo db", result);
    })

    app.get("/addroom", async(req, res)=> {
      const cursor = roomCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      console.log(result);
    })

    app.get("/addroom/:id", async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await roomCollection.findOne(query);
      res.send(result)
      console.log("addroomid", result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// check running port
app.get("/",(req, res)=> {
  res.send("hotel booking is running")
})
app.listen(port, ()=> {
  console.log(`server is running on port ${port}`);
})






