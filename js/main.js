// SANTH - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initSearch();
    initMobileMenu();
    initProducts();
    initFilters();
    initProductScroll();
    initTestimonialsScroll();
    initContactForm();
    initCTAForm();
    updateCartCount();
});

// ===========================
// Header
// ===========================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===========================
// Search
// ===========================
function initSearch() {
    const toggle = document.querySelector('.search-toggle');
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    
    if (!toggle || !overlay) return;
    
    toggle.addEventListener('click', () => {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active')) {
            input.focus();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!overlay.contains(e.target) && !toggle.contains(e.target)) {
            overlay.classList.remove('active');
        }
    });
}

// ===========================
// Mobile Menu
// ===========================
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (!toggle || !nav) return;
    
    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

// ===========================
// Products
// ===========================
function initProducts() {
    const track = document.getElementById('productsTrack');
    if (!track) return;
    
    const products = getProducts();
    renderProducts(products);
}

function renderProducts(products) {
    const track = document.getElementById('productsTrack');
    if (!track) return;
    
    track.innerHTML = products.map(product => `
        <article class="product-card" data-category="${product.category}" onclick="goToProduct(${product.id})">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <button class="product-quick-add" onclick="event.stopPropagation(); addToCart(${product.id})" aria-label="Adicionar ao carrinho">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-subtitle">${product.subtitle}</p>
                <div class="product-price">
                    <span class="price-current">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    ${product.oldPrice ? `<span class="price-old">R$ ${product.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                </div>
                <div class="product-colors">
                    ${product.colors.map(color => `
                        <span class="color-dot" style="background:${color}" title="${product.colorNames[product.colors.indexOf(color)]}"></span>
                    `).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

function goToProduct(id) {
    window.location.href = `pages/produto.html?id=${id}`;
}

// ===========================
// Filters
// ===========================
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const products = getProducts();
            
            if (filter === 'todos') {
                renderProducts(products);
            } else {
                renderProducts(products.filter(p => p.category === filter));
            }
        });
    });
}

