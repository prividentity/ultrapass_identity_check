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
export const API_KEY = "0000000000000000test";
export const osVersion = Number(Platform?.os?.version);
export const isAndroid = Platform?.os?.family === "Android";
export const isMobile = isIOS || isAndroid;
export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";
export const REQUIRES_INPUT = "REQUIRES_INPUT";
export const ERROR = "error";
export const cameraDelay = 30000;
export const AdminEmail = 'shiven@private.id';

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

export const formatPhoneInput = (value: string, previousValue?: string) => {
  if (!value) {
    return value;
  }
  const currentValue = value.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) {
      return currentValue;
    }
    if (cvLength < 7) {
      return `${currentValue.slice(0, 3)} - ${currentValue.slice(3)}`;
    }
    return `${currentValue.slice(0, 3)}-${currentValue.slice(
      3,
      5
    )}-${currentValue.slice(5, 9)}`;
  }
};

export const states = [
  { label: "Alabama", abbreviation: "AL" },
  { label: "Alaska", abbreviation: "AK" },
  { label: "Arizona", abbreviation: "AZ" },
  { label: "Arkansas", abbreviation: "AR" },
  { label: "California", abbreviation: "CA" },
  { label: "Colorado", abbreviation: "CO" },
  { label: "Connecticut", abbreviation: "CT" },
  { label: "Delaware", abbreviation: "DE" },
  { label: "Florida", abbreviation: "FL" },
  { label: "Georgia", abbreviation: "GA" },
  { label: "Hawaii", abbreviation: "HI" },
  { label: "Idaho", abbreviation: "ID" },
  { label: "Illinois", abbreviation: "IL" },
  { label: "Indiana", abbreviation: "IN" },
  { label: "Iowa", abbreviation: "IA" },
  { label: "Kansas", abbreviation: "KS" },
  { label: "Kentucky", abbreviation: "KY" },
  { label: "Louisiana", abbreviation: "LA" },
  { label: "Maine", abbreviation: "ME" },
  { label: "Maryland", abbreviation: "MD" },
  { label: "Massachusetts", abbreviation: "MA" },
  { label: "Michigan", abbreviation: "MI" },
  { label: "Minnesota", abbreviation: "MN" },
  { label: "Mississippi", abbreviation: "MS" },
  { label: "Missouri", abbreviation: "MO" },
  { label: "Montana", abbreviation: "MT" },
  { label: "Nebraska", abbreviation: "NE" },
  { label: "Nevada", abbreviation: "NV" },
  { label: "New Hampshire", abbreviation: "NH" },
  { label: "New Jersey", abbreviation: "NJ" },
  { label: "New Mexico", abbreviation: "NM" },
  { label: "New York", abbreviation: "NY" },
  { label: "North Carolina", abbreviation: "NC" },
  { label: "North Dakota", abbreviation: "ND" },
  { label: "Ohio", abbreviation: "OH" },
  { label: "Oklahoma", abbreviation: "OK" },
  { label: "Oregon", abbreviation: "OR" },
  { label: "Pennsylvania", abbreviation: "PA" },
  { label: "Rhode Island", abbreviation: "RI" },
  { label: "South Carolina", abbreviation: "SC" },
  { label: "South Dakota", abbreviation: "SD" },
  { label: "Tennessee", abbreviation: "TN" },
  { label: "Texas", abbreviation: "TX" },
  { label: "Utah", abbreviation: "UT" },
  { label: "Vermont", abbreviation: "VT" },
  { label: "Virginia", abbreviation: "VA" },
  { label: "Washington", abbreviation: "WA" },
  { label: "West Virginia", abbreviation: "WV" },
  { label: "Wisconsin", abbreviation: "WI" },
  { label: "Wyoming", abbreviation: "WY" },
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
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  window.open(`${url}?token=${token}`, "_self");
};

export const isIphoneCC = (capabilities: MediaTrackCapabilities | null) =>
  capabilities &&
  capabilities?.height?.max === 1440 &&
  capabilities?.width?.max === 1920;
