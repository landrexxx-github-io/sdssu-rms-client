import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
    getSeminar,
    createSeminar,
    updateSeminar,
    deleteSeminar,
} from "../../../redux/actions/seminar_action";

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
    date_of_seminar: yup.mixed().required("Date of utilization field is required.")
        .test("date_of_seminar", "Please provide a date.",(value) => {
        return value !== ""
    }),
    title_of_activity: yup.string().required("Title of the activity field is required"),
    type_of_participant: yup.string().required("Type of the partcipant field is required"),
    venue_of_the_activity: yup.string().required("Venue of the activity field is required"),
    scope_of_the_activity: yup.string().required("Scope of the activity field is required")
})

const Seminar = ({ currentUser }) => {
    // const completed = useSelector((state) => state.completed.completed);
    // const utilization = useSelector((state) => state.utilization.utilizations);
    const seminar = useSelector((state) => state.seminar.seminars);

    const dispatch = useDispatch(); // this is to dispatch actions

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(formSchema)
    })

    const [modal, setModal] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    const [seminarId, setSeminarId] = useState(null);
    const [dateOfSeminar, setDateOfSeminar] = useState(null);
    const [titleOfActivity, setTitleOfActivity] = useState("");
    const [typeOfParticipant, setTypeOfParticipant] = useState("");
    const [venueOfActivity, setVenueOfActivity] = useState("");
    const [scopeOfActivity, setScopeOfActivity] = useState("");
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
            align: "left",
            sortable: true,
            width: 130,
            cell: (seminar) => {
                return (
                    <React.Fragment>
                        <Button
                            size="sm"
                            className="btn btn-secondary"
                            onClick={() => showEditForm(seminar)}
                        >
                            <span><i className="fas fa-pencil-alt"></i> Edit</span>
                        </Button>{" "}
                        &nbsp;
                        <Button
                            color="danger"
                            size="sm"
                            className="btn btn-danger"
                            onClick={() => onClickDelete(seminar._id)}
                        >
                            <span><i className="fas fa-trash-alt"></i> Remove</span>
                        </Button>
                    </React.Fragment>
                );
            },
        },
        {
            key: "title_of_activity",
            text: "Title of activity",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "date_of_seminar",
            text: "Date of seminar",
            className: "",
            align: "left",
            sortable: true,
            cell: (seminar) => {
                return (
                    <React.Fragment>
                        {moment(seminar.date_of_seminar).format("LL")}
                    </React.Fragment>
                );
            }
        },
        {
            key: "type_of_participant",
            text: "Type of participant",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "venue_of_the_activity",
            text: "Venue",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "scope_of_the_activity",
            text: "Scope",
            className: "",
            align: "left",
            sortable: true,
        },
        // {
        //     key: "",
        //     text: "",
        //     align: "left",
        //     sortable: true,
        //     cell: (utilization) => {
        //         if(currentUser.user_type === USER_TYPE.RH || currentUser.user_type === USER_TYPE.ADMIN) {
        //             if(utilization.is_completed === 'N' && currentUser.user_type === USER_TYPE.RH) {
        //                 return (
        //                     <React.Fragment>
        //                         <Button
        //                             size="sm"
        //                             className="btn btn-sm"
        //                             onClick={() => {
        //                                 onSubmitUpdateRemarks(utilization._id);
        //                             }}
        //                         >
        //                             Completed
        //                         </Button>
        //                         &nbsp;
        //                     </React.Fragment>
        //                 );
        //             } else {
        //                 return (
        //                     <React.Fragment>
        //                         <div className="badge badge-success">COMPLETED</div>
        //                     </React.Fragment>
        //                 );
        //             }
        //         }
        //     },
        // },
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
            onClick: () => { setModal(!modal) },
        },
    ];

    // End of Datatables Config

    useEffect(() => {
        dispatch(getSeminar());
    }, [dispatch]);

    const clearForm = () => {
        // setUtilizationId(null);
        // setResearchId(null);
        // setTitleOfResearch("");
        // setBeneficiary("");
        // setDateOfUtilization("");
        setDateOfSeminar("");
        setTitleOfActivity("");
        setTypeOfParticipant("");
        setVenueOfActivity("");
        setScopeOfActivity("");
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
        const {
            _id,
            date_of_seminar,
            title_of_activity,
            type_of_participant,
            venue_of_the_activity,
            scope_of_the_activity,
        } = data;

        toggleModal();

        setSeminarId(_id);
        setDateOfSeminar(date_of_seminar);
        setTitleOfActivity(title_of_activity);
        setTypeOfParticipant(type_of_participant);
        setVenueOfActivity(venue_of_the_activity);
        setScopeOfActivity(scope_of_the_activity);
    };

    const onSubmit = (data) => {
        const details = {
            seminar_id: data.seminar_id,
            date_of_seminar: data.date_of_seminar,
            title_of_activity: data.title_of_activity,
            type_of_participant: data.type_of_participant,
            venue_of_the_activity: data.venue_of_the_activity,
            scope_of_the_activity: data.scope_of_the_activity,
            created_at: new Date(),
            created_by: updatedBy,
        }

        if(!data.seminar_id) {
            dispatch(createSeminar(details));
        } else {
            dispatch(updateSeminar(details))
        }

        toggleModal();
    }

    // const onSubmitForm = (e) => {
    //     e.preventDefault();

    //     const data = {
    //         utilization_id: utilizationId,
    //         research_id: researchId,
    //         title_of_research: titleOfResearch,
    //         beneficiary,
    //         date_of_utilization: dateOfUtilization,
    //         created_by: updatedBy,
    //     };

    //     if (!utilizationId) {
    //         dispatch(createUtilizaition(data));
    //     } else {
    //         dispatch(updateUtilization(data));
    //     }

    //     toggleModal();
    // };

    const onClickDelete = (seminar_id) => {
        const isDelete = window.confirm(
            "Are you sure you want to delete this data?"
        );

        if (isDelete) dispatch(deleteSeminar(seminar_id));
    };

    const getSeminarByUser = () => {
        const currentUserId = currentUser.id;

        if (typeof utilization !== undefined) {
            if (currentUser.user_type === USER_TYPE.RH || currentUser.user_type === USER_TYPE.ADMIN) {
                
                return seminar;
            
            } else {
                const user = [];

                for (let i = 0; i < seminar.length; i++) {
                    // Destructure some of the details
                    let { user_id } = seminar[i].created_by;

                    if (user_id === currentUserId) {
                        user.push({
                            _id: seminar[i]._id,
                            date_of_seminar: seminar[i].date_of_seminar,
                            title_of_activity: seminar[i].title_of_activity,
                            venue_of_the_activity: seminar[i].venue_of_the_activity,
                            scope_of_the_activity: seminar[i].scope_of_the_activity
                        });
                    }
                }

                return user;
            }
        }
    };

    // const onSubmitUpdateRemarks = (utilization_id) => {
    //     const data = {
    //         utilization_id,
    //         is_completed: "Y",
    //         updated_at: new Date(),
    //     };

    //     const isSubmit = window.confirm("Are you sure you want to update?");

    //     if (isSubmit) {
    //         dispatch(updateUtilization(data));
    //     }
    // };

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
                    Add Seminar
                </ModalHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <input
                                    type="hidden"
                                    name="seminar_id"
                                    id="seminar_id"
                                    defaultValue={seminarId}
                                    {...register("seminar_id")}
                                ></input>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Date of seminar{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <DateTimePickerComponent
                                            format="yyyy-MM-dd"
                                            id="datetimepicker"
                                            value={dateOfSeminar}
                                            {...register("date_of_seminar")}
                                        />
                                        <span className="text-danger">
                                            { errors.date_of_seminar?.message }
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Title of activity
                                    <span className="text-danger"> *</span>
                                </Label>
                                <input
                                    className={errors.title_of_activity ? "is-invalid form-control" : "form-control" }
                                    type="text"
                                    name="title_of_activity"
                                    id="title_of_activity"
                                    defaultValue={titleOfActivity}
                                    {...register("title_of_activity")}
                                />
                                <span className="text-danger">
                                    { errors.title_of_activity?.message }
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Type of participant
                                            <span className="text-danger"> *</span>
                                        </Label>
                                        <select 
                                            className={errors.type_of_participant ? "is-invalid form-control" : "form-control" }
                                            name="type_of_participant" 
                                            id="type_of_participant"
                                            defaultValue={typeOfParticipant}
                                            {...register("type_of_participant")}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="participant">Participant</option>
                                            <option value="speaker">Speaker/Evaluator</option>
                                        </select>
                                        <span className="text-danger">
                                            { errors.type_of_participant?.message }
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Venue of the activity 
                                    <span className="text-danger"> *</span>
                                </Label>
                                <input
                                    className={errors.venue_of_the_activity ? "is-invalid form-control" : "form-control" }
                                    type="text"
                                    name="venue_of_the_activity"
                                    id="venue_of_the_activity"
                                    defaultValue={venueOfActivity}
                                    {...register("venue_of_the_activity")}
                                />
                                <span className="text-danger">
                                    { errors.venue_of_the_activity?.message }
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Scope of the activity
                                            <span className="text-danger"> *</span>
                                        </Label>
                                        <select 
                                            className={errors.scope_of_the_activity ? "is-invalid form-control" : "form-control" }
                                            name="scope_of_the_activity" 
                                            id="scope_of_the_activity"
                                            defaultValue={scopeOfActivity}
                                            {...register("scope_of_the_activity")}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="national">National</option>
                                            <option value="local">Local</option>
                                            <option value="regional">Regional</option>
                                        </select>
                                        <span className="text-danger">
                                            { errors.scope_of_the_activity?.message }
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
                            Seminars Attended
                        </h3>
                        <div className="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0 p-0">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-muted active"
                                        aria-current="page"
                                    >
                                        <a href="/utilization">Seminar</a>
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

            <Container fluid>
                <Card>
                    <CardBody>
                        <ReactDatatable
                            className="table font-14"
                            tHeadClassName="thead-dark"
                            config={dtConfig}
                            records={getSeminarByUser()}
                            columns={dtColumns}
                            extraButtons={dtExtraButtons}
                        />
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default Seminar;
