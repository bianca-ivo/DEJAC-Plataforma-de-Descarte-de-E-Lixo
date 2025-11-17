import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Form from "./components/Form";
import Grid from "./components/Grid";
import Rodape from "./components/Rodape";
import { db } from "./firebaseConfig";
import GlobalStyle from "./styles/global";

// =================== ESTILOS =================== //
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const VideoStream = styled.img`
  width: 100%;
  max-width: 640px;
  border-radius: 12px;
  border: 3px solid #3cb371;
  background: #000;
`;

const StatusText = styled.p`
  color: #555;
  margin-top: 15px;
  font-style: italic;
`;

// =================== FUNÇÃO KNN =================== //
function knnClassify(testVector, dataset, k = 3) {
  const distances = [];
  for (const item of dataset) {
    let dist = 0;
    for (let i = 0; i < item.features.length; i++) {
      dist += (item.features[i] - testVector[i]) ** 2;
    }
    distances.push({ label: item.label, dist: Math.sqrt(dist) });
  }
  distances.sort((a, b) => a.dist - b.dist);
  const topK = distances.slice(0, k);

  const votes = {};
  for (const t of topK) votes[t.label] = (votes[t.label] || 0) + 1;

  let bestLabel = null;
  let bestVotes = -1;
  for (const label in votes) {
    if (votes[label] > bestVotes) {
      bestLabel = label;
      bestVotes = votes[label];
    }
  }
  return bestLabel;
}

// =================== COMPONENTE CAMERA =================== //
const CameraStream = ({ cameraIP, dataset, setClasse, classe }) => {
  const streamRef = useRef(null);
  const [status, setStatus] = useState("Conectando à câmera...");

  useEffect(() => {
    const img = streamRef.current;
    if (!img) return;

    let isMounted = true;

    const startStream = () => {
      if (!isMounted) return;
      img.src = `http://${cameraIP}/stream?cacheBust=${Date.now()}`;
    };

    const handleLoad = () => { if (!isMounted) return; setStatus("Câmera conectada"); };
    const handleError = () => { if (!isMounted) return; setStatus("Tentando reconectar..."); setTimeout(startStream, 3000); };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    startStream();

    return () => {
      isMounted = false;
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [cameraIP]);

  // Captura e classifica automaticamente quando o componente monta e dataset estiver carregado
  useEffect(() => {
    if (!dataset || dataset.length === 0) return;

    const classifyFrame = async () => {
      try {
        const resp = await fetch(`http://${cameraIP}/capture`);
        const json = await resp.json();
        const features = json.features;
        const label = knnClassify(features, dataset, 3);
        setClasse(label);
      } catch (err) {
        console.error(err);
        setClasse("Erro ao classificar");
      }
    };

    const interval = setInterval(classifyFrame, 3000); // captura a cada 3 segundos
    return () => clearInterval(interval);
  }, [cameraIP, dataset, setClasse]);

  return (
    <CameraContainer>
      <h3>Visualização da Câmera</h3>
      <VideoStream ref={streamRef} alt="ESP32-CAM Stream" />
      <StatusText>{status}</StatusText>
      <p style={{ fontSize: "22px", marginTop: "20px" }}>
        Classe detectada: <strong>{classe}</strong>
      </p>
    </CameraContainer>
  );
};

// =================== COMPONENTE PRINCIPAL =================== //
function App() {
  const CAMERA_IP = "192.168.0.148";
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [dataset, setDataset] = useState([]);
  const [classe, setClasse] = useState("Aguardando...");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    }, (error) => {
      toast.error("Erro ao carregar usuários: " + error.message);
    });
    return () => unsubscribe();
  }, []);

  // Carrega dataset JSON
  useEffect(() => {
    async function loadDataset() {
      const files = ["bateria-pilha.json", "fontes.json"];
      let combined = [];
      for (const file of files) {
        const res = await fetch(`/modelo/${file}`);
        const data = await res.json();
        combined = combined.concat(data);
      }
      setDataset(combined);
    }
    loadDataset();
  }, []);

  return (
    <>
      <Container>
        <Title>CADASTRO PONTO DE ENTREGA VOLUNTÁRIA</Title>
        <Form onEdit={onEdit} setOnEdit={setOnEdit} />
        <br />
        <Title>PONTOS DE ENTREGA VOLUNTÁRIA CADASTRADOS</Title>
        <Grid users={users} setUsers={setUsers} setOnEdit={setOnEdit} hideIcons={false} />

        {/* CAMERA */}
        <CameraStream
          cameraIP={CAMERA_IP}
          dataset={dataset}
          setClasse={setClasse}
          classe={classe}
        />
      </Container>
      <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
      <Rodape />
    </>
  );
}

export default App;
