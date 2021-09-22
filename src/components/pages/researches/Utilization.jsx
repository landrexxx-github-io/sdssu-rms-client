import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
    getUtilization,
    createUtilizaition,
    updateUtilization,
    deleteUtilization,
} from "../../../redux/actions/utilization_action";

import { getProposalCompleted } from "../../../redux/actions/completed_action";

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
} from "reactstrap";

import ReactDatatable from "@ashvin27/react-datatable";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import moment from "moment";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MODAL_TYPE = {
    CRT: "CREATE",
    UPD: "UPDATE",
    DEL: "DELETE",
};

const USER_TYPE = {
    USR: "user",
    ADMIN: "admin",
    RD: "rd", // research director
    RH: "rh", // research head
    CD: "cd", // campus director
};

const formSchema = yup.object().shape({
    research_id: yup.string().required("Title of research field is required"),
    beneficiary: yup.string().required("Beneficiary field is required"),
    date_of_utilization: yup.mixed().required("Date of utilization field is required.")
                        .test("date_of_utilization", "Please provide an input.",(value) => {
                           return value !== ""
                        }),
})

const Utilization = ({ currentUser }) => {
    const completed = useSelector((state) => state.completed.completed);
    const utilization = useSelector((state) => state.utilization.utilizations);

    const dispatch = useDispatch(); // this is to dispatch actions

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(formSchema)
    })

    const [modal, setModal] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    const [utilizationId, setUtilizationId] = useState(null);
    const [researchId, setResearchId] = useState(null);
    const [titleOfResearch, setTitleOfResearch] = useState("");
    const [beneficiary, setBeneficiary] = useState("");
    const [dateOfUtilization, setDateOfUtilization] = useState("");
    // const [updatedAt, setUpdatedAt] = useState(new Date());
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
            width: 70,
            cell: (utilization) => {
                if(utilization.is_completed === 'N') { 
                    return (
                        <React.Fragment>
                            <Button
                                size="sm"
                                className="btn btn-secondary"
                                onClick={() => showEditForm(utilization)}
                            >
                                <span><i className="fas fa-pencil-alt"></i> Edit</span>
                            </Button>{" "}
                            &nbsp;
                            <Button
                                color="danger"
                                size="sm"
                                className="btn btn-danger"
                                onClick={() => onClickDelete(utilization._id)}
                            >
                                <span><i className="fas fa-trash-alt"></i> Remove</span>
                            </Button>
                        </React.Fragment>
                    );
                }
            },
        },
        {
            key: "title_of_research",
            text: "Title of Research",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "beneficiary",
            text: "Beneficiary",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "date_of_utilization",
            text: "Date of Utilization",
            className: "",
            align: "left",
            sortable: true,
            cell: (utilization) => {
                return (
                    <React.Fragment>
                        {moment(utilization.date_of_utilization).format("LL")}
                    </React.Fragment>
                );
            },
        },
        {
            key: "",
            text: "",
            align: "left",
            sortable: true,
            cell: (utilization) => {
                if(currentUser.user_type === USER_TYPE.RH || currentUser.user_type === USER_TYPE.ADMIN) {
                    if(utilization.is_completed === 'N' && currentUser.user_type === USER_TYPE.RH) {
                        return (
                            <React.Fragment>
                                <Button
                                    size="sm"
                                    className="btn btn-sm"
                                    onClick={() => {
                                        onSubmitUpdateRemarks(utilization._id);
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
                                <div className="badge badge-success">COMPLETED</div>
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
                </span>,
            ],
            onClick: () => {
                setModal(!modal);
            },
        },
    ];

    // End of Datatables Config

    useEffect(() => {
        dispatch(getUtilization());
        dispatch(getProposalCompleted());
        // dispatch(getProposalCompletedApproved());
    }, [dispatch]);

    const clearForm = () => {
        setUtilizationId(null);
        setResearchId(null);
        setTitleOfResearch("");
        setBeneficiary("");
        setDateOfUtilization("");
    };

    const toggleModal = () => {
        setModal(!modal);
        clearForm();
    };

    const toggleTab = (tabId) => {
        if (activeTab !== tabId) setActiveTab(tabId);

        clearForm();
    };

    const showEditForm = (data) => {
        console.log("DATA: ", data);
        const {
            _id,
            research_id,
            title_of_research,
            beneficiary,
            date_of_utilization,
        } = data;

        toggleModal();

        setUtilizationId(_id);
        setResearchId(research_id);
        setTitleOfResearch(title_of_research);
        setBeneficiary(beneficiary);
        setDateOfUtilization(date_of_utilization);
    };

    const onSubmit = (data) => {
        let selectedResearch = document.getElementById("research_id");
        let titleOfTheResearch = selectedResearch.options[selectedResearch.selectedIndex].text;

        const details = {
            utilization_id: data.utilization_id,
            research_id: data.research_id,
            title_of_research: titleOfTheResearch,
            beneficiary: data.beneficiary,
            date_of_utilization: data.date_of_utilization,
            created_at: new Date(),
            created_by: updatedBy,
        };

        if (!data.utilization_id) {
            dispatch(createUtilizaition(details));
        } else {
            dispatch(updateUtilization(details));
        }

        toggleModal();
    }

    const onSubmitForm = (e) => {
        e.preventDefault();

        const data = {
            utilization_id: utilizationId,
            research_id: researchId,
            title_of_research: titleOfResearch,
            beneficiary,
            date_of_utilization: dateOfUtilization,
            created_by: updatedBy,
        };

        if (!utilizationId) {
            dispatch(createUtilizaition(data));
        } else {
            dispatch(updateUtilization(data));
        }

        toggleModal();
    };

    const onClickDelete = (utilization_id) => {
        const isDelete = window.confirm(
            "Are you sure you want to delete this data?"
        );

        if (isDelete) dispatch(deleteUtilization(utilization_id));
    };

    const onSubmitUpdateRemarks = (utilization_id) => {
        const data = {
            utilization_id,
            is_completed: "Y",
            updated_at: new Date(),
        };

        const isSubmit = window.confirm("Are you sure you want to update?");

        if (isSubmit) {
            dispatch(updateUtilization(data));
        }
    };

    const getResearchesOptions = () => {
        const currentUserId = currentUser.id;

        if (completed !== undefined) {
            const list_of_research = [];

            for (let i = 0; i < completed.length; i++) {
                let { user_id } = completed[i].created_by;

                if (
                    completed[i].is_completed === "Y" &&
                    user_id === currentUserId
                ) {
                    list_of_research.push(
                        <option key={completed[i]._id} value={completed[i]._id}>
                            {completed[i].title_of_research}
                        </option>
                    );
                }
            }

            return list_of_research;
        }
    };

    const getUtilizations = () => {
        const currentUserId = currentUser.id;
        const user = [];

        for (let i = 0; i < utilization.length; i++) {
            // Destructure some of the details
            let { user_id } = utilization[i].created_by;

            if (user_id === currentUserId && (utilization[i].is_completed === "N" || utilization[i].is_completed === "Y")) {
                user.push({
                    _id: utilization[i]._id,
                    research_id: utilization[i].research_id,
                    title_of_research: utilization[i].title_of_research,
                    beneficiary: utilization[i].beneficiary,
                    date_of_utilization: utilization[i].date_of_utilization,
                    is_completed: utilization[i].is_completed,
                });
            }
        }

        return user;
    }

    const getPendingUtilization = () => {
        const currentUserId = currentUser.id;

        if (typeof utilization !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const pending = [];

                for (let i = 0; i < utilization.length; i++) {
                    if (utilization[i].is_completed === "N") {
                        pending.push({
                            _id: utilization[i]._id,
                            research_id: utilization[i].research_id,
                            title_of_research: utilization[i].title_of_research,
                            beneficiary: utilization[i].beneficiary,
                            date_of_utilization:
                                utilization[i].date_of_utilization,
                            is_completed: utilization[i].is_completed,
                        });
                    }
                }

                return pending;
            }
            // Current logged in user is USER.
            else {
                const pending = [];

                for (let i = 0; i < utilization.length; i++) {
                    // Destructure some of the details
                    let { user_id } = utilization[i].created_by;

                    if (
                        utilization[i].is_completed === "N" &&
                        user_id === currentUserId
                    ) {
                        pending.push({
                            _id: utilization[i]._id,
                            research_id: utilization[i].research_id,
                            title_of_research: utilization[i].title_of_research,
                            beneficiary: utilization[i].beneficiary,
                            date_of_utilization:
                                utilization[i].date_of_utilization,
                            is_completed: utilization[i].is_completed,
                        });
                    }
                }

                return pending;
            }
        }
    };

    const getCompletedUtilization = () => {
        const currentUserId = currentUser.id;

        if (typeof presentation !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const completed = [];

                for (let i = 0; i < utilization.length; i++) {
                    if (utilization[i].is_completed === "Y") {
                        completed.push({
                            _id: utilization[i]._id,
                            research_id: utilization[i].research_id,
                            title_of_research: utilization[i].title_of_research,
                            beneficiary: utilization[i].beneficiary,
                            date_of_utilization:
                                utilization[i].date_of_utilization,
                            is_completed: utilization[i].is_completed,
                        });
                    }
                }

                return completed;
            }
            // Current logged in user is USER.
            else {
                const completed = [];

                for (let i = 0; i < utilization.length; i++) {
                    // Destructure some of the details
                    let { user_id } = utilization[i].created_by;

                    if (
                        utilization[i].is_completed === "Y" &&
                        user_id === currentUserId
                    ) {
                        completed.push({
                            __id: utilization[i]._id,
                            research_id: utilization[i].research_id,
                            title_of_research: utilization[i].title_of_research,
                            beneficiary: utilization[i].beneficiary,
                            date_of_utilization:
                                utilization[i].date_of_utilization,
                            is_completed: utilization[i].is_completed,
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
                    {!utilizationId ? "Add Utilization" : "Update Utilization"}
                </ModalHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <Label for="">
                                    Title of Research{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <input
                                    type="hidden"
                                    name="utilization_id"
                                    id="utilization_id"
                                    // value={utilizationId}
                                    // onChange={(e) => {
                                    //     setUtilizationId(e.target.value);
                                    // }}
                                    defaultValue={utilizationId}
                                    {...register("utilization_id")}
                                ></input>
                                <select
                                    className={errors.research_id ? "is-invalid form-control" : "form-control" }
                                    type="select"
                                    name="research_id"
                                    id="research_id"
                                    // value={researchId}
                                    // onChange={(e) => {
                                    //     setResearchId(e.target.value);
                                    //     setTitleOfResearch(
                                    //         e.target.options[
                                    //             e.target.selectedIndex
                                    //         ].text
                                    //     );
                                    // }}
                                    defaultValue={researchId}
                                    {...register("research_id")}
                                >
                                    <option value="">Choose...</option>
                                    {getResearchesOptions()}
                                </select>
                                <span className="text-danger">
                                    { errors.research_id?.message }
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Beneficiary{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <input
                                    className={errors.beneficiary ? "is-invalid form-control" : "form-control" }
                                    type="text"
                                    name="beneficiary"
                                    id="beneficiary"
                                    // value={beneficiary}
                                    // onChange={(e) => {
                                    //     setBeneficiary(e.target.value);
                                    // }}
                                    defaultValue={beneficiary}
                                    {...register("beneficiary")}
                                />
                                <span className="text-danger">
                                    { errors.beneficiary?.message }
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Date of Utilization{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <DateTimePickerComponent
                                            format="yyyy-MM-dd"
                                            id="datetimepicker"
                                            value={dateOfUtilization}
                                            // onChange={(e) => {
                                            //     setDateOfUtilization(
                                            //         e.target.value
                                            //     );
                                            // }}
                                            {...register("date_of_utilization")}
                                        />
                                        <span className="text-danger">
                                            { errors.date_of_utilization?.message }
                                        </span>
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
                            Utilization
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
                                        <a href="/utilization">Utilzation</a>
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
                                        records={getPendingUtilization()}
                                        columns={dtColumns}
                                        extraButtons={dtExtraButtons}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ReactDatatable
                                        className="table font-14"
                                        tHeadClassName="thead-dark"
                                        config={dtConfig}
                                        records={getCompletedUtilization()}
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
                                records={getUtilizations()}
                                columns={dtColumns}
                                extraButtons={dtExtraButtons}
                            />
                        </CardBody>
                    </Card>
                </Container>
            </>) }
            
        </React.Fragment>
    );
};

export default Utilization;
