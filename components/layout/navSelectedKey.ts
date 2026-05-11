/** Ant Design menu key for the current admin route. */
export function navSelectedKey(pathname: string): string {
  if (pathname === "/" || pathname === "") return "/";
  if (pathname.startsWith("/location")) return "/location";
  if (pathname.startsWith("/product")) return "/product";
  if (pathname.startsWith("/order")) return "/order";
  if (pathname.startsWith("/customer")) return "/customer";
  return "";
}
