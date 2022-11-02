import api from "./index";

export interface LogInfo {
  ip: string;
  date: string;
  title: string;
  country: string;
  countryCode: string;
  city: string;
  lat: string;
  lon: string;
  timezone: string;
  isp: string;
}

export interface mapCoordinate {
  ip: string;
  lat: string;
  lon: string;
}

const getLogHistoryAll = async () => {
  return await api.get<LogInfo[]>(`/api/MapHistory/logInfoAll`);
};

const getLogHistoryDaily = async () => {
  return await api.get<LogInfo[]>(`/api/MapHistory/logInfoDaily`);
};

const getDailyIpCoordinate = async () => {
  return await api.get<mapCoordinate[]>(`/api/MapHistory/dailyIpCoordinate`);
};

const GetNoteTitleByIp = async () => {
  return await api.get<LogInfo[]>(`/api/MapHistory/GetNoteTitleByIp`);
};

const locationApi = {
  getLogHistoryAll,
  getLogHistoryDaily,
  getDailyIpCoordinate,
  GetNoteTitleByIp,
};

export default locationApi;
