document.addEventListener("DOMContentLoaded", () => {
  // --- Helpers: source de vérité du panier ---
  function loadCart() {
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    try {
      const data = JSON.parse(raw);
      // Si c'est déjà un tableau -> OK
      if (Array.isArray(data)) return data;
      // Ancien format objet {id: {name, price, quantity}}
      if (data && typeof data === "object") {
        return Object.entries(data).map(([id, it]) => ({
          id,
          name: it.name,
          price: Number(it.price),
          quantity: Number(it.quantity) || 1,
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  function saveCart(cartArr) {
    localStorage.setItem("cart", JSON.stringify(cartArr));
  }

  // Normalise immédiatement ce qu'il y a en mémoire
  saveCart(loadCart());

  // --- Sélecteurs ---
  const cartCountEl = document.getElementById("cart-count");
  const buttons = document.querySelectorAll(".btn-add");

  // --- Compteur header ---
  function updateCartCount() {
    const cart = loadCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = totalCount;
  }

  // --- Add to cart ---
  function addToCart(id, name, price) {
    const cart = loadCart();
    const found = cart.find(p => p.id === id);
    if (found) {
      found.quantity += 1;
    } else {
      cart.push({ id, name, price: Number(price), quantity: 1 });
    }
    saveCart(cart);
    updateCartCount();
    alert(`${name} ajouté au panier !`);
    renderCart(); // si on est sur la page panier, on rafraîchit
  }

  // Boutons "ajouter"
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const name = button.dataset.name;
      const price = Number(button.dataset.price);
      addToCart(id, name, price);
    });
  });

  // --- Rendu du panier (si la table existe sur la page) ---
  function renderCart() {
    const table = document.getElementById("cart-table");
    const tbody = table ? table.querySelector("tbody") : null;
    const emptyMsg = document.getElementById("empty-message");
    const totalEl = document.getElementById("total-price");
    const clearBtn = document.getElementById("clear-cart");
    const checkoutBtn = document.getElementById("checkout");

    // Si on n’est pas sur la page panier, on sort
    if (!tbody || !emptyMsg || !totalEl || !clearBtn || !checkoutBtn) return;

    const cart = loadCart();
    tbody.innerHTML = "";

    if (cart.length === 0) {
      table.style.display = "none";
      emptyMsg.style.display = "block";
      clearBtn.style.display = "none";
      checkoutBtn.style.display = "none";
      totalEl.style.display = "none";
      return;
    } else {
      table.style.display = "table";
      emptyMsg.style.display = "none";
      clearBtn.style.display = "inline-block";
      checkoutBtn.style.display = "inline-block";
      totalEl.style.display = "block";
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      const totalItem = Number(item.price) * item.quantity;
      totalPrice += totalItem;

      row.innerHTML = `
        <td>${item.name}</td>
        <td class="price">${Number(item.price).toFixed(2)} €</td>
        <td>
          <div class="qty-controls" aria-label="Contrôles quantité pour ${item.name}">
            <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
            <span aria-live="polite" aria-atomic="true">${item.quantity}</span>
            <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
          </div>
        </td>
        <td class="total">${totalItem.toFixed(2)} €</td>
        <td class="actions">
          <button class="remove" data-index="${index}" aria-label="Supprimer ${item.name} du panier">X</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    totalEl.textContent = `Total : ${totalPrice.toFixed(2)} €`;

    // + / -
    tbody.querySelectorAll(".qty-btn").forEach(button => {
      button.addEventListener("click", e => {
        const idx = parseInt(e.currentTarget.getAttribute("data-index"));
        const action = e.currentTarget.getAttribute("data-action");
        const cart = loadCart();

        if (action === "increase") {
          cart[idx].quantity++;
        } else if (action === "decrease" && cart[idx].quantity > 1) {
          cart[idx].quantity--;
        }
        saveCart(cart);
        renderCart();
        updateCartCount();
      });
    });

    // Supprimer
    tbody.querySelectorAll("button.remove").forEach(button => {
      button.addEventListener("click", e => {
        const idx = parseInt(e.currentTarget.getAttribute("data-index"));
        const cart = loadCart();
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
        updateCartCount();
      });
    });
  }

  // Vider
  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Voulez-vous vraiment vider le panier ?")) {
        localStorage.removeItem("cart");
        saveCart([]); // remet au format tableau
        renderCart();
        updateCartCount();
      }
    });
  }

  // Valider commande
  const checkoutBtn = document.getElementById("checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = loadCart();
      if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
      }
      alert("Merci pour votre commande ! (fonctionnalité en cours de développement)");
      saveCart([]);
      renderCart();
      updateCartCount();
    });
  }

  // Init
  renderCart();
  updateCartCount();
});