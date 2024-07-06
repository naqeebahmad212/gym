const Jim = require("../models/Jim.model");
const Packages = require("../models/Packages.model");
const Transaction = require("../models/Transaction.model");
const User = require("../models/User.model");
const { createError } = require("../utils/error");
const mongoose = require("mongoose");
const moment = require("moment");
const gymPayment = require("../models/gymPaymentModel");

const monthEarnings = async (req, res, next) => {
  try {
    const userData = req.user;
    const startDate = new Date();
    startDate.setDate(1);
    const endDate = new Date();

    // Initialize variables
    let totalEarning = 0;
    let totalExpense = 0;
    let monthlyEarning = 0;
    let monthlyExpense = 0;

    let user;
    if (req.query.GymId) {
      let gym = await Jim.findById(req.query.GymId);
      if (!gym) {
        return next(createError(404, "User not found"));
      }
      user = await User.findById(gym.Owner.toString());
    } else {
      user = await User.findById(userData.id);
    }

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Determine the filter based on user role
    let filter = {};

    if (user.isJimAdmin) {
      filter.type = "userPayment";
      filter.BusinessLocation = user.BusinessLocation[0].Gym;
    } else if (user.isAdmin) {
      filter.type = "jimPayment";
    } else {
      return next(createError(404, "Unauthorized to view earnings"));
    }

    // Retrieve all transactions for total earnings
    const transactionsForTotalEarning = await Transaction.find(filter);

    transactionsForTotalEarning.forEach((transaction) => {
      totalEarning += transaction.amount;
    });

    // Calculate total expenses and profit if user is admin
    if (user.isJimAdmin) {
      const transactionsForTotalExpense = await Transaction.find({
        user: user._id,
        type: "jimPayment",
      });

      transactionsForTotalExpense.forEach((transaction) => {
        totalExpense += transaction.amount;
      });
    }

    // Calculate monthly earnings
    const monthlyFilter = {
      date: { $gte: startDate, $lt: endDate },
    };

    if (user.isJimAdmin) {
      monthlyFilter.type = "userPayment";
      monthlyFilter.BusinessLocation = user.BusinessLocation[0].Gym;
    } else if (user.isAdmin) {
      monthlyFilter.type = "jimPayment";
    }

    const transactionsForMonthlyEarning = await Transaction.find(monthlyFilter);

    transactionsForMonthlyEarning.forEach((transaction) => {
      monthlyEarning += transaction.amount;
    });

    // Calculate monthly expenses and profit if user is admin
    if (user.isJimAdmin) {
      const transactionsForMonthlyExpense = await Transaction.find({
        user: user._id,
        type: "jimPayment",
        date: { $gte: startDate, $lt: endDate },
      });

      transactionsForMonthlyExpense.forEach((transaction) => {
        monthlyExpense += transaction.amount;
      });
    }

    // Calculate total and monthly profit
    const totalProfit = totalEarning - totalExpense;
    const monthlyProfit = monthlyEarning - monthlyExpense;

    // Prepare response data
    const results = {
      totalEarning: totalEarning,
      totalExpense: totalExpense,
      totalProfit: totalProfit,
      monthlyEarning: monthlyEarning,
      monthlyExpense: monthlyExpense,
      monthlyProfit: monthlyProfit,
    };

    // Send success response with data
    return res.status(200).send({
      success: true,
      message: "Monthly earnings retrieved successfully",
      data: results,
    });
  } catch (err) {
    // Handle any errors and pass them to the error handler middleware
    console.error("Error in monthEarnings:", err);
    return next(err);
  }
};
let getuserDashBoardData = async (req, res, next) => {
  try {
    const userData = req.user;
    const startDate = new Date();
    startDate.setDate(1);
    const endDate = new Date();

    let monthlyEarning = 0;
    let monthlyPending = 0;
    let TotalPackages = 0;
    // Find the user from database
    const user = await User.findById(userData.id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Calculate monthly earnings
    const monthlyFilter = {
      date: { $gte: startDate, $lt: endDate },
    };

    if (user.isJimAdmin) {
      monthlyFilter.type = "userPayment";
      monthlyFilter.BusinessLocation = user.BusinessLocation[0].Gym;
    } else if (user.isAdmin) {
      monthlyFilter.type = "jimPayment";
    }

    const transactionsForMonthlyEarning = await Transaction.find(monthlyFilter);

    transactionsForMonthlyEarning.forEach((transaction) => {
      monthlyEarning += transaction.amount;
    });
    if (user.isAdmin) {
      TotalPackages = 1;
      let requests = await Jim.find({ status: "inactive" });
      newRequest = requests.length;
    } else if (user.isJimAdmin) {
      let packages = await Packages.find({
        BusinessLocation: user.BusinessLocation[0].Gym,
      });
      TotalPackages = packages.length;

      const requests = await User.find({
        "BusinessLocation.Gym": user.BusinessLocation[0].Gym,
        status: "inactive",
      });
      newRequest = requests.length;
    }

    const results = {
      monthlyEarning: monthlyEarning,
      monthlyPending: monthlyPending,
      TotalPackages: TotalPackages,
      newRequest: newRequest,
    };

    // Send success response with data
    return res.status(200).send({
      success: true,
      message: "Monthly earnings retrieved successfully",
      data: results,
    });
  } catch (err) {
    // Handle any errors and pass them to the error handler middleware
    console.error("Error in monthEarnings:", err);
    return next(err);
  }
};

let AddTransaction = async (package, userId, BusinessLocation = null, next) => {
  try {
    if (!package || !userId) {
      return next(createError(404, "no data found"));
    }
    let packageDetail = await Packages.findOne({
      _id: package,
    });

    let user = await User.findOne({
      _id: userId,
    });

    if (!packageDetail || !user) {
      return next(createError(404, "no data found"));
    }
    let type;
    if (user.isJimAdmin) {
      type = "jimpaymet";
    } else if (!user.isJimAdmin && !user.isAdmin) {
      type = "userPayment";
    }
    let data = {
      user: userId,
      amount: packageDetail.price,
      BusinessLocation: BusinessLocation,
      type: type,
      date: new Date(),
      package: package,
    };

    const transaction = await new Transaction(data);
    await transaction.save();

    return transaction;
  } catch (err) {
    return next(err);
  }
};

const GymwithLeastandMostUsers = async (req, res, next) => {
  try {
    // Find all users and populate the gyms they are associated with
    const users = await User.find({
      $and: [{ isAdmin: { $ne: true } }, { isJimAdmin: { $ne: true } }],
    }).populate("BusinessLocation.Gym");
    // Create a map to track gym counts
    const gymCountMap = {};

    // Iterate through users to count gyms and active/inactive users
    users.forEach((user) => {
      if (user.BusinessLocation && user.BusinessLocation.length) {
        user.BusinessLocation.forEach((gym) => {
          if (gym.Gym) {
            const gymId = gym.Gym._id.toString(); // Use _id for comparison
            if (!gymCountMap[gymId]) {
              gymCountMap[gymId] = {
                gym: gym,
                count: 0,
                activeMemberCount: 0,
                inactivMemberCount: 0,
              };
            }
            gymCountMap[gymId].count++;
            // Count active and inactive users
            if (user.status === "active") {
              gymCountMap[gymId].activeMemberCount++;
            } else if (user.status === "inactive") {
              gymCountMap[gymId].inactivMemberCount++;
            }
          }
        });
      }
    });

    // Convert gymCountMap values to an array
    const gymsWithCounts = Object.values(gymCountMap);

    // Sort gyms by active member count (most active members to least active members)
    gymsWithCounts.sort((a, b) => b.activeMemberCount - a.activeMemberCount);

    // Get top 4 gyms with the most active members
    const top4GymsWithMostActiveMembers = gymsWithCounts.slice(0, 4);

    // Sort gyms by inactive member count (most inactive members to least inactive members)
    gymsWithCounts.sort((a, b) => b.inactivMemberCount - a.inactivMemberCount);

    // Get top 4 gyms with the most inactive members
    const top4GymsWithMostInactiveMembers = gymsWithCounts.slice(0, 4);

    res.status(200).json({
      mostActiveMembers: top4GymsWithMostActiveMembers,
      mostInactiveMembers: top4GymsWithMostInactiveMembers,
    });
  } catch (err) {
    return next(err);
  }
};

const totalEarning = async (req, res) => {
  try {
    let earnings = await gymPayment.find({
      payment_status: "paid",
    });

    if (!earnings || earnings.length === 0) {
      return res.send({ message: "No transactions found" });
    }
    let totalAmount = earnings.reduce((acc, transaction) => {
      return acc + Number(transaction.amount);
    }, 0);
    res.send({
      message: "Total earnings calculated successfully",
      totalEarnings: totalAmount,
      success: true,
    });
  } catch (error) {
    console.log("Error in total earning:", error);
    res.status(500).send({
      message: "Error in total earning",
      success: false,
    });
  }
};

// monthly Earning
const monthlyEarning = async (req, res) => {
  try {
    const currentDate = moment();
    const startDate = currentDate.clone().startOf("month");

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const earnings = await gymPayment.find({
      //   createdAt: { $gte: startDate.toDate(), $lt: currentDate.toDate() },
      created_at: { $gte: thirtyDaysAgo },
      payment_status: "paid",
    });

    if (!earnings || earnings.length === 0) {
      return res.send({ message: "No transactions found for this month" });
    }
    const totalAmount = earnings.reduce((acc, transaction) => {
      return acc + Number(transaction.amount);
    }, 0);
    res.send({
      message: "Monthly earnings calculated successfully",
      monthlyEarnings: totalAmount,
      success: true,
    });
  } catch (error) {
    console.log("Error in monthly earning:", error);
    res.status(500).send({
      message: "Error in monthly earning",
      success: false,
    });
  }
};

//payment gym
const paymentGymTotal = async (req, res) => {
  try {
    let payment = await gymPayment.find({ userId: req.params.id });
    if (payment.length === 0) {
      return res.status(404).send({
        message: "No payments found for this user",
        success: false,
        response: 0,
      });
    }

    console.log("kf");
    let totalAmount = payment.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);

    res.status(200).send({
      message: "Payment retrieved successfully",
      success: true,
      response: totalAmount,
    });
  } catch (error) {
    console.log("Error in paymentGymTotal:", error);
    res.status(500).send({
      message: "Error in payment retrieval",
      success: false,
      error: error.message || error,
    });
  }
};

