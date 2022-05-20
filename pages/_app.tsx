import "antd/dist/antd.css";
import "styles/style.scss";
import "styles/resets.scss";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
