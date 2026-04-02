import {useNavigate, useParams} from "react-router-dom";
import {useMemo} from "react";
import api from "../../api/axios.js";
import {useApi} from "../../hooks/useApi.jsx";
import {BackButton} from "../../utils/Back.jsx";

export default function ChallengerResult() {
    const params = useParams();
    const attemptId = params.attemptId;
    const navigate = useNavigate();
    const apiCall = useMemo(() => {
        return () =>
            // api.get(`/users/scores/${attemptId}`);
            api.get(`/users/result/${attemptId}`);
    }, [attemptId]);
    const {data} = useApi(apiCall, [attemptId]);
    return (
        <>
            <BackButton navigate={navigate} path="/home"/>
            <pre>{JSON.stringify(data?.data, null, 2)} </pre>
        </>
    )
}