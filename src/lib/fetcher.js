import client from "./client";

const fetcher = (url) => client.get(url).then((res) => {
  if (url === '/user/profile') {
    console.log('Profile endpoint response:', res.data);
  }
  return res.data;
});

export default fetcher;
