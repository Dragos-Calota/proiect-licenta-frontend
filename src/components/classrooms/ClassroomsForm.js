import { Button, Grid, TextField, Typography } from "@mui/material";
import styles from "./ClassroomsForm.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "dayjs/locale/ro";

const ClassroomsForm = ({ editingClassroomId, setEditingClassroomId }) => {
  const navigate = useNavigate();

  const [room, setRoom] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editingClassroomId !== null) {
      const fetchClassroom = async () => {
        const response = await axios.get(
          `https://proiect-licenta-backend.onrender.com/classrooms/${editingClassroomId}`
        );

        setRoom(response.data.room);
        setBuilding(response.data.building);
        setFloor(response.data.floor);
      };

      fetchClassroom();
    }
  }, [editingClassroomId]);

  const saveHandler = async () => {
    let response = null;

    if (editingClassroomId === null) {
      response = await axios.post(
        "https://proiect-licenta-backend.onrender.com/classrooms",
        {
          room: room,
          building: building,
          floor: floor,
        }
      );

      if (response.data.message) {
        setError(true);
        setErrorMessage(response.data.message);

        return;
      }

      navigate("/classrooms");
    }

    if (editingClassroomId !== null) {
      await axios.patch(
        `https://proiect-licenta-backend.onrender.com/events/classroom/${editingClassroomId}`,
        {
          room: room,
          building: building,
          floor: floor,
        }
      );
      response = await axios.patch(
        `https://proiect-licenta-backend.onrender.com/classrooms/${editingClassroomId}`,
        {
          room: room,
          building: building,
          floor: floor,
        }
      );

      if (response.data.message) {
        setError(true);
        setErrorMessage(response.data.message);
        return;
      }

      setEditingClassroomId(null);
      navigate("/classrooms");
    }
  };

  return (
    <>
      <div className={styles.body}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography>Sala</Typography>
            <TextField
              error={room.length === 0 ? true : false}
              fullWidth
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>Corp</Typography>
            <TextField
              error={building.length === 0 ? true : false}
              fullWidth
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>Etaj</Typography>
            <TextField
              error={floor.length === 0 ? true : false}
              fullWidth
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6} textAlign="center">
            <Button
              variant="contained"
              color="info"
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
                setEditingClassroomId(null);
                navigate("/classrooms");
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
    </>
  );
};

export default ClassroomsForm;
