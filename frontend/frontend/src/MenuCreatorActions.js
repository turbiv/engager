import * as backend from "./Backend";
import * as appActions from "./reducers/app.actions";
import store from "./store/configureStore";
import { validateMenuData } from "./validateMenu";
import uuid from "uuid";
import { saveCurrentProfile } from "./SaveProfile";

export const createNewSellable = category => {
  return {
    cat: category.id,
    id: uuid.v4(),
    name: "",
    oldprice: [],
    price: [],
    desc: "",
    intro: {
      size: {}
    },
    promo: {
      size: {},
      square: {
        path: "",
        size: {}
      },
      time: {
        days: [],
        time_between: ["00:00", "23:59"]
      },
      push: false,
      message: "",
      path: ""
    },
    bonuses: []
  };
};

export const createNewCategoryWithSellable = () => {
  const category = {
    name: "",
    id: uuid.v4(),
    sellables: []
  };
  const sellable = createNewSellable(category);
  category.sellables.push(sellable);
  store.dispatch(appActions.addSellableCategoryToProfile(category));

  saveCurrentProfile();
};

export const addNewSellableToCategory = category => {
  const sellable = createNewSellable(category);
  store.dispatch(appActions.addSellableToCategory(category, sellable));

  saveCurrentProfile();
};

export const setSellableName = (sellable, name) => {
  store.dispatch(appActions.setSellableTextProp(sellable, "name", name));
  saveCurrentProfile();
};

export const setSellableDescription = (sellable, desc) => {
  store.dispatch(appActions.setSellableTextProp(sellable, "desc", desc));
  saveCurrentProfile();
};

export const removeImageFromSellable = (sellable, uuidImage, what) => {
  store.dispatch(appActions.removeImageFromSellable(sellable, uuidImage, what));

  backend.deleteImages([uuidImage]).then(() => {
    saveCurrentProfile();
  });
};

export const getSellableImages = sellable => {
  const ret = [];
  if (sellable.intro && sellable.intro.path) ret.push(sellable.intro.path);
  if (sellable.promo && sellable.promo.path) ret.push(sellable.promo.path);
  if (sellable.promo.square && sellable.promo.square.path)
    ret.push(sellable.promo.square.path);
  return ret;
};

export const removeSellable = (category, sellable) => {
  store.dispatch(appActions.removeSellable(category, sellable));
  backend.deleteImages(getSellableImages(sellable)).then(() => {
    saveCurrentProfile();
  });
};

export const removeCategory = category => {
  const sellablesToRemove = category.sellables;
  let imgToRemove = [];
  sellablesToRemove.forEach(sellable => {
    imgToRemove = imgToRemove.concat(getSellableImages(sellable));
  });

  sellablesToRemove.forEach(sellable => {
    store.dispatch(appActions.removeSellable(category, sellable));
  });
  store.dispatch(appActions.removeCategory(category));

  backend.deleteImages(imgToRemove).then(() => {
    saveCurrentProfile();
  });
};

export const setCategoryName = (category, name) => {
  if (category.name !== name) {
    store.dispatch(appActions.setCategoryName(category, name));
    saveCurrentProfile();
  }
};

export const setImageToSellable = (sellable, iuuid, what) => {
  store.dispatch(appActions.setImageToSellable(sellable, iuuid, what));
  saveCurrentProfile();
};

export const updateImageSize = (sellable, iuuid, width, height, what) => {
  const meta = { w: width, h: height };
  store.dispatch(appActions.updateImageSize(sellable, iuuid, meta, what));
  saveCurrentProfile();
};

export function setSellablePrice(sellable, value, what, index) {
  store.dispatch(appActions.setSellablePrice(sellable, value, what, index));
  saveCurrentProfile();
}

export function updateSellablePromo(sellable, what, value) {
  store.dispatch(appActions.updateSellablePromo(sellable, what, value));
  saveCurrentProfile();
}
export function setSellableNewBonus(sellable) {
  const bonus = {
    id: uuid.v4(),
    condition: "",
    interest_type: "",
    interest: {
      total: [0, 0],
      percent: 0
    },
    display: {
      small: { text: "" },
      big: { text: "", subtext: "" }
    },
    time: {
      days: [],
      time_between: ["00:00", "23:59"]
    }
  };
  store.dispatch(appActions.setSellableNewBonus(sellable, bonus));
  saveCurrentProfile();
}

export function removeSellableBonus(sellable, bonus) {
  store.dispatch(appActions.removeSellableBonus(sellable, bonus));
  saveCurrentProfile();
}

export function updateSellableBonus(sellable, bonus, what, value) {
  store.dispatch(appActions.updateSellableBonus(sellable, bonus, what, value));
  saveCurrentProfile();
}

export const moveSellablePosition = (category, sellable, where) => {
  const sellables = category.sellables;
  const whatToMove = sellables.findIndex(item => {
    return item.id === sellable.id;
  });
  if (whatToMove === -1) return;
  let destToMove = where === "down" ? whatToMove + 1 : whatToMove - 1;
  if (destToMove < 0 || destToMove >= sellables.length) return;

  store.dispatch(
    appActions.swapSellablePosition(category, whatToMove, destToMove)
  );
};

export const publishToStaging = clientData => {
  return new Promise((resolve, reject) => {
    const result = validateMenuData(clientData);
    console.log("validated as ", result);

    if (result.status) {
      store.dispatch(appActions.setValidationErrors({}));
      backend.publishProfile(backend.PUBLISH_STAGING);
      resolve();
    } else {
      store.dispatch(appActions.setValidationErrors(result.errors));
      reject({ validation: false });
    }
  });
};

export const publishToProduction = clientData => {
  return new Promise((resolve, reject) => {
    resolve();
  });
};
