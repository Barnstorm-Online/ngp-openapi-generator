/**
 * Language Class
 *   Responsible for Checking Swagger Codegen configurations
 */
class Language {
  /**
   * A Target for Swagger CodeGen
   * @param {string} langName
   */
  constructor(langName, /* configs={} */ ) {
    if (!Language.isValid(langName)) {
      throw new Error('Not a valid language target');
    }
    this.name = langName;
    // this.configs = configs;
  }

  /**
   * Return a list of Swagger Codegen Language Targets
   * @return {array}
   */
  static getValidLanguages() {
    return [
      'ada-server',
      'akka-scala',
      'android',
      'apache2',
      'apex',
      'aspnetcore',
      'bash',
      'csharp',
      'clojure',
      'cwiki',
      'cpprest',
      'csharp-dotnet2',
      'dart',
      'elixir',
      'elm',
      'eiffel',
      'erlang-client',
      'erlang-server',
      'finch',
      'flash',
      'python-flask',
      'go',
      'go-server',
      'groovy',
      'haskell-http-client',
      'haskell',
      'jmeter',
      'jaxrs-cxf-client',
      'jaxrs-cxf',
      'java',
      'inflector',
      'jaxrs-cxf-cdi',
      'jaxrs-spec',
      'jaxrs',
      'msf4j',
      'java-pkmst',
      'java-play-framework',
      'jaxrs-resteasy-eap',
      'jaxrs-resteasy',
      'javascript',
      'javascript-closure-angular',
      'java-vertx',
      'kotlin',
      'lua',
      'lumen',
      'nancyfx',
      'nodejs-server',
      'objc',
      'perl',
      'php',
      'powershell',
      'pistache-server',
      'python',
      'qt5cpp',
      'r',
      'rails5',
      'restbed',
      'ruby',
      'rust',
      'rust-server',
      'scala',
      'scala-gatling',
      'scala-lagom-server',
      'scalatra',
      'scalaz',
      'php-silex',
      'sinatra',
      'slim',
      'spring',
      'dynamic-html',
      'html2',
      'html',
      'swagger',
      'swagger-yaml',
      'swift4',
      'swift3',
      'swift',
      'php-symfony',
      'tizen',
      'typescript-aurelia',
      'typescript-angular',
      'typescript-inversify',
      'typescript-angularjs',
      'typescript-fetch',
      'typescript-jquery',
      'typescript-node',
      'undertow',
      'ze-ph',
      'kotlin-server',
    ];
  }

  /**
   * Check if a language is in the codegen list
   * @param {string} langName
   * @return {boolean}
   */
  static isValid(langName) {
    return Language.getValidLanguages().includes(langName);
  }
}

module.exports = Language;
