const express = require('express')

require('./db/mongoose')

const User = require('./models/user')

const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())

//links to user router and task router.
app.use(userRouter)
app.use(taskRouter)

app.listen(port , () => {
 console.log("server is up on " + port)
})


