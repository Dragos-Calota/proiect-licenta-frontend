import { Button, Grid, TextField, Typography } from "@mui/material";
import styles from "./SeriesForm.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SeriesForm = ({ editingSeriesId, setEditingSeriesId }) => {
  const navigate = useNavigate();

  const [series, setSeries] = useState("");
  const [groupsNumberFirstYear, setGroupsNumberFirstYear] = useState("");
  const [semigroupsNumberFirstYear, setSemigroupsNumberFirstYear] =
    useState("");
  const [groupsNumberSecondYear, setGroupsNumberSecondYear] = useState("");
  const [semigroupsNumberSecondYear, setSemigroupsNumberSecondYear] =
    useState("");
  const [groupsNumberThirdYear, setGroupsNumberThirdYear] = useState("");
  const [semigroupsNumberThirdYear, setSemigroupsNumberThirdYear] =
    useState("");
  const [groupsNumberFourthYear, setGroupsNumberFourthYear] = useState("");
  const [semigroupsNumberFourthYear, setSemigroupsNumberFourthYear] =
    useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editingSeriesId !== null) {
      const fetchSeries = async () => {
        const response = await axios.get(
          `http://localhost:3001/series/${editingSeriesId}`
        );

        setSeries(response.data.series);
        setGroupsNumberFirstYear(response.data.first.groups.length);
        setSemigroupsNumberFirstYear(response.data.first.semigroups.length);
        setGroupsNumberSecondYear(response.data.second.groups.length);
        setSemigroupsNumberSecondYear(response.data.second.semigroups.length);
        setGroupsNumberThirdYear(response.data.third.groups.length);
        setSemigroupsNumberThirdYear(response.data.third.semigroups.length);
        setGroupsNumberFourthYear(response.data.fourth.groups.length);
        setSemigroupsNumberFourthYear(response.data.fourth.semigroups.length);
      };

      fetchSeries();
    }
  }, [editingSeriesId]);

  const saveHandler = async () => {
    let response = null;

    if (editingSeriesId === null) {
      response = await axios.post("http://localhost:3001/series", {
        series: series,
        groupsNumberFirstYear: +groupsNumberFirstYear,
        semigroupsNumberFirstYear: +semigroupsNumberFirstYear,
        groupsNumberSecondYear: +groupsNumberSecondYear,
        semigroupsNumberSecondYear: +semigroupsNumberSecondYear,
        groupsNumberThirdYear: +groupsNumberThirdYear,
        semigroupsNumberThirdYear: +semigroupsNumberThirdYear,
        groupsNumberFourthYear: +groupsNumberFourthYear,
        semigroupsNumberFourthYear: +semigroupsNumberFourthYear,
      });

      if (response.data.message) {
        setError(true);
        setError(response.data.message);

        return;
      }

      navigate("/series");
    }

    if (editingSeriesId !== null) {
      response = await axios.patch(
        `http://localhost:3001/series/${editingSeriesId}`,
        {
          series: series,
          groupsNumberFirstYear: +groupsNumberFirstYear,
          semigroupsNumberFirstYear: +semigroupsNumberFirstYear,
          groupsNumberSecondYear: +groupsNumberSecondYear,
          semigroupsNumberSecondYear: +semigroupsNumberSecondYear,
          groupsNumberThirdYear: +groupsNumberThirdYear,
          semigroupsNumberThirdYear: +semigroupsNumberThirdYear,
          groupsNumberFourthYear: +groupsNumberFourthYear,
          semigroupsNumberFourthYear: +semigroupsNumberFourthYear,
        }
      );

      if (response.data.message) {
        setError(true);
        setErrorMessage(response.data.message);

        return;
      }

      setEditingSeriesId(null);
      navigate("/series");
    }
  };

  return (
    <>
      <div className={styles.body}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography>Seria</Typography>
            <TextField
              error={series.length < 1 ? true : false}
              fullWidth
              value={series}
              onChange={(e) => setSeries(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} />

          <Grid item xs={12} md={6}>
            <Typography>Grupe anul 1</Typography>
            <TextField
              type="number"
              error={+groupsNumberFirstYear < 1 ? true : false}
              fullWidth
              value={groupsNumberFirstYear}
              onChange={(e) => setGroupsNumberFirstYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>Semigrupe anul 1</Typography>
            <TextField
              type="number"
              error={+semigroupsNumberFirstYear < 1 ? true : false}
              fullWidth
              value={semigroupsNumberFirstYear}
              onChange={(e) => setSemigroupsNumberFirstYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>Grupe anul 2</Typography>
            <TextField
              type="number"
              error={+groupsNumberSecondYear < 1 ? true : false}
              fullWidth
              value={groupsNumberSecondYear}
              onChange={(e) => setGroupsNumberSecondYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>Semigrupe anul 2</Typography>
            <TextField
              type="number"
              error={+semigroupsNumberSecondYear < 1 ? true : false}
              fullWidth
              value={semigroupsNumberSecondYear}
              onChange={(e) => setSemigroupsNumberSecondYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>Grupe anul 3</Typography>
            <TextField
              type="number"
              error={+groupsNumberThirdYear < 1 ? true : false}
              fullWidth
              value={groupsNumberThirdYear}
              onChange={(e) => setGroupsNumberThirdYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>Semigrupe anul 3</Typography>
            <TextField
              type="number"
              error={+semigroupsNumberThirdYear < 1 ? true : false}
              fullWidth
              value={semigroupsNumberThirdYear}
              onChange={(e) => setSemigroupsNumberThirdYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>Grupe anul 4</Typography>
            <TextField
              type="number"
              error={+groupsNumberFourthYear < 1 ? true : false}
              fullWidth
              value={groupsNumberFourthYear}
              onChange={(e) => setGroupsNumberFourthYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>Semigrupe anul 4</Typography>
            <TextField
              type="number"
              error={+semigroupsNumberFourthYear < 1 ? true : false}
              fullWidth
              value={semigroupsNumberFourthYear}
              onChange={(e) => setSemigroupsNumberFourthYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6} textAlign="center">
            <Button
              color="secondary"
              variant="contained"
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
              color="error"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                setEditingSeriesId(null);
                navigate("/series");
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

export default SeriesForm;
