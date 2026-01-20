
import { Transaction, SyncConfig } from '../types';

export const sheetsService = {
  async pushTransaction(url: string, transaction: Transaction) {
    const cleanUrl = url.trim();
    if (!cleanUrl || !cleanUrl.startsWith('http')) return false;
    
    try {
      // Usamos no-cors para POST em Apps Script para evitar pre-flight errors de CORS
      // Isso é o padrão recomendado para envios simples onde não precisamos ler a resposta.
      await fetch(cleanUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addTransaction',
          ...transaction,
          dateFormatted: new Date(transaction.date).toLocaleDateString('pt-BR')
        })
      });
      return true;
    } catch (e) {
      console.error('Erro de rede ao enviar para o Sheets:', e);
      return false;
    }
  },

  async syncAll(url: string) {
    const cleanUrl = url.trim();
    if (!cleanUrl || !cleanUrl.startsWith('http')) {
      console.error('URL da planilha inválida ou vazia.');
      return null;
    }

    try {
      const syncUrl = new URL(cleanUrl);
      syncUrl.searchParams.set('action', 'syncAll');
      syncUrl.searchParams.set('cache_bust', Date.now().toString());

      // O Google Apps Script exige redirect: 'follow'. 
      // Se houver erro de rede (CORS), geralmente é porque o script não está como "Anyone" ou não retorna ContentService.
      const response = await fetch(syncUrl.toString(), {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow'
      });
      
      if (!response.ok) {
        throw new Error(`Servidor retornou status ${response.status}`);
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) return data;
        console.error("Dados recebidos não são um array:", data);
        return null;
      } catch (parseError) {
        console.error("Erro ao processar JSON. O Script pode estar retornando HTML de erro do Google.");
        return null;
      }
    } catch (e) {
      console.error('Falha de Rede (CORS ou URL inválida):', e);
      throw e; // Lançar para o App tratar
    }
  }
};
