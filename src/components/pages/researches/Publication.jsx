import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { getProposalCompleted } from "../../../redux/actions/completed_action";

import {
    getPublication,
    createPublication,
    updatePublication,
    deletePublication,
} from "../../../redux/actions/publication_action";

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
    RD: "rd", //? research director
    RH: "rh", //? research head
    CD: "cd", //? campus director
};

const formSchema = yup.object().shape({
    research_id: yup.string().required("Title of research field is required."),
    title_of_publication: yup
        .string()
        .required("Title of publication field is required."),
    date_of_publication: yup
        .mixed()
        .required("Date of publication field is required.")
        .test("date_of_utilization", "Date of publication field is requred", (value) => {
            return value !== "";
        }),
    title_of_journal: yup
        .string()
        .required("Title of journal field is required."),
    type_of_journal: yup
        .string()
        .required("Type of journal field is required."),
    issn_isbn_no: yup.string().required("ISSN / ISBN field is required."),
    volume_issue_no: yup.string().required("Volume / Issue number field is required."),
});

const Publication = ({ currentUser }) => {
    const completed = useSelector((state) => state.completed.completed);
    const publication = useSelector((state) => state.publication.publications);

    const dispatch = useDispatch(); // this is to dispatch actions

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(formSchema),
    });

    const [modal, setModal] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    const [publicationId, setPublicationId] = useState(null);
    const [researchId, setResearchId] = useState(null);
    const [titleOfResearch, setTitleOfResearch] = useState("");
    const [titleOfPublication, setTitleOfPublication] = useState("");
    const [dateOfPublication, setDateOfPublication] = useState("");
    const [titleOfJournal, setTitleOfJournal] = useState("");
    const [typeOfJournal, setTypeOfJournal] = useState("");
    const [issnIsbn, setIssnIsbn] = useState("");
    const [volumeNo, setVolumeNo] = useState("");
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
            // width: 125  ,
            cell: (publication) => {
                if (publication.is_completed === "N") {
                    return (
                        <React.Fragment>
                            <Button
                                size="sm"
                                className="btn btn-secondary"
                                onClick={() => showEditForm(publication)}
                            >
                                <span><i className="fas fa-pencil-alt"></i> Edit</span>
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                size="sm"
                                className="btn btn-danger"
                                onClick={() => onClickDelete(publication._id)}
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
            key: "title_of_publication",
            text: "Title of Publication",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "date_of_publication",
            text: "Date of Publication",
            className: "",
            align: "left",
            sortable: true,
            cell: (publication) => {
                return (
                    <React.Fragment>
                        {moment(publication.date_of_publication).format("LL")}
                    </React.Fragment>
                );
            },
        },
        {
            key: "",
            text: "",
            align: "left",
            sortable: true,
            cell: (publication) => {
                if (
                    currentUser.user_type === USER_TYPE.RH ||
                    currentUser.user_type === USER_TYPE.ADMIN
                ) {
                    if (
                        publication.is_completed === "N" &&
                        currentUser.user_type === USER_TYPE.RH
                    ) {
                        return (
                            <React.Fragment>
                                <Button
                                    size="sm"
                                    className="btn btn-sm"
                                    onClick={() => {
                                        onSubmitUpdateRemarks(publication._id);
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
        // dispatch(getProposalCompletedApproved());
        dispatch(getProposalCompleted());
        dispatch(getPublication());
    }, [dispatch]);

    const clearForm = () => {
        setPublicationId(null);
        setResearchId(null);
        setTitleOfResearch("");
        setTitleOfPublication("");
        setDateOfPublication("");
        setTitleOfJournal("");
        setTypeOfJournal("");
        setIssnIsbn("");
        setVolumeNo("");
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
            research_id,
            title_of_research,
            // title_of_publication,
            date_of_publication,
            title_of_journal,
            type_of_journal,
            issn_isbn,
            volume_no,
        } = data;

        toggleModal();

        setPublicationId(_id);
        setResearchId(research_id);
        setTitleOfResearch(title_of_research);
        // setTitleOfPublication(title_of_publication);
        setDateOfPublication(date_of_publication);
        setTitleOfJournal(title_of_journal);
        setTypeOfJournal(type_of_journal);
        setIssnIsbn(issn_isbn);
        setVolumeNo(volume_no);
    };

    const onSubmit = (data) => {
        let selectedResearch = document.getElementById("research_id");
        let nameOfTheResearch = selectedResearch.options[selectedResearch.selectedIndex].text;

        const details = {
            publication_id: data.publication_id,
            research_id: data.research_id,
            title_of_research: nameOfTheResearch,
            // title_of_publication: data.title_of_publication,
            date_of_publication: data.date_of_publication,
            title_of_journal: data.title_of_journal,
            type_of_journal: data.type_of_journal,
            issn_isbn: data.issn_isbn_no,
            volume_no: data.volume_issue_no,
            created_at: new Date(),
            created_by: updatedBy,
        };

        if (!data.publication_id) {
            dispatch(createPublication(details));
        } else {
            dispatch(updatePublication(details));
        }

        toggleModal();
    }

    // const onSubmitForm = (e) => {
    //     e.preventDefault();

    //     const data = {
    //         publication_id: publicationId,
    //         research_id: researchId,
    //         title_of_research: titleOfResearch,
    //         title_of_publication: titleOfPublication,
    //         date_of_publication: dateOfPublication,
    //         title_of_journal: titleOfJournal,
    //         type_of_journal: typeOfJournal,
    //         issn_isbn: issnIsbn,
    //         volume_no: volumeNo,
    //         created_by: updatedBy,
    //     };

    //     if (!publicationId) {
    //         dispatch(createPublication(data));
    //     } else {
    //         dispatch(updatePublication(data));
    //     }

    //     toggleModal();
    // };

    const onClickDelete = (publication_id) => {
        const isDelete = window.confirm(
            "Are you sure you want to delete this data?"
        );

        if (isDelete) dispatch(deletePublication(publication_id));
    };

    const onSubmitUpdateRemarks = (publication_id) => {
        const data = {
            publication_id,
            is_completed: "Y",
            updated_by: updatedBy,
            updated_at: new Date(),
        };

        const isSubmit = window.confirm("Are you sure you want to update?");

        if (isSubmit) {
            dispatch(updatePublication(data));
        }
    };

    const getResearchesOptions = () => {
        const currentUserId = currentUser.id;

        if (typeof completed !== undefined) {
            const list_of_research = [];

            for (let i = 0; i < completed.length; i++) {
                let { user_id } = completed[i].created_by;
                // display only the researches of the current user
                if (
                    (completed[i].is_completed === "Y" ||
                        completed[i].is_completed === "N") &&
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

    const getPublications = () => {
        const currentUserId = currentUser.id;
        const user = [];

        for (let i = 0; i < publication.length; i++) {
            // Destructure some of the details
            let { user_id } = publication[i].created_by;

            if (user_id === currentUserId && (publication[i].is_completed === "N" || publication[i].is_completed === "Y")) {
                user.push({
                    _id: publication[i]._id,
                    research_id: publication[i].research_id,
                    title_of_research: publication[i].title_of_research,
                    title_of_publication: publication[i].title_of_publication,
                    date_of_publication: publication[i].date_of_publication,
                    title_of_journal: publication[i].title_of_publication,
                    type_of_journal: publication[i].type_of_journal,
                    issn_isbn: publication[i].issn_isbn,
                    volume_no: publication[i].volume_no,
                    is_completed: publication[i].is_completed,
                });
            }
        }

        return user;
    }

    const getPendingPublications = () => {
        const currentUserId = currentUser.id;

        if (typeof publication !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const pending = [];

                for (let i = 0; i < publication.length; i++) {
                    if (publication[i].is_completed === "N") {
                        pending.push({
                            _id: publication[i]._id,
                            research_id: publication[i].research_id,
                            title_of_research: publication[i].title_of_research,
                            title_of_publication:
                                publication[i].title_of_publication,
                            date_of_publication:
                                publication[i].date_of_publication,
                            title_of_journal:
                                publication[i].title_of_publication,
                            type_of_journal: publication[i].type_of_journal,
                            issn_isbn: publication[i].issn_isbn,
                            volume_no: publication[i].volume_no,
                            is_completed: publication[i].is_completed,
                        });
                    }
                }

                return pending;
            }
            // Current logged in user is USER.
            else {
                const pending = [];

                for (let i = 0; i < publication.length; i++) {
                    // Destructure some of the details
                    let { user_id } = publication[i].created_by;

                    if (
                        publication[i].is_completed === "N" &&
                        user_id === currentUserId
                    ) {
                        pending.push({
                            _id: publication[i]._id,
                            research_id: publication[i].research_id,
                            title_of_research: publication[i].title_of_research,
                            title_of_publication:
                                publication[i].title_of_publication,
                            date_of_publication:
                                publication[i].date_of_publication,
                            title_of_journal:
                                publication[i].title_of_publication,
                            type_of_journal: publication[i].type_of_journal,
                            issn_isbn: publication[i].issn_isbn,
                            volume_no: publication[i].volume_no,
                            is_completed: publication[i].is_completed,
                        });
                    }
                }

                return pending;
            }
        }
    };

    const getCompletedPublications = () => {
        const currentUserId = currentUser.id;

        if (typeof completed !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const completed = [];

                for (let i = 0; i < publication.length; i++) {
                    if (publication[i].is_completed === "Y") {
                        completed.push({
                            _id: publication[i]._id,
                            research_id: publication[i].research_id,
                            title_of_research: publication[i].title_of_research,
                            title_of_publication:
                                publication[i].title_of_publication,
                            date_of_publication:
                                publication[i].date_of_publication,
                            title_of_journal:
                                publication[i].title_of_publication,
                            type_of_journal: publication[i].type_of_journal,
                            issn_isbn: publication[i].issn_isbn,
                            volume_no: publication[i].volume_no,
                            is_completed: publication[i].is_completed,
                        });
                    }
                }

                return completed;
            }
            // Current logged in user is USER.
            else {
                const completed = [];

                for (let i = 0; i < publication.length; i++) {
                    // Destructure some of the details
                    let { user_id } = publication[i].created_by;

                    if (
                        publication[i].is_completed === "Y" &&
                        user_id === currentUserId
                    ) {
                        completed.push({
                            _id: publication[i]._id,
                            research_id: publication[i].research_id,
                            title_of_research: publication[i].title_of_research,
                            title_of_publication:
                                publication[i].title_of_publication,
                            date_of_publication:
                                publication[i].date_of_publication,
                            title_of_journal:
                                publication[i].title_of_publication,
                            type_of_journal: publication[i].type_of_journal,
                            issn_isbn: publication[i].issn_isbn,
                            volume_no: publication[i].volume_no,
                            is_completed: publication[i].is_completed,
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
                className="modal-dialog font-14"
            >
                <ModalHeader
                    className="bg-primary text-light"
                    toggle={toggleModal}
                >
                    {!publicationId ? "Add Publication" : "Update Publication"}
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
                                    name="publication_id"
                                    id="publication_id"
                                    // value={publicationId}
                                    // onChange={(e) => {
                                    //     setPublicationId(e.target.value);
                                    // }}
                                    defaultValue={publicationId}
                                    {...register("publication_id")}
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
                                    {errors.research_id?.message}
                                </span>
                            </FormGroup>
                            {/* <FormGroup>
                                <Label>
                                    Title of Publication{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <input
                                    className={errors.title_of_publication ? "is-invalid form-control" : "form-control" }
                                    type="text"
                                    name="title_of_publication"
                                    id="title_of_publication"
                                    defaultValue={titleOfPublication}
                                    {...register("title_of_publication")}
                                />
                                <span className="text-danger">
                                    {errors.title_of_publication?.message}
                                </span>
                            </FormGroup> */}
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Date of Publication{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <DateTimePickerComponent
                                            format="yyyy-MM-dd"
                                            id="datetimepicker"
                                            value={dateOfPublication}
                                            // onChange={(e) => {
                                            //     setDateOfPublication(
                                            //         e.target.value
                                            //     );
                                            // }}
                                            {...register("date_of_publication")}
                                        />
                                        <span className="text-danger">
                                            {errors.date_of_publication?.message}
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Title of Journal{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <input
                                    className={errors.title_of_journal ? "is-invalid form-control" : "form-control" }
                                    type="text"
                                    name="title_of_journal"
                                    id="title_of_journal"
                                    // value={titleOfJournal}
                                    // onChange={(e) => {
                                    //     setTitleOfJournal(e.target.value);
                                    // }}
                                    defaultValue={titleOfJournal}
                                    {...register("title_of_journal")}
                                />
                                <span className="text-danger">
                                    {errors.title_of_journal?.message}
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Type of Journal{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className={errors.type_of_journal ? "is-invalid form-control" : "form-control" }
                                            type="select"
                                            name="type_of_journal"
                                            id="type_of_journal"
                                            // value={typeOfJournal}
                                            // onChange={(e) => {
                                            //     setTypeOfJournal(
                                            //         e.target.value
                                            //     );
                                            // }}
                                            defaultValue={typeOfJournal}
                                            {...register("type_of_journal")}
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
                                            {errors.type_of_journal?.message}
                                        </span>
                                    </Col>
                                    <Col md="6">
                                        <Label>
                                            ISSN / ISBN{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className={errors.issn_isbn_no ? "is-invalid form-control" : "form-control" }
                                            type="text"
                                            name="issn_isbn_no"
                                            id="issn_isbn_no"
                                            // value={issnIsbn}
                                            // onChange={(e) => {
                                            //     setIssnIsbn(e.target.value);
                                            // }}
                                            defaultValue={issnIsbn}
                                            {...register("issn_isbn_no")}
                                        />
                                        <span className="text-danger">
                                            {errors.issn_isbn_no?.message}
                                        </span>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            Volume / Issue No.{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className={errors.volume_issue_no ? "is-invalid form-control" : "form-control" }
                                            type="text"
                                            name="volume_issue_no"
                                            id="volume_issue_no"
                                            // value={volumeNo}
                                            // onChange={(e) => {
                                            //     setVolumeNo(e.target.value);
                                            // }}
                                            defaultValue={volumeNo}
                                            {...register("volume_issue_no")}
                                        />
                                        <span className="text-danger">
                                            {errors.volume_issue_no?.message}
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
                            Publication
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
                                        <a href="/publication">Publication</a>
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
                                        records={getPendingPublications()}
                                        columns={dtColumns}
                                        extraButtons={dtExtraButtons}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ReactDatatable
                                        className="table font-14"
                                        tHeadClassName="thead-dark"
                                        config={dtConfig}
                                        records={getCompletedPublications()}
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
                                records={getPublications()}
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

export default Publication;
