import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "styled-components";

import * as tmImage from "@teachablemachine/image";

import Form from "./components/Form";
import Grid from "./components/Grid";
import Rodape from "./components/Rodape";

import { db } from "./firebaseConfig";

import GlobalStyle from "./styles/global";

// ========================================
// ESTILOS
// ========================================

const Container = styled.div`
  width: 100%;
  margin-top: 20px;

  display: flex;
  flex-direction: column;

  align-items: center;

  gap: 10px;

  margin-left: 20px;
`;

const Title = styled.h2``;

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  margin-top: 40px;
  margin-bottom: 100px;

  background-color: #f8f9fa;

  border-radius: 12px;

  padding: 20px;

  width: 420px;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const VideoStream = styled.img`
  width: 380px;
  height: 280px;

  object-fit: cover;

  border-radius: 12px;

  border: 3px solid #3cb371;

  background: #000;
`;

const StatusText = styled.p`
  color: #555;

  margin-top: 15px;

  font-style: italic;
`;

const ResultText = styled.h2`
  color: #222;

  margin-top: 20px;
`;

const ConfidenceText = styled.p`
  color: #3cb371;

  font-size: 18px;

  font-weight: bold;
`;

// ========================================
// CAMERA STREAM ESP32
// ========================================

const CameraStream = () => {

  // ========================================
  // COLOQUE O IP DA SUA ESP32 AQUI
  // ========================================

  const CAMERA_IP = "192.168.0.148";

  const imageRef = useRef(null);

  const modelRef = useRef(null);

  const [status, setStatus] =
    useState("Carregando IA...");

  const [classe, setClasse] =
    useState("Aguardando...");

  const [confidence, setConfidence] =
    useState("");

  // ========================================
  // CARREGA MODELO IA
  // ========================================

  useEffect(() => {

    async function loadModel() {

      try {

        const BASE_URL =
          "https://teachablemachine.withgoogle.com/models/CSjC4XeyL/";

        const modelURL =
          BASE_URL + "model.json";

        const metadataURL =
          BASE_URL + "metadata.json";

        const model =
          await tmImage.load(
            modelURL,
            metadataURL
          );

        modelRef.current = model;

        setStatus(
          "Modelo carregado"
        );

        console.log(
          "Modelo carregado"
        );

      } catch (err) {

        console.error(err);

        setStatus(
          "Erro ao carregar IA"
        );
      }
    }

    loadModel();

  }, []);

  // ========================================
  // CLASSIFICAÇÃO
  // ========================================

  useEffect(() => {

    const interval = setInterval(
      async () => {

        if (
          !modelRef.current ||
          !imageRef.current
        ) {
          return;
        }

        try {

          const prediction =
            await modelRef.current.predict(
              imageRef.current
            );

          prediction.sort(
            (a, b) =>
              b.probability -
              a.probability
          );

          const best =
            prediction[0];

          setClasse(
            best.className
          );

          setConfidence(
            (
              best.probability * 100
            ).toFixed(1)
          );

          setStatus(
            "Classificação ativa"
          );

        } catch (err) {

          console.error(err);

          setStatus(
            "Erro na classificação"
          );
        }

      },

      1500
    );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <CameraContainer>

      <h3>
        Classificação ESP32-CAM
      </h3>

      {/* STREAM DA ESP32 */}

      <VideoStream
        ref={imageRef}
        src={`http://${CAMERA_IP}:81/stream`}
        alt="ESP32 Stream"
        crossOrigin="anonymous"
      />

      <StatusText>
        {status}
      </StatusText>

      <ResultText>
        {classe}
      </ResultText>

      <ConfidenceText>
        Confiança: {confidence}%
      </ConfidenceText>

    </CameraContainer>
  );
};

// ========================================
// APP PRINCIPAL
// ========================================

function App() {

  const [users, setUsers] =
    useState([]);

  const [onEdit, setOnEdit] =
    useState(null);

  // ========================================
  // FIREBASE
  // ========================================

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(db, "users"),

        (snapshot) => {

          const usersList =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setUsers(

            usersList.sort(
              (a, b) =>

                a.nome > b.nome
                  ? 1
                  : -1
            )
          );
        },

        (error) => {

          toast.error(
            "Erro: " +
              error.message
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  return (
    <>

      <Container>

        <Title>
          CADASTRO PONTO DE ENTREGA
          VOLUNTÁRIA
        </Title>

        <Form
          onEdit={onEdit}
          setOnEdit={setOnEdit}
        />

        <br />

        <Title>
          PONTOS DE ENTREGA
          VOLUNTÁRIA
        </Title>

        <Grid
          users={users}
          setUsers={setUsers}
          setOnEdit={setOnEdit}
          hideIcons={false}
        />

        {/* CAMERA IA */}

        <CameraStream />

      </Container>

      <ToastContainer
        autoClose={3000}
        position="bottom-left"
      />

      <GlobalStyle />

      <Rodape />

    </>
  );
}

export default App;