
function BN() {
  this.A = new BnNode;
  this.S = new BnNode;
  this.L = new BnNode;
  this.B = new BnNode;
  this.T = new BnNode;
  this.E = new BnNode;
  this.D = new BnNode;
  this.X = new BnNode;

  this.A.vars = ["a"];
  this.A.p = {"+a": 0.01, "-a": 0.99};
  this.S.vars = ["s"];
  this.S.p = {"+s": 0.5, "-s": 0.5};
  this.T.vars = ["a", "t"];
  this.T.p = {"+a,+t": 0.05, "+a,-t": 0.95, "-a,+t": 0.01, "-a,-t": 0.99};
  this.L.vars = ["s", "l"];
  this.L.p = {"+s,+l": 0.1, "+s,-l": 0.9, "-s,+l": 0.01, "-s,-l": 0.99};
  this.B.vars = ["s", "b"];
  this.B.p = {"+s,+b": 0.6, "+s,-b": 0.4, "-s,+b": 0.3, "-s,-b": 0.7};
  this.E.vars = ["l", "t", "e"];
  this.E.p = {"+l,+t,+e": 1, "+l,+t,-e": 0, "+l,-t,+e": 1, "+l,-t,-e": 0,
              "-l,+t,+e": 1, "-l,+t,-e": 0, "-l,-t,+e": 0, "-l,-t,-e": 1};
  this.D.vars = ["e", "b", "d"];
  this.D.p = {"+e,+b,+d": 0.9, "+e,+b,-d": 0.1, "+e,-b,+d": 0.7, "+e,-b,-d": 0.3,
              "-e,+b,+d": 0.8, "-e,+b,-d": 0.2, "-e,-b,+d": 0.1, "-e,-b,-d": 0.9};
  this.X.vars = ["e", "x"];
  this.X.p = {"+e,+x": 0.98 ,"+e,-x": 0.02 ,"-e,+x": 0.05 ,"-e,-x": 0.95};

  this.precisao = 4;
}

BN.prototype.query3 = function(quantidade){
  var resultadoExato = this.query3exata();
  var diferenca = [];

  for(var i = 0; i < 100; i++){
    var resultadoAproximado = this.query3sample(quantidade);
    diferenca[i] = Math.abs(resultadoAproximado[0] -
          resultadoExato[0][resultadoExato[0].length - 1]);
  }
  var media = (math.mean(diferenca) * 100).toFixed(this.precisao);
  var desvioPadrao = (math.std(diferenca) * 100).toFixed(this.precisao);
  return this.montaTabela(resultadoExato, resultadoAproximado,
      media, desvioPadrao);
}

BN.prototype.query3sample = function(quantidade){
  var positivo = 0;
  var negativo = 0;
  var exemplo = new BnSample();
  exemplo.variaveis["x"] = "+x";
  exemplo.variaveis["d"] = "+d";
  for(var i = 0; i < quantidade; i++){
    exemplo.peso = 1;
    exemplo = this.A.getSample(exemplo, false);
    exemplo = this.T.getSample(exemplo, false);
    exemplo = this.S.getSample(exemplo, false);
    exemplo = this.L.getSample(exemplo, false);
    exemplo = this.E.getSample(exemplo, false);
    exemplo = this.X.getSample(exemplo, true);
    exemplo = this.B.getSample(exemplo, false);
    exemplo = this.D.getSample(exemplo, true);

    if(exemplo.montaChave(["s"]) == "+s"){
      //console.log("finalmente!");
      positivo = positivo + exemplo.peso;
    }
    else{
      negativo = negativo + exemplo.peso;
    }
  }
  var retorno = [(positivo/(negativo + positivo)).toFixed(this.precisao),
                 (negativo/(negativo + positivo)).toFixed(this.precisao)];
  return retorno;
}

