
function BnNode(){
  this.p = {};
  this.vars = [];
  this.str = "";
}

BnNode.prototype.getSample = function(exemplo, fixo){
  var f = new BnNode();
  var limiar;
  var peso;
  var chave;
  if (fixo){
    chave = exemplo.montaChave(this.vars);
    exemplo.peso = exemplo.peso * this.p[chave];
    return exemplo;
  }
  else{
    chave = exemplo.montaChave(this.vars, this.vars[this.vars.length-1]);

    limiar = this.p[chave];

    if(Math.random() <= limiar)
      return exemplo;
    else{
      exemplo.variaveis[this.vars[this.vars.length-1]] = "-" + this.vars[this.vars.length-1];
      return exemplo;
    }
  }
}

BnNode.prototype.resultadoExato = function(){
  var retorno = [];
  var i = 0;
  _.each(this.p, function(valor, chave){
    retorno[i] = [];
    var variaveis = chave.split(",");
    variaveis.forEach(function(elemento, indice){
      retorno[i].push(elemento);
    })
    retorno[i].push(valor.toFixed(4));
    i++;
  }, this);
  return retorno;
}

BnNode.prototype.montaString = function(){
  this.str = "<table>";
  _.each(this.p, function(valor, chave){
    this.str += "<tr>";
    this.str += "<td>" + chave.replaceAll(",","</td><td>") + "</td><td>" + valor.toFixed(4) + "</td>";

    this.str += "</tr>";
  }, this);
  this.str += "</table>";
  return this.str;
}

BnNode.prototype.multiplicaTabelas = function(tabelas, indices){
  _.each(this.p, function(valor, chave){
    var chavesTarget = chave.split(",");
    var chaves = calculaChaves(chavesTarget, indices);

    this.p[chave] = multiplica(tabelas, chaves)
  }, this);
}

BnNode.prototype.somaEmUltimaVariavel = function(variavel, target){
  _.each(target.p, function(valor, chave){
    target.p[chave]+=this.p[chave + ",+" + variavel];
    target.p[chave]+=this.p[chave + ",-" + variavel];
  }, this);
}

BnNode.prototype.normaliza = function(){
  var soma = 0;
  _.each(this.p, function(valor, chave){
    soma += valor;
  }, this);

  _.each(this.p, function(valor, chave){
    this.p[chave] = valor / soma;
  }, this);
  return this;
}

var calculaChaves = function(chavesOriginais, indices){
  var chaves = [];
  indices.forEach(function(elemento, indice){
    var chave = "";
    for(var i = 0; i < elemento.length; i++){
      chave+= chavesOriginais[elemento[i]] + ",";
    }
    chave = chave.slice(0, -1);
    chaves[indice] = chave;
  });
  return chaves;
}

var multiplica = function(tabelas, chaves){
  var produto = 1;

  tabelas.forEach(function(elemento, indice){
    produto = produto * elemento[chaves[indice]];
  });

  return produto;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
