const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const nodemon = require('nodemon');
require('dotenv').config()


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wkh8y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  

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
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port);