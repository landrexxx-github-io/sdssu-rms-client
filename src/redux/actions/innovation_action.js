import * as api from "../../api";
import { toast } from "react-toastify";

// action creators
export const getInnovation = () => async (dispatch) => {
    try {
        const { data } = await api.fetchInnovation();

        dispatch({
            type: "FETCH_INNOVATION",
            payload: data.results,
        });
    } catch (error) {
        console.log("Error: ", error);
    }
};

export const createInnovation = (proposal) => async (dispatch) => {
    try {
        const { data } = await api.createInnovation(proposal);

        dispatch({
            type: "CREATE_INNOVATION",
            payload: data.results,
        });

        toast.success("Created successfully");
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log("Error: ", error);
    }
};

export const updateInnovation = (proposal) => async (dispatch) => {
    try {
        const { data } = await api.updateInnovation(proposal);

        dispatch({
            type: "UPDATE_INNOVATION",
            payload: data,
        });

        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log("Error: ", error);
    }
};

export const deleteInnovation = (innovation_id) => async (dispatch) => {
    try {
        await api.deleteInnovation(innovation_id);

        dispatch({
            type: "DELETE_INNOVATION",
            payload: innovation_id,
        });

        toast.success("Deleted successfully");
    } catch (error) {
        toast.error("Unable to delete this data.");
        console.log("Error: ", error);
    }
};
