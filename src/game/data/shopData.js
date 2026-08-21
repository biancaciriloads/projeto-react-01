// Catálogo de itens da loja / customização do personagem.
// Cada item é puramente visual (cor/forma renderizada em CSS no Character),
// não usa nenhum asset de terceiros.

function gerarItens(prefixo, categoria, cores, precoBase, passoPreco) {
  return cores.map((cor, i) => ({
    id: `${prefixo}-${i + 1}`,
    categoria,
    nome: `${categoria} ${i + 1}`,
    cor,
    preco: precoBase + i * passoPreco,
  }));
}

export const CATEGORIAS = {
  cabelo: 'cabelo',
  camiseta: 'camiseta',
  calca: 'calca',
  calcado: 'calcado',
  acessorio: 'acessorio',
};

export const SUBCATEGORIAS_ACESSORIO = {
  pulseira: 'pulseira',
  oculos: 'oculos',
  bone: 'bone',
  chapeu: 'chapeu',
};

export const ITENS_CABELO = gerarItens('cabelo', CATEGORIAS.cabelo,
  ['#2b1b12', '#4a2c1a', '#6b3f1d', '#8a5a2b', '#a9752f', '#c98f3a', '#3d3d3d', '#7a2e2e', '#5b4a8a', '#c9c9c9'],
  15, 8);

export const ITENS_CAMISETA = gerarItens('camiseta', CATEGORIAS.camiseta,
  ['#e63946', '#f1a208', '#2a9d8f', '#264653', '#e76f51', '#8ecae6', '#ffb703', '#6a4c93', '#b5838d', '#ffffff'],
  20, 10);

export const ITENS_CALCA = gerarItens('calca', CATEGORIAS.calca,
  ['#1d3557', '#343a40', '#495057', '#4b3832', '#3a5a40', '#6c584c', '#22223b', '#3c096c', '#780000', '#212529'],
  20, 10);

export const ITENS_CALCADO = gerarItens('calcado', CATEGORIAS.calcado,
  ['#ffffff', '#2b2b2b', '#e63946', '#457b9d', '#f4a261', '#606c38', '#7209b7', '#adb5bd', '#c1121f', '#ffb703'],
  15, 8);

export const ITENS_ACESSORIO = [
  ...gerarItens('pulseira', SUBCATEGORIAS_ACESSORIO.pulseira, ['#d4af37', '#c0c0c0', '#cd7f32'], 25, 15),
  ...gerarItens('oculos', SUBCATEGORIAS_ACESSORIO.oculos, ['#111111', '#8b5e3c', '#e63946'], 30, 15),
  ...gerarItens('bone', SUBCATEGORIAS_ACESSORIO.bone, ['#1d3557', '#e63946', '#2a9d8f'], 20, 10),
  ...gerarItens('chapeu', SUBCATEGORIAS_ACESSORIO.chapeu, ['#6b3f1d', '#2b2b2b', '#c5a059'], 35, 20),
];

export const CATALOGO_LOJA = [
  ...ITENS_CABELO,
  ...ITENS_CAMISETA,
  ...ITENS_CALCA,
  ...ITENS_CALCADO,
  ...ITENS_ACESSORIO,
];

export function itensPorCategoria(categoria) {
  return CATALOGO_LOJA.filter((item) => item.categoria === categoria);
}
