const { Server } = require('socket.io');

const setupWebSocket = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  let currentPlayerImage = '';
  let currentBidAmount = '';
  let pause = false;
  let adminSocketId = '';
  let adminConnected = false;
  let popper = false;
  let auctionEnded = false;  // Track auction end state
  let selectedTeam="";
  // Function to emit the current auction state
  const emitCurrentState = (socket) => {
    if (auctionEnded) {
      socket.emit('updateViewer', null);
      socket.emit('bidAmount', null);
      socket.emit('auctionEnded', true);
     
    } else if (pause) {
      console.log("paused while refreshing")
      socket.emit('updateViewer', null);
      socket.emit('bidAmount', null);
      socket.emit('pauseAuction', true);
    } else {
      socket.emit('updateViewer', currentPlayerImage);
      socket.emit('bidAmount', currentBidAmount);
      socket.emit('pauseAuction', false);
      socket.emit('auctionEnded',false);
      pause=false;
      if (selectedTeam) {
        socket.emit('bidConfirmed',popper, selectedTeam);
      } else {
        socket.emit('bidConfirmed', popper,false);
      }
      if (adminSocketId || adminConnected) socket.emit('started', true);
    }
  };

  io.on('connection', (socket) => {
    console.log('A user (viewer) connected:', socket.id);

    socket.on('adminConnected', () => {
      console.log('Admin connected:', socket.id);
      adminSocketId = socket.id;
      auctionEnded = false; // Reset when admin connects
      socket.emit("started", true);
    });

    // Send current state to newly connected client
    emitCurrentState(socket);

    socket.on('requestData', () => emitCurrentState(socket));

    // Update and broadcast player image
    socket.on('updateViewer', (image) => {
      if (auctionEnded) return;
      currentPlayerImage = image;
      io.emit('updateViewer', image);
      pause=false;
    });

    // Update and broadcast bid amount
    socket.on('bidAmount', (amount) => {
      if (auctionEnded) return;
      currentBidAmount = amount;
      io.emit('bidAmount', amount);
    });

    // // Handle bid confirmation
    // socket.on('bidConfirmed', (message) => {
    //   if (auctionEnded) return;
    //   popper = message;
    //   io.emit('bidConfirmed', message);
    // });
    socket.on('bidConfirmed',(message,team)=>{
            popper=message
            selectedTeam=team
            console.log("popper",popper,team)
           io.emit('bidConfirmed',message,team);
          })

    // Handle auction end
    socket.on('endauction', (message) => {
      auctionEnded = true;
      io.emit('endauction', message);
      io.emit('updateViewer', null);
      io.emit('bidAmount', null);
      io.emit('auctionEnded', true);
      
    });

    // Pause auction logic
    socket.on('pauseAuction', (message) => {
      if (auctionEnded) return;
      console.log("Auction paused:", message);
      pause = message;
      io.emit('updateViewer', message ? null : currentPlayerImage);
      io.emit('bidAmount', message ? null : currentBidAmount);
      io.emit('pauseAuction', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      if (socket.id === adminSocketId) {
        console.log('Admin disconnected:', socket.id);
        io.emit('updateViewer',null);
        io.emit('pauseAuction',true)
        adminSocketId = null;
        currentPlayerImage = '';
        currentBidAmount = '';
        adminConnected = true;
      }
    });
  });
};

module.exports = setupWebSocket;
