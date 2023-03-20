export const getBackDocumentMessage = (id: number) => {
  switch (id) {
    case 0:
      return "Success";
    case -12:
    case -1:
      return "MOVE CLOSER";
    case 3:
    case 10:
      return "ALMOST DONE . . .";
    case -9:
      return "TOO BLURRY. PLEASE MOVE BACK";
    case -2:
      return "SYSTEM ERROR. Please try again later.";
    default:
      return "";
  }
};

export const getScanFrontMessage = (status: number) => {
  console.log("MESSAGE STATUS??? ", status);
  switch (status) {
    case 0:
      return "Success";
    case 12:
    case -1:
    case 18:
      return "MOVE CLOSER";
    case 3:
    case 999:
      return "MOVE JUST A LITTLE CLOSER";
    case 5:
    case 6:
    case 7:
    case 8:
      return "";
    case 9:
      return "TOO BLURRY PLEASE MOVE BACK";
    case -2:
      return "SYSTEM ERROR. Please try again later.";
    default:
      return "";
  }
};
