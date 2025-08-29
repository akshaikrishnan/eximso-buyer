export function getSearchParamsObject(
  searchParams: URLSearchParams | Record<string, any>
) {
  if (searchParams instanceof URLSearchParams) {
    return Object.fromEntries(searchParams.entries());
  }
  return searchParams ?? {};
}
