import express from "express";
import axios from "axios";

const app = express();
function stock(sym,price){
    this.sym = sym;
    this.price = price;
}
var symbolArr =[];
var newNote =[];
const apiKey = "CIIS8SWMFJ3H5N0A";

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.listen(3000);

app.post("/submit",async (req,res)=>{

   if(req.body["addedNote"]=="delete"){
        if(symbolArr.length == 0){
            res.render("index.ejs");

        }else{
            symbolArr.pop();
            res.render("index.ejs",{
            symbol: symbolArr
            });
        }
        
    }else if(req.body["addedNote"] ==""){
        res.render("index.ejs",{
            symbol: symbolArr
        });
        
    }else if(req.body["addedNote"] =="refresh"){
        try {
            
            for (let index = 0; index < symbolArr.length; index++) {
                const response = await axios.get("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+symbolArr[index].sym+"&apikey="+apiKey);
                if(response.data["Global Quote"]!==undefined){
                    symbolArr[index].price = response.data["Global Quote"]["05. price"];
                }
            }
             
            res.render("index.ejs",{
            symbol: symbolArr
        });
          } catch (error) {
            console.error(error);
          }
        
    }else{
        try {
            const response = await axios.get("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+req.body["addedNote"]+"&apikey="+apiKey);
            
            if(response.data["Global Quote"]!==undefined){
                symbolArr.push(new stock(response.data["Global Quote"]["01. symbol"],response.data["Global Quote"]["05. price"]));
                
            }else{
                console.log(response.data);
            }
            res.render("index.ejs",{
                symbol: symbolArr
            });
          
          } catch (error) {
            console.error(error);
          }
    }

   

});

app.get("/",(req,res)=>{

    res.render("index.ejs");

});