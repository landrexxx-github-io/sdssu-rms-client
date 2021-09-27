import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
    getProposal,
    createProposal,
    updateProposal,
    updateProposalRemarks,
    deleteProposal,
} from "../../../redux/actions/proposal_action";

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
} from "reactstrap";

import {
    MdDelete,
    MdKeyboardTab,
    MdMoreVert,
    MdThumbUp,
    MdThumbDown,
} from "react-icons/md";
import { Link } from "react-router-dom";
import ReactDatatable from "@ashvin27/react-datatable";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import moment from "moment";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

const animatedComponents = makeAnimated();

const REMARKS = {
    PENDING: "pending",
    SUBMITTED: "submitted",
    EVALUATED: "evaluated",
    FOR_APPROVAL: "for approval",
    APPROVED: "approved",
    DISAPPROVED: "disapproved",
};

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
    title_of_research: yup.string().required("Title of research field is required"),
    type_of_research: yup.string().required("Type of research field is required"),
    source_of_funding: yup.string().required("Source of funding field is required"),
    total_funds: yup.string().required("Total funds field is required."),
    // name_of_agency: yup.string().required("Name of agency field is required"),
    // date_of_completion: yup.string().required("Date of completion field is required"),
});

const Proposal = ({ currentUser }) => {
    const faculty = useSelector((state) => state.account.accounts); // This is to populate faculty data
    const proposal = useSelector((state) => state.proposal.proposals); // This is to populate proposal data

    const dispatch = useDispatch(); // this is to dispatch actions

    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
    } = useForm({
        resolver: yupResolver(formSchema),
    });

    const [modal, setModal] = useState(false);
    const [modalPrompt, setModalPrompt] = useState(false);
    const [modalType, setModaType] = useState(null);
    const [activeTab, setActiveTab] = useState("1");

    const [researchId, setResearchId] = useState(null);
    const [titleOfResearch, setTitleOfResearch] = useState("");
    const [typeOfResearch, setTypeOfResearch] = useState("");
    const [author, setAuthor] = useState([]);
    const [sourceOfFunding, setSourceOfFunding] = useState("");
    const [totalFunds, setTotalFunds] = useState("");
    const [nameOfAgency, setNameOfAgency] = useState("");
    const [dateOfCompletion, setDateOfCompletion] = useState(new Date());
    const [remarks, setRemarks] = useState("pending");
    const [status, setStatus] = useState("proposal");
    const [createdBy, setCreatedBy] = useState({
        user_id: currentUser.id,
        full_name: `${currentUser.first_name} ${currentUser.last_name}`,
        user_type: currentUser.user_type,
        college: currentUser.college,
        campus: currentUser.campus,
    });

    // datatables configuration
    const dtColumns = [
        {
            key: "proposal_no",
            className: "text-center",
            align: "left",
            width: proposal.remarks === REMARKS.PENDING ? 80 : null,
            cell: (proposal) => {
                // Only the Research Head has the access of all the buttons
                if (proposal.remarks === REMARKS.PENDING && currentUser.user_type === USER_TYPE.ADMIN) {
                    return (
                        <React.Fragment>
                            <Button
                                size="sm"
                                className={
                                    proposal.remarks === REMARKS.PENDING
                                        ? "btn btn-secondary"
                                        : "hidden"
                                }
                                onClick={() => showEditForm(proposal)}
                            >
                                <span><i className="fas fa-pencil-alt"></i> Edit</span>
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                size="sm"
                                className={
                                    proposal.remarks === REMARKS.PENDING
                                        ? "btn btn-danger"
                                        : "hidden"
                                }
                                onClick={() =>
                                    showModalPrompt(
                                        proposal,
                                        null,
                                        MODAL_TYPE.DEL
                                    )
                                }
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
            width: 400,
            sortable: true,
        },
        {
            key: "type_of_research",
            text: "Type of Research",
            className: "font-14",
            align: "left",
            sortable: true,
            cell: (proposal) => {
                const { type_of_research } = proposal;

                return (
                    <div>
                        {type_of_research.charAt(0).toUpperCase() +
                            type_of_research.substring(1)}
                    </div>
                );
            },
        },
        {
            key: "author_list",
            text: "Author(s)",
            className: "font-14",
            align: "left",
            sortable: true,
        },
        {
            key: "source_of_funding",
            text: "Funding",
            className: "font-14",
            align: "left",
            sortable: true,
            isSearchable: true,
            cell: (proposal) => {
                const { source_of_funding } = proposal;

                return (
                    <div>
                        {source_of_funding.charAt(0).toUpperCase() +
                            source_of_funding.substring(1)}
                    </div>
                );
            },
        },
        {
            key: "total_funds",
            text: "Total Funds",
            className: "font-14",
            align: "left",
            sortable: true,
        },
        {
            key: "action",
            text: "",
            className: "",
            align: "left",
            cell: (proposal) => {
                // Only the Research Head has the access of all the buttons
                if (
                    currentUser.user_type === USER_TYPE.RH ||
                    currentUser.user_type === USER_TYPE.ADMIN
                ) {
                    if (proposal.remarks === REMARKS.PENDING) {
                        return (
                            <React.Fragment>
                                <Button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        showModalPrompt(
                                            proposal,
                                            REMARKS.SUBMITTED,
                                            MODAL_TYPE.UPD
                                        )
                                    }
                                >
                                    Submitted
                                </Button>
                            </React.Fragment>
                        );
                    } else if (proposal.remarks === REMARKS.SUBMITTED) {
                        return (
                            <React.Fragment>
                                <Button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        showModalPrompt(
                                            proposal,
                                            REMARKS.EVALUATED,
                                            MODAL_TYPE.UPD
                                        )
                                    }
                                >
                                    Evaluated
                                </Button>
                            </React.Fragment>
                        );
                    } else if (proposal.remarks === REMARKS.EVALUATED) {
                        return (
                            <React.Fragment>
                                <div className="dropdown">
                                    <Link
                                        to="#"
                                        className="text-secondary dropdown-toggle"
                                        type="button"
                                        id="dropDownApprovedDisapproved"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <MdMoreVert size={20} />
                                    </Link>
                                    <div
                                        className="dropdown-menu"
                                        aria-labelledby="dropdownMenuButton"
                                    >
                                        <Link
                                            className="dropdown-item"
                                            to="#"
                                            onClick={() =>
                                                showModalPrompt(
                                                    proposal,
                                                    REMARKS.FOR_APPROVAL,
                                                    MODAL_TYPE.UPD
                                                )
                                            }
                                        >
                                            <MdThumbUp />
                                            &nbsp;&nbsp;For Approval
                                        </Link>
                                        <Link
                                            className="dropdown-item"
                                            to="#"
                                            onClick={() =>
                                                showModalPrompt(
                                                    proposal,
                                                    REMARKS.DISAPPROVED,
                                                    MODAL_TYPE.UPD
                                                )
                                            }
                                        >
                                            <MdThumbDown />
                                            &nbsp;&nbsp;Disapproved
                                        </Link>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    } else if (proposal.remarks === REMARKS.FOR_APPROVAL) {
                        return (
                            <React.Fragment>
                                <Button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        showModalPrompt(
                                            proposal,
                                            REMARKS.APPROVED,
                                            MODAL_TYPE.UPD
                                        )
                                    }
                                >
                                    Approved
                                </Button>
                            </React.Fragment>
                        );
                    } else if (proposal.remarks === REMARKS.APPROVED) {
                        return (
                            <React.Fragment>
                                <div className="badge badge-success">
                                    {proposal.remarks.toUpperCase()}
                                </div>
                            </React.Fragment>
                        );
                    }
                }
            },
        },
        // {
        //     key: "remarks",
        //     text: "",
        //     className: "",
        //     align: "left",
        //     cell: (proposal) => {
        //         if(currentUser.user_type !== "rh" || currentUser.user_type !== "admin") {
        //             return (
        //                 <div className="badge badge-primary">{ proposal.remarks.toUpperCase() }</div>
        //             )
        //         }
        //     }
        // }
        
    ];

    const dtConfig = {
        key_column: "id",
        page_size: 10,
        length_menu: [10, 20, 50],
        button: {
            extra: true,
        },
    };

    const dtExtraButtons = [
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

    useEffect(() => {
        dispatch(getAccount());
        dispatch(getProposal());
    }, [dispatch]);

    const clearForm = () => {
        setResearchId(null);
        setTitleOfResearch("");
        setTypeOfResearch("");
        setAuthor("");
        setSourceOfFunding("");
        setNameOfAgency("");
        setDateOfCompletion("");
        // setRemarks("");
    };

    const toggleModal = (modal_type) => {
        if (modal_type === MODAL_TYPE.CRT) {
            setModal(!modal);
            setModaType(MODAL_TYPE.CRT);
            clearForm();
        } else if (modal_type === MODAL_TYPE.UPD) {
            setModalPrompt(!modalPrompt);
            setModaType(MODAL_TYPE.UPD);
        } else {
            setModalPrompt(!modalPrompt); 
            setModaType(MODAL_TYPE.DEL);
        }
    };

    const toggleTab = (tabId) => {
        if (activeTab !== tabId) setActiveTab(tabId);
    };

    const printPDF = () => {
        const pdf = new jsPDF();

        pdf.text("Sample pdf printing", 10, 10);

        pdf.autoTable({ 
            html: "#tbl-proposal" 
        })

        pdf.save("sample.pdf");
    };

    const showEditForm = (data) => {
        const {
            _id,
            title_of_research,
            type_of_research,
            author,
            source_of_funding,
            name_of_agency,
            total_funds,
            // date_of_completion,
            remarks,
        } = data;

        // const date_completed = moment(date_of_completion).format("MM/DD/YYYY");

        toggleModal(MODAL_TYPE.CRT);

        setResearchId(_id);
        setTitleOfResearch(title_of_research);
        setTypeOfResearch(type_of_research);
        setAuthor(author);
        setSourceOfFunding(source_of_funding);
        setNameOfAgency(name_of_agency);
        // setDateOfCompletion(date_completed);
        setTotalFunds(total_funds);
        setRemarks(remarks);
    };

    const onSubmit = (data) => {
        const authors = [];
        const dateFormat = moment(dateOfCompletion).format("L");
        author.map((list) => authors.push(list.label));

        const details = {
            research_id: data.research_id,
            title_of_research: data.title_of_research,
            type_of_research: data.type_of_research,
            author,
            author_list: authors.join(", "),
            source_of_funding: data.source_of_funding,
            name_of_agency: data.name_of_agency,
            total_funds: data.total_funds,
            // date_of_completion: dateFormat,
            remarks: remarks,
            status: status,
            created_by: createdBy,
        };

        if (!data.research_id) {
            dispatch(createProposal(details));
        } else {
            dispatch(updateProposal(details));
        }

        toggleModal(MODAL_TYPE.CRT);
    };

    const showModalPrompt = (proposal, remarks, modal_type) => {
        // UPDATE status modal will appear.
        if (modal_type === MODAL_TYPE.UPD) {
            setResearchId(proposal._id);
            setRemarks(remarks);
            toggleModal(MODAL_TYPE.UPD);
        }

        // DELETE modal will appear
        if (modal_type === MODAL_TYPE.DEL) {
            setResearchId(proposal._id);
            toggleModal(MODAL_TYPE.DEL);
        }
    };

    const onSubmitUpdateStatusOrDelete = (modal_type) => {
        // IF MODAL is delete
        if (modal_type === MODAL_TYPE.DEL) {
            dispatch(deleteProposal(researchId));
        } else if (modal_type === MODAL_TYPE.UPD) {
            dispatch(
                updateProposalRemarks({ research_id: researchId, remarks })
            );
        }

        toggleModal(
            modal_type === MODAL_TYPE.DEL ? MODAL_TYPE.DEL : MODAL_TYPE.UPD
        );
    };

    const getUsersProposal = () => {
        const currentUserId = currentUser.id;
        const user = [];

        for (let i = 0; i < proposal.length; i++) {
            // Destructure some of the details created by.
            let { user_id } = proposal[i].created_by;

            // Displays ONLY the records of the current logged in user.
            if (user_id === currentUserId) {
                user.push({
                    _id: proposal[i]._id,
                    title_of_research: proposal[i].title_of_research,
                    type_of_research: proposal[i].type_of_research,
                    author: proposal[i].author,
                    author_list: proposal[i].author_list,
                    source_of_funding: proposal[i].source_of_funding,
                    date_of_completion: proposal[i].date_of_completion,
                    status: proposal[i].status,
                    remarks: proposal[i].remarks,
                });
            }
        }

        return user;
    }

    const getPendingProposal = () => {
        const currentUserId = currentUser.id;

        if (typeof proposal !== undefined) {
            // Current logged in is RESEARCH HEAD or ADMINISTRATOR.
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const pending = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Displays ALL the records.
                    if (proposal[i].remarks === REMARKS.PENDING) {
                        pending.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                        });
                    }
                }

                return pending;
            }
            // Current logged in user is USER.
            else {
                const pending = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Destructure some of the details created by.
                    let { user_id } = proposal[i].created_by;

                    // Displays ONLY the records of the current logged in user.
                    if (
                        proposal[i].remarks === REMARKS.PENDING &&
                        user_id === currentUserId
                    ) {
                        pending.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                        });
                    }
                }

                return pending;
            }
        }
    };

    console.log("Pending proposal", getPendingProposal());

    const getSubmittedProposal = () => {
        const currentUserId = currentUser.id;

        if (typeof proposal !== undefined) {
            // Current logged in is RESEARCH HEAD or ADMINISTRATOR.
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const submitted = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Displays ONLY the proposal of the current logged in user.
                    if (proposal[i].remarks === REMARKS.SUBMITTED) {
                        submitted.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                            created_by_id: proposal[i].created_by.user_id,
                            created_by_name: proposal[i].created_by.full_name,
                            created_by_type: proposal[i].created_by.user_type,
                        });
                    }
                }

                return submitted;
            }
            // Current logged in user is USER.
            else {
                const submitted = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Destructure some of the details created by.
                    let { user_id } = proposal[i].created_by;

                    // Displays ONLY the records of the current logged in user.
                    if (
                        proposal[i].remarks === REMARKS.SUBMITTED &&
                        user_id === currentUserId
                    ) {
                        submitted.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                        });
                    }
                }

                return submitted;
            }
        }
    };

    const getEvaluatedProposal = () => {
        const currentUserId = currentUser.id;

        if (typeof proposal !== undefined) {
            // Current logged in is RESEARCH HEAD or ADMINISTRATOR.
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const evaluated = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Displays ONLY the proposal of the current logged in user.
                    if (proposal[i].remarks === REMARKS.EVALUATED) {
                        evaluated.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                            created_by_id: proposal[i].created_by.user_id,
                            created_by_name: proposal[i].created_by.full_name,
                            created_by_type: proposal[i].created_by.user_type,
                        });
                    }
                }

                return evaluated;
            }
            // Current logged in user is USER.
            else {
                const evaluated = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Destructure some of the details created by.
                    let { user_id } = proposal[i].created_by;

                    // Displays ONLY the records of the current logged in user.
                    if (
                        proposal[i].remarks === REMARKS.EVALUATED &&
                        user_id === currentUserId
                    ) {
                        evaluated.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                        });
                    }
                }

                return evaluated;
            }
        }
    };

    const getForApprovalProposal = () => {
        const currentUserId = currentUser.id;

        if (typeof proposal !== undefined) {
            // Current logged in is RESEARCH HEAD or ADMINISTRATOR.
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const for_approval = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Displays ONLY the proposal of the current logged in user.
                    if (proposal[i].remarks === REMARKS.FOR_APPROVAL) {
                        for_approval.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                            created_by_id: proposal[i].created_by.user_id,
                            created_by_name: proposal[i].created_by.full_name,
                            created_by_type: proposal[i].created_by.user_type,
                        });
                    }
                }

                return for_approval;
            }
            // Current logged in user is USER.
            else {
                const for_approval = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Destructure some of the details created by.
                    let { user_id } = proposal[i].created_by;

                    // Displays ONLY the records of the current logged in user.
                    if (
                        proposal[i].remarks === REMARKS.FOR_APPROVAL &&
                        user_id === currentUserId
                    ) {
                        for_approval.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                        });
                    }
                }

                return for_approval;
            }
        }
    };

    const getApprovedProposal = () => {
        const currentUserId = currentUser.id;

        if (typeof proposal !== undefined) {
            // Current logged in is RESEARCH HEAD or ADMINISTRATOR.
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const approved = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Displays ONLY the proposal of the current logged in user.
                    if (proposal[i].remarks === REMARKS.APPROVED) {
                        approved.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                            created_by_id: proposal[i].created_by.user_id,
                            created_by_name: proposal[i].created_by.full_name,
                            created_by_type: proposal[i].created_by.user_type,
                        });
                    }
                }

                return approved;
            }
            // Current logged in user is USER.
            else {
                const approved = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Destructure some of the details created by.
                    let { user_id } = proposal[i].created_by;

                    // Displays ONLY the records of the current logged in user.
                    if (
                        proposal[i].remarks === REMARKS.APPROVED &&
                        user_id === currentUserId
                    ) {
                        approved.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                        });
                    }
                }

                return approved;
            }
        }
    };

    const getDisApprovedProposal = () => {
        const currentUserId = currentUser.id;

        if (typeof proposal !== undefined) {
            // Current logged in is RESEARCH HEAD or ADMINISTRATOR.
            if (
                currentUser.user_type === USER_TYPE.RH ||
                currentUser.user_type === USER_TYPE.ADMIN
            ) {
                const disapproved = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Displays ONLY the proposal of the current logged in user.
                    if (proposal[i].remarks === REMARKS.DISAPPROVED) {
                        disapproved.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                            created_by_id: proposal[i].created_by.user_id,
                            created_by_name: proposal[i].created_by.full_name,
                            created_by_type: proposal[i].created_by.user_type,
                        });
                    }
                }

                return disapproved;
            }
            // Current logged in user is USER.
            else {
                const disapproved = [];

                for (let i = 0; i < proposal.length; i++) {
                    // Destructure some of the details created by.
                    let { user_id } = proposal[i].created_by;

                    // Displays ONLY the records of the current logged in user.
                    if (
                        proposal[i].remarks === REMARKS.DISAPPROVED &&
                        user_id === currentUserId
                    ) {
                        disapproved.push({
                            _id: proposal[i]._id,
                            title_of_research: proposal[i].title_of_research,
                            type_of_research: proposal[i].type_of_research,
                            author: proposal[i].author,
                            author_list: proposal[i].author_list,
                            source_of_funding: proposal[i].source_of_funding,
                            total_funds: proposal[i].total_funds,
                            // date_of_completion: proposal[i].date_of_completion,
                            status: proposal[i].status,
                            remarks: proposal[i].remarks,
                        });
                    }
                }

                return disapproved;
            }
        }
    };

    const getAuthorOptions = () => {
        const authors = [];

        for (let i = 0; i < faculty.length; i++) {
            authors.push({
                value: faculty[i]._id,
                label: faculty[i].full_name,
            });
        }

        return authors;
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

            <Modal
                isOpen={modal}
                toggle={() => toggleModal(MODAL_TYPE.CRT)}
                size="lg"
                className="modal-dialogue"
            >
                <ModalHeader
                    className="bg-primary text-light"
                    toggle={() => toggleModal(MODAL_TYPE.CRT)}
                >
                    {!researchId ? "Add Proposal" : "Update Proposal"}
                </ModalHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <input
                                    type="hidden"
                                    name="research_id"
                                    id="research_id"
                                    defaultValue={researchId}
                                    {...register("research_id")}
                                />
                                <input
                                    type="hidden"
                                    name="status"
                                    id="status"
                                    defaultValue={status}
                                    {...register("status")}
                                />
                                <Label for="">
                                    Title of Research{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <input
                                    className={
                                        errors.title_of_research
                                            ? "is-invalid form-control"
                                            : "form-control"
                                    }
                                    type="text"
                                    name="title_of_research"
                                    id="title_of_research"
                                    defaultValue={titleOfResearch}
                                    {...register("title_of_research")}
                                />
                                <small className="text-danger">
                                    {errors.title_of_research?.message}
                                </small>
                            </FormGroup>
                            <FormGroup>
                                <Label for="">
                                    Type of Research{" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <select
                                    className={
                                        errors.type_of_research
                                            ? "is-invalid form-control"
                                            : "form-control"
                                    }
                                    type="select"
                                    name="type_of_research"
                                    id="type_of_research"
                                    defaultValue={typeOfResearch}
                                    {...register("type_of_research")}
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
                                <small className="text-danger">
                                    {errors.type_of_research?.message}
                                </small>
                            </FormGroup>
                            <FormGroup>
                                <Label for="">
                                    Author(s){" "}
                                    <span className="text-danger">*</span>
                                </Label>
                                <Select
                                    className="is-invalid"
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={getAuthorOptions()}
                                    name="author"
                                    value={author}
                                    onChange={setAuthor}
                                    styles={{
                                        borderRadius: "0 !important",
                                    }}
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
                                            className={
                                                errors.source_of_funding
                                                    ? "is-invalid form-control"
                                                    : "form-control"
                                            }
                                            type="select"
                                            name="source_of_funding"
                                            id="source_of_funding"
                                            defaultValue={sourceOfFunding}
                                            {...register("source_of_funding")}
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
                                        <small className="text-danger">
                                            {errors.source_of_funding?.message}
                                        </small>
                                    </Col>
                                    <Col md="6">
                                        <Label for="">
                                            {watch("source_of_funding") ===
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
                                            defaultValue={nameOfAgency}
                                            {...register("name_of_agency")}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            {/* <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label for="">
                                            Date of Completion{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <div>
                                            <DateTimePickerComponent
                                                format="yyyy-MM-dd"
                                                id="datetimepicker"
                                                value={dateOfCompletion}
                                                onChange={(e) => {
                                                    setDateOfCompletion(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </FormGroup> */}
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
                                                errors.total_funds
                                                    ? "is-invalid form-control"
                                                    : "form-control"
                                            }
                                            name="total_funds"
                                            id="total_funds"
                                            defaultValue={totalFunds}
                                            {...register("total_funds")}
                                        />
                                        <small className="text-danger">
                                            {errors.total_funds?.message}
                                        </small>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="6">
                                        <Label for="">Status</Label>
                                        <br />
                                        <p className="badge badge-primary">
                                            {remarks.toUpperCase()}
                                        </p>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary">
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

            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Proposal
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
                                        <a href="/proposal">Proposal</a>
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
                                        Submitted
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "3" ? "active" : null
                                        }
                                        onClick={() => {
                                            toggleTab("3");
                                        }}
                                    >
                                        Evaluated
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "4" ? "active" : null
                                        }
                                        onClick={() => {
                                            toggleTab("4");
                                        }}
                                    >
                                        For Approval
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "5" ? "active" : null
                                        }
                                        onClick={() => {
                                            toggleTab("5");
                                        }}
                                    >
                                        Approved
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={
                                            activeTab === "6" ? "active" : null
                                        }
                                        onClick={() => {
                                            toggleTab("6");
                                        }}
                                    >
                                        Disapproved
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <div className="table-responsive">
                                        <ReactDatatable
                                            className="table font-14"
                                            tHeadClassName="thead-dark font-14 font-weight-medium"
                                            config={dtConfig}
                                            records={getPendingProposal()}
                                            columns={dtColumns}
                                            extraButtons={dtExtraButtons}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tabId="2">
                                    <div className="table-responsive">
                                        <ReactDatatable
                                            className="table font-14"
                                            tHeadClassName="thead-dark font-14 font-weight-medium"
                                            config={dtConfig}
                                            records={getSubmittedProposal()}
                                            columns={dtColumns}
                                            extraButtons={dtExtraButtons}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tabId="3">
                                    <div className="table-responsive">
                                        <ReactDatatable
                                            className="table font-14"
                                            tHeadClassName="thead-dark font-14 font-weight-medium"
                                            config={dtConfig}
                                            records={getEvaluatedProposal()}
                                            columns={dtColumns}
                                            extraButtons={dtExtraButtons}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tabId="4">
                                    <div className="table-responsive">
                                        <ReactDatatable
                                            className="table font-14"
                                            tHeadClassName="thead-dark font-weight-medium"
                                            config={dtConfig}
                                            records={getForApprovalProposal()}
                                            columns={dtColumns}
                                            extraButtons={dtExtraButtons}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tabId="5">
                                    <div className="table-responsive">
                                        <ReactDatatable
                                            className="table font-14"
                                            tHeadClassName="thead-dark font-weight-medium"
                                            config={dtConfig}
                                            records={getApprovedProposal()}
                                            columns={dtColumns}
                                            extraButtons={dtExtraButtons}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tabId="6">
                                    <div className="table-responsive">
                                        <ReactDatatable
                                            className="table font-14"
                                            tHeadClassName="thead-dark font-weight-medium"
                                            config={dtConfig}
                                            records={getDisApprovedProposal()}
                                            columns={dtColumns}
                                            extraButtons={dtExtraButtons}
                                        />
                                    </div>
                                </TabPane>
                            </TabContent>
                        </CardBody>
                    </Card>
                </Container>
            ) : (
                <>
                    <Container fluid>
                        <Card>
                            <CardBody>
                                <div className="table-responsive">
                                    <ReactDatatable
                                        className="table font-14"
                                        tHeadClassName="thead-dark font-weight-medium"
                                        config={dtConfig}
                                        records={getUsersProposal()}
                                        columns={dtColumns}
                                        extraButtons={dtExtraButtons} 
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Container>
                </>
            ) }
            
        </React.Fragment>
    );
};

export default Proposal;
