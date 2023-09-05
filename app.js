//jshint esversion:6
const  express = require("express");
const  bodyParser = require("body-parser");
const  mongoose = require("mongoose");
const  User = require("./entity/user");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))


mongoose.connect('mongodb://0.0.0.0:27017/userDB',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err => console.log(err));


app.get("/",function(req,res){
    res.render("home.ejs")
})  


app.get("/login",function(req,res){
    res.render("login.ejs")
})  

app.get("/register", function(req,res){
    res.render("register.ejs");
})  

app.post("/register",async function(req,res){


    const hash = await bcrypt.hash(req.body.password,saltRounds);

    await User.create({
        email:req.body.username,
        password:hash
    }).catch(err => console.log(err))

    res.render("secrets.ejs");
})

app.post("/login",async function(req,res){

    const username = req.body.username;

    const loggedUser = await User.findOne({
        email:username,
    }).catch((err)=>console.log(err.message));

    const match = await bcrypt.compare(req.body.password,loggedUser.password)

    if(match)
    res.render("secrets.ejs");
    else
    res.redirect("/")

})


app.listen(port,()=>{
    console.log(`Server is up on ${port}`);
})
