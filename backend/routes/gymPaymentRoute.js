const router = require("express").Router();
const {
  createJymPayment,
  getPaymentGym,
  payGym,
  activePlan,
  pendingPayment,
  updateGymPaymentStatus,
  updateGymStatus,
  createRazorPayOrder,
  verifyRazorPayment,
} = require("../controller/gymPaymentController");

router.post("/gymPaymentCreate", createJymPayment);
router.get("/getPaymentGym/:id", getPaymentGym);
router.put("/gymPaymentUpdate/:id", payGym);
router.get("/gymActivePlan/:id", activePlan);
router.get("/pendingPayment", pendingPayment);
router.post("/updateGymPaymentStatus", updateGymPaymentStatus);
router.post("/updateGymStatus", updateGymStatus);
router.post("/create-order", createRazorPayOrder);
router.post("/verify-payment", verifyRazorPayment);

module.exports = router;
