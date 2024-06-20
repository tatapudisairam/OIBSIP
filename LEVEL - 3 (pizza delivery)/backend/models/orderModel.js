import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Change this line
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Placed" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: false }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;