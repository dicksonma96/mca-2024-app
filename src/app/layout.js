import { Lato } from "next/font/google";
import "./style.scss";
import "./globalicon.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata = {
  title: "Mother Choice Award 2024",
  description: "Motherhood Choice Award ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  );
}
