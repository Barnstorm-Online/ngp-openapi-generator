require('dotenv').config()
const {Repository, Signature, Reference, Submodule, Clone} = require("nodegit");
const path = require("path");
const fse = require("fs-extra");
const Octokit = require('@octokit/rest')
const octokit = new Octokit({
    userAgent: 'ngp-openapi-generator',
    auth: process.env['GITHUB_TOKEN']
});

class MadSwagger {
    constructor(){
        this.org = "barnstorm-online"
        this.languages = {
            "php": {
                "repo": {},
                "remote": {}
            }
        }
        this.submodules = {}
        this.repo = {}
    }
    async init(){
        console.log(`Starting with mad swagger ...`)
        console.log(`Open working directory repository ...`)
        await this.getLocalRepo()
            .then(()=>{
                return this.config()
            });
    }
    async getLocalRepo(){
        return await Repository.open(path.resolve(__dirname, "./.git"))
            .then((repo) => {
                console.log(`Local Repository Found!`)
                console.log(`Adding local repository to instance ...`)
                return this.repo = repo
            })
    }
    config(){
        console.log(`Loading language configurations ...`)
        this.getLangList().forEach((lang)=>{
            console.log(`Checking ${lang} configuration ...`)
            this.checkPkg(this.getLangConfig(lang))
        })
    }
    getLangConfig(langName){
        console.log(`Getting ${langName} Config ...`)
        let pkgName =`ngp-${langName}-api`
        return {
            name: pkgName,
            url: `https://github.com/${this.org}/${pkgName}.git`,
            path: `packages/${pkgName}`
        }
    }

    hasPkgUrl(name){
        console.log(`Checking Package ${name}'s Url ...`)
        return typeof this.submodules[name].url() !== 'undefined'
    }

    async setPkgUrl(url, path){
        console.log(`Setting Package ${name}'s Url ...`)
        return await Submodule.setUrl(this.repo, path, url)
    }

    checkPkg({name, url, path}){
        console.log(`Checking Package ${name} ...`)
        Submodule.lookup(this.repo, path).then((submodule) => {
            // Add to main repos submodules instances
            if(typeof this.submodules[name] === 'undefined') {
                this.submodules[name] = submodule
            }

            // Set url if not defined
            if( ! this.hasPkgUrl(name, this.submodules[name])){
                console.log(`Package ${name} has no Url, setting now ...`)
                this.setPkgUrl({name, url, path}, this.submodules[name])
            } else {
                console.log(`Package ${name} is ready!`)
            }
            return submodule.init(0)
        }).then((submodule)=>{
            console.log('we finished that crap')
        }).catch((err)=>{
            console.log('wtf', err)
        })
    }

    getLangList(){
        return Object.keys(this.languages)
    }


    run(){
        return this.init()
    }
}

module.exports = MadSwagger
new MadSwagger().run()