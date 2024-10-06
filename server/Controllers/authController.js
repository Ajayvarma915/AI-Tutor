const prisma = require("../utils/db.config");
const prima = require("../utils/db.config");
const bcrypt = require("bcrypt");

exports.Register = async (req, res) => {
  try {
    const { name, email, oauth_id, role, image, password, provider } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "success", message: "Please provide email" });
    }
    const isUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (isUser) {
      return res.status(400).json({
        status: "failed",
        message: "User already exists.",
      });
    }
    const NewUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        provider: provider,
        oauth_id: oauth_id || null,
        image: image || null,
        role: role,
        password:
          provider === "credentials" ? await bcrypt.hash(password, 12) : null,
      },
    });
    NewUser.password = undefined;
    res.status(200).json({
      status: "success",
      data: {
        NewUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password, provider, } = req.body;
    if (provider === "credentials" && (!email || !password))
      return res.status(400).json({
        status: "failed",
        message: "Please provide email and password",
      });
    const user = await prima.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        email: true,
        password: true,
        oauth_id: true,
        image: true,
        provider: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "user don't exists",
      });
    }
    if (provider === "credentials") {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          status: "failed",
          message: "wrong password",
        });
      }
      user.password = undefined;
       return res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
