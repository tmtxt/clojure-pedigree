const $ = require('jquery');

exports.getData = async function(url, data) {
  const result = await $.get({
    url: '/api/person/detail',
    data
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
};
