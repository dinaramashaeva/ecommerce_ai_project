import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../store/slices/orderSlice";
import PaymentForm from "../components/PaymentForm";
import { useTranslation } from "react-i18next";

const Payment = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { t } = useTranslation();

  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { orderStep, placingOrder } = useSelector((state) => state.order);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    state: "Chuy",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Kyrgyzstan",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let totalWithTax = total + total * 0.18;
  if (total > 50) {
    totalWithTax += 2;
  }

  if (!authUser) return navigateTo("/products");

  if (cart.length === 0 && orderStep === 1) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-panel max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("noItemsInCart")}
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before processing to checkout.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-primary-foreground gradient-primary font-semibold"
          >
            {t("browseProducts")}
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", shippingDetails.fullName);
    formData.append("state", shippingDetails.state);
    formData.append("city", shippingDetails.city);
    formData.append("country", shippingDetails.country);
    formData.append("address", shippingDetails.address);
    formData.append("pincode", shippingDetails.zipCode);
    formData.append("phone", shippingDetails.phone);
    formData.append("orderedItems", JSON.stringify(cart));
    dispatch(placeOrder(formData));
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center space-x-4 mb-8">
            <Link to="/cart" className="p-2 glass-card">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Link>
          </div>

          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${orderStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 1 ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                  {orderStep > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <span className="font-medium">{t("details")}</span>
              </div>

              <div className={`w-12 h-0 border-t-2 ${orderStep >= 2 ? "border-primary" : "border-border"}`} />

              <div className={`flex items-center space-x-2 ${orderStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 2 ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                  2
                </div>
                <span className="font-medium">{t("payment")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {orderStep === 1 ? (
                <form onSubmit={handlePlaceOrder} className="glass-panel">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {t("shippingInfo")}
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("fullName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.fullName}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("region")} *
                      </label>
                      <select
                        value={shippingDetails.state}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Chuy">Chuy</option>
                        <option value="Bishkek">Bishkek</option>
                        <option value="Osh">Osh</option>
                        <option value="Jalal-Abad">Jalal-Abad</option>
                        <option value="Naryn">Naryn</option>
                        <option value="Batken">Batken</option>
                        <option value="Talas">Talas</option>
                        <option value="Issyk-Kul">Issyk-Kul</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("phone")} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingDetails.phone}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("address")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.address}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("city")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.city}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("zipCode")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.zipCode}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, zipCode: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("country")} *
                      </label>
                      <select
                        value={shippingDetails.country}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full py-3 gradient-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {placingOrder ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("placingOrder")}
                      </span>
                    ) : (
                      t("continueToPayment")
                    )}
                  </button>
                </form>
              ) : (
                <PaymentForm />
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="glass-panel sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {t("orderSummary")}
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <img
                        src={item.product?.images?.[0]?.url || "/placeholder.jpg"}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span className="text-green-500">
                      {total >= 50 ? t("free") : "$2"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("tax")}</span>
                    <span>${(total * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                    <span>{t("total")}</span>
                    <span className="text-primary">${totalWithTax.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;