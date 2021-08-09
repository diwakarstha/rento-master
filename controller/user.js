const { User, validateRegister, validateLogin } = require("../models/user");
const upload = require("../middleware/upload");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports = {
  insert: async (req, res) => {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists !!");

    const userCount = await User.find().countDocuments();
    req.body.userTag = `RR${userCount}`;

    //create user
    user = new User(
      _.pick(req.body, [
        "name",
        "email",
        "password",
        "phone",
        "userRole",
        "userTag",
      ])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    console.log(token);
    user.token = token;
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email", "token"]));
  },

  uploadDocument: async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) res.status(404).send("User Not Found");

    if (user.documentImagePath)
      await unlinkAsync("client-rento/public/" + user.documentImagePath);

    await upload(req, res);
    documentPath = req.customPath + req.files[0].filename;

    user.set({
      documentImagePath: documentPath,
    });
    await user.save();

    console.log(documentPath);
    res.send(documentPath);
  },

  login: async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // if (req.body.userRole !== "Tenant" && req.body.userRole !== "RoomOwner")
    //   return res.status(400).send("Invalid Email/ Password!!");

    let user = await User.findOne({
      userRole: req.body.userRole,
      email: req.body.email,
    });
    if (!user) return res.status(400).send("Invalid Email/ Password!!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid Email/ Password!!");

    const token = user.generateAuthToken();
    res.send(token);
  },

  adminLogin: async (req, res) => {
    req.body.userRole = "Admin";
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
      userRole: "Admin",
      email: req.body.email,
    });
    if (!user) return res.status(400).send("Invalid Email/ Password1!!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid Email/ Password2!!");

    const token = user.generateAuthToken();
    res.send(token);
  },

  fetchUserData: async (req, res) => {
    const userData = await User.findOne({
      userRole: req.user.userRole,
      _id: req.user._id,
    }).select("-password");
    res.send(userData);
  },

  getTotalUser: async (req, res) => {
    const total = await User.find().countDocuments();
    res.send("" + total);
  },
  userCreatedToday: async (req, res) => {
    const data = await User.find({
      dateCreated: new Date().toISOString().slice(0, 10),
    }).countDocuments();
    res.send("" + data);
  },

  verify: async (req, res) => {
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { verified: true }
    );
    res.send(`User ${user.name} was verified`);
  },
  decline: async (req, res) => {
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { declined: true }
    );
    res.send(`User ${user.name}'s verification was declined`);
  },

  changePassword: async (req, res) => {
    let user = await User.findOne({
      userRole: req.body.userRole,
      _id: req.body.id,
    });
    if (!user) return res.status(400).send("Invalid Email/ Password!!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(401).send("Incorrect Old Password");

    if (req.body.password1 === req.body.password)
      return res
        .status(400)
        .send("New Password cannot be same as old Password");

    if (req.body.password1 !== req.body.password2)
      return res.status(400).send("Passwords Doesnot Match");

    user.set({
      password: req.body.password1,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send("Password Chaged Succesfully");
  },

  fetchUserData: async (req, res) => {
    const userData = await User.findOne({
      userRole: req.user.userRole,
      _id: req.user._id,
    }).select("-password");
    res.send(userData);
  },

  editProfileData: async (req, res) => {
    const value = await User.updateOne(
      { _id: req.body.id },
      { name: req.body.name, email: req.body.email, phone: req.body.phone }
    );
    res.send("Profile Updated");
  },

  getVerifyUser: async (req, res) => {
    const value = await User.find({ verified: false })
      .and({ documentImagePath: { $exists: true } })
      .and({ declined: false });
    res.send(value);
  },
};
