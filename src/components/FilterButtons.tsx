import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { STATUS_FILTERS, type StatusFilter } from '../configs/contants';


interface Props {
    statusFilter: StatusFilter;
    setStatusFilter: (value: StatusFilter) => void;
}

const FilterButtons = ({ statusFilter, setStatusFilter }: Props) => {
    return (
        <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(_, value) => {
                if (value) setStatusFilter(value);
            }}
        >
            {STATUS_FILTERS.map((filter) => (
                <ToggleButton key={filter} value={filter}>
                    {filter}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};

export default FilterButtons;
