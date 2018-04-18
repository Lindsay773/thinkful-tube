const APIKey = "AIzaSyCQmpq7Es_g_VklRlwOlS0VVuq5jJnjEGM";
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const PAGINATION = {};
const query = {
    part: 'snippet',
    key: APIKey,
    type: 'video'
};
  
function getDataFromAPI(callback) {
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
  return `<li>
      <h3>${result.snippet.title}</h3>
      <p>
        <a href="https://www.youtube.com/watch?v=${result.id.videoId}">
          <img src="${result.snippet.thumbnails.medium.url}" alt="${result.snippet.title}">
        </a>
        <a href="https://www.youtube.com/channel/${result.snippet.channelId}">${result.snippet.channelTitle}</a><br>
        ${result.snippet.description}
      </p>
    </li>`;
}

function displayYouTubeSearchData(data) {
  $('.js-results-header').html(`${data.pageInfo.totalResults} Results`).prop('hidden', false);
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results).prop('hidden', false);
  addPaginationLinks(data);
}

function addPaginationLinks(data) {
  // clear previous pagination links
  $('.pagination').html('');

  if (data.prevPageToken) {
    PAGINATION.prevPage = data.prevPageToken;
    // display prev link
    $('.pagination').append(`<a href="#" class="prev">&larr; Prev</a>`).prop('hidden', false);
    watchPagination();
  }

  if (data.nextPageToken) {
    PAGINATION.nextPage = data.nextPageToken;
    // display next link
    $('.pagination').append(`<a href="#" class="next">Next &rarr;</a>`).prop('hidden', false);
    watchPagination();
  }
}

function watchPagination() {
  // add listener to pagination links that also sets the "pageToken" param
  $('.pagination .next').on('click', function(event) {
    event.preventDefault();
    query.pageToken = PAGINATION.nextPage;
    getDataFromAPI(displayYouTubeSearchData);
  });

  $('.pagination .prev').on('click', function(event) {
    event.preventDefault();
    query.pageToken = PAGINATION.prevPage;
    getDataFromAPI(displayYouTubeSearchData);
  });
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    query.q = queryTarget.val();
    // reset the input
    queryTarget.val('');
    getDataFromAPI(displayYouTubeSearchData);
  });
}

$(watchSubmit);