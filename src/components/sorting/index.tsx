import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import "./index.css";

interface SortingDataProps {
  setApiUrl: (newUrl: string) => void;
  maxRecords: number;
  setApiLoading: React.Dispatch<React.SetStateAction<boolean>>;
  matchedDataSet: any[];
  setMatchedDataSet: React.Dispatch<React.SetStateAction<any[]>>;
}

const SortingData = ({
  maxRecords,
  setApiUrl,
  setApiLoading,
  matchedDataSet,
  setMatchedDataSet,
}: SortingDataProps) => {
  const [sortField, setsortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleChange = (event: SelectChangeEvent) => {
    setsortField(event.target.value);
    if (event.target.value === "") {
      setApiLoading(true);
      setApiUrl(
        `https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?maxRecords=${maxRecords}&view=Grid%20view`
      );
    }
  };

  const handleSortDirectionChange = (event: SelectChangeEvent) => {
    setSortDirection(event.target.value);
  };

  const handleSorting = () => {
    if (
      sortField === "impressions" ||
      sortField === "conversions" ||
      sortField === "revenue"
    ) {
      let sortParam = "";
      let sortingData = [];

      if (sortField === "impressions") {
        sortParam = "userImpressionsCount";
      } else if (sortField === "conversions") {
        sortParam = "userConversionsCount";
      } else {
        sortParam = "totalRevenue";
      }

      if (sortDirection === "asc") {
        sortingData = [...matchedDataSet].sort(
          (a, b) => a[sortParam] - b[sortParam]
        );
      } else {
        sortingData = [...matchedDataSet].sort(
          (a, b) => b[sortParam] - a[sortParam]
        );
      }

      sortingData?.length && setMatchedDataSet(sortingData);
    } else {
      setApiLoading(true);
      setApiUrl(
        `https://api.airtable.com/v0/appBTaX8XIvvr6zEC/tblYPd5g5k5IKIc98?maxRecords=${maxRecords}&sort%5B0%5D%5Bfield%5D=${sortField}&sort%5B0%5D%5Bdirection%5D=${sortDirection}`
      );
    }
  };

  return (
    <div className="sortingWrapper">
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Sort</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={sortField}
            label="Sort"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"Name"}>Name</MenuItem>
            <MenuItem value={"impressions"}>Impressions</MenuItem>
            <MenuItem value={"conversions"}>Conversions</MenuItem>
            <MenuItem value={"revenue"}>Revenue</MenuItem>
            <MenuItem value={"Id"}>Id</MenuItem>
            <MenuItem value={"occupation"}>Occupation</MenuItem>
            <MenuItem value={"avatar"}>Avatar</MenuItem>
          </Select>
        </FormControl>

        {sortField && (
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              defaultValue={sortDirection}
              value={sortDirection}
              onChange={handleSortDirectionChange}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={"asc"}>Ascending</MenuItem>
              <MenuItem value={"desc"}>Descending</MenuItem>
            </Select>
          </FormControl>
        )}
      </div>
      <Button
        style={{ textTransform: "capitalize" }}
        variant="contained"
        disabled={!sortField}
        onClick={handleSorting}
        className="applyButton"
      >
        Apply
      </Button>
    </div>
  );
};

export default SortingData;
