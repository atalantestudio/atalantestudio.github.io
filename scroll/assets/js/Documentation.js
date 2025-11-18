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
 * @typedef {Object} Documentation
 * @property {String} repositoryUrl
 * @property {DocumentationRelease[]} releases
 * @property {Record<String, DocumentationDeclarationOverload[]>} declarations
 */