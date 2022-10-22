export interface Capitulo {
  id: string;
  numero: string;
  quantidadeArquivos: number;
}

export interface Item {
  id: string;
  numero: string;
  subItens: Array<SubItem>;
  documentos: Array<Documento>;
}

export interface SubItem {
  id: string;
  numero: string;
  documentos: Array<Documento>;
}

export interface Documento {
  id: string;
  nome: string;
  url: string;
  type: string;
  criadoEm: string;
}
