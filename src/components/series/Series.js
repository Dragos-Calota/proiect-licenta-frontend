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
import styles from "./Series.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Delete, Edit } from "@mui/icons-material";

const Series = ({ setEditingSeriesId }) => {
  const navigate = useNavigate();

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchedSeries, setSearchedSeries] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      const response = await axios.get("http://localhost:3001/series");

      setSeries([...response.data]);
    };

    fetchSeries();
  }, []);

  useEffect(() => {
    setOptions(
      series.map((element) => {
        return `Seria ${element.series}`;
      })
    );
  }, [series]);

  const deleteOptionHandler = async (seriesId) => {
    const response = await axios.delete(
      `http://localhost:3001/series/${seriesId}`
    );

    console.log(response.data);

    setSeries(series.filter((element) => element._id !== seriesId));
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
            onChange={(event, value) => setSearchedSeries(value)}
            renderInput={(params) => (
              <TextField {...params} label="Căutați seria" />
            )}
          />

          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              navigate("/series/form");
            }}
          >
            Adăugați o serie nouă
          </Button>
        </div>

        <div className={styles.list}>
          <Typography>Serii și grupe</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Seria</TableCell>
                  <TableCell>Anul 1</TableCell>
                  <TableCell>Anul 3</TableCell>
                  <TableCell>Anul 3</TableCell>
                  <TableCell>Anul 4</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {series
                  .filter((element) => {
                    if (searchedSeries === null) return true;

                    return `Seria ${element.series}` === searchedSeries;
                  })
                  .map((element) => {
                    return (
                      <TableRow key={element._id}>
                        <TableCell>{`Seria ${element.series}`}</TableCell>
                        <TableCell>
                          <>{`Grupe: ${element.first.groups.length}`}</>
                          <br />
                          <>{`Semigrupe: ${element.first.semigroups.length}`}</>
                        </TableCell>
                        <TableCell>
                          <>{`Grupe: ${element.second.groups.length}`}</>
                          <br />
                          <>{`Semigrupe: ${element.second.semigroups.length}`}</>
                        </TableCell>
                        <TableCell>
                          <>{`Grupe: ${element.third.groups.length}`}</>
                          <br />
                          <>{`Semigrupe: ${element.third.semigroups.length}`}</>
                        </TableCell>
                        <TableCell>
                          <>{`Grupe: ${element.fourth.groups.length}`}</>
                          <br />
                          <>{`Semigrupe: ${element.fourth.semigroups.length}`}</>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingSeriesId(element._id);
                              navigate("/series/form");
                            }}
                          >
                            <Edit color="secondary" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              deleteOptionHandler(element._id);
                            }}
                          >
                            <Delete color="secondary" />
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

export default Series;
