let cart = JSON.parse(localStorage.getItem('cart')) || [];
let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');

function displayProducts(filteredProducts = products) { 
  if (!document.getElementById('products-grid')) return;
  const container = document.getElementById('products-grid');
  container.innerHTML = '';
  filteredProducts.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-link">
        <img src="${product.img}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>$${product.price}</p>
      </a>
      <button onclick="addToCart(${product.id})">Add to Cart</button>    
    `;
    container.appendChild(div);
  });
}

function filterProducts() {
  const search = document.getElementById('search-bar').value.toLowerCase();
  const category = document.getElementById('category-filter').value;
  const filtered = products.filter(p => 
    (p.name.toLowerCase().includes(search) || search === '') &&
    (p.category === category || category === 'all')
  );
  displayProducts(filtered);
}

function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }
  updateCartCount();
  localStorage.setItem('cart', JSON.stringify(cart));
  showToast('Item added to cart!', 'success');
}

function displayReviews() {
  const list = document.getElementById('reviews-list');
  if (!list) return;
  list.innerHTML = '';
  reviews.forEach((r, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${r.name}:</strong> ${r.text} <button onclick="removeReview(${i})">Remove</button>`;
    list.appendChild(li);
  });
}

function addReview() {
  const name = document.getElementById('review-name').value.trim();
  const text = document.getElementById('review-text').value.trim();
  if(!name || !text) return showToast('Please fill in both name and review fields.', 'error');
  reviews.push({name, text});
  localStorage.setItem('reviews', JSON.stringify(reviews));
  displayReviews();
  document.querySelector('#reviews-section #review-name').value = '';
  document.querySelector('#reviews-section #review-text').value = '';
}

function removeReview(index) {
  reviews.splice(index, 1);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  displayReviews();
}

function updateCartQuantity(index, change) {
  const item = cart[index];
  item.quantity += change;
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  displayCartItems();
}

function clearCart() {
  showConfirmationModal('Are you sure you want to clear your cart?', () => {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    displayCartItems();
    showToast('Your cart has been cleared.');
  });
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const cartLink = cartCount ? cartCount.parentElement : null;
  if (cartLink) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); 
    if (totalItems > 0) {
      cartLink.innerHTML = `Cart (<span id="cart-count">${totalItems}</span>)`;
    } else {
      // The span is removed to prevent "Cart ()" from showing briefly
      // The id is added back to the link for the next update.
      cartLink.innerHTML = 'Cart<span id="cart-count" style="display: none;"></span>';
    }
  }
}

function displayCartItems() {
  const cartContainer = document.getElementById("cart-items");
  const cartSummary = document.getElementById("cart-summary");
  const cartTotalSpan = document.getElementById("cart-total");

  if (!cartContainer) return;

  cartContainer.innerHTML = '';
  if (cart.length === 0) {
    cartContainer.textContent = "Your cart is empty!";
    if (cartSummary) cartSummary.style.display = 'none';
  } else {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // The cart items are displayed in reverse order to show the most recently added items first.
    // We need to calculate the correct index for removal.
    const reversedCart = [...cart].reverse();
    reversedCart.forEach((item, reversedIndex) => {
      const originalIndex = cart.length - 1 - reversedIndex;

      const div = document.createElement("div");
      div.className = 'cart-item';
      div.innerHTML = `
        <p>${item.name} - $${item.price}</p>
        <div class="quantity-controls" data-index="${originalIndex}">
          <button class="quantity-btn" onclick="updateCartQuantity(${originalIndex}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="updateCartQuantity(${originalIndex}, 1)">+</button>
        </div>`;
      cartContainer.appendChild(div);
    });
    if (cartTotalSpan) cartTotalSpan.textContent = total.toFixed(2);
    if (cartSummary) cartSummary.style.display = 'block';
  }
}

function displayCheckoutSummary() {
  const itemsList = document.getElementById('checkout-items-list');
  const totalSpan = document.getElementById('checkout-total');
  if (!itemsList) return;

  itemsList.innerHTML = '';
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} (x${item.quantity}) - $${item.price.toFixed(2)} each`;
    itemsList.appendChild(li);
  });
  totalSpan.textContent = total.toFixed(2);
}

function displayProductDetails() {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  const product = products.find(p => p.id === productId);

  if (product) {
    container.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="product-detail-img">
      <div class="product-detail-info">
        <h2>${product.name}</h2>
        <p class="product-detail-price">$${product.price}</p>
        <p>Category: ${product.category}</p>
        <p>This is a detailed description for the ${product.name}. It's a high-quality product perfect for your needs.</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  } else {
    container.innerHTML = '<p>Product not found.</p>';
  }
}

function displayConfirmationDetails() {
  const orderDetails = JSON.parse(sessionStorage.getItem('order'));
  const itemsList = document.getElementById('confirmation-items-list');
  const totalSpan = document.getElementById('confirmation-total');

  if (!orderDetails || !itemsList) return;

  itemsList.innerHTML = '';
  orderDetails.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
    itemsList.appendChild(li);
  });
  totalSpan.textContent = orderDetails.total.toFixed(2);

  // Clear the order from session storage so it doesn't show again on refresh
  sessionStorage.removeItem('order');
}

function handleCheckout() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
      showToast('Your cart is empty. Add items before placing an order.', 'error');
      return;
    }

    // Store order details for confirmation page
    const order = { items: [...cart], total: total };
    sessionStorage.setItem('order', JSON.stringify(order));

    // Clear cart and redirect
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    window.location.href = './confirmation.html';
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    // Remove the element after the transition is complete
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000); // Message disappears after 3 seconds
}

function showConfirmationModal(message, onConfirm) {
  const modal = document.getElementById('confirmation-modal');
  const messageEl = document.getElementById('confirmation-message');
  const confirmBtn = document.getElementById('confirm-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  if (!modal || !messageEl || !confirmBtn || !cancelBtn) return;

  messageEl.textContent = message;
  modal.style.display = 'flex';

  // Use .cloneNode to remove any previous event listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  const newCancelBtn = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  newConfirmBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    onConfirm();
  });

  newCancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// initial load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  displayProducts();
  displayReviews();
  displayCartItems();
  displayCheckoutSummary();
  displayProductDetails();
  displayConfirmationDetails();
  handleCheckout();
});
