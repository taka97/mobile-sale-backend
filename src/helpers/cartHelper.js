class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || [];
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  }

  add(item, productId, priceId) {
    let storedItem;
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items[i].productId.toString() === productId
        && this.items[i].priceId.toString() === priceId) {
        storedItem = this.items[i];
        break;
      }
    }
    if (!storedItem) {
      storedItem = {
        item, productId, priceId, qty: 0, price: 0,
      };
      this.items.push(storedItem);
    }
    if (storedItem.qty >= storedItem.item.currentQty) {
      return;
    }
    storedItem.qty += 1;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty += 1;
    this.totalPrice += storedItem.item.price;
  }

  sub(item, id) {
    let storedItem;
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items[i].id === id) {
        storedItem = this.items[i];
        break;
      }
    }
    if (!storedItem) {
      return;
    }
    storedItem.qty -= 1;
    storedItem.price = storedItem.item.one.currentPrice * storedItem.qty;
    this.totalQty -= 1;
    this.totalPrice -= storedItem.item.one.currentPrice;
  }

  remove(item, productId, priceId) {
    let storedItem; let index;
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items[i].productId.toString() === productId
        && this.items[i].priceId.toString() === priceId) {
        storedItem = this.items[i];
        index = i;
        break;
      }
    }
    if (!storedItem) {
      return;
    }
    this.totalQty -= storedItem.qty;
    this.totalPrice -= storedItem.price;
    this.items.splice(index, 1);
  }

  update(item, productId, priceId, quantity) {
    let storedItem;
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items[i].productId.toString() === productId
        && this.items[i].priceId.toString() === priceId) {
        storedItem = this.items[i];
        break;
      }
    }
    if (!storedItem) {
      storedItem = {
        item, productId, priceId, qty: 0, price: 0,
      };
      this.items.push(storedItem);
    }
    if (quantity >= storedItem.item.currentQty) {
      /* eslint-disable no-param-reassign */
      quantity = storedItem.item.currentQty;
    }
    const diff = quantity - storedItem.qty;
    storedItem.qty = quantity;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty += diff;
    this.totalPrice += storedItem.item.price * diff;
  }

  toObject() {
    const newObject = {};
    newObject.items = this.items;
    newObject.totalQty = this.totalQty;
    newObject.totalPrice = this.totalPrice;
    return newObject;
  }
}

export default Cart;
