import api from "./index";

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
  email: string;
};


const getKakaoAccessCode = async () => {
  return await api.get(KAKAO_LOGIN_URI);
};

const postAccesCode = async (payload: KakaoParam) => {
  api.defaults.withCredentials = false;

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
    }
  );
  return res.data;
};

const postKaKaoToken = async (token: string) => {
  const kakaoToken :kakaoToken= {
    token: token
  };

  return api.post(`/api/Oauth/Kakao/Login`, kakaoToken);
};

const postKakaoLogout = async (email : string) => {
  const kakaoEmail :kakaoEmail= {
    email: email
  };
  return api.post(`/api/Oauth/Kakao/Logout`, kakaoEmail);
};

const kakaoApi = {
  getKakaoAccessCode,
  postAccesCode,
  postKaKaoToken,
  postKakaoLogout,
};

export default kakaoApi;
