const jwt = require('jsonwebtoken');
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY; 
const adminlogin = (req, res) => {
    try {
        console.log("body:",req.body);
        const adminID = req.body.adminId;
        const adminPD = req.body.password;
        console.log("UserAdmin:",process.env.userid,"password:",process.env.password);
        if (adminID === process.env.userid && adminPD === process.env.password) {
            console.log('Admin LoggedIn')
            console.log('SECRET_KEY:', process.env.SECRET_KEY);
            const payload = {
                id: adminID,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (60 * 60*60*60),
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY)
            res.status(200).json({ token })
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch(err) {
        res.status(400).json({ message: "Internal service error" });
    }
}
const verify = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; 
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    return res.status(200).json({ message: "Token is valid", user: decoded });
  });
};
module.exports = {adminlogin,verify};