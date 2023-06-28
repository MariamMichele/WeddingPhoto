function scattaFoto() {
  // Richiedi l'accesso alla fotocamera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      // Otteniamo l'elemento video della pagina
      var video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      document.body.appendChild(video);

      // Crea un canvas per catturare l'immagine dalla fotocamera
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      // Aggiungi un listener per catturare l'immagine quando il bottone viene cliccato
      document.getElementById('scatta').addEventListener('click', function() {
        // Imposta le dimensioni del canvas in base alle dimensioni del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Cattura l'immagine dalla fotocamera e disegnala sul canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Converti l'immagine in base64
        var dataURL = canvas.toDataURL('image/jpeg');

        // Chiamata alla funzione per caricare l'immagine su Google Drive
        caricaSuGoogleDrive(dataURL);

        // Ferma il flusso video e rimuovi l'elemento video e canvas dalla pagina
        stream.getVideoTracks()[0].stop();
        document.body.removeChild(video);
        document.body.removeChild(canvas);
      });
    })
    .catch(function(error) {
      console.log('Errore nell\'accesso alla fotocamera:', error);
    });
}

function caricaSuOneDrive(dataURL) {
    // Configura le credenziali di Microsoft Graph
    var clientId = '3ba34083-6310-4be0-bd70-77c5f0222cd9'; // Sostituisci con il tuo client ID
    var tenantId = 'f8cdef31-a31e-4b4a-93e4-5f571e91255a'; // Sostituisci con il tuo tenant ID
    var redirectUri = 'https://TUO_INDIRIZZO_REDIRECT'; // Sostituisci con l'URL di reindirizzamento registrato nell'applicazione AAD
    var graphScopes = ['Files.ReadWrite.All']; // Puoi personalizzare gli ambiti in base alle tue esigenze
  
    // Carica l'immagine su OneDrive
    function uploadFile(accessToken) {
      var url = 'https://graph.microsoft.com/v1.0/me/drive/root:/NOME_CARTELLA/NOME_IMMAGINE.jpg:/content'; // Sostituisci con il percorso desiderato per l'immagine
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + accessToken);
      headers.append('Content-Type', 'image/jpeg');
  
      fetch(url, {
        method: 'PUT',
        headers: headers,
        body: atob(dataURL.split(',')[1]) // Decodifica l'immagine dalla stringa base64
      }).then(function(response) {
        if (response.ok) {
          console.log('Immagine caricata con successo su OneDrive.');
        } else {
          console.error('Errore durante il caricamento dell\'immagine su OneDrive:', response.statusText);
        }
      }).catch(function(error) {
        console.error('Errore durante il caricamento dell\'immagine su OneDrive:', error);
      });
    }
  
    // Inizializza l'istanza del client MSAL
    var msalConfig = {
      auth: {
        clientId: clientId,
        authority: 'https://login.microsoftonline.com/' + tenantId,
        redirectUri: redirectUri
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true
      }
    };
    var msalInstance = new msal.PublicClientApplication(msalConfig);
  
    // Effettua l'autenticazione e ottieni l'access token
    function signIn() {
        msalInstance.loginPopup({ scopes: graphScopes }).then(function(response) {
        var accessToken = response.accessToken;
        uploadFile(accessToken);
        }).catch(function(error) {
        console.error('Errore durante l\'autenticazione:', error);
        });
    }

    // Esegui il sign-in
    signIn();
}
  // Codice per caricare l'immagine su Google Drive
  // Dovrai utilizzare l'API di Google Drive per eseguire l'autenticazione e caricare l'immagine nella cartella desiderata.
  // Questa parte richiede la conoscenza delle API di Google Drive e l'utilizzo di librerie o metodi specifici per effettuare il caricamento.
  // Puoi consultare la documentazione di Google Drive per ulteriori informazioni sull'integrazione con l'API.



