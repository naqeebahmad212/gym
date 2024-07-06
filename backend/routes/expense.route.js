const {
  totalEarning,
  monthlyEarning,
  paymentGymTotal,
  gymMonthlyEarning,
  gymMonthlyEarningHistory,
  gymMonthlyEarningHistoryForAdmin,
  gymMonthlyAllEarningHistory,
  monthEarnings,
  getuserDashBoardData,
  GymwithLeastandMostUsers,
  singleGymEarning,
} = require("../controller/expenses.controller.js");
const { verifyToken } = require("../utils/varifyToken.js");
const Router = require("express").Router();

Router.get("/getEarninDetails", verifyToken, monthEarnings);
Router.get("/getDashboardDetails", verifyToken, getuserDashBoardData);
Router.get("/GymwithLeastandMostUsers", verifyToken, GymwithLeastandMostUsers);
Router.get("/getEarninDetail", verifyToken, totalEarning);
Router.get("/monthlyEarning", verifyToken, monthlyEarning);
Router.get("/EarningGymTotal", verifyToken, paymentGymTotal);
Router.get("/gymEarningMonthly/:id", verifyToken, gymMonthlyEarning);
Router.get(
  "/gymMonthlyEarningHistory/:id",
  verifyToken,
  gymMonthlyEarningHistory
);
Router.get(
  "/gymMonthlyEarningHistoryForAdmin",
  verifyToken,
  gymMonthlyEarningHistoryForAdmin
);
Router.get(
  "/gymMonthlyAllEarningHistory",
  verifyToken,
  gymMonthlyAllEarningHistory
);
Router.get("/single-gym-earning", verifyToken, singleGymEarning);

module.exports = Router;
