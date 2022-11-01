import React, { useEffect, useRef } from 'react';
import locationApi from '../../api/location';


const LogHistory= () => {
  const mapElement = useRef(null);

  const getDailyCoordinate = async () => {
    return await (await locationApi.getDailyIpCoordinate()).data;
  }

  useEffect(() => {
    const {naver} = window;
    if(!mapElement.current || !naver) return;

    const location = new naver.maps.LatLng(37.5656,126.9869);
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    }

    const map = new naver.maps.Map(mapElement.current, mapOptions);
    var data = getDailyCoordinate();
    data.then(
      t=> t.map(d => {
        new naver.maps.Marker({
          position: new naver.maps.LatLng(Number(d.lat), Number(d.lon)),
          map,
        })
      })
    )

  },[]);

  return (
    <div ref={mapElement} style={{minHeight: '400px'}}/>
  )
  
};

export default LogHistory;