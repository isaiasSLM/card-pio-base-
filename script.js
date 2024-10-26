let orderSummaryVisible = false;
let orderCount = 0;
let totalValue = 0;

function addItem(event) {
    const item = event.target.closest('.menu-item');
    const quantitySpan = item.querySelector('.quantity');
    const price = parseFloat(item.dataset.price);
    let quantity = parseInt(quantitySpan.innerText);
    quantity++;
    quantitySpan.innerText = quantity;
    orderCount++;
    updateOrderCount();
    updateOrderSummary();
    totalValue += price;
    updateTotalValue();
}

function removeItem(event) {
    const item = event.target.closest('.menu-item');
    const quantitySpan = item.querySelector('.quantity');
    const price = parseFloat(item.dataset.price);
    let quantity = parseInt(quantitySpan.innerText);
    if (quantity > 0) {
        quantity--;
        quantitySpan.innerText = quantity;
        orderCount--;
        updateOrderCount();
        updateOrderSummary();
        totalValue -= price;
        updateTotalValue();
    }
}

function updateOrderCount() {
    document.getElementById('order-count').innerText = orderCount;
}

function toggleOrderSummary() {
    orderSummaryVisible = !orderSummaryVisible;
    const orderSummary = document.getElementById('order-summary');
    if (orderSummaryVisible) {
        orderSummary.classList.remove('hidden'); // Remover a classe hidden
    } else {
        orderSummary.classList.add('hidden'); // Adicionar a classe hidden
    }
}

function updateOrderSummary() {
    const summaryItemsContainer = document.getElementById('summary-items');
    summaryItemsContainer.innerHTML = '';

    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        const itemName = item.querySelector('.item-name').innerText;
        const quantity = parseInt(item.querySelector('.quantity').innerText);
        const price = parseFloat(item.dataset.price);
        if (quantity > 0) {
            const summaryItem = document.createElement('div');
            summaryItem.innerHTML = `
                <span>${itemName}</span>
                <span>Quantidade: ${quantity}</span>
                <span class="remove-item" onclick="removeItemFromSummary(event)">Remover</span>
            `;
            summaryItemsContainer.appendChild(summaryItem);
        }
    });
}

function updateTotalValue() {
    document.getElementById('total-value').innerText = `Total: R$${totalValue.toFixed(2)}`;
}

function removeItemFromSummary(event) {
    const itemToRemove = event.target.closest('div');
    const itemName = itemToRemove.querySelector('span:first-child').innerText;
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (item.querySelector('.item-name').innerText === itemName) {
            const quantitySpan = item.querySelector('.quantity');
            const price = parseFloat(item.dataset.price);
            let quantity = parseInt(quantitySpan.innerText);
            if (quantity > 0) {
                quantity--;
                quantitySpan.innerText = quantity;
                orderCount--;
                updateOrderCount();
                totalValue -= price;
                updateTotalValue();
            }
        }
    });
    itemToRemove.remove();
    updateOrderSummary();
}

function sendOrder() {
    const customerName = document.getElementById('customer-name').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const change = document.getElementById('change').value;
    const observacao = document.getElementById('observacao').value;

    let orderText = `*Pedido de ${customerName}*\n\n*Itens do Pedido:*\n`;
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        const itemName = item.querySelector('.item-name').innerText;
        const quantity = parseInt(item.querySelector('.quantity').innerText);
        if (quantity > 0) {
            orderText += `- ${itemName}: ${quantity}\n`;
        }
    });

    orderText += `\n*Forma de Pagamento*: ${paymentMethod === 'cash' ? 'Dinheiro' : 'Cartão'}`;
    if (paymentMethod === 'cash' && change) {
        orderText += `\n*Troco para*: R$ ${change}`;
    }
    orderText += `\n*Observações*: ${observacao ? observacao : 'Nenhuma'}\n`;
    orderText += `\n*Total*: R$${totalValue.toFixed(2)}`;

    const whatsappNumber = '558488770810'; // Substitua pelo seu número de WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderText)}`;
    window.open(whatsappUrl, '_blank');
}


// Evento para exibir o campo de troco se a opção de pagamento for em dinheiro
document.getElementById('payment-method').addEventListener('change', function () {
    const changeDiv = document.getElementById('change-div');
    if (this.value === 'cash') {
        changeDiv.classList.remove('hidden');
    } else {
        changeDiv.classList.add('hidden');
    }
});