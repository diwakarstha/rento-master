import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import auth from "../../services/authService";
import SendForgetPasswordEmail from "./modal/sendForgetPasswordEmail";

class Login extends Form {
  state = {
    data: { userRole: "RoomOwner", email: "", password: "" },
    errors: {},
  };

  schema = {
    userRole: Joi.required().label("User Role"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  componentDidMount = () => {
    document.title = "Rento | Login";
    const { state } = this.props.location;
    const data = { ...this.state.data };
    if (state) {
      data.userRole = state.role;
      this.setState({ data });
    }
    window.scrollTo(0, 0);
  };

  handleUserRoleSelect = (e) => {
    const data = { ...this.state.data };
    data.userRole = e.currentTarget.value;
    this.setState({ data });
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.userRole, data.email, data.password);

      let dest = "/";
      if (data.userRole === "Tenant") dest = "/";
      else if (data.userRole === "RoomOwner") dest = "/RoomOwner/MyRooms";

      const { state } = this.props.location;
      window.location = state ? state.from : dest;
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };
  render() {
    const { state } = this.props.location;
    if (state && this.state.data.userRole !== state.role)
      this.componentDidMount();
    return (
      <div className="py-5" style={{ backgroundColor: "#e9ecef" }}>
        <div className="shadow py-3 mx-auto justify-content-center bg-light col-xl-3 col-lg-4 col-md-5 col-sm-6 col-12">
          <div className="my-5 mx-xl-5 mx-lg-3 mx-md-3 mx-2">
            <i className="fa fa-lock d-flex justify-content-center m-auto fa-3x mt-4 rento-text text-center"></i>
            {this.props.location.state && (
              <p
                className="text-center p-2"
                style={{
                  background: "rgba(255, 0, 0, 0.3)",
                  borderRadius: "5px",
                }}
              >
                {this.props.location.state.message}
              </p>
            )}
            <form onSubmit={this.handleSubmit} className="mt-3">
              <label htmlFor="user-role">
                You are: <i className="text-danger ">*</i>
              </label>
              <br />
              <div className="row">
                <div className="col-lg d-lg-flex justify-content-lg-center">
                  <div className="my-auto">
                    <input
                      type="radio"
                      name="user-role"
                      id="RoomOwner"
                      value="RoomOwner"
                      onChange={this.handleUserRoleSelect}
                      checked={
                        !this.state.data.userRole ||
                        this.state.data.userRole === "RoomOwner"
                          ? "checked"
                          : ""
                      }
                    />{" "}
                    <label htmlFor="roomOwner">RoomOwner</label>
                  </div>
                </div>
                <div className="col-lg d-lg-flex justify-content-lg-center">
                  <div className="my-auto">
                    <input
                      className=""
                      type="radio"
                      name="user-role"
                      id="Tenant"
                      value="Tenant"
                      onChange={this.handleUserRoleSelect}
                      checked={
                        this.state.data.userRole === "Tenant" ? "checked" : ""
                      }
                    />{" "}
                    <label htmlFor="tenant">Tenant</label>
                  </div>
                </div>
              </div>
              {this.renderInput("email", "Email", true)}
              {this.renderInput("password", "Password", true, "password")}
              {this.renderButton("Login")}
            </form>

            <SendForgetPasswordEmail />
            <div className="mt-3">
              <p className="text-center">
                Don't have an account&nbsp;<a href="/register">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