//payment gym monthly
const gymMonthlyEarning = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentDate = moment();
    const startDate = currentDate.clone().startOf("month");

    const earnings = await Transaction.find({
      user: userId,
      date: { $gte: startDate.toDate(), $lt: currentDate.toDate() },
    });

    if (!earnings || earnings.length === 0) {
      return res.status(404).send({
        message: "No transactions found for this month",
        success: false,
        monthlyEarnings: 0,
      });
    }

    const totalAmount = earnings.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);

    res.status(200).send({
      message: "Monthly earnings calculated successfully",
      success: true,
      monthlyEarnings: totalAmount,
    });
  } catch (error) {
    console.log("Error in monthly earning:", error);
    res.status(500).send({
      message: "Error in monthly earning",
      success: false,
      error: error.message || error,
    });
  }
};

//gym monthly history
const gymMonthlyEarningHistory = async (req, res) => {
  try {
    const userId = req.params.id;

    const businessLocationId = userId;

    const earnings = await Transaction.aggregate([
      { $match: { BusinessLocation: businessLocationId } },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            businessLocation: "$BusinessLocation",
          },
          totalAmount: { $sum: "$amount" },
          transactions: { $push: "$$ROOT" },
        },
      },
      { $sort: { "_id.month": 1 } },
      {
        $lookup: {
          from: "businesslocations",
          localField: "_id.businessLocation",
          foreignField: "_id",
          as: "businessLocationDetails",
        },
      },
      {
        $unwind: {
          path: "$businessLocationDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (!earnings || earnings.length === 0) {
      return res.status(404).send({
        message: "No transactions found",
        success: false,
        monthlyEarnings: [],
      });
    }

    res.status(200).send({
      message: "Monthly earnings history calculated successfully",
      success: true,
      monthlyEarnings: earnings.map((earning) => ({
        month: earning._id.month,
        businessLocation: earning.businessLocationDetails,
        totalAmount: earning.totalAmount,
        transactions: earning.transactions,
      })),
    });
  } catch (error) {
    console.log("Error in monthly earnings history:", error);
    res.status(500).send({
      message: "Error in monthly earnings history",
      success: false,
      error: error.message || error,
    });
  }
};

