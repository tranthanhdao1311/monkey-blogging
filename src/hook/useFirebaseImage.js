import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";

const useFirebaseImage = (setValue, getValues, imageName = null, cb) => {
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");

  if (!setValue || !getValues) return;

  const handleUploadImage = (file) => {
    const storage = getStorage();

    const storageRef = ref(storage, "images/" + file?.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
          default:
        }
      },
      (error) => {
        console.log("Error!");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
        });
      }
    );
  };

  const onSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("image", file.name);
    handleUploadImage(file);
  };

  const handleDeleteImage = () => {
    const storage = getStorage();

    // Create a reference to the file to delete
    const imeRef = ref(storage, "images/" + (imageName || getValues("image")));

    // Delete the file
    deleteObject(imeRef)
      .then(() => {
        // File deleted successfully
        console.log(" File deleted successfully");
        setImage("");
        setProgress(0);
        cb && cb();
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log("Uh-oh, an error occurred!");
      });
  };
  return {
    progress,
    image,
    setImage,
    handleUploadImage,
    onSelectImage,
    handleDeleteImage,
  };
};

export default useFirebaseImage;
