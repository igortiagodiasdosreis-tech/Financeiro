
export const fileSystemService = {
  // Solicita permissão para acessar um arquivo persistente no HD do usuário
  async linkLocalFile() {
    try {
      if (!('showSaveFilePicker' in window)) {
        alert("Seu navegador não suporta escrita em disco direta. Tente o Google Chrome ou Edge.");
        return null;
      }

      const handle = await (window as any).showSaveFilePicker({
        suggestedName: 'ledger_tomo_sagrado.json',
        types: [{
          description: 'Arquivo do Ledger',
          accept: { 'application/json': ['.json'] },
        }],
      });
      
      return handle;
    } catch (e) {
      console.error("Falha ao vincular arquivo:", e);
      return null;
    }
  },

  async saveToFile(handle: any, data: any) {
    try {
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      return true;
    } catch (e) {
      return false;
    }
  }
};