// ===========================
// Product Scroll
// ===========================
function initProductScroll() {
    const scroll = document.getElementById('productsScroll');
    const prev = document.getElementById('scrollPrev');
    const next = document.getElementById('scrollNext');
    const progressBar = document.getElementById('scrollProgressBar');
    
    if (!scroll) return;
    
    const scrollAmount = 324;
    
    if (prev) {
        prev.addEventListener('click', () => {
            scroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
    
    if (next) {
        next.addEventListener('click', () => {
            scroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
    
    if (progressBar) {
        scroll.addEventListener('scroll', () => {
            const maxScroll = scroll.scrollWidth - scroll.clientWidth;
            const progress = (scroll.scrollLeft / maxScroll) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        });
    }
}

// ===========================
// Testimonials Scroll
// ===========================
function initTestimonialsScroll() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.parentElement.scrollLeft;
    });
    
    track.addEventListener('mouseleave', () => isDown = false);
    track.addEventListener('mouseup', () => isDown = false);
    
    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.parentElement.scrollLeft = scrollLeft - walk;
    });
}

// ===========================
// Cart
// ===========================
function getCart() {
    const cart = localStorage.getItem('santh_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('santh_cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, quantity = 1) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            color: product.colorNames[0],
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showToast(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCartPage();
}

function updateCartQuantity(productId, newQty) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (newQty <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQty;
            saveCart(cart);
            renderCartPage();
        }
    }
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cartCount');
    if (el) {
        el.textContent = count;
        el.classList.toggle('active', count > 0);
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ===========================
// Cart Page
// ===========================
function renderCartPage() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione nossos óculos esportivos para começar suas compras.</p>
                <a href="../index.html" class="btn btn-primary">Ver Produtos</a>
            </div>
        `;
        if (summary) summary.style.display = 'none';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="../${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-variant">Cor: ${item.color}</p>
                <div class="cart-item-bottom">
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        </div>
    `).join('');
    
    if (summary) {
        const total = getCartTotal();
        const pixDiscount = total * 0.1;
        summary.innerHTML = `
            <h3>Resumo do Pedido</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="summary-row">
                <span>Frete</span>
                <span style="color:#16a34a;font-weight:600">Grátis</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="promo-input">
                <input type="text" placeholder="Cupom de desconto">
                <button>Aplicar</button>
            </div>
            <div class="summary-payment">
                <p>PIX com 10% OFF</p>
                <span class="installment">R$ ${(total - pixDiscount).toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="summary-payment">
                <p>ou ${Math.ceil(total / 12)}x de R$ ${(total / Math.ceil(total / 12)).toFixed(2).replace('.', ',')} sem juros</p>
            </div>
            <div class="address-section">
                <h4>Endereço de Entrega</h4>
                <form class="address-form" id="addressForm" onsubmit="return false;">
                    <label>
                        Nome completo
                        <input type="text" id="addrName" placeholder="Seu nome" required>
                    </label>
                    <label>
                        CPF
                        <input type="text" id="addrCpf" placeholder="000.000.000-00" maxlength="14" required>
                    </label>
                    <div class="cep-row">
                        <label>
                            CEP
                            <input type="text" id="addrCep" placeholder="00000-000" maxlength="9" required>
                        </label>
                        <button type="button" class="btn-cep" onclick="fetchAddressByCep()">Buscar</button>
                    </div>
                    <span class="cep-status" id="cepStatus"></span>
                    <label>
                        Rua
                        <input type="text" id="addrStreet" placeholder="Rua, Avenida..." required>
                    </label>
                    <div class="form-row">
                        <label>
                            Número
                            <input type="text" id="addrNumber" placeholder="Nº" required>
                        </label>
                        <label>
                            Complemento
                            <input type="text" id="addrComplement" placeholder="Apto, Bloco...">
                        </label>
                    </div>
                    <label>
                        Bairro
                        <input type="text" id="addrNeighborhood" placeholder="Bairro" required>
                    </label>
                    <div class="form-row">
                        <label>
                            Cidade
                            <input type="text" id="addrCity" placeholder="Cidade" required>
                        </label>
                        <label>
                            Estado
                            <select id="addrState" required>
                                <option value="">UF</option>
                                <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>
                                <option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>
                                <option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>
                                <option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
                                <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>
                                <option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>
                                <option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>
                                <option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
                                <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                            </select>
                        </label>
                    </div>
                </form>
            </div>
            <button class="btn btn-primary btn-full checkout-btn" onclick="checkout()">Finalizar Compra</button>
        `;
        initCepMask();
        initCpfMask();
    }
}

async function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio!');
        return;
    }

    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        const fields = ['addrName','addrCpf','addrCep','addrStreet','addrNumber','addrNeighborhood','addrCity','addrState'];
        for (const f of fields) {
            const el = document.getElementById(f);
            if (el && !el.value.trim()) {
                showToast('Preencha todos os campos de entrega.');
                el.focus();
                return;
            }
        }
    }

    const address = {
        name: document.getElementById('addrName')?.value.trim() || '',
        cpf: document.getElementById('addrCpf')?.value.trim() || '',
        street: document.getElementById('addrStreet')?.value.trim() || '',
        number: document.getElementById('addrNumber')?.value.trim() || '',
        complement: document.getElementById('addrComplement')?.value.trim() || '',
        neighborhood: document.getElementById('addrNeighborhood')?.value.trim() || '',
        city: document.getElementById('addrCity')?.value.trim() || '',
        state: document.getElementById('addrState')?.value || '',
        zip_code: document.getElementById('addrCep')?.value.replace(/\D/g, '') || ''
    };

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.textContent = 'Processando...';
        checkoutBtn.disabled = true;
    }

    try {
        const response = await fetch('/api/create-preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                payer: {
                    name: address.name
                },
                address: address
            })
        });

        const data = await response.json();

        if (data.init_point) {
            localStorage.setItem('santh_last_order', data.external_reference || 'SANTH-' + Date.now());
            localStorage.removeItem('santh_cart');
            window.location.href = data.init_point;
        } else {
            throw new Error('Erro ao criar pagamento');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Erro ao processar pagamento. Tente novamente.');
        if (checkoutBtn) {
            checkoutBtn.textContent = 'Finalizar Compra';
            checkoutBtn.disabled = false;
        }
    }
}

