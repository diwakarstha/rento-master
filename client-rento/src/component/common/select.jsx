import React from "react";

const Select = ({ name, label, options, error, divClass, ...rest }) => {
  return (
    <div className="form-group mt-2">
      <label htmlFor="username">{label}</label>
      <select
        autoFocus
        {...rest}
        name={name}
        id={name}
        className="form-control"
      >
        {options.map((option) => (
          <option key={option._id} value={option.name}>
            {option.name || option.default}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;