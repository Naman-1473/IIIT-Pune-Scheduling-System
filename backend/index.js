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

//routes declaration
app.use( "/api/v1/users", userRouter )

const port = process.env.PORT || 6000

app.listen( port, () =>
{
    console.log( `Server running on port ${ port }` );
} )