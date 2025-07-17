require('dotenv').config()
const express = require('express')
const routes = require('./routes');
const app = express()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')

app.use(express.json());
app.use('/api',routes);
app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.use(bodyParser.json({ limit: '5mb' }))

app.post('/login',(req,res)=>{
    return res.status(200).json({status:true,message:"success",data:req.body})
})
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
  
