import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { auth, app, database, storage } from "../components/firebase";
import {
  getDatabase,
  ref as databaseRef,
  push,
  set as setDatabase,
} from "firebase/database";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  putString,
} from "firebase/storage";
import { decode } from "base-64";

export default function ImageGenerator() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "");
        setUserID(user.uid);
      } else {
        setUsername("");
        setUserID("");
      }
    });

    // Clean up the subscription
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/LoginPage");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const [imageUrl, setImageUrl] = useState("");
  const [imageUrldb, setImageUrldb] = useState("");
  const [prompt, setPrompt] = useState("");
  const [savedImageUrl, setSavedImageUrl] = useState("");

  const generateImage = async () => {
    try {
      const response = await fetch("https://openai-nzsc.onrender.com/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await response.json();
      console.log(data);
      setImageUrldb(data.photo);
      setImageUrl(`data:image/jpeg;base64,${data.photo}`);
      console.log(imageUrl);

      const storageRef = ref(storage, `images/${userID}/${Date.now()}.jpg`);
      const byteCharacters = atob(data.photo);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: "image/jpeg" });

      // Upload the Blob to Firebase Storage
      await uploadBytes(storageRef, blob, "data_url");

      console.log("Image uploaded to Firebase Storage!");

      // ...existing code...
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="welcome-text">Welcome {username}</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="input"
      />
      <div className="button-container">
        <button onClick={generateImage} className="button">
          Generate Image
        </button>
        <button onClick={() => handleLogout()} className="button">
          Logout
        </button>
      </div>

      <a href="/Gallery" className="gallery-link">
        Gallery
      </a>
      {imageUrl && (
        <img src={imageUrl} alt="Generated Image" className="image" />
      )}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }

        .welcome-text {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }

        .input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .button-container {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .button {
          padding: 10px 20px;
          background-color: #f3fe39;
          color: black;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-right: 10px;
          margin-bottom: 10px;
        }

        .gallery-link {
          text-decoration: none;
          color: #333;
          background-color: #f3fe39;
          padding: 10px 20px;
          border-radius: 4px;
        }

        .gallery-link:hover {
          text-decoration: underline;
        }

        .image {
          max-width: 100%;
          margin-top: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
