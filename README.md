# Dr. Menna Aboelata: portfolio website with an editing page

A static website (HTML, CSS, JavaScript) plus an editing page at `/admin`, so the doctor can change text and add case photos herself, with no code.

```
index.html          page skeleton
styles.css          design (Pastel Dreamland palette)
script.js           shade matcher, before/after sliders, message form
content.js          builds the page from content/site.json
content/site.json   ALL the editable text and photo paths
assets/uploads/     photos (the editing page saves new uploads here)
admin/              the editing page (Sveltia CMS) and its settings (config.yml)
```

The doctor never touches these files. She signs in at `/admin`, edits forms, clicks Save, and the site updates in a minute or two. Each save is stored in GitHub, so every change can be undone.

## One-time setup (about 20 minutes)

Do this in **the doctor's own GitHub account** if possible, so she owns the site.

### 1. Put the files on GitHub
1. Create a GitHub account at github.com (free).
2. Click **New repository**. Name it, for example, `dr-menna-portfolio`. Choose **Public** (free GitHub Pages needs a public repository). Create it.
3. On the new repository page click **uploading an existing file**, then drag in **everything inside this folder** (including the `admin`, `assets` and `content` folders), and click **Commit changes**.

### 2. Turn on the website
1. In the repository: **Settings, Pages**.
2. Under **Build and deployment**, Source: **Deploy from a branch**. Branch: **main**, folder **/ (root)**. Save.
3. After a minute the site is live at `https://YOUR-USERNAME.github.io/dr-menna-portfolio/`.

### 3. Tell the editing page which repository to use
1. In the repository open `admin/config.yml`, click the pencil (edit) icon.
2. Change the line
   `repo: YOUR-GITHUB-USERNAME/YOUR-REPOSITORY-NAME`
   to your real values, for example `repo: menna-dental/dr-menna-portfolio`. Commit the change.

### 4. Create the doctor's sign-in key (a "personal access token")
1. On GitHub: your profile picture, **Settings**, **Developer settings**, **Personal access tokens**, **Fine-grained tokens**, **Generate new token**.
2. Token name: `Website editor`. Expiration: 1 year (set a reminder to renew).
3. **Repository access**: *Only select repositories*, then choose `dr-menna-portfolio`.
4. **Permissions, Repository permissions, Contents**: **Read and write**.
5. Click **Generate token** and copy it. GitHub shows it only once, so save it in a password manager.

### 5. Sign in
1. Open `https://YOUR-USERNAME.github.io/dr-menna-portfolio/admin/`
2. Click **Sign In Using Access Token**, paste the token, and sign in.
3. Open **Website, All website content**. You are in.

The token stays in that browser. Anyone who has it can change the site, so keep it private. If it is lost, delete it in GitHub (same Settings page) and make a new one.

## Other hosts
The files also work on Netlify or Cloudflare Pages: connect them to the same GitHub repository and set no build command and the publish folder to the repository root. The editing page works the same way, because sign-in uses the token.

## A custom domain
Add it under **Settings, Pages, Custom domain** (GitHub) and follow the DNS steps shown.

## Testing on your own computer
Opening `index.html` by double-click will not work, because the page reads `content/site.json`. Run a small server instead: open a terminal in this folder and run `python3 -m http.server`, then visit http://localhost:8000.

## What the editing page can change
Everything visible: name, headline, buttons, the three quick facts, about text, education and certificates (add as many lines as needed), work experience (add, reorder, delete), a photo gallery with case filters and a full-screen viewer, case photos with before/after sliders, skills groups, contact details, footer, and the title Google shows. Photos are shrunk automatically when uploaded.

The shade matcher in the top section and the contact form layout are part of the design and are not edited here.

## Good to know
- **Patient photos.** Add case photos only with the patient's written consent and the supervising dentist's approval. Hide faces and identifying details.
- **Phone number.** It is public on the website. Leave the Phone field empty in the editor to hide it.
- **Message form.** The website has no server. The form prepares an email that opens in the visitor's email app, addressed to the Email field in the editor.
- **Sample smile picture.** It shows only while there are no gallery photos and no before/after cases, so it is gone now.
- **Phones and tablets.** The layout adapts to any screen: a menu button replaces the top links on phones, the gallery shows 2, 3 or 4 columns depending on width, and the viewer supports swiping.
- **Gallery photos.** 14 sample photos are included in `assets/uploads/work/`. Her signature is part of each image.
- **Editor version.** `admin/index.html` loads Sveltia CMS version 0.266.0 from unpkg.com. Update the version number there on purpose, and test, if you ever want a newer one.
