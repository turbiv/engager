import { Price } from "./Price";

const getAllSellables = categories => {
  let sellables = [];
  categories.forEach(category => {
    sellables = sellables.concat(category.sellables);
  });
  return sellables;
};

export const buildOrders = submitted => {
  const profile = JSON.parse(submitted.profile);
  const sellables = getAllSellables(profile.categories);

  const ret = submitted.orders.map(order => {
    const userSelection = JSON.parse(order.json);
    const { checkedOut } = userSelection;

    const item = {
      expire:
        submitted.timenow >
        Number(order.create_time) + Number(order.client_valid_to_time),
      orderKey: order.key_uuid,
      user_code: order.user_code,
      orderStatus: order.order_status,
      haveBonus: checkedOut.haveBonus,
      bonus: checkedOut.bonus,
      subtotal: checkedOut.subtotal,
      total: checkedOut.total,
      purchases: []
    };

    item.bonusDisplay = Price.toDiplay(
      Price.create(item.bonus.dollars, item.bonus.cents)
    );
    item.totalDisplay = Price.toDiplay(
      Price.create(item.total.dollars, item.total.cents)
    );
    item.subtotalDisplay = Price.toDiplay(
      Price.create(item.subtotal.dollars, item.subtotal.cents)
    );

    item.purchases = userSelection.orders.map(purchase => {
      const sellable = sellables.find(s => s.id === purchase.id);

      const itemPrice = Price.create(
        sellable ? sellable.price[0] : 0,
        sellable ? sellable.price[1] : 0
      );
      const total = Price.multiply(itemPrice, purchase.total);
      return {
        name: sellable ? sellable.name : purchase.id,
        price: itemPrice,
        priceDisplay: Price.toDiplay(itemPrice),
        total: total,
        totalDisplay: Price.toDiplay(total),
        amount: purchase.total
      };
    });

    return item;
  });

  return ret;
};
