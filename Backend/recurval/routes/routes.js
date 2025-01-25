const express = require("express");
const candidate = require("../model/candidate");
const role = require("../model/role");

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

router.post("/profile", async (req, res) => {
  const { name, email, resumeLink } = req.body;
  try {
    let user = await candidate.findOne({ email });
    if (user) res.status(400).json({ msg: "User already exists" });
    user = new candidate({
      name,
      email,
      resumeLink,
    });

    await user.save();
    return res.status(200).json({ msg: "User saved successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/profile/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, resumeLink } = req.body;

  try {
    const user = await candidate.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.resumeLink = resumeLink || user.resumeLink;

    await user.save();

    return res.status(200).json({ msg: "User updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
