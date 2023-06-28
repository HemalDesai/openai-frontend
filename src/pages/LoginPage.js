import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";

import { useEffect } from "react";
import { auth } from "../components/firebase";

const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        router.push("/HomePage");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      router.push("/HomePage");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button
        style={{
          backgroundColor: "#4285f4",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </div>
  );
}

{
  /* <button className='button-17' onClick={signInWithGoogle}>
          Sign in with Google
      </button> */
}
