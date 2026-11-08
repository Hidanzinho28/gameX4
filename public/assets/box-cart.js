(() => {
  const productId = document.body.dataset.boxId;
  const quantity = document.querySelector('.qty-control input');
  const [minus, plus] = document.querySelectorAll('.qty-control button');
  const [add, buy] = document.querySelectorAll('.buy-row button');
  const status = document.querySelector('.mystery-availability');
  const limit = 10;
  const cartKey = 'gamex-cart';

  function setQuantity(value) {
    quantity.value = Math.min(limit, Math.max(1, value));
    minus.disabled = Number(quantity.value) === 1;
    plus.disabled = Number(quantity.value) === limit;
  }

  function addToCart(destination) {
    try {
      const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const item = cart.find(entry => entry.id === productId);
      const amount = Number(quantity.value);
      if ((item?.qty || 0) + amount > limit) {
        status.textContent = 'Limite de 10 unidades desta caixa no carrinho.';
        status.hidden = false;
        return;
      }

      if (item) item.qty += amount;
      else cart.push({ id: productId, qty: amount });
      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.location.href = destination;
    } catch {
      status.textContent = 'Não foi possível atualizar o carrinho. Tente novamente.';
      status.hidden = false;
    }
  }

  quantity.readOnly = true;
  setQuantity(1);
  minus.addEventListener('click', () => setQuantity(Number(quantity.value) - 1));
  plus.addEventListener('click', () => setQuantity(Number(quantity.value) + 1));
  add.addEventListener('click', () => addToCart('cart.html'));
  buy.addEventListener('click', () => addToCart('cart.html?checkout=1'));
})();
