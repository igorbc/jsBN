
function BnSample(){
  this.variaveis = {"a": "", "t": "", "s": "", "l": "", "e": "", "x": "", "b": "", "d": "",};
  this.peso = 1;
}

BnSample.prototype.montaChave = function(vars, varPositiva){
  var chave = "";
  if(varPositiva !== undefined){
        this.variaveis[varPositiva] = "+" + varPositiva;
  }
  for(var i = 0; i < vars.length; i++){
    chave+= this.variaveis[vars[i]] + ",";
  }

  chave = chave.slice(0, -1);

  return chave;
}
