// geofence.js

// Variáveis internas ao módulo para manter estado local
let geofences = [];
let geofenceCircles = [];
let lastGeofenceCheck = false;
let googleMapReference = null; // Referência externa ao mapa para desenhar círculos

// Inicializa o módulo com referência ao mapa do Google
export function initGeofenceModule(googleMap) {
  googleMapReference = googleMap;
}

// Carrega geofences do Firebase e atualiza estado interno
export function carregarGeofences(userId, databaseRef, onLoaded) {
  const geofenceRef = ref(databaseRef, `/usuarios/${userId}/geofences`);

  onValue(geofenceRef, (snapshot) => {
    const dados = snapshot.val();
    geofences = [];

    if (dados) {
      Object.keys(dados).forEach((key) => {
        geofences.push({ id: key, ...dados[key] });
      });
      desenharGeofences();
      if (typeof onLoaded === "function") onLoaded(true, geofences);
    } else {
      geofenceCircles.forEach((circle) => circle.setMap(null));
      geofenceCircles = [];
      if (typeof onLoaded === "function") onLoaded(false, []);
    }
  });
}

// Desenha as geofences no mapa Google carregado no módulo
export function desenharGeofences() {
  if (!googleMapReference) return;
  geofenceCircles.forEach((circle) => circle.setMap(null));
  geofenceCircles = [];

  geofences.forEach((zone) => {
    if (!zone.ativa) return;
    const circle = new google.maps.Circle({
      strokeColor: "#001764ff",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#001764ff",
      fillOpacity: 0.15,
      map: googleMapReference,
      center: { lat: zone.lat, lng: zone.lng },
      radius: zone.radius,
    });
    geofenceCircles.push(circle);
  });
}

// Calcula distância entre duas coordenadas em metros
export function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // metros
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

// Verifica se a posição está dentro de alguma zona segura
export function verificarGeofences(posicao, showAlertCallback) {
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
    if (distancia <= zone.radius) {
      dentroDeAlgumaZona = true;
      console.log(`Dentro da zona segura: ${zone.local}`);
    }
  });

  if (dentroDeAlgumaZona !== lastGeofenceCheck) {
    if (typeof showAlertCallback === "function") {
      if (dentroDeAlgumaZona) {
        showAlertCallback("Entrada na zona segura detectada!", "success");
      } else {
        showAlertCallback("Saída da zona segura detectada!", "error");
      }
    }
  }

  lastGeofenceCheck = dentroDeAlgumaZona;
}

// Exporta o array geofences para leitura externa (se necessário)
export function getGeofences() {
  return geofences;
}
