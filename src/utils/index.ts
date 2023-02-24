import Platform from "platform";
import { sha256 } from "crypto-hash";

export const getDisplayedMessage = (result: number) => {
  switch (result) {
    case -1:
      return "No Face";
    case 0:
      return "Face detected";
    case 1:
      return "Image Spoof";
    case 2:
      return "Video Spoof";
    case 3:
      return "Video Spoof";
    case 4:
      return "Too far away";
    case 5:
      return "Too far to right";
    case 6:
      return "Too far to left";
    case 7:
      return "Too far up";
    case 8:
      return "Too far down";
    case 9:
      return "Too blurry";
    case 10:
      return "PLEASE REMOVE EYEGLASSES";
    case 11:
      return "PLEASE REMOVE FACEMASK";
    default:
      return "";
  }
};

export const isIOS = Platform?.os?.family === "iOS";
export const osVersion = Number(Platform?.os?.version);
export const isAndroid = Platform?.os?.family === "Android";
export const isMobile = isIOS || isAndroid;
export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";
export const REQUIRES_INPUT = "REQUIRES_INPUT";
export const ERROR = "error";

export function getQueryParams(queryString: string) {
  const query = queryString.split("+").join(" ");
  const params: any = {};

  const regex = /(?:\?|&|;)([^=]+)=([^&|;]+)/g;
  const tokens = regex.exec(query);

  if (tokens && tokens.length > 2)
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  return params;
}

export const isBackCamera = (
  availableDevices: Array<{ value: string; label: string }>,
  currentDevice: string
) => {
  const mediaDevice = availableDevices.find(
    (device) => device.value === currentDevice
  );
  return mediaDevice?.label?.toLowerCase().includes("back");
};

export const canvasSizeOptions = [
  { label: "10K", value: "10K" },
  { label: "8K", value: "8K" },
  { label: "5K", value: "5K" },
  { label: "4K", value: "4K" },
  { label: "2K", value: "2K" },
  { label: "FHD (1080p)", value: "FHD" },
  { label: "UXGA", value: "UXGA" },
  { label: "SXGA", value: "SXGA" },
  { label: "SXGA2", value: "SXGA2" },
];

export const WIDTH_TO_STANDARDS = {
  1600: "UXGA",
  1920: "FHD",
  2560: "2K",
  4096: "4K",
  4032: "4K",
  5120: "5K",
  7680: "8K",
  10240: "10K",
};

const WEB_CANVAS_SIZE = {
  "10K": { width: 10240, height: 4320 },
  "8K": { width: 7680, height: 4320 },
  "5K": { width: 5120, height: 2880 },
  "4K": { width: 4096, height: 2160 },
  "2K": { width: 2560, height: 1440 },
  FHD: { width: 1920, height: 1080 },
  iPhoneCC: { width: 1920, height: 1440 },
  UXGA: { width: 1600, height: 1200 },
  SXGA: { width: 1280, height: 1024 },
  SXGA2: { width: 1280, height: 960 },
};

const MOBILE_CANVAS_SIZE = {
  "2K": { width: 2560, height: 1440 },
  FHD: { width: 1920, height: 1080 },
  UXGA: { width: 1600, height: 1200 },
  SXGA: { width: 1280, height: 1024 },
  SXGA2: { width: 1280, height: 960 },
};

export const CANVAS_SIZE: any = isMobile ? MOBILE_CANVAS_SIZE : WEB_CANVAS_SIZE;

export const mapDevices = (devices: { label: string; deviceId: string }) => ({
  label: devices.label,
  value: devices.deviceId,
});

export function getUrlParameter(sParam: string, defaultValue: null | string) {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split("&");
  let sParameterName;
  let i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined
        ? defaultValue
        : decodeURIComponent(sParameterName[1]);
    }
  }
  return defaultValue;
}

export const setMax2KForMobile = (width: number) => {
  if (!isMobile) return width;
  return Math.min(width, 2560);
};

export const stopCamera = (): void => {
  const videoEl: any = document.getElementById("userVideo");
  // now get the steam
  const stream = videoEl?.srcObject;
  // now get all tracks
  const tracks = stream?.getTracks();
  // now close each track by having forEach loop
  tracks?.forEach((track: MediaStreamTrack) => {
    // stopping every track
    track.stop();
  });
  // assign null to srcObject of video
  if (videoEl) {
    videoEl.srcObject = null;
  }
};

export const getDateFromString = (date: string) => {
  if (["-", "/"].includes(date)) return date;
  return new Date(`${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4)}`);
};

export const calculateAgeFromDate = (date: string | Date) => {
  const currentDate = new Date();
  const actualDate = new Date(date);
  // @ts-ignore
  return new Date(currentDate - actualDate).getFullYear() - 1970;
};

export const createUserID = async () => {
  const encryptedText = await sha256(Date.now().toString());
  return "INTERGALACTIC" + encryptedText;
};

export const DENIED = "Denied";
export const APPROVED = "Approved";

export const states = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
];

export enum AdditionalRequirementsEnum {
  requestSSN9 = "requestSSN9",
  requestResAddress = "requireResAddress",
  requestScanID = "requestScanID",
}

export function getStatusFromUser(user: any) {
  const { userApproved, requestScanID, requestResAddress, requestSSN9 } = user;
  if (userApproved === true) {
    return SUCCESS;
  } else if (requestResAddress || requestSSN9 || requestScanID) {
    return REQUIRES_INPUT;
  }
  return FAILURE;
}

export const navigateToUrl = (url: string, token?: string) => {
  window.open(`${url}?token=${token}`, "_self");
};
