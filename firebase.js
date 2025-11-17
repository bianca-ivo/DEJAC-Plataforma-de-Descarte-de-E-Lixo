import admin from 'firebase-admin';
import serviceAccount from './firebase-service-account.json' assert { type: 'json' };


// Inicializa apenas se ainda não foi inicializado
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://dejac-new.firebaseio.com"  
    });
}

const db = admin.firestore();

// Exporte ambos corretamente
export { db };          // exportação nomeada
export default admin;   // exportação default