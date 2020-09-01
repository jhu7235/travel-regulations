import axios from "axios";

/**
 * Module for handling regulation http calls
 */

const iataRegulationsClient = axios.create({
  baseURL: "https://www.iatatravelcentre.com/static/js/",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

export const getRegulations = () => {
  return iataRegulationsClient.get("gdp.js")
}
