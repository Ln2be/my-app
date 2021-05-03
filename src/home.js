import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import Add from "./add";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import { BASE, toGeoson, DATA } from "./constants";
import L from "leaflet";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import "./home.css";
import AddIcon from "@material-ui/icons/Add";
import HelpIcon from "@material-ui/icons/Help";
import { AppBarPan } from "./app-bar";
import { useHistory, useLocation } from "react-router-dom";
import { MiniPost } from "./posts";

const opposite = {
  "Offer Rent": "Demand Rent",
  "Offer Sell": "Demand Buy",
  "Demand Rent": "Offer Rent",
  "Demand Buy": "Offer Sell",
};

// make style
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      // margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    // position: "fixed",
  },
  fab: {
    position: "fixed",
    zIndex: 1000,
  },
}));

// Choose a kind
function ChooseKind(props) {
  console.log(props.kind);
  const [value, setValue] = useState(props.kind);

  function handleChange(event) {
    props.onKindChange(event.target.value);
    setValue(event.target.value);
  }

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="gender"
        name="gender1"
        value={value}
        onChange={handleChange}
      >
        <div className="search-div">
          <div>
            <FormControlLabel
              value="Offer Rent"
              control={<Radio />}
              label="اعرض ايجار"
              className="OfferRentR"
            />
            <FormControlLabel
              value="Demand Rent"
              control={<Radio />}
              label="اطلب ايجار"
              className="DemandRentR"
            />
          </div>
          <div>
            <FormControlLabel
              value="Offer Sell"
              control={<Radio />}
              label="ابيع عقار"
              className="OfferSellR"
            />

            <FormControlLabel
              value="Demand Buy"
              control={<Radio />}
              label="اشتري عقار"
              className="DemandBuyR"
            />
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
}

