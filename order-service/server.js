const express = require("express");
const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const redisClient = require("../redis-client"); 

const app = express();
app.use(express.json());


mongoose.connect("mongodb://admin:password@localhost:27017/orderdb?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

const orderSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  quantity: Number,
});

const Order = mongoose.model("Order", orderSchema);


const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();


const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer Connected");
  } catch (err) {
    console.error("❌ Kafka Connection Error:", err);
  }
};

connectToKafka();


app.post("/orders", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const order = new Order({ userId, productId, quantity });
  await order.save();

  try {
    
    await producer.send({
      topic: "order-events",
      messages: [{ value: JSON.stringify(order) }],
    });
    console.log("✅ Order event published to Kafka");
  } catch (err) {
    console.error("❌ Kafka Publish Error:", err);
  }

  
  const cacheKey = `order:${order._id}`;
  redisClient.set(cacheKey, JSON.stringify(order), "EX", 60); 

  res.status(201).json(order);
});


app.get("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `order:${id}`;

  
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  
  redisClient.set(cacheKey, JSON.stringify(order), "EX", 60); 

  res.json(order);
});

app.listen(5002, () => {
  console.log("🚀 Order Service running on port 5002");
});