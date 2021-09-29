import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
    getProposalCompleted,
    createProposalCompleted,
    updateProposalCompleted,
    // updateCompleted,
    updateProposalCompletedApprovedRemarks,
} from "../../../redux/actions/completed_action";

import { getProposal } from "../../../redux/actions/proposal_action";
import { getAccount } from "../../../redux/actions/account_action";

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
    Alert,
    Progress,
    Spinner,
} from "reactstrap";

import { Link } from "react-router-dom";
import ReactDatatable from "@ashvin27/react-datatable";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import moment from "moment";
// import { updateCompleted } from "../../../../../server/controllers/completed";

const animatedComponents = makeAnimated();

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
    abstract: yup.string().required("Abstract field is required."),
    date_started: yup.string().required("Date started field is required."),
    date_completed: yup.string().required("Date completed field is required."),
    duration: yup.string().required("Duration field is required."),
    
    // research_id_external: yup.string().required("Title of research field is required."),
    // title_of_research_external: yup.string().required("Title of research field is required"),
    // type_of_research_external: yup.string().required("Type of research field is required"),
    // source_of_funding_external: yup.string().required("Source of funding field is required"),
    // total_funds_external: yup.string().required("Total funds field is required."),
    // abstract_external: yup.string().required("Abstract field is required."),
    // date_started_external: yup.string().required("Date started field is required."),
    // date_completed_external: yup.string().required("Date completed field is required."),
    // duration_external: yup.string().required("Duration field is required."),
    // research_file: yup
    //         .mixed()
    //         .test("name", "Please provide a PDF file.", (value) => {
    //             return value[0] && value[0].name !== "";
    //         })
    //         .test("type", "Incorrect file type. ", (value) => {
    //             return value[0] && value[0].type === "application/pdf"
    //         })
})