//
function Map(props) {
  // routing version
  const classes = useStyles();
  const location = useLocation();

  const homeProp = location.state
    ? location.state
    : {
        center: [18.079, -15.9652],
        zoom: 14,
        kind: null,
      };

  // const homeReload =
  //   location.state && location.state.id
  //     ? location.state
  //     : {
  //         id: null,
  //         kind: null,
  //       };

  console.log(location);

  let history = useHistory();

  // store the kind and position
  const [kind, setKind] = useState(homeProp.kind);
  const [position, setPosition] = useState();

  // handle kind change
  function handleKindChange(akind) {
    setKind(akind);
    const nData = wholeData.filter(
      (value) => value.properties.kind === opposite[akind]
    );
    setData(nData);
  }

  const handleHelpClick = () => {
    // intereducing routing
    history.push("/about");

    // old before routing
    // ReactDOM.render(<AboutUs />, document.getElementById("root"));
  };

  const [sid, setSId] = useState(homeProp.id);
  const [data, setData] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const [wholeData, setWholeData] = useState([]);
  const [toAdd, setToAdd] = useState(false);
  // const [countToCrash, setCountToCrash] = useState(0);
  const [count, setCount] = useState(0);

  var icr = 0;
  // show details
  const showDe = (f, l, icon) => {
    const opposite = {
      "Offer Rent": "Demand Rent",
      "Offer Sell": "Demand Buy",
      "Demand Rent": "Offer Rent",
      "Demand Buy": "Offer Sell",
    };

    const id = f.properties.id;
    const ikind = f.properties.kind;
    // const sKind = props.sKind ? props.sKind : "";

    const handleIconClick = () => {
      // props.onIconClick(id);
      // console.log(id);
      setSId(id);
      // console.log(countToCrash);
      // setCountToCrash(countToCrash + 1);

      icr = icr + 1;
      if (icr > 5) {
        console.log("a crash");

        const path = location.pathname === "/" ? "/reload" : "/";
        const locationR = {
          pathname: path,
          state: {
            id: id,
            kind: kind,
            center: l,
            zoom: 14,
          },
        };
        history.push(locationR);
      }
    };

    const result = L.marker(l, { icon: icon }).on("click", handleIconClick);

    return result;
  };

  const handleContinueClick = () => {
    const location = {
      pathname: "/add",
      state: {
        kind: kind,
        lat: position.lat,
        lng: position.lng,
      },
    };

    history.push(location);
  };

  const handleAddClick = () => {
    setToAdd(true);
  };

  // Retrieve the posts from the api
  useEffect(() => {
    // construct the url to search query
    const url = BASE + "/map";

    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          const posts = toGeoson(result.posts);

          if (kind) {
            console.log(kind);
            const nData = posts.filter(
              (value) => value.properties.kind === opposite[kind]
            );
            setData(nData);
          } else {
            setData(posts);
            setWholeData(posts);
          }
          setMapReady(true);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  // Names of the places to show on the map
  const dataPlaces = (
    <GeoJSON
      data={DATA}
      pointToLayer={(f, l) => {
        const myIcon = L.divIcon({
          className: "div-icon",
          html: f.properties.name,
        });
        return L.marker(l, { icon: myIcon });
      }}
    ></GeoJSON>
  );

  // Show posts
  const dataPosts = (
    <GeoJSON
      key={data}
      data={data}
      pointToLayer={(f, l) => {
        const myIcon = L.divIcon({
          className: f.properties.class,
          // html: f.properties.class,
        });
        return showDe(f, l, myIcon);
      }}
    ></GeoJSON>
  );

  const Tile = () => {
    const map = useMap();
    const circle = L.circle([18.079, -15.9652], {
      radius: 20000,
    });
    const mapBounds = circle.addTo(map).getBounds();

    map.removeLayer(circle);
    map.setMaxBounds(mapBounds);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      // tileSize: 512,
      bounds: mapBounds,
    }).addTo(map);

    // And marker when user click the map
    var marker = null;
    map.on("click", (pos) => {
      if (toAdd) {
        console.log(pos.latlng);
        if (marker) map.removeLayer(marker);
        marker = L.marker(pos.latlng).addTo(map);

        // props.onMapClick(position.latlng);

        setPosition(pos.latlng);
      }
    });

    return null;
  };

  //   <div className="help" hidden={kind || homeProp.kind}>
  //   <Typography variant="body2">
  //     اختر العرض \ الطلب و اذهب الى المنطقة على الخريطة:
  //     <li>اضغط على النقاط الملونة لرؤية التفاصيل </li>
  //     <li>
  //       في حالة عدم وجود اي عروض مناسية بامكانك اضغط اضافة.
  //     </li>
  //   </Typography>
  //   <HelpIcon
  //     className="helpIcon"
  //     color="secondary"
  //     onClick={handleHelpClick}
  //   />
  // </div>

  // const MMapContainer = useMemo(() => {
  //   <MapContainer
  //     className="map-container"
  //     center={homeProp.center}
  //     zoom={homeProp.zoom}
  //     scrollWheelZoom={false}
  //   >
  //     {/* <Tile></Tile> */}
  //     {dataPlaces}
  //     {toAdd ? null : dataPosts}
  //   </MapContainer>;
  // }, [homeProp, dataPosts, dataPlaces, toAdd]);

  return (
    <div>
      {sid && !toAdd ? (
        <MiniPost id={sid} />
      ) : (
        <div>
          <div className="help" hidden={kind || toAdd}>
            <Typography variant="body2">
              اختر العرض \ الطلب و اذهب الى المنطقة على الخريطة:
              <li>اضغط على النقاط الملونة لرؤية التفاصيل </li>
              <li>في حالة عدم وجود اي عروض مناسبة اضغط اضافة.</li>
            </Typography>
            <HelpIcon
              className="helpIcon"
              color="secondary"
              onClick={handleHelpClick}
            />
          </div>
          <div className="help" hidden={!toAdd}>
            <Typography variant="body2">
              اختر العرض \ الطلب و اضغط على المنطقة على الخريطة ثم اضغط متابعة
            </Typography>
            <HelpIcon
              className="helpIcon"
              color="secondary"
              onClick={handleHelpClick}
            />
          </div>
          <ChooseKind kind={homeProp.kind} onKindChange={handleKindChange} />
        </div>
      )}

      {mapReady ? (
        <MapContainer
          className="map-container"
          center={homeProp.center}
          zoom={homeProp.zoom}
          scrollWheelZoom={false}
        >
          <Tile></Tile>
          {dataPlaces}
          {toAdd ? null : dataPosts}
        </MapContainer>
      ) : null}
      {toAdd ? (
        <Fab
          variant="extended"
          color="primary"
          className={classes.fab}
          onClick={handleContinueClick}
          disabled={!kind || !position}
        >
          متابعة
          {/* <AddIcon /> */}
        </Fab>
      ) : (
        <Fab
          variant="extended"
          color="primary"
          className={classes.fab}
          onClick={handleAddClick}
        >
          اضافة
          <AddIcon />
        </Fab>
      )}
    </div>
  );
}

// The home page
const Home = () => {
  return (
    <div>
      <AppBarPan home={true} />
      <Map />
    </div>
  );
};

// The home page
export const HomeR = () => {
  return (
    <div>
      <AppBarPan home={true} />
      <Map />
    </div>
  );
};

export default Home;
