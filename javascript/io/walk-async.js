const fs = require('fs');
const path = require('path');


function walk(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        return reject(error);
      }
      Promise.all(files.map((file) => {
        return new Promise((resolve, reject) => {
          const filepath = path.join(dir, file);
          fs.stat(filepath, (error, stats) => {
            if (error) {
              return reject(error);
            }
            if (stats.isDirectory()) {
              walk(filepath).then(resolve);
            } else if (stats.isFile()) {
              resolve(filepath);
            }
          });
        });
      }))
      .then(foldersContents => {
        resolve(foldersContents.reduce(
                  (all, folderContents) => all.concat(folderContents), 
               []));
      });
    });
  });
}

walk('/home/pauek/src/bash')
   .then(filelist => console.log(filelist));
