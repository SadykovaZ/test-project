import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function createAccount() {
    if (password !== confirmPassword) {
      setError("Password and confirm password do no match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error?.message);
        return;
      }
      setError("Unexpected error");
    }
  }

  return (
    <>
      <h1>Create account</h1>
      {error && <p>{error}</p>}
      <input
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={createAccount}>Create account</button>
      <Link to="/login">Already have an account? Log In</Link>
    </>
  );
}
