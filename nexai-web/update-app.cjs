const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
const search = '<Route path="/clinician/patient/:id" element={<PatientDetail />} />\r\n  </Route>';
const replacement = `<Route path="/clinician/patient/:id" element={<PatientDetail />} />

  {/* Admin Routes */}
  <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/domains" element={<DomainsAdmin />} />
  <Route path="/admin/domains/:id" element={<DomainEditor />} />
  <Route path="/admin/organisers" element={<OrganisersAdmin />} />
  <Route path="/admin/organisers/:id" element={<OrganiserEditor />} />
  </Route>
  </Route>`;

// also handle \n instead of \r\n
c = c.replace('<Route path="/clinician/patient/:id" element={<PatientDetail />} />\n  </Route>', replacement);
c = c.replace('<Route path="/clinician/patient/:id" element={<PatientDetail />} />\r\n  </Route>', replacement);
fs.writeFileSync('src/App.jsx', c);
