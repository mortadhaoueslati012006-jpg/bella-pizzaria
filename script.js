// Global variables
let currentUser = null;
let cart = [];
let menuItems = [];
let currentCategory = 'all';
let customizingItem = null;
let deliveryType = null;
let deliveryAddress = '';
let appliedPromo = null;
let discountAmount = 0;
let statsData = null;
let map;
let marker;
let selectedLocation = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
});

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'menuPage') {
        displayMenu();
        updateCartBadge();
    } else if (pageId === 'cartPage') {
        displayCart();
    } else if (pageId === 'adminPage') {
        loadAdminData();
    } else if (pageId === 'orderHistory') {
        loadOrderHistory();
    }
}

// Password toggle
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.add('crossed');
    } else {
        input.type = 'password';
        icon.classList.remove('crossed');
    }
}

// Client Login
async function clientLogin() {
    const tel = document.getElementById('clientPhone').value;
    const password = document.getElementById('clientPassword').value;
    const errorDiv = document.getElementById('clientError');
    
    if (!tel || !password) {
        errorDiv.textContent = 'Veuillez remplir tous les champs';
        errorDiv.classList.add('show');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'login_client');
    formData.append('tel', tel);
    formData.append('password', password);
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            currentUser.type = 'client';
            document.getElementById('welcomeUser').textContent = `Bienvenue ${data.user.prenom}!`;
            document.getElementById('clientPhone').value = '';
            document.getElementById('clientPassword').value = '';
            errorDiv.classList.remove('show');
            showPage('menuPage');
            showToast(`Bienvenue ${data.user.prenom}!`, 'success', 'Connexion réussie');
        } else {
            errorDiv.textContent = data.message;
            errorDiv.classList.add('show');
            showToast(data.message, 'error', 'connexion échouée');
        }
    } catch (error) {
        console.error('Error:', error);
        errorDiv.textContent = 'Erreur de connexion';
        errorDiv.classList.add('show');
    }
}

// Admin Login
async function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminError');
    
    if (!username || !password) {
        errorDiv.textContent = 'Veuillez remplir tous les champs';
        errorDiv.classList.add('show');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'login_admin');
    formData.append('username', username);
    formData.append('password', password);
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            currentUser.type = 'admin';
            document.getElementById('adminUsername').value = '';
            document.getElementById('adminPassword').value = '';
            errorDiv.classList.remove('show');
            showPage('adminPage');
            showToast('Connexion administrateur réussie', 'success', 'Admin');
        } else {
            errorDiv.textContent = data.message;
            errorDiv.classList.add('show');
            showToast(data.message, 'error', 'connexion échouée');
        }
    } catch (error) {
        console.error('Error:', error);
        errorDiv.textContent = 'Erreur de connexion';
        errorDiv.classList.add('show');
        showToast('Erreur de connexion au serveur', 'error');
    }
}

// Register Client
async function registerClient() {
    const nom = document.getElementById('regNom').value;
    const prenom = document.getElementById('regPrenom').value;
    const tel = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (!nom || !prenom || !tel || !address || !password) {
        showToast('Veuillez remplir tous les champs','warning','Inscription');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Les mots de passe ne correspondent pas','error','Inscription');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'register_client');
    formData.append('nom', nom);
    formData.append('prenom', prenom);
    formData.append('tel', tel);
    formData.append('address', address);
    formData.append('password', password);
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('regNom').value='';
            document.getElementById('regPrenom').value='';
            document.getElementById('regPhone').value='';
            document.getElementById('regAddress').value='';
            document.getElementById('regPassword').value='';
            document.getElementById('regConfirmPassword').value='';
            showToast('Inscription réussie! Vous pouvez maintenant vous connecter.','success','Bienvenue');
            showPage('loginClient');
        } else {
            showToast(data.message, 'error', 'Inscription');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Erreur d\'inscription', 'error');
    }
}

// Load Menu
async function loadMenu() {
    const formData = new FormData();
    formData.append('action', 'get_menu');
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            menuItems = data.items;
            displayMenu();
        }
    } catch (error) {
        console.error('Erreur de chargement du menu:', error);
    }
}

// Filter category
function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayMenu();
}

