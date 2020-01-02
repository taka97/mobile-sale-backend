import config from 'config';

const MAXITEMS = config.get('maxItems');

class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || [];
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  }

  add(item, productId, optionId) {
    let storedItem;
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items[i].productId.toString() === productId
        && this.items[i].optionId.toString() === optionId) {
        storedItem = this.items[i];
        break;
      }
    }
    if (!storedItem) {
      storedItem = {
        item, productId, optionId, qty: 0, price: 0,
      };
      this.items.push(storedItem);
    }
    if (storedItem.qty >= MAXITEMS) {
      return;
    }
    storedItem.qty += 1;
    storedItem.price = storedItem.item.value * storedItem.qty;
    this.totalQty += 1;
    this.totalPrice += Number(storedItem.item.value);
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
    storedItem.price = Number(storedItem.item.value) * storedItem.qty;
    this.totalQty -= 1;
    this.totalPrice -= Number(storedItem.item.value);
  }

  remove(item, productId, optionId) {
    let storedItem; let index;
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items[i].productId.toString() === productId
        && this.items[i].optionId.toString() === optionId) {
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

  update(item, productId, optionId, quantity) {
    let storedItem;
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items[i].productId.toString() === productId
        && this.items[i].optionId.toString() === optionId) {
        storedItem = this.items[i];
        break;
      }
    }
    if (!storedItem) {
      storedItem = {
        item, productId, optionId, qty: 0, price: 0,
      };
      this.items.push(storedItem);
    }
    if (quantity >= MAXITEMS) {
      /* eslint-disable no-param-reassign */
      quantity = MAXITEMS;
    }
    const diff = quantity - storedItem.qty;
    storedItem.qty = quantity;
    storedItem.price = storedItem.item.value * storedItem.qty;
    this.totalQty += diff;
    this.totalPrice += storedItem.item.value * diff;
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
