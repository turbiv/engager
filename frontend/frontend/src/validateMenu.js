export const validateSellable = (sellable, ret) => {
  const err = { id: sellable.id, errors: [] };
  //Good for debugging
  console.log(sellable);
  if (sellable.name.length === 0) {
    err.errors.push({ text: "Menu title is not filled in" });
  }
  if (sellable.desc.length === 0) {
    err.errors.push({ text: "Menu description is not filled in" });
  }
  if (!sellable.intro.path) {
    err.errors.push({ text: "Menu should have preview image" });
  }

  if ((sellable.price === undefined || sellable.price.length === 0)|| (sellable.price[0] === 0 && sellable.price[1] === 0)) {
    err.errors.push({ text: "Menu should have price" });
  } else if (sellable.price[1] > 100) {
    err.errors.push({ text: "Price cents must be less than 100" });
  }

  if(sellable.oldprice[0] <= sellable.price[0]){
    if(sellable.oldprice[1] <= sellable.price[1]){
      err.errors.push({ text: "Old price has to be less than current price" });
    }
  }

  if (sellable.promo.time.days.length > 0) {
    if (sellable.promo.time.time_between[0] > sellable.promo.time.time_between[1])
      err.errors.push({
        text: "Scheduled starting time must be earlier than end time"
      });
  }

  if (sellable.promo.path.length > 0 || sellable.promo.square.path.length > 0) {
    if (sellable.promo.square.path.length === 0) {
      err.errors.push({ text: "Promo must have a thumbnail image" });
    }
    if(sellable.promo.path.length === 0){
      err.errors.push({ text: "Promo must have an image" });
    }
  }

  if (sellable.promo.push && sellable.promo.message.length === 0) {
    err.errors.push({
      text: "Pushing promo must have a notification message"
    });
  }

  if (sellable.bonuses.length > 0) {
    sellable.bonuses.forEach((bonus) => {
      if (bonus.condition.length === 0)
        err.errors.push({ text: "Bonus must have a bonus type" });
      if (bonus.display.big.subtext.length === 0)
        err.errors.push({ text: "Bonus short label must be filled" });
      if (bonus.display.small.text.length === 0)
        err.errors.push({ text: "Bonus long label must be filled" });
      if (bonus.interest_type.length === 0) {
        err.errors.push({ text: "Bonus must have a discount method" });
      } else {
        if (bonus.interest_type === "percent") {
          if (bonus.interest.percent === 0)
            err.errors.push({
              text: "Bonus discount must be more than 0 percent"
            });
          if (bonus.interest.percent > 100)
            err.errors.push({
              text: "Bonus discount cannot be more than 100 percent"
            });
        } else {
          if (
            bonus.interest.total === undefined ||
            (bonus.interest.total[0] === 0 &&
              bonus.interest.total[1] === 0)
          )
            err.errors.push({ text: "Bonus discount must have a discount" });
          if (bonus.interest.total[1] > 99)
            err.errors.push({
              text: "Bonus discount cents must be less than 100"
            });
        }
      }
      if (bonus.time.days.length > 0) {
        if (bonus.time.time_between[0] > bonus.time.time_between[1])
          err.errors.push({
            text: "Scheduled starting time must be earlier than end time"
          });
      }

      if(bonus.interest.total[0] >= sellable.price[0]){
        if(bonus.interest.total[1] > sellable.price[1]){
          err.errors.push({ text: "Fixed bonus discount cannot be more than the price" });
        }
      }
    });
  }
  if (err.errors.length > 0) ret.errors.sellables.push(err);
};

export const validateMenuData = clientData => {
  const ret = {
    status: false,
    errors: {
      globals: [],
      categories: [],
      sellables: []
    }
  };

  if (clientData.profile.categories.length === 0) {
    ret.errors.globals.push({
      text: "Your menu is empty. Add at least one menu item"
    });
    return ret;
  }

  clientData.profile.categories.forEach(category => {
    const err = { id: category.id, errors: [] };
    if (category.name.length === 0) {
      err.errors.push({
        text: "Category name is not filled in",
        type: "no-cat-name"
      });
    }

    const sellables = category.sellables;

    if (sellables.length === 0) {
      err.errors.push({ text: "", type: "no-items" }); // shown as snackbar in window
    }
    if (err.errors.length > 0) ret.errors.categories.push(err);
    sellables.forEach(sellable => {
      validateSellable(sellable, ret);
    });
  });

  ret.status =
    ret.errors.categories.length === 0 && ret.errors.sellables.length === 0;

  return ret;
};
