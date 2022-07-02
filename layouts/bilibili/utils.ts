export function concatUrlQuery<T = Record<string, string>>(
  url: string,
  query: T
) {
  const queryStr = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return `${url}?${queryStr}`;
}

export async function queryCurrentTab() {
  const [current] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  return current;
}

export async function fetchGet(url: string) {
  const response = await fetch(url);
  return response.json();
}

export async function biliParser<T = Record<string, string>>(
  origin: string,
  query: T,
  field?: string
) {
  const url = concatUrlQuery(origin, query);
  const { data } = await fetchGet(url);

  return field ? data[field] : data;
}