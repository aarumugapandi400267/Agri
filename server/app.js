import express from 'express'
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import bodyParser from "body-parser"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import cartRoutes from "./routes/customer/cart.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import errorHandler from './middlewares/errorMiddleware.js'
import cors from "cors"
import {order,verify,cancel,verifyAccount} from "./controllers/paymentController.js"
import adminRoutes from "./routes/adminRoutes.js"
import { adminRegister } from './controllers/admincontroller.js'
dotenv.config()
connectDB() 

const app = express()

app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
}))

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/payment",paymentRoutes)
app.use("/api/admin", adminRoutes) 

app.post('/register', adminRegister);

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`))