const Completed = ({ currentUser }) => {
    const faculty = useSelector((state) => state.account.accounts); // This is to populate proposal data
    const proposal_approved = useSelector((state) => state.proposal.proposals);
    const completed = useSelector((state) => state.completed.completed);

    const dispatch = useDispatch(); // this is to dispatch actions

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(formSchema)
    });

    const [modal, setModal] = useState(false);
    const [modalExternal, setModalExternal] = useState(false);
    const [modalPrompt, setModalPrompt] = useState(false);
    const [modalType, setModalType] = useState(null);
    // const [modalPdf, setModalPdf] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    const [researchId, setResearchId] = useState(null);
    const [titleOfResearch, setTitleOfResearch] = useState("");
    const [typeOfResearch, setTypeOfResearch] = useState("");
    const [author, setAuthor] = useState("");
    const [sourceOfFunding, setSourceOfFunding] = useState("");
    const [nameOfAgency, setNameOfAgency] = useState("");
    const [dateOfCompletion, setDateOfCompletion] = useState(new Date());
    const [abstract, setAbstract] = useState("");
    const [dateStarted, setDateStarted] = useState("");
    const [dateCompleted, setDateCompleted] = useState("");
    const [duration, setDuration] = useState("");
    // const [file, setFile] = useState("");
    // const [fileName, setFileName] = useState("");
    // const [filePath, setfilePath] = useState("");
    const [totalFunds, setTotalFunds] = useState("");
    const [remarks, setRemarks] = useState("pending");
    const [status, setStatus] = useState("completed");
    const [isCompleted, setIsCompleted] = useState("N");
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
            cell: (completed) => {
                if(completed.is_completed === 'N' && currentUser.user_type === USER_TYPE.RH) {
                    return (
                        <React.Fragment>
                            <Button
                                size="sm"
                                className="btn btn-danger"
                                onClick={() => {
                                    showModalPrompt(completed, MODAL_TYPE.DEL);
                                }}
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
            className: "font-14",
            align: "left",
            sortable: true,
        },
        {
            key: "abstract",
            text: "Abstract",
            className: "font-14",
            align: "left",
            sortable: true,
        },
        {
            key: "date_started",
            text: "Started Date",
            className: "font-14",
            align: "left",
            sortable: true,
            cell: (completed) => {
                return (
                    <div>
                        { moment(completed.date_started).format("LL") }
                    </div>
                )
            }
        },
        {
            key: "date_completed",
            text: "Completed Date",
            className: "font-14",
            align: "left",
            sortable: true,
            cell: (completed) => {
                return (
                    <div>
                        { moment(completed.date_completed).format("LL") }
                    </div>
                )
            }
        },
        {
            key: "duration",
            text: "Duration",
            className: "font-14",
            align: "left",
            sortable: true,
        },
        {
            key: "is_completed",
            text: "Status",
            className: "font-14",
            align: "left",
            sortable: true,
            cell: (completed) => {
                if(completed.is_completed === "Y") {
                    return (
                        <div className="badge badge-success">Completed</div>
                    )
                } else {
                    return (
                        <span className="badge badge-secondary">Pending</span>
                    )
                }
            }
        },
        {
            key: "action",
            text: "",
            className: "text-center",
            align: "left",
            cell: (completed) => {
                if (currentUser.user_type === USER_TYPE.RH || currentUser.user_type === USER_TYPE.ADMIN) {
                    if (completed.is_completed === "N" && currentUser.user_type === USER_TYPE.RH) {
                        return (
                            <React.Fragment key={completed._id}>
                                <Link
                                        className="btn btn-secondary"
                                        size="sm"
                                        to="#"
                                        onClick={() =>
                                            showModalPrompt(
                                                completed,
                                                MODAL_TYPE.UPD
                                            )
                                        }
                                    >Completed
                                    </Link>
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <React.Fragment key={completed._id}>
                                <div>File here!</div>
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
                        className="fa fa-file"
                        aria-hidden="true"
                    ></i>
                    {/* &nbsp; Funded */}
                </span>,
            ],
            onClick: () => {
                setModal(!modal);
            },
        },
        {
            className: "btn btn-primary",
            title: "Create New",
            children: [
                <span>
                    <i
                        className="fa fa-share"
                        aria-hidden="true"
                    ></i>
                    {/* &nbsp; Funded */}
                </span>,
            ],
            onClick: () => {
                setModalExternal(!modalExternal);
            },
        },
    ];

    // End of Datatables Config

    useEffect(() => {
        dispatch(getProposal());
        dispatch(getProposalCompleted());
        dispatch(getAccount());
    }, [dispatch]);

    const clearForm = () => {
        setResearchId("");
        setTitleOfResearch("");
        setTypeOfResearch("");
        setAuthor("");
        setSourceOfFunding("");
        setNameOfAgency("");
        setDateStarted("");
        setDateCompleted("");
        setDuration("");
    };

    const toggleModal = (modal_type) => {
        if (modal_type === MODAL_TYPE.CRT) {
            setModal(!modal);
            setModalType(MODAL_TYPE.CRT);
            // clearForm();
            reset({})
        } else if (modal_type === MODAL_TYPE.UPD) {
            setModalPrompt(!modalPrompt);
            setModalType(MODAL_TYPE.UPD);
        } else {
            setModalPrompt(!modalPrompt);
            setModalType(MODAL_TYPE.DEL);
        }
    };

    const toggleTab = (tabId) => {
        if (activeTab !== tabId) setActiveTab(tabId);
    };

    const onSubmit = (data) => {
        // if(data.research_id) {
        //     const formData = new FormData();
        //     const details = {
        //         research_id: data.research_id,
        //         abstract: data.abstract,
        //         file_name: data.research_file[0].name,
        //         is_completed: isCompleted,
        //         created_at: new Date(),
        //         created_by: updatedBy
        //     }

        //     formData.append("file", data.research_file[0]);
        //     formData.append("data", JSON.stringify(details));

        //     dispatch(updateProposalCompleted(formData));
        // }

        if(data.research_id) {
            const details = {
                research_id: data.research_id,
                abstract: data.abstract,
                date_started: data.date_started,
                date_completed: data.date_completed,
                duration: data.duration,
                is_completed: isCompleted,
                created_at: new Date(),
                created_by: updatedBy
            }

            dispatch(updateProposalCompleted(details));
        }

        toggleModal(MODAL_TYPE.CRT);
    }

    const handleSubmitCompletedProposal = (e) => {
        e.preventDefault();

        const authors = [];
        const dateFormat = moment(dateOfCompletion).format("L");
        author.map((list) => authors.push(list.label));

        const details = {
            research_id: researchId,
            title_of_research: titleOfResearch,
            type_of_research: typeOfResearch,
            author,
            author_list: authors.join(", "),
            source_of_funding: sourceOfFunding,
            name_of_agency: nameOfAgency,
            total_funds: totalFunds,
            abstract: abstract,
            date_started: dateStarted,
            date_completed: dateCompleted,
            duration: duration,
            is_completed: isCompleted,
            created_at: new Date(),
            created_by: updatedBy
        }

        dispatch(createProposalCompleted(details));

        setModalExternal(false);
        clearForm();
    }

    // const onSubmitFormFunded = () => {
    //     if (researchId) {
    //         const formData = new FormData();
    //         const data = {
    //             research_id: researchId,
    //             abstract,
    //             file_name: fileName,
    //             is_completed: isCompleted,
    //             update_at: new Date(),
    //             updated_by: updatedBy,
    //         };

    //         formData.append("file", file);
    //         formData.append("data", JSON.stringify(data));

    //         dispatch(updateProposalCompleted(formData));
    //     } else {
    //         const authors = [];
    //         const dateFormat = moment(dateOfCompletion).format("L");
    //         author.map((list) => authors.push(list.label));

    //         const data = {
    //             research_id: researchId,
    //             title_of_research: titleOfResearch,
    //             type_of_research: typeOfResearch,
    //             author: author,
    //             author_list: authors.join(", "),
    //             source_of_funding: sourceOfFunding,
    //             date_of_completion: dateFormat,
    //             abstract,
    //             file_name: fileName,
    //             created_at: new Date(),
    //             created_by: updatedBy,
    //             updated_at: new Date(),
    //             updated_by: updatedBy,
    //         };

    //         dispatch(createProposalCompleted(data));
    //     }

    //     toggleModal(MODAL_TYPE.CRT);
    // };

    const showModalPrompt = (completed, modal_type) => {
        // UPDATE status modal will appear.
        if (modal_type === MODAL_TYPE.UPD) {
            setResearchId(completed._id);
            setIsCompleted("Y");
            setDateOfCompletion(new Date());
            setUpdatedAt(new Date());
            setRemarks(remarks);

            toggleModal(MODAL_TYPE.UPD);
        }

        // DELETE modal will appear
        if (modal_type === MODAL_TYPE.DEL) {
            setResearchId(completed._id);
            setIsCompleted(null);
            setDateOfCompletion(null);
            setUpdatedAt(new Date());

            toggleModal(MODAL_TYPE.DEL);
        }
    };

    const onSubmitUpdateStatusOrDelete = (modal_type) => {
        const data = {
            research_id: researchId,
            is_completed: isCompleted,
            date_completed: dateOfCompletion,
            updated_at: updatedAt,
            updated_by: updatedBy,
        };

        if (modal_type === MODAL_TYPE.UPD) {
            dispatch(updateProposalCompletedApprovedRemarks(data));
        } else if (modal_type === MODAL_TYPE.DEL) {
            dispatch(updateProposalCompletedApprovedRemarks(data));
        }

        toggleModal(
            modal_type === MODAL_TYPE.DEL ? MODAL_TYPE.DEL : MODAL_TYPE.UPD
        );
    };

    const getAuthorsOption = () => {
        const authors = [];

        for (let i = 0; i < faculty.length; i++)
            authors.push({
                value: faculty[i]._id,
                label: faculty[i].full_name,
            });

        return authors;
    };

    const getUserCompleted = () => {
        const currentUserId = currentUser.id;
        const user = [];

        for (let i = 0; i < completed.length; i++) {
            // Destructure some of the details
            let { user_id } = completed[i].created_by;

            if (user_id === currentUserId && (completed[i].is_completed === "N" || completed[i].is_completed === "Y")) {
                user.push({
                    _id: completed[i]._id,
                    title_of_research: completed[i].title_of_research,
                    type_of_research: completed[i].type_of_research,
                    abstract: completed[i].abstract,
                    author: completed[i].author,
                    author_list: completed[i].author_list,
                    source_of_funding: completed[i].source_of_funding,
                    // date_of_completion: completed[i].date_of_completion,
                    date_started: completed[i].date_started,
                    date_completed: completed[i].date_completed,
                    duration: completed[i].duration,
                    file_name: completed[i].file_name,
                    is_completed: completed[i].is_completed,
                });
            }
        }

        return user;
    }

    // Displays only the researches of the current user.
    const getResearchesOptions = () => {
        const currentUserId = currentUser.id;

        if (typeof proposal_approved !== undefined) {
            const list_of_research = [];

            for (let i = 0; i < proposal_approved.length; i++) {
                let { user_id } = proposal_approved[i].created_by;

                if (
                    proposal_approved[i].remarks === "approved" &&
                    proposal_approved[i].is_completed !== "N" &&
                    proposal_approved[i].is_completed !== "Y" &&
                    user_id === currentUserId
                ) {
                    list_of_research.push(
                        <option
                            key={proposal_approved[i]._id}
                            value={proposal_approved[i]._id}
                        >
                            {proposal_approved[i].title_of_research}
                        </option>
                    );
                }
            }

            return list_of_research;
        }
    };

    const getPendingProposal = () => {
        const currentUserId = currentUser.id;

        if (typeof completed !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const pending = [];

                for (let i = 0; i < completed.length; i++) {
                    if (completed[i].is_completed === "N") {
                        pending.push({
                            _id: completed[i]._id,
                            title_of_research: completed[i].title_of_research,
                            type_of_research: completed[i].type_of_research,
                            abstract: completed[i].abstract,
                            author: completed[i].author,
                            author_list: completed[i].author_list,
                            source_of_funding: completed[i].source_of_funding,
                            date_of_completion: completed[i].date_of_completion,
                            file_name: completed[i].file_name,
                            is_completed: completed[i].is_completed,
                        });
                    }
                }

                return pending;
            }
            // Current logged in user is USER.
            else {
                const pending = [];

                for (let i = 0; i < completed.length; i++) {
                    // Destructure some of the details
                    let { user_id } = completed[i].created_by;

                    if (
                        completed[i].is_completed === "N" &&
                        user_id === currentUserId
                    ) {
                        pending.push({
                            _id: completed[i]._id,
                            title_of_research: completed[i].title_of_research,
                            type_of_research: completed[i].type_of_research,
                            abstract: completed[i].abstract,
                            author: completed[i].author,
                            author_list: completed[i].author_list,
                            source_of_funding: completed[i].source_of_funding,
                            date_of_completion: completed[i].date_of_completion,
                            file_name: completed[i].file_name,
                            is_completed: completed[i].is_completed,
                        });
                    }
                }

                return pending;
            }
        }
    };

    const getCompletedProposal = () => {
        const currentUserId = currentUser.id;

        if (typeof completed !== undefined) {
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const complete = [];

                for (let i = 0; i < completed.length; i++) {
                    if (completed[i].is_completed === "Y") {
                        complete.push({
                            _id: completed[i]._id,
                            title_of_research: completed[i].title_of_research,
                            type_of_research: completed[i].type_of_research,
                            abstract: completed[i].abstract,
                            author: completed[i].author,
                            author_list: completed[i].author_list,
                            source_of_funding: completed[i].source_of_funding,
                            date_of_completion: completed[i].date_of_completion,
                            file_name: completed[i].file_name,
                            is_completed: completed[i].is_completed,
                        });
                    }
                }

                return complete;
            }
            // Current logged in user is USER.
            else {
                const complete = [];

                for (let i = 0; i < completed.length; i++) {
                    // Destructure some of the details
                    let { user_id } = completed[i].created_by;

                    if (
                        completed[i].is_completed === "Y" &&
                        user_id === currentUserId
                    ) {
                        complete.push({
                            _id: completed[i]._id,
                            title_of_research: completed[i].title_of_research,
                            type_of_research: completed[i].type_of_research,
                            abstract: completed[i].abstract,
                            author: completed[i].author,
                            author_list: completed[i].author_list,
                            source_of_funding: completed[i].source_of_funding,
                            date_of_completion: completed[i].date_of_completion,
                            file_name: completed[i].file_name,
                            is_completed: completed[i].is_completed,
                        });
                    }
                }

                return complete;
            }
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
                isOpen={modalPrompt}
                toggle={() => toggleModal(MODAL_TYPE.DEL)}
                className="modal-dialogue"
            >
                <ModalHeader
                    className={
                        modalType === MODAL_TYPE.DEL
                            ? "bg-danger text-light"
                            : "bg-primary text-light"
                    }
                    toggle={() => toggleModal(MODAL_TYPE.DEL)}
                >
                    {modalType === MODAL_TYPE.DEL ? "Delete" : "Update Status"}
                </ModalHeader>
                <ModalBody>
                    <Label>
                        {modalType === MODAL_TYPE.DEL
                            ? "Are you sure do you want to delete this data?"
                            : "Are you sure you want to update the status?"}
                    </Label>
                </ModalBody>
                <ModalFooter>
                    <Button
                        type="submit"
                        color={
                            modalType === MODAL_TYPE.DEL ? "danger" : "primary"
                        }
                        onClick={() =>
                            onSubmitUpdateStatusOrDelete(
                                modalType === MODAL_TYPE.DEL
                                    ? MODAL_TYPE.DEL
                                    : MODAL_TYPE.UPD
                            )
                        }
                    >
                        {modalType === MODAL_TYPE.DEL ? "Delete" : "Update"}
                    </Button>
                    <Button
                        color="light"
                        onClick={() => toggleModal(MODAL_TYPE.DEL)}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* create modal */}
            <Modal
                isOpen={modal}
                toggle={() => toggleModal(MODAL_TYPE.CRT)}
                size="lg"
                className="modal-dialog font-14"
            >
                <ModalHeader
                    className="bg-primary text-light"
                    toggle={() => toggleModal(MODAL_TYPE.CRT)}
                >
                    {!researchId ? "Add Completed" : "Update Completed"}
                </ModalHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <Container>
                            {/* <Nav tabs pills className="mb-3">
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "1" ? "active" : ""
                                        }
                                        onClick={() => {
                                            toggleTab("1");
                                        }}
                                    >
                                        Funded
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "2" ? "active" : ""
                                        }
                                        onClick={() => {
                                            toggleTab("2");
                                        }}
                                    >
                                        External
                                    </NavLink>
                                </NavItem>
                            </Nav> */}
                            {/* <TabContent activeTab={activeTab}>
                                <TabPane tabId="1"> */}
                                    <FormGroup>
                                        <Label for="">
                                            Title of Research{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className={errors.research_id && activeTab === 1 ? "is-invalid form-control" : "form-control" }
                                            type="select"
                                            name="research_id"
                                            id="research_id"
                                            defaultValue={researchId}
                                            {...register("research_id")}
                                        >
                                            <option value="">Choose...</option>
                                            {getResearchesOptions()}
                                        </select>
                                        <span className="text-danger">
                                            {errors.research_id?.message && activeTab === 1}
                                        </span>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>
                                            Abstract{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <textarea
                                            className={errors.abstract ? "is-invalid form-control" : "form-control" }
                                            rows="6"
                                            type="textarea"
                                            name="abstract"
                                            id="abstract"
                                            defaultValue={abstract}
                                            {...register("abstract")}
                                        ></textarea>
                                        <span className="text-danger">
                                            {errors.abstract?.message}
                                        </span>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Date Started</Label>
                                        <input
                                            id="date_started" 
                                            name="date_started" 
                                            className="form-control" 
                                            type="date"
                                            defaultValue={dateStarted}
                                            {...register("date_started")} 
                                        />
                                        <span className="text-danger">
                                            {errors.date_started?.message}
                                        </span>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Date Completed</Label>
                                        <input 
                                            id="date_completed"
                                            name="date_completed"
                                            className="form-control" 
                                            type="date" 
                                            defaultValue={dateCompleted}
                                            {...register("date_completed")}
                                        />
                                        <span className="text-danger">
                                            {errors.date_completed?.message}
                                        </span>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Duration</Label>
                                        <input
                                            id="duration" 
                                            name="duration" 
                                            className="form-control" 
                                            type="text"
                                            defaultValue={duration}
                                            {...register("duration")}
                                        />
                                        <span className="text-danger">
                                            {errors.duration?.message}
                                        </span>
                                    </FormGroup>
                                    {/* <FormGroup>
                                        <Label className="badge badge-danger text-white float-left">
                                            <b>Note:</b> Upload only PDF files.
                                        </Label>
                                        <br />
                                        <div className="input-group mb-2">
                                            <input
                                                type="file"
                                                name="research_file"
                                                className={errors.research_file ? "is-invalid form-control" : "form-control" }
                                                {...register("research_file")}
                                            /><br />
                                        </div>
                                        <span className="text-danger">
                                            {errors.research_file?.message}
                                        </span>
                                    </FormGroup> */}
                                {/* </TabPane> */}
                                {/* <TabPane tabId="2"> */}
                                    
                                {/* </TabPane>
                            </TabContent> */}
                        </Container>
                    </ModalBody>
                    <ModalFooter className="mt-3">
                        <Button
                            type="submit"
                            color="primary"
                        >
                            Save Changes
                        </Button>
                        <Button
                            color="light"
                            onClick={() => toggleModal(MODAL_TYPE.CRT)}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <Modal
                isOpen={modalExternal}
                toggle={() => setModalExternal(false)}
                size="lg"
                className="modal-dialog font-14"
            >
                <ModalHeader
                    className="bg-primary text-light"
                    toggle={() => setModalExternal(false)}
                >
                    Add External Completed
                </ModalHeader>
                <Form onSubmit={handleSubmitCompletedProposal}>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <Input
                                    type="hidden"
                                    name="research_id"
                                    id="research_id"
                                    // defaultValue={researchId}
                                    // {...register("research_id_external")}
                                    value={researchId}
                                    onChange={(e) => { setResearchId(e.target.value) }}
                                />
                                <Label for="">
                                    Title of Research{" "}
                                    <span className="text-danger">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    // className={
                                    //     errors.title_of_research_external
                                    //         ? "is-invalid form-control"
                                    //         : "form-control"
                                    // }
                                    className="form-control"
                                    type="text"
                                    name="title_of_research"
                                    id="title_of_research"
                                    value={titleOfResearch}
                                    onChange={(e) => { setTitleOfResearch(e.target.value) }}
                                    // defaultValue={titleOfResearch}
                                    // {...register("title_of_research_external")}
                                />

                                {/* <small className="text-danger">
                                    {errors.title_of_research_external?.message}
                                </small> */}
                            </FormGroup>
                            <FormGroup>
                                <Label for="">
                                    Type of Research{" "}
                                    <span className="text-danger">
                                        *
                                    </span>
                                </Label>
                                <select
                                    // className={
                                    //     errors.type_of_research_external
                                    //         ? "is-invalid form-control"
                                    //         : "form-control"
                                    // }
                                    className="form-control"
                                    type="select"
                                    name="type_of_research"
                                    id="type_of_research"
                                    value={typeOfResearch}
                                    onChange={(e) => { setTypeOfResearch(e.target.value) }}
                                    // defaultValue={typeOfResearch}
                                    // {...register("type_of_research_external")}
                                >
                                    <option value="">Choose...</option>
                                    <option value="descriptive">
                                        Descriptive
                                    </option>
                                    <option value="developmental">
                                        Developmental
                                    </option>
                                    <option value="experimental">
                                        Experimental
                                    </option>
                                    <option value="modelling">Modelling</option>
                                    <option value="others">Others</option>
                                </select>
                                {/* <small className="text-danger">
                                    {errors.type_of_research_external?.message}
                                </small> */}
                            </FormGroup>
                            <FormGroup>
                                <Label for="">
                                    Author(s){" "}
                                    <span className="text-danger">
                                        *
                                    </span>
                                </Label>
                                <Select
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={getAuthorsOption()}
                                    name="author"
                                    value={author}
                                    onChange={setAuthor}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label for="">
                                            Source of Funding{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            // className={
                                            //     errors.source_of_funding_external
                                            //         ? "is-invalid form-control"
                                            //         : "form-control"
                                            // }
                                            className="form-control"
                                            type="select"
                                            name="source_of_funding"
                                            id="source_of_funding"
                                            // defaultValue={sourceOfFunding}
                                            // {...register("source_of_funding_external")}
                                            value={sourceOfFunding}
                                            onChange={(e) => { setSourceOfFunding(e.target.value) }}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="stf">STF</option>
                                            <option value="gaa">GAA</option>
                                            <option value="external">
                                                External
                                            </option>
                                            <option value="personal">
                                                Personal
                                            </option>
                                        </select>
                                        {/* <small className="text-danger">
                                            {errors.source_of_funding_external?.message}
                                        </small> */}
                                    </Col>
                                    <Col md="6">
                                        <Label for="">
                                            {sourceOfFunding ===
                                            "external"
                                                ? "Name of Agency"
                                                : ""}
                                        </Label>
                                        <input
                                            className="form-control"
                                            type={
                                                watch("source_of_funding") ===
                                                "external"
                                                    ? "text"
                                                    : "hidden"
                                            }
                                            name="name_of_agency"
                                            id="name_of_agency"
                                            value={nameOfAgency}
                                            onChange={(e) => { setNameOfAgency(e.target.value) }}
                                            // {...register("name_of_agency")}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label for="">
                                            Total Funds{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className={
                                                errors.total_funds_external
                                                    ? "is-invalid form-control"
                                                    : "form-control"
                                            }
                                            name="total_funds"
                                            id="total_funds"
                                            value={totalFunds}
                                            onChange={(e) => { setTotalFunds(e.target.value) }}
                                            // defaultValue={totalFunds}
                                            // {...register("total_funds_external")}
                                        />
                                        {/* <small className="text-danger">
                                            {errors.total_funds_external?.message}
                                        </small> */}
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    Abstract{" "}
                                    <span className="text-danger">
                                        *
                                    </span>
                                </Label>
                                <textarea
                                    // className={errors.abstract_external ? "is-invalid form-control" : "form-control" }
                                    className="form-control"
                                    rows="6"
                                    type="textarea"
                                    name="abstract"
                                    id="abstract"
                                    value={abstract}
                                    onChange={(e) => { setAbstract(e.target.value) }}
                                    // defaultValue={abstract}
                                    // {...register("abstract_external")}
                                ></textarea>
                                {/* <span className="text-danger">
                                    {errors.abstract_external?.message}
                                </span> */}
                            </FormGroup>
                            <FormGroup>
                                <Label>Date Started</Label>
                                <input
                                    // className={errors.date_started_external ? "is-invalid form-control" : "form-control" }
                                    className="form-control"
                                    id="date_started" 
                                    name="date_started" 
                                    type="date"
                                    value={dateStarted}
                                    onChange={(e) => { setDateStarted(e.target.value) }}
                                    // defaultValue={dateStarted}
                                    // {...register("date_started_external")} 
                                />
                                <span className="text-danger">
                                    {errors.date_started_external?.message}
                                </span>
                            </FormGroup>
                            <FormGroup>
                                <Label>Date Completed</Label>
                                <input 
                                    // className={errors.date_completed_external ? "is-invalid form-control" : "form-control" }
                                    className="form-control"
                                    id="date_completed"
                                    name="date_completed"
                                    type="date" 
                                    value={dateCompleted}
                                    onChange={(e) => setDateCompleted(e.target.value) }
                                    // defaultValue={dateCompleted}
                                    // {...register("date_completed_external")}
                                />
                                {/* <span className="text-danger">
                                    {errors.date_completed_external?.message}
                                </span> */}
                            </FormGroup>
                            <FormGroup>
                                <Label>Duration</Label>
                                <input
                                    // className={errors.duration_external ? "is-invalid form-control" : "form-control" } 
                                    className="form-control"
                                    id="duration" 
                                    name="duration" 
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    // defaultValue={duration}
                                    // {...register("duration_external")}
                                />
                                {/* <span className="text-danger">
                                    {errors.duration_external?.message}
                                </span> */}
                            </FormGroup>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="submit"
                            color="primary"
                        >
                            Save External
                        </Button>
                        <Button
                            color="light"
                            onClick={() => setModalExternal(false)}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Completed
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
                                        <a href="/completed">Completed</a>
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

            { currentUser.user_type === "rh" || currentUser.user_type === "rh" ? (
            <>
                <Container fluid>
                    <Alert color="warning">
                        <h4 className="alert-heading font-weight-bold">
                            Reminders!
                        </h4>
                        <p>
                            Be sure to submit the hard copy of your completed
                            research to your respective research coordinator.
                        </p>
                    </Alert>
                    <Card>
                        <CardBody>
                            <Nav tabs pills className="mb-3 font-14 text-dark">
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "1" ? "active" : ""
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
                                            activeTab === "2" ? "active" : ""
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
                                        records={getPendingProposal()}
                                        columns={dtColumns}
                                        extraButtons={dtExtraButtons}
                                    />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ReactDatatable
                                        className="table font-14"
                                        tHeadClassName="thead-dark font-weight-medium"
                                        config={dtConfig}
                                        records={getCompletedProposal()}
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
                    <Alert color="warning">
                        <h4 className="alert-heading font-weight-bold">
                            Reminders!
                        </h4>
                        <p>
                            Be sure to submit the hard copy of your completed
                            research to your respective research coordinator.
                        </p>
                    </Alert>
                    <Card>
                        <CardBody>
                            <ReactDatatable
                                className="table font-14"
                                tHeadClassName="thead-dark font-weight-medium"
                                config={dtConfig}
                                records={getUserCompleted()}
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

export default Completed;
