import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCampus,
    createCampus,
    updateCampus,
    deleteCampus,
} from "../../../redux/actions/campus_action";

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
} from "reactstrap";

import ReactDatatable from "@ashvin27/react-datatable";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Campus = () => {
    const campus = useSelector((state) => state.campus.campuses);
    const dispatch = useDispatch();

    const [modal, setModal] = useState(false);
    const [campusId, setCampusId] = useState("");
    const [campusName, setCampusName] = useState("");
    const [campusAddress, setCampusAddress] = useState("");

    // Datatables Configuration
    const dtColumns = [
        {
            key: "campus_no",
            text: "",
            className: "text-center",
            align: "left",
            sortable: true,
            width: 150,
            cell: (campus) => {
                return (
                    <>
                        <Button
                            size="sm"
                            className="btn-circle"
                            onClick={() => showEditForm(campus)}
                        >
                            <i className="fas fa-edit ml-1"></i>
                        </Button>{" "}
                        &nbsp;
                        <Button
                            color="danger"
                            size="sm"
                            className="btn-circle"
                            onClick={() => onClickDelete(campus._id)}
                        >
                            <i className="fas fa-trash"></i>
                        </Button>
                    </>
                );
            },
        },
        {
            key: "campus_name",
            text: "Campus Name",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "campus_address",
            text: "Address",
            className: "",
            align: "left",
            sortable: true,
        },
    ];

    const dtConfig = {
        page_size: 10,
        length_menu: [10, 20, 50],
        button: {
            // print: true,
            extra: true,
        },
    };

    const dtExtraButtons = [
        {
            className: "btn btn-primary",
            title: "Print",
            children: [
                <span>
                    <i
                        className="glyphicon glyphicon-print fa fa-print"
                        aria-hidden="true"
                    ></i>
                </span>,
            ],
            onClick: () => {
                alert("Print Logic here");
            },
        },
        {
            className: "btn btn-warning",
            title: "Create New",
            children: [
                <span>
                    <i
                        className="glyphicon glyphicon-print fa fa-plus"
                        aria-hidden="true"
                    ></i>
                </span>,
            ],
            onClick: () => {
                setModal(!modal);
            },
        },
    ];

    // End of Datatables Config

    useEffect(() => {
        dispatch(getCampus());
    }, [dispatch]);

    const clearForm = () => {
        setCampusId("");
        setCampusName("");
        setCampusAddress("");
    };

    const toggleModal = () => {
        setModal(!modal);
        clearForm();
    };

    const showEditForm = ({ _id, campus_name, campus_address }) => {
        toggleModal();

        setCampusId(_id);
        setCampusName(campus_name);
        setCampusAddress(campus_address);
    };

    const onSubmitForm = (e) => {
        e.preventDefault();

        const data = {
            campus_id: campusId,
            campus_name: campusName,
            campus_address: campusAddress,
        };

        if (!campusId) {
            dispatch(createCampus(data));
        } else {
            dispatch(updateCampus(data));
        }

        toggleModal();
    };

    const onClickDelete = (campus_id) => {
        const isDelete = window.confirm(
            "Are you sure you want to delete this data?"
        );

        if (isDelete) dispatch(deleteCampus(campus_id));
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
                    {!campusId ? "Add Campus" : "Update Campus"}
                </ModalHeader>
                <Form onSubmit={onSubmitForm}>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <Input
                                    type="hidden"
                                    name="campus_id"
                                    id="campus_id"
                                    value={campusId}
                                    onChange={(e) => {
                                        setCampusId(e.target.value);
                                    }}
                                />
                                <Label for="Name of Campus">Campus Name</Label>
                                <Input
                                    type="text"
                                    name="campus_name"
                                    id="campus_name"
                                    value={campusName}
                                    onChange={(e) => {
                                        setCampusName(e.target.value);
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Address of the Campus">
                                    Campus Address
                                </Label>
                                <Input
                                    type="text"
                                    name="campus_address"
                                    id="campus_address"
                                    value={campusAddress}
                                    onChange={(e) => {
                                        setCampusAddress(e.target.value);
                                    }}
                                />
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
                            Campus
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
                                        <a href="/campus">Campus</a>
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
                            className="table"
                            tHeadClassName="thead-dark"
                            config={dtConfig}
                            records={campus}
                            columns={dtColumns}
                            extraButtons={dtExtraButtons}
                        />
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default Campus;
