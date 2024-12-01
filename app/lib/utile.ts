import { readFile } from 'fs/promises';
import { PROFILE_MD_PATH, WEB_ROOT } from './const';import { Root } from "mdast";
import yaml from 'js-yaml';
import { Context, Env } from 'hono';

export type ProfileMetadata = {
  name: string;
  birth: string;
};

export const getProfileContentString = async () => {
  try {
    const data: string = await readFile(`${PROFILE_MD_PATH}`, "utf8")
    return data;
  } catch {
    return undefined
  }
}

export const getProfileMetadata = (ast: Root): ProfileMetadata | undefined => {
  // YAML ノードを取得
  const metadataString = ast.children.find((node) => node.type === 'yaml')?.value;

  // YAML ノードをパース
  return metadataString ? (yaml.load(metadataString) as ProfileMetadata) : undefined;
}

export const getCanonicalUrl = (c: Context<Env, any, {}>) => {
  return WEB_ROOT + c.req.path;
}