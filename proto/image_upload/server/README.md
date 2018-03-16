# Image Upload Server

- index.js - node.js / express.js server
- /views - html views directory
- /controllers - in progress
- /models - in progress
- public/upload - image upload directory

# Run in dev mode 
### Server will automatically restart when a dependency is changed

```
sudo npm install
sudo npm update
npm run dev
```

# Current features
1. Multiple image upload to server
2. Automatic panorama stitching with gear360pano and hugin
3. Automatic upload to Cloudinary image service

# TODO
1. Image validation / security
2. DB ?
