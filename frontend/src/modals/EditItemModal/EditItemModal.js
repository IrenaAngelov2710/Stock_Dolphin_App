import "./EditItemModal.css";
import React, { useEffect, useState, useContext } from "react";
import closeIcon from "../../assets/icons/close-icon.svg";
import GreenButton from "../../components/GreenButton/GreenButton";
import GreyButton from "../../components/GreyButton/GreyButton";
import addPhotoIcon from "../../assets/icons/add-photo-icon.svg";
import AuthContext from "../../utils/AuthContext";

const EditItemModal = ({ item, show, close, updateItem }) => {
  const { authToken } = useContext(AuthContext);
  const [name, setName] = useState(item?.name || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setImagePreview(`http://localhost:3000/${item.image || ""}`);
    }
  }, [item]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Show the new image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`http://localhost:3000/items/${item._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const updatedItem = await response.json();
      updateItem(updatedItem.item);

      close();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // to render the buttons conditionally
  const hasChanges = () => {
    return name !== item?.name || imageFile !== null;
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <div className={`modal ${show ? "show" : ""}`}>
        <div className="modal-header">
          <span className="modal-header-name">Edit Item</span>
          <span className="close-btn" onClick={close}>
            <img src={closeIcon} alt="" />
          </span>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="edit-form modal-form">
            <input
              className="form-name"
              value={name}
              type="text"
              id="itemName"
              name="itemName"
              onChange={(e) => setName(e.target.value)}
            />
            <div className="line-divider"></div>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt=""
                className="category-image-preview"
              />
            ) : (
              <img src={addPhotoIcon} alt="" />
            )}
            <div className="add-photo-input">
              <span>(Change Photo, 2MB Total)</span>
              <input
                type="file"
                id="itemImage"
                name="itemImage"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="line-divider"></div>
            {hasChanges() && (
              <div className="button-options">
                <GreyButton text="CANCEL" onClick={close} />
                <GreenButton text="save changes" type="submit" />
              </div>
            )}
          </form>
        </div>
      </div>
      <div className={`${show ? "modal-background" : ""}`}></div>
    </>
  );
};

export default EditItemModal;