import axios from "axios";
const invoke = ({
  method,
  baseURL,
  route,
  data,
  headers = { Accept: "application/json" },
}) => {
  console.log("url", `${baseURL}/${route}`)
  return axios({
    method,
    url: `${baseURL}/${route}`,
    data,
    headers,
  });
};

export default invoke;
