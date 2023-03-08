export const getBackDocumentMessage = (id: number) => {
    switch(id){
        case 0:
            return "Success"
        case -12:
        case -1:
            return "Invalid Image"
        case 3:
            return "Reading barcode data, Please hold"
        case -9:
            return "Blurry Image"
        case -2:
            return "Api key issue"
        default:
            return ""
    }
}
