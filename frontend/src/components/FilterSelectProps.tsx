interface FilterSelectProps {
    label : string;
    value : string;
    options : string[];
    allLabel : string;
    onChange : (value : string) => void;
}

const FilterSelect = ({
    label,
    value,
    options,
    allLabel,
    onChange
} : FilterSelectProps) => {
    return(
        <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">{label}</span>
            <select className="rounded border p-2" value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">{allLabel}</option>
                {options.map((o) => (
                    <option key ={o} value={o}>
                    {o}
                    </option>
                ))}
            </select>
        </label>
    );
};

export { FilterSelect};
