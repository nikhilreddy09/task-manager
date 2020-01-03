const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks' , auth ,  async (req,res) => {


    // const task =  new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {
        const tasks = await task.save()
        res.status(201).send(tasks)
    }catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id',auth, async (req,res) => {

    const _taskid = req.params.id
    try {
        const task = await Task.findOne({ _id : _taskid, owner : req.user._id})

    if(!task) {
        return res.status(500)
    }
    res.send(task)
    }catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id',auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValid) {
        return res.status(400).send({'error' : 'invalid operation'})
    }
    try {
        const task = await Task.findOne({ _id : req.params.id , owner : req.user._id})
      
    // const task = await Task.findByIdAndUpdate(req.params.id , req.body , { new : true , runValidators : true})
    if(!task) {
        return res.status(404).send()
    }
    updates.forEach((update) => {

        task[update] = req.body[update]
    })
    await task.save()
    res.send(task)
    }catch (e) {

     res.status(400).send(e)

    }


})

//GET/tasks?completed=false
//limit skip pagination.
//get/tasks?limit = 10&skip=10
//GET/tasks?sortBy=createdAt:desc/asc
router.get('/tasks' , auth , async (req,res) => {


    const match = { }

    const sort = { }

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // const tasks = await Task.find({})

        // const tasks = await Task.find({ owner : req.user._id})
        await req.user.populate({
            path : 'tasks',
            match ,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort 
            }
        }).execPopulate()

        res.send(req.user.tasks)
    }catch (e) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id' , auth , async (req,res) => {
    try {
        // const del = await Task.findByIdAndDelete(req.params.id)
        const del = await Task.findOneAndDelete({ owner : req.user._id , _id : req.params.id})

        if(!del) {
            return res.status(404).send()
        }
        res.send(del)
    }catch (e) {
        res.status(500).send()
    }


})


module.exports = router