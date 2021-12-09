import dayjs from "dayjs";
// eslint-disable-next-line import/extensions
import pjson from "../../package.json";

const Footer: React.FC = () => {
  return (
    <footer className="page-footer">
      <p>
        Traineri v{pjson.version} &copy; Toni Ruhanen {dayjs().format("YYYY")}
      </p>
    </footer>
  );
};

export default Footer;
