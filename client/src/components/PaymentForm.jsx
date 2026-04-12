import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, Lock } from "lucide-react";
import { toggleOrderStep } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

const PaymentForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !cardDetails.cardNumber ||
      !cardDetails.cardName ||
      !cardDetails.expiry ||
      !cardDetails.cvv
    ) {
      setErrorMessage("Please fill in all card details.");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment Successful.");
      dispatch(toggleOrderStep());
      dispatch(clearCart());
      navigateTo("/orders");
    }, 2000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="glass-panel">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Card Payment
          </h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Card Number *
          </label>
          <input
            type="text"
            required
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            value={cardDetails.cardNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 16);
              const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
              setCardDetails({ ...cardDetails, cardNumber: formatted });
            }}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none text-foreground"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={cardDetails.cardName}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cardName: e.target.value })
            }
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none text-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              required
              placeholder="MM/YY"
              maxLength={5}
              value={cardDetails.expiry}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                if (val.length >= 3)
                  val = val.slice(0, 2) + "/" + val.slice(2);
                setCardDetails({ ...cardDetails, expiry: val });
              }}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CVV *
            </label>
            <input
              type="password"
              required
              placeholder="•••"
              maxLength={4}
              value={cardDetails.cvv}
              onChange={(e) =>
                setCardDetails({
                  ...cardDetails,
                  cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none text-foreground"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-6 p-4 bg-secondary/50 rounded-lg">
          <Lock className="w-5 h-5 text-green-500" />
          <span className="text-sm text-muted-foreground">
            Your card information is encrypted and secure.
          </span>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="flex justify-center items-center gap-2 w-full py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white">Payment Processing ...</span>
            </>
          ) : (
            "Complete Payment"
          )}
        </button>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
        )}
      </form>
    </>
  );
};

export default PaymentForm;