// Imports do Firebase
import { database, auth } from "../config/FirebaseConfig.js";
import {
  ref,
  onValue,
  push,
  set,
  remove
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";



let userId = null;
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    console.log("Usuário autenticado:", userId);
    carregarGeofences(userId);
  } else {
    console.log("Usuário não autenticado");
    window.location.href = "../pages/login.html";
  }
});



let geofences = [];
let geofenceCircles = [];
let modoGeofence = false;
let googleMap;
let petMarker = null;
let lastGeofenceCheck = false; 



// Funções de modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";

  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.style.display = "none";
}

const openBtn = document.getElementById("geofencesBtn");
const modal = document.getElementById("modalRecovery");
const overlay = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("closeModal");

if (openBtn && modal && overlay && closeBtn) {
  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    overlay.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    overlay.style.display = "none";
  });
}



// Inicializa o mapa
export function initMap() {
  const pos = { lat: -12.9714, lng: -38.5014 };

  googleMap = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: pos,
  });

  petMarker = new google.maps.Marker({
    position: pos,
    map: googleMap,
    icon: {
      url: "../imgs/marker.svg",
      scaledSize: new google.maps.Size(30, 30),
    },
  });



  // Escuta localização no Firebase
  const localizacaoRef = ref(database, "localizacao_atual");
  onValue(
    localizacaoRef,
    (snapshot) => {
      const dados = snapshot.val();
      if (dados?.lat && dados?.lng) {
        const novaPos = { lat: dados.lat, lng: dados.lng };
        petMarker.setPosition(novaPos);
        googleMap.setCenter(novaPos);
      }
    },
    (error) => {
      console.error("Erro ao escutar localização: ", error);
    }
  );

  configurarClickMapa();
  monitorarLocalizacao();
}




// Carregar geofences do Firebase
function carregarGeofences(userId) {
  console.log(`Carregando geofences para usuário ${userId}`);
  const geofenceRef = ref(database, `/usuarios/${userId}/geofences`);

  onValue(geofenceRef, (snapshot) => {
    const dados = snapshot.val();
    console.log("Dados recebidos do snapshot:", dados);

    geofences = [];

    if (dados) {
      Object.keys(dados).forEach((key) => {
        geofences.push({ id: key, ...dados[key] });
      });

      console.log(`Total de zonas carregadas: ${geofences.length}`);
      desenharGeofences();
      mostrarGeofence();
      monitorarLocalizacao();
    } else {
      mostrarGeofence();
      console.log("Nenhuma zona segura encontrada para o usuário.");
      geofenceCircles.forEach((c) => c.setMap(null));
      geofenceCircles = [];
    }
  });
}





// Desenhar geofences no mapa 
function desenharGeofences() {
  console.log("Desenhando zonas seguras no mapa...");
  geofenceCircles.forEach((circle) => circle.setMap(null));
  geofenceCircles = [];

  geofences.forEach((zone) => {
    const circle = new google.maps.Circle({
      strokeColor: "#001764ff",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#001764ff",
      fillOpacity: 0.15,
      map: googleMap,
      center: { lat: zone.lat, lng: zone.lng },
      radius: zone.radius,
    });

    geofenceCircles.push(circle);
  });
}






// Clique no mapa para criar geofence
function configurarClickMapa() {
  google.maps.event.addListener(googleMap, "click", (event) => {
    if (modoGeofence) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const radius =
        parseInt(document.getElementById("geofenceRadius").value) || 100;
        const local =
        document.getElementById("geofenceLocal").value;

      salvarGeofence(lat, lng, radius, local);
      modoGeofence = false;
      googleMap.setOptions({ cursor: "default" });
    }
  });
}





// Ativar modo geofence
function ativarModoGeofence() {
  modoGeofence = true;
  googleMap.setOptions({ cursor: "crosshair" });
  showAlert('Clique no mapa para definir a zona segura', 'success');
  closeModal("modalRecovery");
}
document.getElementById("btnAdicionarZona").addEventListener("click", ativarModoGeofence);





// Salvar geofence no Firebase
function salvarGeofence(lat, lng, radius, local) {
  const userId = auth.currentUser ? auth.currentUser.uid : "default";
  const geofenceRef = ref(database, `/usuarios/${userId}/geofences`);
  if (!userId) return alert("Usuário não detectado!");
  const newGeofenceRef = push(geofenceRef);

  set(newGeofenceRef, {
    lat,
    lng,
    radius,
    local,
    index: geofences.length + 1,
    ativa: true,
    criada_em: Date.now(),
  })
    .then(() => {
      console.log("Zona segura criada com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao criar zona:", error.message);
    });
}
window.salvarGeofence = salvarGeofence;








