const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");

const app = express();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

app.use(limiter);


app.use("/users", createProxyMiddleware({ target: "http://localhost:5001", changeOrigin: true }));
app.use("/login", createProxyMiddleware({ target: "http://localhost:5001", changeOrigin: true }));


app.use("/orders", createProxyMiddleware({ target: "http://localhost:5002", changeOrigin: true }));


app.use("/notifications", createProxyMiddleware({ target: "http://localhost:5003", changeOrigin: true }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});