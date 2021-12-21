const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes')
const fetchUser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

// Route 1 to get all notes of user login required
router.get('/getnotes',fetchUser,async(req,res)=>{
try{

    const notes = await Notes.find({user:req.user.id})
    res.json(notes);

}catch{

}
})

// Route 2 to post all notes of user login required
router.post('/addnotes',body('description','description cannot be empty').exists(),fetchUser,async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const {title,description,tag}= req.body;

    try{

const notes = new Notes({
title:title,
description:description,
tag:tag,
user:req.user.id
})

const savedNotes = await notes.save();
res.json(savedNotes)

}catch{

}
})

// Route 2 to post all notes of user login required
router.put('/updatenotes/:id',fetchUser,async(req,res)=>{

    try{

    

const {title,description,tag}=req.body;
const newNote = {};
if(title){newNote.title= title}
if(description){newNote.description=description}
if(tag){newNote.tag = tag}

let note = await Notes.findById(req.params.id)
if(!note){
    return res.status(404).send("not found")
}
if(note.user.toString()!=req.user.id){
    return res.status(401).send("not allowed")
    
}
 
note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true});

res.send(note)
    }
    catch{

    }

})



// Route 3 for deleting existing note using Delete 
router.delete('/delete/:id',fetchUser,async(req,res)=>{
    try{
    let note = await Notes.findById(req.params.id);
    if(!note){
    return res.status(404).send("not found")
    }
    if(note.user.toString()!=req.user.id){
    return res.status(401).send("not allowed")
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"msg":"is it deletd you can chill"})
}
catch(err){
    res.status(501).send("server error")
}

})

module.exports = router