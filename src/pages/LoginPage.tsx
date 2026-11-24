import "./LoginPage.css";
import { FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import axios from "axios";
import { api } from "../api";
import { TOKEN_KEY } from "../AppLayout";
import { API_BASE_URL } from "../config";
import { ROUTES } from "../Routes";
import { useAppDispatch } from "../store";
import { loginSuccess } from "../store/authSlice";

export const LoginPage: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Вход: только axios, без кодогенерации и thunk; состояние в Redux передаётся вручную
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post<{ access_token: string }>(`${API_BASE_URL}/api/auth`, {
        username,
        password,
      });
      const token = response.data.access_token;
      localStorage.setItem(TOKEN_KEY, token);
      api.setSecurityData(token);
      dispatch(loginSuccess({ username, token }));
      navigate(ROUTES.TILES);
    } catch {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="loginPage" onSubmit={handleSubmit}>
      <h1 className="loginTitle">Вход</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Control
        placeholder="Логин"
        value={username}
        autoComplete="username"
        onChange={(event) => setUsername(event.target.value)}
        required
      />
      <Form.Control
        type="password"
        placeholder="Пароль"
        value={password}
        autoComplete="current-password"
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        Войти
      </Button>
    </Form>
  );
};
