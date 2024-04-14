import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './db/index.js'
import dotenv from 'dotenv'
dotenv.config()
const app = express()


connectDB()

app.use( cors() )
app.use( express.json() )
app.use( express.urlencoded( {extended: true} ) )
app.use( express.static( "public" ) )
app.use( cookieParser() )

app.get('/',(req,res)=>{
    res.send("ye le")
})

//routes import 
import userRouter from './routes/user.routes.js'
import instructorRouter from './routes/instructor.routes.js'
import timeRouter from './routes/meeting.routes.js'
import roomRouter from './routes/room.routes.js'
import sectionRouter from './routes/section.routes.js'
import courseRouter from './routes/course.routes.js'

//routes declaration
app.use( "/api/v1/users", userRouter )
app.use("/api/v1/instructors",instructorRouter)
app.use("/api/v1/timings",timeRouter)
app.use("/api/v1/rooms",roomRouter)
app.use("/api/v1/sections",sectionRouter)
app.use("/api/v1/courses",courseRouter)

const port = process.env.PORT || 6000

app.listen( port, () =>
{
    console.log( `Server running on port ${ port }` );
} )