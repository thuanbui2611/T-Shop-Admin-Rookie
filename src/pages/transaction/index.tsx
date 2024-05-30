import { useState, useEffect } from "react";
import Breadcrumb from "../../app/components/Breadcrumb";
import ConfirmDeleteDialog from "../../app/components/ConfirmDeleteDialog";
import Loader from "../../app/components/Loader";
import { useAppSelector, useAppDispatch } from "../../app/store/ConfigureStore";
import { OrderDetail, Transaction } from "../../app/models/Transaction";
import {
  getTransactionsAsync,
  transactionSelectors,
  setTransactionParams,
} from "./TransactionSlice";
import Pagination from "../../app/components/Pagination";
import "./../../app/assets/css/custom.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  TransactionStatus,
  calculateTotalPaymentOfTransaction,
} from "../../app/utils/TransactionHelpers";

export default function TransactionPage() {
  const [pageNumber, setPageNumber] = useSearchParams({ pageNumber: "" });
  const [isStartFilter, setIsStartFilter] = useState(false);
  const navigate = useNavigate();
  const transactions = useAppSelector(transactionSelectors.selectAll);
  const { transactionLoaded, metaData, transactionParams } = useAppSelector(
    (state) => state.transaction
  );
  const dispatch = useAppDispatch();
  //pagination
  const pageNum = pageNumber.get("pageNumber");
  useEffect(() => {
    if (!pageNum || pageNum === "1") {
      setPageNumber((prev) => {
        prev.delete("pageNumber");
        return prev;
      });
      dispatch(setTransactionParams({ pageNumber: 1 }));
    } else {
      dispatch(setTransactionParams({ pageNumber: +pageNum }));
    }
  }, [pageNum, dispatch]);
  //Starting filter
  useEffect(() => {
    if (!isStartFilter) {
      if (pageNum) {
        setIsStartFilter(true);
      }
    }
  }, [transactionParams, pageNum]);

  useEffect(() => {
    if (!transactionLoaded) {
      if (isStartFilter || transactions.length === 0) {
        dispatch(getTransactionsAsync());
      }
    }
  }, [dispatch, transactionParams, isStartFilter]);

  console.log(transactions);

  if (!metaData) {
    return <Loader />;
  } else
    return (
      <>
        <Breadcrumb pageName="Model Vehicle" />
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto scrollbar">
            <table className="w-full table-auto">
              <thead>
                <tr className=" bg-gray-2 text-left dark:bg-meta-4  font-bold">
                  <th className="min-w-[180px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Id
                  </th>
                  <th className="min-w-[180px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Total Items
                  </th>
                  <th className="min-w-[180px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Total Price
                  </th>
                  <th className="min-w-[180px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Status
                  </th>
                  <th className="py-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {transactionLoaded ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <Loader className="h-70 " />
                    </td>
                  </tr>
                ) : (
                  <>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="dark:border-strokedark border-[#eee] border-b hover:bg-blue-gray-50 dark:hover:bg-meta-4 cursor-pointer"
                        onClick={() =>
                          navigate(`/transactions/${transaction.id}`)
                        }
                      >
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-45">
                          <h5 className="font-medium text-black dark:text-blue-gray-50 whitespace-normal overflow-wrap-normal line-clamp-3">
                            {transaction.id}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-45">
                          <h5 className="font-medium text-black dark:text-blue-gray-50 whitespace-normal overflow-wrap-normal line-clamp-3">
                            {transaction.order.orderDetails.length}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-45">
                          <h5 className="font-medium text-success whitespace-normal overflow-wrap-normal line-clamp-3">
                            {calculateTotalPaymentOfTransaction(
                              transaction.order.orderDetails
                            )}
                          </h5>
                        </td>

                        <td className="py-5 px-4">
                          <span
                            className={`relative inline-block px-2 py-1 font-bold leading-tight rounded-full text-sm ${
                              transaction?.status === TransactionStatus.Pending
                                ? "text-blue-600 bg-blue-100"
                                : transaction?.status ===
                                  TransactionStatus.Canceled
                                ? "text-red-600 bg-red-100"
                                : transaction?.status ===
                                  TransactionStatus.InProcess
                                ? "text-[#FF7E06] bg-orange-100"
                                : "text-green-600 bg-green-100"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>

                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className="flex items-center space-x-3.5">
                            <button
                              className="hover:text-red-600 hover:bg-red-600/30 rounded-full p-1"
                              // onClick={() => openConfirmDeleteDiaglog(transaction)}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                  fill=""
                                />
                                <path
                                  d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                  fill=""
                                />
                                <path
                                  d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                  fill=""
                                />
                                <path
                                  d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                  fill=""
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Pagination
              metaData={metaData}
              onPageChange={(page: number) => {
                setPageNumber((prev) => {
                  prev.set("pageNumber", page.toString());
                  return prev;
                });
              }}
              loading={transactionLoaded}
            />
          </div>
        </div>
      </>
    );
}
