var express=require("express"),
app=express(),
bodyParser=require("body-parser"),
mongoose=require("mongoose");
methodOverride=require("method-override");
expressSanitizer=require("express-sanitizer");


//app config
mongoose.connect('mongodb://localhost/restful_blog_app', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
mongoose.set;
mongoose.set('useCreateIndex', true);
app.use(expressSanitizer());


//mongoose model config
var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog=mongoose.model("Blog", blogSchema);

// Blog.create({
//     title:"Blog 3",
//     image:"https://images.unsplash.com/photo-1553882809-a4f57e59501d?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
// 	body:"Just another Blog demo!"
// }, function(err,blog){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log(blog);
// 	}
// });

app.get("/",function(req,res){
    res.redirect("/blogs");
})

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index",{blogs: blogs});
        }
    });
})

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
            if (err){
                res.render("new");
            } else {
                //then redirect to the index
                res.redirect("/blogs");
            }
    });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show",{blog:foundBlog});
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog:foundBlog});
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    //destroy that blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})


app.listen(3007,function(){
    console.log("SERVER IS RUNNING AT PORT 3007!");
})