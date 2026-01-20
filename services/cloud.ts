
import { User } from '../types';

let tokenClient: any = null;
let currentClientId: string | null = null;
let scriptLoadingPromise: Promise<void> | null = null;

const loadGoogleScript = (): Promise<void> => {
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    if ((window as any).google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
};

export const cloudService = {
  init: async (clientId: string, onUserLoaded: (user: User | null) => void) => {
    if (!clientId) return;
    currentClientId = clientId;

    try {
      await loadGoogleScript();
      
      tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const profile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              }).then(res => res.json());

              const user: User = {
                name: profile.name,
                email: profile.email,
                picture: profile.picture,
                accessToken: tokenResponse.access_token
              };
              
              localStorage.setItem('ledger_google_user', JSON.stringify(user));
              onUserLoaded(user);
            } catch (err) {
              console.error("Erro ao buscar perfil do usuário:", err);
            }
          }
        },
        error_callback: (err: any) => {
          console.error("Erro no fluxo OAuth:", err);
          if (err.type === 'invalid_client') {
            alert("Erro: Client ID inválido. Verifique se copiou corretamente.");
          }
        }
      });
      
      const savedUser = localStorage.getItem('ledger_google_user');
      if (savedUser) {
        onUserLoaded(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Falha ao carregar Google Identity Services:", err);
    }
  },

  login: () => {
    if (tokenClient) {
      // Forçar o prompt para garantir que o usuário veja a conta se houver erro anterior
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } else {
      alert("Aguarde o carregamento do sistema ou configure um Client ID válido.");
    }
  },

  logout: () => {
    const savedUser = localStorage.getItem('ledger_google_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if ((window as any).google?.accounts?.oauth2 && user.accessToken) {
        (window as any).google.accounts.oauth2.revoke(user.accessToken);
      }
    }
    localStorage.removeItem('ledger_google_user');
  },

  saveToCloud: async (user: User, data: any) => {
    if (!user || !user.accessToken) return false;
    try {
      const listResp = await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name="ledger_vault_prod.json"', {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
      const listData = await listResp.json();
      
      if (listData.error) return false;

      const fileId = listData.files?.[0]?.id;
      const boundary = '-------ledger_sync_v3';
      const metadata = {
        name: 'ledger_vault_prod.json',
        mimeType: 'application/json',
        parents: ['appDataFolder']
      };

      const body = `--${boundary}\r\n` +
                   'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
                   JSON.stringify(metadata) + '\r\n' +
                   `--${boundary}\r\n` +
                   'Content-Type: application/json\r\n\r\n' +
                   JSON.stringify(data) + '\r\n' +
                   `--${boundary}--`;

      const url = fileId 
        ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
        : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

      const resp = await fetch(url, {
        method: fileId ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body
      });

      return resp.ok;
    } catch (e) {
      return false;
    }
  },

  loadFromCloud: async (user: User) => {
    if (!user || !user.accessToken) return null;
    try {
      const listResp = await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name="ledger_vault_prod.json"', {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
      const listData = await listResp.json();
      const fileId = listData.files?.[0]?.id;

      if (fileId) {
        const file = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          headers: { Authorization: `Bearer ${user.accessToken}` }
        }).then(res => res.json());
        return file;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
};
