const express=require('express');
const bodyParser = require('body-parser');
const app=express();
const PORT=process.env.PORT || 5000;
const cors=require('cors');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api/user',require('./route/user_login'));
app.use('/api/student',require('./route/student'));

app.listen(PORT,()=>console.log(`Server start at 5000`));