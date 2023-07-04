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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField";
import * as dayjs from "dayjs";
import "dayjs/locale/ro";

const TeachersForm = ({ editingTeacherId, setEditingTeacherId }) => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasPreferences, setHasPreferences] = useState(false);
  const [preferences, setPreferences] = useState([
    {
      day: "Luni",
      isAvailable: false,
      interval: [null, null],
      startHours: null,
      endHours: null,
    },
    {
      day: "Marți",
      isAvailable: false,
      interval: [null, null],
      startHours: null,
      endHours: null,
    },
    {
      day: "Miercuri",
      isAvailable: false,
      interval: [null, null],
      startHours: null,
      endHours: null,
    },
    {
      day: "Joi",
      isAvailable: false,
      interval: [null, null],
      startHours: null,
      endHours: null,
    },
    {
      day: "Vineri",
      isAvailable: false,
      interval: [null, null],
      startHours: null,
      endHours: null,
    },
  ]);

  useEffect(() => {
    if (editingTeacherId !== null) {
      const fetchTeacher = async () => {
        const response = await axios.get(
          `https://proiect-licenta-backend.onrender.com/teachers/${editingTeacherId}`
        );

        setFullName(response.data.name);
        setTitle(response.data.title);
        setEmail(response.data.email);
        setHasPreferences(response.data.hasPreferences);
        setPreferences(
          response.data.preferences.map((element) => {
            element.interval = element.interval.map((time) => dayjs(time));

            return element;
          })
        );
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
          hasPreferences: hasPreferences,
          preferences: preferences,
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
      await axios.delete(
        `https://proiect-licenta-backend.onrender.com/events/teacher/${editingTeacherId}`
      );
      response = await axios.patch(
        `https://proiect-licenta-backend.onrender.com/teachers/${editingTeacherId}`,
        {
          name: fullName,
          title: title,
          email: email,
          hasPreferences: hasPreferences,
          preferences: preferences,
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
            type="email"
            error={email.length === 0 ? true : false}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                color="warning"
                checked={hasPreferences}
                onChange={(e) => {
                  setHasPreferences(e.target.checked);
                  if (!e.target.checked) {
                    setPreferences([
                      {
                        day: "Luni",
                        isAvailable: false,
                        interval: [null, null],
                        startHours: null,
                        endHours: null,
                      },
                      {
                        day: "Marți",
                        isAvailable: false,
                        interval: [null, null],
                        startHours: null,
                        endHours: null,
                      },
                      {
                        day: "Miercuri",
                        isAvailable: false,
                        interval: [null, null],
                        startHours: null,
                        endHours: null,
                      },
                      {
                        day: "Joi",
                        isAvailable: false,
                        interval: [null, null],
                        startHours: null,
                        endHours: null,
                      },
                      {
                        day: "Vineri",
                        isAvailable: false,
                        interval: [null, null],
                        startHours: null,
                        endHours: null,
                      },
                    ]);
                  }
                }}
              />
            }
            label="Preferinte"
          />
        </Grid>

        {hasPreferences && (
          <Grid item xs={12}>
            {preferences.map((element, index) => (
              <Grid container spacing={3} key={element.day}>
                <Grid item xs={2} />
                <Grid item xs={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="warning"
                        checked={element.isAvailable}
                        onChange={(e) =>
                          setPreferences((prev) => {
                            let newWeekDays = [...prev];
                            newWeekDays[index].isAvailable = e.target.checked;
                            if (!e.target.checked) {
                              newWeekDays[index].interval = [null, null];
                              newWeekDays[index].startHours = null;
                              newWeekDays[index].endHours = null;
                            }
                            return newWeekDays;
                          })
                        }
                      />
                    }
                    label={element.day}
                  />
                </Grid>
                <Grid item xs={7}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="ro"
                  >
                    <SingleInputTimeRangeField
                      value={element.interval}
                      disabled={!element.isAvailable}
                      onChange={(value) =>
                        setPreferences((prev) => {
                          let newWeekDays = [...prev];
                          newWeekDays[index].interval = value;
                          newWeekDays[index].startHours = new Date(
                            value[0]
                          ).getHours();
                          newWeekDays[index].endHours = new Date(
                            value[1]
                          ).getHours();
                          return newWeekDays;
                        })
                      }
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}

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
