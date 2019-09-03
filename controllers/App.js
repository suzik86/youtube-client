import AppModel from '../models/AppModel';
import AppView from '../views/AppView';
import SearchBoxView from '../views/SearchBoxView';

export default class App {
  constructor() {
    this.state = {
      urlSearch: 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCSJAollI0ROZLw3UtjloXmT5O_L4rmjL8&type=video&part=id&maxResults=15&q=',
      urlVideos: 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCSJAollI0ROZLw3UtjloXmT5O_L4rmjL8&part=snippet,statistics&id=',
      query: 'js',
      nextPage: '',
    };
  }

  async start() {
    this.model = new AppModel(this.state);
    const view = new AppView(this);
    const searchBoxView = new SearchBoxView(this);
    searchBoxView.render();
    view.render();
    this.view = view;
  }

  async nextPage() {
    const old = this.view.videos;
    const data = await this.model.getClips(this.state.query);
    this.view.update(old.concat(data), false);
  }

  async onSearch(query) {
    this.state.query = query;
    this.state.nextPage = '';
    const data = await this.model.getClips(this.state.query);
    this.view.update(data, true);
  }
}
