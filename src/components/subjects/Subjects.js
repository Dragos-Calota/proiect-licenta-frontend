import Toolbar from "../toolbar/Toolbar";
import {
  Autocomplete,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import styles from "./Subjects.module.css";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Subjects = ({ setEditingSubjectId }) => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchedSubject, setSearchedSubject] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await axios.get(
        "https://proiect-licenta-backend.onrender.com/subjects"
      );
      setSubjects(response.data);
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    setOptions(
      subjects.map((subject) => {
        return `${subject.name} - ${subject.shortName}`;
      })
    );
  }, [subjects]);

  const deleteOptionHandler = async (subjectId) => {
    const response = await axios.delete(
      `https://proiect-licenta-backend.onrender.com/subjects/${subjectId}`
    );
    console.log(response.data);

    setSubjects(subjects.filter((teacher) => teacher._id !== subjectId));
  };

  return (
    <>
      <Toolbar />
      <div className={styles.body}>
        <div className={styles.toolbar}>
          <Autocomplete
            sx={{ width: 400 }}
            size="small"
            options={options}
            onChange={(event, value) => setSearchedSubject(value)}
            renderInput={(params) => (
              <TextField {...params} label="Căutați disciplina" />
            )}
          />

          <Button
            size="small"
            color="success"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              navigate("/subjects/form");
            }}
          >
            Adăugați o nouă disciplină
          </Button>
        </div>
        <div className={styles.list}>
          <Typography>Discipline</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Nume</TableCell>
                  <TableCell align="left">Acronim</TableCell>
                  <TableCell align="left">An predare</TableCell>
                  <TableCell align="left">Semestru predare</TableCell>
                  <TableCell align="left">Împărțire ore</TableCell>
                  <TableCell align="left">Titulari curs</TableCell>
                  <TableCell align="left">Titulari seminar</TableCell>
                  <TableCell align="left">Titulari laborator</TableCell>
                  <TableCell align="left">Titulari proiect</TableCell>
                  <TableCell align="left"> </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {subjects
                  .filter((subject) => {
                    if (searchedSubject === null) return true;

                    return (
                      `${subject.name} - ${subject.shortName}` ===
                      searchedSubject
                    );
                  })
                  .map((subject) => {
                    return (
                      <TableRow key={subject._id}>
                        <TableCell align="left">{subject.name}</TableCell>
                        <TableCell align="left">{subject.shortName}</TableCell>
                        <TableCell align="left">{subject.year}</TableCell>
                        <TableCell align="left">{subject.semester}</TableCell>
                        <TableCell align="left">
                          <Typography variant="inherit">{`Curs: ${
                            subject.courseHours < 1
                              ? "-"
                              : subject.courseHours + " ore"
                          }`}</Typography>
                          <Typography variant="inherit">
                            {`Seminar: ${
                              subject.seminarHours < 1
                                ? "-"
                                : subject.seminarHours + " ore"
                            }`}
                          </Typography>
                          <Typography variant="inherit">
                            {`Laborator: ${
                              subject.labHours < 1
                                ? "-"
                                : subject.labHours + " ore"
                            }`}
                          </Typography>
                          <Typography variant="inherit">
                            {`Proiect: ${
                              subject.projectHours < 1
                                ? "-"
                                : subject.projectHours + " ore"
                            }`}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          {subject.courseTeachers.map((teacher) => (
                            <Typography variant="inherit" key={teacher.series}>
                              {`- Seria ${teacher.series}: ${
                                teacher.teacher === null ? "-" : teacher.teacher
                              }`}
                            </Typography>
                          ))}
                        </TableCell>
                        <TableCell align="left">
                          {subject.seminarTeachers.map((teacher, index) => (
                            <Typography variant="inherit" key={index}>
                              {teacher}
                            </Typography>
                          ))}
                        </TableCell>
                        <TableCell align="left">
                          {subject.labTeachers.map((teacher, index) => (
                            <Typography variant="inherit" key={index}>
                              {teacher}
                            </Typography>
                          ))}
                        </TableCell>
                        <TableCell align="left">
                          {subject.projectTeachers.map((teacher, index) => (
                            <Typography variant="inherit" key={index}>
                              {teacher}
                            </Typography>
                          ))}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingSubjectId(subject._id);
                              navigate("/subjects/form");
                            }}
                          >
                            <Edit color="success" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              deleteOptionHandler(subject._id);
                            }}
                          >
                            <Delete color="success" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default Subjects;
