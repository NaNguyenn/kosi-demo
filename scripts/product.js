document.addEventListener("DOMContentLoaded", () => {
  const productsContainers = document.querySelectorAll(".products-grid");
  const loadMoreBtn = document.querySelector(".load-more-btn");
  let currentPage = 1;
  const productsPerPage = 4;

  let allProducts = [];

  async function loadProducts() {
    try {
      if (allProducts.length === 0) {
        const response = await fetch("data/products.json");
        allProducts = await response.json();
      }

      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const productsToShow = allProducts.slice(startIndex, endIndex);

      productsContainers.forEach((container) => {
        productsToShow.forEach((product) => {
          const productCard = createProductCard(product);
          container.appendChild(productCard);
        });
      });

      if (endIndex >= allProducts.length) {
        loadMoreBtn.style.display = "none";
      }

      currentPage++;
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("product-card");
    let pricingHtml;
    if (product.discountedPrice) {
      pricingHtml = `
            <span class="discounted-price">$${product.discountedPrice}</span>
            <span class="original-price">$${product.originalPrice}</span>
        `;
    } else {
      pricingHtml = `<span class="regular-price">$${product.originalPrice}</span>`;
    }
    card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${
                  product.tag
                    ? `<span class="product-tag ${product.tag}">${product.tag}</span>`
                    : ""
                }
                <div class="product-hover-actions">
                    <button class="favorite-btn">
            <object
              data="assets/icons/Iconly/Light-Outline/Heart.svg"
            ></object></button>
                    <button class="add-to-cart-btn">
            <object
              data="assets/icons/Iconly/Light-Outline/Buy-Plus.svg"
            ></object></button>
                </div>
            </div>
            <div class="product-info">
              <p class="product-name">${product.name}</p>
              <div class="product-pricing">
                ${pricingHtml}
              </div>
            </div>
        `;

    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", () => {
      addToCart(product.id);
    });
    return card;
  }

  let cartCount = 0;
  const cartCountElement = document.querySelector(".cart-count");
  const cartItems = [];

  function updateCartCounter() {
    cartCountElement.textContent = cartCount > 100 ? "99+" : cartCount;
  }

  function addToCart(productId) {
    const product = allProducts.find((item) => item.id === productId);

    if (product) {
      const existingItem = cartItems.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          ...product,
          quantity: 1,
        });
      }

      cartCount++;
      updateCartCounter();
    }
  }

  loadMoreBtn.addEventListener("click", loadProducts);
  loadProducts();
});
