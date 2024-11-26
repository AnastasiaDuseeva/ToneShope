document.addEventListener("DOMContentLoaded", () => {
    // *** Ваш текущий функционал ***
    const productsPerPage = 9; // Количество товаров на странице
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

    function addToCart(productName, quantity = 1) {
        const existingProduct = cart.find((item) => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ name: productName, quantity });
        }
        alert(`Добавлено в корзину: ${quantity} шт. товара "${productName}"`);
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

    // *** Новый функционал для карточки товара ***
    const mainImage = document.getElementById("current-image");
    const thumbnails = document.querySelectorAll(".thumbnail");

    // Переключение изображений
    thumbnails?.forEach((thumbnail) => {
        thumbnail.addEventListener("click", () => {
            mainImage.src = thumbnail.src;
            thumbnails.forEach((thumb) => thumb.classList.remove("active"));
            thumbnail.classList.add("active");
        });
    });

    // Добавление количества в карточке товара
    const productAddButton = document.getElementById("add-to-cart");
    productAddButton?.addEventListener("click", () => {
        const quantityInput = document.getElementById("quantity");
        const quantity = parseInt(quantityInput.value) || 1;
        const productName = document.querySelector(".product-details h1").textContent;

        addToCart(productName, quantity);
    });

    // *** Слушатели событий ***
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
