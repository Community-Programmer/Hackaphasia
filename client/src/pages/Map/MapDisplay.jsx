import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Circle from "ol/geom/Circle";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon, Stroke, Fill } from "ol/style";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const App = () => {
  const mapRef = useRef();
  const [weather, setWeather] = useState(null);
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    ph: "",
    rainfall: "",
  });
  const [cropRecommendation, setCropRecommendation] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          setLocation({ lat: latitude, lon: longitude });

          const transformedCoords = fromLonLat([longitude, latitude]);

          // Add a circle and pin to the map
          const pinFeature = new Feature({
            geometry: new Point(transformedCoords),
          });
          pinFeature.setStyle(
            new Style({
              image: new Icon({
                src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
                scale: 0.1,
              }),
            })
          );

          const circleFeature = new Feature({
            geometry: new Circle(transformedCoords, 500), // Radius in meters
          });
          circleFeature.setStyle(
            new Style({
              stroke: new Stroke({
                color: "green",
                width: 2,
              }),
              fill: new Fill({
                color: "rgba(0, 255, 0, 0.2)",
              }),
            })
          );

          const vectorLayer = new VectorLayer({
            source: new VectorSource({
              features: [pinFeature, circleFeature],
            }),
          });

          map.addLayer(vectorLayer);
          map.getView().setCenter(transformedCoords);
          map.getView().setZoom(15);

          // Fetch weather data
          const apiKey = "1ee80fe86619a2df2d56593f5c6d8e57";
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
          );
          const weatherData = await weatherResponse.json();
          setWeather({
            location: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            feelsLike: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
          });
        },
        (error) => {
          console.error("Error fetching geolocation", error);
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat || !location.lon) {
      alert("Unable to fetch geolocation. Please allow location access.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/recommend_crop/", {
        ...formData,
        lat: location.lat,
        lon: location.lon,
      });
      setCropRecommendation(response.data);
    } catch (error) {
      console.error("Error fetching crop recommendation:", error);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Map container */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Form overlay */}
      <Card className="absolute top-4 left-4 w-72 bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Crop Recommendation</CardTitle>
          <CardDescription>Fill in the soil details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Input
              type="number"
              name="N"
              value={formData.N}
              onChange={handleInputChange}
              placeholder="Nitrogen (N)"
              className="mb-2"
              required
            />
            <Input
              type="number"
              name="P"
              value={formData.P}
              onChange={handleInputChange}
              placeholder="Phosphorus (P)"
              className="mb-2"
              required
            />
            <Input
              type="number"
              name="K"
              value={formData.K}
              onChange={handleInputChange}
              placeholder="Potassium (K)"
              className="mb-2"
              required
            />
            <Input
              type="number"
              step="0.01"
              name="ph"
              value={formData.ph}
              onChange={handleInputChange}
              placeholder="pH Level"
              className="mb-2"
              required
            />
            <Input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleInputChange}
              placeholder="Rainfall (mm)"
              className="mb-2"
              required
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Weather Overlay */}
      {weather && (
        <Card className="absolute top-4 right-4 w-64 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>{weather.location}</CardTitle>
            <CardDescription>{weather.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="Weather Icon"
                className="w-16 h-16"
              />
              <div className="ml-4">
                <p className="text-xl font-bold">{weather.temperature}°C</p>
                <p className="text-sm">Feels like: {weather.feelsLike}°C</p>
                <p className="text-sm">Humidity: {weather.humidity}%</p>
                <p className="text-sm">Wind: {weather.windSpeed} m/s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crop Recommendation Overlay */}
      {cropRecommendation && (
        <Card className="absolute bottom-4 left-4 w-72 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Recommended Crop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <img
                src={cropRecommendation.crop_image_url}
                alt={cropRecommendation.recommended_crop}
                className="w-32 h-32 mb-4"
              />
              <p className="text-lg font-bold">{cropRecommendation.recommended_crop}</p>
              <p>Temperature: {cropRecommendation.weather_data.temperature}°C</p>
              <p>Humidity: {cropRecommendation.weather_data.humidity}%</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default App;
