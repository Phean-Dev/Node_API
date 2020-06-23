const express=require('express');
const app=express();

app.use(express.json());

app.use('/api/user',require('./route/user_login'));
app.use('/api/student',require('./route/student'));

app.listen(5000,()=>console.log(`Server start at 5000`));