// Display Menu
function displayMenu() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filtered = currentCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentCategory);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        
        const categoryEmoji = item.category === 'pizza' ? '🍕' : 
                             item.category === 'boisson' ? '🥤' : '🍰';
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-info">
                <div class="menu-header">
                    <span class="category-badge">${categoryEmoji} ${item.category}</span>
                </div>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-footer">
                    <span class="menu-price">${parseFloat(item.price).toFixed(2)} DT</span>
                    ${item.category === 'pizza' 
                        ? `<button onclick="openCustomModal('${item.id}')" class="btn-add-cart">Personnaliser</button>`
                        : `<button onclick="addToCartDirect('${item.id}')" class="btn-add-cart">Ajouter</button>`
                    }
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Open Customization Modal
function openCustomModal(itemId) {
    customizingItem = menuItems.find(item => item.id === itemId);
    const modal = document.getElementById('customModal');
    const content = document.getElementById('customContent');
    
    content.innerHTML = `
        <div class="custom-item">
            <img src="${customizingItem.image}" alt="${customizingItem.name}">
            <h3>${customizingItem.name}</h3>
            <p>${customizingItem.description}</p>
            <div class="price-tag">${parseFloat(customizingItem.price).toFixed(2)} DT</div>
        </div>
        <div class="customization-options">
            <h4>Options de personnalisation:</h4>
            <label class="custom-option">
                <input type="checkbox" id="noOnions"> Sans oignons
            </label>
            <label class="custom-option">
                <input type="checkbox" id="extraCheese"> Extra fromage (+2 DT)
            </label>
            <label class="custom-option">
                <input type="checkbox" id="extraOlives"> Extra olives (+1.5 DT)
            </label>
            <label class="custom-option">
                <input type="checkbox" id="thinCrust"> Pâte fine
            </label>
            <label class="custom-option">
                <input type="checkbox" id="spicy"> Épicé 🌶️
            </label>
        </div>
        <div class="quantity-selector">
            <label>Quantité:</label>
            <input type="number" id="customQuantity" value="1" min="1" class="form-input">
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeCustomModal() {
    document.getElementById('customModal').style.display = 'none';
    customizingItem = null;
}

function addCustomToCart() {
    const quantity = parseInt(document.getElementById('customQuantity').value);
    
    const customizations = [];
    let extraPrice = 0;
    
    if (document.getElementById('noOnions').checked) {
        customizations.push('Sans oignons');
    }
    if (document.getElementById('extraCheese').checked) {
        customizations.push('Extra fromage');
        extraPrice += 2;
    }
    if (document.getElementById('extraOlives').checked) {
        customizations.push('Extra olives');
        extraPrice += 1.5;
    }
    if (document.getElementById('thinCrust').checked) {
        customizations.push('Pâte fine');
    }
    if (document.getElementById('spicy').checked) {
        customizations.push('Épicé 🌶️');
    }
    
    const finalPrice = parseFloat(customizingItem.price) + extraPrice;
    
    const cartItem = {
        id: customizingItem.id,
        name: customizingItem.name,
        price: finalPrice,
        originalPrice: parseFloat(customizingItem.price),
        quantity: quantity,
        image: customizingItem.image,
        category: customizingItem.category,
        customizations: customizations
    };
    
    const existingIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        JSON.stringify(item.customizations) === JSON.stringify(cartItem.customizations)
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    
    updateCartBadge();
    closeCustomModal();
    showToast('Pizza personnalisée ajoutée au panier!', 'success','Panier');
}

// Add to cart directly (for drinks and desserts)
function addToCartDirect(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    
    const cartItem = {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        originalPrice: parseFloat(item.price),
        quantity: 1,
        image: item.image,
        category: item.category,
        customizations: []
    };
    
    const existingIndex = cart.findIndex(i => i.id === cartItem.id && i.customizations.length === 0);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(cartItem);
    }
    
    updateCartBadge();
    showToast(`${item.name} ajouté au panier!`, 'success');
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
}

// Display Cart
function displayCart() {
    const content = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        content.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Votre panier est vide</h3>
                <p>Ajoutez des articles pour commencer!</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="cart-items">';
    
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <div class="cart-item-left">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        ${item.customizations.length > 0 
                            ? `<p class="customizations">🎨 ${item.customizations.join(', ')}</p>` 
                            : ''}
                        <p>${item.price.toFixed(2)} DT</p>
                    </div>
                </div>
                <div class="cart-item-right">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="item-total">${(item.price * item.quantity).toFixed(2)} DT</div>
                    <button class="btn-delete" onclick="removeFromCart(${index})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    html += `
        <div class="cart-total">
            <div class="promo-section">
                <input type="text" id="promoCode" placeholder="Code promo" class="form-input promo-input">
                <button onclick="applyPromo()" class="btn-promo">Appliquer</button>
            </div>
            <div id="discountInfo" class="discount-info"></div>
            <div class="total-row">
                <span class="total-label">Sous-total:</span>
                <span class="total-amount">${subtotal.toFixed(2)} DT</span>
            </div>
            <div id="discountRow"></div>
            <div class="total-row final-total">
                <span class="total-label">Total:</span>
                <span class="total-amount" id="finalTotal">${subtotal.toFixed(2)} DT</span>
            </div>
            <button onclick="openDeliveryModal()" class="btn-order">Commander</button>
        </div>
    `;
    
    content.innerHTML = html;
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartBadge();
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    displayCart();
}

// Promo code
async function applyPromo() {
    const code = document.getElementById('promoCode').value.trim();
    if (!code) {
        showToast('Veuillez entrer un code promo', 'warning');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'validate_promo');
    formData.append('code', code);
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            appliedPromo = {code: code, discount: data.discount};
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            discountAmount = subtotal * (data.discount / 100);
            const finalTotal = subtotal - discountAmount;
            
            document.getElementById('discountInfo').innerHTML = `
                <div class="promo-success">✅ Code promo appliqué: ${data.discount}% de réduction</div>
            `;
            document.getElementById('discountRow').innerHTML = `
                <div class="total-row discount-row">
                    <span class="total-label">Réduction (${data.discount}%):</span>
                    <span class="discount-amount">-${discountAmount.toFixed(2)} DT</span>
                </div>
            `;
            document.getElementById('finalTotal').textContent = `${finalTotal.toFixed(2)} DT`;
        } else {
            document.getElementById('discountInfo').innerHTML = `
                <div class="promo-error">❌ ${data.message}</div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Erreur lors de la validation du code promo', 'error');
    }
}

