const mongoose = require("mongoose");
 mongoose.connect("mongodb+srv://<Username>:<password?@cluster0.gp01x.mongodb.net/<databaseName>?retryWrites=true&w=majority",{
     useNewUrlParser:true,
     useUnifiedTopology:true
 }).then(()=>{
     console.log(`Database Connected`);
 }).catch((e)=>{
     console.log(e);
 });
