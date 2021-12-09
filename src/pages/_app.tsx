import axios from "axios";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import moment from "moment";
import Navbar from "../components/PageNavbar";

import "../styles/fontawesome/css/all.css";
import "../styles/app.scss";

import "react-toastify/dist/ReactToastify.css";
import "dayjs/locale/fi";
import "moment/locale/fi";

dayjs.locale("fi");
moment.locale("fi");

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 5000,
        revalidateOnReconnect: true,
        refreshInterval: 10000,
      }}
    >
      <Navbar />
      <div id="app">
        <ToastContainer />
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default App;
