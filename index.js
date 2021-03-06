const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;

require('dotenv').config()


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port =process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wkh8y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db(`${process.env.DB_NAME}`).collection(`Books`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`orders`);

  app.post('/addBook',(req,res)=>{
    const newBookInfo=req.body;
    booksCollection.insertOne(newBookInfo)
    .then(result=>{
      console.log(result);
    })
  })

  app.get('/getAllBooks',(req,res)=>{
    booksCollection.find({})
    .toArray((error,documents)=>{
      res.send(documents);
    })
  })

  app.delete('/DeleteOne/:id',(req,res)=>{
    booksCollection.deleteOne({_id:ObjectID(req.params.id)})
    .then(result=>{
      console.log(result);
      res.send(result.deletedCount>0)
    })
  })

  app.post('/placeOrder',(req,res)=>{
    const newOrder=req.body;
    ordersCollection.insertOne(newOrder)
    .then(result=>{
      if(result.insertedCount>0){
        console.log("INSERTED");
      }
    })
  })

  app.get('/getOrders',(req,res)=>{
    const getOrders=req.query.email;
    let total=0;
    ordersCollection.find({userMail:getOrders})
    .toArray((error,documents)=>{
      for (let i = 0; i < documents.length; i++) {
        const elementPrice = parseInt(documents[i].bookPrice);
        total=total+elementPrice;
      }
      documents.push(total);
      res.send(documents);
      console.log(documents,total);
    })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World with heroku!')
})

app.listen(port);