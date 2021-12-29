const express  = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const Register = require("./models/registers"); 
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);


app.get("/", (req,res)=>{
    res.render("index",{loggedIn:false});
})
app.get("/register", (req,res)=>{
    res.render("register",{isMatching:true});
})
app.get("/login", (req,res)=>{
    res.render("login");
})
app.post("/register", async(req,res)=>{
    try{
        if(req.body.password===req.body.cpassword){
            if(Register.findOne({email:req.body.email}).count()>0){
                console.log(Register.findOne({email:req.body.email}));
                res.render("register",{isMatching:false, message:"Email already exists"});
            }
            else{
                const registerData = new Register({
                    firstname : req.body.firstname,
                    lastname : req.body.lastname,
                    email : req.body.email,
                    phone : req.body.phone,
                    password : req.body.password
                });
                const registered = await registerData.save();
                res.render("index", {firstname:registerData.firstname, lastname:registerData.lastname, loggedIn:true, email:registerData.email, events:registerData.events, passwordIncorrect:false});
            }
        }
        else{
            res.render("register",{isMatching:false, message:"Passwords don't match"});
        }        
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }
})
app.post("/login", async(req,res)=>{
    try{
        const user = await Register.findOne({email:req.body.email});
        if(user.password===req.body.password){
            res.render("index", {firstname:user.firstname, lastname:user.lastname, loggedIn:true, email:user.email, events:user.events});
        }
        else{
            res.render("login", {incorrectPassword:true})
        }

    }
    catch(error){
        console.log(error);
        res.status(400).send("Email Not Valid");
    }
})
app.post("/index", async(req,res)=>{
    try{
        console.log(req.body.user);
        const user = await Register.findOne({email:req.body.user});
        if(req.body.password === user.password){
                const events = user.events;
            const jso = {
                eventid: Math.random() * 100000000000000,
                eventname: req.body.eventname
            };
            events.push(jso);
            const updated = await Register.updateOne({email:req.body.user}, {$set:{events:events}});
        res.render("index",{firstname:user.firstname, lastname:user.lastname, loggedIn:true, email:user.email, events:user.events, passwordIncorrect:false});
        }
        else{
        res.render("index",{firstname:user.firstname, lastname:user.lastname, loggedIn:true, email:user.email, events:user.events, passwordIncorrect:true});

        }        
    }
    catch(error){
        console.log(error);
    }
})
app.post("/index-update", async(req,res)=>{
    try{
        var array = [0];
        if(Array.isArray(req.body.done)){
            array = array.concat(req.body.done);
        }
        else{
            console.log(req.body.done);
            array.push(req.body.done);
        }
        const user = await Register.findOne({email:req.body.email});
        console.log(array);
        var filteredEvents = user.events;
        for(var i=0;i<array.length;i++){
            filteredEvents = filteredEvents.filter((item) => parseInt(item.eventid) !== parseInt(array[i]));
        }
        const updated = await Register.updateOne({email:req.body.email}, {$set:{events:filteredEvents}});
        // res.send("Done");
        res.render("index",{firstname:user.firstname, lastname:user.lastname, loggedIn:true, email:user.email, events:filteredEvents, passwordIncorrect:true});
    }
    catch(error){console.log(error);}
})
app.listen(port,()=>{
    console.log("Server running on 3000");
});