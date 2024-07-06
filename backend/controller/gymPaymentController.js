const gymPayment = require("../models/gymPaymentModel");
const Gym = require("../models/Jim.model");
const Razorpay = require("razorpay");
const User = require("../models/User.model");
// const shortid = require("shortid");
require("dotenv").config();
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

function addOneMonth(date) {
  let endDate = new Date(date);

  // Get the current day of the month
  let day = endDate.getDate();

  // Add one month to the date
  endDate.setMonth(endDate.getMonth() + 1);

  // If the original day does not exist in the new month, adjust the day
  // e.g., from January 31 to February 28 (or 29 in leap year)
  if (endDate.getDate() < day) {
    endDate.setDate(0);
  }

  return endDate;
}

//gym payment
module.exports = {
  async createJymPayment(req, res) {
    try {
      let { userId, amount } = req.body;
      if (!userId || !amount) {
        return res.send({ message: "all filed is required" });
      }
      let payment = await gymPayment.create({
        userId,
        amount,
      });
      if (payment) {
        res.status(200).send({
          message: "payment create successfully",
          response: payment,
          success: true,
        });
      }
    } catch (error) {
      console.log("error in create payment for gym");
      res.status(500).send({
        message: "error in create payment for gym",
        success: false,
        error,
      });
    }
  },

  // get payment for gym
  async getPaymentGym(req, res) {
    try {
      let id = req.params.id;
      let payment = await gymPayment.findOne({ userId: id }).populate("userId");
      if (!payment) {
        return res.send({ message: "user not found" });
      }
      res.status(200).send({
        message: "payment create successfully",
        response: payment,
        success: true,
      });
    } catch (error) {
      console.log("error in get payment for gym", error);
      res.status(500).send({
        message: "error in get payment for gym",
        error,
        success: false,
        error,
      });
    }
  },

  //get payment for gym and update
  async payGym(req, res) {
    const endDate = addOneMonth(Date.now());
    try {
      let id = req.params.id;
      let payment = await gymPayment.findOneAndUpdate(
        { userId: id },
        {
          payment_status: "paid",
          active_date: Date.now(),
          end_date: endDate,
        }
      );

      if (payment) {
        res.status(200).send({
          message: "payment successfully",
          response: payment,
          success: true,
        });
      }

      const updatedGym = await Gym.findOneAndUpdate(
        { _id: id },
        { payment_status: "paid" }
      );
    } catch (error) {
      console.log("error in get payment for gym and update", error);
      res.status(500).send({
        message: "error in get payment for gym and update",
        error,
        success: false,
        error,
      });
    }
  },
  //gym active plan find
  async activePlan(req, res) {
    try {
      let payment = await gymPayment.findOne({ userId: req.params.id });
      if (payment) {
        res.status(200).send({
          message: "gym active plan get successfully",
          currentPlan: payment,
          success: true,
        });
      }
    } catch (error) {
      console.log("error in gym active plan find", error);
      res.status(500).send({
        message: "error in gym active plan find",
        error,
        success: false,
        error,
      });
    }
  },

  // pending payment
  async pendingPayment(req, res) {
    try {
      let totalPayments = await gymPayment.find();

      const payment = totalPayments.filter((item) => {
        return item.payment_status !== "paid";
      });

      let total = payment.reduce((acc, item) => {
        return acc + Number(item.amount);
      }, 0);

      res.send({
        success: true,
        response: total,
      });
    } catch (error) {
      console.log("Error in pending payment:", error);
      res.status(500).send({
        message: "Error in pending payment",
        success: false,
        error,
      });
    }
  },

  async updateGymPaymentStatus(req, res) {
    const { payment_status, gymId, activeGym } = req.body;
    const gym = await Gym.findById(gymId);
    const user = await User.findById(gymId);
    if (gym) {
      gym.payment_status = payment_status;
      await gym.save();
      const gymPackage = await gymPayment.findOne({ userId: gymId });
      gymPackage.payment_status = payment_status;
      if (payment_status === "paid") {
        gymPackage.active_date = new Date();
        gymPackage.end_date = addOneMonth(Date.now());
      }
      await gymPackage.save();
      res.status(200).send({ success: true });
    } else if (user) {
      user.BusinessLocation.forEach((location) => {
        if (location.Gym.toString() === activeGym) {
          location.payment_status = payment_status;
          location.paymentMethod = "physical";
          location.active_date = new Date();
        }
      });
      await user.save();
      res.status(200).send({ success: true });
    } else {
      res.status(404).send({ success: false, message: "not found" });
    }
  },

  async updateGymStatus(req, res) {
    const { gymId, status, activeGym } = req.body;
    const gym = await Gym.findById(gymId);
    const user = await User.findById(gymId);
    if (gym) {
      await Gym.findByIdAndUpdate(gymId, {
        status,
      });
      res.status(200).send({ success: true });
    } else if (user) {
      user.BusinessLocation.forEach((location) => {
        if (location.Gym.toString() === activeGym) {
          location.status = status;
        }
      });
      await user.save();
      console.log(gymId, status, "me");
      // await User.findOneAndUpdate(
      //   { _id: user._id, "BusinessLocation.Gym": gymId },

      //   {
      //     $set: {
      //       "BusinessLocation.$.status": status,
      //       "BusinessLocation.$.updated_on": new Date(),
      //     },
      //   },
      //   { new: true }
      // );

      res.status(200).send({ success: true });
    } else {
      res.status(404).send({ success: false, message: "not found" });
    }
  },

  async createRazorPayOrder(req, res) {
    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: Math.random().toString(),
      payment_capture: 1,
    };

    try {
      const response = await razorpay.orders.create(options);
      res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  async verifyRazorPayment(req, res) {
    const { order_id, payment_id, signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    if (generated_signature === signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  },
};
