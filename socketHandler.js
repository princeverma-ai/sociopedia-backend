//imports ---------------------------------------------->
const { Server: socketServer } = require("socket.io");
const onlineUserController = require("./controllers/onlineUserController");
const { notificationEmitter } = require("./utils/eventManagment");
const UserModel = require("./models/userModel");

//Exports the socket server to be used in the server.js file
exports.initializeSocketServer = (server) => {
    const io = new socketServer(server);

    io.on("connection", (socket) => {
        //connect handler
        socket.on("userID", async (userID) => {
            //check if user is already online
            const isOnline = await onlineUserController.checkOnline(userID);
            if (isOnline) {
                //if user is online, update the socket id
                await onlineUserController.makeOffline(isOnline.socketID);
                await onlineUserController.makeOnline(userID, socket.id);
            } else {
                await onlineUserController.makeOnline(userID, socket.id);
            }
        });

        //notification handler
        notificationEmitter.on(`${socket.id}`, (data) => {
            //like notification
            if (data.like) {
                UserModel.findById(data.userWhoLiked)
                    .select("name photo")
                    .then((user) => {
                        io.to(data.socketID).emit("notification", {
                            userName: user.name,
                            postId: data.postId,
                            isLiked: true,
                            userPhoto: user.photo,
                        });
                    });
            }

            //comment notification
            if (data.comment) {
                UserModel.findById(data.userWhoCommented)
                    .select("name photo")
                    .then((user) => {
                        io.to(data.socketID).emit("notification", {
                            userName: user.name,
                            postId: data.postId,
                            isLiked: false,
                            comment: data.comment,
                            userPhoto: user.photo,
                        });
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
