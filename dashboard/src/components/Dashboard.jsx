import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./Header";
import MiniSummary from "./dashboard-components/MiniSummary";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import { getDashboardStats } from "../store/slices/adminSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      <div className="flex-1 md:p-6">
        <Header />
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 mb-4">
          Check the sales and analytics.
        </p>

        <Stats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <MonthlySalesChart />
          <OrdersChart />
        </div>

        <div className="mt-6">
          <TopProductsChart />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-4">
          <TopSellingProducts />
          <div>
            <MiniSummary />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;