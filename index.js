const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5000;


//midleware
app.use(cors());
app.use(express.json());

function verifyJWT(req,res,next){
    const authHeader=req.headers.authorization;
    if(!authHeader){
       return res.status(401).send({message:'unauthorized access'})
    }
            console.log('below the middleware',authHeader);
            next();

}




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfeti.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run()
{
    try{
        await client.connect();
        const itemsCollection=client.db('frTelecom').collection('items')
        const addItemsCollection=client.db('frTelecom').collection('addItems')
        const addFeedBackCollection=client.db('frTelecom').collection('feedback')


         //AUTH

         app.post('/login',async(req,res)=>
        
        {
            const user=req.body;
            const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRETE,{
                expiresIn:'1d'
            });

            res.send(accessToken);

        })


      


        app.get('/items',verifyJWT,async(req,res)=>{
            



            const email=req.query.email;
            // console.log(email);
            const query={email:email};
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

        app.get('/additems/:id',async(req,res)=>{

            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const item=await addItemsCollection.findOne(query);
            res.send(item);

        })









          //update user
          app.put('/additems/:id',async(req,res)=>{
            const id =req.params.id;
            const updatedQuantity=req.body;
            const filter={_id: ObjectId(id)}
            const options = { upsert: true };

            const updateDoc={
                $set:{
                    Quantity:updatedQuantity.Quantity,
                   
                }
            };
            const result= await addItemsCollection.updateOne(filter,updateDoc,options);
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





        app.post('/additems',async(req,res)=>{
            const newItem=req.body;
            console.log('added new item',newItem);
            const result=await addItemsCollection.insertOne(newItem);
            res.send(result);

        })


        app.get('/additems',async(req,res)=>{
            const query={}
            const cursor= addItemsCollection.find(query)
            const result=await cursor.toArray();
            res.send(result);
        })


        //delete


        app.delete('/additems/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await addItemsCollection.deleteOne(query)
            res.send(result) 
        })



        //feedback

        app.get('/feedback',async(req,res)=>{
            const query={}
            const cursor= addFeedBackCollection.find(query)
            const result=await cursor.toArray();
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