const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const connectDB = require("./src/utils/mongoDB");

// Middleware
app.use(morgan("combined"));
app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Kết nối database
connectDB();

// Cấu hình để truy cập file tĩnh từ public
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/articles", express.static(path.join(__dirname, "public/articles")));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "public")));

// Import và sử dụng router ảnh
const imageRouter = require("./src/routers/imageRoutes"); 
app.use("/api/images", imageRouter); 

const accountRouter = require("./src/routers/accountRouter");
app.use("/api/account", accountRouter);

const informationRouter = require("./src/routers/informationRouter");
app.use("/api/information", informationRouter);

const articleRouter = require("./src/routers/articleRouter");
app.use("/api/article", articleRouter);

const commentRouter = require("./src/routers/commentRouter");
app.use("/api/comment", commentRouter);

// Middleware 404
app.use((req, res, next) => {
  console.log("404 middleware hit");
  res.status(404).json({ error: "Không tìm thấy tài nguyên." });
});

// Khởi động server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
