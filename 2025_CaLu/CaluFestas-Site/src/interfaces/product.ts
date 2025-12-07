export interface Product {
  _id: string,
  nome: string;
  categoria: string;
  subcategoria: string;
  quantidade: number;
  quantidadeemlocacao: number;
  preco: string | number;
  descricao: string;
  imagem: string[];
}
