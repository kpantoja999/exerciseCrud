const tabelaPersonagem = document.querySelector("#tabelaPersonagem tbody");
const modal = document.getElementById("modal");
let armazenarLinha; // Vai armazenar a linha para ser editada

async function buscarPersonagem() {
  // Obter os dados de entrada do ID do personagem
  const personagemId = document.getElementById("characterId");
  // Obter o valor inserido pelo usuário
  const id = personagemId.value;

  // Se o ID estiver vazio ou não for um número, não fazer nada
  if (!id || isNaN(id)) {
    return;
  }

  // Verificar se o ID já existe na tabela
  const idNaTabela = Array.from(tabelaPersonagem.rows).some(
    (row) => row.cells[0].textContent === id
  );

  // Se o ID já existir, exibir uma mensagem de erro
  if (idNaTabela) {
    alert("ID já existe na tabela. Por favor, escolha um ID único.");
    return;
  }

  try {
    // Buscar dados do personagem na API
    const conexao = await fetch(
      `https://rickandmortyapi.com/api/character/${id}`
    );

    // Verificar se a resposta da API deu certo, se não acusar com aviso de erro
    if (!conexao.ok) {
      throw new Error(`Erro ao buscar personagem. Código: ${conexao.status}`);
    }

    const dadosPersonagem = await conexao.json(); // conversão para JSON

    // Verificar se a API retornou os dados, se os dados não existirem ou estiverem vazios, acusar com aviso de erro
    if (!dadosPersonagem || Object.keys(dadosPersonagem).length === 0) {
      alert("ID inexistente. Por favor, insira um ID válido.");
      return;
    }

    // Criar uma nova linha na tabela com os dados do personagem
    const novaLinha = document.createElement("tr");
    novaLinha.insertCell(0).textContent = dadosPersonagem.id;
    novaLinha.insertCell(1).textContent = dadosPersonagem.name;
    novaLinha.insertCell(2).textContent = dadosPersonagem.status;
    novaLinha.insertCell(3).textContent = dadosPersonagem.species;

    // Adicionar botões "Editar" e "Apagar"
    const colunaDeAcoes = novaLinha.insertCell(4);
    const editarButton = document.createElement("button");
    editarButton.textContent = "Editar";
    editarButton.addEventListener("click", () => ModalEditar(novaLinha));
    colunaDeAcoes.appendChild(editarButton);

    // Divisão dos botoes "Editar" e "Apagar" Improvissado
    colunaDeAcoes.appendChild(document.createElement("div"));

    const apagarButton = document.createElement("button");
    apagarButton.textContent = "Apagar";
    apagarButton.addEventListener("click", () => apagarLinha(novaLinha));
    colunaDeAcoes.appendChild(apagarButton);

    // Adicionar a nova linha à tabela
    tabelaPersonagem.appendChild(novaLinha);

    // Fazer Rolagem para a nova linha
    novaLinha.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  } catch (error) {
    console.error("Erro na busca do personagem:", error.message);
    alert("ID inexistente. Por favor, insira um ID válido.");
  }
}

function ModalEditar(linhas) {
  // Preencher o modal com os dados
  const celulas = linhas.cells;
  document.getElementById("editId").value = celulas[0].textContent;
  document.getElementById("editNome").value = celulas[1].textContent;
  document.getElementById("editStatus").value = celulas[2].textContent;
  document.getElementById("editEspecie").value = celulas[3].textContent;

  // Armazenar a linha para ser editada
  armazenarLinha = linhas;

  // Estilo de exibição do modal
  modal.style.display = "block";
}

function salvarIdVerificacao() {
  // Obter o novo ID inputado pelo Usuario
  const novoId = document.getElementById("editId").value;

  // Verificar se o novo ID já existe na tabela
  const novoIdExistente = Array.from(tabelaPersonagem.rows).some(
    (row) => row !== armazenarLinha && row.cells[0].textContent === novoId
  );

  // Se o ID já existir, exibir mensagem e não permitir a edição
  if (novoIdExistente) {
    alert("ID já existe na tabela. Por favor, escolha um ID único.");
    return;
  }

  // Atualizar os dados na linha da tabela
  const celulas = armazenarLinha.cells;
  celulas[0].textContent = novoId;
  celulas[1].textContent = document.getElementById("editNome").value;
  celulas[2].textContent = document.getElementById("editStatus").value;
  celulas[3].textContent = document.getElementById("editEspecie").value;

  // Fechar o modal
  fecharModal();
}

function apagarLinha(linhas) {
  // Remover a linha da tabela
  tabelaPersonagem.removeChild(linhas);
}

function fecharModal() {
  // Limpar os campos do modal
  document.getElementById("editId").value = "";
  document.getElementById("editNome").value = "";
  document.getElementById("editStatus").value = "";
  document.getElementById("editEspecie").value = "";

  // Ocultar o modal
  modal.style.display = "none";
}

// Função  para salvar um novo personagem
function salvarNovoPersonagem() {
  const editIdInput = document.getElementById("editId");
  const editNomeInput = document.getElementById("editNome");
  const editStatusInput = document.getElementById("editStatus");
  const editEspecieInput = document.getElementById("editEspecie");

  // Valores dos inputs
  const id = editIdInput.value;
  const nome = editNomeInput.value;
  const status = editStatusInput.value;
  const especie = editEspecieInput.value;

  // Verificar se o ID já existe na tabela
  const idExistente = Array.from(tabelaPersonagem.rows).some(
    (row) => row.cells[0].textContent === id
  );

  // Se o ID já existir, acusar erro
  if (idExistente) {
    alert("ID já existe. Por favor, escolha um ID único.");
    return;
  }

  // Criar uma nova linha na tabela com os dados do novo personagem
  const novaLinha = document.createElement("tr");
  novaLinha.insertCell(0).textContent = id;
  novaLinha.insertCell(1).textContent = nome;
  novaLinha.insertCell(2).textContent = status;
  novaLinha.insertCell(3).textContent = especie;

  // Adicionar botões "Editar" e "Apagar"
  const colunaDeAcoes = novaLinha.insertCell(4);
  const editarButton = document.createElement("button");
  editarButton.textContent = "Editar";
  editarButton.addEventListener("click", () => ModalEditar(novaLinha));
  colunaDeAcoes.appendChild(editarButton);

  // Cria uma divisão entre os botoes "Editar" e "Apagar"
  colunaDeAcoes.appendChild(document.createElement("div"));

  const apagarButton = document.createElement("button");
  apagarButton.textContent = "Apagar";
  apagarButton.addEventListener("click", () => apagarLinha(novaLinha));
  colunaDeAcoes.appendChild(apagarButton);

  // tá adicionando a nova linha (novaLinha) na tabela
  tabelaPersonagem.appendChild(novaLinha);

  // Fazer Rolagem para a nova linha
  novaLinha.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });

  // Fechar o modal após salvar
  fecharModal();
}

// Adicionar event listeners
document
  .getElementById("buscarButton")
  .addEventListener("click", buscarPersonagem);
document.getElementById("fecharModal").addEventListener("click", fecharModal);
document
  .getElementById("salvarEdicaoButton")
  .addEventListener("click", salvarIdVerificacao);
document
  .getElementById("salvarNovoPersonagemButton")
  .addEventListener("click", salvarNovoPersonagem);
