import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group mt-2">
      <label htmlFor="username">{label}</label>
      <br />
      <input
        autoFocus
        {...rest}
        name={name}
        id={name}
        className="form-control"
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
