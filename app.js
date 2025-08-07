require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(express.json()); // Important to parse JSON requests
const bodyParser = require('body-parser');
const sendAlertToTeams = require('./sendAlert');
app.use(bodyParser.json({ limit: '5mb' }))
// Optional: log all incoming requests
// app.use((req, res, next) => {
//     console.log(req.body)
//   console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
//   next();
// });
const os = require('os');
app.get('/', (req, res) => {
  const hostname = os.hostname();
  res.send(`API Gateway is running on ${hostname}`);
});
app.get('/health', (req, res) => {
  const hostname = os.hostname();
  res.send(`good health on ${hostname}`);
});

// Test route to confirm gateway is alive
app.post('/login', (req, res) => {
  // console.log(req.body,"sanoj")
  // sendAlertToTeams('🚨 Error detected in Node.js app on production server!');
  return res.status(200).json({ status: false, message: "success", data: req.body });
});

// --- PROXY CONFIGURATIONS ---

// Proxy requests starting with /users to User Service
// app.use('/users', createProxyMiddleware({
//   target: 'http://localhost:3001',
//   changeOrigin: true,
//   pathRewrite: { '^/users': '' }, // Remove /users when forwarding
// }));

// // Proxy requests starting with /books to Book Service
// app.use('/books', createProxyMiddleware({
//   target: 'http://localhost:3002',
//   changeOrigin: true,
//   pathRewrite: { '^/books': '' },
// }));

// // Proxy requests starting with /orders to Order Service
// app.use('/orders', createProxyMiddleware({
//   target: 'http://localhost:3003',
//   changeOrigin: true,
//   pathRewrite: { '^/orders': '' },
// }));

// Start API Gateway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
});