// Delivery Modal
function openDeliveryModal() {
    if (cart.length === 0) {
        showToast('Votre panier est vide', 'warning');
        return;
    }
    document.getElementById('deliveryModal').style.display = 'block';
}

function closeDeliveryModal() {
    document.getElementById('deliveryModal').style.display = 'none';
}

function selectDelivery(type) {
    deliveryType = type;
    closeDeliveryModal();
    
    if (type === 'delivery') {
        openLocationModal();
    } else {
        confirmOrder();
    }
}

// Location Modal
function openLocationModal() {
    document.getElementById('locationModal').style.display = 'block';
    setTimeout(() => { initMap(); }, 100);
}

function initMap() {
    const tunisCenter = [36.8065, 10.1815];
    if (map) {map.remove();}
    
    // Créer la carte Leaflet
    map = L.map('mapContainer', {
        center: tunisCenter,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true
    });
    
    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Créer un marqueur déplaçable
    marker = L.marker(tunisCenter, {
        draggable: true,
        autoPan: true
    }).addTo(map);
    
    // Popup pour indiquer qu'on peut déplacer le marqueur
    marker.bindPopup('📍 Déplacez-moi pour ajuster votre position!').openPopup();
    
    // Quand le marqueur est déplacé
    marker.on('dragend', function(e) {
        const position = marker.getLatLng();
        selectedLocation = {
            lat: position.lat,
            lng: position.lng
        };
        updateAddressFromLocation(position.lat, position.lng);
    });
    
    // Quand on clique sur la carte
    map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        selectedLocation = {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        };
        updateAddressFromLocation(e.latlng.lat, e.latlng.lng);
        marker.openPopup();
    });
    
    // Demander la géolocalisation de l'utilisateur
    if (navigator.geolocation) {
        showToast('Demande d\'accès à votre position...', 'info', 'Géolocalisation');
        
        navigator.geolocation.getCurrentPosition(
            // Succès - Position détectée
            function(position) {
                const userLocation = [position.coords.latitude, position.coords.longitude];
                
                // Centrer la carte sur la position de l'utilisateur
                map.setView(userLocation, 15);
                
                // Déplacer le marqueur
                marker.setLatLng(userLocation);
                selectedLocation = {
                    lat: userLocation[0],
                    lng: userLocation[1]
                };
                
                // Obtenir l'adresse
                updateAddressFromLocation(userLocation[0], userLocation[1]);
                
                // Popup de confirmation
                marker.setPopupContent('📍 Votre position actuelle').openPopup();
                showToast('Position détectée avec succès!', 'success', 'Géolocalisation');
            },
            // Erreur - Position non détectée
            function(error) {
                console.error('Erreur de géolocalisation:', error);
                
                let errorMessage = 'Impossible de détecter votre position';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Accès à la localisation refusé. Position par défaut: Tunis';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Position non disponible. Position par défaut: Tunis';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Délai expiré. Position par défaut: Tunis';
                        break;
                }
                
                showToast(errorMessage, 'warning', 'Géolocalisation');
                
                // Utiliser Tunis par défaut
                selectedLocation = {
                    lat: tunisCenter[0],
                    lng: tunisCenter[1]
                };
                updateAddressFromLocation(tunisCenter[0], tunisCenter[1]);
            },
            // Options de géolocalisation
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showToast('Votre navigateur ne supporte pas la géolocalisation', 'warning');
        selectedLocation = {
            lat: tunisCenter[0],
            lng: tunisCenter[1]
        };
        updateAddressFromLocation(tunisCenter[0], tunisCenter[1]);
    }
}

