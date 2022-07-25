import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { SyntheticEvent } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { CountryType } from "./country-type.interface";
import { FilterOptionsState } from "@mui/material";

const filter = createFilterOptions<CountryType>();

export default function CustomSelect(props: {
  multiple?: boolean;
  onChange: (value: CountryType | CountryType[] | null) => void;
  data: CountryType[];
}) {
  const [value, setValue] = React.useState<
    CountryType | CountryType[] | null
  >();
  const [inputValue, setInputValue] = React.useState("");
  const [data, setData] = React.useState<CountryType[] | []>(props.data || []);

  const [open, toggleOpen] = React.useState(false);
  const handleClose = () => {
    setDialogValue({
      id: "",
      name: "",
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    id: "",
    name: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (Array.isArray(value)) {
      setValue([
        ...(value || []),
        {
          id: parseInt(dialogValue.id, 10),
          name: dialogValue.name,
        },
      ]);
    } else {
      setValue({
        id: parseInt(dialogValue.id, 10),
        name: dialogValue.name,
      });
    }
    setData([
      ...data,
      {
        id: parseInt(dialogValue.id, 10),
        name: dialogValue.name,
      },
    ]);
    handleClose();
  };

  const onChange = (
    event: SyntheticEvent,
    newValue: CountryType | CountryType[] | null
  ) => {
    // multiple
    if (
      Array.isArray(newValue) &&
      Array.isArray(value) &&
      newValue.length < value.length
    ) {
      setValue(
        value.filter((v: CountryType) =>
          newValue.find((nv) => nv.inputValue === v.name || nv.name === v.name)
        )
      );
    } else if (
      Array.isArray(newValue) &&
      Array.isArray(value) &&
      newValue[newValue.length - 1].name.search("Remove") === 0
    ) {
      setData(
        data.filter((d) => d.name !== newValue[newValue.length - 1].inputValue)
      );
      setValue(
        value.filter((v: CountryType) =>
          newValue.find((nv) => nv.inputValue === v.name || nv.name === v.name)
        )
      );
    } else if (
      Array.isArray(newValue) &&
      newValue[newValue.length - 1].name.search("Add") === 0
    ) {
      toggleOpen(true);
      setDialogValue({
        name: newValue[newValue.length - 1].inputValue || "",
        id: "",
      });
    } else if (Array.isArray(newValue)) {
      setValue(newValue);
      // single
    } else if (newValue && newValue.name.search("Remove") === 0) {
      setData(data.filter((d) => d.name === newValue.inputValue));
    } else if (newValue && newValue.inputValue) {
      toggleOpen(true);
      setDialogValue({
        name: newValue.inputValue,
        id: "",
      });
    } else {
      setValue(newValue);
    }
    props.onChange(newValue);
  };

  const filterOptions = (
    options: CountryType[],
    params: FilterOptionsState<CountryType>
  ) => {
    let filtered = filter(options, params);
    if (Array.isArray(value)) {
      filtered = filtered.filter(
        (f) => !value.find((v) => v.name === f.inputValue || v.name === f.name)
      );
    }

    if (
      params.inputValue !== "" &&
      !options.find((d) => d.name === params.inputValue)
    ) {
      filtered.push({
        inputValue: params.inputValue,
        name: `Add "${params.inputValue}"`,
      });
    } else if (options.find((d) => d.name === params.inputValue)) {
      filtered.push({
        inputValue: params.inputValue,
        name: `Remove "${params.inputValue}"`,
      });
    }

    return filtered;
  };

  return (
    <React.Fragment>
      <Autocomplete
        id="country-select-demo"
        value={value}
        onChange={onChange}
        multiple={props.multiple || false}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        options={data}
        autoHighlight
        getOptionLabel={(option: CountryType) =>
          option?.inputValue || option.name
        }
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a country"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
          />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new country</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any country in our list? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="name"
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.id}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  id: event.target.value,
                })
              }
              label="id"
              type="number"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
