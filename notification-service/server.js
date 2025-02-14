const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "notification-group" });

const run = async () => {
  try {
    await consumer.connect();
    console.log("✅ Kafka Consumer Connected");
    await consumer.subscribe({ topic: "order-events", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const order = JSON.parse(message.value.toString());
        console.log("Received order event:", order);
        
      },
    });
  } catch (err) {
    console.error("❌ Kafka Connection Error:", err);
  }
};

run().catch(console.error);

console.log("🚀 Notification Service running");