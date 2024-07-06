const User = require("../models/User.model");
const mongoose = require("mongoose");
const gymPayment = require("../models/gymPaymentModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");
const CrudServices = require("../utils/crudServices");
const { pick, App_host } = require("../utils/pick");
const {
  Adduser,
  UpdateUser,
  RegisterUserSchema,
} = require("../validator/user.validation");
const { AddTransaction } = require("./expenses.controller");
const { JimActiveUser } = require("./Attendence.controller");
const Jim = require("../models/Jim.model");
const { addNotification } = require("./Notification.controller");
require("dotenv").config();

module.exports = {
  ////////////////////////////////////////////////////////////////////////////////////////

  //////////////// request to create user /////////////////
  async addUser(req, res, next) {
    try {
      // createError
      const { error } = Adduser.validate(req.body);
      if (error) {
        return next(createError(404, error.message));
      }
      let email = req.body.email;
      const checkuser = await User.findOne({
        email: email,
        // 'BusinessLocation.Gym':  req.body.BusinessLocation
      });

      // if (checkuser) {
      //    return next(createError(404, "A user Already Registered"))
      // }

      let enrollGym = req.body.BusinessLocation;

      if (
        checkuser &&
        checkuser.BusinessLocation &&
        checkuser.BusinessLocation.length > 0
      ) {
        checkuser.BusinessLocation.push({
          Gym: enrollGym,
          package: req.body.package,
          status: "pending",
        });

        await checkuser.save();
        return res.status(200).send({
          success: true,
          message: "registered",
          status: 200,
          data: checkuser,
        });
      } else {
        req.body["BusinessLocation"] = [
          {
            Gym: enrollGym,
            package: req.body.package,
            status: "pending",
            payment_status: "unpaid",
          },
        ];

        // checkuser.BusinessLocation.push({
        //    Gym: enrollGym,
        //    package: req.body.package
        // })
      }

      if (req.files && req.files.length) {
        let element = req.files[0];
        req.body["images"] = `${App_host}profile/images/${element.filename}`;
      }
      if (!req.body.status) {
        req.body["status"] = "inactive";
      }

      // const salt = bcrypt.genSaltSync(10)
      // const hash = await bcrypt.hashSync(req.body.password, salt)

      // is there could be another way
      const updatedUser = await User.findByIdAndUpdate(
        checkuser?._id,
        req.body,
        { new: true }
      );

      if (!req.body.status) {
        await addNotification(
          "user",
          checkuser?._id.toString(),
          `new user Request from ${req.body.full_name}`
        );
      }

      //  const saveData =   await checkuser.save()

      console.log("user", updatedUser);

      // await AddTransaction(req.body.package, user._id.toString(), enrollGym, next)

      return res.status(200).send({
        success: true,
        message: "registered",
        status: 200,
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  async updateUserPackageOnline(req, res) {
    const { userId, pkgId } = req.body;
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId, "BusinessLocation.package": pkgId },

        {
          $set: {
            "BusinessLocation.$.paymentMethod": "online",
            "BusinessLocation.$.payment_status": "paid",
            "BusinessLocation.$.status": "active",
            "BusinessLocation.$.updated_on": new Date(),
            "BusinessLocation.$.active_date": new Date(),
            "BusinessLocation.$.inActive_date": thirtyDays,
          },
          payment_status: "paid",
        },
        { new: true }
      );

      // user.payment_status = "paid";
      // await user.save();
    } catch (error) {
      console.error("Error updating BusinessLocation:", error);
      throw error;
    }
  },
  async updateUserPaymentMethod(req, res) {
    const { userId, pkgId } = req.query;
    const user = await User.findOneAndUpdate(
      { _id: userId, "BusinessLocation.package": pkgId },
      {
        $set: {
          "BusinessLocation.$.paymentMethod": "physical",
        },
      },
      { new: true }
    );
    res.status(200).json({ success: true, user });
  },

  async registerUser(req, res, next) {
    console.log("registerUser", req.body);

    try {
      const { error } = RegisterUserSchema.validate(req.body);
      if (error) {
        return next(createError(404, error.message));
      }

      const email = req.body.email;
      const checkuser = await User.findOne({ email: email });

      if (checkuser) {
        return next(
          createError(404, "A user is already registered with this email")
        );
      }

      if (req.files && req.files.length) {
        const element = req.files[0];
        req.body["images"] = `${App_host}/${element.filename}`;
      }

      if (!req.body.status) {
        req.body["status"] = "active";
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const user = new User({
        ...req.body,
        password: hash,
      });

      await user.save();
      if (!req.body.status) {
        await addNotification(
          "user",
          user._id.toString(),
          `New user request from ${req.body.full_name}`
        );
      }

      let { password, ...info } = user;
      return res.status(200).send({
        success: true,
        message: "User registered successfully",
        status: 200,
        data: info._doc,
      });
    } catch (error) {
      next(error);
    }
  },
  ////////////////////////////////////////////////////////////////////////////////////////////

  //////////////// login request for user /////////////////
  async login(req, res, next) {
    try {
      const checkuser = await User.findOne({ email: req.body.email }).populate(
        "BusinessLocation.Gym"
      );
      if (!checkuser) {
        return next(createError(404, "invalid email"));
      }

      const checkpassword = await bcrypt.compareSync(
        req.body.password,
        checkuser.password
      );
      if (!checkpassword) {
        return next(createError(404, "wrong password"));
      }
      if (checkuser.status === "inactive") {
        return next(
          createError(
            404,
            "contact with administration to Approve your Account"
          )
        );
      }
      let { password, ...info } = checkuser._doc;

      const token = await jwt.sign(
        {
          id: checkuser._id,
          isAdmin: checkuser.isAdmin,
          BusinessLocation: checkuser.BusinessLocation[0],
          isJimAdmin: checkuser.isJimAdmin,
        },
        "gymmanage"
      );
      return res.status(200).send({
        success: true,
        message: "logged in",
        status: 200,
        data: { info, token },
      });
    } catch (error) {
      next(error);
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////

  ///////////// get all user /////////////////
  async getAllByBusinessLocation(req, res, next) {
    const allUsers = await User.find({
      isAdmin: false,
      isJimAdmin: false,
    }).populate({
      path: "BusinessLocation",
      populate: { path: "Gym" },
    });

    const usersWithGym = allUsers.filter(
      (user) => user.BusinessLocation.length > 0
    );

    const singleGymUsers = await User.find({
      isAdmin: false,
      isJimAdmin: false,
      BusinessLocation: {
        $elemMatch: {
          Gym: req.query.BusinessLocation,
        },
      },
    }).populate("BusinessLocation.Gym"); //

    try {
      let filterdata = req.query;
      let filter = {
        isAdmin: false,
        isJimAdmin: false,
      };
      if (filterdata.BusinessLocation) {
        filter["BusinessLocation.Gym"] = filterdata.BusinessLocation;
      }
      if (filterdata.status === "active") {
        // filter["status"] = filterdata.status
        filter["BusinessLocation.status"] = { $in: ["active", "inactive"] };
      }
      if (filterdata.status === "pending") {
        filter["BusinessLocation.status"] = "pending";
        //    filter["$or"] = [
        //       { "status": 'active' },
        //       { "status": 'inactive' }
        //   ];
      }
      if (filterdata.search) {
        filter["$or"] = [
          {
            email: {
              $regex: new RegExp(".*" + filterdata.search + ".*", "i"),
            },
          },
          {
            full_name: {
              $regex: new RegExp(".*" + filterdata.search + ".*", "i"),
            },
          },
        ];
      }

      const options = pick(req.query, ["limit", "page"]);
      const findUser = await CrudServices.getList(User, filter, options);
      if (findUser && findUser.results) {
        let users = findUser.results.map((user) => {
          const { password, ...userData } = user._doc;
          return userData;
        });
        findUser.results = users;
        return res.status(200).json({
          success: true,
          message: "ALL users",
          status: 200,
          data: findUser,
          usersWithGym,
          singleGymUsers,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "ALL users",
          status: 200,
          data: findUser,
          usersWithGym,
          singleGymUsers,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////

  ///////////// get single  user /////////////////
  async getOne(req, res, next) {
    console.log("req.params.id", req.params.id);
    try {
      const findUser = await User.findOne({ _id: req.params.id });

      console.log("findUser", findUser);
      return res.status(200).json({
        success: true,
        message: "User Data",
        status: 200,
        data: findUser,
      });
    } catch (error) {
      next(error);
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////
  ///////////// get single  user /////////////////
  async updateUser(req, res, next) {
    try {
      const { error } = UpdateUser.validate(req.body);
      if (error) {
        return res.status(200).send({
          success: false,
          message: error.message,
          status: 200,
          error: error,
        });
      }
      console.log(req.body);
      const updateUs = await User.findOneAndUpdate(
        { _id: req.body.id },
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "User Data",
        status: 200,
        data: updateUs,
      });
    } catch (error) {
      next(error);
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////

  ///////////// get single  user /////////////////
  async updatePassword(req, res, next) {
    try {
      const findUser = await User.findOne({ _id: req.params.id });
      const oldPasswordd = findUser.password;
      // return res.send(oldPasswordd)
      const compare = await bcrypt.compare(req.body.oldPassword, oldPasswordd);
      if (!compare) {
        return res.status(200).json({
          success: false,
          message: "Incorrect Old password",
          status: 200,
          data: [],
        });
      }
      const salt = await bcrypt.genSaltSync(10);
      const Password = await bcrypt.hashSync(req.body.newPassword, salt);
      const updateUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: { password: Password },
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "User Data",
        status: 200,
        data: updateUser,
      });
    } catch (error) {
      next(error);
    }
  },
  ///////////////////////////
  async updateUserStatus(req, res, next) {
    try {
      // const { error } = UpdateUser.validate(req.body);
      // if (error) {
      //   return res.status(200).send({
      //     success: false,
      //     message: error.message,
      //     status: 200,
      //     error: error,
      //   });
      // }
      let status = req.body?.status;
      let payment_status = req.body?.payment_status;
      let gymId = req.body?.gymId;
      console.log("gymId", gymId, status, payment_status);

      if (status === "inactive") {
        await Jim.updateOne({ _id: gymId }, { $set: { status: "inactive" } });
      }

      const gymPaymentToUpdate = await gymPayment.findOne({ userId: gymId });
      gymPaymentToUpdate.payment_status = payment_status;
      await gymPaymentToUpdate.save();

      let user = await User.findOne({ _id: req.body.id });

      if (!user) {
        return next(createError(404, "no data found"));
      } else {
        if (user.isJimAdmin) {
          // const businessLocation = user.BusinessLocation.find((location) => location.Gym.toString() === gymId);

          user.BusinessLocation.forEach((location) => {
            if (location.Gym.toString() === gymId) {
              if (payment_status) {
                location.payment_status = payment_status;
              }
            }
          });
          if (payment_status) {
            // user["BusinessLocation.payment_status"] = payment_status
            let gym = await Jim.findOne({ _id: user.BusinessLocation[0].Gym });
            if (gym) {
              gym.payment_status = payment_status;
              await gym.save();
            }
          } else {
            user.BusinessLocation.forEach((location) => {
              if (location.Gym.toString() === gymId) {
                location.status = status;

                if (status === "active") {
                  location.active_date = new Date().toISOString();
                } else if (status === "inactive") {
                  location.inActive_date = new Date().toISOString();
                }
              }
            });

            // user["BusinessLocation.status"] = status

            // if (status === 'active') {

            //    user["BusinessLocation.active_date"] = new Date().toISOString()

            // }
            // else if (status === 'inactive') {
            //    user["BusinessLocation.inActive_date"] = new Date().toISOString()

            // }
            let gym = await Jim.findOne({ _id: user.BusinessLocation[0].Gym });
            if (gym) {
              gym.status = status;
              if (status === "active") {
                gym.active_date = new Date().toISOString();
              } else if (status === "inactive") {
                gym.inActive_date = new Date().toISOString();
              }
              await gym.save();
            }
          }
        } else {
          user.BusinessLocation.forEach((location) => {
            if (location.Gym.toString() === gymId) {
              if (payment_status) {
                location.payment_status = payment_status;
              } else {
                location.status = status;

                if (status === "active") {
                  location.active_date = new Date().toISOString();
                } else if (status === "inactive") {
                  location.inActive_date = new Date().toISOString();
                }
              }
            }
          });

          // if (payment_status) {
          //    user["BusinessLocation.payment_status"] = payment_status

          // }
          // else {
          //    user["BusinessLocation.status"] = status

          //    if (status === 'active') {

          //       user["BusinessLocation.active_date"] = new Date().toISOString()

          //    }
          //    else if (status === 'inactive') {
          //       user["BusinessLocation.inActive_date"] = new Date().toISOString()

          //    }
          // }
        }

        console.log("user", user);
        await user.save();
      }
      return res.status(200).json({
        success: true,
        message: "User Data",
        status: 200,
        data: user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /////////////////////////////////////////
  async deleteUser(req, res, next) {
    try {
      let user = await User.findOne({ _id: req.body.id });
      if (!user) {
        return next(createError(404, "no data found"));
      } else {
        if (user.isJimAdmin) {
          let deleteTAsk = await User.findByIdAndDelete(req.body.id);
          let deletejim = await Jim.findByIdAndDelete(
            user.BusinessLocation[0].Gym
          );
        } else {
          let deleteTAsk = await User.findByIdAndDelete(req.body.id);
        }
      }
      return res.status(200).send({
        success: true,
        message: "User Deleted",
        status: 200,
        data: true,
      });
    } catch (err) {
      console.log(err);
    }
  },

  async activePkgUser(req, res) {
    try {
      let user = await User.findOne({
        _id: req.params.id,
        status: "active",
      }).populate("BusinessLocation.package");

      if (!user) {
        return res.status(404).send({ error: "User not found or not active" });
      }

      let result = user.BusinessLocation.map((item) => item.package);

      res.send({ response: result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "An error occurred" });
    }
  },
};
