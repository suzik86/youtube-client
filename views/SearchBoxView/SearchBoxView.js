export default class SearchBoxView {
  constructor(parentController) {
    this.parentController = parentController;
  }

  render() {
    const searchBox = document.createElement('form');
    const searchInput = document.createElement('input');
    const searchButton = document.createElement('button');
    searchButton.innerText = 'Search';

    document.body.appendChild(searchBox);
    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchButton);
    const self = this;

    searchButton.onclick = function goToSearch() {
      self.parentController.onSearch(searchInput.value);
      return false;
    };
  }
}