// Obtenir l'adresse à partir des coordonnées (Geocoding inversé)
function updateAddressFromLocation(lat, lng) {
    // API gratuite Nominatim d'OpenStreetMap
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    
    fetch(url, {
        headers: {
            'Accept-Language': 'fr' // Pour avoir les résultats en français
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.display_name) {
            // Formater l'adresse
            const address = data.display_name;
            document.getElementById('addressInput').value = address;
            
            // Mettre à jour le popup du marqueur
            if (marker) {
                marker.setPopupContent(`📍 ${data.address?.road || 'Position'}, ${data.address?.city || 'Tunis'}`);
            }
        } else {
            document.getElementById('addressInput').value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        }
    })
    .catch(error => {
        console.error('Erreur geocoding:', error);
        document.getElementById('addressInput').value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    });
}

function confirmLocation() {
    const address = document.getElementById('addressInput').value;
    if (!address) {
        showToast('Veuillez selectionner une position sur la carte', 'warning');
        return;
    }
    deliveryAddress = { address: address, lat: selectedLocation.lat, lng: selectedLocation.lng };
    closeLocationModal();
    showToast('Adresse de livraison confirmée!', 'success', '📍 Localisation');
    confirmOrder();
}

function closeLocationModal() {
    document.getElementById('locationModal').style.display = 'none';
}

// Place Order
async function confirmOrder() {
    if (cart.length === 0) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal - discountAmount;
    
    const formData = new FormData();
    formData.append('action', 'place_order');
    formData.append('tel', currentUser.tel);
    formData.append('items', JSON.stringify(cart));
    formData.append('total', total.toFixed(2));
    formData.append('deliveryType', deliveryType || 'pickup');
    if (typeof deliveryAddress === 'object' && deliveryAddress.address) {
        formData.append('deliveryAddress', deliveryAddress.address);
        formData.append('deliveryLat', deliveryAddress.lat || '');
        formData.append('deliveryLng', deliveryAddress.lng || '');
    } else {
        formData.append('deliveryAddress', deliveryAddress || '');
    }
    formData.append('promoCode', appliedPromo ? appliedPromo.code : '');
    formData.append('discountAmount', discountAmount.toFixed(2));
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            showToast('Commande passée avec succès! Merci pour votre achat.', 'success','🍕 Commande confirmée');
            cart = [];
            appliedPromo = null;
            discountAmount = 0;
            deliveryType = null;
            deliveryAddress = '';
            selectedLocation = null;
            updateCartBadge();
            setTimeout(() => showPage('menuPage'), 2000);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Erreur lors de la commande', 'error');
    }
}

// Order History
async function loadOrderHistory() {
    const formData = new FormData();
    formData.append('action', 'get_order_history');
    formData.append('tel', currentUser.tel);
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            displayOrderHistory(data.orders);
        }
    } catch (error) {
        console.error('Erreur de chargement de l\'historique:', error);
    }
}

