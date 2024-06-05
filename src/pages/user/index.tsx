import { useState, useEffect } from "react";
import Breadcrumb from "../../app/components/Breadcrumb";
import Loader from "../../app/components/Loader";
import { useAppSelector, useAppDispatch } from "../../app/store/ConfigureStore";
import {
  getUsersAsync,
  userSelectors,
  setUserParams,
  LockOrUnlockUserAsync,
} from "./UserSlice";
import Pagination from "../../app/components/Pagination";
import "./../../app/assets/css/custom.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import SelectPageSize from "../../app/components/SelectPageSize";

export default function UserPage() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [selectedPageSize, setSelectedPageSize] = useState<number>(5);

  const [isStartFilter, setIsStartFilter] = useState(false);

  const navigate = useNavigate();
  const users = useAppSelector(userSelectors.selectAll);
  const { userLoaded, metaData, userParams } = useAppSelector(
    (state) => state.user
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
      dispatch(setUserParams({ pageNumber: 1 }));
    } else if (pageNum) {
      dispatch(setUserParams({ pageNumber: +pageNum }));
    }
  }, [pageNum, dispatch]);

  useEffect(() => {
    if (pageSize === "5") {
      setSearchParams((prev) => {
        prev.delete("pageSize");
        return prev;
      });
      dispatch(setUserParams({ pageSize: 5 }));
    } else {
      let pageSizeCurrent: number = 5;
      if (pageSize) {
        pageSizeCurrent = +pageSize;
      } else {
        pageSizeCurrent = userParams.pageSize;
      }
      setSelectedPageSize(pageSizeCurrent);
      dispatch(setUserParams({ pageSize: pageSizeCurrent }));
    }
  }, [pageSize, dispatch]);

  //Starting filter
  useEffect(() => {
    if (!isStartFilter) {
      if (pageNum) {
        setIsStartFilter(true);
      }
    }
  }, [userParams, pageNum]);

  useEffect(() => {
    if (!userLoaded) {
      if (isStartFilter || users.length === 0) {
        dispatch(getUsersAsync());
      }
    }
  }, [dispatch, userParams, isStartFilter]);

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

  const handleLockUser = async (userId: string) => {
    await dispatch(LockOrUnlockUserAsync({ userId: userId }));
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
                    Full Name
                  </th>
                  <th className="min-w-[116 px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Username
                  </th>
                  <th className="min-w-[180px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    Gmail
                  </th>
                  <th className="min-w-[180px] py-4 px-4 text-black dark:text-blue-gray-50 ">
                    PhoneNumber
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
                {userLoaded ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <Loader className="h-70 " />
                    </td>
                  </tr>
                ) : (
                  <>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="dark:border-strokedark border-[#eee] border-b"
                      >
                        <td className="py-5 px-4">
                          <div className="flex items-center h-full ">
                            <div className="h-12 w-12 rounded-md">
                              <img
                                className="h-full w-full rounded-md object-cover"
                                src={user.avatar ?? undefined}
                                alt="Avatar user"
                              />
                            </div>
                            <div className="ml-3 flex flex-1 flex-col">
                              <div className="flex">
                                <h5 className="font-medium text-black dark:text-blue-gray-50  line-clamp-2">
                                  {user.fullName}
                                </h5>
                              </div>

                              <p className="text-sm font-medium">{user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-45">
                          <h5 className="font-medium text-black dark:text-blue-gray-50 whitespace-normal overflow-wrap-normal">
                            {user.username}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-45">
                          <h5 className="font-medium text-black dark:text-blue-gray-50 whitespace-normal overflow-wrap-normal">
                            {user.email}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-45">
                          <h5 className="font-medium text-black whitespace-normal overflow-wrap-normal">
                            {user.phoneNumber}
                          </h5>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex flex-col justify-center items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={user.isLocked}
                                onChange={() => handleLockUser(user.id)}
                              />
                              <div className="w-11 h-6 bg-success rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-blue-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-blue-gray-600 peer-checked:bg-danger"></div>
                            </label>
                            <span
                              className={`mt-1 text-sm rounded-full px-[3px] font-semibold bg-opacity-10 text-black 
                                ${
                                  user.isLocked
                                    ? "bg-danger text-meta-1"
                                    : "bg-success text-meta-3"
                                }`}
                            >
                              {user.isLocked ? "Disabled" : "Active"}
                            </span>
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
                setSearchParams((prev) => {
                  prev.set("pageNumber", page.toString());
                  return prev;
                });
              }}
              loading={userLoaded}
            />
          </div>
        </div>
      </>
    );
}
