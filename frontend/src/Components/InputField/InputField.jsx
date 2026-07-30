

            const InputField = ({
                               label,
                                type,
                                name,
                                value,
                                placeholder,
                                onChange
                            }) => {
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