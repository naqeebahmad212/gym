const Jim = require("../models/Jim.model");
const { createError } = require("../utils/error");
const User = require("../models/User.model");
const Package = require("../models/Packages.model");
const CrudServices = require("../utils/crudServices");
const { pick, App_host } = require("../utils/pick");
const { AddJIM } = require("../validator/Jim.validor");
const { upload } = require("../middleware/multer");
const bcrypt = require("bcrypt");
const { AddTransaction } = require("./expenses.controller");
const Packages = require("../models/Packages.model");
const { addNotification } = require("./Notification.controller");
require("dotenv").config();

module.exports = {
  ////////////////////////////////////////////////////////////////////////////////////////

  //////////////// request to create user /////////////////
  async addBusinessLocation(req, res, next) {
    try {
      const { error } = AddJIM.validate(req.body);
      if (error) {
        return next(createError(404, error.message));
      }

      const checkBusinessLocation = await Jim.findOne({
        name: {
          $regex: "^" + req.body.gymName + "$",
          $options: "i",
        },
      });
      if (checkBusinessLocation) {
        return next(createError(404, "A Gym with this name already exists"));
      }

      if (!req.body.status) {
        req.body["status"] = "inactive";
      }

      // let AdminPackage = await Packages.findOne({
      //   is_admin_package: true,
      // });
      // if (!AdminPackage) {
      //   return next(createError(404, "Ask Admin to add a package"));
      // }

      // req.body["package"] = AdminPackage._id.toString();
      req.body["name"] = req.body.gymName;
      req.body["adress"] = req.body.gymAddress;
      req.body["created_at"] = new Date();
      req.body["updated_at"] = new Date();
      req.body["images"] = [];

      if (req.files && req.files.length) {
        req.files.forEach((element) => {
          req.body["images"].push(
            `${App_host}profile/images/${element.filename}`
          );
        });
      }

      let businessLocation = new Jim(req.body);

      let userExist = await User.findOne({
        email: req.body.email,
      });
      if (userExist) {
        return next(createError(404, "A User with this email already exists"));
      }

      req.body["isJimAdmin"] = true;

      req.body["BusinessLocation"] = [
        {
          Gym: businessLocation._id.toString(),
          package: req.body.package,
        },
      ];

      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(req.body.password, salt);

      let user = new User({
        ...req.body,
        password: hash,
      });

      businessLocation["Owner"] = user._id.toString();
      businessLocation["created_by"] = user._id.toString();

      await businessLocation.save();
      await user.save();

      if (req.body.status === "inactive") {
        await addNotification(
          "gym",
          businessLocation._id.toString(),
          `New gym request from ${req.body.name}`
        );
      }

      // await AddTransaction(req.body.package, user._id.toString(), businessLocation._id.toString(), next);

      console.log("req.body", req.body);
      console.log("businessLocation", businessLocation);

      return res.status(200).send({
        success: true,
        message: "registered",
        status: 200,
        data: businessLocation,
      });
    } catch (error) {
      next(error);
    }
  },
  ///////////// get all Business Location /////////////////
  async getAllBusinessLocation(req, res, next) {
    const packages = await Package.find({ is_jim_package: true }).populate({
      path: "BusinessLocation",
    });

    // res.status(200).json({ packages });
    try {
      let filterdata = req.query;
      let filter = {};
      if (filterdata.search) {
        filter["$or"] = [
          {
            name: {
              $regex: ".*" + filterdata.search + ".*",
              $options: "i",
            },
          },
        ];
      }
      if (filterdata.status) {
        if (filterdata.status === "pending") {
          filter["status"] = "pending";
        } else if (filterdata.status === "active") {
          filter["$or"] = [{ status: "active" }, { status: "inactive" }];
        }
      }
      if (filterdata.filter) {
        if (filterdata.status === "pending") {
          filter["$and"] = [
            { status: { $eq: "pending" } },
            {
              $or: [{ payment_status: filterdata.filter }],
            },
          ];
        } else {
          filter["$and"] = [
            { status: { $ne: "pending" } },
            {
              $or: [{ payment_status: filterdata.filter }],
            },
          ];
        }
      }
      const options = pick(req.query, ["limit", "page"]);
      const limit = parseInt(options.limit) || 10; // Default limit to 10 if not provided
      const page = parseInt(options.page) || 1; // Default page to 1 if not provided
      const skip = (page - 1) * limit;
      const businessLocations = await CrudServices.getList(Jim, filter, {
        skip,
        limit,
      });
      const totalBusinessLocations = await Jim.countDocuments(filter);
      const totalPages = Math.ceil(totalBusinessLocations / limit);
      return res.status(200).json({
        success: true,
        message: "All users",
        status: 200,
        data: { businessLocations, totalPages },
        packages,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  ///////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////

  ///////////// get single  BusinessLocation /////////////////
  async getOneBusinessLocation(req, res, next) {
    try {
      const { id } = req.query;
      const fields = req.query.fields
        ? req.query.fields.split(",").join(" ")
        : "";

      const JimDetail = await Jim.findOne({ _id: id }).select(fields);
      return res.status(200).json({
        success: true,
        message: "Gym Data",
        status: 200,
        data: JimDetail,
      });
    } catch (error) {
      next(error);
    }
  },
  ///////////// Update Business Location /////////////////
  async updateaBusinessLocation(req, res, next) {
    try {
      const updateLocation = await Jim.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "User Data",
        status: 200,
        data: updateLocation,
      });
    } catch (error) {
      next(error);
    }
  },

  ///////////// delete Business Location
  async deleteLocation(req, res, next) {
    try {
      const deleteLocation = await Jim.findByIdAndDelete(req.params.id);
      return res.status(200).send({
        success: true,
        message: "User Deleted",
        status: 200,
        data: deleteLocation,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
