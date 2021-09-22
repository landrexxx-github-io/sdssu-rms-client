import { combineReducers } from 'redux';

import proposal_reducer from './proposal';
// import proposal_submitted_reducer from './proposal_submitted_reducer';
// import proposal_evaluated_reducer from './proposal_evaluated_reducer';
// import proposal_for_approval_reducer from './proposal_for_approval_reducer';
// import proposal_approved_reducer from './proposal_approved_reducer';
import completed_reducer from './completed';
// import completed_approved_reducer from './completed_approved_reducer';
import presentation_reducer from './presentation';
import publication_reducer from './publication';
import utilization_reducer from './utilization';
import innovation_reducer from './innovation';
import seminar_reducer from './seminar';

import campus_reducer from './campus';
import department_reducer from './department';
import account_reducer from './account';

import logged_account_reducer from './authentication';

export default combineReducers({
    proposal: proposal_reducer
    // , proposal_submitted: proposal_submitted_reducer
    // , proposal_evaluated: proposal_evaluated_reducer
    // , proposal_for_approval: proposal_for_approval_reducer
    // , proposal_approved: proposal_approved_reducer
    , completed: completed_reducer
    // , completed_approved: completed_approved_reducer
    , presentation: presentation_reducer
    , publication: publication_reducer
    , utilization: utilization_reducer
    , innovation: innovation_reducer
    , seminar: seminar_reducer
    , campus: campus_reducer
    , department: department_reducer
    , account: account_reducer
    , logged_account: logged_account_reducer
});