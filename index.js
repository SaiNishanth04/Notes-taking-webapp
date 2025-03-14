const express = require('express');
const app= express();
const path=require('path');
const fs=require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',function(req,res){
    fs.readdir(`./files`,function(err, files){
        res.render("index", {files: files});
    })
});

app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('_')}.txt`,req.body.details, function(err){
        res.redirect("/");
    });
});

app.get('/file/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8", function(err, filedata){
        res.render('show',{filename:req.params.filename,filedata:filedata});
    });
});

app.get('/edit/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        res.render('edit', { filename: req.params.filename, filedata: filedata });
    });
});

app.post('/edit',function(req,res){
    let filename = req.body.new.trim();
    if(!filename){
        fs.writeFile(`./files/${req.body.previous}`,req.body.content, function(err){
            if (err) {
                return res.status(500).send("Error updating file content.");
            }
            res.redirect('/');
        });
    }
    else{
        fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,function(err){
            fs.writeFile(`./files/${req.body.new}`,req.body.content, function(err){
                if (err) {
                    return res.status(500).send("Error updating file content.");
                }
                res.redirect('/');
            });
        }); 
    }

    
});

app.post('/delete/:filename',function(req,res){
    fs.unlink(`./files/${req.params.filename}`, function (err) {
        res.redirect('/');
    });
});

app.listen(3000);