import { headerVisible } from "../../theme";
import Header from "../../components/Header";
import HomeComponent from "../../components/HomeComponent";

interface props {
  theme: string;
  skin: string;
}
const Home = ({ theme, skin }: props) => {
  const themeName = skin || "primary";
  console.log(themeName, "themeName");
  return (
    <>
      {headerVisible?.includes(skin) && <Header theme={themeName} />}
      <div className="homePageWrapper homeComponent">
        <HomeComponent theme={theme} skin={skin} />
      </div>
    </>
  );
};

export default Home;
