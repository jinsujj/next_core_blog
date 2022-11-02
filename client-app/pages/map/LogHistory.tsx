import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import locationApi, { LogInfo, mapCoordinate } from "../../api/location";
import palette from "../../styles/palette";

const Container = styled.div`
  max-width: 1200px;
  margin: auto auto;
  box-sizing: border-box;
  position: relative;
  background: white;

  .summary {
    border-bottom: 2px solid ${palette.green_53};
    width: 100%;
    margin-bottom: 10px;
  }

  .title {
    font-weight: 600;
    font-size: 32px;
  }

  .description {
    margin: 0 10px;

    h3 {
      margin-top: 10px;
      border-bottom: 2px solid ${palette.green_53};
    }

    li {
      list-style: none !important;
    }
  }

  .table {
    overflow-x: scroll !importable;
  }
`;

const LogHistory = () => {
  const [coordinate, setCoordinate] = useState<mapCoordinate[]>([]);
  const [ipdictionary, setIpDictionary] = useState<Map<string, string[]>>();
  const [logInfo, setLogInfo] = useState<LogInfo[]>();

  const mapElement = useRef(null);

  // [get Data]
  useEffect(() => {
    locationApi.getLogHistoryDaily().then((res) => setLogInfo(res.data));
    locationApi.getDailyIpCoordinate().then((res) => setCoordinate(res.data));
    getNoteTitleByIp();
  }, []);

  // [set naver map]
  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // map option
    const mapOptions: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(37.5656, 126.9869),
      zoom: 8,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    // map Object
    const map = new naver.maps.Map(mapElement.current, mapOptions);
    coordinate.map((t) => {
      // marker Object
      var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(parseFloat(t.lat), parseFloat(t.lon)),
        map: map,
      });

      // marker Description
      var infowindow = new naver.maps.InfoWindow({
        content: `<div class="description">
                    <h3>${t.ip}</h3>
                    ${ipdictionary
                      ?.get(t.ip)
                      ?.map((value, index) => `<li>${value}</li>`)}
                  </div>
                  `,
      });

      // Description Listener
      naver.maps.Event.addListener(marker, "click", function (e) {
        if (infowindow.getMap()) {
          infowindow.close();
        } else {
          infowindow.open(map, marker);
        }
      });
    });
  }, [ipdictionary]);

  const getNoteTitleByIp = async () => {
    const keySet: string[] = [];
    const dictionary = new Map<string, string[]>();
    var { data } = await locationApi.GetNoteTitleByIp();

    data.map((t) => {
      // key set
      if (!keySet.some((data) => data === t.ip)) {
        keySet.push(t.ip);
        dictionary.set(t.ip, [""]);
      }

      // value set
      let value = dictionary.get(t.ip);
      if (value) {
        value = value.filter((t) => t.length > 0);
        value.push(t.title);
        dictionary.set(t.ip, value);
      }
    });
    setIpDictionary(dictionary);
  };

  return (
    <Container>
      <div className="summary">
        <div className="title">블로그 접속 Ip 추적</div>
      </div>
      <div
        ref={mapElement}
        style={{ minHeight: "600px", marginBottom: "40px" }}
      />
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th scope="col">row</th>
            <th scope="col">ip</th>
            <th scope="col">date</th>
            <th scope="col">title</th>
            <th scope="col">country</th>
            <th scope="col">countryCode</th>
            <th scope="col">city</th>
            <th scope="col">lat</th>
            <th scope="col">lon</th>
            <th scope="col">timezone</th>
            <th scope="col">isp</th>
          </tr>
        </thead>
        <tbody>
          {logInfo?.map(function (t, index) {
            return (
              <tr>
                <th scope="row">{index}</th>
                <td>{t.ip}</td>
                <td>
                  {format(
                    new Date(t.date.replace(/-/g, "/")),
                    "yyyy-MM-dd HH:MM:ss"
                  )}
                </td>
                <td>{t.title}</td>
                <td>{t.country}</td>
                <td>{t.countryCode}</td>
                <td>{t.city}</td>
                <td>{t.lat}</td>
                <td>{t.lon}</td>
                <td>{t.timezone}</td>
                <td>{t.isp}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
};

export default LogHistory;
