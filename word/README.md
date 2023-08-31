# wordsmith

## Developing on Linux

- it's not recommended by microsoft, we should QA on windows
- get the right node version (18.xx)
- npm install
- Firefox -> Privacy & Security -> Certificates -> View Certificates -> Servers -> add exception for localhost:3000
- `npm run dev-server`, and separately, `npm run start:web -- --document={url}` where {url} is the sharing link for a Word doc
