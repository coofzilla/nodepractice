//making post request with fetch es2015

fetch('/api/blogs', {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My Title',
    content: 'My Content',
  }),
});
