import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
    getPresentation,
    createPresentation,
    updatePresentation,
    deletePresentation,
} from "../../../redux/actions/presentation_action";

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

import { Link } from "react-router-dom";
import { FaCheck, FaLessThanEqual } from "react-icons/fa";
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
    research_id: yup.string().required("Title of research field is required."),
    presentor: yup.string().required("Presentor field is required."),
    date_presented: yup.date().required("Date presented field is required."),
    title_of_forum: yup.string().required("Title of forum field is required."),
    type_of_forum: yup.string().required("Type of forum field is required."),
    venue_of_forum: yup.string().required("Venue of forum field is required."),
})

const Presentation = ({ currentUser }) => {
    const presentation = useSelector((state) => state.presentation.presentations); // This is to populate department data
    const completed = useSelector((state) => state.completed.completed); // This is to populate department data

    const dispatch = useDispatch(); // this is to dispatch actions

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(formSchema)
    });

    const [modal, setModal] = useState(false);
    const [modalPrompt, setModalPrompt] = useState(false);
    const [modalType, setModaType] = useState(null);
    const [activeTab, setActiveTab] = useState("1");

    const [presentationId, setPresentationId] = useState(null);
    const [researchId, setResearchId] = useState(null);
    const [titleOfResearch, setTitleOfResearch] = useState("");
    const [presentor, setPresentor] = useState("");
    const [datePresented, setDatePresented] = useState(new Date());
    const [typeOfForum, setTypeOfForum] = useState("");
    const [venueOfForum, setVenueOfForum] = useState("");
    const [titleOfForum, setTitleOfForum] = useState("");
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
            key: "_id",
            className: "text-center",
            align: "left",
            sortable: true,
            // width: 100,
            cell: (presentation) => {
                if (presentation.is_completed === "N") {
                    return (
                        <React.Fragment>
                            <Button
                                size="sm"
                                className="btn btn-secondary"
                                onClick={() => showEditForm(presentation)}
                            >
                                <span><i className="fas fa-pencil-alt"></i> Edit</span>
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                size="sm"
                                className="btn btn-danger"
                                onClick={() => onClickDelete(presentation._id)}
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
            align: "left",
            sortable: true,
        },
        {
            key: "presentor",
            text: "Presentor",
            align: "left",
            sortable: true,
        },
        {
            key: "date_presented",
            text: "Date Presented",
            align: "left",
            sortable: true,
            cell: (presentation) => {
                return (
                    <React.Fragment>
                        {moment(presentation.date_presented).format("LL")}
                    </React.Fragment>
                );
            },
        },
        {
            key: "",
            text: "",
            align: "left",
            sortable: true,
            cell: (presentation) => {
                if (
                    currentUser.user_type === USER_TYPE.RH ||
                    currentUser.user_type === USER_TYPE.ADMIN
                ) {
                    if (
                        presentation.is_completed === "N" &&
                        currentUser.user_type === USER_TYPE.RH
                    ) {
                        return (
                            <React.Fragment>
                                <Button
                                    size="sm"
                                    className="btn btn-sm"
                                    onClick={() => {
                                        onSubmitUpdateRemarks(presentation._id);
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
                </span>,
            ],
            onClick: () => {
                setModal(!modal);
            },
        },
    ];

    // End of Datatables Config

    useEffect(() => {
        dispatch(getPresentation());
        dispatch(getProposalCompleted());
        // dispatch(getProposalCompletedApproved());
        // dispatch(getProposalCompletedApprovedByResearchId(researchId));
    }, [dispatch]);

    const clearForm = () => {
        setPresentationId(null);
        setResearchId(null);
        setTitleOfResearch("");
        setPresentor("");
        setTypeOfForum("");
        setVenueOfForum("");
        setTitleOfForum("");
    };

    const toggleModal = () => {
        setModal(!modal);
        reset({})
        // clearForm();
    };

    const toggleTab = (tabId) => {
        if (activeTab !== tabId) setActiveTab(tabId);

        clearForm();
    };

    const showEditForm = (data) => {
        const {
            _id,
            research_id,
            title_of_research,
            presentor,
            date_presented,
            type_of_forum,
            venue_of_forum,
            title_of_forum,
        } = data;

        toggleModal();

        setPresentationId(_id);
        setResearchId(research_id);
        setTitleOfResearch(title_of_research);
        setPresentor(presentor);
        setDatePresented(moment(date_presented).format("L"));
        setTypeOfForum(type_of_forum);
        setVenueOfForum(venue_of_forum);
        setTitleOfForum(title_of_forum);
    };

    const onSubmit = (data) => {
        let selectedResearch = document.getElementById("research_id");
        let titleOfTheResearch = selectedResearch.options[selectedResearch.selectedIndex].text;

        const details = {
            presentation_id: data.presentation_id,
            research_id: data.research_id,
            title_of_research: titleOfTheResearch,
            presentor: data.presentor,
            date_presented: data.date_presented,
            type_of_forum: data.type_of_forum,
            venue_of_forum: data.venue_of_forum,
            title_of_forum: data.title_of_forum,
            created_at: new Date(),
            created_by: updatedBy,
        };

        if (!data.presentation_id) {
            dispatch(createPresentation(details));
        } else {
            dispatch(updatePresentation(details));
        }

        toggleModal();
    }

    const onSubmitForm = (e) => {
        e.preventDefault();

        const data = {
            presentation_id: presentationId,
            research_id: researchId,
            title_of_research: titleOfResearch,
            presentor: presentor,
            date_presented: datePresented,
            type_of_forum: typeOfForum,
            venue_of_forum: venueOfForum,
            title_of_forum: titleOfForum,
            created_at: new Date(),
            created_by: updatedBy,
        };

        if (!presentationId) {
            dispatch(createPresentation(data));
        } else {
            dispatch(updatePresentation(data));
        }

        toggleModal();
    };

    const onClickDelete = (presentation_id) => {
        const isDelete = window.confirm(
            "Are you sure you want to delete this data?"
        );

        if (isDelete) dispatch(deletePresentation(presentation_id));
    };

    const getResearchesOptions = () => {
        const currentUserId = currentUser.id;

        if (completed !== undefined) {
            const list_of_research = [];

            for (let i = 0; i < completed.length; i++) {
                let { user_id } = completed[i].created_by;

                if (completed[i].is_completed === "Y" && user_id === currentUserId) {
                    list_of_research.push(
                        <option 
                            key={completed[i]._id} 
                            value={completed[i]._id}
                            >
                            {completed[i].title_of_research}
                        </option>
                    );
                }
            }

            return list_of_research;
        }
    };

    const getPresentorsOptions = (research_id) => {
        const list_of_presentor = [];

        if (research_id !== "") {
            for (let i = 0; i < completed.length; i++) {
                if (completed[i]._id === research_id) {
                    for (let j = 0; j < completed[i].author.length; j++) {
                        list_of_presentor.push(
                            <option
                                key={completed[i].author[j].value}
                                value={completed[i].author[j].label}
                            >
                                {completed[i].author[j].label}
                            </option>
                        );
                    }
                }
            }
        }

        return list_of_presentor;
    };

    const getPresentations = () => {
        const currentUserId = currentUser.id;
        const user = [];

        for (let i = 0; i < presentation.length; i++) {
            // Destructure some of the details
            let { user_id } = presentation[i].created_by;

            if (user_id === currentUserId && (presentation[i].is_completed === "N" || presentation[i].is_completed === "Y")) {
                user.push({
                    _id: presentation[i]._id,
                    research_id: presentation[i].research_id,
                    title_of_research: presentation[i].title_of_research,
                    presentor: presentation[i].presentor,
                    date_presented: presentation[i].date_presented,
                    title_of_forum: presentation[i].title_of_forum,
                    type_of_forum: presentation[i].type_of_forum,
                    venue_of_forum: presentation[i].venue_of_forum,
                    is_completed: presentation[i].is_completed,
                });
            }
        }

        return user;
    }

    const getPendingPresentations = () => {
        const currentUserId = currentUser.id;

        if (typeof presentation !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const pending = [];

                for (let i = 0; i < presentation.length; i++) {
                    if (presentation[i].is_completed === "N") {
                        pending.push({
                            _id: presentation[i]._id,
                            research_id: presentation[i].research_id,
                            title_of_research: presentation[i].title_of_research,
                            presentor: presentation[i].presentor,
                            date_presented: presentation[i].date_presented,
                            title_of_forum: presentation[i].title_of_forum,
                            type_of_forum: presentation[i].type_of_forum,
                            venue_of_forum: presentation[i].venue_of_forum,
                            is_completed: presentation[i].is_completed,
                        });
                    }
                }

                return pending;
            }
            // Current logged in user is USER.
            else {
                const pending = [];

                for (let i = 0; i < presentation.length; i++) {
                    // Destructure some of the details
                    let { user_id } = presentation[i].created_by;

                    if (
                        presentation[i].is_completed === "N" &&
                        user_id === currentUserId
                    ) {
                        pending.push({
                            _id: presentation[i]._id,
                            research_id: presentation[i].research_id,
                            title_of_research: presentation[i].title_of_research,
                            presentor: presentation[i].presentor,
                            date_presented: presentation[i].date_presented,
                            title_of_forum: presentation[i].title_of_forum,
                            type_of_forum: presentation[i].type_of_forum,
                            venue_of_forum: presentation[i].venue_of_forum,
                            is_completed: presentation[i].is_completed,
                        });
                    }
                }

                return pending;
            }
        }
    };

    const getCompletedPresentations = () => {
        const currentUserId = currentUser.id;

        if (typeof presentation !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const completed = [];

                for (let i = 0; i < presentation.length; i++) {
                    if (presentation[i].is_completed === "Y") {
                        completed.push({
                            _id: presentation[i]._id,
                            title_of_research: presentation[i].title_of_research,
                            presentor: presentation[i].presentor,
                            date_presented: presentation[i].date_presented,
                            title_of_forum: presentation[i].title_of_forum,
                            type_of_forum: presentation[i].type_of_forum,
                            venue_of_forum: presentation[i].venue_of_forum,
                        });
                    }
                }

                return completed;
            }
            // Current logged in user is USER.
            else {
                const completed = [];

                for (let i = 0; i < presentation.length; i++) {
                    // Destructure some of the details
                    let { user_id } = presentation[i].created_by;

                    if (
                        presentation[i].is_completed === "Y" &&
                        user_id === currentUserId
                    ) {
                        completed.push({
                            _id: presentation[i]._id,
                            title_of_research:
                                presentation[i].title_of_research,
                            presentor: presentation[i].presentor,
                            date_presented: presentation[i].date_presented,
                            title_of_forum: presentation[i].title_of_forum,
                            type_of_forum: presentation[i].type_of_forum,
                            venue_of_forum: presentation[i].venue_of_forum,
                        });
                    }
                }

                return completed;
            }
        }
    };

    const onSubmitUpdateRemarks = (presentation_id) => {
        const data = {
            presentation_id,
            is_completed: "Y",
            updated_at: new Date(),
        };

        const isSubmit = window.confirm("Are you sure you want to update?");

        if (isSubmit) {
            dispatch(updatePresentation(data));
        }
    };

    return (
        <React.Fragment>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                pauseOnHover={true}
            />

            <Modal
                isOpen={modal}
                toggle={toggleModal}
                size="lg"
                className="modal-dialog font-14"
            >
                <ModalHeader
                    className="bg-primary text-light"
                    toggle={toggleModal}
                >
                    {!presentationId
                        ? "Add Presentation"
                        : "Update Presentation"}
                </ModalHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <input
                                    type="hidden"
                                    name="presentation_id"
                                    id="presentation_id"
                                    // value={presentationId}
                                    // onChange={(e) => {
                                    //     setPresentationId(e.target.value);
                                    // }}
                                    defaultValue={presentationId}
                                    {...register("presentation_id")}
                                />
                                <Label for="">
                                    Title of Research{" "}
                                    <span className="text-danger">*</span>
                                </Label>
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
                                    // required
                                    defaultValue={researchId}
                                    {...register("research_id")}
                                >
                                    <option value="">Choose...</option>
                                    {getResearchesOptions()}
                                </select>
                                <span className="text-danger">
                                    {errors.research_id?.message}
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Presentor{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <select
                                    className={errors.presentor ? "is-invalid form-control" : "form-control" }
                                    type="select"
                                    name="presentor"
                                    id="presentor"
                                    // value={presentor || ""}
                                    // onChange={(e) =>
                                    //     setPresentor(e.target.value)
                                    // }
                                    // required
                                    defaultValue={presentor}
                                    {...register("presentor")}
                                >
                                    <option value="">Choose...</option>
                                    {getPresentorsOptions(watch("research_id"))}
                                </select>
                                <span className="text-danger">
                                    {errors.presentor?.message}
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>Date Presented <span className="text-danger">*</span></Label>
                                        <DateTimePickerComponent
                                            format="yyyy-MM-dd"
                                            id="datetimepicker"
                                            name="date_presented"
                                            // value={datePresented}
                                            // onChange={(e) => {
                                            //     setDatePresented(
                                            //         e.target.value
                                            //     );
                                            // }}
                                            // required
                                            value={datePresented}
                                            {...register("date_presented")}
                                        />
                                        <span className="text-danger">
                                            {errors.date_presented?.message}
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label>Title of Forum <span className="text-danger">*</span></Label>
                                <input
                                    className={errors.title_of_forum ? "is-invalid form-control" : "form-control" }
                                    type="text"
                                    name="title_of_forum"
                                    id="title_of_forum"
                                    // value={titleOfForum}
                                    // onChange={(e) => {
                                    //     setTitleOfForum(e.target.value);
                                    // }}
                                    // required
                                    defaultValue={titleOfForum}
                                    {...register("title_of_forum")}
                                />
                                <span className="text-danger">
                                    {errors.title_of_forum?.message}
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>Type of Forum <span className="text-danger">*</span></Label>
                                        <select
                                            className={errors.type_of_forum ? "is-invalid form-control" : "form-control" }
                                            type="select"
                                            name="type_of_forum"
                                            id="type_of_forum"
                                            // value={typeOfForum}
                                            // onChange={(e) => {
                                            //     setTypeOfForum(e.target.value);
                                            // }}
                                            // required
                                            defaultValue={typeOfForum}
                                            {...register("type_of_forum")}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="local">Local</option>
                                            <option value="national">
                                                National
                                            </option>
                                            <option value="international">
                                                International
                                            </option>
                                        </select>
                                        <span className="text-danger">
                                            {errors.type_of_forum?.message}
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label>Venue of Forum <span className="text-danger">*</span></Label>
                                <input
                                    className={errors.venue_of_forum ? "is-invalid form-control" : "form-control" }
                                    type="text"
                                    name="venue_of_forum"
                                    id="venue_of_forum"
                                    // value={venueOfForum}
                                    // onChange={(e) => {
                                    //     setVenueOfForum(e.target.value);
                                    // }}
                                    // required
                                    defaultValue={venueOfForum}
                                    {...register("venue_of_forum")}
                                />
                                <span className="text-danger">
                                    {errors.venue_of_forum?.message}
                                </span>
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
                            Presentation
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
                                        <a href="/completed">Presentation</a>
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

            { currentUser.user_type === "rh" || currentUser.user_type === "admin" ? (
            <>
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
                                        tHeadClassName="thead-dark font-weight-medium"
                                        config={dtConfig}
                                        records={getPendingPresentations()}
                                        columns={dtColumns}
                                        extraButtons={dtExtraButtons}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ReactDatatable
                                        className="table font-14"
                                        tHeadClassName="thead-dark font-weight-medium"
                                        config={dtConfig}
                                        records={getCompletedPresentations()}
                                        columns={dtColumns}
                                        extraButtons={dtExtraButtons}
                                    />
                                </TabPane>
                            </TabContent>
                        </CardBody>
                    </Card>
                </Container>
            </>) : (
            <>
                <Container fluid>
                    <Card>
                        <CardBody>
                            <ReactDatatable
                                className="table font-14"
                                tHeadClassName="thead-dark font-weight-medium"
                                config={dtConfig}
                                records={getPresentations()}
                                columns={dtColumns}
                                extraButtons={dtExtraButtons}
                            />
                        </CardBody>
                    </Card> 
                </Container>
            </>
            )}
        </React.Fragment>
    );
};

export default Presentation;
