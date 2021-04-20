import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Typography from "@material-ui/core/Typography";
import { AddPan } from "./add";
import { AppBarPan } from "./appBar";
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { BASE, toGeoson, DATA, auth } from "./constants";
import L from "leaflet";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import "./search.css";
import Feed from "./feed";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import HelpIcon from "@material-ui/icons/Help";
import Help from "./help";

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
  const [value, setValue] = useState(null);

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
  const [id, setId] = useState(0);
  const [open, setOpen] = useState(false);

  // setId(0);
  // Get the bounds of the position
  function handleClick(position) {
    props.onMapClick(position);
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        handleClick(e.latlng);
      },
    });

    return props.position === null ? null : (
      <Marker position={props.position}></Marker>
    );
  }

  const PostDrawer = ({ id, open, onHideClick }) => {
    const [show, setShow] = useState(open);

    const handleHideClick = () => {
      setShow(false);
      onHideClick();
    };
    return (
      <SwipeableDrawer
        // container={container}
        variant="temporary"
        anchor={"right"}
        onClose={handleHideClick}
        open={show}
        // onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className="postDrawer"
      >
        {/* <div>Hi hello how are you</div> */}
        {id > 0 ? <Feed endpoint="post" query={"?id=" + id}></Feed> : null}
        <Button
          variant="outlined"
          color="primary"
          // className={classes.fab}
          onClick={handleHideClick}
          // disabled={!search.kind || !search.position}
        >
          رجوع
        </Button>
      </SwipeableDrawer>
    );
  };

  // show details
  const showDe = (f, l, icon) => {
    const opposite = {
      "Offer Rent": "Demand Rent",
      "Offer Sell": "Demand Buy",
      "Demand Rent": "Offer Rent",
      "Demand Buy": "Offer Sell",
    };

    const id = f.properties.id;
    const kind = f.properties.kind;
    const sKind = props.sKind;

    const onClick = () => {
      setId(id);
      setOpen(true);
    };

    const result =
      sKind === opposite[kind] || sKind === ""
        ? L.marker(l, { icon: icon }).on("click", onClick)
        : null;

    return result;
  };

  //
  const handleHideClick = () => {
    setOpen(false);
  };

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
      key={props.sKind}
      data={props.data}
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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      // tileSize: 512,
    }).addTo(map);

    return null;
  };

  return (
    <div>
      <PostDrawer
        id={id}
        open={open}
        onHideClick={handleHideClick}
      ></PostDrawer>
      <MapContainer
        className="map-container"
        center={[18.079, -15.9652]}
        zoom={14}
        scrollWheelZoom={false}
      >
        <Tile></Tile>
        {
          // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
          /* <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // tileSize={5}
        /> */
        }
        {dataPlaces}
        {dataPosts}
        <LocationMarker />)
      </MapContainer>
    </div>
  );
}

//
export function SearchPan() {
  const classes = useStyles();
  const [postsA, setPostsA] = useState([]);

  const [mapReady, SetMapReady] = useState(false);

  useEffect(() => {
    // construct the url to search query
    const url = BASE + "map";

    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          setPostsA(result.posts);
          SetMapReady(true);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  const [kind, setKind] = useState("");
  const [position, setPosition] = useState(null);

  //   handle the kind choose to save it
  function handleKind(kind) {
    setKind(kind);
  }

  const handleAddClick = () => {
    ReactDOM.render(
      <div>
        <AppBarPan />
        <AddPan
          search={{
            position: position,
            kind: kind,
          }}
        />
      </div>,
      document.getElementById("root")
    );
  };

  //   handle Map click to save the position of the click
  function handleMapClick(pos) {
    setPosition(pos);
  }

  const handleHelpClick = () => {
    ReactDOM.render(
      <div>
        <AppBarPan />
        <Help />
      </div>,
      document.getElementById("root")
    );
  };

  return (
    <div className="content">
      {/* <h3 className="heading">اختر العرض و مكان على الخريطة</h3> */}
      <div className="help" hidden={kind}>
        <Typography variant="body2">
          اختر العرض و اذهب الى المنطقة على الخريطة:
          <li>اضغط على النقاط الملونة لرؤية تفاصيل العرض</li>
          <li>
            في حالة عدم وجود اي عروض في المنطقة بامكانك الضغط على الخريطة و
            اضافة عرضك ليطلع عليه الزوار
          </li>
        </Typography>
        {/* <Button
          variant="outlined"
          className="helpIcon"
          color="primary"
          onClick={handleHelpClick}
        >
          مساعدة
        </Button> */}
        <HelpIcon
          className="helpIcon"
          color="secondary"
          onClick={handleHelpClick}
        />
      </div>
      <ChooseKind onKindChange={handleKind} />
      {mapReady ? (
        <Map
          onMapClick={handleMapClick}
          position={position}
          data={toGeoson(postsA)}
          sKind={kind}
        />
      ) : null}
      <Fab
        variant="extended"
        color="primary"
        className={classes.fab}
        onClick={handleAddClick}
        disabled={!kind || !position}
      >
        اضافة
        <AddIcon />
      </Fab>
    </div>
  );
}
