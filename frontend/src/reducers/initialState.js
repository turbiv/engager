const initialState = {
  clientData: {
    isFetching: true,
    token: "",
    tabs: {},
    errors: {},
    profile: {
      categories: [],
      info: {
        phone: "",
        email: "",
        social: "",
        openHours: [""],
        address: [""],
        location: {
          lat: 0,
          lng: 0,
          preview: ""
        }
      }
    }
  },
  orderData: {
    isFetching: false,
    orders: []
  }
};

export default initialState;
