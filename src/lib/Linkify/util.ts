import LinkifyIt from 'linkify-it'
import tlds from 'tlds'
import { LinkMatchSchema } from './types';

const linkify = new LinkifyIt()
linkify.tlds(tlds);

export function matchDecorator (text: string): Array<LinkMatchSchema> {
    return linkify.match(text)
}