export function validaCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanCnpj = cnpj.replace(/[^\d]+/g, '');

  if (!cleanCnpj || cleanCnpj.length !== 14) return false;

  // Elimina CNPJs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleanCnpj)) return false;

  let tamanho = cleanCnpj.length - 2;
  let numeros = cleanCnpj.substring(0, tamanho);
  const digitos = cleanCnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number.parseInt(digitos.charAt(0))) return false;

  tamanho += 1;
  numeros = cleanCnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number.parseInt(digitos.charAt(1))) return false;

  return true;
}

export function validaCPF(cpf: string): boolean {
  const cleanCpf = cpf.replace(/[^\d]+/g, '');

  if (!cleanCpf || cleanCpf.length !== 11) return false;

  // Elimina CPFs com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cleanCpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number.parseInt(cleanCpf.charAt(i)) * (10 - i);
  }

  const digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (digito1 !== Number.parseInt(cleanCpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number.parseInt(cleanCpf.charAt(i)) * (11 - i);
  }

  const digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (digito2 !== Number.parseInt(cleanCpf.charAt(10))) return false;

  return true;
}
