const mongoose = require("mongoose");
const mongoosePaginate = require("./plugin/model.paginate");

let gymPaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jim",
  },
  amount: {
    type: String,
    require: true,
  },
  payment_status: {
    type: String,
    default: "unpaid",
    require: true,
  },
  active_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

gymPaymentSchema.plugin(mongoosePaginate);

let gymPayment = mongoose.model("gym_payment", gymPaymentSchema);

module.exports = gymPayment;
