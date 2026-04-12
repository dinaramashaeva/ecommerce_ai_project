import React, { useState } from "react";
import { X, Search, Sparkles, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductWithAI } from "../../store/slices/productSlice";
import { toggleAIModal } from "../../store/slices/popupSlice";

const AISearchModal = () => {
  const [userPrompt, setUserPrompt] = useState("");

  const { aiSearching } = useSelector((state) => state.product);
  const { isAIPopupOpen } = useSelector((state) => state.popup);

  const exampleText = [
    "Find the best suitable GPU with Ryzen 5600x",
    "Find all leather jackets for men",
    "Find all red t-shirts for me",
  ];

  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProductWithAI({ userPrompt }));
  };

  if (!isAIPopupOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => !aiSearching && dispatch(toggleAIModal())}
    >
      <div
        className="bg-background/95 backdrop-blur-md border border-border rounded-2xl p-8 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                AI Product Search
              </h2>
              <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
            </div>
          </div>

          <button
            onClick={() => !aiSearching && dispatch(toggleAIModal())}
            className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            disabled={aiSearching}
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Describe what you&apos;re looking for and our AI will find the perfect
          products for you.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder='e.g., "A wireless headphone for gaming with good bass"'
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground disabled:opacity-50"
              required
              autoFocus
              disabled={aiSearching}
            />
          </div>

          <button
            type="submit"
            disabled={aiSearching || !userPrompt.trim()}
            className={`w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
          >
            {aiSearching ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>AI is searching for products...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Search with AI</span>
              </>
            )}
          </button>
        </form>

        {/* Loading state message */}
        {aiSearching && (
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-sm text-purple-400">
                AI is analyzing your request and finding the best matches...
              </p>
            </div>
          </div>
        )}

        {/* Example Queries */}
        {!aiSearching && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Try these examples:
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleText.map((example) => (
                <button
                  key={example}
                  onClick={() => setUserPrompt(example)}
                  className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISearchModal;