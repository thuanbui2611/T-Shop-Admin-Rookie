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
import SelectPageSize from "../../app/components/SelectPageSize";

export default function TransactionPage() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [selectedPageSize, setSelectedPageSize] = useState<number>(5);

  const [isStartFilter, setIsStartFilter] = useState(false);

  const navigate = useNavigate();
  const transactions = useAppSelector(transactionSelectors.selectAll);
  const { transactionLoaded, metaData, transactionParams } = useAppSelector(
    (state) => state.transaction
  );
  const dispatch = useAppDispatch();

  //Get params value from url
  const pageNum = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  //pagination
  useEffect(() => {
    if (pageNum === "1") {
      setSearchParams((prev) => {
        prev.delete("pageNumber");
        return prev;
      });
      dispatch(setTransactionParams({ pageNumber: 1 }));
    } else if (pageNum) {
      dispatch(setTransactionParams({ pageNumber: +pageNum }));
    }
  }, [pageNum, dispatch]);

  useEffect(() => {
    if (pageSize === "5") {
      setSearchParams((prev) => {
        prev.delete("pageSize");
        return prev;
      });
      dispatch(setTransactionParams({ pageSize: 5 }));
    } else {
      let pageSizeCurrent: number = 5;
      if (pageSize) {
        pageSizeCurrent = +pageSize;
      } else {
        pageSizeCurrent = transactionParams.pageSize;
      }
      setSelectedPageSize(pageSizeCurrent);
      dispatch(setTransactionParams({ pageSize: pageSizeCurrent }));
    }
  }, [pageSize, dispatch]);

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

  const handleSelectPageSize = (pageSize: number) => {
    setSearchParams((prev) => {
      prev.set("pageSize", pageSize.toString());
      return prev;
    });
    setSearchParams((prev) => {
      prev.set("pageNumber", "1");
      return prev;
    });
    setIsStartFilter(true);
  };

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
                  <th className="min-w-[116 px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Total Items
                  </th>
                  <th className="min-w-[180px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Total Price
                  </th>
                  <th className="min-w-[180px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Status
                  </th>
                  <th className="py-4 px-4">
                    <SelectPageSize
                      onSelectPageSize={handleSelectPageSize}
                      defaultValue={selectedPageSize}
                    />
                  </th>
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
                          <h5 className="font-medium text-black dark:text-blue-gray-50 whitespace-normal overflow-wrap-normal">
                            {transaction.order.orderDetails.length}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-45">
                          <h5 className="font-medium text-success whitespace-normal overflow-wrap-normal">
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
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-45">
                          <h5 className="font-medium text-black whitespace-normal overflow-wrap-normal">
                            {new Date(transaction.createdAt).toLocaleString(
                              [],
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </h5>
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
                setSearchParams((prev) => {
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
