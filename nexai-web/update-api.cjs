const fs = require('fs');
let c = fs.readFileSync('src/lib/api.js', 'utf8');
const replacement = `clinician: {
    getPatients: () => request('GET', '/clinician/patients'),
    verifyReport: (id) => request('POST', \`/clinician/verify-report/\${id}\`),
  },
  domains: {
    getAll: () => request('GET', '/domains'),
    getOne: (slug) => request('GET', \`/domains/\${slug}\`),
  },
  organisers: {
    getAll: () => request('GET', '/organisers'),
    getOne: (id) => request('GET', \`/organisers/\${id}\`),
  },
  admin: {
    getDomains: () => request('GET', '/domains/admin/all'),
    createDomain: (data) => request('POST', '/domains', data),
    updateDomain: (id, data) => request('PUT', \`/domains/\${id}\`, data),
    deleteDomain: (id) => request('DELETE', \`/domains/\${id}\`),
    getOrganisers: () => request('GET', '/organisers/admin/all'),
    createOrganiser: (data) => request('POST', '/organisers', data),
    updateOrganiser: (id, data) => request('PUT', \`/organisers/\${id}\`, data),
    deleteOrganiser: (id) => request('DELETE', \`/organisers/\${id}\`),
  }`;
c = c.replace(/clinician:\s*\{[\s\S]*?\n\s*\}/, replacement);
fs.writeFileSync('src/lib/api.js', c);
