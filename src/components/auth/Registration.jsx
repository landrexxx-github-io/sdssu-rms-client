import React, { useState, useEffect, Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { createAccount } from "../../redux/actions/account_action";
import { getDepartment } from "../../redux/actions/department_action";
import { getCampus } from "../../redux/actions/campus_action";

import { ToastContainer } from "react-toastify";

import {
    Form,
    FormGroup,
    Label,
    Input,
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
} from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";

const formSchema = yup.object().shape({
    first_name: yup.string().required("First name field is required."),
    last_name: yup.string().required("Last name field is required."),
    position: yup.string().required("Position field is required."),
    college: yup.string().required("College field is required."),
    campus: yup.string().required("Campus field is required."),
    username: yup.string().required("Username field is required."),
    user_type: yup.string().required("User type field is required."),
    password: yup.string().required("Password field is required."),
})

const Registration = () => {
    const department = useSelector((state) => state.department.departments);
    const campus = useSelector((state) => state.campus.campuses);

    const dispatch = useDispatch();

    console.log("department", department);

    const [showPassword, setShowPassword] = useState(false);

    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [middleInitial, setMiddleInitial] = useState("");
    // const [position, setPosition] = useState("");
    // const [college, setCollege] = useState("");
    // const [campus, setCampus] = useState("");
    // const [userName, setUserName] = useState("");
    // const [userType, setUserType] = useState("");
    // const [password, setPassword] = useState("");

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {}
    });

    useEffect(() => {
        dispatch(getDepartment());
        dispatch(getCampus());
    }, [dispatch]);

    const onGenerateCredentials = () => {
        const year = new Date().getFullYear();
        const fname = watch("first_name");
        const lname = watch("last_name");
        const uname = `${lname}.${fname}`.split(" ").join("_").toLocaleLowerCase();
        const pword = `${uname}${year}`;
        
        document.getElementById("username").value = uname;
        document.getElementById("password").value = pword;
    };

    // const onSubmitFormRegistration = (e) => {
    //     e.preventDefault();

    //     const data = {
    //         first_name: firstName,
    //         last_name: lastName,
    //         middle_initial: middleInitial,
    //         full_name: `${lastName}, ${firstName} ${middleInitial}`,
    //         position: position,
    //         college: college,
    //         campus: campus,
    //         username: userName,
    //         user_type: userType,
    //         password: password,
    //     };

    //     dispatch(createAccount(data));
    //     clearForm();
    // };

    const onSubmit = (data) => {
        const details = {
            first_name: data.first_name,
            last_name: data.last_name,
            middle_initial: data.middle_initial,
            full_name: `${data.first_name} ${data.middle_initial} ${data.last_name}`,
            position: data.position,
            college: data.college,
            campus: data.campus,
            username: data.username,
            user_type: data.user_type,
            password: data.password
        }

        dispatch(createAccount(details));
        reset({});
    }

    // const clearForm = () => {
    //     setFirstName("");
    //     setLastName("");
    //     setMiddleInitial("");
    //     setPosition("");
    //     setCollege("");
    //     setCampus("");
    //     setUserName("");
    //     setUserType("");
    //     setPassword("");
    // };

    const getColleges = () => {
        const colleges = [];

        for (let i = 0; i < department.length; i++) {
            colleges.push(
                <option
                    key={department[i]._id}
                    value={department[i].department_code}
                    data-campus={department[i].campus_name}
                >
                    {department[i].department_name}
                </option>
            );
        }

        return colleges;
    };

    const getAllCampus = () => {
        const campuses = [];

        for (let i = 0; i < campus.length; i++) {
            campuses.push(
                <option
                    key={campus[i]._id}
                    value={campus[i].campus_name.toLocaleLowerCase().trim()}
                >
                    {campus[i].campus_name}
                </option>
            );
        }

        return campuses;
    }

    return (
        <Fragment>
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

            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Account Registration
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
                                        <a href="/registration">Registration</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <Container fluid>
                <Card>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <CardBody>
                            <Row>
                                <Col className="" md="5">
                                    <div className="stepper">
                                        <p className="badge badge-primary">
                                            <span>STEP 1: </span> Basic
                                            Information
                                        </p>
                                    </div>
                                    <FormGroup>
                                        <Label>
                                            First name{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className={errors.first_name ? "is-invalid form-control" : "form-control"}
                                            type="text"
                                            name="first_name"
                                            {...register("first_name")}
                                        />
                                        <small className="text-danger">{errors.first_name?.message}</small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className="">
                                            Last name{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className={ errors.last_name ? "is-invalid form-control" : "form-control" }
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            {...register("last_name")}
                                            // value={lastName}
                                            // onChange={(e) => {
                                            //     setLastName(e.target.value);
                                            // }}
                                            // required
                                        />
                                        <small className="text-danger">{errors.last_name?.message}</small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className="">M.I.</Label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="middle_initial"
                                            id="middle_initial"
                                            // ref={inputRef}
                                            {...register("middle_initial")}
                                            // value={middleInitial}
                                            // onChange={(e) => {
                                            //     setMiddleInitial(
                                            //         e.target.value
                                            //     );
                                            // }}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className="">
                                            Position{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className={ errors.position ? "is-invalid form-control" : "form-control" }
                                            type="select"
                                            name="position"
                                            id="position"
                                            // ref={fieldsRef}
                                            {...register("position")}
                                            // value={position}
                                            // onChange={(e) => {
                                            //     setPosition(e.target.value);
                                            // }}
                                            // required
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
                                        <small className="text-danger">{errors.position?.message}</small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className="">
                                            College{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className={ errors.college ? "is-invalid form-control" : "form-control" }
                                            type="select"
                                            name="college"
                                            id="college"
                                            {...register("college")}
                                            // value={college}
                                            // onChange={(e) => {
                                            //     let index =
                                            //         e.nativeEvent.target
                                            //             .selectedIndex;
                                            //     let campus =
                                            //         e.nativeEvent.target[index]
                                            //             .dataset.campus;

                                            //     setCollege(e.target.value);
                                            //     setCampus(campus);
                                            // }}
                                            // required
                                        >
                                            <option value="">Choose...</option>
                                            {getColleges()}
                                        </select>
                                        <small className="text-danger">{errors.college?.message}</small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className="">
                                            Campus{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className={ errors.college ? "is-invalid form-control" : "form-control" }
                                            type="select"
                                            name="campus"
                                            id="campus"
                                            {...register("campus")}
                                            // value={college}
                                            // onChange={(e) => {
                                            //     let index =
                                            //         e.nativeEvent.target
                                            //             .selectedIndex;
                                            //     let campus =
                                            //         e.nativeEvent.target[index]
                                            //             .dataset.campus;

                                            //     setCollege(e.target.value);
                                            //     setCampus(campus);
                                            // }}
                                            // required
                                        >
                                            <option value="">Choose...</option>
                                            {getAllCampus()}
                                        </select>
                                        <small className="text-danger">{errors.campus?.message}</small>
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
                                    <div className="stepper">
                                        <p className="badge badge-primary">
                                            <span>STEP 2: </span> Generate
                                            Credentials
                                        </p>
                                    </div>
                                    <Button
                                        className="mb-3 btn btn-success"
                                        type="submit"
                                        // disabled={
                                        //     firstName !== "" &&
                                        //     lastName !== "" &&
                                        //     position !== "" &&
                                        //     college !== ""
                                        //         ? false
                                        //         : true
                                        // }
                                        onClick={() => { onGenerateCredentials() }}
                                    >
                                        Generate
                                    </Button>
                                    <FormGroup>
                                        <Label className="">
                                            Username{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className={ errors.username ? "form-control is-invalid" : "form-control" }
                                            type="text"
                                            name="username"
                                            id="username"
                                            {...register("username")}
                                            // value={userName}
                                            // onChange={(e) => {
                                            //     setUserName(e.target.value);
                                            // }}
                                            // required
                                        ></input>
                                        <small className="text-danger">{errors.username?.message}</small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className="">
                                            User type{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            className={ errors.user_type ? "is-invalid form-control" : "form-control" }
                                            type="select"
                                            name="user_type"
                                            id="user_type"
                                            {...register("user_type")}
                                            // value={userType}
                                            // onChange={(e) => {
                                            //     setUserType(e.target.value);
                                            // }}
                                            // required
                                        >
                                            <option value="">Choose...</option>
                                            <option value="user">User</option>
                                            <option value="admin">
                                                Administrator
                                            </option>
                                            <option value="rd">
                                                Research Director
                                            </option>
                                            <option value="rh">
                                                Research Head
                                            </option>
                                            <option value="cd">
                                                Campus Director
                                            </option>
                                        </select>
                                        <small className="text-danger">{errors.user_type?.message}</small>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>
                                            Password{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </Label>
                                        <input
                                            className={ errors.password ? "is-invalid form-control" : "form-control" }
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            id="password"
                                            {...register("password")}
                                            // value={password}
                                            // onChange={(e) => {
                                            //     setPassword(e.target.value);
                                            // }}
                                            // required
                                        ></input>
                                        <small className="text-danger">{errors.password?.message}</small>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Label check>
                                            <Input
                                                type="checkbox"
                                                onChange={() => {
                                                    setShowPassword(
                                                        !showPassword
                                                    );
                                                }}
                                            />{" "}
                                            Show password
                                        </Label>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>&nbsp;</Label>
                                        <Input
                                            type="submit"
                                            className="btn btn-primary"
                                            value="Create account"
                                        ></Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Form>
                </Card>
            </Container>
        </Fragment>
    );
};

export default Registration;