// Mostrar lista de geofences
function mostrarGeofence() {
  const geofenceList = document.getElementById("geofence-list");

  if (geofences.length === 0) {
    geofenceList.innerHTML =
      '<div class="no-history">Nenhuma zona criada ainda</div>';
  } else {
    geofenceList.innerHTML = "";

    geofences.forEach((zone, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "geofence-item" + (zone.ativa ? " active" : "");

        itemDiv.innerHTML = `
          <div class="geofence-info">
            <div class="geofence-items-notes">
              <span>${index + 1}</span>
              <span>${zone.local}</span>
              <span>${zone.radius}m</span>
              <span>${zone.lat.toFixed(6)}</span>
              <span>${zone.lng.toFixed(6)}</span>
            </div>
          </div>
          <div class="geofence-actions">
            <button class="btn-small btn-primary" onclick="centralizarZona(${index})">Ver</button>
            <button class="btn-small btn-danger" onclick="excluirZona('${zone.id}')">Excluir</button>
          </div>
        `;

      geofenceList.appendChild(itemDiv);
    });
  }

  modal.classList.add("active");
}








// Centralizar mapa na zona
function centralizarZona(index) {
  const zone = geofences[index];
  googleMap.setCenter({ lat: zone.lat, lng: zone.lng });
  googleMap.setZoom(16);
  closeModal("modalRecovery");
}
window.centralizarZona = centralizarZona;







// Excluir geofence
function excluirZona(zoneId) {
  if (confirm("Tem certeza que deseja excluir esta zona segura?")) {
    const userId = auth.currentUser ? auth.currentUser.uid : "default";
    const zoneRef = ref(database, `/usuarios/${userId}/geofences/${zoneId}`);

    remove(zoneRef)
      .then(() => {
        console.log("Zona excluída com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao excluir zona:", error.message);
      });
  }
}
window.excluirZona = excluirZona;





// Verificar se posição está dentro de geofence
function verificarGeofences(posicao) {
    console.log('verificarGeofences foi chamada com:', posicao);
    console.log('Geofences:', geofences);
  if (!posicao || geofences.length === 0) return;

  let dentroDeAlgumaZona = false;

  geofences.forEach((zone) => {
    if (!zone.ativa) return;

    const distancia = calcularDistancia(
      posicao.lat,
      posicao.lng,
      zone.lat,
      zone.lng
    );

    console.log(`Distância: ${distancia.toFixed(2)} m, Raio: ${zone.radius} m`);

    if (distancia <= zone.radius) {
      dentroDeAlgumaZona = true;
      console.log(`Dentro da zona segura: ${zone.local}`);
    }
  });

  if (dentroDeAlgumaZona !== lastGeofenceCheck) {
    if (dentroDeAlgumaZona) {
      showAlert("Entrada na zona segura detectada!", "success");
    } else {
      showAlert("Saída da zona segura detectada!", "error");
    }
  }

  lastGeofenceCheck = dentroDeAlgumaZona;
}


function atualizarInterfaceLocalizacao(dados) {
  const pos = { lat: dados.lat, lng: dados.lng };
  if (petMarker) {
    petMarker.setPosition(pos);
  }
  if (googleMap) {
    googleMap.setCenter(pos);
  }

}




function calcularDistancia(lat1, lng1, lat2, lng2) {

  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}








function monitorarLocalizacao() {
  const localizacaoRef = ref(database, "localizacao_atual");
  onValue(localizacaoRef, (snapshot) => {
    const dados = snapshot.val();
    if (dados && dados.lat && dados.lng) {
      atualizarInterfaceLocalizacao(dados);
      verificarGeofences({ lat: dados.lat, lng: dados.lng });
    } else {
      document.getElementById("lastUpdate").textContent = "Aguardando dados do GPS...";
      document.getElementById("coordinates").textContent = "Nenhuma localização recebida";
      document.getElementById("statusBadge").textContent = "Aguardando GPS";
      document.getElementById("statusBadge").className = "status-badge status-offline";
    }
  }, (error) => {
    console.error("Erro ao monitorar localização:", error);
    document.getElementById("lastUpdate").textContent = "Erro ao conectar";
    document.getElementById("statusBadge").textContent = "Erro";
    document.getElementById("statusBadge").className = "status-badge status-offline";
  });
}




function showAlert(message, type = 'error') {
            const alertBox = document.getElementById('alertBox');
            const alertTitle = document.getElementById('alertTitle');
            const alertMessage = document.getElementById('alertMessage');
            
            alertBox.className = 'alert-box show';
            if (type === 'success') {
                alertBox.classList.add('success');
                alertTitle.textContent = 'Sucesso!';
            } else {
                alertTitle.textContent = 'Alerta!';
            }
            
            alertMessage.textContent = message;
            
            setTimeout(() => {
                alertBox.classList.remove('show');
            }, 7000);
        }