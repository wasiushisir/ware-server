const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfeti.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run()
{
    try{
        await client.connect();
        const itemsCollection=client.db('frTelecom').collection('items')

        app.get('/items',async(req,res)=>{
            const query={};
            const cursor=itemsCollection.find(query);
            const items=await cursor.toArray()
            res.send(items);

            

        })


        app.get('/items/:id',async(req,res)=>{
           
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const item=await itemsCollection.findOne(query);
            res.send(item);

        })


          //update user
          app.put('/items/:id',async(req,res)=>{
            const id =req.params.id;
            const updatedQuantity=req.body;
            const filter={_id: ObjectId(id)}
            const options = { upsert: true };

            const updateDoc={
                $set:{
                    Quantity:updatedQuantity.Quantity,
                   
                }
            };
            const result= await itemsCollection.updateOne(filter,updateDoc,options);
            res.send(result);
        })   


        //delete 

        app.delete('/items/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await itemsCollection.deleteOne(query)
            res.send(result) 
        })


        //create items

        app.post('/items',async(req,res)=>{
            const newItem=req.body;
            console.log('added new item',newItem);
            const result=await itemsCollection.insertOne(newItem);
            res.send(result);

        })














    }
    finally{

    }
}

run().catch(console.dir);










app.get('/',async(req,res)=>{
    res.send('fr server is running')
})

app.listen(port,()=>
{
    console.log(port,' port is litening')
})