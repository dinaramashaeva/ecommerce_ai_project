import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAuthPopup,
  toggleCart,
  toggleSearchBar,
  toggleSidebar,
} from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  let cartItemsCount = 0;
  if (cart) {
    cartItemsCount = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  return (
    <nav className="fixed left-0 w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LEFT — SIDEBAR BUTTON */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          {/* CENTER — LOGO */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-primary">
              BuyWise
            </h1>
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center space-x-2">

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* SEARCH */}
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* USER — shows avatar if logged in, user icon if not */}
            <button
              onClick={() => dispatch(toggleAuthPopup())}
              className="p-2 rounded-lg hover:bg-secondary transition-colors relative"
            >
              {authUser ? (
                <div className="relative">
                  <img
                    src={authUser.avatar?.url || "/avatar-holder.avif"}
                    alt={authUser.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-primary"
                  />
                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                </div>
              ) : (
                <User className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* CART */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;