import {
  Checkbox,
  Button,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./TeachersForm.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeachersForm = ({ editingTeacherId, setEditingTeacherId }) => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editingTeacherId !== null) {
      const fetchTeacher = async () => {
        const response = await axios.get(
          `https://proiect-licenta-backend.onrender.com/teachers/${editingTeacherId}`
        );

        setFullName(response.data.name);
        setTitle(response.data.title);
        setEmail(response.data.email);
      };

      fetchTeacher();
    }
  }, [editingTeacherId]);

  const saveHandler = async () => {
    let response = null;
    if (editingTeacherId === null) {
      response = await axios.post(
        "https://proiect-licenta-backend.onrender.com/teachers",
        {
          name: fullName,
          title: title,
          email: email,
        }
      );

      if (response.data.message) {
        setError(true);
        setErrorMessage(response.data.message);

        return;
      }

      navigate("/teachers");
    }

    if (editingTeacherId !== null) {
      response = await axios.patch(
        `https://proiect-licenta-backend.onrender.com/teachers/${editingTeacherId}`,
        {
          name: fullName,
          title: title,
          email: email,
        }
      );

      if (response.data.message) {
        setError(true);
        setErrorMessage(response.data.message);

        return;
      }

      setEditingTeacherId(null);
      navigate("/teachers");
    }
  };

  return (
    <div className={styles.body}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography>Titulatură</Typography>
          <TextField
            error={title.length === 0 ? true : false}
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography>Nume</Typography>
          <TextField
            error={fullName.length === 0 ? true : false}
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography>Email</Typography>
          <TextField
            error={email.length === 0 ? true : false}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="warning" />}
            label="Preferinte"
          />
        </Grid>

        <Grid item xs={12} md={6} textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="warning"
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
              navigate("/teachers");
              setEditingTeacherId(null);
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

export default TeachersForm;
