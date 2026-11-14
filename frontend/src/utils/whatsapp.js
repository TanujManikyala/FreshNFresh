export function generateWhatsAppOrderUrl(order, storePhone = '8367089034') {
  const cleanPhone = storePhone.replace(/\D/g, '');
  const itemsText = (order.items || [])
    .map((item, idx) => `  ${idx + 1}. *${item.name}* (${item.teluguName || ''}) - ${item.quantity} x ₹${item.price} = ₹${item.total}`)
    .join('\n');

  const message = 
`🥬 *NEW ORDER - Fresh & Fresh Vegetables* 🥕
Order ID: *${order.id || 'Quick Order'}*
---------------------------------------
*Items Ordered:*
${itemsText}
---------------------------------------
*Subtotal:* ₹${order.subtotal}
*Delivery Fee:* ${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
*Grand Total:* *₹${order.total}*
*Payment Mode:* ${order.paymentMethod || 'Cash on Delivery'}

*Customer Details:*
👤 Name: ${order.customer?.name || 'Customer'}
📞 Phone: ${order.customer?.phone || ''}
📍 Address: ${order.customer?.address || ''}
${order.customer?.landmark ? `📌 Landmark: ${order.customer.landmark}\n` : ''}🕒 Time Slot: ${order.customer?.timeSlot || 'Earliest available'}
${order.notes ? `📝 Notes: ${order.notes}\n` : ''}
_Direct from farm to store, store to you - Shamshabad_`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/91${cleanPhone}?text=${encoded}`;
}

export function openWhatsAppChat(storePhone = '8367089034', defaultText = 'Hello Fresh & Fresh! I would like to inquire about today\'s fresh vegetables.') {
  const cleanPhone = storePhone.replace(/\D/g, '');
  const encoded = encodeURIComponent(defaultText);
  window.open(`https://wa.me/91${cleanPhone}?text=${encoded}`, '_blank');
}

