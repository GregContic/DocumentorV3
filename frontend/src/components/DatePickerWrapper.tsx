import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker, TimePicker as MuiTimePicker } from '@mui/x-date-pickers';

interface DatePickerWrapperProps {
    children: React.ReactNode;
}

export const DatePickerWrapper: React.FC<DatePickerWrapperProps> = ({ children }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {children}
        </LocalizationProvider>
    );
};

// Export the MUI components directly
export const DatePicker = MuiDatePicker;
export const TimePicker = MuiTimePicker; 