import React, { useEffect, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const { myOrders } = useSelector((state) => state.order);
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigateTo = useNavigate();

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (!authUser) {
    navigateTo("/products");
    return null;
  }

  const filterOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <Package className="w-5 h-5 text-yellow-500" />;
      case "Shipped": return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-yellow-500/20 text-yellow-400";
      case "Shipped": return "bg-blue-500/20 text-blue-400";
      case "Delivered": return "bg-green-500/20 text-green-400";
      case "Cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const statusArray = [
    { key: "All", label: t("all") },
    { key: "Processing", label: t("processing") },
    { key: "Shipped", label: t("shipped") },
    { key: "Delivered", label: t("delivered") },
    { key: "Cancelled", label: t("cancelled") },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("myOrders")}
          </h1>
          <p className="text-muted-foreground">{t("trackOrders")}</p>
        </div>

        <div className="glass-card p-4 mb-8">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span className="font-medium">{t("filter")}:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusArray.map((status) => (
                <button
                  key={status.key}
                  onClick={() => setStatusFilter(status.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    statusFilter === status.key
                      ? "gradient-primary text-primary-foreground"
                      : "glass-card text-foreground"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filterOrders.length === 0 ? (
          <div className="text-center glass-panel max-w-md mx-auto">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t("noOrders")}
            </h2>
            <p className="text-muted-foreground">
              {statusFilter === "All"
                ? "You have not placed any orders yet."
                : `No orders with status "${statusFilter}" found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filterOrders.map((order) => (
              <div key={order.id} className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("placedOn")}{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.order_status)}
                      <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t("total")}</p>
                      <p className="text-xl font-bold text-primary">
                        ${order.total_price}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {order?.order_items?.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {t("quantity")}: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                  <button className="px-4 py-2 glass-card text-sm">
                    {t("viewDetails")}
                  </button>
                  <button className="px-4 py-2 glass-card text-sm">
                    {t("trackOrder")}
                  </button>
                  {order.order_status === "Delivered" && (
                    <>
                      <button className="px-4 py-2 glass-card text-sm">
                        {t("leaveReview")}
                      </button>
                      <button className="px-4 py-2 glass-card text-sm">
                        {t("reorder")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;