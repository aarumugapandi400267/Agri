import express from 'express'
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import bodyParser from "body-parser"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import errorHandler from './middlewares/errorMiddleware.js'
import cors from "cors"

dotenv.config()
connectDB() 

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
}))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reviews", reviewRoutes)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`))