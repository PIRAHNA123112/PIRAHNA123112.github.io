document.addEventListener('DOMContentLoaded', () => {
  const cartToggleBtn = document.getElementById('cart-toggle');
  const cart = document.querySelector('.cart');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotalElem = document.querySelector('.cart-total');
  const clearCartBtn = document.querySelector('.clear-cart-btn');
  const checkoutBtn = document.querySelector('.checkout-btn');

  const DELIVERY_FIXED_TIME = 15 * 60 * 1000; // 15 минут в миллисекундах

  // Получаем данные из localStorage или инициализируем
  let deliveryData = JSON.parse(localStorage.getItem('deliveryData'));

  // Проверяем, не истекло ли время
  const now = Date.now();
  if (!deliveryData || now > deliveryData.expiresAt) {
    // Генерируем новую цену и время истечения
    deliveryData = {
      cost: getRandomDeliveryCost(),
      expiresAt: now + DELIVERY_FIXED_TIME
    };
    localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
  }

  // Элемент для отображения доставки и таймера
  const deliveryElem = document.createElement('div');
  deliveryElem.style.marginTop = '5px';
  deliveryElem.style.fontWeight = 'bold';
  cartTotalElem.parentNode.insertBefore(deliveryElem, cartTotalElem.nextSibling);

  // Функция генерации случайной стоимости доставки от 80 до 190 включительно
  function getRandomDeliveryCost() {
    return Math.floor(Math.random() * (190 - 80 + 1)) + 80;
  }

  // Обновление отображения стоимости и обратного таймера
  function updateDeliveryDisplay() {
    const timeLeftMs = deliveryData.expiresAt - Date.now();
    if (timeLeftMs <= 0) {
      // Время истекло — обновляем цену и время
      deliveryData.cost = getRandomDeliveryCost();
      deliveryData.expiresAt = Date.now() + DELIVERY_FIXED_TIME;
      localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
    }
    // Выводим цену и время в мин:сек
    const minutes = Math.floor(timeLeftMs / 60000);
    const seconds = Math.floor((timeLeftMs % 60000) / 1000);
    deliveryElem.textContent = `Стоимость доставки: ${deliveryData.cost.toFixed(2)} ₽ (обновится через ${minutes}:${seconds.toString().padStart(2, '0')})`;
    updateTotal();
  }

  // Таймер обновления каждую секунду
  setInterval(updateDeliveryDisplay, 1000);
  updateDeliveryDisplay();

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
    let orderDetails = 'Ваш заказ:\n\n';
    for (const li of cartItemsContainer.children) {
      orderDetails += li.textContent + '\n';
    }
    orderDetails += `\nСтоимость доставки: ${deliveryData.cost.toFixed(2)} ₽`;
    orderDetails += `\nИтого: ${(getCartTotal() + deliveryData.cost).toFixed(2)} ₽\n\nСпасибо ��а покупку!`;
    alert(orderDetails);
    clearCart();
    // После заказа обновляем доставку и сбрасываем таймер (также сохраняем)
    deliveryData.cost = getRandomDeliveryCost();
    deliveryData.expiresAt = Date.now() + DELIVERY_FIXED_TIME;
    localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
    updateDeliveryDisplay();
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
    cartTotalElem.textContent = 'Итого: ' + (getCartTotal() + deliveryData.cost).toFixed(2) + ' ₽';
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
});
