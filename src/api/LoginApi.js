import axios from 'axios';
export const LoginApi = async (username, password) => {
  const result = await axios.post('http://tabling-load-balancer-1692678199.ap-northeast-2.elb.amazonaws.com:8080/api/users/login', {username, password});
  return result.data.data;
}