import express from 'express';
import { set, connect } from 'mongoose';
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createPost } from "./controllers/post.js";
import userRoutes from './routes/users.js'
import questionRoutes from './routes/Questions.js'
import answerRoutes from './routes/Answers.js'
import paymentRoute from './routes/payment.js'
import postRoutes from "./routes/post.js";
// import { verifyToken } from "./middleware/auth.js";
set("strictQuery", false);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({origin:"https://stack-overflow-p1.netlify.app"}));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });



export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

app.get('/',(req, res) => {
    res.send("This is a Stack overflow clone API")
})

app.post("/posts", upload.single("picture"), createPost);

app.use('/user', userRoutes)
app.use('/questions',questionRoutes)
app.use('/answer', answerRoutes)
app.use("/api", paymentRoute);
app.use("/posts", postRoutes);


app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);



const PORT = process.env.PORT || 5000

const DATABASE_URL = process.env.CONNECTION_URL
connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message));