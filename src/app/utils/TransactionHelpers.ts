import { OrderDetail } from "../models/Transaction";

export enum TransactionStatus {
    Pending = "Pending",
    InProcess = "InProcess",
    Completed = "Completed",
    Canceled = "Canceled",
  }

export const calculateTotalPaymentOfTransaction = (orderDetails: OrderDetail[]): string => {
  let totalPayment = 0;
  orderDetails.forEach((orderDetail) => {
    const { price, quantity } = orderDetail;
    totalPayment += price * quantity;
  });
  return totalPayment.toLocaleString();
};