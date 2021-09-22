import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


import { getAccount } from "../../../redux/actions/account_action";

import {
    getInnovation,
    createInnovation,
    updateInnovation,
    deleteInnovation,
} from "../../../redux/actions/innovation_action";

import {
    Container,
    Button,
    Card,
    CardBody,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Row,
    Col,
    Toast,
    ToastBody,
    ToastHeader,
} from "reactstrap";

import ReactDatatable from "@ashvin27/react-datatable";

import { Link } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const animatedComponents = makeAnimated();

const MODAL_TYPE = {
    CRT: "CREATE",
    UPD: "UPDATE",
    DEL: "DELETE",
};

const USER_TYPE = {
    USR: "user",
    ADMIN: "admin",
    RD: "rd",
    RH: "rh", 
    CD: "cd", 
};

const formSchema = yup.object().shape({
    // author: yup.mixed().test("author", "Author field is required", (value) => {
    //     let nameOfAuthor = document.getElementById("react-select")
    //     console.log("Author", nameOfAuthor)
    // }),
    title_of_innovation: yup.string().required("Title of innovation field is required"),
    type_of_innovation: yup.string().required("Type of innovation field is required"),
    is_submitted_or_granted: yup.string().required("Status field is required"),
    // date_submitted: yup.mixed()
    // .test("date_submitted", "Date submitted field is required", (value) => {
    //     let statusCode = document.getElementById("is_submitted_or_granted");
    //     return statusCode.value === "submitted" && statusCode.value !== "";
    // }),
    // grant_code: yup.string().required("Grant code field is required"),
    // date_granted: yup.string().required("Date granted field is required"),
})

