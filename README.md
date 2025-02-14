# Event-Driven Microservices System

This project is an **Event-Driven Microservices System** designed to handle high-throughput real-time data efficiently. It consists of three independently deployable services (**User Service**, **Order Service**, and **Notification Service**) that communicate asynchronously using **Kafka**. The system uses **PostgreSQL** for transactional data, **MongoDB** for caching/events, and **Redis** for caching. It also includes an **API Gateway**, **JWT-based authentication**, **rate limiting**, and monitoring using **Prometheus** and **Grafana**.

---

## Features

### Microservices:
- **User Service**: Handles user registration and authentication (JWT).
- **Order Service**: Handles order creation and publishes events to Kafka.
- **Notification Service**: Listens to Kafka events and handles notifications.

### Event-Driven Architecture:
- Uses **Kafka** for asynchronous communication.
- Implements **Event Sourcing** and **CQRS**.

### Databases:
- **PostgreSQL**: Used for transactional data in the User Service.
- **MongoDB**: Used for caching/events in the Order Service.
- **Redis**: Used for caching frequently accessed data.

### Scalability & Security:
- **API Gateway**: Routes requests to the appropriate services.
- **JWT Authentication**: Ensures secure access to protected endpoints.
- **Rate Limiting**: Prevents abuse by limiting requests to 100 per 15 minutes per IP.

### Performance Optimization:
- **Async Processing**: Kafka ensures asynchronous communication between services.
- **Caching**: Redis reduces database load by caching frequently accessed data.
- **Load Balancing**: Nginx distributes traffic across multiple service instances.
- **Monitoring**: Prometheus and Grafana provide real-time performance monitoring.

---

## Technologies Used
- **Node.js**: Runtime environment for microservices.
- **Express.js**: Web framework for building APIs.
- **Kafka**: Message broker for asynchronous communication.
- **PostgreSQL**: Relational database for transactional data.
- **MongoDB**: NoSQL database for caching/events.
- **Redis**: In-memory data store for caching.
- **JWT**: JSON Web Tokens for authentication.
- **Nginx**: Load balancer for distributing traffic.
- **Prometheus**: Monitoring and alerting toolkit.
- **Grafana**: Visualization tool for metrics.
- **Docker**: Containerization for easy deployment.

---

## Setup Instructions

1. ### Prerequisites
- Install **Docker**.
- Install **Node.js**.

---

2. ### Start Docker Containers
Start Kafka, PostgreSQL, MongoDB, Redis, Prometheus, and Grafana:

``docker-compose up -d``

---

3. ### Install Dependencies
	- Install dependencies for each service:


	- cd user-service && npm install
	- cd ../order-service && npm install
	- cd ../notification-service && npm install
	- cd ../api-gateway && npm install
---

4. ### Start the Services
	Start each service in a separate terminal:


	#### User Service
	``d user-service && npm start``

	#### Order Service
	``cd order-service && npm start``

	#### Notification Service
	``cd notification-service && npm start``

	#### API Gateway
	``cd api-gateway && npm start``

---

5. ### Access the System
	``API Gateway: http://localhost:3000``

	``Prometheus: http://localhost:9090``

	``Grafana: http://localhost:3001``
---

7. ### Monitor Performance
	``Open Prometheus at http://localhost:9090.``

        - Open Grafana at http://localhost:3001 and create dashboards to visualize metrics.

---

   ### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

### Regards

Muhammad Hamza

