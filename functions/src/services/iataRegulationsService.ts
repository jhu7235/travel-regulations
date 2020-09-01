import * as json from "json5";
import * as HTMLDecoderEncoder from 'html-encoder-decoder'

import * as regulationClientService from "./iataRegulationsClientService";
import { ITravelRegulations } from '../firestore/travelRegulations'
import * as iataParser from "./iataParser";

/**
 * Services for getting regulations data from IATA site. 
 * TODO: We should get data from 
 * https://data.humdata.org/dataset/covid-19-global-travel-restrictions-and-airline-information
 * instead it'll likely be cleaner and more stable
 */

interface IRawIataRegulation {
   // string that contains all the relevant information (publish date, description)
   gdp: string;
   // number representing countries restriction level (1-3)
   gdpAdjusted: number;
}

interface IParsedData {
   values: IRawIataRegulations
}

interface IRawIataRegulations {
   [countryCode: string]: IRawIataRegulation
}

/**
 * Parses out the travel regulation from the js script. In theory we can just
 * execute the script, but we don't want to execute foreign script for security reasons
 */
const parseRegulationsFromScript = (executable: string): ITravelRegulations => {
   const rawRegulations = parseRawDataFromExecutable(executable);
   return buildTravelRegulations(rawRegulations);
}

/**
 * Parses the relevant data from js script
 */
const parseRawDataFromExecutable = (executable: string): IRawIataRegulations => {
   const dataString = executable.substr(20);
   const decodedDataString = HTMLDecoderEncoder.decode(dataString);
   return (json.parse(decodedDataString) as IParsedData).values;
}

/**
 * From raw data, transform the data to ITravelRegulations format so it's easily consumable
 */
const buildTravelRegulations = (rawRegulations: IRawIataRegulations): ITravelRegulations => {
   const regulations: ITravelRegulations = {};
   Object.keys(rawRegulations).forEach((countryCode) => {
      const regulation = rawRegulations[countryCode];
      const content = regulation.gdp;
      const { publishedDate, description } = iataParser.parseContent(content);
      regulations[countryCode] = { level: regulation.gdpAdjusted, publishedDate, description }
   });
   return regulations
}


/**
 * Gets regulation data. Resolves to a mapping of country code to regulations
 */
export const getRegulations = async (): Promise<ITravelRegulations> => {
   const response = await regulationClientService.getRegulations();
   // response.data is an js script
   return parseRegulationsFromScript(response.data);
}
