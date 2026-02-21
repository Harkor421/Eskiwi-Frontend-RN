import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../auth/context";
import authStorage from '../auth/storage'

export default useApi = (apiFunc) =>{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const {setUser, user} = useContext(AuthContext);
    const request = async () => {
          
        setLoading(true);
        const response = await apiFunc();
        setLoading(false);
        
        if(!response.ok) {
            if(response.status === 403){
                setUser(null);
                authStorage.removeToken();

            }
            return setError(true);
        }

        setError(false);
        setData(response.data);


    };
    
    return{data, error, loading, request };
}