// admin gym all history
const gymMonthlyEarningHistoryForAdmin = async (req, res) => {
  try {
    const earnings = await Transaction.aggregate([
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            businessLocation: "$BusinessLocation",
          },
          totalAmount: { $sum: "$amount" },
          transactions: { $push: "$$ROOT" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    if (!earnings || earnings.length === 0) {
      return res.status(404).send({
        message: "No transactions found",
        success: false,
        monthlyEarnings: [],
      });
    }

    const populatedEarnings = await Transaction.populate(earnings, {
      path: "_id.businessLocation",
      model: "Jim",
    });

    res.status(200).send({
      message: "Monthly earnings history calculated successfully",
      success: true,
      monthlyEarnings: populatedEarnings.map((earning) => ({
        month: earning._id.month,
        businessLocation: earning._id.businessLocation,
        totalAmount: earning.totalAmount,
        transactions: earning.transactions,
      })),
    });
  } catch (error) {
    console.log("Error in monthly earnings history:", error);
    res.status(500).send({
      message: "Error in monthly earnings history",
      success: false,
      error: error.message || error,
    });
  }
};

//get all month history
const gymMonthlyAllEarningHistory = async (req, res) => {
  try {
    const earnings = await Transaction.aggregate([
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            businessLocation: "$BusinessLocation",
          },
          totalAmount: { $sum: "$amount" },
          transactions: { $push: "$$ROOT" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    if (!earnings || earnings.length === 0) {
      return res.status(404).send({
        message: "No transactions found",
        success: false,
        monthlyEarnings: [],
      });
    }

    const populatedEarnings = await Transaction.populate(earnings, {
      path: "_id.businessLocation",
      model: "Jim",
    });

    res.status(200).send({
      message: "Monthly earnings history calculated successfully",
      success: true,
      monthlyEarnings: populatedEarnings.map((earning) => ({
        month: earning._id.month,
        businessLocation: earning._id.businessLocation,
        totalAmount: earning.totalAmount,
        transactions: earning.transactions,
      })),
    });
  } catch (error) {
    console.log("Error in monthly earnings history:", error);
    res.status(500).send({
      message: "Error in monthly earnings history",
      success: false,
      error: error.message || error,
    });
  }
};

const singleGymEarning = async (req, res) => {
  const gymId = req.query.gymId;

  // total mothnly earings eranigns ==========================================================
  const singleGymUsers = await User.find({
    isAdmin: false,
    isJimAdmin: false,
    BusinessLocation: {
      $elemMatch: {
        Gym: req.query.gymId,
        payment_status: "paid",
      },
    },
  })
    .populate("BusinessLocation.Gym")
    .populate("BusinessLocation.package"); //

  let totalPackagePrice = 0;
  let lastMonthEarning = 0;

  singleGymUsers.forEach((user) => {
    user.BusinessLocation.forEach((location) => {
      if (
        location.Gym &&
        location.package &&
        location.Gym._id == gymId &&
        location.paymentMethod == "physical"
      ) {
        totalPackagePrice += location.package.price;
      }
    });
  });
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  singleGymUsers.forEach((user) => {
    user.BusinessLocation.forEach((location) => {
      if (
        location.Gym &&
        location.package &&
        location.Gym._id == gymId &&
        location.paymentMethod == "physical" &&
        new Date(location.package.createdAt) >= thirtyDaysAgo
      ) {
        lastMonthEarning += location.package.price;
      }
    });
  });

  const allGymUsersWhoPaidOnline = await User.find({
    isAdmin: false,
    isJimAdmin: false,
    BusinessLocation: {
      $elemMatch: {
        paymentMethod: "online",
        // payment_status: "paid",
      },
    },
  })
    .populate("BusinessLocation.Gym")
    .populate("BusinessLocation.package"); //

  const currentGymPayments = await gymPayment
    .find({
      userId: gymId,
      payment_status: "paid",
    })
    .populate("userId");
  const currentGymExpenses = currentGymPayments.reduce((acc, payment) => {
    return acc + Number(payment.amount);
  }, 0);

  // ==================pending amounts
  const singleGymUsersPendingPayments = await User.find({
    isAdmin: false,
    isJimAdmin: false,
    BusinessLocation: {
      $elemMatch: {
        Gym: req.query.gymId,
      },
    },
  })
    .populate("BusinessLocation.Gym")
    .populate("BusinessLocation.package"); //

  const totalPendingAmount = singleGymUsersPendingPayments.reduce(
    (acc, user) => {
      return (
        acc +
        user.BusinessLocation.reduce((acc, location) => {
          if (
            location.Gym &&
            location.package &&
            (location.paymentMethod === "online" ||
              location.payment_status === "unpaid") &&
            location.Gym._id == req.query.gymId
          ) {
            return acc + Number(location.package.price);
          }
          return acc;
        }, 0)
      );
    },
    0
  );

  res.status(200).json({
    success: true,
    totalPackagePrice,
    lastMonthEarning,
    allGymUsersWhoPaidOnline,
    currentGymExpenses,
    totalPendingAmount,
  });
};

module.exports = {
  monthlyEarning,
  totalEarning,
  paymentGymTotal,
  gymMonthlyEarning,
  gymMonthlyEarningHistory,
  gymMonthlyEarningHistoryForAdmin,
  gymMonthlyAllEarningHistory,
  monthEarnings,
  AddTransaction,
  getuserDashBoardData,
  GymwithLeastandMostUsers,
  singleGymEarning,
};
