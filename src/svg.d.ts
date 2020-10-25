declare module "*.svg" {
  const content: any;
  export default content;
}

interface JSON {
  parse(text: string): unknown
}