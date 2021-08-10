import React, { Component } from "react";
import ApplicationTable from "./applicationsTable";
import application from "./../../../services/applicationService";
import { getCurrentUser } from "./../../../services/authService";
import { getUserVerificationData } from "../../../services/userService";
import { paginate } from "../../../utils/paginate";
import Pagination from "../../common/pagination";
import _ from "lodash";

class Applications extends Component {
  state = {
    active: "all",
    applications: [],
    tableData: [],
    searchQuery: "",
    sortColumn: { path: "applicationNumber", order: "asc" },
    submitted: "",
    rejected: "",
    approved: "",
    pageSize: 5,
    currentPage: 1,
  };

  handlePageChange = (page) => {
    console.log("Set this page number as current:", page);
    this.setState({ currentPage: page });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (e) => {
    console.log(e.currentTarget.value);
    this.setState({
      searchQuery: e.currentTarget.value,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tableData !== this.state.tableData)
      this.handleCountRerender();
  }

  async componentDidMount() {
    document.title = "Rento | Applications";
    const user = getCurrentUser();
    let uv_data;
    if (user) uv_data = getUserVerificationData();
    console.log(user, uv_data);

    if (uv_data.verified === true) {
      const { data: applications } = await application.getTenantApplications();
      const submitted = applications.filter(
        (d) => d.status === "Submitted"
      ).length;
      const rejected = applications.filter(
        (d) => d.status === "Rejected" || d.status === "Cancelled"
      ).length;
      const approved = applications.filter(
        (d) => d.status === "Approved"
      ).length;
      this.setState({
        applications,
        tableData: applications,
        submitted,
        rejected,
        approved,
      });
    }
  }

  handleCountRerender = async () => {
    console.log("yes");
    const { data: applications } = await application.getTenantApplications();
    const submitted = applications.filter(
      (d) => d.status === "Submitted"
    ).length;
    const rejected = applications.filter(
      (d) => d.status === "Rejected" || d.status === "Cancelled"
    ).length;
    const approved = applications.filter((d) => d.status === "Approved").length;
    this.setState({
      submitted,
      rejected,
      approved,
    });
  };

  handleSelect = (v) => {
    if (v === "all") {
      this.setState({ active: v });
      this.setState({ tableData: this.state.applications });
      // this.handleCountRerender()
    }
    if (v === "pending") {
      this.setState({ active: v });
      let data = this.state.applications;
      data = data.filter((d) => d.status === "Submitted");
      this.setState({ tableData: data });
      console.log(data);
    }
    if (v === "approved") {
      this.setState({ active: v });
      let data = this.state.applications;
      data = data.filter((d) => d.status === "Approved");
      this.setState({ tableData: data });
      console.log(data);
    }
    if (v === "cancel") {
      this.setState({ active: v });
      let data = this.state.applications;
      data = data.filter(
        (d) => d.status === "Rejected" || d.status === "Cancelled"
      );
      this.setState({ tableData: data });
      console.log(data);
    }

    console.log(this.state.active);
  };

  handleMessage = async (m, tab) => {
    console.log(m);
    const { data } = await application.getTenantApplications();
    if (tab === "all")
      this.setState({
        applications: data,
        tableData: data,
      });
    if (tab === "pending")
      this.setState({
        applications: data,
        tableData: data.filter((d) => d.status === "Submitted"),
      });
    if (tab === "approved")
      this.setState({
        applications: data,
        tableData: data.filter((d) => d.status === "Approved"),
      });
    if (tab === "cancel")
      this.setState({
        applications: data,
        tableData: data.filter(
          (d) => d.status === "Rejected" || d.status === "Cancelled"
        ),
      });
  };

  handleCancel = async (e) => {
    try {
      console.log(e.currentTarget.value);
      const message = await application.cancelApplication(
        e.currentTarget.value
      );
      console.log(message.data);
      // this.props.status(200);
      const { data: applications } = await application.getTenantApplications();
      this.setState({
        applications,
        tableData: applications,
      });
    } catch (ex) {}
  };

  getPageData = () => {
    const { tableData, sortColumn } = this.state;
    const sortedApplications = _.orderBy(
      tableData,
      [sortColumn.path],
      [sortColumn.order]
    );
    const applicationData = paginate(
      sortedApplications,
      this.state.currentPage,
      this.state.pageSize
    );

    return { totalCount: sortedApplications.length, data: applicationData };
  };

  render() {
    const { sortColumn } = this.state;
    const { totalCount, data } = this.getPageData();
    return (
      <React.Fragment>
        <div>
          <div className="row" style={{ margin: "0 5% 0 5%" }}>
            <div className="col ">
              <h2>Applications</h2>
            </div>
          </div>
          <div
            className="row bg-light shadow-sm p-3 mb-5 rounded"
            style={{ margin: "0 5% 0 5%" }}
          >
            <div className="my-2 col-lg col-md d-flex justify-content-lg-start justify-content-md-start justify-content-center">
              <ul className="nav" style={{ listStyleType: "none" }}>
                <li className=" mx-2">
                  <div
                    style={{ cursor: "pointer" }}
                    className={
                      this.state.active === "all"
                        ? "text-dark font-weight-bold application-button"
                        : "text-dark application-button"
                    }
                    onClick={() => this.handleSelect("all")}
                  >
                    All({this.state.applications.length})
                  </div>
                </li>
                <li className="text-dark mx-2">
                  <div
                    style={{ cursor: "pointer" }}
                    className={
                      this.state.active === "pending"
                        ? "text-dark font-weight-bold application-button"
                        : "text-dark application-button"
                    }
                    onClick={() => this.handleSelect("pending")}
                  >
                    Pending({this.state.submitted})
                  </div>
                </li>
                <li className="text-dark mx-2">
                  <div
                    style={{ cursor: "pointer" }}
                    className={
                      this.state.active === "approved"
                        ? "text-dark font-weight-bold application-button"
                        : "text-dark application-button"
                    }
                    onClick={() => this.handleSelect("approved")}
                  >
                    Approved({this.state.approved})
                  </div>
                </li>
                <li className="text-dark mx-2">
                  <div
                    style={{ cursor: "pointer" }}
                    className={
                      this.state.active === "cancel"
                        ? "text-dark font-weight-bold application-button"
                        : "text-dark application-button"
                    }
                    onClick={() => this.handleSelect("cancel")}
                  >
                    Canceled/Rejected({this.state.rejected})
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div style={{ margin: "0 5% 0 5%" }}>
            {(totalCount === 0 && (
              <h5 className="ml-4 mb-5 ">There are no applications to show</h5>
            )) || (
              <React.Fragment>
                <p className="ml-4 mb-3 ">
                  Showing {data.length} of {totalCount} Applications
                </p>
                <ApplicationTable
                  applications={data}
                  sortColumn={this.state.sortColumn}
                  onSort={this.handleSort}
                  handleMessage={this.handleMessage}
                  handleCancel={this.handleCancel}
                  tab={this.state.active}
                />
                <div className=" mx-auto d-lg-flex justify-content-lg-center d-md-flex justify-content-md-center ">
                  <Pagination
                    itemsCount={totalCount}
                    pageSize={this.state.pageSize}
                    currentPage={this.state.currentPage}
                    onPageChange={this.handlePageChange}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Applications;