BN.prototype.query3exata = function(){
  var _f1 = new BnNode(); // join em A
  var f1 = new BnNode(); // soma em A
  var _f2 = new BnNode(); // join em T
  var f2 = new BnNode(); // soma em T
  var _f3 = new BnNode(); // join em L
  var f3 = new BnNode(); // soma em L
  var _f4 = new BnNode(); // join em B
  var f4 = new BnNode(); // soma em B
  var _f5 = new BnNode(); // join em E
  var f5 = new BnNode(); // soma em E

  _f1.p = {"+t,+a": 0,"+t,-a": 0,"-t,+a": 0,"-t,+a": 0, "-t,-a": 0};
   f1.p = {"+t": 0,"-t": 0};
  _f2.p = {"+e,+l,+t": 0, "+e,+l,-t": 0, "+e,-l,+t": 0, "+e,-l,-t": 0,
           "-e,+l,+t": 0, "-e,+l,-t": 0, "-e,-l,+t": 0, "-e,-l,-t": 0, };
   f2.p = {"+e,+l": 0, "+e,-l": 0, "-e,+l": 0, "-e,-l": 0};
  _f3.p = {"+s,+e,+l": 0, "+s,+e,-l": 0, "+s,-e,+l": 0, "+s,-e,-l": 0,
           "-s,+e,+l": 0, "-s,+e,-l": 0, "-s,-e,+l": 0, "-s,-e,-l": 0};
   f3.p = {"+s,+e": 0, "+s,-e": 0, "-s,+e": 0, "-s,-e": 0};
  _f4.p = {"+d,+s,+e,+b": 0, "+d,+s,+e,-b": 0, "+d,+s,-e,+b": 0, "+d,+s,-e,-b": 0,
           "+d,-s,+e,+b": 0, "+d,-s,+e,-b": 0, "+d,-s,-e,+b": 0, "+d,-s,-e,-b": 0};
   f4.p = {"+d,+s,+e": 0, "+d,+s,-e": 0, "+d,-s,+e": 0, "+d,-s,-e": 0};
  _f5.p = {"+s,+x,+d,+e":0, "+s,+x,+d,-e":0, "-s,+x,+d,+e":0, "-s,+x,+d,-e":0};
   f5.p = {"+s,+x,+d": 0, "-s,+x,+d": 0};
  //XDadoMaisAMaisS.p = {"+a,+s,+x": 0, "+a,+s,-x": 0};

  //Query: P(S|+x, +d) que eh proporcional a P(S, +x, +d)
  //Variavel da consulta: S
  //Evidencia: +x, +d
  //Variaveis ocultas: A, B, E, T, L

  // join e soma em A
  _f1.multiplicaTabelas([this.A.p, this.T.p], [[1],[1,0]]);
  _f1.somaEmUltimaVariavel("a", f1);
  f1.normaliza();

  // join e soma em T
  _f2.multiplicaTabelas([this.E.p, f1.p], [[1,2,0],[2]]);
  _f2.somaEmUltimaVariavel("t", f2);
  f2.normaliza();

  // join e soma em E
  _f3.multiplicaTabelas([f2.p, this.L.p], [[1,2],[0,2]]);
  _f3.somaEmUltimaVariavel("l", f3);
  f3.normaliza();

  // join e soma em L
  _f4.multiplicaTabelas([this.B.p, this.D.p], [[1,3],[2,3,0]]);
  _f4.somaEmUltimaVariavel("b", f4);
  f4.normaliza();

  // join e soma em E
  _f5.multiplicaTabelas([f4.p, this.X.p, f3.p], [[2,0,3],[3,1],[0,3]]);
  _f5.somaEmUltimaVariavel("e", f5);
  f5.normaliza();

  // agora faltaria multiplicar por P(+x) e P(+d) e normalizar. O resultado é
  // proporcional, portanto basta normalizar e mostrar o resultado.
  return f5.resultadoExato(this.precisao);
}

BN.prototype.query2 = function(quantidade){
  var resultadoExato = this.query2exata();
  var diferenca = [];

  for(var i = 0; i < 100; i++){
    var resultadoAproximado = this.query2sample(quantidade);
    diferenca[i] = Math.abs(resultadoAproximado[0] -
          resultadoExato[0][resultadoExato[0].length - 1]);
  }

  var media = (math.mean(diferenca) * 100).toFixed(this.precisao);
  var desvioPadrao = (math.std(diferenca) * 100).toFixed(this.precisao);
  return this.montaTabela(resultadoExato, resultadoAproximado,
      media, desvioPadrao);
}

BN.prototype.query2sample = function(quantidade){
  var positivo = 0;
  var negativo = 0;
  var exemplo = new BnSample();
  exemplo.variaveis["a"] = "+a";
  exemplo.variaveis["s"] = "+s";
  for(var i = 0; i < quantidade; i++){
    exemplo.peso = 1;
    exemplo = this.A.getSample(exemplo, true);
    exemplo = this.T.getSample(exemplo, false);
    exemplo = this.S.getSample(exemplo, true);
    exemplo = this.L.getSample(exemplo, false);
    exemplo = this.E.getSample(exemplo, false);
    exemplo = this.X.getSample(exemplo, false);

    if(exemplo.montaChave(["x"]) == "+x"){
      positivo = positivo + exemplo.peso;
    }
    else{
      negativo = negativo + exemplo.peso;
    }
  }
  var retorno = [(positivo/(negativo + positivo)).toFixed(this.precisao),
                 (negativo/(negativo + positivo)).toFixed(this.precisao)];
  return retorno;
}

