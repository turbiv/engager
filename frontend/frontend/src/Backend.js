import axios from "axios";
import store from "./store/configureStore";

import BACKEND from "./constants/backendroot";
import uuid from "uuid";

export const PUBLISH_DRAFT = 1;
export const PUBLISH_STAGING = 2;
export const PUBLISH_PRODUCTION = 3;

export const retriveProfile = () => {
  const token = store.getState().clientData.token;
  const query = BACKEND + "/api/my-profile";

  return new Promise((resolve, reject) => {
    axios
      .get(query, {
        headers: { Authorization: token }
      })
      .then(res => {
        console.log("query done res.data", res.data);
        resolve(res.data);
      })
      .catch(error => {
        console.log("Profile", error);
        if (error.response) console.log("code", error.response.status);
        reject();
      });
  });
};

export const uploadProfile = profile => {
  const token = store.getState().clientData.token;
  const query = BACKEND + "/api/my-profile";

  return new Promise((resolve, reject) => {
    axios
      .post(query, profile, {
        headers: { "Content-Type": "application/json", Authorization: token }
      })
      .then(function(response) {
        resolve();
      })
      .catch(function(error) {
        reject();
      });
  });
};

export const uploadImage = (selectedFile) => {
  const data = new FormData();
  data.append("image", selectedFile);
  const iuuid = uuid.v4();
  const token = store.getState().clientData.token;
  const query = `${BACKEND}/api/image-upload/meta/${iuuid}/`;

  return new Promise((resolve, reject) => {
    axios
      .post(query, data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token }
      })
      .then(function(response) {
        resolve(iuuid);
      })
      .catch(function(error) {
        reject(iuuid);
      });
  });
};

export const publishProfile = type => {
  const token = store.getState().clientData.token;
  const query = `${BACKEND}/index.php/publish/${type}`;

  return new Promise((resolve, reject) => {
    axios
      .post(query, "", {
        headers: { "Content-Type": "text/plain", Authorization: token }
      })
      .then(function(response) {
        resolve();
      })
      .catch(function(error) {
        reject();
      });
  });
};

export const deleteImages = uuids => {
  const token = store.getState().clientData.token;
  const query = `${BACKEND}/index.php/image`;
  const deleteParams = { token, uuids }; // delete has no params

  return new Promise((resolve, reject) => {
    axios
      .delete(query, { data: deleteParams })
      .then(function(response) {
        resolve();
      })
      .catch(function(error) {
        reject();
      });
  });
};

export const queryOrders = testing => {
  const publishing = testing ? PUBLISH_STAGING : PUBLISH_PRODUCTION;
  const token = store.getState().clientData.token;

  const query = `${BACKEND}/index.php/orders/${publishing}`;

  return new Promise((resolve, reject) => {
    axios
      .get(query, {
        headers: { Authorization: token }
      })
      .then(res => {
        console.log("query orders done res.data", res.data);
        resolve(res.data);
      })
      .catch(error => {
        console.log("orders", error);
        if (error.response) console.log("code", error.response.status);
        reject();
      });
  });
};

export const completeOrder = key => {
  const token = store.getState().clientData.token;

  const query = `${BACKEND}/index.php/order_complete/${key}`;

  return new Promise((resolve, reject) => {
    axios
      .post(query, "", {
        headers: { Authorization: token }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject();
      });
  });
};

export const getImageUrl = uuid => {
  const type = PUBLISH_DRAFT;
  return `${BACKEND}/index.php/image/${type}/${uuid}`;
};
