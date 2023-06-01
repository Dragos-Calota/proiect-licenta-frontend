import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import interactionPlugin from "@fullcalendar/interaction";
import Toolbar from "../toolbar/Toolbar";
import styles from "./Calendar.module.css";
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
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
import { Delete } from "@mui/icons-material";

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
  const [interval, setInterval] = useState(0);
  const [duration, setDuration] = useState(0);
  const [events, setEvents] = useState([]);
  const [shownEvents, setShownEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchSeries = async () => {
      const response = await axios.get("http://localhost:3001/series");

      setSeries(response.data);
    };

    const fetchSubjects = async () => {
      const response = await axios.get("http://localhost:3001/subjects");

      setSubjects(response.data);
    };

    const fetchClassrooms = async () => {
      const response = await axios.get("http://localhost:3001/classrooms");

      setClassrooms(response.data);
    };

    const fetchEvents = async () => {
      const response = await axios.get("http://localhost:3001/events");

      setEvents(response.data);

      setShownEvents(
        response.data.filter(
          (element) =>
            element.extendedProps.series === "A" &&
            element.extendedProps.year === 1
        )
      );
    };

    const fetchHolidays = async () => {
      const response = await axios.get("http://localhost:3001/holidays");

      setHolidays(response.data);
    };

    fetchSeries();
    fetchSubjects();
    fetchClassrooms();
    fetchEvents();
    fetchHolidays();
  }, []);

  const changeYearHandler = (index) => {
    setSelectedYear(index + 1);
    setShownEvents(
      events.filter(
        (element) =>
          element.extendedProps.series === selectedSeries &&
          element.extendedProps.year === index + 1
      )
    );
    setSelectedSubject({});
    setSubjectName("");
    setSelectedType("");
    setTeachers([]);
    setSelectedTeacher("");
    setStudents([]);
    setSelectedStudents("");
    setSelectedClassroom("");
    setSelectedDate("");
    setInterval(0);
    setDuration(0);
  };

  const changeSeriesHandler = (series) => {
    setSelectedSeries(series);
    setShownEvents(
      events.filter(
        (element) =>
          element.extendedProps.series === series &&
          element.extendedProps.year === selectedYear
      )
    );
    setSelectedSubject({});
    setSubjectName("");
    setSelectedType("");
    setTeachers([]);
    setSelectedTeacher("");
    setStudents([]);
    setSelectedStudents("");
    setSelectedClassroom("");
    setSelectedDate("");
    setInterval(0);
    setDuration(0);
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
      setDuration(selectedSubject.courseHours);
      setTeachers(
        selectedSubject.courseTeachers
          .filter((element) => element.series === selectedSeries)
          .map((element) => element.teacher)
      );

      setSelectedTeacher(
        selectedSubject.courseTeachers
          .filter((element) => element.series === selectedSeries)
          .map((element) => element.teacher)[0]
      );

      setStudents(
        series
          .filter((element) => element.series === selectedSeries)
          .map((element) => `Seria ${element.series}`)
      );

      setSelectedStudents(
        series
          .filter((element) => element.series === selectedSeries)
          .map((element) => `Seria ${element.series}`)[0]
      );
    }

    if (e.target.value !== "course") {
      if (e.target.value === "seminar")
        setDuration(selectedSubject.seminarHours);
      if (e.target.value === "lab") setDuration(selectedSubject.labHours);
      if (e.target.value === "project")
        setDuration(selectedSubject.projectHours);
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

  const saveHandler = async (e) => {
    let date = new Date(selectedDate);
    const startDate = new Date(selectedDate);
    const endDate = new Date(date.setHours(date.getHours() + duration));
    e.preventDefault();
    console.log({
      year: selectedYear,
      series: selectedSeries,
      subject: subjectName,
      type: selectedType,
      teacher: selectedTeacher,
      students: selectedStudents,
      classroom: selectedClassroom,
      start: startDate,
      end: endDate,
      interval: interval,
    });

    await axios.post("http://localhost:3001/events", {
      start: startDate,
      subject: subjectName,
      type: selectedType,
      teacher: selectedTeacher,
      students: selectedStudents,
      classroom: selectedClassroom,
      year: selectedYear,
      series: selectedSeries,
      duration: duration,
      interval: interval,
    });

    const response = await axios.get("http://localhost:3001/events");

    setEvents(response.data);

    setShownEvents(
      response.data.filter(
        (element) =>
          element.extendedProps.series === selectedSeries &&
          element.extendedProps.year === selectedYear
      )
    );

    setSelectedSubject({});
    setSubjectName("");
    setSelectedType("");
    setTeachers([]);
    setSelectedTeacher("");
    setStudents([]);
    setSelectedStudents("");
    setSelectedClassroom("");
    setSelectedDate("");
    setInterval(0);
    setDuration(0);
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    setSelectedSubject({});
    setSubjectName("");
    setSelectedType("");
    setTeachers([]);
    setSelectedTeacher("");
    setStudents([]);
    setSelectedStudents("");
    setSelectedClassroom("");
    setSelectedDate("");
    setInterval(0);
    setDuration(0);
  };

  const deleteHandler = async (id) => {
    await axios.delete(`http://localhost:3001/events/${id}`);
    setEvents(events.filter((element) => element._id !== id));
    setShownEvents(shownEvents.filter((element) => element._id !== id));
  };

  const eventDropHandler = async (info) => {
    await axios.patch(
      `http://localhost:3001/events/${info.event._def.extendedProps._id}`,
      {
        start: info.event.start,
        end: info.event.end,
      }
    );

    const response = await axios.get("http://localhost:3001/events");

    setEvents(response.data);

    setShownEvents(
      response.data.filter(
        (element) =>
          element.extendedProps.series === selectedSeries &&
          element.extendedProps.year === selectedYear
      )
    );
  };

  const renderEventContent = (eventInfo) => {
    if (eventInfo.event.display === "background") return <></>;
    return (
      <div className={styles.eventContent}>
        <div>
          <b>{eventInfo.event.title}</b>
          <p>{eventInfo.event.extendedProps.studenti}</p>
          <p>{eventInfo.event.extendedProps.teacher}</p>
          <p>Sala: {eventInfo.event.extendedProps.classroom}</p>
          <p>{eventInfo.event.extendedProps.students}</p>
          <p>{eventInfo.display}</p>
        </div>
        <div className={styles.eventButtons}>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              deleteHandler(eventInfo.event._def.extendedProps._id);
            }}
          >
            <Delete style={{ color: "white" }} />
          </IconButton>
        </div>
      </div>
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
                error={subjectName === "" ? true : false}
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
                error={selectedType === "" ? true : false}
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
                error={selectedTeacher === "" ? true : false}
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
                error={selectedStudents === "" ? true : false}
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
                error={selectedClassroom === "" ? true : false}
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
                dateAdapter={AdapterDayjs}
                adapterLocale="ro"
              >
                <DateTimePicker
                  value={selectedDate}
                  onChange={(value) =>
                    value === null
                      ? setSelectedDate("")
                      : setSelectedDate(value)
                  }
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={3}>
              <Typography>Repetare</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={interval === 1 ? true : false}
                    onChange={(e) =>
                      e.target.checked ? setInterval(1) : setInterval(0)
                    }
                  />
                }
                label="Săptămânal"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={interval === 2 ? true : false}
                    onChange={(e) =>
                      e.target.checked ? setInterval(2) : setInterval(0)
                    }
                  />
                }
                label="La două săptămâni"
              />
            </Grid>

            <Grid item xs={3}>
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={12} />
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={saveHandler}
                  >
                    Salvați
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={cancelHandler}
                  >
                    Anulați
                  </Button>
                </Grid>
                <Grid item xs={12} />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>

      <div className={styles.body}>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin, rrulePlugin]}
          locale="ro"
          firstDay={1}
          eventContent={renderEventContent}
          events={[...holidays, ...shownEvents]}
          initialView="timeGridWeek"
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          slotDuration="01:00:00"
          expandRows={true}
          editable
          eventDurationEditable={false}
          eventDrop={eventDropHandler}
        />
      </div>
    </>
  );
};

export default Calendar;
