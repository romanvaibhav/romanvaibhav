const express=require("express");
const fs=require("fs");
const users=require("./MOCK_DATA.json")

const app=express();
const PORT=8000;

app.use(express.urlencoded({extended:false}));
app.use((req,res,next)=>{
    fs.appendFile("log.txt", `${Date.now()}: ${req.method}: ${req.path}\n`, ((err,data)=>{
        next();
    }));
});
app.use((req,res,next)=>{
    console.log("Hello from middleware 1");
    next();
});
app.get("/", (req,res)=>{
    return res.json(users);
});
app.get("/api/users", (req,res)=>{
    const html=`
    <ul>
    ${users.map((element)=> `<li>${element.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});
app.route("/api/users/:id").get((req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=> user.id===id);
    return res.json(user);
}).patch((req,res)=>{
    const id=Number(req.params.id);
    const index=users.findIndex(user => {
        if(user.id===id){
            user.first_name="Gauri";
        }});

    //Edit user with id
    return res.json({status:"Pending"});
}).delete((req,res)=>{
    //Delete user with id
    const id=Number(req.params.id);
    // users.pop(id)
    // return res.json({status:"Pending"});
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        // Remove the user from the array
        users.splice(index, 1);
        return res.json({ status: "User deleted successfully" });
    } else {
        return res.status(404).json({ status: "User not found" });
    }
});

app.post("/api/users", (req,res) =>{
    const body=req.body;
    users.push({...body, id:users.length+1})
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        return res.json({status:"Pending",id:users.length})
    })
});

app.listen(PORT, ()=>console.log(`Server started at Port ${PORT}`));