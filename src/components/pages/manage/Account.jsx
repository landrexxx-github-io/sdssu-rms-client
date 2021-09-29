/* eslint-disable jsx-a11y/alt-text */
import React
, { 
    useState
    , useEffect 
} from 'react';

import { 
    useDispatch
    , useSelector 
} from 'react-redux';

import { 
    getAccount
    , createAccount 
} from '../../../redux/actions/account_action';

import { 
    Container
    , Button
    , Card
    , CardBody
    , Modal
    , ModalHeader
    , ModalBody
    , ModalFooter
    , Form
    , FormGroup
    , Label
    , Input
    , Row
    , Col 
} from 'reactstrap';

import ReactDatatable from '@ashvin27/react-datatable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultAvatar from "../../../images/profile-picture.svg";

const CREATE_UPDATE = 'CREATE_UPDATE';
const ACTIVATE_ACCOUNT = 'ACTIVATE';

const Account = () => {
    const account = useSelector((state) => state.account.accounts); // This is to populate campus data
    const dispatch = useDispatch(); // this is to dispatch actions


    console.log("Account", account);

    const [modal, setModalAccount] = useState(false);
    const [modalActivateAccount, setModalAccountActivateAccount] = useState(false);

    const [accountId, setAccountId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleInitial, setMiddleInitial] = useState("");
    const [fullName, setFullName] = useState("");
    const [position, setPosition] = useState("");
    const [college, setCollege] = useState("");
    const [campus, setCampus] = useState("");
    const [fieldOfSpecialization, setFieldOfSpecialization] = useState("");
    const [educationalAttainment, setEducationalAttainment] = useState("");

    // Account activation
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState(false);

    // Flags
    const [showPassword, setShowPassword] = useState(false);

    // Datatables Configuration
    const dtColumns = [
        {
            key: "campus_no",
            text: "",
            className: "text-center",
            align: "left",
            sortable: true,
            width: 150,
            cell: account => {
                return(
                    <>
                        <Button
                            color="secondary" 
                            size="sm" 
                            className="btn btn-secondary"
                            onClick={() => showEditForm(account)}
                        ><span><i className="fas fa-user-circle"></i> View profile</span>
                        </Button> &nbsp;
                    </>
                )
            }
        },
        {
            key: "full_name",
            text: "Faculty Name",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "position",
            text: "Academic Rank",
            className: "",
            align: "left",
            sortable: true,
            cell: (account) => {
                return (
                    <div>{ account.position.toUpperCase() }</div>
                )
            }
        },
        {
            key: "college",
            text: "College",
            className: "",
            align: "left",
            sortable: true,
        },
        {
            key: "activation_status",
            text: "Status",
            className: "",
            align: "left",
            cell: account => {
                return(
                    <div className="badge badge-success">
                        ACTIVE
                    </div>
                )
            }
        },
    ]

    const dtConfig = {
        page_size: 10,
        length_menu: [10, 20, 50],
    }

    // End of Datatables Config

    useEffect(() => { 
        dispatch(getAccount());
    }, [dispatch]);

    const clearForm = () => {
        setAccountId("");
        setFirstName("");
        setLastName("");
        setMiddleInitial("");
        setEducationalAttainment("");
        setCollege("");
    }

    const toggleModal = (modal_type) => {
        if(modal_type === CREATE_UPDATE) 
            setModalAccount(!modal);

        if(modal_type === ACTIVATE_ACCOUNT) 
            setModalAccountActivateAccount(!modalActivateAccount);

        clearForm(); 
    }


    const showEditForm = (data) => {
        const { 
            _id
            , first_name
            , last_name
            , middle_initial
            , position
            , educational_attainment
            , field_of_specialization
            , college 
        } = data;

        toggleModal(CREATE_UPDATE);

        setAccountId(_id);
        setFirstName(first_name);
        setLastName(last_name);
        setMiddleInitial(middle_initial);
        setFullName(`${first_name} ${middle_initial} ${last_name}`);
        setPosition(position);
        setEducationalAttainment(educational_attainment);
        setFieldOfSpecialization(field_of_specialization);
        setCollege(college);
    }

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

            <Modal isOpen={modal} toggle={() => toggleModal(CREATE_UPDATE)} size="xl" className="modal-dialog">
                <ModalHeader className="bg-primary text-light" toggle={() => toggleModal(CREATE_UPDATE)}>Faculty's Information</ModalHeader>
                <Form>
                    <ModalBody>
                        <Container>
                            <FormGroup>
                                <Row>
                                    <Col md="3" className="text-center">
                                        <img
                                            src={DefaultAvatar}
                                            alt="profile"
                                            width="250"
                                            height="230"
                                        />
                                    </Col>
                                    <Col md="4" className="ml-3">
                                        <label>Full name</label>
                                        <Input
                                            type="text"
                                            contentEditable="false"
                                            value={fullName}
                                            required
                                        />
                                        <label className="mt-3">Educational attainment</label>
                                        <Input
                                            type="text"
                                            contentEditable="false"
                                            value={educationalAttainment}
                                            required
                                        />
                                        <label className="mt-3">College</label>
                                        <Input
                                            type="text"
                                            contentEditable="false"
                                            value={college}
                                            required
                                        />
                                    </Col>
                                    <Col md="4" className="ml-3">
                                        <label>Position</label>
                                        <Input
                                            type="text"
                                            contentEditable="false"
                                            value={position.toUpperCase()}
                                            required
                                        />
                                        <label className="mt-3">Field of specialization</label>
                                        <Input
                                            type="text"
                                            contentEditable="false"
                                            value={fieldOfSpecialization}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md="3"></Col>
                                    <Col md="9">
                                        <label htmlFor="" className="badge badge-primary">Researches</label>
                                        <ul>
                                            <li>No data</li>
                                        </ul>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="3"></Col>
                                    <Col md="9">
                                        <label htmlFor="" className="badge badge-primary">Seminars</label>
                                        <ul>
                                            <li>No data</li>
                                        </ul>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="light" onClick={() => toggleModal(CREATE_UPDATE)}>Close</Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <Modal isOpen={modalActivateAccount} toggle={() => toggleModal(ACTIVATE_ACCOUNT)} size="md" className="modal-dialog">
                <ModalHeader className="bg-primary text-light" toggle={() => toggleModal(ACTIVATE_ACCOUNT)}>Activate Account</ModalHeader>
                <Form>
                    <ModalBody>
                        <Container>
                            <Input
                                type="hidden"
                                name="faculty_id"
                                id="faculty_id"
                                value=""
                            />
                            <FormGroup>
                                <Label>Username <span className="text-danger">*</span></Label>
                                <div style={{ 'position' : 'relative' }}>
                                    <Input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={username}
                                        onChange={e => { setUsername(e.target.value) }}
                                        required
                                    />
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label>Password <span className="text-danger">*</span></Label>
                                <Input
                                    type={showPassword === true ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value) }}
                                    required
                                />
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input value={showPassword} onChange={() => setShowPassword(!showPassword)} type="checkbox" />{' '}
                                    Show password
                                </Label>
                            </FormGroup>
                            <FormGroup className="mt-3">
                                <Label>User Type <span className="text-danger">*</span></Label>
                                <Input
                                    type="select"
                                    name="user_type"
                                    id="user_type"
                                    value={userType}
                                    onChange={e => { setUserType(e.target.value) }}
                                    required
                                >
                                    <option value="">Choose...</option>
                                    <option value="user">User</option>
                                    <option value="guest">Guest</option>
                                    <option value="research_head">Research Head</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>Status </Label><br/>
                                <div className="badge badge-secondary">For Activation</div>
                            </FormGroup>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="form-control" type="button" color="danger" disabled>Disable</Button>
                        <Button className="form-control" type="submit" color="primary">Activate</Button>
                        <Button color="light" onClick={() => toggleModal(ACTIVATE_ACCOUNT)}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                    <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">Account</h3>
                        <div className="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0 p-0">
                                    <li className="breadcrumb-item">
                                        <a href="/">Settings</a>
                                    </li>
                                    <li className="breadcrumb-item text-muted active" aria-current="page">
                                        <a href="/campus">Account</a>
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
                            records={account}
                            columns={dtColumns}
                        />
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    )
}

export default Account;
