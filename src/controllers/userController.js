const User = require("../models/User");
const { Parser } = require("json2csv");

// CREATE USER
const cloudinary = require("../config/cloudinary");

const createUser = async (req, res) => {
  try {
    let imageUrl = "";

    // UPLOAD IMAGE TO CLOUDINARY
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");

      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "users",
      });

      imageUrl = result.secure_url;
    }

    const user = await User.create({
      firstName: req.body.firstName,

      lastName: req.body.lastName,

      email: req.body.email,

      mobile: req.body.mobile,

      gender: req.body.gender,

      status: req.body.status,

      location: req.body.location,

      profileImage: imageUrl,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL USERS WITH PAGINATION
const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE USER
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const updateData = {
      firstName: req.body.firstName,

      lastName: req.body.lastName,

      email: req.body.email,

      mobile: req.body.mobile,

      gender: req.body.gender,

      status: req.body.status,

      location: req.body.location,
    };

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SEARCH USER
const searchUsers = async (req, res) => {
  try {
    const query = req.query.query;

    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: query,
            $options: "i",
          },
        },

        {
          lastName: {
            $regex: query,
            $options: "i",
          },
        },

        {
          email: {
            $regex: query,
            $options: "i",
          },
        },

        {
          mobile: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// EXPORT CSV
// EXPORT CSV
const exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find();

    const fields = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "gender",
      "status",
      "location",
      "profileImage",
    ];
    const json2csv = new Parser({ fields });

    const csv = json2csv.parse(users);

    res.header("Content-Type", "text/csv");

    res.attachment("users.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  searchUsers,
  exportUsersCSV,
};
