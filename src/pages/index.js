import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../components/firebase";
import { initializeApp } from "firebase/app";
import HomePage from "@/pages/HomePage";

const IndexPage = () => {
  const [user, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/LoginPage"); // Redirect to the login page if the user is not logged in
    }
  }, [user, router]);

  return <HomePage />;
};

export default IndexPage;
