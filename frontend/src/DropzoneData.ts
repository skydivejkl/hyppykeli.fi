// import data from "../dropzones";

// tslint:disable-next-line:no-var-requires
const data = require("../dropzones");

interface Dropzone {
    icaocode: string;
    lat: number;
    lon: number;
    fmisid: number;
}

export const Dropzones: {[icaeocode: string]: Dropzone} = data;
