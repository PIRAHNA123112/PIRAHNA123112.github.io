document.addEventListener('DOMContentLoaded', () => {
  const cartToggleBtn = document.getElementById('cart-toggle');
  const cart = document.querySelector('.cart');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotalElem = document.querySelector('.cart-total');
  const clearCartBtn = document.querySelector('.clear-cart-btn');
  const checkoutBtn = document.querySelector('.checkout-btn');

  // Таймер фиксации доставки (в мс)
  const DELIVERY_FIXED_TIME = 30 * 60 * 1000; // 30 минут

  // Переменные для доставки
  let deliveryCost = null;
  let deliveryExpiresAt = 0;
  let timerInterval = null;

  // Элемент отображения доставки и таймера
  const deliveryElem = document.createElement('div');
  deliveryElem.style.marginTop = '5px';
  deliveryElem.style.fontWeight = 'bold';
  const deliveryTimerElem = document.createElement('div');
  deliveryTimerElem.style.fontSize = '0.9em';
  deliveryTimerElem.style.color = 'gray';

  cartTotalElem.parentNode.insertBefore(deliveryElem, cartTotalElem.nextSibling);
  cartTotalElem.parentNode.insertBefore(deliveryTimerElem, deliveryElem.nextSibling);

  initDelivery();

  cartToggleBtn.addEventListener('click', () => {
    cart.classList.toggle('open');
  });

  document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', () => {
      const burgerCard = button.closest('.burger-card');
      const name = burgerCard.querySelector('.burger-name').textContent;
      const price = parseFloat(burgerCard.querySelector('.burger-price').textContent.replace(' ₽', '').replace(',', '.'));
      addItemToCart({ name, price });
    });
  });

  clearCartBtn.addEventListener('click', () => {
    clearCart();
  });

  checkoutBtn.addEventListener('click', () => {
    if (cartItemsContainer.children.length === 0) {
      alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
      return;
    }
    // Перед оформлением заказа убеждаемся, что доставка еще фиксирована
    if (Date.now() > deliveryExpiresAt) {
      alert('Срок фиксированной стоимости доставки истёк. Стоимость доставки обновлена.');
      resetDelivery();
      return;
    }
    let orderDetails = 'Ваш заказ:\n\n';
    for (const li of cartItemsContainer.children) {
      orderDetails += li.textContent + '\n';
    }
    orderDetails += `\nСтоимость доставки: ${deliveryCost.toFixed(2)} ₽`;
    orderDetails += `\nИтого: ${(getCartTotal() + deliveryCost).toFixed(2)} ₽\n\nСпасибо за покупку!`;
    alert(orderDetails);
    clearCart();
    resetDelivery();
    cart.classList.remove('open');
  });

  function addItemToCart(product) {
    const existingItem = [...cartItemsContainer.children].find(li => li.dataset.name === product.name);
    if (existingItem) {
      let qty = parseInt(existingItem.dataset.qty);
      qty++;
      existingItem.dataset.qty = qty;
      existingItem.textContent = `${product.name} x${qty} - ${(product.price * qty).toFixed(2)} ₽`;
    } else {
      const li = document.createElement('li');
      li.dataset.name = product.name;
      li.dataset.qty = 1;
      li.textContent = `${product.name} x1 - ${product.price.toFixed(2)} ₽`;
      cartItemsContainer.appendChild(li);
    }
    updateTotal();
  }

  function updateTotal() {
    cartTotalElem.textContent = 'Итого: ' + (getCartTotal() + (deliveryCost || 0)).toFixed(2) + ' ₽';
  }

  function getCartTotal() {
    let total = 0;
    for (const li of cartItemsContainer.children) {
      const qty = parseInt(li.dataset.qty);
      const priceMatch = li.textContent.match(/- ([\d.,]+) ₽$/);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1].replace(',', '.'));
        total += price;
      }
    }
    return total;
  }

  function clearCart() {
    cartItemsContainer.innerHTML = '';
    updateTotal();
  }

  function getRandomDeliveryCost() {
    return Math.floor(Math.random() * (190 - 80 + 1)) + 80;
  }

  function updateDeliveryDisplay() {
    deliveryElem.textContent = `Стоимость доставки: ${deliveryCost.toFixed(2)} ₽`;
  }

  // Инициализация доставки с фиксацией времени и запуском таймера
  function initDelivery() {
    deliveryCost = getRandomDeliveryCost();
    deliveryExpiresAt = Date.now() + DELIVERY_FIXED_TIME;
    updateDeliveryDisplay();
    startDeliveryTimer();
    updateTotal();
  }

  // Сброс доставки после окончания таймера — генерируем новую фиксированную цену и перезапускаем таймер
  function resetDelivery() {
    clearInterval(timerInterval);
    initDelivery();
  }

  // Таймер обратного отсчёта
  function startDeliveryTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const now = Date.now();
      const diff = deliveryExpiresAt - now;

      if (diff <= 0) {
        deliveryTimerElem.textContent = 'Время фиксированной цены доставки истекло.';
        clearInterval(timerInterval);
        // Автоматически обновляем доставку
        resetDelivery();
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        deliveryTimerElem.textContent = `Цена доставки фиксирована ещё ${minutes} мин ${seconds} сек`;
      }
    }, 1000);
  }
});
