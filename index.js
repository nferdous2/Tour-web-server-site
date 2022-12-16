const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require('mongodb');
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhxur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 8000;
app.get('/', (req, res) => {
    res.send('Running Tour server')
});
async function run() {
    try {
        await client.connect();
        const database = client.db("tour-web");
        const servicesCollection = database.collection("services");
        const addOrdersCollection = database.collection("orders");
        // get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //post service
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        //for orders
        app.get('/orders', async (req, res) => {
            const cursor = addOrdersCollection.find({});
            const orders = await cursor.toArray();
            console.log('orders')
            res.json(orders);
        });
        //post orders
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await addOrdersCollection.insertOne(orders);
            console.log(result);
            res.json(result)
        });
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log('Running ', port);
})