const express = require("express");

const router = express.Router();


router.post("/register", async (req, res) => {
  const { email, role } = req.body;
  try {
    let user = new role({
      email,
      role,
    });

    await user.save();
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/login", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await role.findOne({ email });
    if (user) {
      return res.status(200).json({ role: user.role });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
