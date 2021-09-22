/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
    Container,
    Button,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
} from "reactstrap";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import DefaultAvatar from "../../../profile-avatar.svg";
import DefaultAvatar from "../../../images/profile-picture.svg";
import { getDepartment } from "../../../redux/actions/department_action";
import { updateAccount } from "../../../redux/actions/account_action";

const formSchema = yup.object().shape({
    first_name: yup.string().required("First name field is required"),
    last_name: yup.string().required("Last name field is required"),
    position: yup.string().required("Position field is required"),
    college: yup.string().required("College field is required"),
});

const Profile = ({ currentUser }) => {
    const [userId, setUserId] = useState(currentUser.id);
    const [firstName, setFirstName] = useState(currentUser.first_name);
    const [middleInitial, setmiddleInitial] = useState(
        currentUser.middle_initial
    );
    const [lastName, setLastName] = useState(currentUser.last_name);
    const [fullName, setFullName] = useState(currentUser.full_name);
    const [position, setPosition] = useState(currentUser.position);
    const [college, setCollege] = useState(currentUser.college);
    const [campus, setCampus] = useState(currentUser.campus);
    const [fieldOfSpecialization, setFieldOfSpecialization] = useState(
        currentUser.field_of_specialization
    );
    const [educationalAttainment, setEducationalAttainment] = useState(
        currentUser.educational_attainment
    );

    const department = useSelector((state) => state.department.departments);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        dispatch(getDepartment());
    }, [dispatch]);

    const onSubmit = (data) => {
        const profileData = {
            user_id: data.user_id,
            first_name: data.first_name,
            middle_initial: data.middle_initial,
            last_name: data.last_name,
            full_name: `${data.first_name} ${data.middle_initial} ${data.last_name}`,
            position: data.position,
            college: data.college,
            field_of_specialization: data.field_of_specialization,
            educational_attainment: data.educational_attainment,
        };

        dispatch(updateAccount(profileData));
    };

    const getColleges = () => {
        const colleges = [];

        for (let i = 0; i < department.length; i++) {
            colleges.push(
                <option
                    key={department[i]._id}
                    value={department[i].department_code}
                    // data-campus={department[i].campus_name}
                >
                    {department[i].department_name}
                </option>
            );
        }

        return colleges;
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

            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Personal Information
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
                                        <a href="/profile">Profile</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <Container fluid>
                <Card>
                    <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="pt-4 pb-4">
                                <Col md="5" className="ml-5">
                                    <FormGroup className="text-center">
                                        <a
                                            href="#"
                                            onClick={() =>
                                                alert("Will be updated soon.")
                                            }
                                        >
                                            <img
                                                src={DefaultAvatar}
                                                alt="profile"
                                                width="150"
                                                height="150"
                                            />
                                        </a>
                                    </FormGroup>
                                    {/* <FormGroup>
                                        <Label>Username <span className="text-danger">*</span></Label>
                                        <Input
                                            type="text"
                                            name="username"
                                            value={userName}
                                            {...register("username")}
                                        ></Input>
                                        <small className="text-danger">
                                            { errors.username?.message }
                                        </small>
                                    </FormGroup> */}
                                    <FormGroup>
                                        <Label>
                                            First name{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        {/* <Input
                                            type="text"
                                            id="user_id"
                                            name="user_id"
                                            defaultValue={userId}
                                            {...register("user_id")}
                                            placeholder="User id"
                                        ></Input> */}
                                        <input
                                            className=""
                                            type="hidden"
                                            id="user_id"
                                            name="user_id"
                                            defaultValue={userId}
                                            {...register("user_id")}
                                        />
                                        <small className="text-danger">
                                            {errors.user_id?.message}
                                        </small>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            defaultValue={firstName}
                                            {...register("first_name")}
                                        />
                                        <small className="text-danger">
                                            {errors.first_name?.message}
                                        </small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>
                                            Last name{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="last_name"
                                            defaultValue={lastName}
                                            {...register("last_name")}
                                        ></input>
                                        <small className="text-danger">
                                            {errors.last_name?.message}
                                        </small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Middle initial / name</Label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="middle_initial"
                                            defaultValue={middleInitial}
                                            {...register("middle_initial")}
                                        ></input>
                                    </FormGroup>
                                </Col>
                                <Col md="1">
                                    <div
                                        className="v-divider"
                                        style={{
                                            marginLeft: "35px",
                                            width: "1px",
                                            height: "100%",
                                            borderLeft: "1px dotted grey",
                                        }}
                                    ></div>
                                </Col>
                                <Col md="5">
                                    <FormGroup>
                                        <Label>
                                            Position{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            type="select"
                                            name="position"
                                            defaultValue={position}
                                            {...register("position")}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="instructor i">
                                                Instructor I
                                            </option>
                                            <option value="instructor ii">
                                                Instructor II
                                            </option>
                                            <option value="instructor iii">
                                                Instructor III
                                            </option>
                                            <option value="assistant professor i">
                                                Assistant Professor I
                                            </option>
                                            <option value="assistant professor ii">
                                                Assistant Professor II
                                            </option>
                                            <option value="assistant professor iii">
                                                Assistant Professor III
                                            </option>
                                            <option value="assistant professor iii">
                                                Assistant Professor III
                                            </option>
                                            <option value="assistant professor iv">
                                                Assistant Professor IV
                                            </option>
                                            <option value="associate professor i">
                                                Associate Professor I
                                            </option>
                                            <option value="associate professor ii">
                                                Associate Professor II
                                            </option>
                                            <option value="associate professor iii">
                                                Associate Professor III
                                            </option>
                                            <option value="associate professor iv">
                                                Associate Professor IV
                                            </option>
                                            <option value="associate professor v">
                                                Associate Professor V
                                            </option>
                                            <option value="professor i">
                                                Professor I
                                            </option>
                                            <option value="professor ii">
                                                Professor II
                                            </option>
                                            <option value="professor iii">
                                                Professor III
                                            </option>
                                            <option value="professor iv">
                                                Professor IV
                                            </option>
                                            <option value="professor v">
                                                Professor V
                                            </option>
                                            <option value="professor vi">
                                                Professor VI
                                            </option>
                                        </select>
                                        <small className="text-danger">
                                            {errors.position?.message}
                                        </small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>
                                            College{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="college"
                                            id="college"
                                            defaultValue={college}
                                            {...register("college")}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="CITE">
                                                College of Information
                                                Technology
                                            </option>
                                            <option value="CTE">
                                                College of Teacher Education
                                            </option>
                                            <option value="CBM">
                                                College of Business and
                                                Management
                                            </option>
                                            <option value="CAFS">
                                                College of Agriculture,
                                                Fisheries and Forestry
                                            </option>
                                        </select>
                                        <small className="text-danger">
                                            {errors.college?.message}
                                        </small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Field of Specialization</Label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="field_of_specialization"
                                            defaultValue={fieldOfSpecialization}
                                            {...register(
                                                "field_of_specialization"
                                            )}
                                        ></input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Educational Attainment</Label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="educational_attainment"
                                            defaultValue={educationalAttainment}
                                            {...register(
                                                "educational_attainment"
                                            )}
                                        ></input>
                                    </FormGroup>
                                    <Button
                                        type="submit"
                                        className="btn btn-purple mt-3"
                                        style={{ float: "right" }}
                                    >
                                        Save Changes
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default Profile;
