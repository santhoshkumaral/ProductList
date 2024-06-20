document.addEventListener('DOMContentLoaded', () => {
    const apiEndpoint = 'https://fakestoreapi.com/products';
    const productContainer = document.getElementById('product-container');
    const loadMoreButton = document.getElementById('load-more');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    let products = [];
    let displayedProducts = [];
    const itemsPerPage = 10;
    let currentPage = 1;

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            const response = await fetch(apiEndpoint);
            products = await response.json();
            displayProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            productContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
    };

    // Display products in the grid
    const displayProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = currentPage * itemsPerPage;
        displayedProducts = products.slice(0, endIndex);
        productContainer.innerHTML = displayedProducts.map(product => `
            <div class="grid-item">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <p>${product.description}</p>
            </div>
        `).join('');
        toggleLoadMoreButton();
    };

    //  Load More button visibility
    const toggleLoadMoreButton = () => {
        if (displayedProducts.length < products.length) {
            loadMoreButton.classList.remove('hidden');
        } else {
            loadMoreButton.classList.add('hidden');
        }
    };

    // Load more products on button click
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        displayProducts();
    });

    // Search products by name 
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const minPrice = parseFloat(e.target.value) || 0;
        const maxPrice = parseFloat(e.target.value) || Infinity;
console.log(maxPrice)
        products = products.filter(product => {
           let matchesKeyword= product.title.toLowerCase().includes(keyword);
        let matchesPrice = product.price >= minPrice && product.price <= maxPrice;
            return matchesKeyword && matchesPrice;
       

        })
        displayProducts();
    });

    // Sort products by price
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        if (sortBy === 'price-asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            products.sort((a, b) => b.price - a.price);
        }
        currentPage = 1;
        displayProducts();
    });

    // Initialize fetching products
    fetchProducts();
});
