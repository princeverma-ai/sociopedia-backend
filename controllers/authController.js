//imports ----------------------------------------------------->
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");

//Secret key -------------------------------------------------->
const secretKey = "o.456456gfddfg@^$%%dfdfthtfgg+54322.sfsdf";

//Sign token -------------------------------------------------->
const signToken = (id) => {
    return jwt.sign({ id }, secretKey);
};

//Exports ---------------------------------------------------->
exports.signup = async (req, res) => {
    try {
        //DATABASE OPERATIONS
        const user = await UserModel.create(req.body);

        //TOKEN
        const token = signToken(user._id);

        //RESPONSE
        user.password = undefined;
        res.status(201).json({
            status: "success",
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//------------------------------------------------------------>

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password",
            });
        }

        // Check if user exists && password is correct
        const user = await UserModel.findOne({ email }).select("+password");

        if (!user || !(await user.checkPassword(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password",
            });
        }

        // If everything ok, send token to client
        const token = signToken(user._id);

        res.status(200).json({
            status: "success",
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//------------------------------------------------------------>
exports.protect = async (req, res, next) => {
    try {
        // Getting token and check of it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        console.log("protected route");

        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in! Please log in to get access",
            });
        }

        //  Verification token
        const decoded = await util.promisify(jwt.verify)(token, secretKey);

        //  Check if user still exists
        const currentUser = await UserModel.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: "fail",
                message: "The user belonging to this token does no longer exist",
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: "fail",
            message: error,
        });
    }
};