BN.prototype.query2exata = function(){
  var _f1 = new BnNode(); // join em T
  var f1 = new BnNode(); // soma em T
  var _f2 = new BnNode(); // join em L
  var f2 = new BnNode(); // soma em L
  var _f3 = new BnNode(); // join em E
  var f3 = new BnNode(); // soma em E
//  var XDadoMaisAMaisS = new BnNode();

  _f1.p = {"+a,+e,+l,+t": 0,"+a,+e,+l,-t": 0,"+a,+e,-l,+t": 0,"+a,+e,-l,-t": 0,
           "+a,-e,+l,+t": 0,"+a,-e,+l,-t": 0,"+a,-e,-l,+t": 0,"+a,-e,-l,-t": 0};
   f1.p = {"+a,+e,+l": 0,"+a,+e,-l": 0,"+a,-e,+l": 0,"+a,-e,-l": 0};
  _f2.p = {"+s,+a,+e,+l": 0, "+s,+a,+e,-l": 0, "+s,+a,-e,+l": 0, "+s,+a,-e,-l": 0};
   f2.p = {"+s,+a,+e": 0, "+s,+a,+e": 0, "+s,+a,-e": 0, "+s,+a,-e": 0};
  _f3.p = {"+x,+a,+s,+e": 0,"+x,+a,+s,-e": 0,"-x,+a,+s,+e": 0,"-x,+a,+s,-e": 0};
   f3.p = {"+x,+a,+s": 0,"+x,+a,+s": 0,"-x,+a,+s": 0,"-x,+a,+s": 0};
//  XDadoMaisAMaisS.p = {"+a,+s,+x": 0, "+a,+s,-x": 0};

  //Query: P(X|+a, +s) que eh proporcional a P(X, +a, +s)
  //Variavel da consulta: X
  //Evidencia: +a, +s
  //Variaveis ocultas: E, T, L

  //a: 0 e:1 l:2 t:3
  // join e soma em T
  _f1.multiplicaTabelas([this.E.p, this.T.p], [[2,3,1],[0,3]]);
  _f1.somaEmUltimaVariavel("t", f1);
   f1.normaliza();

  // join e soma em L
  _f2.multiplicaTabelas([this.L.p, f1.p], [[0,3],[1,2,3]]);
  _f2.somaEmUltimaVariavel("l", f2);
   f2.normaliza();

  // join e soma em E
  _f3.multiplicaTabelas([this.X.p, f2.p], [[3,0],[2,1,3]]);
  _f3.somaEmUltimaVariavel("e", f3);
   f3.normaliza();

  // agora faltaria multiplicar por P(+a) e P(+s) e normalizar. O resultado é
  // proporcional, portanto basta normalizar e mostrar o resultado.
  return f3.resultadoExato(this.precisao);
}

BN.prototype.query1 = function(quantidade){
  var resultadoExato = this.query1exata();
  var diferenca = [];

  for(var i = 0; i < 100; i++){
    var resultadoAproximado = this.query1sample(quantidade);
    diferenca[i] = Math.abs(resultadoAproximado[0] -
          resultadoExato[0][resultadoExato[0].length - 1]);
  }

  var media = (math.mean(diferenca) * 100).toFixed(this.precisao);
  var desvioPadrao = (math.std(diferenca) * 100).toFixed(this.precisao);
  return this.montaTabela(resultadoExato, resultadoAproximado,
      media, desvioPadrao);
}

BN.prototype.query1sample = function(quantidade){
  var positivo = 0;
  var negativo = 0;
  var exemplo = new BnSample();
  for(var i = 0; i < quantidade; i++){
    exemplo = this.A.getSample(exemplo, false);
    exemplo = this.T.getSample(exemplo, false);

    if(exemplo.montaChave(["t"]) == "+t")
      positivo++;
    else
      negativo++;
  }
  var retorno = [(positivo/(negativo + positivo)).toFixed(this.precisao),
                 (negativo/(negativo + positivo)).toFixed(this.precisao)];
  return retorno;
}

BN.prototype.query1exata = function(){
  var probTA = new BnNode();
  var probT = new BnNode();
  probTA.p = {"+t,+a": 0, "+t,-a": 0, "-t,+a": 0, "-t,-a": 0};
  probT.p = {"+t": 0, "-t": 0};

  probTA.multiplicaTabelas([this.T.p, this.A.p], [[1,0],[1]]);
  probTA.somaEmUltimaVariavel("a", probT);
  probT.normaliza();

  return probT.resultadoExato(this.precisao);
}

BN.prototype.montaTabela = function(resultadoExato, resultadoAproximado,
    difMedia, desvioPadrao){
  var tabelaHtml = "";
  tabelaHtml = "<table>"

  tabelaHtml += "<tr>";
  for(var j = 0; j < resultadoExato[0].length - 1; j++){
    tabelaHtml += "<th>" + resultadoExato[0][j].charAt(1).toUpperCase() + "</th>";
  }
  tabelaHtml += "<th> Exata </th>";
  tabelaHtml += "<th> Aproximada </th>";
  tabelaHtml += "<th> Erro </th>";
  tabelaHtml += "</tr>";

  for(var i = 0; i < resultadoExato.length; i++){
    tabelaHtml += "<tr>"

    for(var j = 0; j < resultadoExato[i].length; j++){
      tabelaHtml += "<td>" + resultadoExato[i][j] + "</td>";
    }

    tabelaHtml += "<td>" + resultadoAproximado[i] + "</td>" +
                  "<td>" + Math.abs(resultadoAproximado[i] -
                           resultadoExato[i][j-1]).toFixed(this.precisao) + "</td>";
    tabelaHtml += "</tr>"
  }
  tabelaHtml += "</table>"

  tabelaHtml += "<p>Erro médio (%): " + difMedia + "</p>"
  tabelaHtml += "<p>Desvio padrão (%): " + desvioPadrao + "</p>"

  return tabelaHtml;
}
