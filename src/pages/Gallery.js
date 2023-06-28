import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { auth, app, database, storage } from "../components/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Images() {
  const [imageUrls, setImageUrls] = useState([]);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid);
      } else {
        setUserID("");
      }
    });

    // Clean up the subscription

    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, `images/${userID}`);
        const imagesList = await listAll(storageRef);
        const urls = await Promise.all(
          imagesList.items.map((item) => getDownloadURL(item))
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
    return () => {
      unsubscribe();
    };
  }, [userID]);

  return (
    <div>
      <h1 className="title">Your Images</h1>
      <div className="imageContainer">
        {imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Image ${index}`} className="image" />
        ))}
      </div>

      <style jsx>{`
        .title {
          font-family: "Arial", sans-serif;
          font-size: 24px;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }

        .imageContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .image {
          max-width: 200px;
          height: auto;
          margin: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
