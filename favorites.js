import { GithubUser } from "./GithubUser.js";

// Classe que irá conter a lógica dos dados
// Como os dados serão estruturados

export class Favorites {
  // Esse root é a div com o id - #app. Aqui estou pegando, porém vai ser passada como parametro
  // la no arquivo main
  constructor(root) {
    this.root = document.querySelector(root);

    this.load();

    // Não precisa usar o new aqui, pois estou usando o método static com a função search()
    GithubUser.search("lhcarabajal").then((user) => {
      console.log(user);
    });
  }

  // função que irá carregar os dados
  load() {
    // Usando JSON.parse() para transformar um array em formato string em um array de verdade
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
  }

  // função para deixar salvo os usuários que eu adicionei mesmo carregando a página.
  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries));
  }

  // essa é uma função assincrona
  async add(username) {
    // Usando try catch e throw para disparar um erro se existir
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuário já cadastrado!");
      }

      const user = await GithubUser.search(username);
      console.log(user);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado");
      }

      // criando um novo array quando eu adicionar o usuário, porém dizendo, coloque o usuário
      // que eu digitei primeiro e os demais embaixo.
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  // função que deleta o usuário ao clicar no botão de remover
  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    //Principio de imutabilidade. Aqui estou criando um novo array e não substituindo os dados
    // do array que já existe
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}
// Classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    // Aqui estou indo pegar o tbody que está dentro do root que é a div #app
    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onadd();
  }

  // função que vai adicionar o usuário
  onadd() {
    // pegando o botão e depois adicionando evento de click para pegar o valor digitado no input
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);

      // removeMessageSemUser.remove();
    };

    // let removeMessageSemUser = document.querySelector(".sem-users");
  }

  update() {
    // chamando a função que remove as lihas
    this.removeAllTr();

    //
    this.entries.forEach((user) => {
      const row = this.createRow();

      // Aqui estou acessando a imagem dentro da linha criada para altera-la de acordo com o usuário
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;

      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      // Pegando o botão de remover e adicionando evento de click para remover o usuário.
      row.querySelector(".btn-remover").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");

        if (isOk) {
          this.delete(user);
        }
      };

      // incluindo a linha criada dentro do tbody
      this.tbody.append(row);
    });

    /*Pegando a tabela e verificando a quantidade de linhas que tem*/
    let tableLines = document.querySelector("table").rows.length;
    const semUsers = document.querySelector(".sem-users");
    // const tableSVG = document.querySelector(".sem-users svg");
    // const tableTxt = document.querySelector(".sem-users h2");

    /*Se tiver mais de 1 tr, tirar o .sem-users*/
    if (tableLines > 1) {
      // tableSVG.classList.add("hidden");
      // tableTxt.classList.add("hidden");
      semUsers.classList.add("hidden");
      /*Senão Deixar o .sem-users */
    } else {
      // tableSVG.classList.remove("hidden");
      // tableTxt.classList.remove("hidden");
      semUsers.classList.remove("hidden");
    }
  }

  // Função que criará uma tr(linha)
  createRow() {
    // Aqui estou criando uma tr pelo Javascript
    const tr = document.createElement("tr");

    // pegando a linha que criei e adicionando o conteudo nela
    tr.innerHTML = `

            <td class="user">
              <img src="https://github.com/lhcarabajal.png" alt="Imagem de Luiz" />
              <a href="https://github.com/lhcarabajal" target="_blank">
                <p>Luiz Carabajal</p>
                <span>lhcarabajal</span>
              </a>
            </td>
            <td class="repositories">11</td>
            <td class="followers">1</td>
            <td>
              <button class="btn-remover">Remover</button>
            </td>
    `;
    return tr;
  }

  // Criando a função que irá remover as linhas
  removeAllTr() {
    // Aqui estou pegando as linhas dentro do tbody que atualmente é 2
    // Usando o forEach(para cada um) no caso o tr(linha), vai executar a função tr.remove()
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
