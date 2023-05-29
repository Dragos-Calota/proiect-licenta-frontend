import {
  Autocomplete,
  Button,
  Checkbox,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./SubjectsForm.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubjectsForm = ({ editingSubjectId, setEditingSubjectId }) => {
  const navigate = useNavigate();

  const [subjectName, setSubjectName] = useState("");
  const [shortName, setShortName] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [courseHours, setCourseHours] = useState(0);
  const [seminarHours, setSeminarHours] = useState(0);
  const [labHours, setLabHours] = useState(0);
  const [projectHours, setProjectHours] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [series, setSeries] = useState([]);
  const [courseTeachers, setCourseTeachers] = useState([]);
  const [seminarTeachers, setSeminarTeachers] = useState([]);
  const [labTeachers, setLabTeachers] = useState([]);
  const [projectTeachers, setProjectTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await axios.get(
        "https://proiect-licenta-backend.onrender.com/teachers"
      );

      setTeachers(
        response.data.map((teacher) => {
          return `${teacher.title} ${teacher.name}`;
        })
      );
    };

    const fetchSeries = async () => {
      const response = await axios.get(
        "https://proiect-licenta-backend.onrender.com/series"
      );

      setCourseTeachers(
        response.data.map((element) => ({
          series: element.series,
          teacher: null,
        }))
      );

      setSeries(
        response.data.map((element) => {
          return element.series;
        })
      );
    };

    fetchTeachers();
    fetchSeries();
  }, []);

  useEffect(() => {
    if (editingSubjectId !== null) {
      const fetchSubject = async () => {
        const response = await axios.get(
          `https://proiect-licenta-backend.onrender.com/subjects/${editingSubjectId}`
        );

        setSubjectName(response.data.name);
        setShortName(response.data.shortName);
        setYear(response.data.year);
        setSemester(response.data.semester);
        setCourseHours(response.data.courseHours);
        setSeminarHours(response.data.seminarHours);
        setLabHours(response.data.labHours);
        setProjectHours(response.data.projectHours);
        setCourseTeachers(response.data.courseTeachers);
        setSeminarTeachers(response.data.seminarTeachers);
        setLabTeachers(response.data.labTeachers);
        setProjectTeachers(response.data.projectTeachers);
      };

      fetchSubject();
    }
  }, [editingSubjectId]);

  const saveHandler = async () => {
    let response = null;
    if (editingSubjectId === null) {
      response = await axios.post(
        "https://proiect-licenta-backend.onrender.com/subjects",
        {
          name: subjectName,
          shortName: shortName,
          year: +year,
          semester: +semester,
          courseHours: +courseHours,
          seminarHours: +seminarHours,
          labHours: +labHours,
          projectHours: +projectHours,
          courseTeachers: courseTeachers,
          seminarTeachers: seminarTeachers,
          labTeachers: labTeachers,
          projectTeachers: projectTeachers,
        }
      );

      if (response.data.message) {
        setError(true);
        setErrorMessage(response.data.message);

        return;
      }

      navigate("/subjects");
    }

    if (editingSubjectId !== null) {
      response = await axios.patch(
        `https://proiect-licenta-backend.onrender.com/subjects/${editingSubjectId}`,
        {
          name: subjectName,
          shortName: shortName,
          year: +year,
          semester: +semester,
          courseHours: +courseHours,
          seminarHours: +seminarHours,
          labHours: +labHours,
          projectHours: +projectHours,
          courseTeachers: courseTeachers,
          seminarTeachers: seminarTeachers,
          labTeachers: labTeachers,
          projectTeachers: projectTeachers,
        }
      );

      if (response.data.message) {
        setError(true);
        setErrorMessage(response.data.message);

        return;
      }

      setEditingSubjectId(null);
      navigate("/subjects");
    }
  };

  const changeSeminarTeachers = (e) => {
    const {
      target: { value },
    } = e;

    setSeminarTeachers(typeof value === "string" ? value.split(",") : value);
  };

  const changeLabTeachers = (e) => {
    const {
      target: { value },
    } = e;

    setLabTeachers(typeof value === "string" ? value.split(",") : value);
  };

  const changeProjectTeachers = (e) => {
    const {
      target: { value },
    } = e;

    setProjectTeachers(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div className={styles.body}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography>Nume</Typography>
          <TextField
            error={subjectName.length === 0 ? true : false}
            fullWidth
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography>Acronim</Typography>
          <TextField
            error={shortName.length === 0 ? true : false}
            fullWidth
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
          />
        </Grid>

        <Grid item xs={0} md={2}></Grid>
        <Grid item xs={12} md={4}>
          <Typography>An predare</Typography>
          <TextField
            error={year < 1 || year > 4 ? true : false}
            type="number"
            fullWidth
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography>Semestru predare</Typography>
          <TextField
            error={semester < 1 || semester > 2 ? true : false}
            type="number"
            fullWidth
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
        </Grid>
        <Grid item xs={0} md={2}></Grid>

        <Grid item xs={12} md={3}>
          <Typography>Ore curs</Typography>
          <TextField
            fullWidth
            error={courseHours < 0}
            value={courseHours}
            onChange={(e) => {
              if (e.target.value < 1) {
                setCourseTeachers((prev) => {
                  let newTeachers = [...prev];

                  newTeachers = newTeachers.map((element) => ({
                    series: element.series,
                    teacher: null,
                  }));

                  return newTeachers;
                });
              }

              setCourseHours(e.target.value);
            }}
            type="number"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography>Ore seminar</Typography>
          <TextField
            fullWidth
            error={seminarHours < 0}
            value={seminarHours}
            onChange={(e) => {
              if (e.target.value < 1) setSeminarTeachers([]);
              setSeminarHours(e.target.value);
            }}
            type="number"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography>Ore laborator</Typography>
          <TextField
            fullWidth
            error={labHours < 0}
            value={labHours}
            onChange={(e) => {
              if (e.target.value < 1) setLabTeachers([]);
              setLabHours(e.target.value);
            }}
            type="number"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography>Ore proiect</Typography>
          <TextField
            fullWidth
            error={projectHours < 0}
            value={projectHours}
            onChange={(e) => {
              if (e.target.value < 1) setProjectTeachers([]);

              setProjectHours(e.target.value);
            }}
            type="number"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography>Titulari curs:</Typography>
        </Grid>

        {series.map((element, index) => {
          return (
            <Grid key={index} item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={2} alignItems="center">
                  <Typography>{`- Seria ${element}`}</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Autocomplete
                    disabled={+courseHours < 1 ? true : false}
                    options={teachers}
                    fullWidth
                    value={courseTeachers[index].teacher}
                    onChange={(event, value) => {
                      setCourseTeachers((prev) => {
                        const newTeachers = [...prev];
                        newTeachers[index] = {
                          series: element,
                          teacher: value,
                        };

                        return newTeachers;
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Selectați cadrul didactic"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          );
        })}

        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography>Responsabli seminar</Typography>
            </Grid>
            <Grid item xs={8}>
              <Select
                error={
                  +seminarHours >= 1 && seminarTeachers.length === 0
                    ? true
                    : false
                }
                disabled={+seminarHours < 1 ? true : false}
                multiple
                value={seminarTeachers}
                onChange={changeSeminarTeachers}
                input={<OutlinedInput fullWidth />}
                renderValue={(selected) => selected.join(", ")}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher} value={teacher}>
                    <Checkbox checked={seminarTeachers.indexOf(teacher) > -1} />
                    <ListItemText primary={teacher} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography>Responsabli laborator</Typography>
            </Grid>
            <Grid item xs={8}>
              <Select
                error={
                  +labHours >= 1 && labTeachers.length === 0 ? true : false
                }
                disabled={+labHours < 1 ? true : false}
                multiple
                value={labTeachers}
                onChange={changeLabTeachers}
                input={<OutlinedInput fullWidth />}
                renderValue={(selected) => selected.join(", ")}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher} value={teacher}>
                    <Checkbox checked={labTeachers.indexOf(teacher) > -1} />
                    <ListItemText primary={teacher} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography>Responsabli proiect</Typography>
            </Grid>
            <Grid item xs={8}>
              <Select
                error={
                  +projectHours >= 1 && projectTeachers.length === 0
                    ? true
                    : false
                }
                disabled={+projectHours < 1 ? true : false}
                multiple
                value={projectTeachers}
                onChange={changeProjectTeachers}
                input={<OutlinedInput fullWidth />}
                renderValue={(selected) => selected.join(", ")}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher} value={teacher}>
                    <Checkbox checked={projectTeachers.indexOf(teacher) > -1} />
                    <ListItemText primary={teacher} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} textAlign="center">
          <Button
            variant="contained"
            color="success"
            onClick={(e) => {
              e.preventDefault();

              saveHandler();
            }}
          >
            Salvați
          </Button>
        </Grid>

        <Grid item xs={12} md={6} textAlign="center">
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              e.preventDefault();
              navigate("/subjects");
              setEditingSubjectId(null);
            }}
          >
            Închideți
          </Button>
        </Grid>

        {error && (
          <Grid item margin={2} xs={12} textAlign="center">
            <Typography variant="h6" color="red">
              {errorMessage}
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default SubjectsForm;
