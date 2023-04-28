import womenImg from "../../assets/Kimiko-S3.png";
import { DEFAULT_THEME, headerVisible } from "../../theme";
import Header from "../../components/Header";
import HomeComponent from "../../components/HomeComponent";
import { useMediaQuery, useTheme } from "@mui/material";

interface props {
  theme: string;
  skin: string;
}
const Home = ({ theme, skin }: props) => {
  const themeName = skin || DEFAULT_THEME;
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  // console.log(themeName, "themeName");
  return (
    <>
      {headerVisible?.includes(skin) && <Header theme={themeName} />}
      <div className="homePageWrapper homeComponent">
        <HomeComponent theme={theme} skin={skin} />
        {!matchesSM && themeName !== "c1" && (
          <div className="homeSidebarImg">
            <img src={womenImg} alt="women" />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
