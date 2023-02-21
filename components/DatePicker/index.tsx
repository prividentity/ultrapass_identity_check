import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";

interface props {
  theme?: string;
  value?: Dayjs | null;
  setEnrollData?: (e: any) => void;
}

const MonthPicker = (props: props) => {
  const { value, setEnrollData } = props;
  const maxDate = dayjs().subtract(18, "year");
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value || null}
        label="Date of Birth"
        views={["year", "month"]}
        maxDate={maxDate}
        onChange={(newValue: any) => {
          setEnrollData?.(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default MonthPicker;
