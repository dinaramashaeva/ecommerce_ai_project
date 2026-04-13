import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../store/slices/orderSlice";
import { LoaderCircle } from "lucide-react";

const Orders = () => {
  const dispatch = useDispatch();
  const { loading, orders } = useSelector((state) => state.order);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-yellow-100 text-yellow-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusUpdate = (orderId) => {
    const status = selectedStatus[orderId];
    if (status) {
      dispatch(updateOrderStatus({ orderId, status }));
    }
  };

  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      <div className="flex-1 md:p-6">
        <Header />
        <h1 className="text-2xl font-bold">All Orders</h1>
        <p className="text-sm text-gray-600 mb-6">
          Manage and update all customer orders.
        </p>

        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Order ID</th>
                    <th className="py-3 px-4 text-left">Items</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Update Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-4 text-xs text-gray-500">
                        #{order.id.slice(0, 8)}...
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-1">
                          {order.order_items?.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="text-xs truncate max-w-[100px]">
                                {item.title}
                              </span>
                            </div>
                          ))}
                          {order.order_items?.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{order.order_items.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 font-semibold">
                        ${parseFloat(order.total_price).toFixed(2)}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex gap-2 items-center">
                          <select
                            value={selectedStatus[order.id] || order.order_status}
                            onChange={(e) =>
                              setSelectedStatus({
                                ...selectedStatus,
                                [order.id]: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 text-sm"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleStatusUpdate(order.id)}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                          >
                            {loading ? (
                              <LoaderCircle className="w-4 h-4 animate-spin" />
                            ) : (
                              "Update"
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          onClick={() => dispatch(deleteOrder(order.id))}
                          className="bg-red-gradient text-white px-3 py-1 rounded text-sm hover:opacity-90"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h3 className="text-2xl p-6 font-bold">No orders found.</h3>
          )}
        </div>
      </div>
    </main>
  );
};

export default Orders;