import api from "./index";
import { User } from "./user";

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;
const KAKAO_LOGIN_URI = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

export interface KakaoParam {
  client_id: string;
  redirect_uri: string;
  code: string;
  client_secret: string;
}

export interface kakaoTokenResponse {
  token_type: string;
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
}

export type kakaoToken = {
  code: string;
};

export type kakaoEmail = {
  Email: string;
};

const getKakaoAccessCode = async () => {
  return await api.get(KAKAO_LOGIN_URI);
};

const kakaoLoginByEmail = async (email: string) => {
  const kakaoEmail: kakaoEmail = {
    Email: email,
  };
  const result = api.post<User>(`/api/Oauth/Kakao/LoginByEmail`, kakaoEmail);
  return result;
};

interface KakaoUserTokenResponse {
  data: { access_token: string };
}
interface KakaoLoginResponse {
  data: User;
}
const postkakaoLogin = async (code: string) => {
  const { data: user } = await api.post<kakaoToken, KakaoLoginResponse>(
    `/api/Oauth/Kakao/userToken`,
    { code }
  );

  return user;
};

const postKakaoLogout = async (email: string) => {
  const kakaoEmail: kakaoEmail = {
    Email: email,
  };
  return api.post(`/api/Oauth/Kakao/Logout`, kakaoEmail);
};

const kakaoApi = {
  getKakaoAccessCode,
  postkakaoLogin,
  postKakaoLogout,
  kakaoLoginByEmail,
};

export default kakaoApi;
