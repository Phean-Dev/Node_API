const express=require('express');
const app=express();
const PORT=process.env.PORT || 5000;
app.use(express.json());

app.use('/api/user',require('./route/user_login'));
app.use('/api/student',require('./route/student'));

app.listen(PORT,()=>console.log(`Server start at 5000`));