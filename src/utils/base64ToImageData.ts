async function convertBase64ToImageData(imageSrc: string, setImageData: any) {
  const newImg = new Image();
  newImg.src = imageSrc;
  newImg.onload = async () => {
    const imgSize = {
      w: newImg.width,
      h: newImg.height,
    };
    // alert(imgSize.w + " " + imgSize.h);
    const canvas = document.createElement("canvas");
    canvas.width = imgSize.w;
    canvas.height = imgSize.h;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(newImg, 0, 0);
    const imageData = ctx?.getImageData(0, 0, imgSize.w, imgSize.h);
    setImageData(imageData);
  };
}

export { convertBase64ToImageData };
