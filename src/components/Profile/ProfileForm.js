import { useContext, useRef } from "react";
import classes from "./ProfileForm.module.css";
import AuthContext from "../store/auth-context";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
  const newPassswordInputRef = useRef();
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const submitHandler = (event) => {
    event.preventDefault();
    const newPasswordInput = newPassswordInputRef.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB8qdGi95pneyLjvFssPvrgKxxOlaipo8c",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: newPasswordInput,
          returnSecureToken: false,
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res=>{
history.replace('/');
      })
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" minLength='7' ref={newPassswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
