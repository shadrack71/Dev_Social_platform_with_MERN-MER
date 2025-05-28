const express = require('express')
const connectDB = require('./config/db')

const app = express()

const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')
const profileRoutes = require('./routes/profile')

// connect database
connectDB()

app.get('/', (req,res) => res.send('API running'))

// define routes
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/profile',profileRoutes)
app.use('/api/posts',postRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`server started on port ${PORT}`))