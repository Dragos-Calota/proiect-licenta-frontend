import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Toolbar from "../toolbar/Toolbar";
import styles from "./Holidays.module.css";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import "dayjs/locale/ro";
import { Delete, Edit } from "@mui/icons-material";
import dayjs from "dayjs";

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingHolidayId, setEditingHolidayId] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      const response = await axios.get("http://localhost:3001/holidays");

      setHolidays(response.data);
    };

    fetchHolidays();
  }, []);

  const saveHandler = async () => {
    if (editingHolidayId === null) {
      await axios.post("http://localhost:3001/holidays", {
        start: new Date(startDate),
        end: new Date(endDate),
      });

      const response = await axios.get("http://localhost:3001/holidays");

      setHolidays(response.data);

      setStartDate("");
      setEndDate("");
      setEditingHolidayId(null);
    }

    if (editingHolidayId !== null) {
      await axios.patch(`http://localhost:3001/holidays/${editingHolidayId}`, {
        start: new Date(startDate),
        end: new Date(endDate),
      });

      const response = await axios.get("http://localhost:3001/holidays");

      setHolidays(response.data);

      setStartDate("");
      setEndDate("");
      setEditingHolidayId(null);
    }
  };

  const deleteOptionHandler = async (id) => {
    await axios.delete(`http://localhost:3001/holidays/${id}`);

    setHolidays(holidays.filter((element) => element._id !== id));
  };

  const updateOptionHandler = async (id) => {
    setEditingHolidayId(id);

    const response = await axios.get(`http://localhost:3001/holidays/${id}`);

    setStartDate(dayjs(response.data.start));
    setEndDate(dayjs(response.data.start));
  };

  return (
    <>
      <Toolbar />
      <div className={styles.form}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography>Selectați data de început</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ro">
              <DateTimePicker
                value={startDate}
                onChange={(value) =>
                  value === null ? setStartDate("") : setStartDate(value)
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <Typography>Selectați data de sfârșit</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ro">
              <DateTimePicker
                value={endDate}
                onChange={(value) =>
                  value === null ? setEndDate("") : setEndDate(value)
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} textAlign="center">
            <Button
              style={{ backgroundColor: "deeppink" }}
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                saveHandler();
              }}
            >
              Salvați
            </Button>
          </Grid>
          <Grid item xs={6} textAlign="center">
            <Button
              color="error"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                setStartDate("");
                setEndDate("");
                setEditingHolidayId(null);
              }}
            >
              Anulați
            </Button>
          </Grid>
        </Grid>
      </div>

      <div className={styles.list}>
        <Typography>Vacanțe</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nr. crt.</TableCell>
                <TableCell>Data de început</TableCell>
                <TableCell>Data de sfârșit</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {holidays.map((element, index) => {
                const start = new Date(element.start);
                const end = new Date(element.end);
                return (
                  <TableRow key={element._id}>
                    <TableCell>{`${index + 1}.`}</TableCell>
                    <TableCell>{`${
                      start.getDate() < 10
                        ? "0" + start.getDate()
                        : start.getDate()
                    }.${
                      start.getMonth() + 1 < 10
                        ? "0" + String(start.getMonth() + 1)
                        : start.getMonth() + 1
                    }.${start.getFullYear()}`}</TableCell>
                    <TableCell>
                      {`${
                        end.getDate() < 10 ? "0" + end.getDate() : end.getDate()
                      }.${
                        end.getMonth() + 1 < 10
                          ? "0" + String(end.getMonth() + 1)
                          : end.getMonth() + 1
                      }.${end.getFullYear()}`}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          updateOptionHandler(element._id);
                        }}
                      >
                        <Edit style={{ color: "deeppink" }} />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          deleteOptionHandler(element._id);
                        }}
                      >
                        <Delete style={{ color: "deeppink" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default Holidays;
