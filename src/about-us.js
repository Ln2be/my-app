import { useLocation } from "react-router-dom";
import { AppBarPan } from "./app-bar";
import "./index.css";

const Help = () => {
  const location = useLocation();
  console.log(location);
  // console.log(location);

  return (
    <div className="rootHelp">
      <ul>
        <li>
          <div>
            <a href="https://youtu.be/02df_ChcYos">كيفية استخدام التطبيق</a>
          </div>
        </li>
        <li>
          <div>
            <a href="https://youtu.be/gMe_PARUYnc">كيفية انشاء اختصار</a>
          </div>
        </li>
      </ul>
      <div>
        <p>عفار انواكشوط: موقع للوساطة العقارية.</p>
        <div>الواتساب: 48692007</div>
        <div>Email: iqarnktt@gmail.com</div>
      </div>
    </div>
  );
};

const AboutUs = (props) => {
  return (
    <div>
      <AppBarPan />
      <Help location={props.location} />
    </div>
  );
};

export default AboutUs;
