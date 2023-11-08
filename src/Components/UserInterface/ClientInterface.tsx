/* eslint-disable react/react-in-jsx-scope */
import { useAuthContext } from "../../providers/auth-provider";
import { useTattooTattleContext } from "../../providers/tattoo-provider";
import { DashBoard } from "./DashBoard";
import {
  Box,
  Chip,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { createTheme } from "@mui/material/styles";
import { tattooStyles, usStates } from "../../api/config";
import { Pagination } from "./Pagination";
import { Client } from "../../types/interface";
import { getStyles, MenuProps } from "../Login/selectStyles";

const theme = createTheme();

export const ClientInterface = () => {
  const authContext = useAuthContext();
  const user = authContext.user as Client;
  const {
    activeSelector,
    activeSelectorClick,
    handleFilters,
    filters,
    deleteFromFilters,
  } = useTattooTattleContext();

  const handlePriceChange = (event: SelectChangeEvent<number>) => {
    handleFilters("price", event.target.value as number);
  };

  const filterClick = (selector: string, id: number) => {
    activeSelectorClick(selector, id);
  };

  const handleTattooStyleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    handleFilters("styles", value as string[]);
  };

  const handleUsStatesChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    handleFilters("states", value as string[]);
  };

  const handleDeleteStatesClick = (value: string) => {
    deleteFromFilters("states", value);
  };

  const handleDeleteStylesClick = (value: string) => {
    deleteFromFilters("styles", value);
  };

  return (
    <div>
      <DashBoard />
      <div className="selectors-container">
        <div className="selectors">
          <div className="artist-selectors selectors">
            <div
              className={`selector ${activeSelector === "all" && "active"}`}
              onClick={() => filterClick("all", user.id!)}
            >
              All Tattoos
            </div>
            <div
              className={`selector ${activeSelector === "favs" && "active"}`}
              onClick={() => filterClick("favs", user.id!)}
            >
              View Favorites
            </div>
            <div
              className={`selector ${activeSelector === "reqs" && "active"}`}
              onClick={() => filterClick("reqs", user.id!)}
            >
              My Requests
            </div>
          </div>
          {activeSelector === "all" && (
            <div className="filter-div">
              <FormControl
                className="tattoo-filter"
                sx={{ m: 2, minWidth: 120 }}
              >
                <InputLabel id="demo-simple-select-helper-label">
                  Price
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  name="price"
                  value={filters.price}
                  label="Price Range"
                  onChange={handlePriceChange}
                >
                  <MenuItem value={0}>None</MenuItem>
                  <MenuItem value={100}>&lt; 100</MenuItem>
                  <MenuItem value={500}>100 - 500</MenuItem>
                  <MenuItem value={1000}>500 - 1000</MenuItem>
                  <MenuItem value={1001}>&gt; 1000</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="tattoo-filter" sx={{ m: 2, width: 120 }}>
                <InputLabel id="demo-multiple-chip-label">Location</InputLabel>
                <Select
                  required
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple={true}
                  value={filters.states}
                  onChange={handleUsStatesChange}
                  name="states"
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="States of Operation"
                    />
                  }
                  renderValue={() => (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {filters.states.map((value: string) => (
                        <Chip
                          key={value}
                          label={value}
                          onDelete={() => handleDeleteStatesClick(value)}
                          deleteIcon={
                            <CancelIcon
                              onMouseDown={(event) => event.stopPropagation()}
                            />
                          }
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {usStates.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, filters.states, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className="tattoo-filter" sx={{ m: 2, width: 200 }}>
                <InputLabel>Tattoo Style(s)</InputLabel>
                <Select
                  required
                  labelId="demo-multiple-chip-label"
                  multiple={true}
                  value={filters.styles}
                  name="style"
                  onChange={handleTattooStyleChange}
                  input={<OutlinedInput label="Tattoo Style(s)" />}
                  renderValue={() => (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {filters.styles.map((value: string) => (
                        <Chip
                          key={value}
                          label={value}
                          onDelete={() => handleDeleteStylesClick(value)}
                          deleteIcon={
                            <CancelIcon
                              onMouseDown={(event) => event.stopPropagation()}
                            />
                          }
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {tattooStyles.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, filters.styles, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
        </div>
      </div>
      {activeSelector !== "reqs" && <Pagination currentDisplay={"tats"} />}
      {activeSelector === "reqs" && <Pagination currentDisplay={"reqs"} />}
    </div>
  );
};
