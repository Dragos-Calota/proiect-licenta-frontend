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
import Toolbar from "../toolbar/Toolbar";
import styles from "./Classrooms.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

const Classrooms = ({ setEditingClassroomId }) => {
  const navigate = useNavigate();

  const [classrooms, setClassrooms] = useState([]);
  const [searchedClassroom, setSearchedClassroom] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      const response = await axios.get(
        "https://proiect-licenta-backend.onrender.com/classrooms"
      );
      setClassrooms([...response.data]);
    };

    fetchClassrooms();
  }, []);

  const deleteOptionHandler = async (classroomId) => {
    await axios.delete(
      `https://proiect-licenta-backend.onrender.com/classrooms/${classroomId}`
    );
    await axios.delete(
      `https://proiect-licenta-backend.onrender.com/events/classroom/${classroomId}`
    );

    setClassrooms(
      classrooms.filter((classroom) => classroom._id !== classroomId)
    );
  };

  return (
    <>
      <Toolbar />
      <div className={styles.body}>
        <div className={styles.toolbar}>
          <Autocomplete
            sx={{ width: 400 }}
            size="small"
            options={classrooms.map((element) => element.room)}
            onChange={(event, value) => setSearchedClassroom(value)}
            renderInput={(params) => (
              <TextField {...params} label="Căutați sala de curs" />
            )}
          />

          <Button
            size="small"
            color="info"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              navigate("/classrooms/form");
            }}
          >
            Adăugați o sală nouă
          </Button>
        </div>

        <div className={styles.list}>
          <Typography>Săli de curs</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sala</TableCell>
                  <TableCell>Corp</TableCell>
                  <TableCell>Etaj</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {classrooms
                  .filter((classroom) => {
                    if (searchedClassroom === null) return true;

                    return classroom.room === searchedClassroom;
                  })
                  .map((classroom) => {
                    return (
                      <TableRow key={classroom._id}>
                        <TableCell>{`${classroom.room}`}</TableCell>
                        <TableCell>{`${classroom.building}`}</TableCell>
                        <TableCell>{`${classroom.floor}`}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingClassroomId(classroom._id);
                              navigate("/classrooms/form");
                            }}
                          >
                            <Edit color="info" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              deleteOptionHandler(classroom._id);
                            }}
                          >
                            <Delete color="info" />
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

export default Classrooms;
