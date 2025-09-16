/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- Service Worker com Gerenciamento de Áudio de Fundo ---

// --- 1. Estado e Configuração do Player ---

let playerState = {
    currentTrackIndex: null,
    isPlaying: false,
    volume: 0.75,
    url: null,
};

const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

// --- 2. Comunicação com Offscreen Document e Clientes ---

// Garante que o documento offscreen para tocar áudio exista.
async function ensureOffscreenDocument() {
    // Utiliza `hasOffscreenDocument` se disponível, caso contrário, faz a busca manual.
    if (await self.clients.hasOffscreenDocument?.(OFFSCREEN_DOCUMENT_PATH)) {
        return;
    }

    const existingContexts = await self.clients.matchAll({
        type: 'offscreen',
        includeUncontrolled: true,
    });

    if (existingContexts.length > 0) {
        return;
    }

    // Cria o documento offscreen.
    await self.clients.createWindow(OFFSCREEN_DOCUMENT_PATH, {
        type: 'offscreen',
        includeUncontrolled: true,
    });
}

// Envia uma ação (ex: 'play', 'pause') para o documento offscreen.
async function sendActionToOffscreenDocument(action) {
    await ensureOffscreenDocument();
    const offscreenClients = await self.clients.matchAll({
        type: 'offscreen',
        includeUncontrolled: true,
    });
    // Envia a mensagem para todos os clientes offscreen (geralmente apenas um).
    for (const client of offscreenClients) {
        client.postMessage(action);
    }
}

// Transmite o estado atual do player para todas as abas abertas do app.
async function broadcastState() {
    const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
    });
    for (const client of windowClients) {
        client.postMessage({ type: 'STATE_UPDATE', payload: playerState });
    }
}

// --- 3. Gerenciador de Eventos Principal ---

self.addEventListener('message', (event) => {
    const { type, payload } = event.data;

    switch (type) {
        // Ações vindas da UI do App
        case 'SET_TRACK':
            playerState.currentTrackIndex = payload.index;
            playerState.url = payload.url;
            playerState.isPlaying = true;
            sendActionToOffscreenDocument({ type: 'play', url: playerState.url, volume: playerState.volume });
            broadcastState();
            break;
        case 'PLAY':
            if (playerState.currentTrackIndex !== null) {
                playerState.isPlaying = true;
                sendActionToOffscreenDocument({ type: 'play', url: playerState.url, volume: playerState.volume });
                broadcastState();
            }
            break;
        case 'PAUSE':
            playerState.isPlaying = false;
            sendActionToOffscreenDocument({ type: 'pause' });
            broadcastState();
            break;
        case 'SET_VOLUME':
            playerState.volume = payload.volume;
            sendActionToOffscreenDocument({ type: 'setVolume', volume: playerState.volume });
            // Não precisa transmitir o estado aqui, pois a UI já foi atualizada localmente para responsividade.
            // Apenas atualizamos o estado do SW para consistência.
            break;
        case 'GET_STATUS':
            // Uma aba do app acabou de abrir e está pedindo o estado atual do player.
            broadcastState();
            break;

        // Ações vindas do Documento Offscreen
        case 'PLAYBACK_ENDED':
            playerState.isPlaying = false;
            broadcastState();
            break;
    }
});


// --- 4. Ciclo de Vida do Service Worker e Notificações ---

// Na instalação, ativa imediatamente.
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service worker instalado');
});

// Na ativação, assume o controle dos clientes.
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Service worker ativado');
});

// Ao clicar em uma notificação (ex: alarme de tarefa).
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Tenta focar uma aba existente do app ou abrir uma nova.
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return self.clients.openWindow('/');
    })
  );
});