interface InputFieldProps {
    label: string;
    type?: string;
    name: string;
    value: string | number;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
}

            const InputField = ({
                               label,
                                type,
                                name,
                                value,
                                placeholder,
                                onChange,
                                required
                            }: InputFieldProps) => {
    return (
        <div className="register__card__field">
            <label className="register__card__field__label">{label}</label>
            <input
                className="register__card__field__input"
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
            />
        </div>
    );
};

export default InputField;