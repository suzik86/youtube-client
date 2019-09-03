export default class AppModel {
  constructor(state) {
    this.state = state;
  }

  static extractData(data) {
    return data.items.map(clip => (
      {
        title: clip.snippet.title,
        description: clip.snippet.description,
        author: clip.snippet.channelTitle,
        uploadDate: clip.snippet.publishedAt,
        viewCount: clip.statistics.viewCount,
        preview: clip.snippet.thumbnails.high.url,
      }));
  }

  async getClips(query) {
    const { urlSearch, urlVideos, nextPage } = this.state;
    const response = await fetch(`${urlSearch}${query}&pageToken=${nextPage}`);
    const data = await response.json();
    this.state.nextPage = data.nextPageToken;

    const ids = data.items.map(item => item.id.videoId).join(',');

    const responseVideos = await fetch(urlVideos + ids);
    const dataVideos = await responseVideos.json();


    return AppModel.extractData(dataVideos);
  }
}
