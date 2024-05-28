declare module "*.png";
declare module "*.jpg" {
  const value: string;
  export default value;
}