// DigitalClockValue.tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeView } from '@mui/x-date-pickers/models';

interface DigitalClockValueProps {
  onChangeStart?: (time: string) => void;
  onChangeEnd?: (time: string) => void;
  unavailableHours?: number[];
}

export default function DigitalClockValue({ onChangeStart, onChangeEnd, unavailableHours = [] }: DigitalClockValueProps) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'));
  const [value2, setValue2] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'));

  // **수정된 부분: 매개변수 타입을 Dayjs로 변경**
  const shouldDisableHours = (dayjsValue: Dayjs, view: TimeView) => {
    // view가 'hours'일 때만 로직 적용
    if (view === 'hours') {
        const hour = dayjsValue.hour();
        return unavailableHours.includes(hour);
    }
    return false;
  };

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
                onChangeStart(dayjs(newValue).format('HH'));
              }
            }}
            shouldDisableTime={shouldDisableHours}
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
                onChangeEnd(dayjs(newValue).format('HH'));
              }
            }}
            shouldDisableTime={shouldDisableHours}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}