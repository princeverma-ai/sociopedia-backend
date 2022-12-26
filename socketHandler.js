//imports ---------------------------------------------->
const { Server: socketServer } = require("socket.io");
const onlineUserController = require("./controllers/onlineUserController");
const { notificationEmitter } = require("./utils/eventManagment");

//Exports the socket server to be used in the server.js file
exports.initializeSocketServer = (server) => {
    const io = new socketServer(server);

    io.on("connection", (socket) => {
        //connect handler
        socket.on("userID", async (userID) => {
            await onlineUserController.makeOnline(userID, socket.id);
        });

        //notification handler
        notificationEmitter.on(`${socket.id}`, (data) => {
            if (data.like) {
                console.log("like notification");
                io.to(data.socketID).emit("notification", {
                    message: `User ${data.userWhoLiked} liked your post ${data.postId}`,
                });
            }
            if (data.comment) {
                console.log("comment notification");

                io.to(data.socketID).emit("notification", {
                    message: `User ${data.userWhoCommented} commented on your post ${data.postId} with the comment ${data.comment}`,
                });
            }
        });

        //disconnect handler
        socket.on("disconnect", async () => {
            console.log("user disconnected");

            await onlineUserController.makeOffline(socket.id);
        });
    });
};
