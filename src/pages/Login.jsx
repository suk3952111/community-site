import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useToggle from "../hooks/useToggle";
import "./Login.css";
import { supabase } from "@/main";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const [showPassword, toggleShowPassword] = useToggle(false);
  const navigate = useNavigate();

  const onSubmit = async (formData, e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        setLoginError(error.message);
      } else {
        localStorage.removeItem("user");
        navigate("/");
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>이메일:</label>
          <input
            type="text"
            {...register("email", {
              required: "Email ID를 입력해주세요",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "올바른 이메일 형식이 아닙니다.",
              },
              minLength: {
                value: 6,
                message: "이메일은 최소 6자 이상이어야 합니다.",
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div>
          <label>비밀번호:</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                minLength: {
                  value: 8,
                  message: "비밀번호는 최소 8자 이상이어야 합니다.",
                },
              })}
            />
          </div>
          <button type="button" onClick={toggleShowPassword}>
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>
        {loginError && <p className="error">{loginError}</p>}
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
