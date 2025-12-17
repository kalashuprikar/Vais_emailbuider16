export type BlockType =
  | "text"
  | "title"
  | "image"
  | "video"
  | "button"
  | "dynamicContent"
  | "logo"
  | "social"
  | "html"
  | "divider"
  | "product"
  | "navigation"
  | "spacer";

export interface TitleBlock {
  type: "title";
  id: string;
  content: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  alignment: "left" | "center" | "right";
  fontWeight: "normal" | "bold";
  width: number;
  widthUnit: "px" | "%";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface TextBlock {
  type: "text";
  id: string;
  content: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  alignment: "left" | "center" | "right";
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  width: number;
  widthUnit: "px" | "%";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface ImageBlock {
  type: "image";
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  widthUnit: "px" | "%";
  alignment: "left" | "center" | "right";
  link?: string;
  linkType?: "url" | "page" | "email";
  linkTarget?: string;
  linkTooltip?: string;
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface VideoBlock {
  type: "video";
  id: string;
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  widthUnit: "px" | "%";
  alignment: "left" | "center" | "right";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface DynamicContentBlock {
  type: "dynamicContent";
  id: string;
  fieldName: string;
  placeholder: string;
  backgroundColor: string;
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface LogoBlock {
  type: "logo";
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  widthUnit: "px" | "%";
  alignment: "left" | "center" | "right";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface SocialBlock {
  type: "social";
  id: string;
  platforms: {
    name: string;
    url: string;
    icon: string;
  }[];
  alignment: "left" | "center" | "right";
  size: "small" | "medium" | "large";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface HtmlBlock {
  type: "html";
  id: string;
  content: string;
  width: number;
  widthUnit: "px" | "%";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface ProductBlock {
  type: "product";
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
  buttonText: string;
  buttonLink: string;
  alignment: "left" | "center" | "right";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface NavigationBlock {
  type: "navigation";
  id: string;
  items: {
    label: string;
    link: string;
  }[];
  backgroundColor: string;
  textColor: string;
  alignment: "left" | "center" | "right";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface ButtonBlock {
  type: "button";
  id: string;
  text: string;
  link: string;
  backgroundColor: string;
  textColor: string;
  padding: number;
  margin: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  alignment: "left" | "center" | "right";
  width: number;
  widthUnit: "px" | "%";
  fontSize: number;
  fontWeight: "normal" | "bold";
  visibility: "all" | "desktop" | "mobile";
}

export interface DividerBlock {
  type: "divider";
  id: string;
  color: string;
  height: number;
  margin: number;
  padding: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface HeaderBlock {
  type: "header";
  id: string;
  logo: string;
  backgroundColor: string;
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  alignment: "left" | "center" | "right";
  visibility: "all" | "desktop" | "mobile";
}

export interface FooterBlock {
  type: "footer";
  id: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface SpacerBlock {
  type: "spacer";
  id: string;
  height: number;
  backgroundColor: string;
  margin: number;
  borderWidth: number;
  borderColor: string;
  visibility: "all" | "desktop" | "mobile";
}

export type ContentBlock =
  | TitleBlock
  | TextBlock
  | ImageBlock
  | VideoBlock
  | ButtonBlock
  | DynamicContentBlock
  | LogoBlock
  | SocialBlock
  | HtmlBlock
  | DividerBlock
  | ProductBlock
  | NavigationBlock
  | HeaderBlock
  | FooterBlock
  | SpacerBlock;

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  backgroundColor: string;
  padding: number;
}

export interface BlockSettings {
  [key: string]: any;
}
