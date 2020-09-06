/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import numeral from "numeral";
import InfoBox from "./Components/InfoBox";
import Map from "./Components/Map";
import Table from "./Components/Table";
import LineGraph from "./Components/LineGraph";
import {sortData, prettyPrintStat} from "./Components/util"
import "leaflet/dist/leaflet.css";


function App() {
  const [store, setStore] = useState([]);
  const [markets, setMakets] = useState("VietNam");
  const [marketsInfo, setMaketsInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  // console.log("New",store)
  // https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((Response) => Response.json())
      .then((data) => {
        setMaketsInfo(data);
      });
  }, []);

  useEffect(() => {
    const getStoreData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((Response) => Response.json())
        .then((data) => {
          const Storedated = data.map((newStore) => ({
            name: newStore.country,
            value: newStore.countryInfo.iso2,
            cases: newStore.cases,
            // updated: newStore.updated,
          }));
          const sortedData = sortData(data) // chinh tu thap den dao
          setStore(Storedated);
          setTableData(sortedData);
          setMapCountries(data); 
        });
    };
    getStoreData();
  }, []);

  const hanldeChangeCountry = async (e) => {
    // console.log(e.target.value)
    const countryCode = e.target.value;
    setMakets(e.target.value);
    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries[COUNTRY_CODE]
    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/countries/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((Response) => Response.json())
      .then((data) => {
        setMakets(countryCode);
        setMaketsInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        // console.log(data)
      });
    // muon dung dc await can co async
  };
  // console.log("objectAppTable>>>>>",tableData);
  // console.log("objectAppTable>>>>>",mapCenter);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Let's build a COVID 19 tracker </h1>
          {/* Hearder */}
          <FormControl className="app__dropdown">
            <Select
              onChange={hanldeChangeCountry}
              variant="outlined"
              value={markets}
            >
              <MenuItem value={markets}>Worldwide</MenuItem>
              {store.map((newStore) => (
                <MenuItem value={newStore.value}>{newStore.name}</MenuItem>
              ))}
              {/* all countries here */}
              {/* <MenuItem value="worldwid"> worldwid</MenuItem>
              <MenuItem value="worldwid"> worldwid</MenuItem>
              <MenuItem value="worldwid"> worldwid</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        {/* title + select input dropdown field */}
        <div className="app__stats">
          <InfoBox
           onClick={(e) => setCasesType("cases")}
           isRed
           active={casesType === "cases"}
            title="Covid-19 Cases"
            cases={prettyPrintStat(marketsInfo.todayCases)}
            total={numeral(marketsInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={ prettyPrintStat(marketsInfo.todayRecovered)}
            total={numeral(marketsInfo.recovered).format("0.0a")}

          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={ prettyPrintStat(marketsInfo.todayDeaths)}
            total={numeral(marketsInfo.cases).format("0.0a")}
          />
        </div>

        {/* info box */}

        {/* Map */}
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>

      {/* table */}
      <Card className="app__right">
        <CardContent>
        <div className="app__information">
        <h3>Live case by country </h3>
        <Table tableData={tableData} />
        <h3 className="app__graphTile">Worldwide new {casesType}</h3>
        <LineGraph className="app_graph" casesType={casesType} />
        </div>
        </CardContent>
        {/* graph */}
      </Card>
    </div>
  );
}

export default App;
