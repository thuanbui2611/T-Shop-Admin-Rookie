import { useAppSelector } from "../../app/store/ConfigureStore";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.account);
  //
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* <TotalViewsCard />
        <TotalProfitsCard />
        <TotalProductsCard />
        <TotalUsersCard /> */}
      </div>
      {user?.role === "Staff" ? (
        <div className="text-center text-4xl text-[#FF7E06] font-black mt-10">
          Welcome to Admin Panel of Motormate
        </div>
      ) : (
        <>
          <div className="bg-black text-white"></div>
          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            {/* <div className="bg-red-600 w-90 h-90">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Submit</button>
        </div> */}
            {/* <ChartTotalRevenue />
            <TableTopLessee />
            <TableTopLessor />
            <ChartVistorAnalyze /> */}
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
