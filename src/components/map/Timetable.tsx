import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

interface DigitalClockValueProps {
  onChangeStart?: (time: string) => void;
  onChangeEnd?: (time: string) => void;
}

export default function DigitalClockValue({ onChangeStart, onChangeEnd }: DigitalClockValueProps) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'));
  const [value2, setValue2] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiSectionDigitalClock', 'MultiSectionDigitalClock']}>
        <DemoItem label="충전시작시간">
          <MultiSectionDigitalClock
            views={['hours']}
            ampm={false}
            value={value2}
            onChange={(newValue) => {
              setValue2(newValue ? dayjs(newValue) : null);
              if (onChangeStart && newValue) {
                onChangeStart(dayjs(newValue).format('HH')); // 부모에 전달
              }
            }}
          />
        </DemoItem>
        <DemoItem label="충전종료시간">
          <MultiSectionDigitalClock
            views={['hours']}
            ampm={false}
            value={value}
            onChange={(newValue) => {
              setValue(newValue ? dayjs(newValue) : null);
              if (onChangeEnd && newValue) {
                onChangeEnd(dayjs(newValue).format('HH')); // 부모에 전달
              }
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