function displayOrderHistory(orders) {
    const content = document.getElementById('historyContent');
    
    if (orders.length === 0) {
        content.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">📋</div>
                <h3>Aucune commande</h3>
                <p>Vous n'avez pas encore passé de commande</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="orders-list">';
    
    orders.forEach(order => {
        const items = JSON.parse(order.items);
        const date = new Date(order.order_date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <div class="order-card">
                <div class="order-header">
                    <h3>Commande #${order.id}</h3>
                    <span class="order-date">${date}</span>
                </div>
                <div class="order-items">
                    ${items.map(item => `
                        <div class="order-item">
                            <span>${item.quantity}x ${item.name}</span>
                            ${item.customizations && item.customizations.length > 0 
                                ? `<span class="customizations-small">🎨 ${item.customizations.join(', ')}</span>` 
                                : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-info">
                        <span class="delivery-type">
                            ${order.delivery_type === 'delivery' ? '🛵 Livraison' : '🏪 À emporter'}
                        </span>
                        ${order.promo_code ? `<span class="promo-badge">🎟️ ${order.promo_code}</span>` : ''}
                    </div>
                    <div class="order-total">Total: ${parseFloat(order.total).toFixed(2)} DT</div>
                </div>
                <button onclick="reorderQuick(${order.id})" class="btn-reorder">🔄 Recommander</button>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

function reorderQuick(orderId) {
    showConfirm('Voulez-vous recommander cette commande?', () => {
        const formData = new FormData();
        formData.append('action', 'get_order_history');
        formData.append('tel', currentUser.tel);
        
        fetch('api.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const order = data.orders.find(o => o.id == orderId);
                if (order) {
                    const items = JSON.parse(order.items);
                    cart = items;
                    updateCartBadge();
                    showToast('Commande ajoutée au panier!', 'success');
                    showPage('cartPage');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Erreur lors de la recommande', 'error');
        });
    });
}

// Admin Functions
function showAdminSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    
    if (section === 'stats') {
        document.getElementById('statsSection').style.display = 'block';
        loadStats();
    } else if (section === 'menu') {
        document.getElementById('menuSection').style.display = 'block';
        displayAdminMenu();
    } else if (section === 'promos') {
        document.getElementById('promosSection').style.display = 'block';
        loadPromos();
    } else if (section === 'users') {
        document.getElementById('usersSection').style.display = 'block';
        loadUsers();
    }
}

async function loadAdminData() {
    await loadMenu();
    showAdminSection('stats');
}

// Statistics
async function loadStats() {
    const formData = new FormData();
    formData.append('action', 'get_stats');
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            statsData = data;
            displayStats();
        }
    } catch (error) {
        console.error('Erreur de chargement des statistiques:', error);
    }
}

function displayStats() {
    if (!statsData) return;
    
    document.getElementById('todaySales').textContent = 
        `${parseFloat(statsData.today.total || 0).toFixed(2)} DT`;
    document.getElementById('todayOrders').textContent = 
        `${statsData.today.count || 0} commandes`;
    
    document.getElementById('monthSales').textContent = 
        `${parseFloat(statsData.month.total || 0).toFixed(2)} DT`;
    document.getElementById('monthOrders').textContent = 
        `${statsData.month.count || 0} commandes`;
    
    document.getElementById('yearSales').textContent = 
        `${parseFloat(statsData.year.total || 0).toFixed(2)} DT`;
    document.getElementById('yearOrders').textContent = 
        `${statsData.year.count || 0} commandes`;
    
    showTopPizzas('day');
}

function showTopPizzas(period) {
    document.querySelectorAll('.top-tab').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('topPizzasContent');
    let topPizzas = [];
    
    if (period === 'day') {
        topPizzas = statsData.topToday;
    } else if (period === 'month') {
        topPizzas = statsData.topMonth;
    } else if (period === 'year') {
        topPizzas = statsData.topYear;
    }
    
    if (Object.keys(topPizzas).length === 0) {
        content.innerHTML = '<p class="no-data">Aucune donnée disponible</p>';
        return;
    }
    
    let html = '<div class="top-list">';
    let rank = 1;
    const medals = ['🥇', '🥈', '🥉'];
    
    for (const [name, count] of Object.entries(topPizzas)) {
        html += `
            <div class="top-item">
                <span class="rank">${medals[rank-1] || rank}</span>
                <span class="pizza-name">${name}</span>
                <span class="pizza-count">${count} vendues</span>
            </div>
        `;
        rank++;
        if (rank > 3) break;
    }
    
    html += '</div>';
    content.innerHTML = html;
}

function displayAdminMenu() {
    const grid = document.getElementById('adminMenuGrid');
    grid.innerHTML = '';
    
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'admin-menu-card';
        card.id = `item-${item.id}`;
        
        const categoryEmoji = item.category === 'pizza' ? '🍕' : 
                             item.category === 'boisson' ? '🥤' : '🍰';
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="admin-menu-info">
                <span class="category-badge">${categoryEmoji} ${item.category}</span>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-price">${parseFloat(item.price).toFixed(2)} DT</div>
                <div class="admin-actions">
                    <button onclick="editItem('${item.id}')" class="btn-edit">✏️ Modifier</button>
                    <button onclick="deleteItem('${item.id}')" class="btn-delete">🗑️ Supprimer</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleAddForm() {
    const form = document.getElementById('addItemForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function addItem() {
    const id = document.getElementById('newItemId').value;
    const name = document.getElementById('newItemName').value;
    const price = document.getElementById('newItemPrice').value;
    const image = document.getElementById('newItemImage').value;
    const description = document.getElementById('newItemDesc').value;
    const category = document.getElementById('newItemCategory').value;
    
    if (!id || !name || !price || !image || !description) {
        showToast('Veuillez remplir tous les champs', 'warning','Nouveau produit');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'add_pizza');
    formData.append('id', id);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('description', description);
    formData.append('category', category);
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            showToast('Article ajouté avec succès', 'success','Menu');
            toggleAddForm();
            await loadMenu();
            displayAdminMenu();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Erreur lors de l\'ajout', 'error');
    }
}
function editItem(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const card = document.getElementById(`item-${itemId}`); // Correction: backticks
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="admin-menu-info edit-mode">
            <input type="text" value="${item.name}" id="edit-name-${itemId}" class="form-input">
            <input type="number" value="${item.price}" id="edit-price-${itemId}" step="0.01" class="form-input">
            <textarea id="edit-desc-${itemId}" class="form-input">${item.description}</textarea>
            <div class="admin-actions">
                <button onclick="saveEdit('${itemId}')" class="btn-edit">💾 Enregistrer</button>
                <button onclick="displayAdminMenu()" class="btn-delete">❌ Annuler</button>
            </div>
        </div>
    `;
}

async function saveEdit(itemId) {
    const name = document.getElementById(`edit-name-${itemId}`).value; // Correction: backticks
    const price = document.getElementById(`edit-price-${itemId}`).value;
    const description = document.getElementById(`edit-desc-${itemId}`).value;
    
    const formData = new FormData();
    formData.append('action', 'update_pizza');
    formData.append('id', itemId);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            showToast('Article mis à jour avec succès', 'success');
            await loadMenu();
            displayAdminMenu();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Erreur lors de la mise à jour', 'error');
    }
}

async function deleteItem(itemId) {
    showConfirm('Voulez-vous vraiment supprimer cet article?', async () => {
    const formData = new FormData();
    formData.append('action', 'delete_pizza');
    formData.append('id', itemId);

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            showToast('Article supprimé avec succès', 'success');
            await loadMenu();
            displayAdminMenu();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
    });
}
async function loadPromos() {
const formData = new FormData();
formData.append('action', 'get_promo_codes');
try {
    const response = await fetch('api.php', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    
    if (data.success) {
        displayPromos(data.promos);
    }
} catch (error) {
    console.error('Erreur de chargement des promos:', error);
}
}
function displayPromos(promos) {
const grid = document.getElementById('promosGrid');
grid.innerHTML = '';
promos.forEach(promo => {
    const card = document.createElement('div');
    card.className = 'promo-card';
    card.innerHTML = `
        <div class="promo-header">
            <h3>🎟️ ${promo.code}</h3>
            <span class="promo-discount">${promo.discount_percentage}% OFF</span>
        </div>
        <div class="promo-status ${promo.active ? 'active' : 'inactive'}">
            ${promo.active ? '✅ Actif' : '❌ Inactif'}
        </div>
        <div class="promo-actions">
            <button onclick="togglePromoStatus(${promo.id}, ${promo.active})" class="btn-edit">
                ${promo.active ? '⏸️ Désactiver' : '▶️ Activer'}
            </button>
            <button onclick="deletePromoCode(${promo.id})" class="btn-delete">🗑️ Supprimer</button>
        </div>
    `;
    grid.appendChild(card);
});
}
function togglePromoForm() {
const form = document.getElementById('addPromoForm');
form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
async function addPromo() {
const code = document.getElementById('newPromoCode').value.trim();
const discount = document.getElementById('newPromoDiscount').value;
if (!code || !discount) {
    showToast('Veuillez remplir tous les champs', 'warning','Code promo');
    return;
}

if (discount < 1 || discount > 100) {
    showToast('La remise doit être entre 1 et 100%', 'warning','Code promo');
    return;
}

const formData = new FormData();
formData.append('action', 'add_promo');
formData.append('code', code);
formData.append('discount', discount);

try {
    const response = await fetch('api.php', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    
    if (data.success) {
        showToast('Code promo ajouté avec succès', 'success','Code promo');
        togglePromoForm();
        document.getElementById('newPromoCode').value = '';
        document.getElementById('newPromoDiscount').value = '';
        loadPromos();
    } else {
        showToast(data.message, 'error');
    }
} catch (error) {
    console.error('Error:', error);
    showToast('Erreur lors de l\'ajout', 'error');
}
}
async function togglePromoStatus(id, currentStatus) {
const formData = new FormData();
formData.append('action', 'update_promo');
formData.append('id', id);
formData.append('code', '');
formData.append('discount', '0');
formData.append('active', currentStatus ? '0' : '1');
try {
    const response = await fetch('api.php', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    
    if (data.success) {
        loadPromos();
    } else {
        showToast(data.message, 'error');
    }
} catch (error) {
    console.error('Error:', error);
    showToast('Erreur lors de la mise à jour', 'error');
}
}
async function deletePromoCode(id) {
    showConfirm('Voulez-vous vraiment supprimer ce code promo?', async () => {
        const formData = new FormData();
        formData.append('action', 'delete_promo');
        formData.append('id', id);

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                showToast('Code promo supprimé avec succès', 'success');
                loadPromos();
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Erreur lors de la suppression', 'error');
        }
    });
}
async function loadUsers() {
const formData = new FormData();
formData.append('action', 'get_users');
try {
    const response = await fetch('api.php', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    
    if (data.success) {
        displayUsers(data.users);
    }
} catch (error) {
    console.error('Erreur de chargement des utilisateurs:', error);
}
}
function displayUsers(users) {
const table = document.getElementById('usersTable');
if (users.length === 0) {
    table.innerHTML = '<p class="no-data">Aucun utilisateur</p>';
    return;
}

let html = `
    <table class="users-table">
        <thead>
            <tr>
                <th>Téléphone</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Adresse</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
`;

users.forEach(user => {
    const date = new Date(user.created_at).toLocaleDateString('fr-FR');
    html += `
        <tr>
            <td>${user.tel}</td>
            <td>${user.nom}</td>
            <td>${user.prenom}</td>
            <td>${user.address}</td>
            <td>${date}</td>
            <td>
                <button onclick="deleteUserAccount('${user.tel}')" class="btn-delete-small">🗑️ Supprimer</button>
            </td>
        </tr>
    `;
});

html += `
        </tbody>
    </table>
`;

table.innerHTML = html;
}
async function deleteUserAccount(tel) {
    showConfirm('Voulez-vous vraiment supprimer cet utilisateur? Toutes ses commandes seront également supprimées.', async () => {  
        const formData = new FormData();
        formData.append('action', 'delete_user');
        formData.append('tel', tel);

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                showToast('Utilisateur supprimé avec succès', 'success');
                loadUsers();
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Erreur lors de la suppression', 'error');
        }
    });
}
function logout() {
    showConfirm('Voulez-vous vraiment vous déconnecter?', () => {
        currentUser = null;
        cart = [];
        updateCartBadge();
        showPage('homePage');
        showToast('Déconnexion réussie', 'info', 'À bientôt!');
    });
}