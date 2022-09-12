// ------------------Mongoose를 이용한 REST API Express 서버 웹 소켓----------------------------
// let io;

// module.exports = {
//     init: httpServer => {
//         io = require('socket.io')(httpServer, {
//             cors: {
//               origin: '*',
//               methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//               allowedHeaders: ['Content-Type', 'Authorization']
//             }
//           });
//         return io;
//     },
//     getIO: () => {
//         if (!io) {
//             throw new Error('Socket.io not initialized.');
//         }
//         return io;
//     }
// };