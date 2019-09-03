export default class AppView {
  constructor(parentController) {
    this.videos = [];
    this.page = 0;
    this.currentButton = null;
    this.parentController = parentController;
  }

  unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  render() {
    window.addEventListener('resize', () => {
      this.calculate();
    });

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('wrapper');
    document.body.appendChild(this.wrapper);
    this.slider = document.createElement('ul');
    this.wrapper.appendChild(this.slider);
    let isDown = false;
    let startX;
    let scroll;

    const self = this;

    this.start = function start(e) {
      isDown = true;
      self.wrapper.classList.add('active');
      startX = self.unify(e).pageX;
      scroll = self.slider.offsetLeft;
    };

    this.end = function end() {
      isDown = false;
      self.wrapper.classList.remove('active');

      if (scroll !== self.slider.offsetLeft) {
        self.page = scroll > self.slider.offsetLeft ? self.page + 1 : self.page - 1;
        self.page = Math.min(self.page, self.totalPages);
        self.page = Math.max(self.page, 0);
        self.goToPage(self.page);
      }
    };

    this.move = function move(e) {
      if (!isDown) {
        return;
      }
      e.preventDefault();
      const walk = self.slider.offsetLeft + self.unify(e).pageX - startX;
      startX = self.unify(e).pageX;
      self.slider.style.left = `${walk}px`;
    };

    this.wrapper.addEventListener('mousedown', this.start);
    this.wrapper.addEventListener('touchstart', this.start);

    this.wrapper.addEventListener('mouseleave', this.end);
    this.wrapper.addEventListener('mouseup', this.end);
    this.wrapper.addEventListener('touchend', this.end);

    this.wrapper.addEventListener('mousemove', this.move);
    this.wrapper.addEventListener('touchmove', this.move);

    this.buttons = document.createElement('div');
    this.buttons.classList.add('button-block');
    this.buttons.addEventListener('click', (e) => {
      if (e.target.nodeName === 'BUTTON') {
        this.goToPage(e.target.innerText - 1);
      }
    });
    document.body.appendChild(this.buttons);

    this.refresh(this.videos);
  }

  goToPage(page) {
    this.page = page;
    const left = -this.page * this.itemWidth * this.perPage;
    this.slider.style.left = `${left}px`;
    this.markCurrentButton();
    if (this.page && this.page > this.totalPages - 2) {
      this.parentController.nextPage();
    }
  }

  markCurrentButton() {
    if (this.currentButton) {
      this.currentButton.classList.remove('current');
    }
    this.currentButton = this.buttons.querySelectorAll('[class="button"]')[this.page];
    if (this.currentButton) {
      this.currentButton.classList.add('current');
    }
  }

  updatePager() {
    const buttons = [];
    if (this.totalPages) {
      for (let page = 1; page <= this.totalPages + 1; page += 1) {
        buttons.push(`<button class="button" title="Page ${page}">${page}</button>`);
      }
    }
    this.buttons.innerHTML = buttons.join('');
    this.goToPage(this.page);
  }

  update(videos, goToStart) {
    this.videos = videos;
    this.refresh();
    if (goToStart) {
      this.goToPage(0);
    }
  }

  refresh() {
    this.slider.innerHTML = this.videos.map(video => `<li><div>
        <a href="https://www.youtube.com/watch?v=${video.id}" class="title">${video.title}</a>
        <img src="${video.preview}" class = "preview">
        <div class="author">${video.author}</div>
        <div class="view-count">View count: ${video.viewCount}</div>
        <div class="description">${video.description.slice(0, 250)}...</div>
    </div></li>`).join('');
    this.calculate();
  }

  calculate() {
    this.perPage = Math.max(1, Math.floor(this.wrapper.clientWidth / 400));
    this.totalPages = Math.floor(this.videos.length / this.perPage);
    this.itemWidth = Math.ceil(this.wrapper.clientWidth / this.perPage);
    const width = this.itemWidth * this.videos.length;
    this.slider.style.width = `${width}px`;
    this.slider.querySelectorAll('li').forEach((item) => {
      const el = item;
      el.style.width = `${this.itemWidth}px`;
    });
    this.updatePager();
  }
}