const Innovation = ({ currentUser }) => {
    const faculty = useSelector((state) => state.account.accounts); // This is to populate proposal data
    const innovation = useSelector((state) => state.innovation.innovations); // This is to populate proposal data

    const dispatch = useDispatch(); // this is to dispatch actions

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(formSchema)
    })

    const [modal, setModal] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    const [innovationId, setInnovationId] = useState(null);
    const [facultyDetails, setFacultyDetails] = useState("");
    const [titleOfInnovation, setTitleOfInnovation] = useState("");
    const [typeOfInnovation, setTypeOfInnovation] = useState("");
    const [status, setStatus] = useState("");
    const [dateSubmitted, setDateSubmitted] = useState("");
    const [grantCode, setGrantCode] = useState("");
    const [dateGranted, setDateGranted] = useState("");
    const [updatedAt, setUpdatedAt] = useState(new Date());
    const [updatedBy, setUpdatedBy] = useState({
        user_id: currentUser.id,
        full_name: `${currentUser.first_name} ${currentUser.last_name}`,
        user_type: currentUser.user_type,
        college: currentUser.college,
        campus: currentUser.campus,
    });

    // Datatables Configuration
    const dtColumns = [
        {
            key: "proposal_no",
            className: "text-center",
            align: "left",
            sortable: true,
            // width: 150,
            cell: (innovation) => {
                if (innovation.is_completed === "N") {
                    return (
                        <React.Fragment>
                            <Button
                                size="sm"
                                className="btn btn-secondary"
                                onClick={() => showEditForm(innovation)}
                            >
                                <span><i className="fas fa-pencil-alt"></i> Edit</span>
                            </Button>{" "}
                            &nbsp;
                            <Button
                                color="danger"
                                size="sm"
                                className="btn btn-danger"
                                onClick={() => onClickDelete(innovation._id)}
                            >
                                <span><i className="fas fa-trash-alt"></i> Remove</span>
                            </Button>
                        </React.Fragment>
                    );
                }
            },
        },
        {
            key: "title_of_innovation",
            text: "Title of Innovation",
            className: "",
            align: "left",
            sortable: true,
            cell: (innovation) => {
                return (
                    <React.Fragment>
                        <Link
                            to="#"
                            className="text-secondary"
                            onClick={() => {
                                showToast();
                            }}
                        >
                            {innovation.title_of_innovation}
                        </Link>
                    </React.Fragment>
                );
            },
        },
        {
            key: "faculty_name",
            text: "Author",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "type_of_innovation",
            text: "Type of Innovation",
            className: "",
            align: "left",
            sortable: true,
            isSearchable: true,
            cell: (innovation) => {
                const { type_of_innovation } = innovation;

                return (
                    <React.Fragment>
                        {type_of_innovation[0].toUpperCase() +
                            type_of_innovation.substring(1)}
                    </React.Fragment>
                );
            },
        },
        {
            key: "status",
            text: "Status",
            className: "text-center",
            align: "left",
            sortable: true,
            isSearchable: true,
            cell: (innovation) => {
                const { status } = innovation;

                return (
                    <React.Fragment>
                        <div className="text-secondary">
                            {status.toUpperCase()}
                        </div>
                    </React.Fragment>
                );
            },
        },
        {
            key: "",
            text: "",
            align: "left",
            sortable: true,
            cell: (innovation) => {
                if (
                    currentUser.user_type === USER_TYPE.RH ||
                    currentUser.user_type === USER_TYPE.ADMIN
                ) {
                    if (
                        innovation.is_completed === "N" &&
                        currentUser.user_type === USER_TYPE.RH
                    ) {
                        return (
                            <React.Fragment>
                                <Button
                                    size="sm"
                                    className="btn btn-sm"
                                    onClick={() => {
                                        onSubmitUpdateRemarks(innovation._id);
                                    }}
                                >
                                    Completed
                                </Button>
                                &nbsp;
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <React.Fragment>
                                <div className="badge badge-success">
                                    COMPLETED
                                </div>
                            </React.Fragment>
                        );
                    }
                }
            },
        },
    ];

    const dtConfig = {
        key_column: "id",
        page_size: 10,
        length_menu: [10, 20, 50],
        button: {
            // print: true,
            extra: true,
        },
    };

    const dtExtraButtons = [
        // {
        //     className: "btn btn-primary",
        //     title: "Print",
        //     children: [
        //         <span>
        //             <i
        //                 className="glyphicon glyphicon-print fa fa-print"
        //                 aria-hidden="true"
        //             ></i>
        //         </span>,
        //     ],
        //     onClick: () => {
        //         alert("Print Logic here");
        //     },
        // },
        {
            className: "btn btn-primary",
            title: "Create New",
            children: [
                <span>
                    <i
                        className="fa fa-plus-circle"
                        aria-hidden="true"
                    ></i>
                    &nbsp; Create
                </span>
            ],
            onClick: () => {
                setModal(!modal);
            },
        },
    ];

    // End of Datatables Config

    useEffect(() => {
        dispatch(getAccount());
        dispatch(getInnovation());
    }, [dispatch]);

    const clearForm = () => {
        setInnovationId(null);
        setFacultyDetails("");
        setTitleOfInnovation("");
        setTypeOfInnovation("");
        setStatus("");
        setDateSubmitted("");
        setGrantCode("");
        setDateGranted("");
    };

    const toggleModal = () => {
        setModal(!modal);
        clearForm();
    };

    const toggleTab = (tabId) => {
        if (activeTab !== tabId) setActiveTab(tabId);

        clearForm();
    };

    const showToast = () => {
        return (
            <Toast>
                <ToastHeader>Header</ToastHeader>
                <ToastBody>Hello</ToastBody>
            </Toast>
        );
    };

    const showEditForm = (data) => {
        const {
            _id,
            faculty_id,
            faculty_name,
            title_of_innovation,
            type_of_innovation,
            status,
            date_submitted,
            grant_code,
            date_granted,
        } = data;

        toggleModal();

        setInnovationId(_id);
        setFacultyDetails({ value: faculty_id, label: faculty_name });
        setTitleOfInnovation(title_of_innovation);
        setTypeOfInnovation(type_of_innovation);
        setStatus(status);
        setDateSubmitted(date_submitted);
        setGrantCode(grant_code);
        setDateGranted(date_granted);
    };

    const onSubmit = (data) => {
        if(data.is_submitted_or_granted === "submitted") {
            const details = {
                innovation_id: data.innovation_id,
                faculty_id: facultyDetails.value,
                faculty_name: facultyDetails.label,
                title_of_innovation: data.title_of_innovation,
                type_of_innovation: data.type_of_innovation,
                status: data.is_submitted_or_granted,
                date_submitted: dateSubmitted,
                grant_code: "",
                date_granted: "",
                created_by: updatedBy,
            }

            if (!data.innovation_id) {
                dispatch(createInnovation(details));
            } else {
                dispatch(updateInnovation(details));
            }
        } else if(data.is_submitted_or_granted === "granted") {
            const details = {
                innovation_id: data.innovation_id,
                faculty_id: facultyDetails.value,
                faculty_name: facultyDetails.label,
                title_of_innovation: data.title_of_innovation,
                type_of_innovation: data.type_of_innovation,
                status: data.is_submitted_or_granted,
                date_submitted: "",
                grant_code: grantCode,
                date_granted: dateGranted,
                created_by: updatedBy,
            }

            if (!data.innovation_id) {
                dispatch(createInnovation(details));
            } else {
                dispatch(updateInnovation(details));
            }
        }
    }

    const onSubmitForm = (e) => {
        e.preventDefault();

        const data = {
            innovation_id: innovationId,
            faculty_id: facultyDetails.value,
            faculty_name: facultyDetails.label,
            title_of_innovation: titleOfInnovation,
            type_of_innovation: typeOfInnovation,
            status,
            date_submitted: dateSubmitted,
            grant_code: grantCode,
            date_granted: dateGranted,
            created_by: updatedBy,
        };

        if (!innovationId) {
            dispatch(createInnovation(data));
        } else {
            dispatch(updateInnovation(data));
        }

        toggleModal();
    };

    const onClickDelete = (innovation_id) => {
        const isDelete = window.confirm(
            "Are you sure you want to delete this data?"
        );

        if (isDelete) dispatch(deleteInnovation(innovation_id));
    };

    const onSubmitUpdateRemarks = (innovation_id) => {
        const data = {
            innovation_id,
            is_completed: "Y",
            updated_at: updatedAt,
            updated_by: updatedBy,
        };

        const isSubmit = window.confirm("Are you sure you want to update?");

        if (isSubmit) {
            dispatch(updateInnovation(data));
        }
    };

    // authors option assigning
    const getFacultyOption = () => {
        const options = [];

        for (let i = 0; i < faculty.length; i++) {
            options.push({
                value: faculty[i]._id,
                label: faculty[i].full_name,
            });
        }

        return options;
    };

    const getInnovations = () => {
        const currentUserId = currentUser.id;
        const pending = [];

        for (let i = 0; i < innovation.length; i++) {
            // Destructure some of the details
            let { user_id } = innovation[i].created_by;

            if (user_id === currentUserId && (innovation[i].is_completed === "N" || innovation[i].is_completed === "Y")) {
                pending.push({
                    _id: innovation[i]._id,
                    faculty_name: innovation[i].faculty_name,
                    title_of_innovation: innovation[i].title_of_innovation,
                    type_of_innovation: innovation[i].type_of_innovation,
                    status: innovation[i].status,
                    date_submitted: innovation[i].date_submitted,
                    grant_code: innovation[i].grant_code,
                    date_granted: innovation[i].date_granted,
                    is_completed: innovation[i].is_completed,
                });
            }
        }

        return pending;
    }

    const getPendingInnovations = () => {
        const currentUserId = currentUser.id;

        if (typeof innovation !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const pending = [];

                for (let i = 0; i < innovation.length; i++) {
                    if (innovation[i].is_completed === "N") {
                        pending.push({
                            _id: innovation[i]._id,
                            faculty_name: innovation[i].faculty_name,
                            title_of_innovation:
                                innovation[i].title_of_innovation,
                            type_of_innovation:
                                innovation[i].type_of_innovation,
                            status: innovation[i].status,
                            date_submitted: innovation[i].date_submitted,
                            grant_code: innovation[i].grant_code,
                            date_granted: innovation[i].date_granted,
                            is_completed: innovation[i].is_completed,
                        });
                    }
                }

                return pending;
            }
            // Current logged in user is USER.
            else {
                const pending = [];

                for (let i = 0; i < innovation.length; i++) {
                    // Destructure some of the details
                    let { user_id } = innovation[i].created_by;

                    if (
                        innovation[i].is_completed === "N" &&
                        user_id === currentUserId
                    ) {
                        pending.push({
                            _id: innovation[i]._id,
                            faculty_name: innovation[i].faculty_name,
                            title_of_innovation:
                                innovation[i].title_of_innovation,
                            type_of_innovation:
                                innovation[i].type_of_innovation,
                            status: innovation[i].status,
                            date_submitted: innovation[i].date_submitted,
                            grant_code: innovation[i].grant_code,
                            date_granted: innovation[i].date_granted,
                            is_completed: innovation[i].is_completed,
                        });
                    }
                }

                return pending;
            }
        }
    };

    const getCompletedInnovations = () => {
        const currentUserId = currentUser.id;

        if (typeof innovation !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const completed = [];

                for (let i = 0; i < innovation.length; i++) {
                    if (innovation[i].is_completed === "Y") {
                        completed.push({
                            _id: innovation[i]._id,
                            faculty_name: innovation[i].faculty_name,
                            title_of_innovation:
                                innovation[i].title_of_innovation,
                            type_of_innovation:
                                innovation[i].type_of_innovation,
                            status: innovation[i].status,
                            date_submitted: innovation[i].date_submitted,
                            grant_code: innovation[i].grant_code,
                            date_granted: innovation[i].date_granted,
                            is_completed: innovation[i].is_completed,
                        });
                    }
                }

                return completed;
            }
            // Current logged in user is USER.
            else {
                const completed = [];

                for (let i = 0; i < innovation.length; i++) {
                    // Destructure some of the details
                    let { user_id } = innovation[i].created_by;

                    if (
                        innovation[i].is_completed === "Y" &&
                        user_id === currentUserId
                    ) {
                        completed.push({
                            _id: innovation[i]._id,
                            faculty_name: innovation[i].faculty_name,
                            title_of_innovation:
                                innovation[i].title_of_innovation,
                            type_of_innovation:
                                innovation[i].type_of_innovation,
                            status: innovation[i].status,
                            date_submitted: innovation[i].date_submitted,
                            grant_code: innovation[i].grant_code,
                            date_granted: innovation[i].date_granted,
                            is_completed: innovation[i].is_completed,
                        });
                    }
                }

                return completed;
            }
        }
    };

    return (
        <React.Fragment>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <Modal
                isOpen={modal}
                toggle={toggleModal}
                size="lg"
                className="modal-dialog"
            >
                <ModalHeader
                    className="bg-primary text-light"
                    toggle={toggleModal}
                >
                    {!innovationId ? "Add Innovation" : "Update Innovation"}
                </ModalHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <Label>
                                    Author{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <input
                                    type="hidden"
                                    name="innovation_id"
                                    id="innovation_id"
                                    defaultValue={innovationId}
                                    {...register("innovation_id")}
                                />
                                <Select
                                    id="react-select"
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti={false}
                                    options={getFacultyOption()}
                                    name="faculty"
                                    value={facultyDetails}
                                    onChange={setFacultyDetails}
                                    isSearchable={true}
                                />
                                {/* <span className="text-danger">
                                    { errors.author?.message }
                                </span> */}
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Title of Innovation{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="title_of_innovation"
                                    id="title_of_innovation"
                                    defaultValue={titleOfInnovation}
                                    {...register("title_of_innovation")}
                                />
                                <span className="text-danger">
                                    { errors.title_of_innovation?.message }
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Type of Innovation{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            type="select"
                                            name="type_of_innovation"
                                            id="type_of_innovation"
                                            defaultValue={typeOfInnovation}
                                            {...register("type_of_innovation")}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="patent">
                                                Patent
                                            </option>
                                            <option value="utility model">
                                                Utility Model
                                            </option>
                                            <option value="trademark">
                                                Trademark
                                            </option>
                                            <option value="industrial design">
                                                Industrial Design
                                            </option>
                                            <option value="copyright">
                                                Copyright
                                            </option>
                                            <option value="geographic indication">
                                                Geographic Indication
                                            </option>
                                        </select>
                                        <span className="text-danger">
                                            { errors.type_of_innovation?.message }
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Status{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            type="select"
                                            name="is_submitted_or_granted"
                                            id="is_submitted_or_granted"
                                            defaultValue={status}
                                            {...register("is_submitted_or_granted")}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="submitted">
                                                Submitted
                                            </option>
                                            <option value="granted">
                                                Granted
                                            </option>
                                        </select>
                                        <span className="text-danger">
                                            { errors.is_submitted_or_granted?.message }
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup
                                className={
                                    watch("is_submitted_or_granted") === "submitted" ? "" : "hidden"
                                }
                            >
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Date Submitted{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <DateTimePickerComponent
                                            format="yyyy-MM-dd"
                                            id="datetimepicker"
                                            value={dateSubmitted}
                                            onChange={(e) => {
                                                setDateSubmitted(
                                                    e.target.value
                                                );
                                            }}
                                            required={
                                                watch("is_submitted_or_granted") === "submitted"
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <span className="text-danger">
                                            { errors.date_submitted?.message }
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup
                                className={watch("is_submitted_or_granted") === "granted" ? "" : "hidden"}
                            >
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Grant Code{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            name="grant_code"
                                            id="grant_code"
                                            value={grantCode}
                                            onChange={(e) => {
                                                setGrantCode(e.target.value);
                                            }}
                                            required={
                                                watch("is_submitted_or_granted") === "granted"
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup
                                className={ watch("is_submitted_or_granted") === "granted" ? "" : "hidden"}
                            >
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Date Granted{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <DateTimePickerComponent
                                            format="yyyy-MM-dd"
                                            id="datetimepicker"
                                            value={dateGranted}
                                            onChange={(e) => {
                                                setDateGranted(e.target.value);
                                            }}
                                            required={
                                                watch("status") === "granted"
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary">
                            Save Changes
                        </Button>
                        <Button color="light" onClick={toggleModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Innovation
                        </h3>
                        <div className="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0 p-0">
                                    <li className="breadcrumb-item">
                                        <a href="/">Settings</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-muted active"
                                        aria-current="page"
                                    >
                                        <a href="/innovation">Innovation</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-5 align-self-center">
                        <div className="customize-input float-right">
                            <select className="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius">
                                <option>2019</option>
                                <option value={1}>2020</option>
                                <option value={2}>2021</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            { currentUser.user_type === "rh" || currentUser.user_type === "admin" ? (<>
                <Container fluid>
                    <Card>
                        <CardBody>
                            <Nav tabs pills className="mb-3 font-14">
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "1" ? "active" : null
                                        }
                                        onClick={() => {
                                            toggleTab("1");
                                        }}
                                    >
                                        Pending
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "2" ? "active" : null
                                        }
                                        onClick={() => {
                                            toggleTab("2");
                                        }}
                                    >
                                        Completed
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <ReactDatatable
                                        className="table font-14"
                                        tHeadClassName="thead-dark"
                                        config={dtConfig}
                                        records={getPendingInnovations()}
                                        columns={dtColumns}
                                        extraButtons={dtExtraButtons}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ReactDatatable
                                        className="table font-14"
                                        tHeadClassName="thead-dark"
                                        config={dtConfig}
                                        records={getCompletedInnovations()}
                                        columns={dtColumns}
                                        extraButtons={dtExtraButtons}
                                    />
                                </TabPane>
                            </TabContent>
                        </CardBody>
                    </Card>
                </Container>
            </>) : (<>
                <Container fluid>
                    <Card>
                        <CardBody>
                            <ReactDatatable
                                className="table font-14"
                                tHeadClassName="thead-dark"
                                config={dtConfig}
                                records={getInnovations()}
                                columns={dtColumns}
                                extraButtons={dtExtraButtons}
                            />
                        </CardBody>
                    </Card>
                </Container>
                
            </>)}
            
        </React.Fragment>
    );
};

export default Innovation;
