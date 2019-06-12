const path = require('path');
const fse = require('fs-extra');
const {Clone, Cred} = require('nodegit');
const Language = require('./Language');

let options = {
  fetchOpts: {
    callbacks: {
      credentials: function (url, userName) {
        // this is changed from sshKeyNew to sshKeyFromAgent
        return Cred.sshKeyFromAgent(userName);
      }
    }
  }
};
/**
 * Package Controller
 */
class Package {
  /**
   * Package Class
   *    1. Validate
   *    2. Check Remote Github Package
   *       f. Create Missing Github Package and Clone
   *    3. Check Local Package
   *       f. Clone From Github
   *       t. Is Package Git
   *          t. Compare with remote
   *          f.
   * @param {string} target
   * @param {Generator} generator
   */
  constructor(target, generator) {
    /**
     * A Language Target
     * @type {Language}
     */
    this.lang = new Language(target);

    /**
     * Name of the package
     * @type {string}
     */
    this.name = `${process.env['API_PREFIX']}-${this.lang.name}-api`;


    /**
     * GitHub URL for Remote Repository
     * @type {string}
     */
    this.url = `${generator.org.url}/${this.name}.git`;

    /**
     * Get the project from the injected generator
     * @type {string}
     */
    this.prefix = generator.name;

    /**
     * An instance of the parent generator
     * @type {Generator}
     */
    this.generator = generator;
  }

  /**
   * Get the Packages Path
   * @return {string}
   */
  get path() {
    return path.resolve(this.generator.path,
        `${this.generator.pkgDir || 'packages'}`);
  }

  /**
   * Fullpath to this Package
   * @return {string}
   */
  get fullpath() {
    return path.resolve(`${this.path}/${this.name}`);
  }

  /**
   * Check if Package Exists
   * @return {Promise.<{boolean}>}
   */
  get exists() {
    return this.isValidPath(this.fullpath);
  }

  /**
   * Initialize the Package
   * @return {Promise.<void>}
   */
  async init() {
    // Check Package Name
    if (!this.isValidName()) {
      throw new Error('Must be a valid Package Name');
    }
    // Check Package Path
    if (!await this.isValidPath()) {
      throw new Error('Must be a valid Package Path');
    }

    // Check for Package in Github Organization
    // TODO: Make Remote repository optional
    // if(! this.isPackageInOrganization() && this.shouldCreateGithubRepos) {
    if (!await this.isPackageInOrganization()) {
      await this.generator.github.repos.createInOrg({
        org: this.generator.org.name,
        name: this.name,
        license_template: 'mit',
      });
    }

    // Check for Local Package
    if (!await this.exists) {
      // Create Local Package
      await this.create();
    }
  }

  /**
   * Create the Local Package
   * @return {Promise.<Repository>}
   */
  async create() {
    console.log('thisurl', this.url)
    return await Clone.clone(this.url, this.fullpath, options);
  }

  /**
   * Check Generator Organization for this package
   * @return {Promise.<boolean>}
   */
  async isPackageInOrganization() {
    return await this.generator.remotes.then((remotes) => {
      return remotes.filter((remote) => remote.name === this.name).length > 0;
    });
  }

  /**
   * Package Name Validator
   * @param {string} name
   * @return {boolean}
   */
  isValidName(name = this.name) {
    const nameSplit = name.split('-');
    return nameSplit[0] === this.prefix &&
      nameSplit[nameSplit.length - 1] === 'api';
  }

  /**
   * Package Path Validator
   * @param {string} pathDest
   */
  async isValidPath(pathDest = this.path) {
    return await fse.pathExists(pathDest);
  }


  /**
   * Print To String
   * @return {string}
   */
  toString() {
    return this.name;
  }
}

// Export
module.exports = Package;
