//jshint esversion:6
const  express = require("express");
const  bodyParser = require("body-parser");
const  mongoose = require("mongoose");
const  User = require("./entity/user");
const  md5 = require("md5");

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

    await User.create({
        email:req.body.username,
        password:md5(req.body.password)
    }).catch(err => console.log(err))
    res.render("secrets.ejs");

})

app.post("/login",async function(req,res){

    const username = req.body.username;
    const password = md5(req.body.password);

    const loggedUser = await User.findOne({
        email:username,
        password:password
    }).catch((err)=>console.log(err.message));


    if(loggedUser)
    res.render("secrets.ejs");
    else
    res.redirect("/")

})


app.listen(port,()=>{
    console.log(`Server is up on ${port}`);
})
