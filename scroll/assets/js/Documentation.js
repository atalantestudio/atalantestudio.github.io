export {};

/**
 * @typedef {Object} DocumentationRelease
 * @property {String} tag
 * @property {String} commitHash
 */

/**
 * @typedef {Object} DocumentationDeclarationOverload
 * @property {Number} releaseIndex
 * @property {?Number} deprecationReleaseIndex Must be greater than `releaseIndex`.
 * @property {String} syntax
 * @property {?String} description
 * @property {String} filePath
 * @property {Number} line Uses one-based indexing.
 */

/**
 * @typedef {Object} DocumentationDeclaration
 * @property {String} name
 * @property {?String} parentAnchor
 * @property {String} description
 * @property {DocumentationDeclarationOverload[]} overloads
 */

/**
 * @typedef {Object} Documentation
 * @property {String} repositoryUrl
 * @property {DocumentationRelease[]} releases
 * @property {DocumentationDeclaration[]} declarations
 */