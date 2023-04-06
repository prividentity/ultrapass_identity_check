export const getBackDocumentMessage = (id: number) => {
  switch (id) {
    case 0:
      return "Success";
    case 12:
      return "";
    case -1:
    case 10:
      return "MOVE CLOSER TO BARCODE";
    case 3:
      return "ALMOST DONE . . .";
    case 4:
      return "MOVE JUST A LITTLE CLOSER";
    case 18:
      return "Ensure the entire barcode is in the screen";
    case 9:
      return "TOO BLURRY";
    case -2:
      return "SYSTEM ERROR. Please try again later.";
    default:
      return "";
  }
};

export const getScanFrontMessage = (status: number) => {
  switch (status) {
    case 0:
      return "Success";
    case 12:
      return "";
    case -1:
      return "MOVE CLOSER";
    case 18:
      return "Please show all 4 corners & edges of document in the screen";
    case 3:
      return "ALMOST DONE . . .";
    case 4:
      return "MOVE JUST A LITTLE CLOSER";
    case 9:
      return "TOO BLURRY";
    case -2:
      return "SYSTEM ERROR. Please try again later.";
    case 5:
    case 6:
    case 7:
    case 8:
      return "";
    default:
      return "";
  }
};

export const getScanFrontColor = (status: number) => {
  switch (status) {
    case 10:
    case 0:
      return "rgb(21, 182, 124)";
    case 12:
      return "";
    case -1:
      return "#000";
    case 18:
      return "#000";
    case 3:
      return "rgb(21, 182, 124)";
    // case 4:
    //   return "MOVE JUST A LITTLE CLOSER";
    case 7:
    case 9:
      return "rgba(246,62,62,.4392156862745098)";
    case -2:
      return "rgba(246,62,62,.4392156862745098)";
    case 5:
    case 6:
    case 8:
      return "#000";
    default:
      return "#000";
  }
};

export const getScanBackColor = (status: number) => {
  switch (status) {
    case 0:
      return "rgb(21, 182, 124)";
    case 12:
      return "";
    case -1:
      return "#000";
    case 18:
      return "#000";
    case 3:
      return "rgb(21, 182, 124)";
    // case 4:
    //   return "MOVE JUST A LITTLE CLOSER";
    case 7:
    case 9:
      return "rgba(246,62,62,.4392156862745098)";
    case -2:
      return "rgba(246,62,62,.4392156862745098)";
    case 5:
    case 6:
    case 8:
      return "#000";
    default:
      return "#000";
  }
};


export const ELEMENT_ID = "userVideo";
export const MAX_VERIFY_COUNTS = 3;
