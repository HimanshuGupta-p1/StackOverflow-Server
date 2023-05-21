import express from 'express';
import { set, connect } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import userRoutes from './routes/users.js'
import questionRoutes from './routes/Questions.js'
import answerRoutes from './routes/Answers.js'
import paymentRoute from './routes/payment.js'
set("strictQuery", false);

const app = express();
dotenv.config()
app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
// app.use(cors());
app.use(cors({origin:"https://stack-overflow-p1.netlify.app"}));


export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

app.get('/',(req, res) => {
    res.send("This is a Stack overflow clone API")
})

app.use('/user', userRoutes)
app.use('/questions',questionRoutes)
app.use('/answer', answerRoutes)
app.use("/api", paymentRoute);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);



const PORT = process.env.PORT || 5000

const DATABASE_URL = process.env.CONNECTION_URL
connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message));