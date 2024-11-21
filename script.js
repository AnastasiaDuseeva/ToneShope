document.addEventListener("DOMContentLoaded", () => {
    const productsPerPage = 6; // Количество товаров на странице
    const products = Array.from(document.querySelectorAll(".product-item"));
    const paginationContainer = document.querySelector(".pagination");
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");
    const minPriceLabel = document.getElementById("min-price-label");
    const maxPriceLabel = document.getElementById("max-price-label");
    const categorySelect = document.getElementById("category-select");
    const colorCheckboxes = document.querySelectorAll('input[name="color"]');

    let filteredProducts = [...products];
    let currentPage = 1;

    // Обновление диапазона цен
    function updatePriceLabels() {
        const min = Math.min(parseInt(priceMin.value), parseInt(priceMax.value));
        const max = Math.max(parseInt(priceMin.value), parseInt(priceMax.value));

        priceMin.value = min;
        priceMax.value = max;

        minPriceLabel.textContent = min;
        maxPriceLabel.textContent = max;
    }

    // Фильтрация товаров
    function filterProducts() {
        const selectedCategory = categorySelect.value;
        const selectedColors = Array.from(colorCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        const minPrice = parseInt(priceMin.value);
        const maxPrice = parseInt(priceMax.value);

        filteredProducts = products.filter((product) => {
            const productCategory = product.dataset.category;
            const productColor = product.dataset.color;
            const productPrice = parseInt(product.dataset.price);

            const matchesCategory =
                selectedCategory === "all" || productCategory === selectedCategory;
            const matchesColor =
                selectedColors.length === 0 || selectedColors.includes(productColor);
            const matchesPrice =
                productPrice >= minPrice && productPrice <= maxPrice;

            return matchesCategory && matchesColor && matchesPrice;
        });

        currentPage = 1; // Сбрасываем на первую страницу
        renderProducts();
        renderPagination();
    }

    // Показ товаров на текущей странице
    function renderProducts() {
        products.forEach((product) => {
            product.style.display = "none"; // Скрываем все товары
        });

        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;

        filteredProducts.slice(start, end).forEach((product) => {
            product.style.display = ""; // Показываем отфильтрованные товары
        });
    }

    // Создание кнопок пагинации
    function renderPagination() {
        paginationContainer.innerHTML = ""; // Очищаем пагинацию

        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

        // Кнопка "Предыдущая"
        const prevButton = document.createElement("button");
        prevButton.textContent = "Предыдущая";
        prevButton.classList.add("pagination-button", "prev");
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                renderPagination();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Кнопки страниц
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add(i === currentPage ? "active" : "");

            button.addEventListener("click", () => {
                currentPage = i;
                renderProducts();
                renderPagination();
            });

            paginationContainer.appendChild(button);
        }

        // Кнопка "Следующая"
        const nextButton = document.createElement("button");
        nextButton.textContent = "Следующая";
        nextButton.classList.add("pagination-button", "next");
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                renderPagination();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Добавление товаров в корзину
    const cart = [];

    function addToCart(productName) {
        cart.push(productName);
        alert(`Товар "${productName}" добавлен в корзину!`);
        console.log("Корзина:", cart);
    }

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productItem = event.target.closest(".product-item");
            const productName = productItem.querySelector("h3").textContent;
            addToCart(productName);
        });
    });

    // Слушатели событий
    priceMin.addEventListener("input", updatePriceLabels);
    priceMax.addEventListener("input", updatePriceLabels);
    categorySelect.addEventListener("change", filterProducts);
    colorCheckboxes.forEach((checkbox) =>
        checkbox.addEventListener("change", filterProducts)
    );
    priceMin.addEventListener("input", filterProducts);
    priceMax.addEventListener("input", filterProducts);

    // Инициализация
    filterProducts(); // Начальная фильтрация
});
