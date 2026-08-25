/**
 * Override mínimo de webpack via CRACO.
 *
 * Por quê isso existe:
 * O build de produção do Phaser 4 inclui seu próprio runtime interno
 * (usado pelos "render nodes" do novo renderer). Quando o
 * ModuleConcatenationPlugin do Create React App tenta otimizar o bundle
 * final "achatando" módulos no mesmo escopo (scope hoisting), o runtime
 * interno do Phaser colide com o do CRA, e o Terser falha ao minificar
 * com o erro `"__webpack_module_cache__" is redeclared`.
 *
 * A correção é desativar apenas a concatenação de módulos (mantendo todo
 * o resto do pipeline de build padrão do CRA, incluindo a minificação).
 * Isso não exige "ejetar" o projeto nem reescrever a configuração inteira.
 */
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.optimization.concatenateModules = false;
      return webpackConfig;
    },
  },
};
