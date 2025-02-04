const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const Post= require('./models/Post');
const bcrypt =require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const multer = require('multer');
const uploadMiddleware =multer({dest:'uploads/'});
const fs=require('fs');
const salt=bcrypt.genSaltSync(10);
const secret='asdrweufghdsghjghgh';
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+ '/uploads'));
 mongoose.connect('mongodb+srv://BloggingApp:26anshitablog@cluster0.k5ckxvu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

/*app.post('/register', async(req,res) =>{
    const{username,password} = req.body;
    try{
        const userDoc= await User.create({username,
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    }catch(e){
        console.log(e);
res.status(400).json(e);
    }
    });*/


    app.post('/register', async (req, res) => {
      const { username, password } = req.body;
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json('User created successfully');
      } catch (e) {
        console.error(`Error creating user: ${e}`);
        res.status(400).json(e);
      }
    });
    
  /*app.post('/login', async(req,res)=>{
const {username,password}=req.body;
try{
const userDoc= await User.findOne({username});
if (!userDoc) {
    return res.status(400).json('User not found');
  }
const passOk= bcrypt.compareSync(password, userDoc.password);
if(passOk){
    //logged in
    jwt.sign({username,id:userDoc._id},secret,{},(err,token) =>{
if(err) throw err;
res.cookie('token',token).json({
    id:userDoc._id,
    username,
});
    });
}else{
    res.status(400).json('wrong credentials');
}
}
catch(e){
    console.log(e);
    res.status(400).json(e);
}
  });*/
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const userDoc = await User.findOne({ username });
      if (!userDoc) {
        return res.status(400).json('User not found');
      }
  
      const passOk = await bcrypt.compare(password, userDoc.password);
      if (passOk) {
        // Logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
          if (err) {
            console.error(`Error generating token: ${err}`);
            throw err;
          }
          res.cookie('token', token).json({
            id: userDoc._id,
            username,
          });
        });
      } else {
        res.status(400).json('wrong credentials');
      }
    } catch (e) {
      console.error(`Error logging in: ${e}`);
      res.status(400).json(e);
    }
  });



 
    app.get('/profile',(req,res) =>{
        const{token}=req.cookies;
        jwt.verify(token,secret,{},(err,info) =>{
if(err)  {
    return res.status(401).json('Invalid token');
  }
res.json(info);

        });

    });
    
    app.post('/logout' , (req,res) => {
        res.cookie('token','').json('ok');
    });
   /* app.post('/post',uploadMiddleware.single('file'),async(req,res)=>{
        const{originalname,path} = req.file;
       const parts= originalname.split('.');
       const ext=parts[parts.length-1];
       const newPath=path+'.'+ext;
       fs.renameSync(path,newPath);

       const{token}=req.cookies;
       jwt.verify(token,secret,{},async(err,info) =>{
        if(err) {
            return res.status(401).json('Invalid token');
          }
        const{title,summary,content} = req.body;
        const postDoc= await Post.create({
          title,
          summary,
          content,
          cover:newPath,
         author:info.id,
         });
       
        res.json(postDoc);
                });*/
                app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
                    if (!req.file) {
                      return res.status(400).json('No file uploaded');
                    }
                  
                    const { originalname, path } = req.file;
                    const parts = originalname.split('.');
                    const ext = parts[parts.length - 1];
                    const newPath = `${path}.${ext}`;
                  
                    try {
                      fs.renameSync(path, newPath);
                    } catch (err) {
                      console.error(err);
                      return res.status(500).json('Error renaming file');
                    }
                  
                    const { token } = req.cookies;
                    try {
                      const info = jwt.verify(token, secret);
                      const { title, summary, content } = req.body;
                      const postDoc = await Post.create({
                        title,
                        summary,
                        content,
                        cover: newPath,
                        author: info.id,
                      });
                      res.json(postDoc);
                    } catch (err) {
                      console.error(err);
                      if (err.name === 'JsonWebTokenError') {
                        return res.status(401).json('Invalid token');
                      }
                      return res.status(500).json('Error creating post');
                    }
                  });       

       



app.get('/post',async(req,res)=>{
    res.json(await Post.find()
    .populate('author',['username'])
     .sort({createdAt: -1})
     .limit(20)
);

});
app.get('/post/:id',async(req,res)=>{
    const{id}=req.params;
    const postDoc=await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})
app.listen(4000);




      



