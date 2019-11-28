const BACKEND_DEV = "http://192.168.14.131/backend/engager-backend/rest";
const BACKEND_PROD = "https://www.myfotoplaces.com/engager/admin";

const BACKEND =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? BACKEND_DEV
    : BACKEND_PROD;

export default BACKEND;
