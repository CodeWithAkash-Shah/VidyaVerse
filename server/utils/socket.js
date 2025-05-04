const { Server } = require('socket.io');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinClass', (classId) => {
      socket.join(classId);
    });

    socket.on('postDoubt', (doubt,classId) => {
      io.to(classId).emit('newDoubt', doubt);
    });

    socket.on('postAnswer', ({ doubtId, classId, answer }) => {
      io.to(classId).emit('newAnswer', { doubtId, answer });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;