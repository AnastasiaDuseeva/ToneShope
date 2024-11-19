// script.js

document.addEventListener("DOMContentLoaded", () => {
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");
    const minPriceLabel = document.getElementById("min-price-label");
    const maxPriceLabel = document.getElementById("max-price-label");
    const categorySelect = document.getElementById("category-select");
    const colorCheckboxes = document.querySelectorAll('input[name="color"]');
    const products = document.querySelectorAll(".product-item");

    // Обновление диапазона цен
    function updatePriceLabels() {
        const min = Math.min(parseInt(priceMin.value), parseInt(priceMax.value));
        const max = Math.max(parseInt(priceMin.value), parseInt(priceMax.value));

        priceMin.value = min;
        priceMax.value = max;

        minPriceLabel.textContent = min;
        maxPriceLabel.textContent = max;
    }

    priceMin.addEventListener("input", updatePriceLabels);
    priceMax.addEventListener("input", updatePriceLabels);

    // Фильтрация товаров
    function filterProducts() {
        const selectedCategory = categorySelect.value;
        const selectedColors = Array.from(colorCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        const minPrice = parseInt(priceMin.value);
        const maxPrice = parseInt(priceMax.value);

        products.forEach((product) => {
            const productCategory = product.dataset.category;
            const productColor = product.dataset.color;
            const productPrice = parseInt(product.dataset.price);

            const matchesCategory =
                selectedCategory === "all" || productCategory === selectedCategory;
            const matchesColor =
                selectedColors.length === 0 || selectedColors.includes(productColor);
            const matchesPrice =
                productPrice >= minPrice && productPrice <= maxPrice;

            if (matchesCategory && matchesColor && matchesPrice) {
                product.style.display = "";
            } else {
                product.style.display = "none";
            }
        });
    }

    // Слушатели событий
    categorySelect.addEventListener("change", filterProducts);
    colorCheckboxes.forEach((checkbox) =>
        checkbox.addEventListener("change", filterProducts)
    );
    priceMin.addEventListener("input", filterProducts);
    priceMax.addEventListener("input", filterProducts);
});