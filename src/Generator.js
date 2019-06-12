/**
 * Generator:
 * 1. Check all Packages
 * 2. Install missing submodules
 * 3. Run Swagger Gen
 * 4. add+commit
 * 5. Push Release
 *
 * ENV Variables:
 * GITHUB_TOKEN            *required*
 * GITHUB_USER_AGENT       *required*
 * GITHUB_ORGANIZATION     *required*
 */

// Filesystem Utils
const path = require('path');
const fse = require('fs-extra');

// Repo Management
// const {Repository} = require('nodegit');
const Octokit = require('@octokit/rest');

// Package Class
const Package = require('./Package');

/**
 * Generator Controller
 */
class Generator {
  /**
   *
   * @param {string} dir Path to the Base of the Project
   * @param {object|string} spec Swagger/OpenAPI specification
   * @param {string} pkgPath Path to Generate the Packages to
   */
  constructor(dir = '../', spec, pkgPath) {
    // Ensure Configuration
    if (!process.env['GITHUB_USER_AGENT']||!process.env['GITHUB_TOKEN']) {
      throw new Error('Must have Github UserAgent and Token');
    }

    /**
     * Octokit Instance for Injecting into Packages
     * @type {Octokit}
     */
    this.github = new Octokit({
      userAgent: process.env['GITHUB_USER_AGENT'],
      auth: process.env['GITHUB_TOKEN'],
    });

    /**
     * Name to Prefix on all Generated Packages
     * @type {string}
     */
    this.name = 'ngp';

    /**
     * Path to the Base of the Project
     * @type {string}
     */
    this.dir = dir;

    /**
     * Target Directory for Packages
     * @type {string}
     */
    this.pkgDir = pkgPath || 'packages';

    /**
     * TODO: Remove Spec
     * @type {Object|string}
     */
    this.spec = spec;

    /**
     * NodeGit Repository for the Generator
     * @type {Repository|null}
     */
    // this.repo = null;

    /**
     * List of Language Targets
     */
    this.targets = null;

    /**
     * Dictionary of Packages keyed by Package.name
     * @type {object}
     */
    this.packages = {};
  }

  /**
   * Get the Organization
   */
  get org() {
    if (! process.env['GITHUB_ORGANIZATION']) {
      throw new Error('Must have GitHub Organiation configured');
    }
    return {
      name: process.env['GITHUB_ORGANIZATION'] || 'barnstorm-online',
      url: `ssh://git@github.com/${process.env['GITHUB_ORGANIZATION']}`,
    };
  }
  /**
   * Get the Generator Path
   * @return {string} Path for the Generator
   */
  get path() {
    return path.resolve(__dirname, this.dir);
  }

  /**
   * Get Organization Remotes from Github
   * @return {Promise.<array>}
   */
  get remotes() {
    return this.github.repos.listForOrg({
      org: this.org.name,
      type: 'public',
    }).then(({data}) => {
      return data;
    });
  }

  /**
   * Initiallize the beast!
   * @param {boolean} auto Automatically run flag
   * @return {Promise}
   */
  async init(auto = false) {
    /**
     * Load Targets
     */
    if (!this.targets) {
      await this.loadTargets();
    }

    // Make sure we have a valid package dir
    await fse.ensureDir(this.pkgDir);

    /**
     * Get the Generator's Repo
     * @type {Repository}
     */
    // this.repo = await Repository.open(path.resolve(this.path, '.git'));

    /**
     * Create Packages for all Targets
     */
    this.getTargetsList().forEach(async (target) => {
      const pkg = new Package(target, this);
      await pkg.init().catch((err)=>{console.log('shiz', err)});
      // this.packages[pkg.name] = pkg;
    });

    if (auto) {
      this.run();
    }
  }

  /**
   * Target loader
   * TODO: Languages.json, Package.json and guess from configs
   */
  loadTargets() {
    this.targets = {
      'php': {
        'parent': {},
        'local': {},
        'remote': {},
      },
      'javascript': {
        'parent': {},
        'local': {},
        'remote': {},
      },
    };
  }

  /**
   * Check if this
   * @param {Package} pkg
   * @return {boolean}
   */
  // hasUrl(pkg) {
  //   console.log(`Checking Package ${name}'s Url ...`);
  //   return typeof pkg.url !== 'undefined';
  // }

  /**
   * Set the submodules packageurl
   * @param {string} url
   * @param {string} pkgPath
   * @return {Promise.<*>}
   */
  // async setPkgUrl(url, pkgPath) {
  //   console.log(`Setting Package ${name}'s Url ...`);
  //   return await Submodule.setUrl(this.repo, pkgPath, url);
  // }


  /**
   * Get a list of configured Language Targets
   * @return {Array}
   */
  getTargetsList() {
    return Object.keys(this.targets);
  }

  /**
   * Runner
   */
  run() {
    console.log('Running');
  }
}

module.exports = Generator;
