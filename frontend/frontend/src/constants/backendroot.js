const BACKEND_DEV = "http://localhost:3003/backend/engager-backend/";
const BACKEND_PROD = "https://www.myfotoplaces.com/engager/admin";

const BACKEND =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? BACKEND_DEV
    : BACKEND_PROD;

export default BACKEND;
