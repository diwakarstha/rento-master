import React, { Component } from "react";
import ModifiedCarousel from "../common/carousel";
import RoomCard from "./roomCard";
import { getRoomById, getRooms } from "../../services/roomService";
import { getFacilities } from "../../services/facilityService";
import auth from "../../services/authService";
import ApplicationForm from "../tenant/applicationForm";
import ComplaintForm from "../tenant/complaintForm";
import { Link } from "react-router-dom";
import { checkExistingApplication } from "../../services/applicationService";

class RoomDetail extends Component {
  state = {
    applicationModalState: false,
    complaintModalState: false,
    room: "",
    rooms: [],
    facilities: [],
    existingApplication: "",
  };

  async componentDidMount() {
    try {
      const { data: room } = await getRoomById(this.props.match.params.id);
      const { data: facilities } = await getFacilities();
      const { data: rooms } = await getRooms();
      this.setState({ room, rooms, facilities });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        window.location = "/not-found";
    }
  }

  checkExistingApplication = async () => {
    const { data: existingApplication } = await checkExistingApplication(
      this.props.match.params.id
    );
    this.setState({ existingApplication });
  };

  handleModalChange = (state, path) => {
    if (!state) {
      if (path === "Application")
        this.setState({ applicationModalState: false });
      if (path === "Complaint") this.setState({ complaintModalState: false });
    } else {
      if (path === "Application")
        this.setState({ applicationModalState: true });
      if (path === "Complaint") this.setState({ complaintModalState: true });
    }
  };

  render() {
    const { room, existingApplication } = this.state;
    const user = auth.getCurrentUser();
    if (user) this.checkExistingApplication();
    if (!room) return <h1 className="text-center">Loading</h1>;
    else
      return (
        <React.Fragment>
          <div className="container">
            <div>
              <ModifiedCarousel items={room.image} />
            </div>
            <div>
              <hr />

              <div className="d-none d-md-block d-lg-block">
                <div className="row">
                  <div className="col-lg-4 col-md-4">
                    <div>
                      <h1 style={{ display: "inline" }}>
                        RS {room.monthlyRent}{" "}
                      </h1>
                      | {room.squareFeet} sqft.
                    </div>
                    <p style={{ textTransform: "uppercase" }}>
                      {room.city}-{room.wardNumber} {room.location}
                    </p>
                    <p style={{ textTransform: "uppercase" }}>
                      LISTED BY: {room.userName}
                    </p>

                    {!(user && user._id === room.user) && (
                      <div>
                        {(!user && (
                          <React.Fragment>
                            <Link
                              className="btn btn-primary mr-2"
                              to={{
                                pathname: "/login",
                                state: {
                                  from: "/rooms/" + room._id,
                                  message: "Login to Apply",
                                  role: "Tenant",
                                },
                              }}
                            >
                              Apply
                            </Link>
                            <Link
                              className="btn btn-danger"
                              to={{
                                pathname: "/login",
                                state: {
                                  from: "/rooms/" + room._id,
                                  message: "Login to Report",
                                  role: "Tenant",
                                },
                              }}
                            >
                              Report
                            </Link>
                          </React.Fragment>
                        )) ||
                          (existingApplication && (
                            <React.Fragment>
                              {existingApplication.status !== "Approved" && (
                                <a
                                  className="btn btn-primary mr-2"
                                  href={
                                    "/MyApplications/" + existingApplication._id
                                  }
                                >
                                  View Application
                                </a>
                              )}

                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  this.handleModalChange(true, "Complaint")
                                }
                              >
                                Report
                              </button>
                              {user && (
                                <ComplaintForm
                                  show={this.state.complaintModalState}
                                  roomId={room._id}
                                  handleClose={() =>
                                    this.handleModalChange(false, "Complaint")
                                  }
                                />
                              )}
                            </React.Fragment>
                          )) || (
                            <React.Fragment>
                              <button
                                className="btn btn-primary mr-2"
                                onClick={() =>
                                  this.handleModalChange(true, "Application")
                                }
                              >
                                Apply
                                {this.state.existingApplication &&
                                  this.state.existingApplication._id}
                              </button>

                              {user && (
                                <ApplicationForm
                                  show={this.state.applicationModalState}
                                  roomId={room._id}
                                  handleClose={() =>
                                    this.handleModalChange(false, "Application")
                                  }
                                />
                              )}

                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  this.handleModalChange(true, "Complaint")
                                }
                              >
                                Report
                              </button>
                              {user && (
                                <ComplaintForm
                                  show={this.state.complaintModalState}
                                  roomId={room._id}
                                  handleClose={() =>
                                    this.handleModalChange(false, "Complaint")
                                  }
                                />
                              )}
                            </React.Fragment>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="col-lg-8 col-md-8">
                    <h1>Overview</h1>
                    <p>{room.description}</p>
                  </div>
                </div>
              </div>

              <div className="d-block d-md-none d-lg-none">
                <div className="col-lg-4 col-md-4">
                  <div>
                    <h1 style={{ display: "inline" }}>
                      RS {room.monthlyRent}{" "}
                    </h1>
                    | {room.squareFeet} sqft.
                  </div>
                  <p style={{ textTransform: "uppercase" }}>
                    {room.city}-{room.wardNumber} {room.location}
                  </p>
                  <p style={{ textTransform: "uppercase" }}>
                    LISTED BY: {room.userName}
                  </p>
                  <button className="btn btn-primary mr-2">Apply</button>
                  <button className="btn btn-danger">Report</button>
                </div>
                <hr />
                <div className="col-lg-8 col-md-8">
                  <h1>Overview</h1>
                  <p>{room.description}</p>
                </div>
              </div>

              <hr />
              <div>
                <h1>Features</h1>
                <div
                  className="row"
                  style={{ marginRight: "0%", textTransform: "uppercase" }}
                >
                  {this.state.facilities.map((f) => (
                    <div className="col-6 my-2" key={f.name}>
                      <div>
                        <p style={{ display: "inline-block" }}>
                          <i className={`fa ${f.icon}`}></i>{" "}
                          <strong>{f.name}:</strong>
                        </p>{" "}
                        {!room.facility.find((rf) => f.name === rf) ? (
                          <p
                            className="text-danger"
                            style={{ display: "inline-block" }}
                          >
                            Not Available
                          </p>
                        ) : (
                          <p
                            className="text-success"
                            style={{ display: "inline-block" }}
                          >
                            Available
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr />
              <h1>Similar Rooms</h1>
              <RoomCard
                items={this.state.rooms}
                onClick={this.handleRoomClick}
              />
              <hr />
              <h1>Nearby Rooms</h1>
              <RoomCard
                items={this.state.rooms}
                onClick={this.handleRoomClick}
              />
            </div>
          </div>
        </React.Fragment>
      );
  }
}

export default RoomDetail;