import { Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import styles from "./Toolbar.module.css";
import { useNavigate } from "react-router-dom";
import { EventBusy } from "@mui/icons-material";

const Toolbar = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.body}>
      <div className={styles.button}>
        <Button
          variant="contained"
          startIcon={<CalendarTodayIcon />}
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Vizualizați orarul
        </Button>
      </div>

      <div className={styles.button}>
        <Button
          variant="contained"
          startIcon={<AccountBoxIcon />}
          color="warning"
          onClick={(e) => {
            e.preventDefault();
            navigate("/teachers");
          }}
        >
          Cadre didcatice
        </Button>
      </div>

      <div className={styles.button}>
        <Button
          variant="contained"
          startIcon={<SchoolIcon />}
          color="success"
          onClick={(e) => {
            e.preventDefault();
            navigate("/subjects");
          }}
        >
          Discipline
        </Button>
      </div>

      <div className={styles.button}>
        <Button
          variant="contained"
          startIcon={<PeopleIcon />}
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/series");
          }}
        >
          Serii și grupe
        </Button>
      </div>

      <div className={styles.button}>
        <Button
          variant="contained"
          startIcon={<LocationOnIcon />}
          color="info"
          onClick={(e) => {
            e.preventDefault();
            navigate("/classrooms");
          }}
        >
          Săli de curs
        </Button>
      </div>

      <div className={styles.button}>
        <Button
          variant="contained"
          startIcon={<EventBusy />}
          style={{ backgroundColor: "deeppink" }}
          onClick={(e) => {
            e.preventDefault();
            navigate("/holidays");
          }}
        >
          Vacanțe
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
