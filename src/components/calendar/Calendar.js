import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Toolbar from "../toolbar/Toolbar";
import styles from "./Calendar.module.css";
import {
  Button,
  ButtonGroup,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect, useState } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ro";

const Calendar = () => {
  const [series, setSeries] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedSeries, setSelectedSeries] = useState("A");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [subjectName, setSubjectName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchSeries = async () => {
      const response = await axios.get(
        "https://proiect-licenta-backend.onrender.com/series"
      );

      setSeries(response.data);
    };

    const fetchSubjects = async () => {
      const response = await axios.get(
        "https://proiect-licenta-backend.onrender.com/subjects"
      );

      setSubjects(response.data);
    };

    const fetchClassrooms = async () => {
      const response = await axios.get(
        "https://proiect-licenta-backend.onrender.com/classrooms"
      );

      setClassrooms(response.data);
    };

    fetchSeries();
    fetchSubjects();
    fetchClassrooms();
  }, []);

  const changeYearHandler = (index) => {
    setSelectedYear(index + 1);
    setSelectedSubject({});
    setSubjectName("");
    setSelectedType("");
    setTeachers([]);
    setSelectedTeacher("");
    setStudents([]);
    setSelectedStudents("");
    setSelectedClassroom("");
  };

  const changeSeriesHandler = (series) => {
    setSelectedSeries(series);
    setSelectedSubject({});
    setSubjectName("");
    setSelectedType("");
    setTeachers([]);
    setSelectedTeacher("");
    setStudents([]);
    setSelectedStudents("");
    setSelectedClassroom("");
  };

  const selectSubjectHandler = (e) => {
    setSubjectName(e.target.value);
    setSelectedSubject(
      subjects.filter((subject) => {
        return subject.name === e.target.value;
      })[0]
    );
  };

  const selectTypeHandler = (e) => {
    setTeachers([]);
    setSelectedTeacher("");
    setStudents([]);
    setSelectedStudents("");
    setSelectedType(e.target.value);

    if (e.target.value === "course") {
      setTeachers(
        selectedSubject.courseTeachers
          .filter((element) => element.series === selectedSeries)
          .map((element) => element.teacher)
      );

      setSelectedTeacher(
        selectedSubject.courseTeachers
          .filter((element) => element.series === selectedSeries)
          .map((element) => element.teacher)
      );

      setStudents(
        series
          .filter((element) => element.series === selectedSeries)
          .map((element) => `Seria ${element.series}`)
      );

      setSelectedStudents(
        series
          .filter((element) => element.series === selectedSeries)
          .map((element) => `Seria ${element.series}`)
      );
    }

    if (e.target.value !== "course") {
      setTeachers(
        Array.from(
          new Set([
            ...selectedSubject.seminarTeachers,
            ...selectedSubject.labTeachers,
            ...selectedSubject.projectTeachers,
          ])
        )
      );

      setStudents(
        series
          .filter((element) => element.series === selectedSeries)
          .map((element) => {
            let newStudents = [];

            if (selectedYear === 1) {
              newStudents = [
                ...element.first.groups,
                ...element.first.semigroups,
              ];
            }

            if (selectedYear === 2) {
              newStudents = [
                ...element.second.groups,
                ...element.second.semigroups,
              ];
            }

            if (selectedYear === 3) {
              newStudents = [
                ...element.third.groups,
                ...element.third.semigroups,
              ];
            }

            if (selectedYear === 4) {
              newStudents = [
                ...element.fourth.groups,
                ...element.fourth.semigroups,
              ];
            }

            return newStudents;
          })
      );

      setStudents((prev) => prev[0].sort());
    }
  };

  useEffect(() => console.log(selectedSubject), [selectedSubject]);

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <p>{eventInfo.event.title}</p>
        <p>{eventInfo.event.extendedProps.studenti}</p>
        <p>Profesor: {eventInfo.event.extendedProps.profesor}</p>
        <p>Sala: {eventInfo.event.extendedProps.sala}</p>
      </>
    );
  };

  return (
    <>
      <Toolbar />
      <div className={styles.selection}>
        <ButtonGroup variant="outlined">
          {[...Array(4)].map((_, index) => {
            return (
              <Button
                style={{ color: "#2c3e50", borderColor: "#2c3e50" }}
                onClick={() => changeYearHandler(index)}
                key={index + 1}
              >
                Anul {index + 1}
              </Button>
            );
          })}
        </ButtonGroup>

        <ButtonGroup variant="outlined">
          {series.map((element) => (
            <Button
              key={element.series}
              style={{ color: "#2c3e50", borderColor: "#2c3e50" }}
              onClick={() => {
                changeSeriesHandler(element.series);
              }}
            >{`Seria ${element.series}`}</Button>
          ))}
        </ButtonGroup>
      </div>

      <div className={styles.form}>
        <Paper>
          <Typography variant="h6">{`Anul ${selectedYear} Seria ${selectedSeries}`}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography>Selectați disciplina</Typography>
              <Select
                fullWidth
                value={subjectName}
                onChange={selectSubjectHandler}
              >
                {subjects
                  .filter((subject) => subject.year === selectedYear)
                  .map((subject) => (
                    <MenuItem key={subject._id} value={subject.name}>
                      {subject.name}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>

            <Grid item xs={3}>
              <Typography>Selectați tipul orei</Typography>
              <Select
                fullWidth
                value={selectedType}
                onChange={selectTypeHandler}
              >
                {selectedSubject.courseHours >= 1 && (
                  <MenuItem value="course">Curs</MenuItem>
                )}
                {selectedSubject.seminarHours >= 1 && (
                  <MenuItem value="seminar">Seminar</MenuItem>
                )}
                {selectedSubject.labHours >= 1 && (
                  <MenuItem value="lab">Laborator</MenuItem>
                )}
                {selectedSubject.projectHours >= 1 && (
                  <MenuItem value="project">Proiect</MenuItem>
                )}
              </Select>
            </Grid>

            <Grid item xs={3}>
              <Typography>Selectați cadrul didactic</Typography>
              <Select
                fullWidth
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher} value={teacher}>
                    {teacher}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={3}>
              <Typography>Selectați studenții</Typography>
              <Select
                fullWidth
                value={selectedStudents}
                onChange={(e) => setSelectedStudents(e.target.value)}
              >
                {students.map((element) => (
                  <MenuItem key={element} value={element}>
                    {element}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={3}>
              <Typography>Selectați sala</Typography>
              <Select
                fullWidth
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
              >
                {classrooms.map((classroom) => (
                  <MenuItem key={classroom._id} value={classroom.room}>
                    {classroom.room}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={3}>
              <Typography>Selectați data și ora de început</Typography>
              <LocalizationProvider
                fullWidth
                dateAdapter={AdapterDayjs}
                adapterLocale="ro"
              >
                <DateTimePicker
                  value={selectedDate}
                  onChange={(value) => setSelectedDate(value)}
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>
      </div>

      <div className={styles.body}>
        <FullCalendar
          locale="ro"
          firstDay={1}
          eventContent={renderEventContent}
          events={[]}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          slotDuration="01:00:00"
          expandRows={true}
          selectable
          editable
          eventDurationEditable={false}
          select={(info) => console.log(info)}
        />
      </div>
    </>
  );
};

export default Calendar;
