const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//set up middle wares
app.use(express.json());
app.use(cors({ origin: true }));

//require dotenv
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.c2bp6su.mongodb.net/?retryWrites=true&w=majority`;
console.log("Mongo set up Moon Tech: ", uri);





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
        const productsCollection = client.db('Moon_Tech_Redux_Thunk').collection('products');

        app.post("/product", async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        app.get('/products', async (req, res) => {
            const query = {}
            const result = await productsCollection.find(query).toArray()
            res.send(result);
        })

        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
        });

        app.get('/allProducts/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(filter);
            res.send(result);
        })

        //Update a Product
        app.put('/updateProduct/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateProductInfo = req.body;
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    model: updateProductInfo.model,
                    image: updateProductInfo.image,
                    status: updateProductInfo.status,
                    brand: updateProductInfo.brand,
                    keyFeature: [
                        updateProductInfo.keyFeature[0],
                        updateProductInfo.keyFeature[1],
                        updateProductInfo.keyFeature[2],
                        updateProductInfo.keyFeature[3],
                    ],
                }
            }

            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(error => console.log(error))

app.get("/", (req, res) => {
    res.send("Moon Tech Redux Thunk Server!");
});

app.listen(port, () => {
    console.log(`Moon Tech Redux Thunk Running on port ${port}`);
});
