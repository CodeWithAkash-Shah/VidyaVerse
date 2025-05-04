const express = require('express');
const cors = require('cors');
const http = require("http");
require('dotenv').config();
const connectDB = require('./config/db');
const v1ApiRoutes = require('./routes/v1');
const initializeSocket = require("./utils/socket");
const port = process.env.PORT || 5000;
// require('./cronJobs'); 

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

const corsOptions = {
  origin: [process.env.CLIENT_URL , 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());
app.set("io", io);
connectDB();


// All routes defined in routes/v1/index.js will be prefixed with /api/v1 | v1 is the version of the API
app.use('/api/v1', v1ApiRoutes);

server.listen(port, () => {
  console.log(`Backend running on ${port}`);
});

