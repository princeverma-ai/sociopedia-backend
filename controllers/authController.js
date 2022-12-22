//imports ----------------------------------------------------->

//Exports ---------------------------------------------------->
exports.signup = (req, res) => {
    res.status(201).json({
        message: "Signup route",
    });
};

//------------------------------------------------------------>

exports.login = (req, res) => {
    res.status(200).json({
        message: "Login route",
    });
};

//------------------------------------------------------------>

exports.logout = (req, res) => {
    res.status(200).json({
        message: "Logout route",
    });
};
