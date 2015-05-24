var profiles = require('./profiles');
profiles = JSON.stringify(profiles).replace(/name/g, 'fullname');
profiles = JSON.parse(profiles);
profiles.felix.fullname = "文字の置き換え";
console.log(profiles.felix);
