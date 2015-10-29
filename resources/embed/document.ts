/// <reference path="./embed.d.ts" />
/**
 * Entry point for Embed Documents
 */

require('html5shiv');

import * as $ from 'jquery';
export default class Embed {
    constructor() {
    }
}
(<any>window).embedPlugin = new Embed();
