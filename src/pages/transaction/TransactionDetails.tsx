import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/store/ConfigureStore";
import { useNavigate, useParams } from "react-router-dom";
import { transactionSelectors } from "./TransactionSlice";
import agent from "../../app/api/agent";
import Loader from "../../app/components/Loader";
import { Transaction } from "../../app/models/Transaction";
import {
  TransactionStatus,
  calculateTotalPaymentOfTransaction,
} from "../../app/utils/TransactionHelpers";
import { LoadingButton } from "@mui/lab";

export default function TransactionDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactionDetail, setTransactionDetail] = useState<Transaction>();
  const [isApproving, setIsApproving] = useState(false);
  const [isDenying, setIsDenying] = useState(false);

  const navigate = useNavigate();
  const { transactionId } = useParams();
  const transaction = useAppSelector((state) =>
    transactionSelectors.selectById(state, transactionId!)
  );

  useEffect(() => {
    if (transaction) {
      setTransactionDetail(transaction);
      setIsLoading(false);
    }
  }, [transaction]);

  useEffect(() => {
    if (!transaction && transactionId && !transaction) {
      debugger;
      setIsLoading(true);
      agent.Transaction.details(transactionId).then((response) => {
        debugger;
        if (response) {
          debugger;
          setTransactionDetail(response);
        }
        setIsLoading(false);
      });
    }
  }, [transaction, transactionId]);

  const handleSetStatus = async (
    transaction: Transaction,
    statusToUpdate: string
  ) => {};

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="pb-14 pt-10 px-4 2xl:container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-start items-start space-y-2">
            <h1 className="text-3xl dark:text-blue-gray-50 lg:text-4xl font-semibold leading-7 lg:leading-9 text-black">
              Order{" "}
              <span className="text-blue-600">
                #{transactionDetail && transactionDetail.id}
              </span>
            </h1>
            <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-800">
              {transactionDetail?.createdAt &&
                new Date(transactionDetail?.createdAt).toLocaleString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
          </div>
          <div
            className={`font-bold w-fit h-fit py-1 px-2 text-base rounded-full shadow-md ${
              transactionDetail?.status === TransactionStatus.Pending
                ? "text-blue-600 bg-blue-200"
                : transactionDetail?.status === TransactionStatus.Canceled
                ? "text-red-600 bg-red-200"
                : transactionDetail?.status === TransactionStatus.InProcess
                ? "text-orange-based bg-orange-100"
                : "text-green-600 bg-green-200"
            }`}
          >
            {transactionDetail?.status}
          </div>
        </div>
        <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex flex-col justify-start items-start bg-white dark:bg-blue-gray-50 btransaction btransaction-white/50 rounded-lg shadow-md px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full max-h-[30rem] scrollbar overflow-auto">
              {transactionDetail?.order.orderDetails.map((orderDetail) => (
                <>
                  <div
                    className="relative mt-4 md:mt-6 flex flex-col md:flex-row justify-center items-center md:space-x-6 xl:space-x-8 w-full"
                    key={orderDetail.product.id}
                  >
                    <div className="flex justify-center items-center pb-4 md:pb-8 w-full md:w-40">
                      <img
                        className="w-[150px] h-[150px] md:w-full md:h-full md:block rounded-lg shadow-lg"
                        src={
                          orderDetail.product.images.find((i) => i.isMain)
                            ?.imageUrl || undefined
                        }
                        alt="Product Image"
                      />
                    </div>
                    <div className="flex justify-start items-center border-b btransaction-gray-200 md:flex-row flex-col w-fit md:w-full pb-8 space-y-4 md:space-y-0">
                      <div className="w-full md:w-[70%] flex flex-col justify-start items-start space-y-2">
                        <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-black">
                          {orderDetail.product.name}
                        </h3>
                        <div className="flex justify-start items-start flex-col space-y-2">
                          <p className="text-sm leading-none text-black font-medium">
                            <span className="text-gray-500 font-semibold">
                              Brand:{" "}
                            </span>{" "}
                            {orderDetail.product.model.brand.name}
                          </p>
                          <p className="text-sm leading-none text-black font-medium">
                            <span className="text-gray-500 font-semibold">
                              Model:{" "}
                            </span>
                            {orderDetail.product.model.name}
                          </p>
                          <p className="text-sm leading-none text-black font-medium">
                            <span className="text-gray-500 font-semibold">
                              Color:{" "}
                            </span>{" "}
                            {orderDetail.product.color.name}
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:w-1/4 flex-1 flex justify-end space-x-8 items-end">
                        <p className="text-base xl:text-lg font-semibold leading-6 text-green-600">
                          {(
                            orderDetail.price * orderDetail.quantity
                          ).toLocaleString()}{" "}
                          VND
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>

            <div className="flex justify-center flex-col md:flex-rowitems-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col justify-end items-end px-4 py-6 md:p-6 xl:p-8 w-full bg-white dark:bg-blue-gray-50 btransaction btransaction-white/50 rounded-lg shadow-md space-y-6">
                <div className="flex justify-between items-center w-fit gap-4">
                  <p className="text-xl font-bold leading-4 text-black">
                    Total
                  </p>
                  <p className="text-lg font-bold leading-4 text-green-600">
                    {calculateTotalPaymentOfTransaction(
                      transactionDetail!.order.orderDetails
                    )}{" "}
                    VND
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-blue-gray-50 btransaction btransaction-white/50 h-fit w-fit mx-auto max-w-xs md:max-w-3xl rounded-lg shadow-md md:w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
            <h3 className="text-2xl font-bold leading-5 text-gradient">
              Customer
            </h3>
            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
              <div className="flex flex-col justify-start items-start flex-shrink-0">
                <div className="flex justify-center w-full md:justify-start items-center space-x-3 py-8 btransaction-b btransaction-gray-200">
                  <img
                    className="rounded-full w-12 h-12 shadow-lg"
                    src=""
                    alt="Customer Avatar"
                  />
                  <div className="flex justify-start items-start flex-col space-y-2">
                    <p className="text-base font-semibold leading-4 text-left text-black/90">
                      Customer Nameee
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center text-gray-800 md:justify-start items-start py-4 btransaction-b btransaction-gray-200 w-full">
                  <div className="flex space-x-2">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          fill-rule="evenodd"
                          clipRule="evenodd"
                          d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                          fill="#080341"
                        ></path>
                      </g>
                    </svg>
                    <p className="cursor-pointer text-sm leading-5 text-blue-500 hover:underline">
                      Customer emaill
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z"
                          fill="#1C274C"
                        ></path>
                      </g>
                    </svg>
                    <p className="cursor-pointer text-sm leading-5 text-black/90">
                      Customer phone
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between xl:h-full items-stretch w-full flex-col">
                <div className="flex justify-center md:justify-start flex-col items-center md:items-start">
                  <div className="flex w-full justify-center md:justify-start items-center md:items-start flex-col space-y-4 py-5">
                    <p className="text-base font-bold leading-4 text-center md:text-left text-black">
                      Customer Address
                    </p>
                    <p className="w-full text-center font-semibold md:text-left text-sm leading-5 text-black/90">
                      Customer address
                    </p>
                  </div>
                  <div className="flex w-full justify-center md:justify-start items-center md:items-start flex-col space-y-4 btransaction-t pt-5">
                    <p className="text-base font-bold leading-4 text-center md:text-left text-black">
                      Shipping Address
                    </p>
                    <p className="w-full text-center font-semibold md:text-left text-sm leading-5 text-black/90">
                      {transaction?.order.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {transactionDetail?.status.trim().toLowerCase() ===
            TransactionStatus.Pending.toLocaleLowerCase() && (
            <LoadingButton
              loading={isApproving}
              disabled={isApproving || isDenying}
              type="submit"
              variant="contained"
              color="primary"
              sx={{ fontWeight: 600, width: "100px" }}
              onClick={() =>
                handleSetStatus(transactionDetail, TransactionStatus.InProcess)
              }
            >
              Approve
            </LoadingButton>
          )}
          {transactionDetail?.status.trim().toLowerCase() !==
            TransactionStatus.Canceled.toLocaleLowerCase() && (
            <LoadingButton
              loading={isDenying}
              disabled={isApproving || isDenying}
              type="submit"
              variant="contained"
              color="error"
              sx={{ fontWeight: 600, width: "100px" }}
              onClick={() =>
                handleSetStatus(transactionDetail!, TransactionStatus.Canceled)
              }
            >
              Deny
            </LoadingButton>
          )}
        </div>
      </div>
    </>
  );
}
