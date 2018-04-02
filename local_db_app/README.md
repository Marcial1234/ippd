# Things will save now

Working on having persistent Notes CRUD

~ Interesting MongoDB Architecture stuff ~


## Project Dependencies
- [Node.js and npm](https://nodejs.org/en/download)
- [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community) - using v3.4. Check 'All Version Binaries' in case of compatibilities issues.
    + Install, then add binaries to your PATH (`C:\Program Files\MongoDB\Server\[version]\bin` on windows)

## Development
- For local DB development, run `mongod` on an independent command line
- First time, run: `npm run first-install`
  + Make sure **NOT** to have the project tree open in an IDE/Text Edition (e.g. [Sublime Text 3](http://sublimetext.com), or any of other crappier alternative kids use these days). If issues persist, try to run the command with admin privileges (on Widows)
- Any other time run `gulp`. [Gulp](https://gulpjs.com/) provides automatic server and frontend restarts after local file changes
  + For a cleaner command line, it helps if you add the clearing command of your OS first, then command separator, and THEN `gulp`
    * Clearing: `cls` on Windows, `clear` on Unix
    * Separators: `;` or `&&`
