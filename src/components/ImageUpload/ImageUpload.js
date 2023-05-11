import React, { Fragment } from "react";
import classNames from "classnames/bind";
import styles from "./ImageUpload.module.scss";
import images from "../../asset/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
const ImageUpload = ({
  name,
  className = "",
  typeLoad,
  progress = 0,
  image = "",
  control,
  handleDeleteImage = () => {},
  ...props
}) => {
  return (
    <>
      <label htmlFor="image" className={cx("label-upload-file", className)}>
        <input
          name="image"
          id="image"
          type="file"
          onChange={() => {}}
          control={control}
          {...props}
        ></input>
        {!image && progress === 0 && (
          <>
            <div className={cx("image-upload")}>
              <img src={images.imgUpload} alt="" />
              <p>Choose Photo</p>
            </div>
          </>
        )}
        {!image && progress !== 0 && <div className={cx("spinner")}></div>}

        {image && (
          <Fragment>
            <img className={cx("image")} src={image} alt="" />
            <button
              type="button"
              className={cx("btn-trash-img")}
              onClick={handleDeleteImage}
            >
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </button>
          </Fragment>
        )}

        {!image && (
          <div
            className={cx("upload-image-post")}
            style={{
              width: `${Math.ceil(progress)}%`,
            }}
          ></div>
        )}
      </label>
    </>
  );
};

export default ImageUpload;
