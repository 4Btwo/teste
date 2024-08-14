// Importe as bibliotecas necessárias do Firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

// Configurações do Firebase (obtenha essas configurações do console do Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyA8JmSF_YWt3_n9TbU2EFXjcdo2J7zvxUs",
    authDomain: "tolly-13344.firebaseapp.com",
    projectId: "tolly-13344",
    storageBucket: "tolly-13344.appspot.com",
    messagingSenderId: "295767740497",
    appId: "1:295767740497:web:5106369eab0090ea6e6870",
    measurementId: "G-N1PSH9B4S2"
};

firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

    const profilePic = document.getElementById('profile-image');
    const profilePicUpload = document.getElementById('profile-pic-upload');
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');
    const saveProfile = document.getElementById('save-profile');

    auth.onAuthStateChanged(user => {
        if (user) {
            const userId = user.uid;

            // Carregar informações do usuário
            db.collection('users').doc(userId).get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    profileName.value = userData.name || '';
                    profileBio.value = userData.bio || '';
                    if (userData.profilePicUrl) {
                        profilePic.src = userData.profilePicUrl;
                    }
                }
            });

            // Atualizar foto de perfil
            profilePicUpload.addEventListener('change', function(event) {
                const file = event.target.files[0];
                const storageRef = storage.ref('profile_pics/' + userId);
                storageRef.put(file).then(() => {
                    storageRef.getDownloadURL().then(url => {
                        profilePic.src = url;
                        db.collection('users').doc(userId).update({
                            profilePicUrl: url
                        });
                    });
                });
            });

            // Salvar perfil
            saveProfile.addEventListener('click', function() {
                const name = profileName.value;
                const bio = profileBio.value;

                db.collection('users').doc(userId).set({
                    name: name,
                    bio: bio
                }, { merge: true }).then(() => {
                    alert('Perfil atualizado com sucesso!');
                }).catch(error => {
                    console.error('Erro ao atualizar o perfil: ', error);
                });
            });
        } else {
            // Redirecionar para a página de login se não estiver logado
            window.location.href = 'login.html';
        }
    });
});
