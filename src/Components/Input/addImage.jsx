import React, { useState, useContext } from "react";
import { storage } from "../../Firebase/Firebase";
import { InventoryContext } from "../../Services/Context/Inventory";
const AddImage = () => {
  const [imageAsFile, setImageAsFile] = useState("");

  const inventory = useContext(InventoryContext);
  const { changeInputState } = useContext(InventoryContext);
  const { images } = inventory.state.input;
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };
  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log("start of upload");
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            changeInputState({ images: [...images, fireBaseUrl] });
          });
      }
    );
  };

  return (
    <div className="add-item">
      <form onSubmit={handleFireBaseUpload}>
        <input type="file" onChange={handleImageAsFile} />
        <button>Upload Picture</button>
      </form>
    </div>
  );
};

export default AddImage;
