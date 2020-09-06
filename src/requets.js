import axios from "axios";

const instance = axios.create({
    baseURL:"https://disease.sh/v3/covid-19/countries",
})
export default instance;