export const getBackDocumentMessage = (id: number) => {
    switch(id){
        case 0:
            return "Success"
        case -12:
        case -1:
            return "Please show the back of DL in the camera screen"
        case 3:
            return "Reading barcode data, Please hold"
        case -9:
            return "Image is blurry. Please try to move DL closer or further."
        case -2:
            return "Api key issue"
        default:
            return ""
    }
}


export const getScanFrontMessage = (status: number) => {
    switch(status){
        case 0:
            return "Success"
        case -12:
        case -1:
            return "Please show the front of your DL in the camera screen"
        case 3:
        case 999:
            return "Please hold position."
        case -9:
            return "Image is blurry. Please try to move DL closer or further."
        case -2:
            return "Api key issue"
        default:
            return ""
    }
}