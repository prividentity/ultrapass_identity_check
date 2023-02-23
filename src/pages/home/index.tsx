import womenImg from "../../assets/Kimiko-S3.png";
import { headerVisible } from "../../theme";
import Header from "../../components/Header";
import HomeComponent from "../../components/HomeComponent";

interface props {
  theme: string;
  skin: string;
}
const Home = ({ theme, skin }: props) => {
  const themeName = skin || "primary";
  return (
    <>
      {headerVisible?.includes(skin) && <Header theme={themeName} />}
      <div className="homePageWrapper">
        <HomeComponent theme={theme} skin={skin} />
        <div className="homeSidebarImg">
          <img src={womenImg} alt="women" />
        </div>
      </div>
    </>
  );
};

export default Home;
