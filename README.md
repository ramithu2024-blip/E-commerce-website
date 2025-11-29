# Etronic – Christmas Deals E-commerce Website

Etronic is a straightforward, front-end e-commerce website project that shows electronic components like mini PCs, microcontrollers, Raspberry Pis, and accessories. It features a festive "Christmas Deals" theme and includes key e-commerce functions built with plain HTML, CSS, and JavaScript.

## Features

*   **Product Catalog:** Displays a grid of available products loaded from a JavaScript object.
*   **Dynamic Filtering & Searching:**
    *   Filter products by category (Microcontrollers, Raspberry Pi, Accessories, Mini PC).
    *   Search for products by name using a real-time search bar.
*   **Shopping Cart:**
    *   Add products to the cart directly from the product grid.
    *   View items in the cart on a separate `cart.html` page.
    *   The cart item count in the navigation bar updates automatically.
*   **Customer Reviews:**
    *   View existing customer reviews.
    *   A form to submit new reviews with a name and review text.
*   **User Feedback System:**
    *   **Confirmation Modals:** Asks for user confirmation for important actions.
    *   **Toast Notifications:** Provides non-intrusive feedback (e.g., "Item added to cart").
*   **Simple & Clean UI:** A dark-themed, easy-to-navigate interface.

## Technologies Used

*   **HTML5:** For the structure and content of the web pages.
*   **CSS3:** For all styles, including layout, dark theme, and responsive design elements.
*   **JavaScript (ES6+):** For all dynamic features, including:
    *   Rendering products.
    *   Filtering and searching.
    *   Cart management (using `localStorage`).
    *   Handling reviews.
    *   Displaying modals and toasts.

## Project Structure

```
E-commerce-website/
├── index.html    # Main landing page with product listings
├── cart.html     # Shopping cart page
├── styles.css    # All CSS styles for the project
├── products.js   # Contains the product data (e.g., an array of product objects)
└── script.js     # Core JavaScript logic for interactivity
```

## How to Run

This is a static website project and does not need a special server or build process.

1.  Clone or download the repository to your local machine.
2.  Navigate to the project directory.
3.  Open the `index.html` file in your web browser (such as Chrome, Firefox, or Safari).

That's it! You can now browse products, add them to your cart, and interact with the site.

## Future Improvements

*   Implement a checkout process.
*   Persist reviews using `localStorage` or a backend service.
*   Improve accessibility (ARIA attributes, keyboard navigation).
*   Add individual product detail pages.