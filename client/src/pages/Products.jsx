import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { products, totalProducts } = useSelector((state) => state.product);
  const location = useLocation();
  const { t } = useTranslation();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const searchTerm = query.get("search");
  const searchedCategory = query.get("category");

  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [selectedCategory, setSelectedCategory] = useState(searchedCategory || "");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    const search = params.get("search");
    if (cat !== null) setSelectedCategory(cat);
    if (search !== null) setSearchQuery(search);
  }, [location.search]);

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: selectedCategory,
        price: `${priceRange[0]}-${priceRange[1]}`,
        search: searchQuery,
        ratings: selectedRating,
        availability: availability,
        page: currentPage,
      })
    );
  }, [dispatch, selectedCategory, priceRange, searchQuery, selectedRating, availability, currentPage]);

  const totalPages = Math.ceil(totalProducts / 10);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">

          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden mb-4 p-3 glass-card flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>{t("filters")}</span>
          </button>

          <div className={`lg:block ${isMobileFilterOpen ? "block" : "hidden"} w-full lg:w-80 space-y-6`}>
            <div className="glass-panel">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {t("filters")}
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                  {t("priceRange")}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                  {t("rating")}
                </h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className={`flex items-center space-x-2 w-full p-2 rounded ${
                        selectedRating === rating ? "bg-primary/20" : "hover:bg-secondary"
                      }`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                  {t("availability")}
                </h3>
                <div className="space-y-2">
                  {["in-stock", "limited", "out-of-stock"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setAvailability(availability === status ? "" : status)}
                      className={`w-full p-2 text-left rounded ${
                        availability === status ? "bg-primary/20" : "hover:bg-secondary"
                      }`}
                    >
                      {status === "in-stock"
                        ? t("inStock")
                        : status === "limited"
                        ? t("limitedStock")
                        : t("outOfStock")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                  {t("category")}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full p-2 text-left rounded ${
                      !selectedCategory ? "bg-primary/20" : "hover:bg-secondary"
                    }`}
                  >
                    {t("allCategories")}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full p-2 text-left rounded ${
                        selectedCategory === category.name ? "bg-primary/20" : "hover:bg-secondary"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("searchProducts")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none text-foreground placeholder-muted-foreground"
                />
              </div>
              <button
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 whitespace-nowrap"
                onClick={() => dispatch(toggleAIModal())}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{t("aiSearch")}</span>
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {t("noProducts")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AISearchModal />
    </div>
  );
};

export default Products;