// ===========================
// Toast
// ===========================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ===========================
// Forms
// ===========================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Mensagem enviada com sucesso! Retornaremos em breve.');
        form.reset();
    });
}

function initCTAForm() {
    const form = document.getElementById('ctaForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Cupom de 15% enviado para seu e-mail!');
        form.reset();
    });
}

// ===========================
// Product Detail Page
// ===========================
function initProductDetail() {
    const container = document.getElementById('productDetail');
    if (!container) return;
    
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        container.innerHTML = '<p style="text-align:center;padding:100px 0;">Produto não encontrado.</p>';
        return;
    }
    
    document.title = `${product.name} | SANTH`;
    
    container.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-gallery">
                <div class="gallery-main">
                    <img src="../${product.images[0]}" alt="${product.name}" id="mainImage">
                </div>
            </div>
            <div class="product-detail-info">
                <span class="detail-category">${product.category}</span>
                <h1 class="detail-name">${product.name}</h1>
                <div class="detail-rating">
                    <span class="stars">★★★★★</span>
                    <span>(4.9) • 127 avaliações</span>
                </div>
                <div class="detail-price">
                    <span class="price-current">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    ${product.oldPrice ? `<span class="price-old">R$ ${product.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                    <span class="price-installment">ou ${product.payment.installments}</span>
                </div>
                <p class="detail-description">${product.description}</p>
                
                <div class="detail-options">
                    <span class="option-label">Cor</span>
                    <div class="color-options">
                        ${product.colors.map((color, i) => `
                            <button class="color-option ${i === 0 ? 'active' : ''}" 
                                style="background:${color}" 
                                title="${product.colorNames[i]}"
                                onclick="selectColor(this, '${product.colorNames[i]}')">
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
                    <button class="btn-buy-now" onclick="addToCart(${product.id}); window.location.href='carrinho.html'">Comprar Agora</button>
                </div>
                
                <div class="detail-payment">
                    <h4 class="payment-title">Formas de Pagamento</h4>
                    <div class="payment-option">
                        <span class="method">PIX (10% OFF)</span>
                        <span class="discount">R$ ${product.payment.pix.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="payment-option">
                        <span class="method">Cartão à Vista</span>
                        <span class="value">R$ ${product.payment.card.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="payment-option">
                        <span class="method">Parcelado</span>
                        <span class="value">${product.payment.installments} sem juros</span>
                    </div>
                </div>
                
                <div class="detail-specs">
                    <h4 class="specs-title">Especificações</h4>
                    <div class="specs-list">
                        ${product.specs.map(spec => `
                            <div class="spec-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                                <span>${spec}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectColor(btn, colorName) {
    document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ===========================
// Address Helpers
// ===========================
function initCpfMask() {
    const el = document.getElementById('addrCpf');
    if (!el) return;
    el.addEventListener('input', () => {
        let v = el.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        el.value = v;
    });
}

function initCepMask() {
    const el = document.getElementById('addrCep');
    if (!el) return;
    el.addEventListener('input', () => {
        let v = el.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        el.value = v;
    });
}

async function fetchAddressByCep() {
    const cepEl = document.getElementById('addrCep');
    const statusEl = document.getElementById('cepStatus');
    if (!cepEl || !statusEl) return;

    const cep = cepEl.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        statusEl.textContent = 'Digite um CEP válido.';
        statusEl.className = 'cep-status error';
        return;
    }

    statusEl.textContent = 'Buscando...';
    statusEl.className = 'cep-status';

    try {
        const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        if (!res.ok) throw new Error('CEP não encontrado');
        const data = await res.json();

        const street = document.getElementById('addrStreet');
        const neighborhood = document.getElementById('addrNeighborhood');
        const city = document.getElementById('addrCity');
        const state = document.getElementById('addrState');

        if (street) street.value = data.street || data.logradouro || '';
        if (neighborhood) neighborhood.value = data.neighborhood || data.bairro || '';
        if (city) city.value = data.city || data.localidade || '';
        if (state) state.value = data.state || data.uf || '';

        if (street) street.focus();

        statusEl.textContent = 'Endereço preenchido com sucesso.';
        statusEl.className = 'cep-status success';
    } catch (err) {
        statusEl.textContent = 'CEP não encontrado. Preencha manualmente.';
        statusEl.className = 'cep-status error';
    }
}

// ===========================
// Admin Panel
// ===========================
function initAdmin() {
    renderAdminProducts();
    
    const form = document.getElementById('addProductForm');
    if (form) {
        form.addEventListener('submit', handleAddProduct);
    }
    
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('productImages');
    
    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });
        
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
}

let uploadedImages = [];

function handleFiles(files) {
    const preview = document.getElementById('uploadPreview');
    if (!preview) return;
    
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push(e.target.result);
            renderUploadPreview();
        };
        reader.readAsDataURL(file);
    });
}

function renderUploadPreview() {
    const preview = document.getElementById('uploadPreview');
    if (!preview) return;
    
    preview.innerHTML = uploadedImages.map((img, i) => `
        <div class="upload-preview-item">
            <img src="${img}" alt="Preview ${i + 1}">
            <button onclick="removeUploadImage(${i})">×</button>
        </div>
    `).join('');
}

function removeUploadImage(index) {
    uploadedImages.splice(index, 1);
    renderUploadPreview();
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const form = e.target;
    const products = getProducts();
    
    const newProduct = {
        id: Date.now(),
        name: form.productName.value,
        subtitle: form.productSubtitle.value,
        category: form.productCategory.value,
        price: parseFloat(form.productPrice.value),
        oldPrice: form.productOldPrice.value ? parseFloat(form.productOldPrice.value) : null,
        badge: form.productBadge.value || null,
        colors: form.productColors.value.split(',').map(c => c.trim()),
        colorNames: form.productColorNames.value.split(',').map(c => c.trim()),
        images: uploadedImages.length > 0 ? uploadedImages : ['img/produto-placeholder.svg'],
        description: form.productDescription.value,
        specs: form.productSpecs.value.split(',').map(s => s.trim()),
        payment: {
            pix: parseFloat(form.productPrice.value) * 0.9,
            card: parseFloat(form.productPrice.value),
            installments: `12x de R$ ${(parseFloat(form.productPrice.value) / 12).toFixed(2).replace('.', ',')}`
        }
    };
    
    products.push(newProduct);
    saveProducts(products);
    
    form.reset();
    uploadedImages = [];
    renderUploadPreview();
    renderAdminProducts();
    showToast('Produto adicionado com sucesso!');
}

function renderAdminProducts() {
    const list = document.getElementById('adminProductsList');
    if (!list) return;
    
    const products = getProducts();
    
    list.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-thumb">
                <img src="../${product.images[0]}" alt="${product.name}">
            </div>
            <div class="admin-product-info">
                <strong>${product.name}</strong>
                <span>R$ ${product.price.toFixed(2).replace('.', ',')} • ${product.category}</span>
            </div>
            <div class="admin-product-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Excluir</button>
            </div>
        </div>
    `).join('');
}

function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    renderAdminProducts();
    showToast('Produto excluído.');
}

function editProduct(id) {
    window.location.href = `editar-produto.html?id=${id}`;
}

// ===========================
// Init based on page
// ===========================
if (document.getElementById('productDetail')) {
    initProductDetail();
}

if (document.getElementById('cartItems')) {
    renderCartPage();
}

if (document.getElementById('adminPage')) {
    initAdmin();
}
