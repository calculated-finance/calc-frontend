import { InputGroup, Select } from '@chakra-ui/react';
import { CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import { useState } from 'react';

export function TimePeriodInput() {
  const [selectValue, setSelectValue] = useState('');

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = event.target.value;
    setSelectValue(values);
  };

  return (
    <InputGroup>
      <Select
        value={selectValue}
        isRequired
        borderRadius="xl"
        onChange={handleSelect}
        // {...props}
        icon={selectValue === 'day' ? <CalendarIcon /> : <TimeIcon />}
      >
        <option value="minute">Minute</option>
        <option value="hour">Hour</option>
        <option value="day">Day</option>
      </Select>
    </InputGroup>
  );
}
