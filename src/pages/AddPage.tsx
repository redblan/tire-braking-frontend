import "./AddPage.css";
import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { ModelViewer } from "../components/ModelViewer";
import { DEFAULT_IMAGE, DEFAULT_MODEL, mediaUrl } from "../config";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createTireCondition,
  fetchDraftTireCondition,
  publishTireCondition,
} from "../store/draftSlice";

// Добавление услуги в два шага: «Далее» создаёт черновик (название, фото, 3D модель),
// «Опубликовать» заполняет описание и оба коэффициента
export const AddPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { draft, loading, error } = useAppSelector((state) => state.draft);

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [model, setModel] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [muTire, setMuTire] = useState("");
  const [muSurface, setMuSurface] = useState("");

  // есть ли у пользователя черновик — от этого зависит, какой шаг показать
  useEffect(() => {
    if (isAuthenticated) dispatch(fetchDraftTireCondition());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="addPage">
        <Alert variant="warning">Добавлять услуги может только авторизованный пользователь.</Alert>
        <Button onClick={() => navigate(ROUTES.LOGIN)}>Войти</Button>
      </div>
    );
  }

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    if (!image || !model) return;
    dispatch(createTireCondition({ name, image, model }));
  };

  const handlePublish = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    const result = await dispatch(
      publishTireCondition({
        id: draft.id,
        description,
        description_en: descriptionEn.trim(),
        mu_tire: Number(muTire.replace(",", ".")),
        mu_surface: Number(muSurface.replace(",", ".")),
      }),
    );
    if (publishTireCondition.fulfilled.match(result)) {
      navigate(ROUTES.TILES);
    }
  };

  if (draft) {
    return (
      <Form className="addPage" onSubmit={handlePublish}>
        <img
          className="addPreview"
          src={mediaUrl(draft.image_url, DEFAULT_IMAGE)}
          alt={draft.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = DEFAULT_IMAGE;
          }}
        />
        <div className="addModel">
          <ModelViewer
            modelUrl={mediaUrl(draft.model_url, DEFAULT_MODEL)}
            angleX={draft.angle_x}
            angleY={draft.angle_y}
          />
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Control value={draft.name} readOnly />
        <Form.Control
          placeholder="Коэфф. сцепления шины"
          value={muTire}
          onChange={(event) => setMuTire(event.target.value)}
          required
        />
        <Form.Control
          placeholder="Коэфф. сцепления покрытия"
          value={muSurface}
          onChange={(event) => setMuSurface(event.target.value)}
          required
        />
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Описание"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <Form.Control
          placeholder="Краткое описание на английском (50–100 символов)"
          value={descriptionEn}
          minLength={50}
          maxLength={100}
          onChange={(event) => setDescriptionEn(event.target.value)}
        />
        <Button type="submit" disabled={loading}>
          Опубликовать
        </Button>
      </Form>
    );
  }

  return (
    <Form className="addPage" onSubmit={handleCreate}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group>
        <Form.Label>Фото</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          required
          onChange={(event) => setImage((event.target as HTMLInputElement).files?.[0] ?? null)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>3D модель (.glb)</Form.Label>
        <Form.Control
          type="file"
          accept=".glb,model/gltf-binary"
          required
          onChange={(event) => setModel((event.target as HTMLInputElement).files?.[0] ?? null)}
        />
      </Form.Group>
      <Form.Control
        placeholder="Название"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        Далее
      </Button>
    </Form>
  );
};
