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
  token: string;
};

export type kakaoEmail = {
  Email: string;
};


const getKakaoAccessCode = async () => {
  return await api.get(KAKAO_LOGIN_URI);
};

const postAccesCode = async (payload: KakaoParam) => {
  const res = await api.post<kakaoTokenResponse>(
    `https://kauth.kakao.com/oauth/token`,
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: payload.client_id,
      redirect_uri: payload.redirect_uri,
      code: payload.code,
      client_secret: payload.client_secret,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      withCredentials: false 
    },
  );
  return res.data;
};

const kakaoLoginByEmail = async (email: string) => {
  const kakaoEmail :kakaoEmail= {
    Email: email
  };
  const result = api.post<User>(`/api/Oauth/Kakao/LoginByEmail`, kakaoEmail);
  return result;
}

const postkakaoLogin = async (token: string) => {
  const kakaoToken :kakaoToken= {
    token: token
  };

  const result = api.post<User>(`/api/Oauth/Kakao/Login`, kakaoToken);
  return result;
};

const postKakaoLogout = async (email : string) => {
  const kakaoEmail :kakaoEmail= {
    Email: email
  };
  return api.post(`/api/Oauth/Kakao/Logout`, kakaoEmail);
};

const kakaoApi = {
  getKakaoAccessCode,
  postAccesCode,
  postkakaoLogin,
  postKakaoLogout,
  kakaoLoginByEmail
};

export default kakaoApi;
