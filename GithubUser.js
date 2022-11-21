// criando a classe que irá usar a api fetch para buscar o usuário no github
export class GithubUser {
  // Esse é o local onde vou chegar com a aplicação.
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return (
      fetch(endpoint)
        .then((data) => data.json())
        //Nessa linha estou desestruturando diretamente como argumento.
        .then(({ login, name, public_repos, followers }) => ({
          login,
          name,
          public_repos,
          followers,
        }))
    );
  }
}
