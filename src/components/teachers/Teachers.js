import { useEffect, useState } from "react";
import axios from "axios";
import Toolbar from "../toolbar/Toolbar";
import {
  Autocomplete,
  Button,
  TextField,
  IconButton,
  Typography,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import styles from "./Teachers.module.css";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Teachers = ({ setEditingTeacherId }) => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchedTeacher, setSearchedTeacher] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await axios.get("http://localhost:3001/teachers");
      setTeachers([...response.data]);
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    setOptions(
      teachers.map((teacher) => {
        return `${teacher.title} ${teacher.name}`;
      })
    );
  }, [teachers]);

  const deleteOptionHandler = async (teacherId) => {
    const response = await axios.delete(
      `http://localhost:3001/teachers/${teacherId}`
    );
    console.log(response.data);

    setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
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
            onChange={(event, value) => setSearchedTeacher(value)}
            renderInput={(params) => (
              <TextField {...params} label="Căutați cadrul didactic" />
            )}
          />

          <Button
            size="small"
            color="warning"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teachers/form");
            }}
          >
            Adăugați un nou cadru didactic
          </Button>
        </div>

        <div className={styles.list}>
          <Typography>Cadre didactice</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nume</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Preferințe</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {teachers
                  .filter((teacher) => {
                    if (searchedTeacher === null) return true;
                    return (
                      `${teacher.title} ${teacher.name}` === searchedTeacher
                    );
                  })
                  .map((teacher) => {
                    return (
                      <TableRow key={teacher._id}>
                        <TableCell>{`${teacher.title} ${teacher.name}`}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingTeacherId(teacher._id);
                              navigate("/teachers/form");
                            }}
                          >
                            <Edit color="warning" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              deleteOptionHandler(teacher._id);
                            }}
                          >
                            <Delete color="warning" />
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

export default Teachers;
