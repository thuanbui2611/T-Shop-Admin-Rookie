import { Product } from "./Product";
import { User } from "./User";

export interface Transaction {
    id: string;
    status: string;
    reason: string | null;
    createdAt: string;
    order: Order;   
    user: User;                              
}

export interface Order {
    id: string;
    customerID: string;
    shippingAddress: string;
    paymentIntentID: string;
    clientSecret: string;
    orderDetails: OrderDetail[];
}

export interface OrderDetail {
    product: Product;
    price: number;
    quantity: number;
}

export interface TransactionParams{
    pageNumber: number;
    pageSize: number;
  }
  