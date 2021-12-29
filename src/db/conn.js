const mongoose = require("mongoose");
 mongoose.connect("mongodb+srv://nikhilramisetty19100:Alliswell%40123@cluster0.gp01x.mongodb.net/eventMern?retryWrites=true&w=majority",{
     useNewUrlParser:true,
     useUnifiedTopology:true
 }).then(()=>{
     console.log(`Database Connected`);
 }).catch((e)=>{
     console.log(e);
 });