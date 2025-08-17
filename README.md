# Deploying a Static Vite Site to GitHub Pages

See this guide deployed to GitHub Pages using the provided workflow at: [https://kasperkouhia.github.io/vite-static-deploy](https://kasperkouhia.github.io/vite-static-deploy).

The following is a guide on how to deploy a static site built using Vite to GitHub Pages.

This guide assumes that you are running npm, have Vite installed as a local dev dependency, and that your `package.json` contains the following npm scripts:

```jsonc
// package.json

{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
  },
}
```

## Building and Testing the App Locally

Before deploying to GitHub Pages, you'll want to make sure the production build of the app looks and functions fine in your local environment.

First, run `npm run build` to build the app:

```bash
npm run build
```

By default, the build output will be placed in the `dist` directory.

Once you've built the app, you may test it locally by running the following command:

```bash
npm run preview
```

This will launch a local static web server that serves the files from `dist` at `http://localhost:4173`.

You may change the port used by passing the `--port` flag as an argument.

```jsonc
// package.json

{
  "scripts": {
    "preview": "vite preview --port 3306",
  },
}
```

This would make the preview server launch at `http://localhost:3306` instead.

## Deploying the App to GitHub Pages

First, set the correct `base` in `vite.config.js`.

When deploying to `https://<USERNAME>.github.io/` or a custom domain through GitHub Pages, set `base` to `"/"`.

You may also remove `base` from the configuration file, as it defaults to `"/"`.

When deploying to `https://<USERNAME>.github.io/<REPOSITORY>/` (meaning your repository is located at `https://github.com/<USERNAME>/<REPOSITORY>`), you'll want to set `base` to `"/<REPOSITORY>/"`.

For example, this app has its `base` set to `"/vite-static-deploy/"`.

```js
// vite.config.js

export default defineConfig({
  base: "/vite-static-deploy/",
});
```

Then, navigate to the app's GitHub Pages configuration in the repository settings (located at `https://github.com/<USERNAME>/<REPOSITORY>/settings/pages`). Set the deployment source to "GitHub Actions".

Next, create the directory `.github/workflows` at the root of the app.

Create a new `deploy.yml` file in the directory, with the following contents:

```yaml
# .github/workflows/deploy.yml

# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes to the main branch
  push:
    branches:
      - main
    # Will not run on pushes to the following files and folders
    paths-ignore:
      - ".gitignore"
      - ".gitattributes"

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload dist folder
          path: "./dist"
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Now you have a workflow that will automatically build and deploy your project whenever a push is made to the `main` branch of the repository.

It may also be run manually from the repository's Actions tab.

In most projects you may also want to ignore pushes targeting markdown files to prevent unnecessary builds.

```yaml
# .github/workflows/deploy.yml

paths-ignore:
  - "**.md"
```

Now pushes made to `.md` files will not cause a new deployment.

And with that, you're good to deploy your Vite project to GitHub Pages!
