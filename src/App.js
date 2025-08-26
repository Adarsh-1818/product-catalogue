import React, { Component } from "react";
import "./App.css";
import { products } from "./data";
import libraLogo from "./assets/Libra-WebLogo.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      products: products, 
      filteredProducts: products,
    };
  }

filterProducts = () => {
  const { searchTerm, selectedCategory, selectedStock, selectedPrice } = this.state;

  const filteredProducts = products.filter((product) => {
  const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
  const skuMatch = product.sku.toLowerCase().includes(searchTerm.toLowerCase());
  const categoryMatch = !selectedCategory || selectedCategory === "All" || product.category === selectedCategory;
  const stockMatch = !selectedStock || selectedStock === "All" || product.status === selectedStock;
        
    let priceMatch = true;
    if (selectedPrice === "<10") priceMatch = product.price < 10;
    else if (selectedPrice === "10-25") priceMatch = product.price >= 10 && product.price <= 25;
    else if (selectedPrice === "25-50") priceMatch = product.price > 25 && product.price <= 50;
    else if (selectedPrice === "50+") priceMatch = product.price > 50;

    return (nameMatch || skuMatch) && categoryMatch && stockMatch && priceMatch;
  });

  this.setState({ filteredProducts });
};

// Handler for search input
handleSearch = (e) => {
  this.setState({ searchTerm: e.target.value }, this.filterProducts);
};

// Handler for category dropdown
handleCategoryChange = (e) => {
  this.setState({ selectedCategory: e.target.value }, this.filterProducts);
};

// Handler for stock status dropdown
handleStockChange = (e) => {
  this.setState({ selectedStock: e.target.value }, this.filterProducts);
};

// Handler for price range dropdown
handlePriceChange = (e) => {
  this.setState({ selectedPrice: e.target.value }, this.filterProducts);
};

handleSortChange = (e) => {
  const sortOption = e.target.value;
  this.setState({ sortOption }, this.applySort);
};

handleSortFocus = () => {
  if (!this.state.selectedSort) {
    this.setState({ filteredProducts: this.state.products });
  }
};


// Apply sort to filtered products
applySort = () => {
  const { sortOption } = this.state;
  let sortedProducts = [...this.state.products]

  if (sortOption === "price-asc") sortedProducts.sort((a, b) => a.price - b.price);
  else if (sortOption === "price-desc") sortedProducts.sort((a, b) => b.price - a.price);
  else if (sortOption === "name-asc") sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortOption === "name-desc") sortedProducts.sort((a, b) => b.name.localeCompare(a.name));

  this.setState({ filteredProducts: sortedProducts });
};

  getStatusClass = (status) => {
    switch (status) {
      case "In Stock":
        return "status in-stock";
      case "Low Stock":
        return "status low-stock";
      case "Out of Stock":
        return "status out-of-stock";
      default:
        return "status";
    }
  };

  render() {
    const { filteredProducts } = this.state;

    return (
      <div className="app-container">
          <header className="app-header">
            <a href="https://libraeurope.com" target="_blank" rel="noopener noreferrer">
            <img src={libraLogo} alt="Libra Europe" className="logo" />
            </a>
            <h1 className="header-title">Construction Materials Catalogue</h1>
          </header>
      <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, category, or SKU..."
            value={this.state.searchTerm}
            onChange={this.handleSearch}
          />

          <select onChange={this.handleCategoryChange} className="category-select" value={this.state.selectedCategory || "All"}>
            <option value="All">All Categories</option>
            <option value="Timber">Timber</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Garden">Garden</option>
            <option value="Tools">Tools</option>
            <option value="Paint">Paint</option>
          </select>

          <select
            onChange={this.handleStockChange}
            className="stock-select"
            value={this.state.selectedStock || "All"}
          >
            <option value="All">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select
            onChange={this.handlePriceChange}
            className="price-select"
            value={this.state.selectedPrice || "All"}
          >
            <option value="All">All Prices</option>
            <option value="<10">Less than £10</option>
            <option value="10-25">£10 - £25</option>
            <option value="25-50">£25 - £50</option>
            <option value="50+">Over £50</option>
          </select>

          <select
            onChange={this.handleSortChange}
            className="sort-select"
            value={this.state.sortOption || "None"}
          >
            <option value="None">Sort By</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
          </select>

      </div>

  <div className="product-grid">
    {filteredProducts.length > 0 ? (
      filteredProducts.map((product) => (
        <div key={product.sku} className={`product-card ${product.category}`}>
          <h3>{product.name}</h3>
          <p>Category: {product.category}</p>
          <p>SKU: {product.sku}</p>
          <p>Price: £{product.price.toFixed(2)}</p>
          <p>Status: {product.status}</p>
          <p>
            Stock:{" "}
            <span
              style={{
                fontWeight: "bold",
                color:
                  product.stock === 0
                    ? "red"
                    : product.stock < 10
                    ? "orange"
                    : "green",
              }}
            >
              {product.stock}
            </span>
          </p>
  </div>
  ))
  ) : (
    <p className="no-products">No products found.</p>)}
          </div>
      </div>
    );
  }
}

export default App;

