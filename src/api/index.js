import axios from 'axios';

// const url = 'http://localhost:3001';
const url = 'https://sdssu-rms.herokuapp.com';

export const fetchProposal = () => axios.get(`${url}/proposal`);
export const createProposal = (data) => axios.post(`${url}/proposal`, data);
export const updateProposal = (data) => axios.patch(`${url}/proposal`, data);
export const deleteProposal = (research_id) => axios.delete(`${url}/proposal`, { params: { research_id } });

export const fetchProposalSubmitted = () => axios.get(`${url}/proposal_submitted`);
export const fetchProposalEvaluated = () => axios.get(`${url}/proposal_evaluated`);
export const fetchProposalForApproval = () => axios.get(`${url}/proposal_for_approval`);
// export const fetchProposalApproved = () => axios.get(`${url}/proposal_approved`);

export const fetchCompleted = () => axios.get(`${url}/completed`);
export const createProposalCompleted = (data) => axios.post(`${url}/completed`, data);
export const updateProposalCompleted = (data) => axios.patch(`${url}/completed`, data);
// export const updateCompleted = (data) => axios.patch(`${url}/completed`, data);

export const fetchCompletedApproved = () => axios.get(`${url}/completed_approved`);
export const fetchCompletedApprovedAuthorsByResearchId = (research_id) => axios.get(`${url}/completed_approved_presentor`, { params: { research_id } });

export const fetchPresentation = () => axios.get(`${url}/presentation`);
export const createPresentation = (data) => axios.post(`${url}/presentation`, data);
export const updatePresentation = (data) => axios.patch(`${url}/presentation`, data);
export const deletePresentation = (research_id) => axios.delete(`${url}/presentation`, { params: { research_id } });

export const fetchPublication = () => axios.get(`${url}/publication`);
export const createPublication = (data) => axios.post(`${url}/publication`, data);
export const updatePublication = (data) => axios.patch(`${url}/publication`, data);
export const deletePublication = (research_id) => axios.delete(`${url}/publication`, { params: { research_id } });

export const fetchUtilization = () => axios.get(`${url}/utilization`);
export const createUtilization = (data) => axios.post(`${url}/utilization`, data);
export const updateUtilization = (data) => axios.patch(`${url}/utilization`, data);
export const deleteUtilization = (research_id) => axios.delete(`${url}/utilization`, { params: { research_id } });

export const fetchInnovation = () => axios.get(`${url}/innovation`);
export const createInnovation = (data) => axios.post(`${url}/innovation`, data);
export const updateInnovation = (data) => axios.patch(`${url}/innovation`, data);
export const deleteInnovation = (innovation_id) => axios.delete(`${url}/innovation`, { params: { innovation_id } });

export const fetchCampus = () => axios.get(`${url}/campus`);
export const createCampus = (data) => axios.post(`${url}/campus`, data);
export const updateCampus = (data) => axios.patch(`${url}/campus`, data);
export const deleteCampus = (campus_id) => axios.delete(`${url}/campus`, { params: { campus_id } });

export const fetchDepartment = () => axios.get(`${url}/department`);
export const createDepartment = (data) => axios.post(`${url}/department`, data);
export const updateDepartment = (data) => axios.patch(`${url}/department`, data);
export const deleteDepartment = (department_id) => axios.delete(`${url}/department`, { params: { department_id } });

export const fetchAccount = () => axios.get(`${url}/account`);
export const createAccount = (data) => axios.post(`${url}/account/create`, data);
export const updateAccount = (data) => axios.patch(`${url}/account/update`, data);
export const deleteAccount = (account_id) => axios.delete(`${url}/account`, { params: { account_id } });

export const fetchSeminar = () => axios.get(`${url}/seminar`);
export const createSeminar = (data) => axios.post(`${url}/seminar`, data);
export const updateSeminar = (data) => axios.patch(`${url}/seminar`, data);
export const deleteSeminar = (seminar_id) => axios.delete(`${url}/seminar`, { params: { seminar_id } });

export const loginAccount = (credentials) => axios.post(`${url}/account/login`, credentials);
export const changePassword = (credentials) => axios.patch(`${url}/account/change_password`, credentials);
