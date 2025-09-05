
Tashu Cloudinary + Netlify Gallery
=================================

Files in this ZIP:
- index.html
- netlify/functions/list-images.js

Quick steps to deploy (simple):
1) Create a new GitHub repository and push these files (preserve the folder structure).
   Example:
     git init
     git add .
     git commit -m "Initial"
     git branch -M main
     git remote add origin <your-github-repo-url>
     git push -u origin main

2) Create a Netlify account (https://netlify.com) and choose "Add new site" -> "Import from Git".
   Select your GitHub repository and deploy. For a static site, you can leave 'build command' empty and 'publish directory' as '/'.

3) In Netlify site dashboard -> Site settings -> Build & deploy -> Environment, add these environment variables:
   - CLOUDINARY_CLOUD_NAME = dkmk0hsfk
   - CLOUDINARY_API_KEY = <your_cloudinary_api_key>
   - CLOUDINARY_API_SECRET = <your_cloudinary_api_secret>
   - CLOUDINARY_FOLDER = gallery   (optional; set if you want images limited to 'gallery' folder)

   (Find API Key & Secret in Cloudinary Dashboard -> Account Details or 'API' section.)

4) Ensure your Cloudinary unsigned upload preset exists and is named 'unsigned_gallery' (or change the name in index.html).
   The preset must be 'Unsigned' (not signed). In the preset settings you can set folder = gallery (optional).

5) Open your deployed Netlify site. The page will call the serverless function '/.netlify/functions/list-images' to list images.
   Use the Upload button to upload images; they upload directly to Cloudinary and the gallery refreshes automatically.

Security note:
- Do NOT store your Cloudinary API secret in client-side code or commit it to GitHub. Only set it in Netlify environment variables.
- For production, consider tightening upload rules or using authentication for uploads.

If you want, I can walk you through the exact Git commands and Netlify steps while you do them.
