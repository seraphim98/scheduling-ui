import  axios from "axios";
import https from "https";

const test = {
    "startTime": "2024-05-07T19:34:13.354Z",
    "endTime": "2024-05-07T19:34:13.354Z"
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
async function main() {
    let response = await axios.get("https://localhost:7071/api/Events");
    console.log(response.data);
}
main()
/**
 * let dateInIso = new Date(date).toISOString();
  return dateInIso >= event.startTime && dateInIso <= event.endTime;
 */